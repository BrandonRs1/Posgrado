import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ClipboardCheck,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const CURSOS_DOCENTE = [
  {
    id: "PROP-MCM-01",
    nombre: "Curso Propedéutico — Termodinámica y Metalurgia Física",
    grupo: "Propedéutico 2026",
    programa: "Maestría en Ciencias en Metalurgia",
    horario: "Lunes a Viernes · 09:00 – 13:00 hrs",
    aula: "Aula de Posgrado en Metalurgia / Lab. Materiales",
    estudiantes: 16,
    avanceSyllabus: 100,
    estatusActa: "Acta final lista",
  },
  {
    id: "ENT-MCM-02",
    nombre: "Comisión de Entrevistas de Admisión",
    grupo: "Comité de Selección",
    programa: "Maestría en Ciencias en Metalurgia",
    horario: "Calendario programado · 09:00 – 14:00 hrs",
    aula: "Sala de Juntas DEPI",
    estudiantes: 16,
    avanceSyllabus: 100,
    estatusActa: "Dictámenes registrados",
  },
  {
    id: "SEM-MCM-03",
    nombre: "Seminario de Investigación y Revisión de Tesis",
    grupo: "Comité Tutorial",
    programa: "Maestría en Ciencias en Metalurgia",
    horario: "Viernes · 10:00 – 14:00 hrs",
    aula: "Auditorio de Posgrado",
    estudiantes: 14,
    avanceSyllabus: 85,
    estatusActa: "En curso",
  },
];

export default function MisCursos() {
  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Mis Cursos y Comisiones</h1>
          <p className="pagina__desc">
            Grupos asignados, captura de calificaciones del propedéutico, entrevistas y seminarios de tesis.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              toast.success("Acta de calificaciones del Curso Propedéutico descargada.")
            }
          >
            <Download size={16} aria-hidden="true" />
            <span>Descargar acta propedéutico</span>
          </button>
        </div>
      </div>

      <div className="cursos-grid">
        {CURSOS_DOCENTE.map((c) => (
          <article key={c.id} className="curso-card">
            <div className="curso-card__header">
              <div className="curso-card__icono-box" aria-hidden="true">
                <BookOpen size={20} />
              </div>
              <div className="curso-card__identidad">
                <span className="badge-codigo">{c.id}</span>
                <span className="curso-card__grupo">{c.grupo}</span>
              </div>
              <span className="programa-badge programa-badge--suave">{c.estatusActa}</span>
            </div>

            <h2 className="curso-card__nombre">{c.nombre}</h2>
            <p className="curso-card__programa">{c.programa}</p>

            <div className="curso-card__detalles">
              <div className="curso-card__detalle-item">
                <Clock size={14} aria-hidden="true" />
                <span>{c.horario}</span>
              </div>
              <div className="curso-card__detalle-item">
                <MapPin size={14} aria-hidden="true" />
                <span>{c.aula}</span>
              </div>
              <div className="curso-card__detalle-item">
                <Users size={14} aria-hidden="true" />
                <span>
                  <strong>{c.estudiantes}</strong> alumnos registrados
                </span>
              </div>
            </div>

            <div className="curso-card__avance-seccion">
              <div className="curso-card__avance-labels">
                <span>Avance de captura</span>
                <strong>{c.avanceSyllabus}%</strong>
              </div>
              <div className="programa-card__barra">
                <div
                  className="programa-card__barra-progreso"
                  style={{ width: `${c.avanceSyllabus}%` }}
                />
              </div>
            </div>

            <div className="curso-card__footer">
              <button
                type="button"
                className="boton-principal curso-card__accion"
                onClick={() =>
                  toast.info(`Abriendo captura de calificaciones para: ${c.nombre}`)
                }
              >
                <ClipboardCheck size={16} aria-hidden="true" />
                <span>Capturar calificaciones</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
