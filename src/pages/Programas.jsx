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
  CheckCircle2,
  ClipboardList,
  Award,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";

const ETAPAS_METALURGIA = [
  {
    numero: "Etapa 1",
    titulo: "Planeación",
    icono: ClipboardList,
    pasos: [
      "Calendario de actividades del proceso",
      "Diseño y promoción de convocatoria",
      "Registro y contacto de interesados",
      "Comisión de profesores de Curso Propedéutico y Entrevistas",
      "Programación de calendario de entrevistas",
    ],
  },
  {
    numero: "Etapa 2",
    titulo: "Gestión Operativa",
    icono: FileCheck2,
    pasos: [
      "Expediente de aspirante (Solicitud, Certificado, Cédula, INE)",
      "Curso Propedéutico (Acta de calificaciones finales + probatorios)",
      "Entrevistas (Formato dictamen de academia + comentarios y calificación)",
      "Tabla de ponderación de aspirantes (Calificación mínima aprobatoria: 80)",
      "Reunión Coordinación–Consejo, listado de aceptados a DEPI y Cartas de Aceptación / No Aceptación",
    ],
  },
  {
    numero: "Etapa 3",
    titulo: "Admisión y Seguimiento Semestral",
    icono: Users,
    pasos: [
      "Expediente de aceptado (8 documentos + TOEFL vigencia 2 años + Carta Exclusividad SECIHTI)",
      "Carga semestral de EDB (Evaluación del Desempeño del Becario) con Kárdex actualizado",
      "Asignación y notificación oficial de Asesor de Tesis",
      "Revisión semestral con seminario de investigación",
    ],
  },
  {
    numero: "Etapa 4",
    titulo: "Titulación",
    icono: Award,
    pasos: [
      "Revisión de expediente de titulación",
      "1ra Revisión de tesis firmada por comité y 2da Revisión de tesis",
      "Asignación de número de tesis y recepción de tesis digital versión final",
      "Trámite en DEPI / Escolares y solicitud de Acta de Grado",
      "Generación de Carta de Retribución Social",
    ],
  },
];

