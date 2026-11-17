import { useState } from "react";
import { Edit2, Check } from "lucide-react";
import { toast } from "sonner";

export const INDICADORES_DATA = [
  {
    id: "IND-01",
    dimension: "Investigación",
    nombre: "Proyectos de investigación científica y desarrollo tecnológico financiados",
    unidad: "Proyectos",
    variables: "Proyectos activos con financiamiento interno o externo",
    formula: "Σ (Proyectos vigentes con financiamiento aprobado en el periodo)",
    meta: "≥ 8 por año",
  },
  {
    id: "IND-02",
    dimension: "Investigación",
    nombre: "Académicos que participan en redes de investigación científica y tecnológica",
    unidad: "Académicos",
    variables: "Docentes del Núcleo Académico Básico (NAB) en redes activas",
    formula: "Σ (Académicos del posgrado con constancia vigente de red)",
    meta: "≥ 80% del NAB",
  },
  {
    id: "IND-03",
    dimension: "Investigación",
    nombre: "Académicos participantes en convocatorias de investigación",
    unidad: "Académicos",
    variables: "Profesores que sometieron propuestas en convocatorias del ciclo",
    formula: "Σ (Académicos con proyecto registrado en convocatorias del año)",
    meta: "100% del NAB",
  },
  {
    id: "IND-04",
    dimension: "Estudiantes",
    nombre: "Estudiantes participantes en convocatorias de investigación",
    unidad: "Estudiantes",
    variables: "Alumnos del posgrado registrados en convocatorias científicas",
    formula: "Σ (Estudiantes activos con participación en convocatorias)",
    meta: "≥ 75% de matrícula",
  },
  {
    id: "IND-05",
    dimension: "Becas",
    nombre: "Estudiantes beneficiados con beca de posgrado",
    unidad: "Becarios",
    variables: "Estudiantes con beca activa SECIHTI o institucional",
    formula: "Σ (Alumnos matriculados con beca vigente y kárdex validado)",
    meta: "≥ 90% de aceptados",
  },
  {
    id: "IND-06",
    dimension: "Planta Docente",
    nombre: "Tasa de variación de académicos registrados en el SNI",
    unidad: "Porcentaje (%)",
    variables: "Académicos en SNI periodo actual vs. periodo anterior",
    formula: "((SNI_actual - SNI_anterior) / SNI_anterior) × 100",
    meta: "≥ 0%",
  },
  {
    id: "IND-07",
    dimension: "Estudiantes",
    nombre: "Estudiantes que participan en proyectos de investigación",
    unidad: "Estudiantes",
    variables: "Alumnos incorporados a proyectos registrados",
    formula: "Σ (Estudiantes con tesis vinculada a proyecto registrado)",
    meta: "100% de matrícula",
  },
  {
    id: "IND-08",
    dimension: "Productividad",
    nombre: "Artículos publicados en revistas indexadas",
    unidad: "Artículos",
    variables: "Artículos JCR / Scopus con adscripción institucional",
    formula: "Σ (Artículos publicados en revistas indizadas en el periodo)",
    meta: "≥ 1.5 por docente",
  },
  {
    id: "IND-09",
    dimension: "Movilidad",
    nombre: "Estudiantes en programas de intercambio o estancia académica",
    unidad: "Estudiantes",
    variables: "Alumnos con estancia nacional o internacional",
    formula: "Σ (Estudiantes con carta de aceptación de estancia)",
    meta: "≥ 20% por cohorte",
  },
  {
    id: "IND-10",
    dimension: "Sustentabilidad",
    nombre: "Proyectos con enfoque en inclusión y desarrollo sustentable",
    unidad: "Porcentaje (%)",
    variables: "Proyectos con enfoque sustentable respecto al total",
    formula: "(Proyectos sustentables / Total de proyectos) × 100",
    meta: "≥ 60%",
  },
  {
    id: "IND-11",
    dimension: "Oferta Educativa",
    nombre: "Programas de posgrado actualizados o autorizados",
    unidad: "Programas",
    variables: "Programas vigentes registrados ante la institución",
    formula: "Σ (Programas de posgrado con registro activo)",
    meta: "6 programas",
  },
];

