-- =====================================================================
-- Evaluación de Posgrados — 02_seguridad.sql
-- Permisos por usuario (RLS), acta automática, bitácora y archivos privados.
-- Escrito para Supabase (usa auth.uid()). Correr DESPUÉS de 01_esquema.sql.
-- =====================================================================

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- ---------- Funciones auxiliares (se ejecutan con permisos del dueño para evitar bucles de RLS) ----------
create function private.usuario_actual() returns uuid
language sql stable security definer set search_path = public as $$
  select id from usuarios where auth_uid = auth.uid() and activo
$$;

create function private.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from administrativos where usuario_id = private.usuario_actual())
$$;

create function private.es_coordinador() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from administrativos
                  where usuario_id = private.usuario_actual() and puesto = 'coordinador')
$$;

create function private.es_profesor_de(p_curso uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from cursos_propedeutico
                  where id = p_curso and profesor_id = private.usuario_actual())
$$;

create function private.esta_inscrito(p_curso uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from inscripciones_propedeutico
                  where curso_id = p_curso and alumno_id = private.usuario_actual())
$$;

create function private.es_mi_inscripcion(p_inscripcion uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from inscripciones_propedeutico
                  where id = p_inscripcion and alumno_id = private.usuario_actual())
$$;

create function private.curso_abierto(p_curso uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from cursos_propedeutico where id = p_curso and estatus = 'abierto')
$$;

-- ¿Este usuario es alumno de algún curso de mi profesor?
create function private.profesor_ve_a(p_usuario uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from inscripciones_propedeutico i
                   join cursos_propedeutico c on c.id = i.curso_id
                  where i.alumno_id = p_usuario and c.profesor_id = private.usuario_actual())
$$;

grant execute on all functions in schema private to authenticated;

-- ---------- Bitácora ----------
create function bitacora_registrar() returns trigger
language plpgsql security definer set search_path = public as $$
declare j jsonb := coalesce(to_jsonb(new), to_jsonb(old));
begin
  insert into bitacora (tabla, operacion, registro_id, usuario_id)
  values (tg_table_name, tg_op, coalesce(j ->> 'id', j ->> 'usuario_id'), private.usuario_actual());
  return null;
end $$;

create trigger bitacora_documentos  after insert or update or delete on documentos_alumno
  for each row execute function bitacora_registrar();
create trigger bitacora_calificaciones after insert or update or delete on calificaciones
  for each row execute function bitacora_registrar();
create trigger bitacora_alumnos     after update or delete on alumnos
  for each row execute function bitacora_registrar();
create trigger bitacora_actas       after insert on actas_calificaciones
  for each row execute function bitacora_registrar();

