import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Check,
  X,
  CalendarPlus,
  Bell,
  Ban,
  RefreshCw,
  MapPin,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  obtenerCitasAsesoria,
  agendarNuevaCita,
  aceptarCitaAsesoria,
  rechazarCitaAsesoria,
  cancelarCitaAsesoria,
  marcarCheckAsistenciaCita,
  simularPasoDeUnaHoraSinCheck,
  obtenerTimestampCita,
} from "../lib/expedienteYCitas.js";

const ALUMNOS_DISPONIBLES = [
  { nombre: "Hernández Soto Mariana", matricula: "M24120104", asesor: "Dr. Roberto Sandoval Gómez" },
  { nombre: "Navarro Ruiz Emiliano", matricula: "M24120109", asesor: "Dra. Carmen Morales Benítez" },
  { nombre: "Aguilar Domínguez Sofía", matricula: "M25120042", asesor: "Dr. Luis Villaseñor Reyes" },
];

function formatearFechaCorta(fechaIso) {
  if (!fechaIso) return "—";
  try {
    const [anio, mes, dia] = fechaIso.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fechaIso;
  }
}

function formatearFechaCreacion(isoString) {
  if (!isoString) return "Reciente";
  try {
    const f = new Date(isoString);
    return f.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Reciente";
  }
}

function etiquetaTiempoRestanteCheck(cita) {
  if (cita.estatus !== "confirmada") return null;
  const citaMs = obtenerTimestampCita(cita.fechaCita, cita.horaCita);
  if (!citaMs) return null;

  const ahoraMs = Date.now();
  const limiteMs = citaMs + 60 * 60 * 1000;

  if (ahoraMs < citaMs) {
    return "Pendiente de llegar a la hora de la cita (límite de check: 1h después)";
  }
  if (ahoraMs <= limiteMs) {
    const minRestantes = Math.max(1, Math.ceil((limiteMs - ahoraMs) / (60 * 1000)));
    return `Ventana activa: quedan ${minRestantes} min para marcar el Check antes de marcar "No se vieron"`;
  }
  return "Tiempo expirado (> 1 hora sin Check)";
}

