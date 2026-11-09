-- =============================================================================
-- Evaluación de Posgrados — 05_proceso_metalurgia_e_indicadores.sql
-- =============================================================================
-- Compatible al 100% con 01_esquema.sql, 02_seguridad.sql, 03_credencial.sql y 04_buzon_y_anuncios.sql.
-- Se puede ejecutar varias veces de forma segura (idempotente).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CREACIÓN DEL CATÁLOGO DE LOS 6 PROGRAMAS DE POSGRADO DEL ITM (Y PILOTO METALURGIA)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programas_posgrado (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave              TEXT NOT NULL UNIQUE,
  nombre             TEXT NOT NULL,
  descripcion        TEXT,
  escala_min         NUMERIC(5,2) NOT NULL DEFAULT 0,
  escala_max         NUMERIC(5,2) NOT NULL DEFAULT 100,
  minima_aprobatoria NUMERIC(5,2) NOT NULL DEFAULT 80,
  es_piloto          BOOLEAN NOT NULL DEFAULT false,
  activo             BOOLEAN NOT NULL DEFAULT true,
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.programas_posgrado (clave, nombre, descripcion, escala_min, escala_max, minima_aprobatoria, es_piloto)
VALUES
  ('MCM-ITM',  'Maestría en Ciencias en Metalurgia',             'Programa piloto del sistema en el Instituto Tecnológico de Morelia (TecNM).', 0, 100, 80, true),
  ('MCIE-ITM', 'Maestría en Ciencias en Ingeniería Eléctrica',   'Posgrado orientado a sistemas eléctricos de potencia y control (ITM).', 0, 100, 80, false),
  ('MCII-ITM', 'Maestría en Ciencias en Ingeniería Electrónica', 'Posgrado de investigación en electrónica de potencia y diseño digital (ITM).', 0, 100, 80, false),
  ('MSC-ITM',  'Maestría en Sistemas Computacionales',           'Posgrado en tecnologías de la información y cómputo (ITM).', 0, 100, 80, false),
  ('MIA-ITM',  'Maestría en Ingeniería Administrativa',          'Posgrado enfocado en gestión tecnológica y dirección de operaciones (ITM).', 0, 100, 80, false),
  ('DCIE-ITM', 'Doctorado en Ciencias de la Ingeniería',         'Programa doctoral institucional del Instituto Tecnológico de Morelia (ITM).', 0, 100, 80, false)
ON CONFLICT (clave) DO UPDATE
SET nombre             = EXCLUDED.nombre,
    descripcion        = EXCLUDED.descripcion,
    escala_min         = EXCLUDED.escala_min,
    escala_max         = EXCLUDED.escala_max,
    minima_aprobatoria = EXCLUDED.minima_aprobatoria,
    es_piloto          = EXCLUDED.es_piloto;

-- Ajustar cursos_propedeutico (de 01_esquema.sql) para usar escala 0..100 y mínima aprobatoria 80
ALTER TABLE public.cursos_propedeutico
  ALTER COLUMN escala_max SET DEFAULT 100,
  ALTER COLUMN minima_aprobatoria SET DEFAULT 80;

UPDATE public.cursos_propedeutico
SET escala_max = 100,
    minima_aprobatoria = 80
WHERE escala_max = 10 AND minima_aprobatoria = 8;

-- Enlazar alumnos opcionalmente a su programa de posgrado (por defecto Metalurgia si no se indica)
ALTER TABLE public.alumnos
  ADD COLUMN IF NOT EXISTS programa_id UUID REFERENCES public.programas_posgrado(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 2. AMPLIACIÓN DE TIPOS DE DOCUMENTO (EDB+KÁRDEX SEMESTRAL, TITULACIÓN, CARTAS)
--    Respeta la estructura exacta de tipos_documento y requisitos_documento en 01_esquema.sql
-- -----------------------------------------------------------------------------
ALTER TABLE public.tipos_documento
  ADD COLUMN IF NOT EXISTS tiene_plantilla BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS etapa_proceso TEXT DEFAULT 'admision';

UPDATE public.tipos_documento
SET tiene_plantilla = true
WHERE codigo IN ('solicitud_ingreso', 'consentimiento_datos', 'carta_exclusividad');

INSERT INTO public.tipos_documento (codigo, nombre, formato, requiere_vigencia, vigencia_meses, tiene_plantilla, etapa_proceso)
VALUES
  ('carta_no_aceptacion',      'Carta de no aceptación',                                                  'pdf', false, NULL, true,  'aspirante'),
  ('edb_kardex',               'EDB (Evaluación del Desempeño del Becario) con Kárdex actualizado',       'pdf', true,  6,    true,  'seguimiento_semestral'),
  ('seminario_semestral',      'Acta de revisión semestral con seminario',                                'pdf', true,  6,    false, 'seguimiento_semestral'),
  ('revision_tesis_1',         '1ra Revisión de tesis firmada por comité',                                'pdf', false, NULL, true,  'titulacion'),
  ('revision_tesis_2',         '2da Revisión de tesis',                                                   'pdf', false, NULL, true,  'titulacion'),
  ('tesis_final',              'Tesis digital versión final (con número de tesis asignado)',              'pdf', false, NULL, false, 'titulacion'),
  ('acta_grado',               'Solicitud y Acta de Grado (Trámite DEPI / Escolares)',                    'pdf', false, NULL, true,  'titulacion'),
  ('carta_retribucion_social', 'Carta de Retribución Social (SECIHTI)',                                   'pdf', false, NULL, true,  'titulacion')
ON CONFLICT (codigo) DO UPDATE
SET nombre          = EXCLUDED.nombre,
    tiene_plantilla = EXCLUDED.tiene_plantilla,
    etapa_proceso   = EXCLUDED.etapa_proceso;

-- Agregar a requisitos_documento para los alumnos con estatus 'aceptado'
INSERT INTO public.requisitos_documento (etapa, tipo_documento_id)
SELECT 'aceptado', id
FROM public.tipos_documento
WHERE codigo IN (
  'edb_kardex',
  'seminario_semestral',
  'revision_tesis_1',
  'revision_tesis_2',
  'tesis_final',
  'acta_grado',
  'carta_retribucion_social'
)
ON CONFLICT (etapa, tipo_documento_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. TABLA DE ENTREVISTAS Y DICTAMEN DE ACADEMIA (ETAPA 2: GESTIÓN OPERATIVA)
--    Referencia a public.alumnos(usuario_id) de 01_esquema.sql
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.entrevistas_aspirantes (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id               UUID NOT NULL REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  programa_id             UUID REFERENCES public.programas_posgrado(id) ON DELETE SET NULL,
  fecha_hora              TIMESTAMPTZ NOT NULL DEFAULT now(),
  aula_o_enlace           TEXT,
  comision_profesores     TEXT NOT NULL,
  comentarios_academia    TEXT,
  dictamen_academia       TEXT NOT NULL DEFAULT 'pendiente'
                          CHECK (dictamen_academia IN ('favorable', 'condicionado', 'no_favorable', 'pendiente')),
  calificacion_entrevista NUMERIC(5,2) CHECK (calificacion_entrevista >= 0 AND calificacion_entrevista <= 100),
  formato_dictamen_url    TEXT,
  creado_en               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 4. TABLA DE PONDERACIÓN DE ASPIRANTES (CALIFICACIÓN MÍNIMA APROBATORIA: 80)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ponderacion_admision (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id                 UUID NOT NULL UNIQUE REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  programa_id               UUID REFERENCES public.programas_posgrado(id) ON DELETE SET NULL,
  calificacion_propedeutico NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (calificacion_propedeutico >= 0 AND calificacion_propedeutico <= 100),
  calificacion_entrevista   NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (calificacion_entrevista >= 0 AND calificacion_entrevista <= 100),
  calificacion_expediente   NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (calificacion_expediente >= 0 AND calificacion_expediente <= 100),
  promedio_ponderado        NUMERIC(5,2) GENERATED ALWAYS AS (
    ROUND((calificacion_propedeutico * 0.50) + (calificacion_entrevista * 0.30) + (calificacion_expediente * 0.20), 2)
  ) STORED,
  aprobado_minimo_80        BOOLEAN GENERATED ALWAYS AS (
    ((calificacion_propedeutico * 0.50) + (calificacion_entrevista * 0.30) + (calificacion_expediente * 0.20)) >= 80.00
  ) STORED,
  dictamen_consejo          TEXT NOT NULL DEFAULT 'en_revision'
                            CHECK (dictamen_consejo IN ('aceptado', 'no_aceptado', 'en_revision')),
  enviado_a_depi            BOOLEAN NOT NULL DEFAULT false,
  fecha_envio_depi          DATE,
  carta_emitida             BOOLEAN NOT NULL DEFAULT false,
  observaciones             TEXT,
  actualizado_en            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 5. ASIGNACIÓN Y NOTIFICACIÓN DE ASESOR DE TESIS (ETAPA 3)
--    Referencia a public.alumnos(usuario_id) y public.profesores(usuario_id)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.asignacion_asesor (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id           UUID NOT NULL UNIQUE REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  asesor_profesor_id  UUID NOT NULL REFERENCES public.profesores(usuario_id) ON DELETE RESTRICT,
  coasesor_id         UUID REFERENCES public.profesores(usuario_id) ON DELETE SET NULL,
  tema_tesis          TEXT NOT NULL,
  linea_investigacion TEXT,
  notificado_alumno   BOOLEAN NOT NULL DEFAULT false,
  notificado_asesor   BOOLEAN NOT NULL DEFAULT false,
  fecha_asignacion    DATE NOT NULL DEFAULT CURRENT_DATE
);

-- -----------------------------------------------------------------------------
-- 6. SEGUIMIENTO DEL PROCESO DE TITULACIÓN (ETAPA 4 COMPLETA)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proceso_titulacion (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id                  UUID NOT NULL UNIQUE REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  expediente_revisado        BOOLEAN NOT NULL DEFAULT false,
  primera_revision_firmada   BOOLEAN NOT NULL DEFAULT false,
  fecha_primera_revision     DATE,
  segunda_revision_aprobada  BOOLEAN NOT NULL DEFAULT false,
  fecha_segunda_revision     DATE,
  numero_tesis_asignado      TEXT UNIQUE,
  tesis_digital_final_url    TEXT,
  fecha_recepcion_tesis      DATE,
  tramite_depi_escolares     TEXT NOT NULL DEFAULT 'pendiente'
                             CHECK (tramite_depi_escolares IN ('pendiente', 'en_tramite', 'validado')),
  acta_grado_solicitada      BOOLEAN NOT NULL DEFAULT false,
  fecha_examen_grado         DATE,
  carta_retribucion_generada BOOLEAN NOT NULL DEFAULT false,
  estatus_titulacion         TEXT NOT NULL DEFAULT 'en_proceso'
                             CHECK (estatus_titulacion IN ('en_proceso', 'listo_para_defensa', 'titulado')),
  actualizado_en             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 7. LOS 11 INDICADORES SUBRAYADOS EN VERDE (#66FF66) DEL EXCEL DE VALIDACIÓN
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.indicadores_posgrado (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo               TEXT NOT NULL UNIQUE,
  dimension            TEXT NOT NULL,
  nombre               TEXT NOT NULL,
  v_aiken              NUMERIC(4,3) NOT NULL,
  es_verde_prioritario BOOLEAN NOT NULL DEFAULT true,
  formula_calculo      TEXT DEFAULT 'Pendiente de definir por el usuario',
  variables_requeridas TEXT,
  periodicidad         TEXT NOT NULL DEFAULT 'Semestral / Anual',
  unidad_medida        TEXT NOT NULL DEFAULT 'Número / Porcentaje',
  valor_actual         NUMERIC(10,2) DEFAULT 0,
  meta_institucional   NUMERIC(10,2) DEFAULT 0,
  orden                INT NOT NULL
);

INSERT INTO public.indicadores_posgrado
  (codigo, dimension, nombre, v_aiken, es_verde_prioritario, unidad_medida, variables_requeridas, orden)
VALUES
  ('IND-V01', 'Eficiencia operativa',
   'Número de proyectos de investigación científica, desarrollo tecnológico e innovación financiados',
   0.650, true, 'Proyectos financiados',
   'Proyectos activos con financiamiento externo o interno TecNM/SECIHTI por periodo', 1),

  ('IND-V02', 'Eficiencia operativa',
   'Número de académicos que participan en redes de investigación, científica y tecnológica (Posgrado)',
   0.700, true, 'Académicos en redes',
   'Profesores del Núcleo Académico Básico (NAB) con membresía activa en redes nacionales/internacionales', 2),

  ('IND-V03', 'Toma de decisiones',
   'Académicos participantes en convocatorias en materia de investigación (Posgrado)',
   0.750, true, 'Académicos participantes',
   'Total de docentes del posgrado que sometieron propuestas en convocatorias de investigación', 3),

  ('IND-V04', 'Toma de decisiones',
   'Estudiantes participantes en convocatorias en materia de investigación (Posgrado)',
   0.750, true, 'Estudiantes participantes',
   'Alumnos del posgrado postulados o participando en convocatorias científicas/tecnológicas', 4),

  ('IND-V05', 'Toma de decisiones',
   'Número de estudiantes beneficiados con una beca (Posgrado)',
   0.825, true, 'Becarios activos',
   'Estudiantes matriculados con beca vigente (SECIHTI / CONAHCYT / Institucional)', 5),

  ('IND-V06', 'Toma de decisiones',
   'Tasa de variación de académicos registrados en el SNI',
   0.850, true, 'Porcentaje (%)',
   'Docentes en SNI en periodo actual vs. docentes en SNI en periodo anterior', 6),

  ('IND-V07', 'Toma de decisiones',
   'Número de estudiantes de posgrado que participan en proyectos de investigación',
   0.675, true, 'Estudiantes en proyectos',
   'Alumnos vinculados formalmente a un proyecto de investigación registrado', 7),

  ('IND-V08', 'Toma de decisiones',
   'Número de artículos de investigación de académicos publicados en revistas indexadas nacionales e internacionales como parte del TecNM',
   0.825, true, 'Artículos publicados (JCR/Scopus/Indexadas)',
   'Publicaciones con adscripción TecNM / ITM de profesores y alumnos del posgrado', 8),

  ('IND-V09', 'Toma de decisiones',
   'Número de estudiantes que participan en programas de intercambio académico nacional e internacional (Posgrado)',
   0.700, true, 'Estudiantes en movilidad',
   'Alumnos con estancia de investigación o movilidad nacional/internacional en el periodo', 9),

  ('IND-V10', 'Toma de decisiones',
   'Porcentaje de proyectos de investigación con enfoque en inclusión, igualdad y desarrollo sustentable',
   0.525, true, 'Porcentaje (%)',
   'Proyectos con impacto social/sustentable respecto al total de proyectos vigentes', 10),

  ('IND-V11', 'Mejora continua',
   'Número de nuevos programas de posgrado autorizados',
   0.525, true, 'Programas autorizados',
   'Nuevos planes de posgrado avalados por TecNM y registrados ante SECIHTI/SNP', 11)
ON CONFLICT (codigo) DO UPDATE
SET dimension            = EXCLUDED.dimension,
    nombre               = EXCLUDED.nombre,
    v_aiken              = EXCLUDED.v_aiken,
    unidad_medida        = EXCLUDED.unidad_medida,
    variables_requeridas = EXCLUDED.variables_requeridas,
    orden                = EXCLUDED.orden;

-- -----------------------------------------------------------------------------
-- 8. EXPEDIENTE DE INDICADORES POR ALUMNO (PARA CALCULAR LOS INDICADORES VERDES)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.indicadores_expediente_alumno (
  id                               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id                        UUID NOT NULL UNIQUE REFERENCES public.alumnos(usuario_id) ON DELETE CASCADE,
  semestre_actual                  INT NOT NULL DEFAULT 1,
  tiene_beca_secihti               BOOLEAN NOT NULL DEFAULT false,
  cvu_secihti                      TEXT,
  participa_proyecto_investigacion BOOLEAN NOT NULL DEFAULT false,
  clave_proyecto                   TEXT,
  proyecto_financiado              BOOLEAN NOT NULL DEFAULT false,
  enfoque_sustentable_inclusion    BOOLEAN NOT NULL DEFAULT false,
  participa_convocatoria_inv       BOOLEAN NOT NULL DEFAULT false,
  nombre_convocatoria              TEXT,
  realizo_intercambio_academico    BOOLEAN NOT NULL DEFAULT false,
  institucion_intercambio          TEXT,
  articulos_publicados             INT NOT NULL DEFAULT 0,
  trabaja_en_su_area_egreso        BOOLEAN,
  actualizado_en                   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 9. MÉTRICAS DE ACREDITACIÓN Y ENCUESTAS LIKERT (BLABLABLA.DOCX)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.informes_acreditacion (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  programa_id              UUID REFERENCES public.programas_posgrado(id) ON DELETE CASCADE,
  organismo_acreditador    TEXT NOT NULL DEFAULT 'SECIHTI / SNP',
  fecha_inicio_preparacion DATE NOT NULL,
  fecha_entrega_oficial    DATE,
  fecha_limite_entrega     DATE NOT NULL,
  dias_preparacion         INT GENERATED ALWAYS AS (
    CASE WHEN fecha_entrega_oficial IS NOT NULL THEN (fecha_entrega_oficial - fecha_inicio_preparacion) ELSE NULL END
  ) STORED,
  entregado_en_tiempo      BOOLEAN GENERATED ALWAYS AS (
    CASE WHEN fecha_entrega_oficial IS NOT NULL THEN (fecha_entrega_oficial <= fecha_limite_entrega) ELSE NULL END
  ) STORED,
  observaciones            TEXT
);

CREATE TABLE IF NOT EXISTS public.encuestas_transparencia_usabilidad (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id               UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  rol_respondiente         TEXT NOT NULL,
  consentimiento_informado BOOLEAN NOT NULL DEFAULT true,
  transparencia_percibida  INT NOT NULL CHECK (transparencia_percibida BETWEEN 1 AND 5),
  usabilidad_sistema       INT NOT NULL CHECK (usabilidad_sistema BETWEEN 1 AND 5),
  satisfaccion_general     INT NOT NULL CHECK (satisfaccion_general BETWEEN 1 AND 5),
  comentarios              TEXT,
  fecha_respuesta          TIMESTAMPTZ NOT NULL DEFAULT now()
);
