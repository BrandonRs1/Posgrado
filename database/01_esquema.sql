-- =====================================================================
-- Evaluación de Posgrados — 01_esquema.sql
-- PostgreSQL 15 o más nuevo. Tablas, catálogos, vistas y validaciones.
-- (La seguridad por usuario va en 02_seguridad.sql)
-- =====================================================================

create extension if not exists citext;

-- ---------- Tipos ----------
create type tipo_usuario        as enum ('profesor', 'alumno', 'administrativo');
create type rol_profesor        as enum ('propedeutico', 'entrevistador', 'asesor');
create type puesto_admin        as enum ('secretaria', 'coordinador');
create type estatus_alumno      as enum ('aspirante', 'aceptado', 'rechazado');
create type estatus_revision    as enum ('pendiente', 'aprobado', 'rechazado');
create type estatus_curso       as enum ('abierto', 'cerrado');
create type estatus_inscripcion as enum ('cursando', 'aprobado', 'reprobado');

-- ---------- Función genérica: fecha de última modificación ----------
create function tocar_actualizado_en() returns trigger
language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end $$;

-- =====================================================================
-- PERSONAS
-- =====================================================================
create table usuarios (
  id               uuid primary key default gen_random_uuid(),
  auth_uid         uuid unique,   -- enlaza con el sistema de login (no guardamos contraseñas aquí)
  tipo             tipo_usuario not null,
  nombre           text   not null check (length(trim(nombre)) > 0),
  apellido_paterno text   not null check (length(trim(apellido_paterno)) > 0),
  apellido_materno text,
  correo           citext not null unique
                   check (correo ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  telefono         text   not null check (telefono ~ '^[0-9+() -]{7,20}$'),
  activo           boolean not null default true,
  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),
  unique (id, tipo)            -- permite que cada subtipo "amarre" su tipo
);
create trigger usuarios_actualizado before update on usuarios
  for each row execute function tocar_actualizado_en();

-- Cada persona es de UN solo tipo (la llave compuesta lo garantiza)
create table profesores (
  usuario_id uuid primary key,
  tipo       tipo_usuario not null default 'profesor' check (tipo = 'profesor'),
  foreign key (usuario_id, tipo) references usuarios (id, tipo) on delete cascade
);

-- Un profesor puede tener varios roles (ej. entrevistador y asesor)
create table profesor_roles (
  usuario_id uuid not null references profesores (usuario_id) on delete cascade,
  rol        rol_profesor not null,
  primary key (usuario_id, rol)
);

create table administrativos (
  usuario_id uuid primary key,
  tipo       tipo_usuario not null default 'administrativo' check (tipo = 'administrativo'),
  puesto     puesto_admin not null,
  foreign key (usuario_id, tipo) references usuarios (id, tipo) on delete cascade
);

create table alumnos (
  usuario_id       uuid primary key,
  tipo             tipo_usuario not null default 'alumno' check (tipo = 'alumno'),
  estatus          estatus_alumno not null default 'aspirante',
  fecha_aceptacion date,
  foreign key (usuario_id, tipo) references usuarios (id, tipo) on delete cascade,
  check ((estatus = 'aceptado') = (fecha_aceptacion is not null))
);

-- =====================================================================
-- DOCUMENTOS DEL EXPEDIENTE
-- =====================================================================
create table tipos_documento (
  id                smallint generated always as identity primary key,
  codigo            text not null unique,
  nombre            text not null,
  formato           text not null default 'pdf'
                    check (formato in ('pdf', 'imagen', 'pdf_o_imagen')),
  requiere_vigencia boolean not null default false,
  vigencia_meses    smallint check (vigencia_meses > 0),
  check (not requiere_vigencia or vigencia_meses is not null)
);

-- Qué documentos se piden en cada etapa
create table requisitos_documento (
  etapa             estatus_alumno not null check (etapa in ('aspirante', 'aceptado')),
  tipo_documento_id smallint not null references tipos_documento (id),
  primary key (etapa, tipo_documento_id)
);

-- Los archivos NO se guardan en la BD: solo su ruta dentro de un bucket PRIVADO
create table documentos_alumno (
  id                uuid primary key default gen_random_uuid(),
  alumno_id         uuid not null references alumnos (usuario_id) on delete cascade,
  tipo_documento_id smallint not null references tipos_documento (id),
  ruta_archivo      text not null,
  nombre_original   text,
  mime_type         text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  tamano_bytes      integer not null check (tamano_bytes > 0 and tamano_bytes <= 10485760),  -- máx. 10 MB
  sha256            text check (sha256 ~ '^[0-9a-f]{64}$'),
  fecha_emision     date,            -- obligatoria cuando el documento tiene vigencia (TOEFL)
  estatus           estatus_revision not null default 'pendiente',
  revisado_por      uuid references administrativos (usuario_id),
  revisado_en       timestamptz,
  observaciones     text,
  subido_en         timestamptz not null default now(),
  reemplazado_en    timestamptz      -- si no es null, ya hay una versión más nueva
);
-- Solo una versión "actual" por alumno y tipo de documento
create unique index ux_documento_actual
  on documentos_alumno (alumno_id, tipo_documento_id) where reemplazado_en is null;