export default function PanelCitasAsesoria({ rolVista = "alumno", nombreUsuario = "" }) {
  const esVistaAlumno = rolVista === "alumno";
  const etiquetaMiRol = esVistaAlumno ? "Alumno" : "Asesor";

  const [citas, setCitas] = useState(() => obtenerCitasAsesoria());
  const [filtroEstatus, setFiltroEstatus] = useState("todas");

  // Estado del formulario para agendar / reprogramar cita
  const mananaIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(ALUMNOS_DISPONIBLES[0].nombre);
  const [asesorInput, setAsesorInput] = useState(ALUMNOS_DISPONIBLES[0].asesor);
  const [fechaCita, setFechaCita] = useState(mananaIso);
  const [horaCita, setHoraCita] = useState("11:00");
  const [modalidad, setModalidad] = useState("Presencial · Cubículo de Asesoría");
  const [motivo, setMotivo] = useState("");
  const [citaReprogramando, setCitaReprogramando] = useState(null);

  // Modal de rechazo (con razón obligatoria y opción de agendar otro día)
  const [citaParaRechazar, setCitaParaRechazar] = useState(null);
  const [razonRechazo, setRazonRechazo] = useState("");

  // Modal de cancelación (de cualquiera de los dos lados con razón obligatoria)
  const [citaParaCancelar, setCitaParaCancelar] = useState(null);
  const [razonCancelacion, setRazonCancelacion] = useState("");

  // Sincronización en tiempo real + verificación cada 15 segundos de la regla de 1 hora
  useEffect(() => {
    const actualizar = () => setCitas(obtenerCitasAsesoria());
    window.addEventListener("posgrados:sync", actualizar);
    window.addEventListener("storage", actualizar);

    const intervalo = setInterval(() => {
      setCitas(obtenerCitasAsesoria());
    }, 15000);

    return () => {
      window.removeEventListener("posgrados:sync", actualizar);
      window.removeEventListener("storage", actualizar);
      clearInterval(intervalo);
    };
  }, []);

  const cambiarAlumnoSelect = (nombreAlu) => {
    setAlumnoSeleccionado(nombreAlu);
    const encontrado = ALUMNOS_DISPONIBLES.find((a) => a.nombre === nombreAlu);
    if (encontrado) {
      setAsesorInput(encontrado.asesor);
    }
  };

  const enviarNuevaCita = (e) => {
    e.preventDefault();
    if (!fechaCita || !horaCita) {
      toast.error("Selecciona la fecha y la hora para la cita.");
      return;
    }

    const datosAlumno =
      ALUMNOS_DISPONIBLES.find((a) => a.nombre === alumnoSeleccionado) || ALUMNOS_DISPONIBLES[0];

    const actualizadas = agendarNuevaCita({
      alumnoNombre: esVistaAlumno ? nombreUsuario || datosAlumno.nombre : datosAlumno.nombre,
      matricula: datosAlumno.matricula,
      asesorNombre: asesorInput,
      fechaCita,
      horaCita,
      modalidad,
      motivo: motivo.trim() || "Revisión de avance de tesis",
      solicitadaPor: esVistaAlumno ? "alumno" : "asesor",
      citaReprogramadaId: citaReprogramando?.id || null,
    });

    setCitas(actualizadas);
    setMotivo("");
    setCitaReprogramando(null);

    toast.success(
      citaReprogramando
        ? `Nueva fecha propuesta (${formatearFechaCorta(fechaCita)} a las ${horaCita}). Se envió notificación para aceptar o rechazar.`
        : `Solicitud de cita agendada para el ${formatearFechaCorta(fechaCita)} a las ${horaCita}. Se envió notificación.`
    );
  };

  const handleAceptarCita = (cita) => {
    const actualizadas = aceptarCitaAsesoria(cita.id);
    setCitas(actualizadas);
    toast.success(
      `Cita del ${formatearFechaCorta(cita.fechaCita)} (${cita.horaCita}) aceptada y confirmada.`
    );
  };

  const confirmarRechazoCita = (e, agendarOtroDiaInmediato = false) => {
    e.preventDefault();
    if (!razonRechazo.trim()) {
      toast.error("Por favor escribe la razón por la que se rechaza la cita.");
      return;
    }

    const citaObj = citaParaRechazar;
    const actualizadas = rechazarCitaAsesoria(citaObj.id, razonRechazo, etiquetaMiRol);
    setCitas(actualizadas);
    setCitaParaRechazar(null);
    setRazonRechazo("");

    toast.info(`Cita rechazada. Se notificó el motivo: "${razonRechazo.trim()}"`);

    if (agendarOtroDiaInmediato) {
      iniciarAgendarOtroDia(citaObj);
    }
  };

  const iniciarAgendarOtroDia = (cita) => {
    setCitaReprogramando(cita);
    setAlumnoSeleccionado(cita.alumnoNombre);
    setAsesorInput(cita.asesorNombre);
    setModalidad(cita.modalidad);
    setMotivo(cita.motivo);
    // Sugerimos el día siguiente por defecto
    const siguienteDia = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setFechaCita(siguienteDia);

    const formEl = document.getElementById("formulario-agendar-cita");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    toast.info("Selecciona la nueva fecha y hora en el formulario para agendar otro día.");
  };

  const confirmarCancelacionCita = (e) => {
    e.preventDefault();
    if (!razonCancelacion.trim()) {
      toast.error("Debes indicar la razón por la que se cancela la cita.");
      return;
    }

    const actualizadas = cancelarCitaAsesoria(
      citaParaCancelar.id,
      razonCancelacion,
      etiquetaMiRol
    );
    setCitas(actualizadas);
    setCitaParaCancelar(null);
    setRazonCancelacion("");
    toast.info("La cita fue cancelada y se registró el motivo de cancelación.");
  };

  const handleMarcarCheck = (cita) => {
    const actualizadas = marcarCheckAsistenciaCita(cita.id, etiquetaMiRol);
    setCitas(actualizadas);
    const actualizada = actualizadas.find((c) => c.id === cita.id);
    if (actualizada?.estatus === "no_se_vieron") {
      toast.error(
        "Ya transcurrió más de 1 hora desde la hora programada: la cita se marcó automáticamente como «No se vieron»."
      );
    } else {
      toast.success(
        `✓ Check confirmado: Se registró que el asesor y el alumno sí se vieron en la cita.`
      );
    }
  };

  const handleSimularExpiracion1Hora = (cita) => {
    const actualizadas = simularPasoDeUnaHoraSinCheck(cita.id);
    setCitas(actualizadas);
    toast.info(
      "Se simuló que pasó más de 1 hora sin marcar el Check: la cita cambió automáticamente a «No se vieron»."
    );
  };

  // Notificaciones pendientes de aceptar o rechazar
  const notificacionesPendientes = citas.filter((c) => c.estatus === "pendiente");

  const citasFiltradas = citas.filter((c) => {
    if (filtroEstatus === "todas") return true;
    return c.estatus === filtroEstatus;
  });

  const renderBadgeEstatus = (estatus) => {
    switch (estatus) {
      case "pendiente":
        return <span className="programa-badge programa-badge--suave">Pendiente de respuesta</span>;
      case "confirmada":
        return <span className="programa-badge programa-badge--solido">Cita confirmada</span>;
      case "asistieron":
        return (
          <span className="programa-badge programa-badge--solido">
            ✓ Sí se vieron (Check confirmado)
          </span>
        );
      case "no_se_vieron":
        return (
          <span className="programa-badge programa-badge--neutro">
            ✕ No se vieron (+1h sin Check)
          </span>
        );
      case "rechazada":
        return <span className="programa-badge programa-badge--neutro">Rechazada</span>;
      case "cancelada":
        return <span className="programa-badge programa-badge--neutro">Cancelada</span>;
      default:
        return <span className="programa-badge programa-badge--neutro">{estatus}</span>;
    }
  };

  return (
    <div className="citas-contenedor">
      {/* 1. BANDEJA DE NOTIFICACIONES DE CITAS PENDIENTES (ACEPTAR / RECHAZAR) */}
      <div className="citas-notificaciones-box">
        <div className="citas-notificaciones-box__header">
          <div className="citas-notificaciones-box__titulo">
            <Bell size={18} aria-hidden="true" />
            <h3>Notificaciones de Solicitudes de Cita</h3>
          </div>
          <span className="badge-codigo">
            {notificacionesPendientes.length}{" "}
            {notificacionesPendientes.length === 1 ? "solicitud pendiente" : "solicitudes pendientes"}
          </span>
        </div>

        {notificacionesPendientes.length === 0 ? (
          <p className="citas-notificaciones-box__vacio">
            No tienes solicitudes de cita pendientes por responder en este momento.
          </p>
        ) : (
          <div className="citas-notificaciones-lista">
            {notificacionesPendientes.map((cita) => (
              <div key={cita.id} className="cita-notif-item">
                <div className="cita-notif-item__info">
                  <div className="cita-notif-item__meta">
                    <span className="badge-codigo">{cita.id}</span>
                    <span className="programa-badge programa-badge--suave">
                      Solicitada por:{" "}
                      {cita.solicitadaPor === "alumno" ? "Alumno" : "Asesor de Tesis"}
                    </span>
                    <span className="fecha-suave">
                      Fecha propuesta:{" "}
                      <strong>
                        {formatearFechaCorta(cita.fechaCita)} a las {cita.horaCita} hrs
                      </strong>
                    </span>
                  </div>
                  <p className="cita-notif-item__participantes">
                    <strong>Alumno:</strong> {cita.alumnoNombre} ({cita.matricula}) ·{" "}
                    <strong>Asesor:</strong> {cita.asesorNombre}
                  </p>
                  <p className="cita-notif-item__motivo">
                    <strong>Tema / Motivo:</strong> {cita.motivo} ({cita.modalidad})
                  </p>
                </div>

                <div className="cita-notif-item__acciones">
                  <button
                    type="button"
                    className="boton-principal boton-principal--sm"
                    onClick={() => handleAceptarCita(cita)}
                  >
                    <Check size={14} aria-hidden="true" />
                    <span>Aceptar cita</span>
                  </button>
                  <button
                    type="button"
                    className="boton-secundario boton-secundario--sm"
                    onClick={() => {
                      setCitaParaRechazar(cita);
                      setRazonRechazo("");
                    }}
                  >
                    <X size={14} aria-hidden="true" />
                    <span>Rechazar (dar razón)</span>
                  </button>
                  <button
                    type="button"
                    className="boton-secundario boton-secundario--sm"
                    onClick={() => iniciarAgendarOtroDia(cita)}
                  >
                    <CalendarPlus size={14} aria-hidden="true" />
                    <span>Agendar otro día</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. FORMULARIO PARA AGENDAR CITA (ALUMNO O ASESOR) */}
      <div id="formulario-agendar-cita" className="configuracion-card">
        <div className="configuracion-card__header">
          <CalendarPlus size={18} className="configuracion-card__icono" aria-hidden="true" />
          <div>
            <h3 className="configuracion-card__titulo">
              {citaReprogramando
                ? `Agendar otro día para la cita ${citaReprogramando.id}`
                : esVistaAlumno
                ? "Agendar Cita con mi Asesor de Tesis"
                : "Agendar Cita de Asesoría con Alumno"}
            </h3>
            <p className="configuracion-card__desc">
              Al agendar, se envía notificación para aceptar o rechazar. Si no se marca el «Check»
              de asistencia dentro de 1 hora después de la cita, se marcará automáticamente como
              «No se vieron».
            </p>
          </div>
        </div>

        <form onSubmit={enviarNuevaCita} className="citas-form-grid">
          {!esVistaAlumno ? (
            <label className="campo">
              <span className="campo__etiqueta">Alumno asesorado</span>
              <select
                value={alumnoSeleccionado}
                onChange={(e) => cambiarAlumnoSelect(e.target.value)}
                className="select-estilizado"
              >
                {ALUMNOS_DISPONIBLES.map((a) => (
                  <option key={a.matricula} value={a.nombre}>
                    {a.nombre} ({a.matricula})
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="campo">
              <span className="campo__etiqueta">Asesor de tesis</span>
              <input
                type="text"
                value={asesorInput}
                onChange={(e) => setAsesorInput(e.target.value)}
                required
              />
            </label>
          )}

          <label className="campo">
            <span className="campo__etiqueta">Fecha de la cita</span>
            <input
              type="date"
              value={fechaCita}
              onChange={(e) => setFechaCita(e.target.value)}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Hora de la cita</span>
            <input
              type="time"
              value={horaCita}
              onChange={(e) => setHoraCita(e.target.value)}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Lugar o modalidad</span>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              className="select-estilizado"
            >
              <option value="Presencial · Cubículo de Asesoría">
                Presencial · Cubículo de Asesoría
              </option>
              <option value="Presencial · Laboratorio de Metalurgia">
                Presencial · Laboratorio de Metalurgia
              </option>
              <option value="Presencial · Sala de Juntas DEPI">
                Presencial · Sala de Juntas DEPI
              </option>
              <option value="En línea · Videollamada Institucional">
                En línea · Videollamada Institucional
              </option>
            </select>
          </label>

          <label className="campo citas-form-grid__full">
            <span className="campo__etiqueta">Motivo o avance de tesis a tratar</span>
            <input
              type="text"
              placeholder="Ej. Revisión del capítulo 2, correcciones del comité tutorial, firma de tesis…"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </label>

          <div className="citas-form-grid__acciones">
            {citaReprogramando && (
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setCitaReprogramando(null)}
              >
                Cancelar reprogramación
              </button>
            )}
            <button type="submit" className="boton-principal">
              <Calendar size={16} aria-hidden="true" />
              <span>
                {citaReprogramando ? "Confirmar nueva fecha de cita" : "Enviar solicitud de cita"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. APARTADO DE FECHAS EN LAS QUE SE AGENDARON CITAS Y CONTROL DE ASISTENCIA ("CHECK") */}
      <div className="bloque-cabecera" style={{ marginTop: "8px" }}>
        <div>
          <h3 className="bloque-cabecera__titulo">
            Historial y Fechas en las que se Agendaron Citas
          </h3>
          <span className="bloque-cabecera__sub">
            Marca el botón «Check (Sí nos vimos)» durante la cita. Si pasa 1 hora sin marcarse, se
            registra automáticamente que no se vieron.
          </span>
        </div>
      </div>

      <div className="modulo-toolbar">
        <div className="modulo-chips-filtros">
          {[
            { id: "todas", label: `Todas (${citas.length})` },
            {
              id: "confirmada",
              label: `Confirmadas (${citas.filter((c) => c.estatus === "confirmada").length})`,
            },
            {
              id: "pendiente",
              label: `Pendientes (${citas.filter((c) => c.estatus === "pendiente").length})`,
            },
            {
              id: "asistieron",
              label: `Sí se vieron (${citas.filter((c) => c.estatus === "asistieron").length})`,
            },
            {
              id: "no_se_vieron",
              label: `No se vieron (${citas.filter((c) => c.estatus === "no_se_vieron").length})`,
            },
            {
              id: "rechazada",
              label: `Rechazadas (${citas.filter((c) => c.estatus === "rechazada").length})`,
            },
            {
              id: "cancelada",
              label: `Canceladas (${citas.filter((c) => c.estatus === "cancelada").length})`,
            },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={`modulo-chip ${filtroEstatus === chip.id ? "modulo-chip--activo" : ""}`}
              onClick={() => setFiltroEstatus(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="modulo-tabla-card">
        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Folio / Fecha Agendada</th>
                <th className="text-left">Fecha y Hora de la Cita</th>
                <th className="text-left">Alumno y Asesor</th>
                <th className="text-left">Tema / Razón de Rechazo o Cancelación</th>
                <th>Estatus / Asistencia</th>
                <th>Acciones (Check / Reprogramar / Cancelar)</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita) => {
                const leyendaVentana = etiquetaTiempoRestanteCheck(cita);
                const puedeCancelar =
                  cita.estatus === "pendiente" || cita.estatus === "confirmada";

                return (
                  <tr key={cita.id}>
                    <td>
                      <span className="badge-codigo">{cita.id}</span>
                      <span className="fecha-suave">
                        Agendada el: {formatearFechaCreacion(cita.fechaAgendadaEn)}
                      </span>
                    </td>

                    <td className="text-left">
                      <span className="nombre-persona">
                        {formatearFechaCorta(cita.fechaCita)} · {cita.horaCita} hrs
                      </span>
                      <span className="fecha-suave">
                        <MapPin size={12} style={{ display: "inline", marginRight: 4 }} />
                        {cita.modalidad}
                      </span>
                    </td>

                    <td className="text-left">
                      <span className="nombre-persona">{cita.alumnoNombre}</span>
                      <span className="fecha-suave">Asesor: {cita.asesorNombre}</span>
                    </td>

                    <td className="text-left" style={{ maxWidth: "300px" }}>
                      <span className="texto-celda-compacta">{cita.motivo}</span>

                      {cita.estatus === "rechazada" && cita.motivoRechazo && (
                        <div className="cita-motivo-alerta">
                          <strong>
                            Motivo de rechazo ({cita.rechazadaPor || "Asesor/Alumno"}):
                          </strong>{" "}
                          {cita.motivoRechazo}
                        </div>
                      )}

                      {cita.estatus === "cancelada" && cita.motivoCancelacion && (
                        <div className="cita-motivo-alerta">
                          <strong>Cancelada por {cita.canceladaPor || "Usuario"}:</strong>{" "}
                          {cita.motivoCancelacion}
                        </div>
                      )}

                      {cita.estatus === "no_se_vieron" && (
                        <div className="cita-motivo-alerta">
                          <strong>Registro automático:</strong> Pasó más de 1 hora desde la cita sin
                          marcar el Check de asistencia.
                        </div>
                      )}

                      {leyendaVentana && (
                        <span className="fecha-suave" style={{ color: "var(--azul-rey)" }}>
                          <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                          {leyendaVentana}
                        </span>
                      )}
                    </td>

                    <td>{renderBadgeEstatus(cita.estatus)}</td>

                    <td>
                      <div className="acciones-celda" style={{ flexWrap: "wrap" }}>
                        {/* Si está pendiente: Aceptar o Rechazar */}
                        {cita.estatus === "pendiente" && (
                          <>
                            <button
                              type="button"
                              className="boton-principal boton-principal--sm"
                              onClick={() => handleAceptarCita(cita)}
                              title="Aceptar fecha de la cita"
                            >
                              <Check size={13} aria-hidden="true" />
                              <span>Aceptar</span>
                            </button>
                            <button
                              type="button"
                              className="boton-secundario boton-secundario--sm"
                              onClick={() => {
                                setCitaParaRechazar(cita);
                                setRazonRechazo("");
                              }}
                              title="Rechazar y escribir la razón"
                            >
                              <X size={13} aria-hidden="true" />
                              <span>Rechazar</span>
                            </button>
                          </>
                        )}

                        {/* Si está confirmada: Botón de CHECK de que sí se vieron */}
                        {cita.estatus === "confirmada" && (
                          <>
                            <button
                              type="button"
                              className="boton-principal boton-principal--sm"
                              onClick={() => handleMarcarCheck(cita)}
                              title="Marcar Check de que sí se vieron el profesor y el alumno"
                            >
                              <UserCheck size={14} aria-hidden="true" />
                              <span>✓ Check (Sí nos vimos)</span>
                            </button>
                            <button
                              type="button"
                              className="boton-secundario boton-secundario--sm"
                              onClick={() => handleSimularExpiracion1Hora(cita)}
                              title="Probar la regla automática de 1 hora sin marcar Check"
                            >
                              <Clock size={13} aria-hidden="true" />
                              <span>Simular +1h sin check</span>
                            </button>
                          </>
                        )}

                        {/* En citas rechazadas, canceladas o donde no se vieron: Botón para Agendar otro día */}
                        {(cita.estatus === "rechazada" ||
                          cita.estatus === "cancelada" ||
                          cita.estatus === "no_se_vieron") && (
                          <button
                            type="button"
                            className="boton-principal boton-principal--sm"
                            onClick={() => iniciarAgendarOtroDia(cita)}
                          >
                            <RefreshCw size={13} aria-hidden="true" />
                            <span>Agendar otro día</span>
                          </button>
                        )}

                        {/* Botón para cancelar cita de cualquiera de los dos lados */}
                        {puedeCancelar && (
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--sm"
                            onClick={() => {
                              setCitaParaCancelar(cita);
                              setRazonCancelacion("");
                            }}
                          >
                            <Ban size={13} aria-hidden="true" />
                            <span>Cancelar cita</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA RECHAZAR CITA (CON RAZÓN OBLIGATORIA + BOTÓN DE AGENDAR OTRO DÍA) */}
      {citaParaRechazar && (
        <div className="modal-overlay" onClick={() => setCitaParaRechazar(null)}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">Rechazar solicitud {citaParaRechazar.id}</span>
                <h3 className="modal-titulo">
                  Indica la razón del rechazo — {formatearFechaCorta(citaParaRechazar.fechaCita)} (
                  {citaParaRechazar.horaCita} hrs)
                </h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setCitaParaRechazar(null)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => confirmarRechazoCita(e, false)}
              className="modal-cuerpo"
            >
              <p className="pagina__desc">
                Se notificará a la otra parte por qué no es posible reunirse en esa fecha y se
                habilitará la opción para agendar otro día.
              </p>

              <label className="campo">
                <span className="campo__etiqueta">Razón de por qué no se puede en esta fecha *</span>
                <textarea
                  rows="3"
                  required
                  placeholder="Ej. Tengo sesión del comité tutorial a esa misma hora; propongo reprogramar para el día siguiente…"
                  value={razonRechazo}
                  onChange={(e) => setRazonRechazo(e.target.value)}
                />
              </label>

              <div className="modal-footer" style={{ flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={(e) => confirmarRechazoCita(e, true)}
                >
                  <CalendarPlus size={15} aria-hidden="true" />
                  <span>Rechazar y agendar otro día</span>
                </button>
                <button type="submit" className="boton-principal">
                  <X size={15} aria-hidden="true" />
                  <span>Confirmar rechazo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA CANCELAR CITA (DE CUALQUIERA DE LOS DOS LADOS CON RAZÓN OBLIGATORIA) */}
      {citaParaCancelar && (
        <div className="modal-overlay" onClick={() => setCitaParaCancelar(null)}>
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <div>
                <span className="programa-card__codigo">Cancelar cita {citaParaCancelar.id}</span>
                <h3 className="modal-titulo">
                  Cancelar cita del {formatearFechaCorta(citaParaCancelar.fechaCita)} a las{" "}
                  {citaParaCancelar.horaCita} hrs
                </h3>
              </div>
              <button
                type="button"
                className="boton-icono"
                onClick={() => setCitaParaCancelar(null)}
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            <form onSubmit={confirmarCancelacionCita} className="modal-cuerpo">
              <div className="cita-aviso-cancelacion">
                <AlertCircle size={16} aria-hidden="true" />
                <span>
                  Estás cancelando esta cita como <strong>{etiquetaMiRol}</strong>. Escribe el motivo
                  para notificar a la otra parte.
                </span>
              </div>

              <label className="campo">
                <span className="campo__etiqueta">Razón de la cancelación *</span>
                <textarea
                  rows="3"
                  required
                  placeholder="Escribe por qué necesitas cancelar esta cita de asesoría…"
                  value={razonCancelacion}
                  onChange={(e) => setRazonCancelacion(e.target.value)}
                />
              </label>

              <div className="modal-footer">
                <button type="submit" className="boton-principal">
                  <Ban size={15} aria-hidden="true" />
                  <span>Confirmar cancelación</span>
                </button>
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setCitaParaCancelar(null)}
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

