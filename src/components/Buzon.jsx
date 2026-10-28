import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { IconBuzon, IconCheck } from "./Iconos.jsx";

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

export default function Buzon() {
  const { perfil } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeAbierto, setMensajeAbierto] = useState(null);
  const [filtroNoLeidos, setFiltroNoLeidos] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function cargarMensajes() {
      if (!perfil?.id) return;
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
          // Si no hay datos o la tabla no existe en la BD aún, mostramos los iniciales
          if (!cancelado) setMensajes(DEMO_MENSAJES);
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
          if (!cancelado) setMensajes(formateados);
        }
      } catch {
        if (!cancelado) setMensajes(DEMO_MENSAJES);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarMensajes();
    return () => {
      cancelado = true;
    };
  }, [perfil?.id]);

  const marcarComoLeido = async (id) => {
    setMensajes((prev) =>
      prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
    );

    // Si es un id numérico de BD, actualizamos en Supabase
    if (typeof id === "number" || (!String(id).startsWith("demo-") && !isNaN(Number(id)))) {
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
            <h2 className="panel-actividad__titulo">Buzón de Mensajes</h2>
            <p className="panel-actividad__subtitulo">
              Comunicaciones directas de docentes y coordinación
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
                >
                  <div className="mensaje-item__cabecera">
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
                    {estaAbierto ? m.mensaje : `${m.mensaje.slice(0, 95)}…`}
                  </p>

                  <div className="mensaje-item__pie">
                    <span className="mensaje-item__ver-mas">
                      {estaAbierto ? "Mostrar menos" : "Leer mensaje completo"}
                    </span>
                    {!m.leido && <span className="mensaje-item__punto" aria-label="Mensaje no leído" />}
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

