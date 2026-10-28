-- =====================================================================
-- Evaluación de Posgrados — 04_buzon_y_anuncios.sql
-- Módulo de Buzón de Mensajes Directos y Tablón de Anuncios Oficiales
-- Correr DESPUÉS de 01, 02 y 03 en el SQL Editor de Supabase.
-- =====================================================================

-- ---------- 1. TABLA: ANUNCIOS OFICIALES ----------
create table if not exists anuncios (
  id             bigint generated always as identity primary key,
  titulo         text not null,
  contenido      text not null,
  categoria      text not null default 'general' check (categoria in ('general', 'convocatoria', 'academico', 'urgente')),
  importante     boolean not null default false,
  dirigido_a     text not null default 'todos' check (dirigido_a in ('todos', 'aspirantes', 'aceptados')),
  autor_id       uuid not null references usuarios (id) on delete cascade,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- ---------- 2. TABLA: BUZÓN DE MENSAJES DIRECTOS ----------
create table if not exists mensajes_buzon (
  id              bigint generated always as identity primary key,
  remitente_id    uuid not null references usuarios (id) on delete cascade,
  destinatario_id uuid not null references usuarios (id) on delete cascade,
  asunto          text not null,
  mensaje         text not null,
  leido           boolean not null default false,
  leido_en        timestamptz,
  creado_en       timestamptz not null default now()
);

-- Índices para consultas rápidas en el inicio
create index if not exists idx_anuncios_fecha on anuncios (creado_en desc);
create index if not exists idx_anuncios_dirigido on anuncios (dirigido_a);
create index if not exists idx_mensajes_destinatario on mensajes_buzon (destinatario_id, leido, creado_en desc);
create index if not exists idx_mensajes_remitente on mensajes_buzon (remitente_id);

-- ---------- 3. SEGURIDAD (ROW LEVEL SECURITY) ----------
alter table anuncios enable row level security;
alter table mensajes_buzon enable row level security;

-- Permisos básicos de acceso para usuarios autenticados
grant select on anuncios to authenticated;
grant select, update on mensajes_buzon to authenticated;
grant insert on mensajes_buzon to authenticated;

-- Políticas de ANUNCIOS:
-- Todos los usuarios autenticados pueden ver los anuncios dirigidos a ellos
drop policy if exists "anuncios_lectura" on anuncios;
create policy "anuncios_lectura" on anuncios
  for select to authenticated
  using (true);

-- Solo administradores pueden crear o modificar anuncios
drop policy if exists "anuncios_gestion_admin" on anuncios;
create policy "anuncios_gestion_admin" on anuncios
  for all to authenticated
  using (
    exists (
      select 1 from usuarios u
      where u.auth_uid = auth.uid() and u.tipo = 'administrativo'
    )
  )
  with check (
    exists (
      select 1 from usuarios u
      where u.auth_uid = auth.uid() and u.tipo = 'administrativo'
    )
  );

-- Políticas de MENSAJES (BUZÓN):
-- El usuario solo ve los mensajes donde es destinatario o remitente
drop policy if exists "mensajes_lectura" on mensajes_buzon;
create policy "mensajes_lectura" on mensajes_buzon
  for select to authenticated
  using (
    destinatario_id = (select id from usuarios where auth_uid = auth.uid()) or
    remitente_id    = (select id from usuarios where auth_uid = auth.uid())
  );

-- El destinatario puede marcar su mensaje como leído
drop policy if exists "mensajes_actualizar_leido" on mensajes_buzon;
create policy "mensajes_actualizar_leido" on mensajes_buzon
  for update to authenticated
  using (destinatario_id = (select id from usuarios where auth_uid = auth.uid()))
  with check (destinatario_id = (select id from usuarios where auth_uid = auth.uid()));

-- Profesores y administrativos pueden enviar mensajes a alumnos y aspirantes
drop policy if exists "mensajes_envio_docentes_admin" on mensajes_buzon;
create policy "mensajes_envio_docentes_admin" on mensajes_buzon
  for insert to authenticated
  with check (
    remitente_id = (select id from usuarios where auth_uid = auth.uid()) and
    exists (
      select 1 from usuarios u
      where u.auth_uid = auth.uid() and u.tipo in ('profesor', 'administrativo')
    )
  );

-- ---------- 4. DATOS INICIALES / EJEMPLOS DE PRUEBA ----------
-- Inserta anuncios institucionales si existe al menos un usuario administrativo
do $$
declare
  v_admin_id uuid;
  v_prof_id  uuid;
  v_alumno_id uuid;
begin
  select id into v_admin_id from usuarios where tipo = 'administrativo' limit 1;
  select id into v_prof_id  from usuarios where tipo = 'profesor' limit 1;
  select id into v_alumno_id from usuarios where tipo = 'alumno' limit 1;

  if v_admin_id is not null then
    insert into anuncios (titulo, contenido, categoria, importante, dirigido_a, autor_id, creado_en)
    values
      (
        'Publicación de Calendario Académico Semestral',
        'Se informa a toda la comunidad de posgrados que ya se encuentra disponible el calendario con fechas de evaluaciones, inscripciones y periodos vacacionales en el portal institucional.',
        'academico',
        false,
        'todos',
        v_admin_id,
        now() - interval '2 days'
      ),
      (
        'Convocatoria de Becas y Apoyos de Posgrado',
        'La Coordinación de Posgrado abre la recepción de solicitudes para becas de manutención y apoyo a proyectos de investigación. Consulta las bases en las oficinas de coordinación.',
        'convocatoria',
        true,
        'aceptados',
        v_admin_id,
        now() - interval '1 day'
      ),
      (
        'Aviso para Aspirantes: Entrega de Documentación Física',
        'Los aspirantes con estatus pendiente o en proceso deben presentar su documentación original cotejada en ventanilla antes de la fecha límite señalada en su convocatoria.',
        'urgente',
        true,
        'aspirantes',
        v_admin_id,
        now() - interval '4 hours'
      );
  end if;

  -- Inserta mensajes de bienvenida en el buzón si hay alumnos registrados
  if v_alumno_id is not null and (v_admin_id is not null or v_prof_id is not null) then
    insert into mensajes_buzon (remitente_id, destinatario_id, asunto, mensaje, leido, creado_en)
    values
      (
        coalesce(v_admin_id, v_prof_id),
        v_alumno_id,
        'Bienvenido al Sistema de Gestión de Posgrados',
        'Estimado estudiante, bienvenido a la plataforma. Por este medio recibirás notificaciones importantes de la coordinación y comunicados directos de tus profesores.',
        false,
        now() - interval '6 hours'
      ),
      (
        coalesce(v_prof_id, v_admin_id),
        v_alumno_id,
        'Seguimiento a tu Expediente Académico',
        'Hola. Te recordamos verificar que los datos de tu credencial digital y tus asignaturas registradas se encuentren actualizados. Cualquier duda quedamos a tu disposición.',
        false,
        now() - interval '1 day'
      );
  end if;
end $$;

