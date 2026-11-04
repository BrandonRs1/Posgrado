import Credencial from "../components/Credencial.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";
import { IconBuzon, IconAnuncio } from "../components/Iconos.jsx";
import {
  Award,
  CreditCard,
  Bell,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  Inbox,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";

function obtenerSaludo() {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

function obtenerFechaActual() {
  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function Inicio() {
  const { perfil } = useAuth();

  const saludo = obtenerSaludo();
  const fechaHoy = obtenerFechaActual();
  const fechaCapitalizada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  const abrirEnOtraPestana = (ruta) => {
    window.open(ruta, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="inicio-seccion seccion-fade">
      {/* Banner Hero Ejecutivo de Bienvenida */}
      <div className="inicio-hero">
        <div className="inicio-hero__contenido">
          <div className="inicio-hero__top">
            <span className="inicio-hero__badge">
              <span className="inicio-hero__badge-dot" />
              <span>Sistema Institucional Activo</span>
            </span>
            <span className="inicio-hero__fecha">
              <CalendarDays size={14} />
              <span>{fechaCapitalizada}</span>
            </span>
          </div>

          <h1 className="inicio-hero__titulo">
            {saludo}, {perfil?.nombre} <span className="inicio-hero__wave">👋</span>
          </h1>

          <p className="inicio-hero__subtitulo">
            Bienvenido a tu panel de control de posgrados. Consulta tu credencial institucional
            digital, mantente al día con las convocatorias y revisa tus notificaciones oficiales.
          </p>
        </div>

        <div className="inicio-hero__decoracion" aria-hidden="true">
          <div className="inicio-hero__glow-1" />
          <div className="inicio-hero__glow-2" />
        </div>
      </div>

      {/* Tarjetas de Métricas / KPI del Sistema */}
      <div className="inicio-kpis">
        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--azul">
            <Award size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Rol Institucional</span>
            <span className="kpi-card__valor">{etiquetaRol(perfil)}</span>
            <span className="kpi-card__subtext">Acceso autorizado</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--verde">
            <CheckCircle2 size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Estatus en Plataforma</span>
            <span className="kpi-card__valor">
              {perfil?.estatus === "aceptado" ? "Regular / Aceptado" : "Activo"}
            </span>
            <span className="kpi-card__subtext">Expediente validado</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--morado">
            <CreditCard size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Credencial Digital</span>
            <span className="kpi-card__valor">Emitida y Vigente</span>
            <span className="kpi-card__subtext">Con código de validación</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__icono kpi-card__icono--ambar">
            <Bell size={20} />
          </div>
          <div className="kpi-card__info">
            <span className="kpi-card__label">Comunicaciones</span>
            <span className="kpi-card__valor">Al día</span>
            <span className="kpi-card__subtext">Avisos y mensajes sincronizados</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: Credencial + Recuadros de Comunicación */}
      <div className="inicio-grid">
        {/* Columna Izquierda: Credencial Digital */}
        <div className="inicio-grid__col-credencial">
          <div className="seccion-cabecera-bloque">
            <h2 className="seccion-cabecera-bloque__titulo">Identificación Oficial</h2>
            <span className="seccion-cabecera-bloque__sub">Uso institucional y accesos</span>
          </div>
          <Credencial />
        </div>

        {/* Columna Derecha: Recuadros de Buzón y Avisos (abren en otra pestaña) */}
        <div className="inicio-grid__col-actividad">
          <div className="seccion-cabecera-bloque">
            <h2 className="seccion-cabecera-bloque__titulo">Comunicaciones y Avisos</h2>
            <span className="seccion-cabecera-bloque__sub">
              Módulos oficiales (selecciona cualquier recuadro para abrirlo en otra pestaña)
            </span>
          </div>

          <div className="recuadros-grid">
            {/* Recuadro 1: Buzón de Mensajes */}
            <article
              className="recuadro-modulo"
              onClick={() => abrirEnOtraPestana("/buzon")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  abrirEnOtraPestana("/buzon");
                }
              }}
              title="Abrir Buzón de Mensajes en otra pestaña"
            >
              <div className="recuadro-modulo__cabecera">
                <div className="recuadro-modulo__icono-contenedor recuadro-modulo__icono-contenedor--azul">
                  <IconBuzon />
                </div>
                <div className="recuadro-modulo__titulos">
                  <span className="recuadro-modulo__categoria">Mensajería Académica</span>
                  <h3 className="recuadro-modulo__titulo">Buzón de Mensajes</h3>
                </div>
                <div className="recuadro-modulo__badge">
                  <span className="recuadro-modulo__badge-dot" />
                  <span>Activo</span>
                </div>
              </div>

              <p className="recuadro-modulo__desc">
                Consulta los mensajes directos del comité de posgrados, avisos de tus profesores y seguimiento a solicitudes.
              </p>

              {/* Vista previa miniatura del último mensaje */}
              <div className="recuadro-modulo__snippet">
                <div className="recuadro-modulo__snippet-header">
                  <span className="recuadro-modulo__snippet-autor">Coordinación de Posgrados</span>
                  <span className="recuadro-modulo__snippet-fecha">Reciente</span>
                </div>
                <p className="recuadro-modulo__snippet-texto">
                  Bienvenido al Sistema de Evaluación y Seguimiento de Posgrados.
                </p>
              </div>

              <div className="recuadro-modulo__pie">
                <a
                  href="/buzon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton-principal recuadro-modulo__boton"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Abrir en otra pestaña</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>

            {/* Recuadro 2: Tablón de Anuncios Oficiales */}
            <article
              className="recuadro-modulo"
              onClick={() => abrirEnOtraPestana("/anuncios")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  abrirEnOtraPestana("/anuncios");
                }
              }}
              title="Abrir Tablón de Anuncios en otra pestaña"
            >
              <div className="recuadro-modulo__cabecera">
                <div className="recuadro-modulo__icono-contenedor recuadro-modulo__icono-contenedor--ambar">
                  <IconAnuncio />
                </div>
                <div className="recuadro-modulo__titulos">
                  <span className="recuadro-modulo__categoria">Tablón Oficial</span>
                  <h3 className="recuadro-modulo__titulo">Avisos y Convocatorias</h3>
                </div>
                <div className="recuadro-modulo__badge recuadro-modulo__badge--urgente">
                  <span className="recuadro-modulo__badge-dot recuadro-modulo__badge-dot--urgente" />
                  <span>Oficial</span>
                </div>
              </div>

              <p className="recuadro-modulo__desc">
                Convocatorias de becas de investigación, fechas de exámenes, entrega de documentación y circulares de servicios escolares.
              </p>

              {/* Vista previa miniatura del aviso oficial */}
              <div className="recuadro-modulo__snippet">
                <div className="recuadro-modulo__snippet-header">
                  <span className="recuadro-modulo__snippet-autor">Servicios Escolares</span>
                  <span className="recuadro-modulo__snippet-fecha">Vigente</span>
                </div>
                <p className="recuadro-modulo__snippet-texto">
                  Publicación del Calendario Oficial de Evaluaciones y Recepción Física.
                </p>
              </div>

              <div className="recuadro-modulo__pie">
                <a
                  href="/anuncios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton-principal recuadro-modulo__boton"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Abrir en otra pestaña</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
