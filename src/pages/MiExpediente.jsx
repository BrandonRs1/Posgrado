import { useState, useRef, useEffect } from "react";
import { FileText, Upload, Download, Calendar, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import PanelCitasAsesoria from "../components/PanelCitasAsesoria.jsx";
import {
  obtenerDocumentosExpediente,
  subirDocumentoAlumnoDesdeDispositivo,
} from "../lib/expedienteYCitas.js";

export default function MiExpediente() {
  const { perfil } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState("documentos"); // 'documentos' | 'citas'
  const [etapaFiltro, setEtapaFiltro] = useState("todas");
  const [documentos, setDocumentos] = useState(() => obtenerDocumentosExpediente());
  const [docIdSubiendo, setDocIdSubiendo] = useState(null);
  const inputArchivoRef = useRef(null);

  const nombreAlumno = [perfil?.nombre, perfil?.apellido_paterno, perfil?.apellido_materno]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const sincronizar = () => setDocumentos(obtenerDocumentosExpediente());
    window.addEventListener("posgrados:sync", sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      window.removeEventListener("posgrados:sync", sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  const abrirSelectorDispositivo = (docId) => {
    setDocIdSubiendo(docId);
    if (inputArchivoRef.current) {
      inputArchivoRef.current.value = "";
      inputArchivoRef.current.click();
    }
  };

  const alSeleccionarArchivoDesdeDispositivo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !docIdSubiendo) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Por favor selecciona un archivo en formato PDF (.pdf).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo supera el tamaño máximo permitido de 10 MB.");
      return;
    }

    const docObjetivo = documentos.find((d) => d.id === docIdSubiendo);
    const actualizados = await subirDocumentoAlumnoDesdeDispositivo(
      docIdSubiendo,
      file,
      perfil?.id
    );
    setDocumentos(actualizados);
    toast.success(
      `Archivo "${file.name}" agregado correctamente para: ${docObjetivo?.nombre || docIdSubiendo}`
    );
    setDocIdSubiendo(null);
  };

  const abrirVistaPreviaPdf = (doc) => {
    if (doc.archivoUrl) {
      window.open(doc.archivoUrl, "_blank", "noopener,noreferrer");
    } else {
      toast.success(`Abriendo documento: ${doc.archivo}`);
    }
  };

  const subidos = documentos.filter((d) => Boolean(d.archivo)).length;
  const porcentaje = Math.round((subidos / documentos.length) * 100);

  const documentosFiltrados = documentos.filter(
    (d) => etapaFiltro === "todas" || d.etapa === etapaFiltro
  );

  return (
    <section className="modulo-seccion">
      {/* Input oculto para elegir tesis o documento desde el dispositivo del alumno */}
      <input
        ref={inputArchivoRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={alSeleccionarArchivoDesdeDispositivo}
      />

      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Mi Expediente Escolar y Asesorías</h1>
          <p className="pagina__desc">
            Carga de tesis y documentos desde tu dispositivo, seguimiento por etapa y agenda de
            citas con tu asesor de tesis.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => toast.success("Formatos oficiales descargados.")}
          >
            <Download size={16} aria-hidden="true" />
            <span>Descargar formatos</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() => abrirSelectorDispositivo("TIT-03")}
          >
            <Upload size={16} aria-hidden="true" />
            <span>Agregar tesis desde mi dispositivo</span>
          </button>
        </div>
      </div>

      {/* Resumen escolar conciso */}
      <div className="modulo-kpis-fila">
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Asesor de tesis</span>
          <span className="modulo-kpi-item__valor">Dr. Roberto Sandoval</span>
          <span className="modulo-kpi-item__sub">Asignación registrada</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Documentos en expediente</span>
          <span className="modulo-kpi-item__valor">
            {subidos} de {documentos.length}
          </span>
          <span className="modulo-kpi-item__sub">Tesis y requisitos digitales</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Avance global</span>
          <span className="modulo-kpi-item__valor">{porcentaje}%</span>
          <div className="programa-card__barra">
            <div
              className="programa-card__barra-progreso"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </div>

      {/* Selector de apartado: Expediente / Citas de Asesoría */}
      <div className="modulo-toolbar">
        <div className="modulo-chips-filtros">
          <button
            type="button"
            className={`modulo-chip ${seccionActiva === "documentos" ? "modulo-chip--activo" : ""}`}
            onClick={() => setSeccionActiva("documentos")}
          >
            <FolderOpen size={14} style={{ display: "inline", marginRight: 6 }} />
            1. Tesis y Documentos del Expediente
          </button>
          <button
            type="button"
            className={`modulo-chip ${seccionActiva === "citas" ? "modulo-chip--activo" : ""}`}
            onClick={() => setSeccionActiva("citas")}
          >
            <Calendar size={14} style={{ display: "inline", marginRight: 6 }} />
            2. Agendar Citas y Fechas con mi Asesor
          </button>
        </div>

        {seccionActiva === "documentos" && (
          <div className="modulo-chips-filtros">
            {[
              { id: "todas", label: `Todos (${documentos.length})` },
              { id: "Aspirante", label: "Aspirante (4)" },
              { id: "Aceptado / Semestral", label: "Aceptado y Semestral (6)" },
              { id: "Titulación", label: "Titulación y Tesis (5)" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`modulo-chip ${etapaFiltro === chip.id ? "modulo-chip--activo" : ""}`}
                onClick={() => setEtapaFiltro(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {seccionActiva === "documentos" ? (
        <div className="modulo-tabla-card">
          <div className="table-responsive">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Clave</th>
                  <th>Etapa</th>
                  <th className="text-left">Documento / Tesis</th>
                  <th>Archivo desde tu dispositivo</th>
                  <th>Estatus</th>
                  <th>Acciones (Solo Agregar / Ver)</th>
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <span className="badge-codigo">{doc.id}</span>
                    </td>
                    <td>
                      <span className="programa-badge programa-badge--suave">{doc.etapa}</span>
                    </td>
                    <td className="text-left">
                      <span className="nombre-persona">{doc.nombre}</span>
                    </td>
                    <td>
                      {doc.archivo ? (
                        <span className="archivo-adjunto-label">
                          <FileText size={14} aria-hidden="true" />
                          <span>
                            {doc.archivo} ({doc.tamano})
                          </span>
                        </span>
                      ) : (
                        <span className="archivo-adjunto-label archivo-adjunto-label--sin">
                          Sin archivo cargado
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`programa-badge ${
                          doc.estatus === "Validado"
                            ? "programa-badge--solido"
                            : doc.estatus === "Pendiente"
                            ? "programa-badge--neutro"
                            : "programa-badge--suave"
                        }`}
                      >
                        {doc.estatus}
                      </span>
                    </td>
                    <td>
                      {/* El alumno SOLO tiene botón de agregar desde su dispositivo (y ver/formato), NUNCA de eliminar */}
                      <div className="acciones-celda">
                        {doc.tienePlantilla && (
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() => toast.success(`Formato descargado: ${doc.nombre}`)}
                          >
                            <Download size={13} aria-hidden="true" />
                            <span>Formato</span>
                          </button>
                        )}

                        {doc.archivo && (
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() => abrirVistaPreviaPdf(doc)}
                          >
                            <Download size={13} aria-hidden="true" />
                            <span>Ver PDF</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className="boton-principal boton-principal--sm"
                          onClick={() => abrirSelectorDispositivo(doc.id)}
                        >
                          <Upload size={13} aria-hidden="true" />
                          <span>
                            {doc.esTesis
                              ? "Agregar tesis"
                              : doc.archivo
                              ? "Agregar nueva versión"
                              : "Agregar desde dispositivo"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <PanelCitasAsesoria rolVista="alumno" nombreUsuario={nombreAlumno} />
      )}
    </section>
  );
}