create index ix_documentos_alumno on documentos_alumno (alumno_id);

create function documentos_validar() returns trigger
language plpgsql as $$
declare t tipos_documento%rowtype;
begin
  select * into t from tipos_documento where id = new.tipo_documento_id;
  if t.formato = 'pdf' and new.mime_type <> 'application/pdf' then
    raise exception 'El documento "%" debe ser PDF', t.nombre;
  end if;
  if t.formato = 'imagen' and new.mime_type not in ('image/jpeg', 'image/png') then
    raise exception 'El documento "%" debe ser una imagen', t.nombre;
  end if;
  if t.requiere_vigencia and new.fecha_emision is null then
    raise exception 'El documento "%" requiere fecha de emisión', t.nombre;
  end if;
  return new;
end $$;
create trigger documentos_validar_t before insert on documentos_alumno
  for each row execute function documentos_validar();

-- Al subir uno nuevo, el anterior queda como reemplazado (así el alumno no necesita permiso de editar)
create function documentos_reemplazar_anterior() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update documentos_alumno
     set reemplazado_en = now()
   where alumno_id = new.alumno_id
     and tipo_documento_id = new.tipo_documento_id
     and reemplazado_en is null;
  return new;
end $$;
create trigger documentos_reemplazar_t before insert on documentos_alumno
  for each row execute function documentos_reemplazar_anterior();

-- ---------- Datos iniciales (catálogo) ----------
insert into tipos_documento (codigo, nombre, formato, requiere_vigencia, vigencia_meses) values
  ('solicitud_ingreso',               'Solicitud de ingreso',                          'pdf',          false, null),
  ('certificado_calificaciones',      'Certificado de calificaciones',                 'pdf',          false, null),
  ('cedula_licenciatura',             'Cédula de licenciatura',                        'pdf',          false, null),
  ('ine',                             'Foto de la INE',                                'pdf_o_imagen', false, null),
  ('consentimiento_datos',            'Tabla de consentimiento de tratamiento de datos','pdf',         false, null),
  ('carta_aceptacion',                'Carta de aceptación',                           'pdf',          false, null),
  ('certificado_global_licenciatura', 'Certificado global de licenciatura',            'pdf',          false, null),
  ('toefl',                           'TOEFL',                                         'pdf',          true,  24),
  ('carta_exclusividad',              'Carta de exclusividad (SECIHTI)',               'pdf',          false, null);

insert into requisitos_documento (etapa, tipo_documento_id)
select 'aspirante', id from tipos_documento
 where codigo in ('solicitud_ingreso', 'certificado_calificaciones', 'cedula_licenciatura', 'ine');

insert into requisitos_documento (etapa, tipo_documento_id)
select 'aceptado', id from tipos_documento
 where codigo in ('consentimiento_datos', 'solicitud_ingreso', 'carta_aceptacion',
                  'cedula_licenciatura', 'certificado_global_licenciatura', 'ine',
                  'toefl', 'carta_exclusividad');

-- ---------- Vistas del expediente ----------
-- (security_invoker: la vista respeta los permisos de quien la consulta)
create view v_documentos_actuales with (security_invoker = true) as
select d.*,
       td.codigo as tipo_codigo,
       td.nombre as tipo_nombre,
       case when td.requiere_vigencia
            then (d.fecha_emision + make_interval(months => td.vigencia_meses))::date end as vence_el,
       case when td.requiere_vigencia
            then (d.fecha_emision + make_interval(months => td.vigencia_meses))::date >= current_date end as vigente
  from documentos_alumno d
  join tipos_documento td on td.id = d.tipo_documento_id
 where d.reemplazado_en is null;

-- Una fila por cada documento que se le pide a cada alumno, con su situación
create view v_expediente with (security_invoker = true) as
select a.usuario_id as alumno_id,
       td.codigo, td.nombre,
       case
         when da.id is null          then 'falta'
         when da.estatus = 'rechazado' then 'rechazado'
         when da.vigente is false    then 'vencido'
         when da.estatus = 'pendiente' then 'en_revision'
         else 'completo'
       end as situacion,
       da.vence_el
  from alumnos a
  join requisitos_documento r on r.etapa = a.estatus
  join tipos_documento td     on td.id = r.tipo_documento_id
  left join v_documentos_actuales da
         on da.alumno_id = a.usuario_id and da.tipo_documento_id = td.id;

-- =====================================================================
-- CURSO PROPEDÉUTICO
-- =====================================================================
create table cursos_propedeutico (
  id                 uuid primary key default gen_random_uuid(),
  clave              text not null unique,
  nombre             text not null,
  periodo            text not null,
  fecha_inicio       date not null,
  fecha_fin          date not null check (fecha_fin >= fecha_inicio),
  profesor_id        uuid not null,
  rol_profesor       rol_profesor not null default 'propedeutico' check (rol_profesor = 'propedeutico'),
  escala_max         numeric(5,2) not null default 10 check (escala_max > 0),
  minima_aprobatoria numeric(5,2) not null default 8  check (minima_aprobatoria >= 0),
  estatus            estatus_curso not null default 'abierto',
  creado_en          timestamptz not null default now(),
  check (minima_aprobatoria <= escala_max),
  -- el profesor DEBE tener el rol "propedeutico"
  foreign key (profesor_id, rol_profesor) references profesor_roles (usuario_id, rol)
);

