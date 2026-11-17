import { useState } from "react";
import {
  GraduationCap,
  Search,
  Plus,
  Users,
  BookOpen,
  ChevronRight,
  Download,
  Building,
} from "lucide-react";
import { toast } from "sonner";

const ETAPAS_PROCESO = [
  {
    numero: "Etapa 1",
    titulo: "Convocatoria",
    resumen: "Publicación de calendario, registro de aspirantes y programación de entrevistas.",
  },
  {
    numero: "Etapa 2",
    titulo: "Selección",
    resumen: "Expediente inicial, curso propedéutico, entrevistas y dictamen (mínimo 80 pts).",
  },
  {
    numero: "Etapa 3",
    titulo: "Seguimiento Semestral",
    resumen: "Inscripción, asignación de asesor de tesis, kárdex y evaluación semestral.",
  },
  {
    numero: "Etapa 4",
    titulo: "Titulación",
    resumen: "Revisiones de tesis por comité, entrega digital final y emisión de acta de grado.",
  },
];

const PROGRAMAS_DATA = [
  {
    id: "MCM-ITM",
    codigo: "MCM-2026",
    titulo: "Maestría en Ciencias en Metalurgia",
    grado: "Maestría en Ciencias",
    modalidad: "Presencial · Tiempo completo",
    duracion: "4 semestres (2 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Metalurgia",
    correoCoordinador: "metalurgia.posgrado@morelia.tecnm.mx",
    cupoMaximo: 20,
    inscritos: 16,
    estatus: "Activo",
    area: "Ingeniería Metalúrgica y Ciencia de Materiales",
    requisitoIngreso:
      "Licenciatura afín, promedio mínimo de 80/100, aprobar curso propedéutico, entrevista con academia y comprobante TOEFL vigente.",
  },
  {
    id: "MCIE-ITM",
    codigo: "MCIE-2026",
    titulo: "Maestría en Ciencias en Ingeniería Eléctrica",
    grado: "Maestría en Ciencias",
    modalidad: "Presencial · Tiempo completo",
    duracion: "4 semestres (2 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Ing. Eléctrica",
    correoCoordinador: "electrica.posgrado@morelia.tecnm.mx",
    cupoMaximo: 25,
    inscritos: 19,
    estatus: "Convocatoria abierta",
    area: "Sistemas Eléctricos de Potencia",
    requisitoIngreso:
      "Licenciatura en Ingeniería Eléctrica, Electromecánica o áreas afines. Puntaje mínimo ponderado de 80 puntos.",
  },
  {
    id: "MCII-ITM",
    codigo: "MCII-2026",
    titulo: "Maestría en Ciencias en Ingeniería Electrónica",
    grado: "Maestría en Ciencias",
    modalidad: "Presencial · Tiempo completo",
    duracion: "4 semestres (2 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Ing. Electrónica",
    correoCoordinador: "electronica.posgrado@morelia.tecnm.mx",
    cupoMaximo: 20,
    inscritos: 15,
    estatus: "Convocatoria abierta",
    area: "Electrónica de Potencia y Control",
    requisitoIngreso:
      "Ingeniería Electrónica, Mecatrónica o afín. Aprobar curso propedéutico y entrevista de selección.",
  },
  {
    id: "MSC-ITM",
    codigo: "MSC-2026",
    titulo: "Maestría en Sistemas Computacionales",
    grado: "Maestría Profesionalizante",
    modalidad: "Presencial",
    duracion: "4 semestres (2 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Sistemas Computacionales",
    correoCoordinador: "sistemas.posgrado@morelia.tecnm.mx",
    cupoMaximo: 25,
    inscritos: 22,
    estatus: "Convocatoria abierta",
    area: "Tecnologías de la Información y Cómputo",
    requisitoIngreso: "Ingeniería en Sistemas Computacionales, Informática o afines.",
  },
  {
    id: "MIA-ITM",
    codigo: "MIA-2026",
    titulo: "Maestría en Ingeniería Administrativa",
    grado: "Maestría",
    modalidad: "Presencial / Semipresencial",
    duracion: "4 semestres (2 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Ing. Administrativa",
    correoCoordinador: "administrativa.posgrado@morelia.tecnm.mx",
    cupoMaximo: 30,
    inscritos: 24,
    estatus: "En curso",
    area: "Gestión e Ingeniería Industrial",
    requisitoIngreso: "Título de licenciatura en ingeniería o áreas económico-administrativas.",
  },
  {
    id: "DCIE-ITM",
    codigo: "DCIE-2026",
    titulo: "Doctorado en Ciencias de la Ingeniería",
    grado: "Doctorado",
    modalidad: "Presencial · Tiempo completo",
    duracion: "8 semestres (4 años)",
    minimaAprobatoria: 80,
    coordinador: "Coordinación Doctoral DEPI",
    correoCoordinador: "doctorado.ingenieria@morelia.tecnm.mx",
    cupoMaximo: 15,
    inscritos: 12,
    estatus: "Convocatoria abierta",
    area: "Ciencias de la Ingeniería",
    requisitoIngreso: "Grado de Maestría en Ciencias afín, anteproyecto doctoral y dedicación de tiempo completo.",
  },
];

