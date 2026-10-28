-- =====================================================================
-- Evaluación de Posgrados — 03_credencial.sql
-- Credencial: foto de perfil, número de aspirante / control y posgrado.
-- Correr DESPUÉS de 01 y 02.
-- =====================================================================

-- ---------- Catálogo de posgrados ----------
create table posgrados (
  id     smallint generated always as identity primary key,
  clave  text not null unique,
  nombre text not null,
  activo boolean not null default true
);

-- ---------- Campos nuevos ----------
alter table usuarios add column foto_ruta text;   -- ruta dentro del bucket privado "fotos"

alter table alumnos
  add column numero_aspirante text unique,
  add column numero_control   text unique,
  add column posgrado_id      smallint references posgrados (id);

-- Número de aspirante: se genera solo (ej. ASP-2026-0001). Se puede cambiar a mano si tu institución usa otro formato.
create sequence seq_numero_aspirante;

update alumnos
   set numero_aspirante = 'ASP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('seq_numero_aspirante')::text, 4, '0')
 where numero_aspirante is null;

create function alumnos_asignar_numero_aspirante() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.numero_aspirante is null then
    new.numero_aspirante := 'ASP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('seq_numero_aspirante')::text, 4, '0');
  end if;
  return new;
end $$;
create trigger alumnos_numero_aspirante_t before insert on alumnos
  for each row execute function alumnos_asignar_numero_aspirante();

-- Para aceptar a alguien hay que darle número de control y posgrado
-- (NOT VALID: no revisa filas viejas, solo las nuevas o modificadas)
alter table alumnos add constraint alumnos_aceptado_datos
  check (estatus <> 'aceptado' or (numero_control is not null and posgrado_id is not null)) not valid;

-- ---------- Permisos del catálogo ----------
alter table posgrados enable row level security;
revoke all on posgrados from anon, authenticated;
grant select on posgrados to authenticated;
grant insert, update, delete on posgrados to authenticated;

create policy posgrados_ver on posgrados for select to authenticated using (true);
create policy posgrados_coordinador on posgrados for all to authenticated
  using (private.es_coordinador()) with check (private.es_coordinador());

-- ---------- Foto de perfil ----------
-- Cada usuario solo puede cambiar SU foto (y solo apuntando a su propia carpeta)
create function actualizar_mi_foto(p_ruta text) returns void
language plpgsql security definer set search_path = public as $$
declare v_id uuid := private.usuario_actual();
begin
  if v_id is null then
    raise exception 'Sin sesión válida';
  end if;
  if p_ruta is not null and (p_ruta !~ '^[0-9a-f-]{36}/[A-Za-z0-9._-]+$'
                             or split_part(p_ruta, '/', 1) <> v_id::text) then
    raise exception 'La foto debe estar en tu propia carpeta';
  end if;
  update usuarios set foto_ruta = p_ruta where id = v_id;
end $$;
revoke all on function actualizar_mi_foto(text) from public, anon;
grant execute on function actualizar_mi_foto(text) to authenticated;

-- Bucket privado para fotos (máx. 2 MB). Ruta: <usuario_id>/<archivo>.jpg
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false;

create policy fotos_ver on storage.objects for select to authenticated
  using (bucket_id = 'fotos'
         and ((storage.foldername(name))[1] = private.usuario_actual()::text or private.es_admin()));
create policy fotos_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos'
              and (storage.foldername(name))[1] = private.usuario_actual()::text);
create policy fotos_borrar on storage.objects for delete to authenticated
  using (bucket_id = 'fotos'
         and (storage.foldername(name))[1] = private.usuario_actual()::text);