const PROGRAMAS_DATA = [
  {
    id: "MCM-ITM",
    codigo: "MCM-2026 (PILOTO)",
    titulo: "Maestría en Ciencias en Metalurgia",
    grado: "Maestría en Ciencias • SNP / SECIHTI",
    modalidad: "Presencial de Tiempo Completo (ITM)",
    duracion: "4 Semestres (2 años)",
    creditos: 100,
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Metalurgia",
    correoCoordinador: "metalurgia.posgrado@morelia.tecnm.mx",
    cupoMaximo: 20,
    inscritos: 16,
    estatus: "Programa Piloto Activo",
    area: "Ingeniería Metalúrgica y Ciencia de Materiales",
    requisitoIngreso:
      "Licenciatura en Ingeniería en Materiales, Metalurgia, Química, Mecánica o afín. Promedio mínimo 80/100, aprobar Curso Propedéutico, Entrevista con Academia y TOEFL (vigencia 2 años).",
  },
  {
    id: "MCIE-ITM",
    codigo: "MCIE-2026",
    titulo: "Maestría en Ciencias en Ingeniería Eléctrica",
    grado: "Maestría en Ciencias • SNP / SECIHTI",
    modalidad: "Presencial de Tiempo Completo (ITM)",
    duracion: "4 Semestres (2 años)",
    creditos: 100,
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Ing. Eléctrica",
    correoCoordinador: "electrica.posgrado@morelia.tecnm.mx",
    cupoMaximo: 25,
    inscritos: 19,
    estatus: "Convocatoria Abierta",
    area: "Sistemas Eléctricos de Potencia",
    requisitoIngreso:
      "Licenciatura en Ingeniería Eléctrica, Electromecánica o áreas afines. Puntaje mínimo ponderado de 80 puntos.",
  },
  {
    id: "MCII-ITM",
    codigo: "MCII-2026",
    titulo: "Maestría en Ciencias en Ingeniería Electrónica",
    grado: "Maestría en Ciencias • SNP / SECIHTI",
    modalidad: "Presencial de Tiempo Completo (ITM)",
    duracion: "4 Semestres (2 años)",
    creditos: 100,
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Posgrado en Ing. Electrónica",
    correoCoordinador: "electronica.posgrado@morelia.tecnm.mx",
    cupoMaximo: 20,
    inscritos: 15,
    estatus: "Convocatoria Abierta",
    area: "Electrónica de Potencia y Control",
    requisitoIngreso:
      "Ingeniería Electrónica, Mecatrónica o afín. Aprobar curso propedéutico y entrevista de selección.",
  },
  {
    id: "MSC-ITM",
    codigo: "MSC-2026",
    titulo: "Maestría en Sistemas Computacionales",
    grado: "Maestría Profesionalizante • SNP / SECIHTI",
    modalidad: "Presencial (ITM)",
    duracion: "4 Semestres (2 años)",
    creditos: 100,
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Sistemas Computacionales",
    correoCoordinador: "sistemas.posgrado@morelia.tecnm.mx",
    cupoMaximo: 25,
    inscritos: 22,
    estatus: "Convocatoria Abierta",
    area: "Tecnologías de la Información y Cómputo",
    requisitoIngreso:
      "Ingeniería en Sistemas Computacionales, Informática o afines.",
  },
  {
    id: "MIA-ITM",
    codigo: "MIA-2026",
    titulo: "Maestría en Ingeniería Administrativa",
    grado: "Maestría • TecNM / ITM",
    modalidad: "Presencial / Semipresencial",
    duracion: "4 Semestres (2 años)",
    creditos: 100,
    minimaAprobatoria: 80,
    coordinador: "Coordinación de Ing. Administrativa",
    correoCoordinador: "administrativa.posgrado@morelia.tecnm.mx",
    cupoMaximo: 30,
    inscritos: 24,
    estatus: "En Curso",
    area: "Gestión e Ingeniería Industrial",
    requisitoIngreso:
      "Título de licenciatura en ingeniería o áreas económico-administrativas.",
  },
  {
    id: "DCIE-ITM",
    codigo: "DCIE-2026",
    titulo: "Doctorado en Ciencias de la Ingeniería",
    grado: "Doctorado • SNP / SECIHTI",
    modalidad: "Presencial de Tiempo Completo (ITM)",
    duracion: "8 Semestres (4 años)",
    creditos: 200,
    minimaAprobatoria: 80,
    coordinador: "Coordinación Doctoral DEPI - ITM",
    correoCoordinador: "doctorado.ingenieria@morelia.tecnm.mx",
    cupoMaximo: 15,
    inscritos: 12,
    estatus: "Convocatoria Abierta",
    area: "Ciencias de la Ingeniería (Metalurgia, Eléctrica, Electrónica)",
    requisitoIngreso:
      "Grado de Maestría en Ciencias afín, anteproyecto doctoral y carta de exclusividad SECIHTI.",
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
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>DEPI • Instituto Tecnológico de Morelia</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">6 Programas de Posgrado ITM</span>
          </div>
          <h1 className="pagina__titulo">Programas de Posgrado y Proceso Metalurgia</h1>
          <p className="pagina__desc">
            Padrón de los 6 posgrados del ITM (TecNM) con flujo operativo piloto en la{" "}
            <strong>Maestría en Ciencias en Metalurgia</strong>.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => toast.success("Catálogo de los 6 posgrados del ITM exportado en CSV.")}
          >
            <Download size={16} />
            <span>Exportar Padrón DEPI</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() =>
              toast.info("Registro de nuevo programa autorizado para indicador de Mejora Continua.")
            }
          >
            <Plus size={16} />
            <span>Registrar Nuevo Posgrado</span>
          </button>
        </div>
      </div>

      {/* Flujo Oficial de 4 Etapas del Proceso de Metalurgia */}
      <div className="reporte-panel" style={{ marginBottom: "24px" }}>
        <div className="reporte-panel__header">
          <div>
            <h3 className="reporte-panel__titulo">
              Flujo Operativo Oficial — Maestría en Ciencias en Metalurgia (Programa Piloto)
            </h3>
            <p className="pagina__desc" style={{ marginTop: "4px" }}>
              Estandarización de las 4 etapas desde la convocatoria hasta la obtención del Acta de Grado y Carta de Retribución Social.
            </p>
          </div>
          <span className="programa-badge programa-badge--verde">Calificación Mínima: 80 / 100</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginTop: "12px",
          }}
        >
          {ETAPAS_METALURGIA.map((etapa) => {
            const IconoEtapa = etapa.icono;
            return (
              <div
                key={etapa.numero}
                style={{
                  background: "var(--superficie-2)",
                  border: "1px solid var(--borde)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div className="programa-card__icono-box" style={{ width: "36px", height: "36px" }}>
                    <IconoEtapa size={18} />
                  </div>
                  <div>
                    <span className="badge-codigo">{etapa.numero}</span>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--texto)" }}>
                      {etapa.titulo}
                    </h4>
                  </div>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px" }}>
                  {etapa.pasos.map((paso) => (
                    <li
                      key={paso}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "6px",
                        fontSize: "0.8rem",
                        color: "var(--texto-suave)",
                        lineHeight: 1.4,
                      }}
                    >
                      <CheckCircle2
                        size={14}
                        style={{ color: "var(--azul-rey)", flexShrink: 0, marginTop: "2px" }}
                      />
                      <span>{paso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="modulo-toolbar">
        <div className="modulo-buscar">
          <Search size={16} className="modulo-buscar__icono" />
          <input
            type="text"
            placeholder="Buscar posgrado del ITM por nombre, clave o área…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="modulo-buscar__input"
          />
        </div>

        <div className="modulo-chips-filtros">
          {[
            { id: "todos", label: "Los 6 Posgrados ITM" },
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
                <div className="programa-card__icono-box">
                  <GraduationCap size={22} />
                </div>
                <div className="programa-card__identidad">
                  <span className="programa-card__codigo">{prog.codigo}</span>
                  <span className="programa-card__area">{prog.area}</span>
                </div>
                <span
                  className={`programa-badge ${
                    prog.estatus.includes("Piloto") || prog.estatus === "Convocatoria Abierta"
                      ? "programa-badge--verde"
                      : "programa-badge--azul"
                  }`}
                >
                  {prog.estatus}
                </span>
              </div>

              <h2 className="programa-card__titulo">{prog.titulo}</h2>
              <p className="programa-card__grado">
                {prog.grado} • {prog.duracion}
              </p>

              <div className="programa-card__detalles">
                <div className="programa-card__detalle-item">
                  <Building size={14} />
                  <span>
                    Modalidad: <strong>{prog.modalidad}</strong>
                  </span>
                </div>
                <div className="programa-card__detalle-item">
                  <BookOpen size={14} />
                  <span>
                    Calificación mínima aprobatoria: <strong>{prog.minimaAprobatoria} / 100</strong>
                  </span>
                </div>
                <div className="programa-card__detalle-item">
                  <Users size={14} />
                  <span>
                    Coordinación: <strong>{prog.coordinador}</strong>
                  </span>
                </div>
              </div>

              <div className="programa-card__cupo-seccion">
                <div className="programa-card__cupo-labels">
                  <span>Matrícula Vigente</span>
                  <strong>
                    {prog.inscritos} de {prog.cupoMaximo} ({porcentajeCupo}%)
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
                  <span>Ver lineamientos y proceso</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal de Detalle de Programa */}
      {programaSeleccionado && (
        <div className="modal-overlay" onClick={() => setProgramaSeleccionado(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">{programaSeleccionado.codigo}</span>
                <h3 className="modal-titulo">{programaSeleccionado.titulo}</h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setProgramaSeleccionado(null)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-cuerpo">
              <div className="modal-info-grid">
                <div>
                  <strong>Reconocimiento:</strong>
                  <p>{programaSeleccionado.grado}</p>
                </div>
                <div>
                  <strong>Modalidad:</strong>
                  <p>{programaSeleccionado.modalidad}</p>
                </div>
                <div>
                  <strong>Duración Oficial:</strong>
                  <p>{programaSeleccionado.duracion}</p>
                </div>
                <div>
                  <strong>Calificación Mínima Aprobatoria:</strong>
                  <p>{programaSeleccionado.minimaAprobatoria} puntos (Escala 0 a 100)</p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Coordinación Académica:</strong>
                  <p>
                    {programaSeleccionado.coordinador} ({programaSeleccionado.correoCoordinador})
                  </p>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Requisitos de Ingreso y Permanencia:</strong>
                  <p>{programaSeleccionado.requisitoIngreso}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="boton-principal"
                onClick={() => {
                  toast.success(
                    `Convocatoria y proceso de ${programaSeleccionado.titulo} descargados.`
                  );
                  setProgramaSeleccionado(null);
                }}
              >
                <Download size={15} />
                <span>Descargar Convocatoria y Proceso PDF</span>
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
