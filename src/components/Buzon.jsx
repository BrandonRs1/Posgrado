import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { IconBuzon, IconCheck } from "./Iconos.jsx";
import { Check, X, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import {
  obtenerCitasAsesoria,
  aceptarCitaAsesoria,
  rechazarCitaAsesoria,
} from "../lib/expedienteYCitas.js";

// Mensajes de demostración en caso de que la tabla aún no se haya ejecutado en Supabase
const DEMO_MENSAJES = [
  {
    id: "demo-1",
    asunto: "Bienvenido al Sistema de Posgrados",
    mensaje:
      "Estimado estudiante, te damos la bienvenida a la plataforma institucional. A través de este buzón recibirás notificaciones académicas directas de tus profesores y de la coordinación administrativa.",
    remitente_nombre: "Coordinación de Posgrados",
    remitente_rol: "Administrativo",
    leido: false,
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "demo-2",
    asunto: "Confirmación de recepción de expediente",
    mensaje:
      "Hemos recibido tu documentación digital. Se encuentra en proceso de validación por parte del comité evaluador de la maestría / doctorado.",
    remitente_nombre: "Dra. Carmen Morales",
    remitente_rol: "Profesor",
    leido: false,
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function formatearFecha(isoString) {
  try {
    const fecha = new Date(isoString);
    const ahora = new Date();
    const diffHoras = Math.round((ahora - fecha) / (1000 * 60 * 60));

    if (diffHoras < 1) return "Hace un momento";
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    return fecha.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
  } catch {
    return "Reciente";
  }
}

function convertirCitasAMensajesBuzon(citas) {
  return citas.slice(0, 4).map((c) => {
    const remitenteEsAlumno = c.solicitadaPor === "alumno";
    let asunto = `Solicitud de Cita de Asesoría (${c.fechaCita} · ${c.horaCita} hrs)`;
    let detalle = `Tema: ${c.motivo} · Modalidad: ${c.modalidad}.`;

    if (c.estatus === "confirmada") {
      asunto = `Cita Confirmada (${c.fechaCita} · ${c.horaCita} hrs)`;
      detalle = `La cita entre ${c.alumnoNombre} y ${c.asesorNombre} fue aceptada. Recuerda marcar el Check de asistencia dentro de 1 hora.`;
    } else if (c.estatus === "rechazada") {
      asunto = `Cita Rechazada (${c.fechaCita} · ${c.horaCita} hrs) — Motivo registrado`;
      detalle = `Razón por la que no se pudo: "${c.motivoRechazo || "Sin especificar"}". Puedes agendar otro día.`;
    } else if (c.estatus === "cancelada") {
      asunto = `Cita Cancelada por ${c.canceladaPor || "Usuario"} (${c.fechaCita})`;
      detalle = `Razón de cancelación: "${c.motivoCancelacion || "Sin especificar"}".`;
    } else if (c.estatus === "no_se_vieron") {
      asunto = `Inasistencia de Cita (${c.fechaCita} · ${c.horaCita} hrs)`;
      detalle = `Pasó más de 1 hora sin marcar el Check de asistencia: se registró que no se vieron.`;
    }

    return {
      id: `notif-${c.id}`,
      citaId: c.id,
      citaEstatus: c.estatus,
      asunto,
      mensaje: detalle,
      remitente_nombre: remitenteEsAlumno ? c.alumnoNombre : c.asesorNombre,
      remitente_rol: remitenteEsAlumno ? "Alumno" : "Asesor de Tesis",
      leido: c.estatus !== "pendiente",
      creado_en: c.fechaAgendadaEn,
    };
  });
}

export default function Buzon() {
  const { perfil } = useAuth();
  const navigate = useNavigate();
  const [mensajesBase, setMensajesBase] = useState([]);
  const [citasNotif, setCitasNotif] = useState(() =>
    convertirCitasAMensajesBuzon(obtenerCitasAsesoria())
  );
  const [cargando, setCargando] = useState(true);
  const [mensajeAbierto, setMensajeAbierto] = useState(null);
  const [filtroNoLeidos, setFiltroNoLeidos] = useState(false);

  // Estado rápido para rechazar desde el buzón indicando la razón
  const [citaRechazoBuzonId, setCitaRechazoBuzonId] = useState(null);
  const [razonRechazoBuzon, setRazonRechazoBuzon] = useState("");

  useEffect(() => {
    const syncCitas = () => {
      setCitasNotif(convertirCitasAMensajesBuzon(obtenerCitasAsesoria()));
    };
    window.addEventListener("posgrados:sync", syncCitas);
    window.addEventListener("storage", syncCitas);
    return () => {
      window.removeEventListener("posgrados:sync", syncCitas);
      window.removeEventListener("storage", syncCitas);
    };
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function cargarMensajes() {
      if (!perfil?.id) {
        setMensajesBase(DEMO_MENSAJES);
        setCargando(false);
        return;
      }
      setCargando(true);
      try {
        const { data, error } = await supabase
          .from("mensajes_buzon")
          .select(
            `id, asunto, mensaje, leido, creado_en,
             remitente:usuarios!remitente_id (nombre, apellido_paterno, tipo)`
          )
          .eq("destinatario_id", perfil.id)
          .order("creado_en", { ascending: false });

        if (error || !data || data.length === 0) {
          if (!cancelado) setMensajesBase(DEMO_MENSAJES);
        } else {
          const formateados = data.map((m) => ({
            id: m.id,
            asunto: m.asunto,
            mensaje: m.mensaje,
            leido: m.leido,
            creado_en: m.creado_en,
            remitente_nombre: m.remitente
              ? `${m.remitente.nombre} ${m.remitente.apellido_paterno}`
              : "Coordinación",
            remitente_rol:
              m.remitente?.tipo === "profesor" ? "Profesor" : "Administrativo",
          }));
          if (!cancelado) setMensajesBase(formateados);
        }
      } catch {
        if (!cancelado) setMensajesBase(DEMO_MENSAJES);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarMensajes();
    return () => {
      cancelado = true;
    };
  }, [perfil?.id]);

  const mensajes = [...citasNotif, ...mensajesBase];

  const marcarComoLeido = async (id) => {
    setMensajesBase((prev) =>
      prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
    );

    if (typeof id === "number" || (!String(id).startsWith("demo-") && !String(id).startsWith("notif-") && !isNaN(Number(id)))) {
      try {
        await supabase
          .from("mensajes_buzon")
          .update({ leido: true, leido_en: new Date().toISOString() })
          .eq("id", id);
      } catch {
        // En caso de desconexión temporal no bloqueamos la UI
      }
    }
  };

  const seleccionarMensaje = (m) => {
    if (mensajeAbierto?.id === m.id) {
      setMensajeAbierto(null);
    } else {
      setMensajeAbierto(m);
      if (!m.leido) {
        marcarComoLeido(m.id);
      }
    }
  };

  const aceptarDesdeBuzon = (e, citaId) => {
    e.stopPropagation();
    aceptarCitaAsesoria(citaId);
    toast.success("Cita de asesoría aceptada.");
  };

  const guardarRechazoDesdeBuzon = (e, citaId) => {
    e.stopPropagation();
    if (!razonRechazoBuzon.trim()) {
      toast.error("Por favor escribe la razón de por qué no puedes asistir.");
      return;
    }
    const rol = perfil?.tipo === "alumno" ? "Alumno" : "Asesor";
    rechazarCitaAsesoria(citaId, razonRechazoBuzon, rol);
    setCitaRechazoBuzonId(null);
    setRazonRechazoBuzon("");
    toast.info("Cita rechazada con motivo registrado.");
  };

  const irAAgendarOtroDia = (e) => {
    e.stopPropagation();
    navigate("/citas");
  };

  const noLeidosCount = mensajes.filter((m) => !m.leido).length;
  const mensajesMostrados = filtroNoLeidos
    ? mensajes.filter((m) => !m.leido)
    : mensajes;

  return (
    <article className="panel-actividad" aria-label="Buzón de Mensajes">
      <header className="panel-actividad__header">
        <div className="panel-actividad__titulo-grupo">
          <div className="panel-actividad__icono-circulo">
            <IconBuzon />
          </div>
          <div>
            <h2 className="panel-actividad__titulo">Buzón y Notificaciones de Citas</h2>
            <p className="panel-actividad__subtitulo">
              Solicitudes de citas de asesoría y mensajes directos
            </p>
          </div>
        </div>

        <div className="panel-actividad__acciones">
          {noLeidosCount > 0 && (
            <span className="panel-badge panel-badge--azul">
              {noLeidosCount} {noLeidosCount === 1 ? "nuevo" : "nuevos"}
            </span>
          )}
          <button
            type="button"
            className={`panel-filtro-btn ${filtroNoLeidos ? "panel-filtro-btn--activo" : ""}`}
            onClick={() => setFiltroNoLeidos(!filtroNoLeidos)}
            aria-pressed={filtroNoLeidos}
          >
            {filtroNoLeidos ? "Ver todos" : "Solo no leídos"}
          </button>
        </div>
      </header>

      <div className="panel-actividad__cuerpo">
        {cargando ? (
          <div className="panel-estado-vacio">Cargando buzón…</div>
        ) : mensajesMostrados.length === 0 ? (
          <div className="panel-estado-vacio">
            <div className="panel-estado-vacio__check">
              <IconCheck />
            </div>
            <p>Tu buzón está al día. No tienes mensajes pendientes.</p>
          </div>
        ) : (
          <ul className="mensajes-lista">
            {mensajesMostrados.map((m) => {
              const estaAbierto = mensajeAbierto?.id === m.id;
              return (
                <li
                  key={m.id}
                  className={`mensaje-item ${!m.leido ? "mensaje-item--no-leido" : ""} ${estaAbierto ? "mensaje-item--abierto" : ""}`}
                  onClick={() => seleccionarMensaje(m)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      seleccionarMensaje(m);
                    }
                  }}
                  tabIndex={0}
                  aria-expanded={estaAbierto}
                >
                  <div className="mensaje-item__cabecera">
                    {!m.leido && <span className="mensaje-item__punto" aria-label="No leído" />}
                    <div className="mensaje-item__remitente-info">
                      <span className="mensaje-item__nombre">{m.remitente_nombre}</span>
                      <span className="mensaje-item__rol-badge">{m.remitente_rol}</span>
                    </div>
                    <time className="mensaje-item__fecha">
                      {formatearFecha(m.creado_en)}
                    </time>
                  </div>

                  <h3 className="mensaje-item__asunto">{m.asunto}</h3>

                  <p className="mensaje-item__extracto">
                    {estaAbierto ? m.mensaje : `${m.mensaje.slice(0, 110)}…`}
                  </p>

                  {/* Botones rápidos de notificación de cita (Aceptar / Rechazar con razón / Agendar otro día) */}
                  {m.citaId && m.citaEstatus === "pendiente" && (
                    <div
                      className="buzon-cita-acciones"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="boton-principal boton-principal--sm"
                        onClick={(e) => aceptarDesdeBuzon(e, m.citaId)}
                      >
                        <Check size={13} aria-hidden="true" />
                        <span>Aceptar cita</span>
                      </button>
                      <button
                        type="button"
                        className="boton-secundario boton-secundario--sm"
                        onClick={() => setCitaRechazoBuzonId(m.citaId)}
                      >
                        <X size={13} aria-hidden="true" />
                        <span>Rechazar</span>
                      </button>
                      <button
                        type="button"
                        className="boton-secundario boton-secundario--sm"
                        onClick={irAAgendarOtroDia}
                      >
                        <CalendarPlus size={13} aria-hidden="true" />
                        <span>Agendar otro día</span>
                      </button>

                      {citaRechazoBuzonId === m.citaId && (
                        <div className="buzon-rechazo-inline">
                          <input
                            type="text"
                            placeholder="Escribe la razón del rechazo…"
                            value={razonRechazoBuzon}
                            onChange={(e) => setRazonRechazoBuzon(e.target.value)}
                            className="modulo-buscar__input"
                          />
                          <button
                            type="button"
                            className="boton-principal boton-principal--sm"
                            onClick={(e) => guardarRechazoDesdeBuzon(e, m.citaId)}
                          >
                            Confirmar rechazo
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {m.citaId &&
                    (m.citaEstatus === "rechazada" ||
                      m.citaEstatus === "cancelada" ||
                      m.citaEstatus === "no_se_vieron") && (
                      <div
                        className="buzon-cita-acciones"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="boton-secundario boton-secundario--sm"
                          onClick={irAAgendarOtroDia}
                        >
                          <CalendarPlus size={13} aria-hidden="true" />
                          <span>Agendar otro día</span>
                        </button>
                      </div>
                    )}

                  <div className="mensaje-item__pie">
                    <span className="mensaje-item__ver-mas">
                      {estaAbierto ? "Mostrar menos" : "Leer mensaje"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