-- ---------- Acta automática ----------
-- El profesor (o un administrativo) llama: select generar_acta('<id del curso>');
-- Calcula finales, marca aprobado/reprobado, crea el acta con folio y CIERRA el curso.
create function generar_acta(p_curso uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_curso    cursos_propedeutico%rowtype;
  v_usuario  uuid := private.usuario_actual();
  v_faltan   int;
  v_suma     numeric;
  v_acta     uuid;
begin
  select * into v_curso from cursos_propedeutico where id = p_curso;
  if not found then raise exception 'Curso no encontrado'; end if;
  if not (private.es_admin() or v_curso.profesor_id = v_usuario) then
    raise exception 'No tienes permiso para generar el acta de este curso';
  end if;
  if v_curso.estatus <> 'abierto' then raise exception 'El curso ya está cerrado'; end if;

  select coalesce(sum(ponderacion), 0) into v_suma from evaluaciones_curso where curso_id = p_curso;
  if v_suma <> 100 then
    raise exception 'Las ponderaciones del curso suman % (deben sumar 100)', v_suma;
  end if;
  if not exists (select 1 from inscripciones_propedeutico where curso_id = p_curso) then
    raise exception 'El curso no tiene alumnos inscritos';
  end if;

  select count(*) into v_faltan
    from inscripciones_propedeutico i
    join evaluaciones_curso e on e.curso_id = i.curso_id
   where i.curso_id = p_curso
     and not exists (select 1 from calificaciones c
                      where c.inscripcion_id = i.id and c.evaluacion_id = e.id);
  if v_faltan > 0 then
    raise exception 'Faltan % calificaciones por capturar', v_faltan;
  end if;

  update inscripciones_propedeutico i
     set calificacion_final = f.promedio,
         estatus = case when f.promedio >= v_curso.minima_aprobatoria
                        then 'aprobado'::estatus_inscripcion
                        else 'reprobado'::estatus_inscripcion end
    from v_calificacion_final f
   where f.inscripcion_id = i.id and i.curso_id = p_curso;

  insert into actas_calificaciones (curso_id, folio, generada_por)
  values (p_curso,
          'ACT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('seq_folio_acta')::text, 4, '0'),
          v_usuario)
  returning id into v_acta;

  update cursos_propedeutico set estatus = 'cerrado' where id = p_curso;
  return v_acta;
end $$;
revoke all on function generar_acta(uuid) from public, anon;
grant execute on function generar_acta(uuid) to authenticated;

-- =====================================================================
-- PERMISOS BASE: nadie anónimo; los usuarios logueados solo lo mínimo
-- =====================================================================
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

grant select on all tables in schema public to authenticated;
grant insert, update, delete on usuarios, profesores, profesor_roles, administrativos,
                                alumnos, cursos_propedeutico, inscripciones_propedeutico,
                                tipos_documento, requisitos_documento to authenticated;
grant insert on documentos_alumno to authenticated;
grant update (estatus, revisado_por, revisado_en, observaciones) on documentos_alumno to authenticated;
grant insert, update, delete on evaluaciones_curso to authenticated;
grant insert on calificaciones to authenticated;
grant update (calificacion) on calificaciones to authenticated;
-- actas: solo se crean con generar_acta(); bitácora: solo la llenan los triggers

-- =====================================================================
-- ROW LEVEL SECURITY: qué filas ve/edita cada quien
-- =====================================================================
alter table usuarios                   enable row level security;
alter table profesores                 enable row level security;
alter table profesor_roles             enable row level security;
alter table administrativos            enable row level security;
alter table alumnos                    enable row level security;
alter table tipos_documento            enable row level security;
alter table requisitos_documento       enable row level security;
alter table documentos_alumno          enable row level security;
alter table cursos_propedeutico        enable row level security;
alter table inscripciones_propedeutico enable row level security;
alter table evaluaciones_curso         enable row level security;
alter table calificaciones             enable row level security;
alter table actas_calificaciones       enable row level security;
alter table bitacora                   enable row level security;

-- Personas
create policy usuarios_ver on usuarios for select to authenticated
  using (id = private.usuario_actual() or private.es_admin() or private.profesor_ve_a(id));
create policy usuarios_admin on usuarios for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

create policy profesores_ver on profesores for select to authenticated
  using (usuario_id = private.usuario_actual() or private.es_admin());
create policy profesores_admin on profesores for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

create policy roles_ver on profesor_roles for select to authenticated
  using (usuario_id = private.usuario_actual() or private.es_admin());
create policy roles_admin on profesor_roles for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

-- Solo el coordinador ve y maneja a los administrativos
create policy admins_ver on administrativos for select to authenticated
  using (usuario_id = private.usuario_actual() or private.es_coordinador());
create policy admins_coordinador on administrativos for all to authenticated
  using (private.es_coordinador()) with check (private.es_coordinador());

create policy alumnos_ver on alumnos for select to authenticated
  using (usuario_id = private.usuario_actual() or private.es_admin() or private.profesor_ve_a(usuario_id));
create policy alumnos_admin on alumnos for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

-- Catálogos: todos leen, solo el coordinador cambia
create policy tipos_ver on tipos_documento for select to authenticated using (true);
create policy tipos_coordinador on tipos_documento for all to authenticated
  using (private.es_coordinador()) with check (private.es_coordinador());
create policy requisitos_ver on requisitos_documento for select to authenticated using (true);
create policy requisitos_coordinador on requisitos_documento for all to authenticated
  using (private.es_coordinador()) with check (private.es_coordinador());

-- Documentos: SOLO el alumno dueño y los administrativos (los profesores NO los ven)
create policy docs_ver on documentos_alumno for select to authenticated
  using (alumno_id = private.usuario_actual() or private.es_admin());
create policy docs_subir_alumno on documentos_alumno for insert to authenticated
  with check (alumno_id = private.usuario_actual()
              and estatus = 'pendiente' and revisado_por is null and revisado_en is null
              and reemplazado_en is null);
create policy docs_subir_admin on documentos_alumno for insert to authenticated
  with check (private.es_admin());
create policy docs_revisar on documentos_alumno for update to authenticated
  using (private.es_admin()) with check (private.es_admin());

-- Propedéutico
create policy cursos_ver on cursos_propedeutico for select to authenticated
  using (private.es_admin() or profesor_id = private.usuario_actual() or private.esta_inscrito(id));
create policy cursos_admin on cursos_propedeutico for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

create policy inscr_ver on inscripciones_propedeutico for select to authenticated
  using (private.es_admin() or alumno_id = private.usuario_actual() or private.es_profesor_de(curso_id));
create policy inscr_admin on inscripciones_propedeutico for all to authenticated
  using (private.es_admin()) with check (private.es_admin());

create policy eval_ver on evaluaciones_curso for select to authenticated
  using (private.es_admin() or private.es_profesor_de(curso_id) or private.esta_inscrito(curso_id));
create policy eval_profesor on evaluaciones_curso for all to authenticated
  using ((private.es_profesor_de(curso_id) or private.es_admin()) and private.curso_abierto(curso_id))
  with check ((private.es_profesor_de(curso_id) or private.es_admin()) and private.curso_abierto(curso_id));

-- El alumno ve sus calificaciones hasta que el curso se cierra
create policy calif_ver on calificaciones for select to authenticated
  using (private.es_admin() or private.es_profesor_de(curso_id)
         or (private.es_mi_inscripcion(inscripcion_id) and not private.curso_abierto(curso_id)));
create policy calif_insertar on calificaciones for insert to authenticated
  with check (private.es_profesor_de(curso_id) and private.curso_abierto(curso_id));
create policy calif_editar on calificaciones for update to authenticated
  using (private.es_profesor_de(curso_id) and private.curso_abierto(curso_id))
  with check (private.es_profesor_de(curso_id) and private.curso_abierto(curso_id));

create policy actas_ver on actas_calificaciones for select to authenticated
  using (private.es_admin() or private.es_profesor_de(curso_id));

create policy bitacora_ver on bitacora for select to authenticated
  using (private.es_coordinador());

-- =====================================================================
-- ARCHIVOS PRIVADOS (Supabase Storage) — ruta: <alumno_id>/<tipo>/<archivo>
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos', 'documentos', false, 10485760,
        array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = false;

create policy storage_ver on storage.objects for select to authenticated
  using (bucket_id = 'documentos'
         and ((storage.foldername(name))[1] = private.usuario_actual()::text or private.es_admin()));
create policy storage_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos'
              and ((storage.foldername(name))[1] = private.usuario_actual()::text or private.es_admin()));