create table inscripciones_propedeutico (
  id                 uuid primary key default gen_random_uuid(),
  curso_id           uuid not null references cursos_propedeutico (id),
  alumno_id          uuid not null references alumnos (usuario_id),
  calificacion_final numeric(5,2) check (calificacion_final >= 0),
  estatus            estatus_inscripcion not null default 'cursando',
  unique (curso_id, alumno_id),
  unique (id, curso_id)
);

-- Rubros del curso (ej. Examen 40 %, Tareas 20 %...)
create table evaluaciones_curso (
  id          uuid primary key default gen_random_uuid(),
  curso_id    uuid not null references cursos_propedeutico (id) on delete cascade,
  nombre      text not null,
  ponderacion numeric(5,2) not null check (ponderacion > 0 and ponderacion <= 100),
  orden       smallint not null default 1,
  unique (curso_id, nombre),
  unique (id, curso_id)
);

create table calificaciones (
  id             uuid primary key default gen_random_uuid(),
  curso_id       uuid not null,
  inscripcion_id uuid not null,
  evaluacion_id  uuid not null,
  calificacion   numeric(5,2) not null check (calificacion >= 0),
  actualizado_en timestamptz not null default now(),
  unique (inscripcion_id, evaluacion_id),
  -- inscripción y rubro tienen que ser del MISMO curso
  foreign key (inscripcion_id, curso_id) references inscripciones_propedeutico (id, curso_id),
  foreign key (evaluacion_id, curso_id)  references evaluaciones_curso (id, curso_id)
);

create table actas_calificaciones (
  id          uuid primary key default gen_random_uuid(),
  curso_id    uuid not null unique references cursos_propedeutico (id),
  folio       text not null unique,
  generada_por uuid not null references usuarios (id),
  generada_en timestamptz not null default now(),
  ruta_pdf    text,
  sha256      text check (sha256 ~ '^[0-9a-f]{64}$')
);
create sequence seq_folio_acta;

-- Valida la calificación y la "congela" cuando ya existe el acta
create function calificaciones_validar() returns trigger
language plpgsql as $$
declare v_escala numeric;
begin
  select curso_id into new.curso_id from inscripciones_propedeutico where id = new.inscripcion_id;
  if exists (select 1 from actas_calificaciones where curso_id = new.curso_id) then
    raise exception 'El acta de este curso ya fue generada: las calificaciones están cerradas';
  end if;
  select escala_max into v_escala from cursos_propedeutico where id = new.curso_id;
  if new.calificacion > v_escala then
    raise exception 'La calificación % excede la escala máxima del curso (%)', new.calificacion, v_escala;
  end if;
  new.actualizado_en := now();
  return new;
end $$;
create trigger calificaciones_validar_t before insert or update on calificaciones
  for each row execute function calificaciones_validar();

-- Promedio ponderado por alumno
create view v_calificacion_final with (security_invoker = true) as
select i.id as inscripcion_id, i.curso_id, i.alumno_id,
       round(sum(c.calificacion * e.ponderacion) / nullif(sum(e.ponderacion), 0), 2) as promedio,
       count(c.id) as evaluaciones_calificadas,
       count(e.id) as evaluaciones_total
  from inscripciones_propedeutico i
  join evaluaciones_curso e on e.curso_id = i.curso_id
  left join calificaciones c on c.inscripcion_id = i.id and c.evaluacion_id = e.id
 group by i.id;

-- Datos listos para llenar el acta (el PDF se genera con esto)
create view v_acta_datos with (security_invoker = true) as
select a.folio, a.generada_en,
       cu.clave, cu.nombre as curso, cu.periodo, cu.minima_aprobatoria,
       pu.nombre || ' ' || pu.apellido_paterno || coalesce(' ' || pu.apellido_materno, '') as profesor,
       au.apellido_paterno, au.apellido_materno, au.nombre as alumno_nombre, au.correo,
       i.calificacion_final, i.estatus
  from actas_calificaciones a
  join cursos_propedeutico cu on cu.id = a.curso_id
  join usuarios pu            on pu.id = cu.profesor_id
  join inscripciones_propedeutico i on i.curso_id = cu.id
  join usuarios au            on au.id = i.alumno_id
 order by au.apellido_paterno, au.apellido_materno, au.nombre;

-- =====================================================================
-- BITÁCORA (quién cambió qué; sin copiar datos personales)
-- =====================================================================
create table bitacora (
  id          bigint generated always as identity primary key,
  tabla       text not null,
  operacion   text not null,
  registro_id text,
  usuario_id  uuid,
  ocurrio_en  timestamptz not null default now()
);
