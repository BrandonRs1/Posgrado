import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Download,
  Check,
  FileText,
  Award,
  Send,
  Upload,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import PanelCitasAsesoria from "../components/PanelCitasAsesoria.jsx";
import {
  obtenerSeguimientoTitulacion,
  profesorSubirTesisAlumno,
  profesorEliminarTesisAlumno,
} from "../lib/expedienteYCitas.js";

const PONDERACION_ASPIRANTES = [
  {
    id: "ASP-01",
    folio: "MCM-2026-001",
    aspirante: "García Mendoza Valeria",
    comisionEntrevista: "Dr. R. Sandoval, Dra. C. Morales, Dr. J. Ortiz",
    fechaEntrevista: "28/10/2026 · 10:00 hrs",
    propedeutico: 94.0,
    entrevista: 92.0,
    expediente: 95.0,
    comentariosAcademia:
      "Buen dominio en termodinámica metalúrgica y disponibilidad de tiempo completo.",
  },
  {
    id: "ASP-02",
    folio: "MCM-2026-002",
    aspirante: "López Herrera Carlos",
    comisionEntrevista: "Dr. R. Sandoval, Dr. L. Villaseñor",
    fechaEntrevista: "28/10/2026 · 11:30 hrs",
    propedeutico: 84.0,
    entrevista: 86.0,
    expediente: 88.0,
    comentariosAcademia:
      "Desempeño satisfactorio en curso propedéutico; experiencia en caracterización de aleaciones.",
  },
  {
    id: "ASP-03",
    folio: "MCM-2026-003",
    aspirante: "Trejo Castillo Diana",
    comisionEntrevista: "Dra. C. Morales, Dr. M. Pineda",
    fechaEntrevista: "29/10/2026 · 09:30 hrs",
    propedeutico: 76.0,
    entrevista: 78.0,
    expediente: 75.0,
    comentariosAcademia:
      "Puntaje inferior a la calificación mínima aprobatoria de 80 establecida por el comité.",
  },
  {
    id: "ASP-04",
    folio: "MCM-2026-004",
    aspirante: "Romero Peña Fernando",
    comisionEntrevista: "Dr. R. Sandoval, Dra. C. Morales",
    fechaEntrevista: "30/10/2026 · 12:00 hrs",
    propedeutico: 88.0,
    entrevista: 85.0,
    expediente: 82.0,
    comentariosAcademia: "Aprobado por unanimidad en sesión de academia.",
  },
];

function calcularPromedioPonderado(item) {
  return Number(
    (item.propedeutico * 0.5 + item.entrevista * 0.3 + item.expediente * 0.2).toFixed(1)
  );
}

