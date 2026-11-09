import { useState } from "react";
import {
  Download,
  Users,
  Award,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Star,
  Check,
} from "lucide-react";
import { toast } from "sonner";

const METRICAS_11_VERDES = [
  {
    codigo: "IND-V01",
    dimension: "Eficiencia operativa",
    indicador:
      "Número de proyectos de investigación científica, desarrollo tecnológico e innovación financiados",
    valorActual: "12 proyectos",
    cumplimiento: 92,
    vAiken: "0.650",
  },
  {
    codigo: "IND-V02",
    dimension: "Eficiencia operativa",
    indicador:
      "Número de académicos que participan en redes de investigación, científica y tecnológica (Posgrado)",
    valorActual: "14 académicos",
    cumplimiento: 88,
    vAiken: "0.700",
  },
  {
    codigo: "IND-V03",
    dimension: "Toma de decisiones",
    indicador: "Académicos participantes en convocatorias en materia de investigación (Posgrado)",
    valorActual: "15 académicos",
    cumplimiento: 94,
    vAiken: "0.750",
  },
  {
    codigo: "IND-V04",
    dimension: "Toma de decisiones",
    indicador: "Estudiantes participantes en convocatorias en materia de investigación (Posgrado)",
    valorActual: "28 estudiantes",
    cumplimiento: 85,
    vAiken: "0.750",
  },
  {
    codigo: "IND-V05",
    dimension: "Toma de decisiones",
    indicador: "Número de estudiantes beneficiados con una beca (Posgrado)",
    valorActual: "34 becarios SECIHTI",
    cumplimiento: 96,
    vAiken: "0.825",
  },
  {
    codigo: "IND-V06",
    dimension: "Toma de decisiones",
    indicador: "Tasa de variación de académicos registrados en el SNI",
    valorActual: "+14.3% (16 en SNI)",
    cumplimiento: 95,
    vAiken: "0.850",
  },
  {
    codigo: "IND-V07",
    dimension: "Toma de decisiones",
    indicador: "Número de estudiantes de posgrado que participan en proyectos de investigación",
    valorActual: "36 estudiantes (100%)",
    cumplimiento: 100,
    vAiken: "0.675",
  },
  {
    codigo: "IND-V08",
    dimension: "Toma de decisiones",
    indicador:
      "Número de artículos de investigación de académicos publicados en revistas indexadas nacionales e internacionales como parte del TecNM",
    valorActual: "24 artículos JCR/Scopus",
    cumplimiento: 90,
    vAiken: "0.825",
  },
  {
    codigo: "IND-V09",
    dimension: "Toma de decisiones",
    indicador:
      "Número de estudiantes que participan en programas de intercambio académico nacional e internacional (Posgrado)",
    valorActual: "7 estudiantes en estancia",
    cumplimiento: 78,
    vAiken: "0.700",
  },
  {
    codigo: "IND-V10",
    dimension: "Toma de decisiones",
    indicador:
      "Porcentaje de proyectos de investigación con enfoque en inclusión, igualdad y desarrollo sustentable",
    valorActual: "75.0% (9 de 12)",
    cumplimiento: 75,
    vAiken: "0.525",
  },
  {
    codigo: "IND-V11",
    dimension: "Mejora continua",
    indicador: "Número de nuevos programas de posgrado autorizados",
    valorActual: "6 programas activos ITM",
    cumplimiento: 100,
    vAiken: "0.525",
  },
];

