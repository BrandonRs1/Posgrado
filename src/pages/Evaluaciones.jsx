import { useState } from "react";
import {
  Search,
  ChevronRight,
  Download,
  Check,
  FileText,
  UserCheck,
  Award,
  Send,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

const PONDERACION_ASPIRANTES = [
  {
    id: "ASP-01",
    folio: "MCM-2026-001",
    aspirante: "García Mendoza Valeria",
    programa: "Maestría en Ciencias en Metalurgia",
    comisionEntrevista: "Dr. R. Sandoval, Dra. C. Morales, Dr. J. Ortiz",
    fechaEntrevista: "28/10/2026 • 10:00 hrs",
    propedeutico: 94.0,
    entrevista: 92.0,
    expediente: 95.0,
    comentariosAcademia:
      "Excelente dominio en termodinámica metalúrgica y disponibilidad de tiempo completo para beca SECIHTI.",
    enviadoDepi: true,
  },
  {
    id: "ASP-02",
    folio: "MCM-2026-002",
    aspirante: "López Herrera Carlos",
    programa: "Maestría en Ciencias en Metalurgia",
    comisionEntrevista: "Dr. R. Sandoval, Dr. L. Villaseñor",
    fechaEntrevista: "28/10/2026 • 11:30 hrs",
    propedeutico: 84.0,
    entrevista: 86.0,
    expediente: 88.0,
    comentariosAcademia:
      "Buen desempeño en curso propedéutico; cuenta con experiencia en caracterización de aleaciones.",
    enviadoDepi: true,
  },
  {
    id: "ASP-03",
    folio: "MCM-2026-003",
    aspirante: "Trejo Castillo Diana",
    programa: "Maestría en Ciencias en Metalurgia",
    comisionEntrevista: "Dra. C. Morales, Dr. M. Pineda",
    fechaEntrevista: "29/10/2026 • 09:30 hrs",
    propedeutico: 76.0,
    entrevista: 78.0,
    expediente: 75.0,
    comentariosAcademia:
      "Puntaje por debajo de la calificación mínima aprobatoria de 80 establecida por el Consejo de Posgrado.",
    enviadoDepi: false,
  },
  {
    id: "ASP-04",
    folio: "MCM-2026-004",
    aspirante: "Romero Peña Fernando",
    programa: "Maestría en Ciencias en Metalurgia",
    comisionEntrevista: "Dr. R. Sandoval, Dra. C. Morales",
    fechaEntrevista: "30/10/2026 • 12:00 hrs",
    propedeutico: 88.0,
    entrevista: 85.0,
    expediente: 82.0,
    comentariosAcademia:
      "Aprobado por unanimidad en reunión Coordinación–Consejo. Candidato a beca nacional SECIHTI.",
    enviadoDepi: true,
  },
];

const SEGUIMIENTO_TITULACION = [
  {
    id: "TIT-01",
    matricula: "M24120104",
    alumno: "Hernández Soto Mariana",
    semestre: "4° Semestre",
    asesor: "Dr. Roberto Sandoval Gómez",
    notificadoAsesor: true,
    edbKardexSemestral: "Validado (Semestre 4)",
    primeraRevisionComite: "Firmada",
    segundaRevision: "Aprobada",
    numeroTesis: "MCM-ITM-2026-008",
    tesisDigitalFinal: "Recibida (PDF)",
    tramiteDepiActaGrado: "Acta de Grado Emitida",
    cartaRetribucionSocial: "Generada",
  },
  {
    id: "TIT-02",
    matricula: "M24120109",
    alumno: "Navarro Ruiz Emiliano",
    semestre: "4° Semestre",
    asesor: "Dra. Carmen Morales Benítez",
    notificadoAsesor: true,
    edbKardexSemestral: "Validado (Semestre 4)",
    primeraRevisionComite: "Firmada",
    segundaRevision: "En revisión",
    numeroTesis: "MCM-ITM-2026-011",
    tesisDigitalFinal: "Pendiente",
    tramiteDepiActaGrado: "En trámite DEPI / Escolares",
    cartaRetribucionSocial: "Pendiente",
  },
  {
    id: "TIT-03",
    matricula: "M25120042",
    alumno: "Aguilar Domínguez Sofía",
    semestre: "2° Semestre",
    asesor: "Dr. Luis Villaseñor Reyes",
    notificadoAsesor: true,
    edbKardexSemestral: "Validado (Semestre 2)",
    primeraRevisionComite: "En avance (Seminario II)",
    segundaRevision: "—",
    numeroTesis: "Sin asignar",
    tesisDigitalFinal: "—",
    tramiteDepiActaGrado: "—",
    cartaRetribucionSocial: "—",
  },
];

function calcularPromedioPonderado(item) {
  return Number(
    (item.propedeutico * 0.5 + item.entrevista * 0.3 + item.expediente * 0.2).toFixed(1)
  );
}

export default function Evaluaciones() {
  const [vistaActiva, setVistaActiva] = useState("ponderacion"); // 'ponderacion' | 'titulacion'
  const [busqueda, setBusqueda] = useState("");
  const [evaluacionModal, setEvaluacionModal] = useState(null);

  const aspirantesFiltrados = PONDERACION_ASPIRANTES.filter(
    (a) =>
      a.aspirante.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.folio.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardarDictamen = (e) => {
    e.preventDefault();
    toast.success(
      `Dictamen de entrevista y ponderación actualizados para ${evaluacionModal.aspirante}.`
    );
    setEvaluacionModal(null);
  };

  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Proceso Metalurgia • ITM</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">
              Ponderación, Entrevistas, Asesores y Titulación
            </span>
          </div>
          <h1 className="pagina__titulo">
            Gestión Operativa, Admisión y Proceso de Titulación
          </h1>
          <p className="pagina__desc">
            Tabla de ponderación de aspirantes (mínimo aprobatorio: <strong>80 puntos</strong>),
            dictámenes de entrevista de academia, listado a DEPI, asignación de asesor y titulación.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              toast.success(
                "Listado oficial de aspirantes aceptados generado y enviado a la DEPI."
              )
            }
          >
            <Send size={16} />
            <span>Enviar Listado de Aceptados a DEPI</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() =>
              toast.success("Acta de calificaciones finales del Curso Propedéutico descargada.")
            }
          >
            <Download size={16} />
            <span>Acta Propedéutico y Dictámenes</span>
          </button>
        </div>
      </div>

      {/* KPIs del Proceso Metalurgia */}
      <div className="modulo-kpis-fila">
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Calificación Mínima</span>
          <span className="modulo-kpi-item__valor text-azul">80.0</span>
          <span className="modulo-kpi-item__sub">Escala oficial 0 a 100</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Aceptados (≥ 80 pts)</span>
          <span className="modulo-kpi-item__valor text-verde">3 de 4</span>
          <span className="modulo-kpi-item__sub">Avalados por Consejo y DEPI</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">EDB + Kárdex Semestral</span>
          <span className="modulo-kpi-item__valor text-verde">100%</span>
          <span className="modulo-kpi-item__sub">Becarios SECIHTI al corriente</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">En Proceso de Titulación</span>
          <span className="modulo-kpi-item__valor text-ambar">2</span>
          <span className="modulo-kpi-item__sub">1ra/2da revisión y Acta de Grado</span>
        </div>
      </div>

      {/* Selector de Etapa del Proceso */}
      <div className="modulo-toolbar">
        <div className="modulo-chips-filtros">
          <button
            type="button"
            className={`modulo-chip ${vistaActiva === "ponderacion" ? "modulo-chip--activo" : ""}`}
            onClick={() => setVistaActiva("ponderacion")}
          >
            1. Tabla de Ponderación, Entrevistas y Cartas (Etapa Operativa)
          </button>
          <button
            type="button"
            className={`modulo-chip ${vistaActiva === "titulacion" ? "modulo-chip--activo" : ""}`}
            onClick={() => setVistaActiva("titulacion")}
          >
            2. Asesor de Tesis, EDB+Kárdex y Proceso de Titulación (Etapas 3 y 4)
          </button>
        </div>

        <div className="modulo-buscar">
          <Search size={16} className="modulo-buscar__icono" />
          <input
            type="text"
            placeholder="Buscar por nombre o folio…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="modulo-buscar__input"
          />
        </div>
      </div>

      {vistaActiva === "ponderacion" ? (
        <div className="modulo-tabla-card">
          <div className="table-responsive">
            <table className="styled-table styled-table--elevated">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th className="text-left">Aspirante y Comisión de Entrevista</th>
                  <th>Propedéutico (50%)</th>
                  <th>Entrevista (30%)</th>
                  <th>Expediente (20%)</th>
                  <th>Ponderación Final</th>
                  <th>Dictamen (Mín. 80)</th>
                  <th>Cartas y Acción</th>
                </tr>
              </thead>
              <tbody>
                {aspirantesFiltrados.map((item) => {
                  const promedio = calcularPromedioPonderado(item);
                  const aprobado = promedio >= 80;
                  return (
                    <tr key={item.id}>
                      <td>
                        <span className="badge-codigo">{item.folio}</span>
                      </td>
                      <td className="text-left">
                        <span className="nombre-persona">{item.aspirante}</span>
                        <span className="fecha-suave">
                          Comisión: {item.comisionEntrevista} ({item.fechaEntrevista})
                        </span>
                      </td>
                      <td>{item.propedeutico.toFixed(1)}</td>
                      <td>{item.entrevista.toFixed(1)}</td>
                      <td>{item.expediente.toFixed(1)}</td>
                      <td>
                        <span className="calificacion-pill">{promedio.toFixed(1)}</span>
                      </td>
                      <td>
                        <span
                          className={`programa-badge ${
                            aprobado ? "programa-badge--verde" : "programa-badge--ambar"
                          }`}
                        >
                          {aprobado ? "Aceptado (≥ 80)" : "No Aceptado (< 80)"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() =>
                              toast.success(
                                aprobado
                                  ? `Carta de Aceptación generada para ${item.aspirante}.`
                                  : `Carta de No Aceptación generada para ${item.aspirante}.`
                              )
                            }
                          >
                            <FileText size={13} />
                            <span>{aprobado ? "Carta Aceptación" : "Carta No Aceptación"}</span>
                          </button>
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() => setEvaluacionModal(item)}
                          >
                            <span>Dictamen</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="modulo-tabla-card">
          <div className="table-responsive">
            <table className="styled-table styled-table--elevated">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th className="text-left">Estudiante y Asesor Asignado</th>
                  <th>EDB + Kárdex (Semestral)</th>
                  <th>1ra y 2da Revisión Tesis</th>
                  <th>N° de Tesis y Versión Final</th>
                  <th>Trámite DEPI / Acta Grado</th>
                  <th>Carta Retribución Social</th>
                </tr>
              </thead>
              <tbody>
                {SEGUIMIENTO_TITULACION.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="badge-codigo">{t.matricula}</span>
                    </td>
                    <td className="text-left">
                      <span className="nombre-persona">
                        {t.alumno} ({t.semestre})
                      </span>
                      <span className="fecha-suave">
                        Asesor: {t.asesor} • Notificado ✓
                      </span>
                    </td>
                    <td>
                      <span className="programa-badge programa-badge--verde">
                        {t.edbKardexSemestral}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem" }}>
                        <div>1ra: <strong>{t.primeraRevisionComite}</strong></div>
                        <div>2da: <strong>{t.segundaRevision}</strong></div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.8rem" }}>
                        <span className="badge-codigo">{t.numeroTesis}</span>
                        <div style={{ marginTop: "3px" }}>{t.tesisDigitalFinal}</div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`programa-badge ${
                          t.tramiteDepiActaGrado.includes("Emitida")
                            ? "programa-badge--verde"
                            : "programa-badge--azul"
                        }`}
                      >
                        {t.tramiteDepiActaGrado}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="boton-secundario boton-secundario--sm"
                        onClick={() =>
                          toast.success(
                            `Carta de Retribución Social y oficio de Acta de Grado descargados para ${t.alumno}.`
                          )
                        }
                      >
                        <Award size={14} />
                        <span>{t.cartaRetribucionSocial}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para revisar comentarios de entrevista y ponderación */}
      {evaluacionModal && (
        <div className="modal-overlay" onClick={() => setEvaluacionModal(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">{evaluacionModal.folio}</span>
                <h3 className="modal-titulo">
                  Dictamen de Academia — {evaluacionModal.aspirante}
                </h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setEvaluacionModal(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarDictamen} className="modal-cuerpo">
              <div className="modal-info-grid">
                <div>
                  <strong>Comisión de Profesores:</strong>
                  <p>{evaluacionModal.comisionEntrevista}</p>
                </div>
                <div>
                  <strong>Cita de Entrevista:</strong>
                  <p>{evaluacionModal.fechaEntrevista}</p>
                </div>
                <div>
                  <strong>Curso Propedéutico (50%):</strong>
                  <p>{evaluacionModal.propedeutico} / 100</p>
                </div>
                <div>
                  <strong>Entrevista Academia (30%):</strong>
                  <p>{evaluacionModal.entrevista} / 100</p>
                </div>
              </div>

              <div className="campo" style={{ marginTop: "14px" }}>
                <span>Comentarios de los Profesores que Realizan la Entrevista:</span>
                <textarea
                  rows="3"
                  defaultValue={evaluacionModal.comentariosAcademia}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid var(--borde)",
                    fontFamily: "var(--fuente)",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <div className="modal-footer" style={{ marginTop: "20px" }}>
                <button type="submit" className="boton-principal">
                  <Check size={16} />
                  <span>Guardar Dictamen y Actualizar Tabla de Ponderación</span>
                </button>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setEvaluacionModal(null)}
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
