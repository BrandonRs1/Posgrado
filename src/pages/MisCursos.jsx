import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ClipboardCheck,
  Download,
  Award,
  Network,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const CURSOS_DOCENTE = [
  {
    id: "PROP-MCM-01",
    nombre: "Curso Propedéutico — Termodinámica y Metalurgia Física",
    grupo: "Comisión Propedéutico 2026",
    programa: "Maestría en Ciencias en Metalurgia (Piloto ITM)",
    horario: "Lunes a Viernes • 09:00 - 13:00 hrs",
    aula: "Aula de Posgrado en Metalurgia / Lab. Materiales",
    estudiantes: 16,
    avanceSyllabus: 100,
    estatusActa: "Acta Final y Probatorios Listos",
  },
  {
    id: "ENT-MCM-02",
    nombre: "Comisión de Entrevistas de Admisión y Dictamen de Academia",
    grupo: "Comité de Selección",
    programa: "Maestría en Ciencias en Metalurgia (Piloto ITM)",
    horario: "Calendario Programado • 09:00 - 14:00 hrs",
    aula: "Sala de Juntas DEPI - ITM",
    estudiantes: 16,
    avanceSyllabus: 100,
    estatusActa: "Dictámenes en Tabla de Ponderación",
  },
  {
    id: "SEM-MCM-03",
    nombre: "Seminario de Investigación y Revisión Semestral de Tesis (1ra y 2da Revisión)",
    grupo: "Comité Tutorial y Revisores",
    programa: "Maestría en Ciencias en Metalurgia (Piloto ITM)",
    horario: "Viernes • 10:00 - 14:00 hrs",
    aula: "Auditorio de Posgrado en Metalurgia",
    estudiantes: 14,
    avanceSyllabus: 85,
    estatusActa: "Abierta para 1ra y 2da Revisión",
  },
];

export default function MisCursos() {
  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Portal del Docente • Núcleo Académico Básico (ITM)</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">
              Propedéutico, Comisiones, Seminarios e Indicadores Docentes
            </span>
          </div>
          <h1 className="pagina__titulo">
            Comisiones Académicas, Curso Propedéutico y Productividad NAB
          </h1>
          <p className="pagina__desc">
            Captura de actas finales y probatorios del Curso Propedéutico, dictámenes de entrevista,
            revisión semestral de seminario y registro de indicadores del académico (SNI, Redes,
            Artículos TecNM).
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() =>
              toast.success("Acta de calificaciones finales y probatorios del Propedéutico descargados.")
            }
          >
            <Download size={16} />
            <span>Descargar Acta Final Propedéutico</span>
          </button>
        </div>
      </div>

      {/* KPIs de los Indicadores Verdes que dependen de los Académicos */}
      <div className="inicio-kpis" style={{ marginBottom: "20px" }}>
        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--azul">
            <Award size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Registro SNI (IND-V06)</span>
            <span className="kpi-card__valor">SNI Nivel I Vigente</span>
            <span className="kpi-card__subtext">Suma a tasa de variación SNI</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--verde">
            <Network size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Redes y Convocatorias (IND-V02, V03)</span>
            <span className="kpi-card__valor">2 Redes • 2 Convocatorias</span>
            <span className="kpi-card__subtext">Participación activa en investigación</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--morado">
            <FileText size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Artículos Indexados TecNM (IND-V08)</span>
            <span className="kpi-card__valor">3 Artículos JCR/Scopus</span>
            <span className="kpi-card__subtext">Adscripción TecNM / ITM</span>
          </div>
        </div>
      </div>

      {/* Grid de Cursos y Comisiones */}
      <div className="cursos-grid">
        {CURSOS_DOCENTE.map((c) => (
          <article key={c.id} className="curso-card">
            <div className="curso-card__header">
              <div className="curso-card__icono-box">
                <BookOpen size={22} />
              </div>
              <div className="curso-card__identidad">
                <span className="badge-codigo">{c.id}</span>
                <span className="curso-card__grupo">{c.grupo}</span>
              </div>
              <span className="programa-badge programa-badge--verde">{c.estatusActa}</span>
            </div>

            <h2 className="curso-card__nombre">{c.nombre}</h2>
            <p className="curso-card__programa">{c.programa}</p>

            <div className="curso-card__detalles">
              <div className="curso-card__detalle-item">
                <Clock size={14} />
                <span>{c.horario}</span>
              </div>
              <div className="curso-card__detalle-item">
                <MapPin size={14} />
                <span>{c.aula}</span>
              </div>
              <div className="curso-card__detalle-item">
                <Users size={14} />
                <span>
                  <strong>{c.estudiantes}</strong> aspirantes / estudiantes evaluados
                </span>
              </div>
            </div>

            <div className="curso-card__avance-seccion">
              <div className="curso-card__avance-labels">
                <span>Avance de Evaluación y Probatorios</span>
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
                  toast.info(
                    `Abriendo captura de acta, probatorios y dictamen para: ${c.nombre}`
                  )
                }
              >
                <ClipboardCheck size={16} />
                <span>Capturar Calificaciones / Dictamen</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
