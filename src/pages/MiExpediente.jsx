import { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  UserCheck,
  Award,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const DOCUMENTOS_METALURGIA = [
  // ETAPA ASPIRANTE (4 documentos oficiales)
  {
    id: "ASP-01",
    etapa: "Aspirante",
    nombre: "Solicitud de Ingreso al Posgrado",
    archivo: "Solicitud_Ingreso_Metalurgia.pdf",
    fecha: "12/10/2026",
    estatus: "Validado",
    tamano: "1.1 MB",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "ASP-02",
    etapa: "Aspirante",
    nombre: "Certificado de Calificaciones de Licenciatura",
    archivo: "Certificado_Calificaciones_Lic.pdf",
    fecha: "12/10/2026",
    estatus: "Validado",
    tamano: "2.3 MB",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "ASP-03",
    etapa: "Aspirante",
    nombre: "Cédula Profesional de Licenciatura",
    archivo: "Cedula_Licenciatura.pdf",
    fecha: "13/10/2026",
    estatus: "Validado",
    tamano: "950 KB",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "ASP-04",
    etapa: "Aspirante",
    nombre: "Identificación Oficial Vigente (INE)",
    archivo: "INE_Vigente.pdf",
    fecha: "13/10/2026",
    estatus: "Validado",
    tamano: "780 KB",
    obligatorio: true,
    tienePlantilla: false,
  },

  // ETAPA ACEPTADO Y SEGUIMIENTO SEMESTRAL (8 documentos + EDB con Kárdex)
  {
    id: "ACE-01",
    etapa: "Aceptado / Semestral",
    nombre: "Consentimiento Informado para Uso de Datos Personales",
    archivo: "Consentimiento_Datos_ITM.pdf",
    fecha: "20/10/2026",
    estatus: "Validado",
    tamano: "640 KB",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "ACE-02",
    etapa: "Aceptado / Semestral",
    nombre: "Carta de Aceptación Oficial emitida por Coordinación–Consejo",
    archivo: "Carta_Aceptacion_MCM_2026.pdf",
    fecha: "21/10/2026",
    estatus: "Validado",
    tamano: "890 KB",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "ACE-03",
    etapa: "Aceptado / Semestral",
    nombre: "Certificado Global de Licenciatura",
    archivo: "Certificado_Global_Licenciatura.pdf",
    fecha: "21/10/2026",
    estatus: "Validado",
    tamano: "2.8 MB",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "ACE-04",
    etapa: "Aceptado / Semestral",
    nombre: "Comprobante de Idioma Inglés TOEFL (Vigencia no mayor a 2 años)",
    archivo: "TOEFL_Vigente_24meses.pdf",
    fecha: "22/10/2026",
    estatus: "Validado",
    tamano: "1.4 MB",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "ACE-05",
    etapa: "Aceptado / Semestral",
    nombre: "Carta de Exclusividad SECIHTI (Descarga de formato y carga firmada)",
    archivo: "Carta_Exclusividad_SECIHTI_Firmada.pdf",
    fecha: "24/10/2026",
    estatus: "Validado",
    tamano: "1.2 MB",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "SEM-01",
    etapa: "Aceptado / Semestral",
    nombre: "EDB (Evaluación del Desempeño del Becario) con Kárdex Actualizado (Semestral)",
    archivo: "EDB_y_Kardex_Semestre_Actual.pdf",
    fecha: "30/10/2026",
    estatus: "Validado",
    tamano: "1.9 MB",
    obligatorio: true,
    tienePlantilla: true,
  },

  // ETAPA TITULACIÓN (Proceso completo de Titulación en Metalurgia)
  {
    id: "TIT-01",
    etapa: "Titulación",
    nombre: "1ra Revisión de Tesis Firmada por Comité Tutorial",
    archivo: "1ra_Revision_Tesis_Firmada_Comite.pdf",
    fecha: "02/11/2026",
    estatus: "Validado",
    tamano: "3.1 MB",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "TIT-02",
    etapa: "Titulación",
    nombre: "2da Revisión de Tesis",
    archivo: "2da_Revision_Tesis.pdf",
    fecha: "04/11/2026",
    estatus: "En Revisión",
    tamano: "3.4 MB",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "TIT-03",
    etapa: "Titulación",
    nombre: "Tesis Digital Versión Final (Número Asignado: MCM-ITM-2026-008)",
    archivo: null,
    fecha: "—",
    estatus: "Pendiente",
    tamano: "—",
    obligatorio: true,
    tienePlantilla: false,
  },
  {
    id: "TIT-04",
    etapa: "Titulación",
    nombre: "Trámite DEPI / Escolares y Solicitud de Acta de Grado",
    archivo: null,
    fecha: "—",
    estatus: "Pendiente",
    tamano: "—",
    obligatorio: true,
    tienePlantilla: true,
  },
  {
    id: "TIT-05",
    etapa: "Titulación",
    nombre: "Carta de Retribución Social (SECIHTI)",
    archivo: null,
    fecha: "—",
    estatus: "Pendiente",
    tamano: "—",
    obligatorio: true,
    tienePlantilla: true,
  },
];

export default function MiExpediente() {
  const [etapaFiltro, setEtapaFiltro] = useState("todas");

  const validados = DOCUMENTOS_METALURGIA.filter((d) => d.estatus === "Validado").length;
  const porcentaje = Math.round((validados / DOCUMENTOS_METALURGIA.length) * 100);

  const documentosFiltrados = DOCUMENTOS_METALURGIA.filter(
    (d) => etapaFiltro === "todas" || d.etapa === etapaFiltro
  );

  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Portal del Estudiante • Metalurgia ITM</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">
              Expediente por Etapas e Indicadores del Alumno
            </span>
          </div>
          <h1 className="pagina__titulo">
            Mi Expediente Digital (Aspirante, Admisión, EDB Semestral y Titulación)
          </h1>
          <p className="pagina__desc">
            Carga y descarga de formatos oficiales (Carta de Exclusividad SECIHTI, EDB con Kárdex
            cada semestre, revisiones de tesis y Carta de Retribución Social).
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              toast.success("Formato de Carta de Exclusividad SECIHTI descargado.")
            }
          >
            <Download size={16} />
            <span>Descargar Formato Carta SECIHTI</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() =>
              toast.info("Selecciona cualquier documento de la tabla para adjuntar tu PDF.")
            }
          >
            <Upload size={16} />
            <span>Subir EDB + Kárdex / Documento</span>
          </button>
        </div>
      </div>

      {/* Resumen de Asesor de Tesis e Indicadores del Alumno */}
      <div className="inicio-kpis" style={{ marginBottom: "20px" }}>
        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--azul">
            <UserCheck size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Asesor de Tesis Asignado</span>
            <span className="kpi-card__valor">Dr. Roberto Sandoval</span>
            <span className="kpi-card__subtext">Notificación oficial enviada ✓</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--verde">
            <Award size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Beca y EDB + Kárdex</span>
            <span className="kpi-card__valor">Becario SECIHTI</span>
            <span className="kpi-card__subtext">EDB semestral vigente (IND-V05)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--morado">
            <CheckCircle2 size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Proyectos y Convocatorias</span>
            <span className="kpi-card__valor">Activo en Proyecto</span>
            <span className="kpi-card__subtext">Financiado TecNM (IND-V01, V04, V07)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--ambar">
            <FileText size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Productividad y Movilidad</span>
            <span className="kpi-card__valor">1 Artículo • Estancia</span>
            <span className="kpi-card__subtext">Revista indexada TecNM (IND-V08, V09)</span>
          </div>
        </div>
      </div>

      {/* Barra de Progreso General del Expediente */}
      <div className="expediente-progreso-card">
        <div className="expediente-progreso-card__icono">
          <ShieldCheck size={28} />
        </div>
        <div className="expediente-progreso-card__info">
          <div className="expediente-progreso-card__meta">
            <span className="expediente-progreso-card__titulo">
              Avance Integral del Proceso Metalurgia ({validados} de {DOCUMENTOS_METALURGIA.length}{" "}
              requisitos validados)
            </span>
            <strong className="expediente-progreso-card__porcentaje">{porcentaje}%</strong>
          </div>
          <div className="expediente-progreso-card__track">
            <div
              className="expediente-progreso-card__bar"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="expediente-progreso-card__sub">
            Incluye documentos de Aspirante (4), Aceptado y Seguimiento Semestral EDB+Kárdex (6) y
            Titulación (5).
          </p>
        </div>
      </div>

      {/* Filtro por Etapa del Proceso */}
      <div className="modulo-toolbar">
        <div className="modulo-chips-filtros">
          {[
            { id: "todas", label: "Todas las Etapas (15)" },
            { id: "Aspirante", label: "1. Etapa Aspirante (4)" },
            { id: "Aceptado / Semestral", label: "2. Aceptado y EDB + Kárdex Semestral (6)" },
            { id: "Titulación", label: "3. Etapa de Titulación y Acta de Grado (5)" },
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
      </div>

      {/* Tabla de Documentos por Etapa */}
      <div className="modulo-tabla-card">
        <div className="table-responsive">
          <table className="styled-table styled-table--elevated">
            <thead>
              <tr>
                <th>Código</th>
                <th>Etapa</th>
                <th className="text-left">Documento / Requisito del Proceso</th>
                <th>Archivo en Sistema</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentosFiltrados.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <span className="badge-codigo">{doc.id}</span>
                  </td>
                  <td>
                    <span className="programa-badge programa-badge--azul">{doc.etapa}</span>
                  </td>
                  <td className="text-left">
                    <span className="nombre-persona">{doc.nombre}</span>
                    {doc.obligatorio && <span className="tag-obligatorio">Obligatorio</span>}
                  </td>
                  <td>
                    {doc.archivo ? (
                      <span className="archivo-adjunto-label">
                        <FileText size={14} />
                        <span>
                          {doc.archivo} ({doc.tamano})
                        </span>
                      </span>
                    ) : (
                      <span className="archivo-adjunto-label archivo-adjunto-label--sin">
                        Pendiente de carga
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`programa-badge ${
                        doc.estatus === "Validado"
                          ? "programa-badge--verde"
                          : doc.estatus === "Pendiente"
                          ? "programa-badge--ambar"
                          : "programa-badge--azul"
                      }`}
                    >
                      {doc.estatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      {doc.tienePlantilla && (
                        <button
                          type="button"
                          className="boton-secundario boton-secundario--sm"
                          onClick={() =>
                            toast.success(`Plantilla oficial descargada para: ${doc.nombre}`)
                          }
                        >
                          <Download size={13} />
                          <span>Formato</span>
                        </button>
                      )}
                      {doc.archivo ? (
                        <button
                          type="button"
                          className="boton-secundario boton-secundario--sm"
                          onClick={() => toast.success(`Descargando ${doc.archivo}`)}
                        >
                          <Download size={13} />
                          <span>Ver PDF</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="boton-principal boton-principal--sm"
                          onClick={() => toast.info(`Subiendo archivo PDF para: ${doc.nombre}`)}
                        >
                          <Upload size={13} />
                          <span>Subir PDF</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
