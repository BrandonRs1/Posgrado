import { useState } from "react";
import {
  Plus,
  Edit2,
  CheckCircle2,
  Calculator,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const INDICADORES_VERDES_DATA = [
  {
    id: "IND-V01",
    dimension: "Eficiencia operativa",
    nombre:
      "Número de proyectos de investigación científica, desarrollo tecnológico e innovación financiados",
    vAiken: "0.650",
    unidad: "Proyectos financiados",
    variables: "Proyectos activos con financiamiento interno/externo (TecNM, SECIHTI, industria)",
    formula: "Σ (Proyectos vigentes con financiamiento aprobado en el periodo)",
    meta: "≥ 8 proyectos por año",
  },
  {
    id: "IND-V02",
    dimension: "Eficiencia operativa",
    nombre:
      "Número de académicos que participan en redes de investigación, científica y tecnológica (Posgrado)",
    vAiken: "0.700",
    unidad: "Académicos en redes",
    variables: "Docentes del Núcleo Académico Básico (NAB) con membresía activa en redes",
    formula: "Σ (Académicos del posgrado con constancia vigente de red de investigación)",
    meta: "≥ 80% del NAB",
  },
  {
    id: "IND-V03",
    dimension: "Toma de decisiones",
    nombre: "Académicos participantes en convocatorias en materia de investigación (Posgrado)",
    vAiken: "0.750",
    unidad: "Académicos participantes",
    variables: "Profesores del posgrado que sometieron propuestas en convocatorias de investigación",
    formula: "Σ (Académicos con proyecto sometido en convocatorias del año)",
    meta: "100% del NAB",
  },
  {
    id: "IND-V04",
    dimension: "Toma de decisiones",
    nombre: "Estudiantes participantes en convocatorias en materia de investigación (Posgrado)",
    vAiken: "0.750",
    unidad: "Estudiantes participantes",
    variables: "Alumnos del posgrado registrados en convocatorias científicas/tecnológicas",
    formula: "Σ (Estudiantes activos con participación comprobable en convocatorias)",
    meta: "≥ 75% de la matrícula",
  },
  {
    id: "IND-V05",
    dimension: "Toma de decisiones",
    nombre: "Número de estudiantes beneficiados con una beca (Posgrado)",
    vAiken: "0.825",
    unidad: "Estudiantes becados",
    variables: "Estudiantes de posgrado con beca activa SECIHTI / CONAHCYT / Institucional",
    formula: "Σ (Alumnos matriculados con beca vigente y EDB+Kárdex validado)",
    meta: "≥ 90% de los alumnos aceptados",
  },
  {
    id: "IND-V06",
    dimension: "Toma de decisiones",
    nombre: "Tasa de variación de académicos registrados en el SNI",
    vAiken: "0.850",
    unidad: "Tasa de variación (%)",
    variables: "Académicos en SNI periodo actual (SNI_t) y periodo anterior (SNI_t-1)",
    formula: "((SNI_actual - SNI_anterior) / SNI_anterior) × 100",
    meta: "Variación positiva (≥ 0%)",
  },
  {
    id: "IND-V07",
    dimension: "Toma de decisiones",
    nombre: "Número de estudiantes de posgrado que participan en proyectos de investigación",
    vAiken: "0.675",
    unidad: "Estudiantes en proyectos",
    variables: "Alumnos formalmente incorporados a proyectos de investigación registrados",
    formula: "Σ (Estudiantes con proyecto de tesis vinculado a proyecto financiado/registrado)",
    meta: "100% de la matrícula",
  },
  {
    id: "IND-V08",
    dimension: "Toma de decisiones",
    nombre:
      "Número de artículos de investigación de académicos publicados en revistas indexadas nacionales e internacionales como parte del TecNM",
    vAiken: "0.825",
    unidad: "Artículos indexados",
    variables: "Artículos JCR / Scopus / CONAHCYT con filiación TecNM - ITM (coautoría docente-alumno)",
    formula: "Σ (Artículos publicados en revistas indizadas con adscripción TecNM en el periodo)",
    meta: "≥ 1.5 artículos por académico/año",
  },
  {
    id: "IND-V09",
    dimension: "Toma de decisiones",
    nombre:
      "Número de estudiantes que participan en programas de intercambio académico nacional e internacional (Posgrado)",
    vAiken: "0.700",
    unidad: "Estudiantes en movilidad",
    variables: "Alumnos con estancia de investigación o intercambio nacional/internacional",
    formula: "Σ (Estudiantes con oficio de comisión o carta de aceptación de estancia académica)",
    meta: "≥ 20% por generación",
  },
  {
    id: "IND-V10",
    dimension: "Toma de decisiones",
    nombre:
      "Porcentaje de proyectos de investigación con enfoque en inclusión, igualdad y desarrollo sustentable",
    vAiken: "0.525",
    unidad: "Porcentaje (%)",
    variables: "Proyectos con enfoque sustentable/inclusión vs. Total de proyectos de investigación",
    formula: "(Proyectos con enfoque de inclusión y sustentabilidad / Total de proyectos) × 100",
    meta: "≥ 60% de los proyectos",
  },
  {
    id: "IND-V11",
    dimension: "Mejora continua",
    nombre: "Número de nuevos programas de posgrado autorizados",
    vAiken: "0.525",
    unidad: "Programas autorizados",
    variables: "Nuevos posgrados autorizados por TecNM y registrados en SNP/SECIHTI",
    formula: "Σ (Nuevos programas de posgrado con dictamen de autorización oficial)",
    meta: "≥ 1 nuevo programa o actualización",
  },
];

const CRITERIOS_PONDERACION_METALURGIA = [
  {
    id: "POND-01",
    nombre: "Curso Propedéutico (Acta de Calificaciones Finales + Probatorios)",
    ponderacion: 50,
    descripcion:
      "Evaluación colegiada impartida por la comisión de profesores del Curso Propedéutico de Metalurgia.",
    escala: "0 - 100 puntos (Mínimo aprobatorio global: 80)",
    tipo: "Gestión Operativa",
  },
  {
    id: "POND-02",
    nombre: "Entrevista de Admisión (Dictamen de Academia + Comentarios)",
    ponderacion: 30,
    descripcion:
      "Evaluación por la comisión de entrevistas con formato de dictamen de academia y comentarios de profesores.",
    escala: "0 - 100 puntos",
    tipo: "Comisión de Entrevistas",
  },
  {
    id: "POND-03",
    nombre: "Revisión de Expediente de Aspirante y Antecedentes Académicos",
    ponderacion: 20,
    descripcion:
      "Solicitud de ingreso, Certificado de calificaciones, Cédula de licenciatura, INE y dominio de inglés TOEFL.",
    escala: "0 - 100 puntos",
    tipo: "Expediente Documental",
  },
];

export default function Criterios() {
  const [indicadores, setIndicadores] = useState(INDICADORES_VERDES_DATA);
  const [indicadorEditando, setIndicadorEditando] = useState(null);
  const [formulaInput, setFormulaInput] = useState("");
  const [variablesInput, setVariablesInput] = useState("");

  const guardarFormula = (e) => {
    e.preventDefault();
    setIndicadores((prev) =>
      prev.map((ind) =>
        ind.id === indicadorEditando.id
          ? { ...ind, formula: formulaInput, variables: variablesInput }
          : ind
      )
    );
    toast.success(`Fórmula de cálculo actualizada para ${indicadorEditando.id}.`);
    setIndicadorEditando(null);
  };

  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Validación Delphi y V de Aiken • ITM</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">
              11 Indicadores Verdes y Ponderación Metalurgia
            </span>
          </div>
          <h1 className="pagina__titulo">
            Los 11 Indicadores del Sistema y Tabla de Ponderación
          </h1>
          <p className="pagina__desc">
            Configuración de los <strong>11 indicadores subrayados en verde</strong> (matriz de
            validación) y los criterios de admisión de Metalurgia (mínimo aprobatorio:{" "}
            <strong>80 puntos</strong>).
          </p>
        </div>

        <div className="modulo-acciones">
          <div className="modulo-balance-badge modulo-balance-badge--ok">
            <CheckCircle2 size={15} />
            <span>11 Indicadores Verdes Activos • Mínimo Admisión: 80/100</span>
          </div>
        </div>
      </div>

      {/* Sección 1: Los 11 Indicadores Subrayados en Verde */}
      <div className="reporte-panel" style={{ marginBottom: "28px" }}>
        <div className="reporte-panel__header">
          <div>
            <h3 className="reporte-panel__titulo">
              Matriz de los 11 Indicadores Seleccionados (Subrayados en Verde)
            </h3>
            <p className="pagina__desc" style={{ marginTop: "4px" }}>
              Haz clic en <strong>"Editar Fórmula"</strong> en cualquiera de los 11 indicadores para ajustar su ecuación exacta de cálculo.
            </p>
          </div>
          <span className="programa-badge programa-badge--verde">
            Validados por Juicio de Expertos (V de Aiken)
          </span>
        </div>

        <div className="criterios-lista" style={{ marginTop: "14px" }}>
          {indicadores.map((ind, idx) => (
            <article key={ind.id} className="criterio-card">
              <div
                className="criterio-card__porcentaje-box"
                style={{
                  background: "rgba(22, 163, 74, 0.08)",
                  borderColor: "rgba(22, 163, 74, 0.25)",
                }}
              >
                <span
                  className="criterio-card__porcentaje-num"
                  style={{ color: "#15803d", fontSize: "1.15rem" }}
                >
                  #{idx + 1}
                </span>
                <span className="criterio-card__porcentaje-label">V = {ind.vAiken}</span>
              </div>

              <div className="criterio-card__contenido">
                <div className="criterio-card__top">
                  <span className="badge-codigo">{ind.id}</span>
                  <span className="programa-badge programa-badge--verde">{ind.dimension}</span>
                  <span className="criterio-card__escala">Unidad: {ind.unidad}</span>
                </div>

                <h2 className="criterio-card__nombre">{ind.nombre}</h2>
                <p className="criterio-card__desc">
                  <strong>Variables de entrada:</strong> {ind.variables}
                </p>

                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    background: "var(--superficie-2)",
                    borderRadius: "8px",
                    border: "1px dashed var(--borde)",
                    fontSize: "0.83rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    <Calculator
                      size={14}
                      style={{
                        display: "inline",
                        verticalAlign: "text-bottom",
                        marginRight: "6px",
                        color: "var(--azul-rey)",
                      }}
                    />
                    <strong>Fórmula de cálculo:</strong> <code>{ind.formula}</code>
                  </span>
                  <span className="criterio-chip-prog">Meta: {ind.meta}</span>
                </div>
              </div>

              <div className="criterio-card__acciones">
                <button
                  type="button"
                  className="boton-secundario boton-secundario--sm"
                  onClick={() => {
                    setIndicadorEditando(ind);
                    setFormulaInput(ind.formula);
                    setVariablesInput(ind.variables);
                  }}
                >
                  <Edit2 size={14} />
                  <span>Editar Fórmula</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Sección 2: Criterios de Ponderación de Aspirantes (Metalurgia) */}
      <div className="seccion-cabecera-bloque" style={{ marginBottom: "12px" }}>
        <h2 className="seccion-cabecera-bloque__titulo">
          Tabla de Ponderación de Aspirantes (Maestría en Ciencias en Metalurgia)
        </h2>
        <span className="seccion-cabecera-bloque__sub">
          Calificación mínima aprobatoria oficial: 80 puntos sobre 100
        </span>
      </div>

      <div className="criterios-lista">
        {CRITERIOS_PONDERACION_METALURGIA.map((crit) => (
          <article key={crit.id} className="criterio-card">
            <div className="criterio-card__porcentaje-box">
              <span className="criterio-card__porcentaje-num">{crit.ponderacion}%</span>
              <span className="criterio-card__porcentaje-label">Ponderación</span>
            </div>

            <div className="criterio-card__contenido">
              <div className="criterio-card__top">
                <span className="badge-codigo">{crit.id}</span>
                <span className="programa-badge programa-badge--azul">{crit.tipo}</span>
                <span className="criterio-card__escala">{crit.escala}</span>
              </div>

              <h2 className="criterio-card__nombre">{crit.nombre}</h2>
              <p className="criterio-card__desc">{crit.descripcion}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Modal para configurar la fórmula de cada indicador verde */}
      {indicadorEditando && (
        <div className="modal-overlay" onClick={() => setIndicadorEditando(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">
                  {indicadorEditando.id} • {indicadorEditando.dimension}
                </span>
                <h3 className="modal-titulo">{indicadorEditando.nombre}</h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setIndicadorEditando(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarFormula} className="modal-cuerpo">
              <div className="campo">
                <span>Variables que intervienen en el cálculo:</span>
                <input
                  type="text"
                  required
                  value={variablesInput}
                  onChange={(e) => setVariablesInput(e.target.value)}
                />
              </div>

              <div className="campo" style={{ marginTop: "14px" }}>
                <span>Fórmula Matemática / Regla de Cálculo en el Sistema:</span>
                <textarea
                  rows="3"
                  required
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--borde)",
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div className="modal-footer" style={{ marginTop: "20px" }}>
                <button type="submit" className="boton-principal">
                  <Check size={16} />
                  <span>Guardar Fórmula del Indicador</span>
                </button>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setIndicadorEditando(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