export default function Evaluaciones() {
  const { perfil } = useAuth();
  const [vistaActiva, setVistaActiva] = useState("titulacion"); // 'ponderacion' | 'titulacion' | 'citas'
  const [busqueda, setBusqueda] = useState("");
  const [evaluacionModal, setEvaluacionModal] = useState(null);

  // Estado de tesis por alumno (con opciones de agregar desde dispositivo y eliminar para el profesor)
  const [listaTitulacion, setListaTitulacion] = useState(() => obtenerSeguimientoTitulacion());
  const [registroTesisObjetivo, setRegistroTesisObjetivo] = useState(null);
  const inputTesisRef = useRef(null);

  useEffect(() => {
    const sincronizar = () => setListaTitulacion(obtenerSeguimientoTitulacion());
    window.addEventListener("posgrados:sync", sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      window.removeEventListener("posgrados:sync", sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  const abrirSelectorTesisDispositivo = (registroAlumno) => {
    setRegistroTesisObjetivo(registroAlumno);
    if (inputTesisRef.current) {
      inputTesisRef.current.value = "";
      inputTesisRef.current.click();
    }
  };

  const alSeleccionarTesisDispositivo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !registroTesisObjetivo) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Selecciona un archivo de tesis en formato PDF (.pdf).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo supera el límite máximo de 10 MB.");
      return;
    }

    const actualizada = await profesorSubirTesisAlumno(
      registroTesisObjetivo.id,
      file,
      perfil?.id
    );
    setListaTitulacion(actualizada);
    toast.success(
      `Tesis "${file.name}" agregada correctamente al alumno ${registroTesisObjetivo.alumno}.`
    );
    setRegistroTesisObjetivo(null);
  };

  const handleEliminarTesisAlumno = (registroAlumno) => {
    if (!registroAlumno.tesisArchivo) {
      toast.info(`El alumno ${registroAlumno.alumno} no tiene una tesis cargada actualmente.`);
      return;
    }
    const actualizada = profesorEliminarTesisAlumno(registroAlumno.id);
    setListaTitulacion(actualizada);
    toast.success(`Se eliminó la tesis de ${registroAlumno.alumno}.`);
  };

  const abrirPdfTesis = (registroAlumno) => {
    if (registroAlumno.tesisUrl) {
      window.open(registroAlumno.tesisUrl, "_blank", "noopener,noreferrer");
    } else if (registroAlumno.tesisArchivo) {
      toast.success(`Abriendo archivo de tesis: ${registroAlumno.tesisArchivo}`);
    }
  };

  const aspirantesFiltrados = PONDERACION_ASPIRANTES.filter(
    (a) =>
      a.aspirante.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.folio.toLowerCase().includes(busqueda.toLowerCase())
  );

  const titulacionFiltrada = listaTitulacion.filter(
    (t) =>
      t.alumno.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.numeroTesis.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardarDictamen = (e) => {
    e.preventDefault();
    toast.success(`Dictamen actualizado para ${evaluacionModal.aspirante}.`);
    setEvaluacionModal(null);
  };

  const tesisCargadasCount = listaTitulacion.filter((t) => Boolean(t.tesisArchivo)).length;

  return (
    <section className="modulo-seccion">
      {/* Input oculto para que el profesor elija la tesis del alumno desde su dispositivo */}
      <input
        ref={inputTesisRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={alSeleccionarTesisDispositivo}
      />

      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Evaluaciones, Tesis y Citas de Asesoría</h1>
          <p className="pagina__desc">
            Gestión de tesis por alumno (agregar desde dispositivo o eliminar), ponderación de
            aspirantes y control de citas de asesoría.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => toast.success("Listado de aceptados enviado a DEPI.")}
          >
            <Send size={16} aria-hidden="true" />
            <span>Enviar aceptados a DEPI</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() => toast.success("Acta de calificaciones descargada.")}
          >
            <Download size={16} aria-hidden="true" />
            <span>Descargar actas</span>
          </button>
        </div>
      </div>

      {/* Resumen numérico en Azul y Blanco */}
      <div className="modulo-kpis-fila">
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Calificación mínima</span>
          <span className="modulo-kpi-item__valor">80.0</span>
          <span className="modulo-kpi-item__sub">Escala 0 a 100</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Aspirantes aceptados</span>
          <span className="modulo-kpi-item__valor">3 de 4</span>
          <span className="modulo-kpi-item__sub">Puntaje ≥ 80</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Tesis digitales cargadas</span>
          <span className="modulo-kpi-item__valor">
            {tesisCargadasCount} de {listaTitulacion.length}
          </span>
          <span className="modulo-kpi-item__sub">Gestión de tesis por asesor</span>
        </div>
      </div>

      {/* Selector de vista */}
      <div className="modulo-toolbar">
        <div className="modulo-chips-filtros">
          <button
            type="button"
            className={`modulo-chip ${vistaActiva === "titulacion" ? "modulo-chip--activo" : ""}`}
            onClick={() => setVistaActiva("titulacion")}
          >
            1. Tesis de Alumnos y Titulación
          </button>
          <button
            type="button"
            className={`modulo-chip ${vistaActiva === "citas" ? "modulo-chip--activo" : ""}`}
            onClick={() => setVistaActiva("citas")}
          >
            <Calendar size={14} style={{ display: "inline", marginRight: 6 }} />
            2. Citas de Asesoría (Agendar y Check)
          </button>
          <button
            type="button"
            className={`modulo-chip ${vistaActiva === "ponderacion" ? "modulo-chip--activo" : ""}`}
            onClick={() => setVistaActiva("ponderacion")}
          >
            3. Admisión y Ponderación
          </button>
        </div>

        {vistaActiva !== "citas" && (
          <div className="modulo-buscar">
            <Search size={16} className="modulo-buscar__icono" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por alumno, matrícula o folio…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="modulo-buscar__input"
            />
          </div>
        )}
      </div>

      {vistaActiva === "titulacion" && (
        <div className="modulo-tabla-card">
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th className="text-left">Estudiante / Asesor</th>
                  <th>Revisiones Comité</th>
                  <th>Folio Tesis</th>
                  <th className="text-left">Archivo de Tesis (PDF)</th>
                  <th>Gestión de Tesis (Profesor)</th>
                  <th>Constancia</th>
                </tr>
              </thead>
              <tbody>
                {titulacionFiltrada.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="badge-codigo">{t.matricula}</span>
                    </td>
                    <td className="text-left">
                      <span className="nombre-persona">
                        {t.alumno} ({t.semestre})
                      </span>
                      <span className="fecha-suave">Asesor: {t.asesor}</span>
                    </td>
                    <td>
                      <span className="texto-celda-compacta">
                        1ra: {t.primeraRevisionComite} · 2da: {t.segundaRevision}
                      </span>
                    </td>
                    <td>
                      <span className="badge-codigo">{t.numeroTesis}</span>
                    </td>
                    <td className="text-left">
                      {t.tesisArchivo ? (
                        <button
                          type="button"
                          className="archivo-adjunto-btn"
                          onClick={() => abrirPdfTesis(t)}
                          title="Abrir PDF de la tesis"
                        >
                          <FileText size={14} aria-hidden="true" />
                          <span>
                            {t.tesisArchivo} {t.tesisTamano ? `(${t.tesisTamano})` : ""}
                          </span>
                        </button>
                      ) : (
                        <span className="archivo-adjunto-label archivo-adjunto-label--sin">
                          Sin tesis cargada
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="acciones-celda">
                        <button
                          type="button"
                          className="boton-principal boton-principal--sm"
                          onClick={() => abrirSelectorTesisDispositivo(t)}
                          title="Escoger PDF de tesis desde tu dispositivo"
                        >
                          <Upload size={13} aria-hidden="true" />
                          <span>{t.tesisArchivo ? "Cambiar tesis" : "Agregar tesis"}</span>
                        </button>

                        <button
                          type="button"
                          className="boton-secundario boton-secundario--sm boton-eliminar-tesis"
                          onClick={() => handleEliminarTesisAlumno(t)}
                          disabled={!t.tesisArchivo}
                          title="Eliminar tesis del alumno"
                        >
                          <Trash2 size={13} aria-hidden="true" />
                          <span>Eliminar tesis</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="boton-secundario boton-secundario--sm"
                        onClick={() =>
                          toast.success(`Constancia descargada para ${t.alumno}.`)
                        }
                      >
                        <Award size={14} aria-hidden="true" />
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

      {vistaActiva === "citas" && (
        <PanelCitasAsesoria
          rolVista="asesor"
          nombreUsuario={[perfil?.nombre, perfil?.apellido_paterno].filter(Boolean).join(" ")}
        />
      )}

      {vistaActiva === "ponderacion" && (
        <div className="modulo-tabla-card">
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th className="text-left">Aspirante / Comisión</th>
                  <th>Propedéutico (50%)</th>
                  <th>Entrevista (30%)</th>
                  <th>Expediente (20%)</th>
                  <th>Promedio</th>
                  <th>Dictamen</th>
                  <th>Acciones</th>
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
                          {item.comisionEntrevista} ({item.fechaEntrevista})
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
                            aprobado ? "programa-badge--solido" : "programa-badge--neutro"
                          }`}
                        >
                          {aprobado ? "Aceptado" : "No aceptado"}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-celda">
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() =>
                              toast.success(
                                aprobado
                                  ? `Carta de aceptación generada para ${item.aspirante}.`
                                  : `Carta de no aceptación generada para ${item.aspirante}.`
                              )
                            }
                          >
                            <FileText size={13} aria-hidden="true" />
                            <span>Carta</span>
                          </button>
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() => setEvaluacionModal(item)}
                          >
                            <span>Dictamen</span>
                            <ChevronRight size={13} aria-hidden="true" />
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
      )}

      {/* Modal de dictamen */}
      {evaluacionModal && (
        <div className="modal-overlay" onClick={() => setEvaluacionModal(null)}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">{evaluacionModal.folio}</span>
                <h3 className="modal-titulo">Dictamen — {evaluacionModal.aspirante}</h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setEvaluacionModal(null)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarDictamen} className="modal-cuerpo">
              <div className="modal-info-grid">
                <div>
                  <strong>Comisión evaluadora</strong>
                  <p>{evaluacionModal.comisionEntrevista}</p>
                </div>
                <div>
                  <strong>Fecha de entrevista</strong>
                  <p>{evaluacionModal.fechaEntrevista}</p>
                </div>
                <div>
                  <strong>Curso propedéutico (50%)</strong>
                  <p>{evaluacionModal.propedeutico} / 100</p>
                </div>
                <div>
                  <strong>Entrevista (30%)</strong>
                  <p>{evaluacionModal.entrevista} / 100</p>
                </div>
              </div>

              <label className="campo">
                <span className="campo__etiqueta">Observaciones de la comisión</span>
                <textarea rows="3" defaultValue={evaluacionModal.comentariosAcademia} />
              </label>

              <div className="modal-footer">
                <button type="submit" className="boton-principal">
                  <Check size={16} aria-hidden="true" />
                  <span>Guardar dictamen</span>
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
