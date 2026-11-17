-- =============================================================================
-- Evaluación de Posgrados — 06_tesis_y_citas_asesoria.sql
-- =============================================================================
-- 1. Permisos para que el profesor/asesor pueda agregar y eliminar tesis de alumnos,
--    mientras que el alumno únicamente puede agregar documentos/tesis desde su dispositivo.
-- 2. Tabla citas_asesoria con flujo de aceptar/rechazar (con razón), reprogramar,
--    check de asistencia (con regla automática de 1 hora -> 'no_se_vieron') y
--    cancelación desde cualquiera de los dos lados con razón obligatoria.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PERMISOS DE PROFESOR / ASESOR SOBRE TESIS Y DOCUMENTOS DE ALUMNOS
-- -----------------------------------------------------------------------------
GRANT DELETE ON public.documentos_alumno TO authenticated;

-- El profesor/asesor o administrativo puede subir y eliminar la tesis de sus alumnos;
-- el alumno solo tiene política de INSERT (docs_subir_alumno en 02_seguridad.sql) y NUNCA de DELETE.
DROP POLICY IF EXISTS docs_profesor_subir_tesis ON public.documentos_alumno;
CREATE POLICY docs_profesor_subir_tesis ON public.documentos_alumno
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profesores p
      WHERE p.usuario_id = private.usuario_actual()
    )
    OR private.es_admin()
  );

DROP POLICY IF EXISTS docs_profesor_eliminar_tesis ON public.documentos_alumno;
CREATE POLICY docs_profesor_eliminar_tesis ON public.documentos_alumno
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profesores p
      WHERE p.usuario_id = private.usuario_actual()
    )
    OR private.es_admin()
  );

-- -----------------------------------------------------------------------------
-- 2. TABLA DE CITAS DE ASESORÍA DE TESIS (ALUMNO ↔ ASESOR)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.citas_asesoria (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id           UUID NOT NULL REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  asesor_id           UUID NOT NULL REFERENCES public.profesores(usuario_id) ON DELETE CASCADE,
  fecha_hora_cita     TIMESTAMPTZ NOT NULL,
  modalidad           TEXT NOT NULL DEFAULT 'Presencial · Cubículo de Asesoría',
  motivo              TEXT NOT NULL,
  solicitada_por      TEXT NOT NULL CHECK (solicitada_por IN ('alumno', 'asesor')),
  estatus             TEXT NOT NULL DEFAULT 'pendiente'
                      CHECK (estatus IN (
                        'pendiente',
                        'confirmada',
                        'rechazada',
                        'cancelada',
                        'asistieron',
                        'no_se_vieron'
                      )),
  motivo_rechazo      TEXT,
  rechazada_por       TEXT CHECK (rechazada_por IN ('alumno', 'asesor')),
  motivo_cancelacion  TEXT,
  cancelada_por       TEXT CHECK (cancelada_por IN ('alumno', 'asesor')),
  check_asistencia    BOOLEAN NOT NULL DEFAULT false,
  check_marcado_en    TIMESTAMPTZ,
  reprogramada_de_id  UUID REFERENCES public.citas_asesoria(id) ON DELETE SET NULL,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Validaciones de negocio:
  -- Si se rechaza, es obligatorio guardar la razón del rechazo.
  CONSTRAINT chk_razon_rechazo CHECK (
    estatus <> 'rechazada' OR (motivo_rechazo IS NOT NULL AND length(trim(motivo_rechazo)) > 0)
  ),
  -- Si se cancela por cualquiera de los dos lados, es obligatorio guardar la razón de cancelación.
  CONSTRAINT chk_razon_cancelacion CHECK (
    estatus <> 'cancelada' OR (motivo_cancelacion IS NOT NULL AND length(trim(motivo_cancelacion)) > 0)
  )
);

CREATE INDEX IF NOT EXISTS ix_citas_asesoria_alumno ON public.citas_asesoria(alumno_id, fecha_hora_cita DESC);
CREATE INDEX IF NOT EXISTS ix_citas_asesoria_asesor ON public.citas_asesoria(asesor_id, fecha_hora_cita DESC);

-- Función automática: si pasó más de 1 hora desde fecha_hora_cita y no se marcó el check,
-- cambia automáticamente el estatus a 'no_se_vieron'
CREATE OR REPLACE FUNCTION public.actualizar_citas_vencidas_sin_check()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.citas_asesoria
     SET estatus = 'no_se_vieron',
         actualizado_en = now()
   WHERE estatus = 'confirmada'
     AND check_asistencia = false
     AND now() > (fecha_hora_cita + interval '1 hour');
$$;

ALTER TABLE public.citas_asesoria ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.citas_asesoria TO authenticated;

DROP POLICY IF EXISTS citas_ver ON public.citas_asesoria;
CREATE POLICY citas_ver ON public.citas_asesoria
  FOR SELECT TO authenticated
  USING (
    alumno_id = private.usuario_actual()
    OR asesor_id = private.usuario_actual()
    OR private.es_admin()
  );

DROP POLICY IF EXISTS citas_agendar ON public.citas_asesoria;
CREATE POLICY citas_agendar ON public.citas_asesoria
  FOR INSERT TO authenticated
  WITH CHECK (
    alumno_id = private.usuario_actual()
    OR asesor_id = private.usuario_actual()
    OR private.es_admin()
  );

DROP POLICY IF EXISTS citas_actualizar ON public.citas_asesoria;
CREATE POLICY citas_actualizar ON public.citas_asesoria
  FOR UPDATE TO authenticated
  USING (
    alumno_id = private.usuario_actual()
    OR asesor_id = private.usuario_actual()
    OR private.es_admin()
  )
  WITH CHECK (
    alumno_id = private.usuario_actual()
    OR asesor_id = private.usuario_actual()
    OR private.es_admin()
  );

