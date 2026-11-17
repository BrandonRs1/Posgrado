-- =============================================================================
-- Evaluación de Posgrados — 06_tesis_y_citas_asesoria.sql
-- =============================================================================
-- Ejecuta este script en el SQL Editor de Supabase para habilitar:
-- 1. Sincronización entre diferentes PCs y cuentas (Alumno ↔ Profesor ↔ Coordinador)
--    para archivos PDF en el bucket 'documentos'.
-- 2. Estado compartido en tiempo real (estado_compartido_posgrado) y tabla citas_asesoria.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. AMPLIAR POLÍTICAS DE STORAGE EN BUCKET 'documentos' PARA SINCRONIZAR ENTRE PCs
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documentos', 'documentos', false, 10485760,
        array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = false;

drop policy if exists storage_posgrado_ver_todos on storage.objects;
create policy storage_posgrado_ver_todos on storage.objects
  for select to authenticated
  using (bucket_id = 'documentos');

drop policy if exists storage_posgrado_subir_todos on storage.objects;
create policy storage_posgrado_subir_todos on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documentos');

drop policy if exists storage_posgrado_actualizar_todos on storage.objects;
create policy storage_posgrado_actualizar_todos on storage.objects
  for update to authenticated
  using (bucket_id = 'documentos')
  with check (bucket_id = 'documentos');

drop policy if exists storage_posgrado_eliminar_prof_admin on storage.objects;
create policy storage_posgrado_eliminar_prof_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'documentos');

-- -----------------------------------------------------------------------------
-- 2. TABLA DE SINCRONIZACIÓN ENTRE DISPOSITIVOS (EXPEDIENTE, TESIS Y CITAS)
-- -----------------------------------------------------------------------------
create table if not exists public.estado_compartido_posgrado (
  clave          text primary key,
  datos          jsonb not null default '[]'::jsonb,
  actualizado_en timestamptz not null default now()
);

alter table public.estado_compartido_posgrado enable row level security;
grant select, insert, update, delete on public.estado_compartido_posgrado to authenticated;

drop policy if exists estado_compartido_lectura on public.estado_compartido_posgrado;
create policy estado_compartido_lectura on public.estado_compartido_posgrado
  for select to authenticated
  using (true);

drop policy if exists estado_compartido_escritura on public.estado_compartido_posgrado;
create policy estado_compartido_escritura on public.estado_compartido_posgrado
  for all to authenticated
  using (true)
  with check (true);

-- -----------------------------------------------------------------------------
-- 3. TABLA FORMAL DE CITAS DE ASESORÍA DE TESIS (ALUMNO ↔ ASESOR)
-- -----------------------------------------------------------------------------
create table if not exists public.citas_asesoria (
  id                  uuid primary key default gen_random_uuid(),
  alumno_id           uuid references public.alumnos(usuario_id) on delete cascade,
  asesor_id           uuid references public.profesores(usuario_id) on delete cascade,
  fecha_hora_cita     timestamptz not null,
  modalidad           text not null default 'Presencial · Cubículo de Asesoría',
  motivo              text not null,
  solicitada_por      text not null check (solicitada_por in ('alumno', 'asesor')),
  estatus             text not null default 'pendiente'
                      check (estatus in (
                        'pendiente',
                        'confirmada',
                        'rechazada',
                        'cancelada',
                        'asistieron',
                        'no_se_vieron'
                      )),
  motivo_rechazo      text,
  rechazada_por       text,
  motivo_cancelacion  text,
  cancelada_por       text,
  check_asistencia    boolean not null default false,
  check_marcado_en    timestamptz,
  reprogramada_de_id  uuid references public.citas_asesoria(id) on delete set null,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

alter table public.citas_asesoria enable row level security;
grant select, insert, update, delete on public.citas_asesoria to authenticated;

drop policy if exists citas_acceso_autenticados on public.citas_asesoria;
create policy citas_acceso_autenticados on public.citas_asesoria
  for all to authenticated
  using (true)
  with check (true);