const CRITERIOS_ADMISION = [
  {
    id: "POND-01",
    nombre: "Curso Propedéutico",
    ponderacion: 50,
    descripcion: "Evaluación colegiada impartida por la comisión de profesores del curso propedéutico.",
    escala: "0 a 100 puntos",
  },
  {
    id: "POND-02",
    nombre: "Entrevista de Admisión",
    ponderacion: 30,
    descripcion: "Evaluación por la comisión de entrevistas mediante dictamen de academia.",
    escala: "0 a 100 puntos",
  },
  {
    id: "POND-03",
    nombre: "Expediente y Antecedentes Académicos",
    ponderacion: 20,
    descripcion: "Promedio previo, certificado de licenciatura, cédula profesional y comprobante TOEFL.",
    escala: "0 a 100 puntos",
  },
];

export default function Criterios() {
  const [indicadores, setIndicadores] = useState(INDICADORES_DATA);
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
    toast.success(`Fórmula actualizada para ${indicadorEditando.id}.`);
    setIndicadorEditando(null);
  };

  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Criterios de Evaluación e Indicadores</h1>
          <p className="pagina__desc">
            Ponderación oficial para el ingreso de aspirantes (mínimo aprobatorio: 80 puntos) e indicadores académicos.
          </p>
        </div>
      </div>

      {/* Ponderación de Admisión */}
      <div className="bloque-cabecera">
        <h2 className="bloque-cabecera__titulo">Ponderación de Admisión</h2>
        <span className="bloque-cabecera__sub">Suma total: 100% · Calificación mínima aprobatoria: 80 / 100</span>
      </div>

      <div className="criterios-grid">
        {CRITERIOS_ADMISION.map((crit) => (
          <article key={crit.id} className="criterio-card">
            <div className="criterio-card__porcentaje-box">
              <span className="criterio-card__porcentaje-num">{crit.ponderacion}%</span>
              <span className="criterio-card__porcentaje-label">Peso</span>
            </div>

            <div className="criterio-card__contenido">
              <div className="criterio-card__top">
                <span className="badge-codigo">{crit.id}</span>
                <span className="criterio-card__escala">{crit.escala}</span>
              </div>
              <h3 className="criterio-card__nombre">{crit.nombre}</h3>
              <p className="criterio-card__desc">{crit.descripcion}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Tabla de Indicadores Institucionales */}
      <div className="bloque-cabecera" style={{ marginTop: "12px" }}>
        <h2 className="bloque-cabecera__titulo">Indicadores Académicos de Posgrado</h2>
        <span className="bloque-cabecera__sub">Fórmulas de cálculo y metas anuales</span>
      </div>

      <div className="modulo-tabla-card">
        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Categoría</th>
                <th className="text-left">Indicador y Fórmula</th>
                <th>Meta</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {indicadores.map((ind) => (
                <tr key={ind.id}>
                  <td>
                    <span className="badge-codigo">{ind.id}</span>
                  </td>
                  <td>
                    <span className="programa-badge programa-badge--suave">{ind.dimension}</span>
                  </td>
                  <td className="text-left">
                    <span className="nombre-persona">{ind.nombre}</span>
                    <span className="fecha-suave">Fórmula: {ind.formula}</span>
                  </td>
                  <td>
                    <span className="calificacion-pill">{ind.meta}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="boton-secundario boton-secundario--sm"
                      onClick={() => {
                        setIndicadorEditando(ind);
                        setFormulaInput(ind.formula);
                        setVariablesInput(ind.variables);
                      }}
                    >
                      <Edit2 size={13} aria-hidden="true" />
                      <span>Editar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar fórmula */}
      {indicadorEditando && (
        <div className="modal-overlay" onClick={() => setIndicadorEditando(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">
                  {indicadorEditando.id} · {indicadorEditando.dimension}
                </span>
                <h3 className="modal-titulo">{indicadorEditando.nombre}</h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setIndicadorEditando(null)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarFormula} className="modal-cuerpo">
              <label className="campo">
                <span className="campo__etiqueta">Variables de entrada</span>
                <input
                  type="text"
                  required
                  value={variablesInput}
                  onChange={(e) => setVariablesInput(e.target.value)}
                />
              </label>

              <label className="campo">
                <span className="campo__etiqueta">Fórmula de cálculo</span>
                <textarea
                  rows="3"
                  required
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                />
              </label>

              <div className="modal-footer">
                <button type="submit" className="boton-principal">
                  <Check size={16} aria-hidden="true" />
                  <span>Guardar cambios</span>
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