export default function Programas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("todos");
  const [programaSeleccionado, setProgramaSeleccionado] = useState(null);

  const programasFiltrados = PROGRAMAS_DATA.filter((p) => {
    const coincideTexto =
      p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.area.toLowerCase().includes(busqueda.toLowerCase());
    const coincideGrado =
      filtroGrado === "todos" || p.grado.toLowerCase().includes(filtroGrado.toLowerCase());
    return coincideTexto && coincideGrado;
  });

  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Programas de Posgrado</h1>
          <p className="pagina__desc">
            Oferta académica vigente, cupos, coordinaciones y etapas del proceso escolar.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => toast.success("Catálogo de programas exportado en CSV.")}
          >
            <Download size={16} aria-hidden="true" />
            <span>Exportar catálogo</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() => toast.info("Formulario de registro de nuevo programa.")}
          >
            <Plus size={16} aria-hidden="true" />
            <span>Nuevo programa</span>
          </button>
        </div>
      </div>

      {/* Etapas del proceso escolar */}
      <div className="etapas-grid">
        {ETAPAS_PROCESO.map((etapa) => (
          <div key={etapa.numero} className="etapa-item">
            <span className="badge-codigo">{etapa.numero}</span>
            <h2 className="etapa-item__titulo">{etapa.titulo}</h2>
            <p className="etapa-item__texto">{etapa.resumen}</p>
          </div>
        ))}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="modulo-toolbar">
        <div className="modulo-buscar">
          <Search size={16} className="modulo-buscar__icono" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por nombre, clave o área…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="modulo-buscar__input"
          />
        </div>

        <div className="modulo-chips-filtros">
          {[
            { id: "todos", label: "Todos (6)" },
            { id: "Maestría", label: "Maestrías (5)" },
            { id: "Doctorado", label: "Doctorados (1)" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`modulo-chip ${filtroGrado === chip.id ? "modulo-chip--activo" : ""}`}
              onClick={() => setFiltroGrado(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Programas */}
      <div className="programas-grid">
        {programasFiltrados.map((prog) => {
          const porcentajeCupo = Math.round((prog.inscritos / prog.cupoMaximo) * 100);
          return (
            <article key={prog.id} className="programa-card">
              <div className="programa-card__header">
                <div className="programa-card__icono-box" aria-hidden="true">
                  <GraduationCap size={20} />
                </div>
                <div className="programa-card__identidad">
                  <span className="programa-card__codigo">{prog.codigo}</span>
                  <span className="programa-card__area">{prog.area}</span>
                </div>
                <span className="programa-badge programa-badge--suave">{prog.estatus}</span>
              </div>

              <h2 className="programa-card__titulo">{prog.titulo}</h2>
              <p className="programa-card__grado">
                {prog.grado} · {prog.duracion}
              </p>

              <div className="programa-card__detalles">
                <div className="programa-card__detalle-item">
                  <Building size={14} aria-hidden="true" />
                  <span>{prog.modalidad}</span>
                </div>
                <div className="programa-card__detalle-item">
                  <BookOpen size={14} aria-hidden="true" />
                  <span>Mínimo aprobatorio: {prog.minimaAprobatoria} / 100</span>
                </div>
                <div className="programa-card__detalle-item">
                  <Users size={14} aria-hidden="true" />
                  <span>{prog.coordinador}</span>
                </div>
              </div>

              <div className="programa-card__cupo-seccion">
                <div className="programa-card__cupo-labels">
                  <span>Matrícula</span>
                  <strong>
                    {prog.inscritos} / {prog.cupoMaximo} ({porcentajeCupo}%)
                  </strong>
                </div>
                <div className="programa-card__barra">
                  <div
                    className="programa-card__barra-progreso"
                    style={{ width: `${porcentajeCupo}%` }}
                  />
                </div>
              </div>

              <div className="programa-card__footer">
                <button
                  type="button"
                  className="boton-secundario programa-card__accion"
                  onClick={() => setProgramaSeleccionado(prog)}
                >
                  <span>Ver detalles</span>
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal de Detalle de Programa */}
      {programaSeleccionado && (
        <div className="modal-overlay" onClick={() => setProgramaSeleccionado(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">{programaSeleccionado.codigo}</span>
                <h3 className="modal-titulo">{programaSeleccionado.titulo}</h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setProgramaSeleccionado(null)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <div className="modal-cuerpo">
              <div className="modal-info-grid">
                <div>
                  <strong>Grado</strong>
                  <p>{programaSeleccionado.grado}</p>
                </div>
                <div>
                  <strong>Modalidad</strong>
                  <p>{programaSeleccionado.modalidad}</p>
                </div>
                <div>
                  <strong>Duración</strong>
                  <p>{programaSeleccionado.duracion}</p>
                </div>
                <div>
                  <strong>Calificación mínima</strong>
                  <p>{programaSeleccionado.minimaAprobatoria} / 100</p>
                </div>
                <div className="modal-info-grid__full">
                  <strong>Coordinación</strong>
                  <p>
                    {programaSeleccionado.coordinador} ({programaSeleccionado.correoCoordinador})
                  </p>
                </div>
                <div className="modal-info-grid__full">
                  <strong>Requisitos de ingreso</strong>
                  <p>{programaSeleccionado.requisitoIngreso}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="boton-principal"
                onClick={() => {
                  toast.success(`Convocatoria de ${programaSeleccionado.titulo} descargada.`);
                  setProgramaSeleccionado(null);
                }}
              >
                <Download size={15} aria-hidden="true" />
                <span>Descargar convocatoria PDF</span>
              </button>
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setProgramaSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