export default function Reportes() {
  const [encuestaModal, setEncuestaModal] = useState(false);
  const [likertTransparencia, setLikertTransparencia] = useState(5);
  const [likertUsabilidad, setLikertUsabilidad] = useState(5);
  const [consentimiento, setConsentimiento] = useState(true);

  const enviarEncuesta = (e) => {
    e.preventDefault();
    toast.success(
      "Evaluación de Transparencia y Usabilidad (Escala Likert 1–5) registrada con Consentimiento Informado."
    );
    setEncuestaModal(false);
  };

  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>DEPI • Instituto Tecnológico de Morelia</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">
              11 Indicadores Verdes y Operacionalización
            </span>
          </div>
          <h1 className="pagina__titulo">
            Tablero de Indicadores de Posgrado y Acreditación SECIHTI
          </h1>
          <p className="pagina__desc">
            Monitoreo en tiempo real de los <strong>11 indicadores subrayados en verde</strong>,
            tiempos de informes de acreditación, eficiencia terminal, empleabilidad y transparencia.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => setEncuestaModal(true)}
          >
            <Star size={16} />
            <span>Encuesta Transparencia y Usabilidad (Likert 1–5)</span>
          </button>
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              toast.success("Matriz de los 11 indicadores verdes exportada a Excel.")
            }
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Excel</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() =>
              toast.success("Informe de Acreditación SECIHTI / SNP generado en tiempo (0 días de retraso).")
            }
          >
            <Download size={16} />
            <span>Generar Informe SECIHTI PDF</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs de las Variables Operacionalizadas (blablabla.docx) */}
      <div className="inicio-kpis">
        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--azul">
            <Clock size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Tiempo Preparación Informes</span>
            <span className="kpi-card__valor">3.5 días</span>
            <span className="kpi-card__subtext">0% retraso en acreditación (En tiempo: Sí)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--verde">
            <TrendingUp size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Eficiencia Terminal</span>
            <span className="kpi-card__valor">91.4%</span>
            <span className="kpi-card__subtext">Graduación por cohorte generacional</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--morado">
            <Users size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Empleabilidad de Egresados</span>
            <span className="kpi-card__valor">88.5%</span>
            <span className="kpi-card__subtext">Trabajan en su área metalúrgica/industrial</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--ambar">
            <Award size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Transparencia y Usabilidad</span>
            <span className="kpi-card__valor">4.8 / 5.0</span>
            <span className="kpi-card__subtext">Escala Likert (Alumnos, Docentes, Coord.)</span>
          </div>
        </div>
      </div>

      {/* Tabla Consolidada de los 11 Indicadores Subrayados en Verde */}
      <div className="reporte-panel" style={{ marginBottom: "24px" }}>
        <div className="reporte-panel__header">
          <div>
            <h3 className="reporte-panel__titulo">
              Seguimiento de los 11 Indicadores Validados (Subrayados en Verde)
            </h3>
            <p className="pagina__desc" style={{ marginTop: "4px" }}>
              Indicadores seleccionados de las dimensiones: <strong>Eficiencia Operativa (2)</strong>,{" "}
              <strong>Toma de Decisiones (8)</strong> y <strong>Mejora Continua (1)</strong>.
            </p>
          </div>
          <span className="programa-badge programa-badge--verde">11 Indicadores en Sistema</span>
        </div>

        <div className="table-responsive" style={{ marginTop: "12px" }}>
          <table className="styled-table styled-table--elevated">
            <thead>
              <tr>
                <th>Código</th>
                <th>Dimensión</th>
                <th className="text-left">Indicador Subrayado en Verde</th>
                <th>V de Aiken</th>
                <th>Valor en Sistema</th>
                <th>Avance de Meta</th>
              </tr>
            </thead>
            <tbody>
              {METRICAS_11_VERDES.map((m) => (
                <tr key={m.codigo}>
                  <td>
                    <span className="badge-codigo">{m.codigo}</span>
                  </td>
                  <td>
                    <span className="programa-badge programa-badge--verde">{m.dimension}</span>
                  </td>
                  <td className="text-left">
                    <span className="nombre-persona">{m.indicador}</span>
                  </td>
                  <td>
                    <strong>{m.vAiken}</strong>
                  </td>
                  <td>
                    <span className="calificacion-pill">{m.valorActual}</span>
                  </td>
                  <td style={{ minWidth: "150px" }}>
                    <div className="reporte-barra-track">
                      <div
                        className="reporte-barra-fill"
                        style={{
                          width: `${m.cumplimiento}%`,
                          backgroundColor: "#16a34a",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--texto-suave)" }}>
                      {m.cumplimiento}% de meta anual
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Encuesta de Transparencia y Usabilidad (Escala Likert 1–5) */}
      {encuestaModal && (
        <div className="modal-overlay" onClick={() => setEncuestaModal(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">INSTRUMENTO METODOLÓGICO • ITM</span>
                <h3 className="modal-titulo">
                  Cuestionario de Transparencia y Usabilidad (Escala Likert 1–5)
                </h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setEncuestaModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={enviarEncuesta} className="modal-cuerpo">
              <div className="campo">
                <span>
                  1. Nivel de transparencia percibida en la gestión de trámites y evaluaciones (1 =
                  Muy bajo, 5 = Muy alto):
                </span>
                <select
                  value={likertTransparencia}
                  onChange={(e) => setLikertTransparencia(Number(e.target.value))}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--borde)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  <option value={5}>5 — Totalmente transparente y trazable</option>
                  <option value={4}>4 — Transparente</option>
                  <option value={3}>3 — Neutral / Regular</option>
                  <option value={2}>2 — Poco transparente</option>
                  <option value={1}>1 — Nada transparente</option>
                </select>
              </div>

              <div className="campo" style={{ marginTop: "14px" }}>
                <span>
                  2. Satisfacción y usabilidad de la plataforma web (1 = Muy insatisfecho, 5 = Muy
                  satisfecho):
                </span>
                <select
                  value={likertUsabilidad}
                  onChange={(e) => setLikertUsabilidad(Number(e.target.value))}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--borde)",
                    fontFamily: "var(--fuente)",
                  }}
                >
                  <option value={5}>5 — Muy fácil de usar y reduce tiempos operativos</option>
                  <option value={4}>4 — Fácil de usar</option>
                  <option value={3}>3 — Aceptable</option>
                  <option value={2}>2 — Difícil de usar</option>
                  <option value={1}>1 — Muy difícil de usar</option>
                </select>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginTop: "16px",
                  fontSize: "0.85rem",
                  color: "var(--texto-suave)",
                }}
              >
                <input
                  type="checkbox"
                  checked={consentimiento}
                  onChange={(e) => setConsentimiento(e.target.checked)}
                  required
                />
                <span>
                  <strong>Consentimiento Informado:</strong> Autorizo el tratamiento confidencial de
                  mis respuestas y datos académicos exclusivamente para fines de mejora continua y
                  acreditación de los programas de posgrado del ITM.
                </span>
              </label>

              <div className="modal-footer" style={{ marginTop: "20px" }}>
                <button type="submit" className="boton-principal">
                  <Check size={16} />
                  <span>Registrar Evaluación Likert</span>
                </button>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setEncuestaModal(false)}
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
