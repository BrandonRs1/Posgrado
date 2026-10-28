import { useState } from "react";
import Credencial from "../components/Credencial.jsx";
import Buzon from "../components/Buzon.jsx";
import Anuncios from "../components/Anuncios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";
import { IconBuzon, IconAnuncio } from "../components/Iconos.jsx";
import {
  Award,
  CreditCard,
  Bell,
  CheckCircle2,
  Sparkles,
  CalendarDays,
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
  const [tabActiva, setTabActiva] = useState("ambos"); // "ambos", "buzon", "anuncios"

  const saludo = obtenerSaludo();
  const fechaHoy = obtenerFechaActual();
  const fechaCapitalizada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

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

      {/* Grid Principal: Credencial + Actividad */}
      <div className="inicio-grid">
        {/* Columna Izquierda: Credencial Digital */}
        <div className="inicio-grid__col-credencial">
          <div className="seccion-cabecera-bloque">
            <h2 className="seccion-cabecera-bloque__titulo">Identificación Oficial</h2>
            <span className="seccion-cabecera-bloque__sub">Uso institucional y accesos</span>
          </div>
          <Credencial />
        </div>

        {/* Columna Derecha: Buzón de Mensajes y Tablón de Anuncios */}
        <div className="inicio-grid__col-actividad">
          {/* Selector de módulos estilo Segmented Control */}
          <div className="inicio-tabs-wrapper">
            <div className="inicio-tabs" role="tablist" aria-label="Secciones de actividad">
              <button
                type="button"
                role="tab"
                aria-selected={tabActiva === "ambos"}
                className={`inicio-tab ${tabActiva === "ambos" ? "inicio-tab--activo" : ""}`}
                onClick={() => setTabActiva("ambos")}
              >
                <span>Resumen completo</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tabActiva === "buzon"}
                className={`inicio-tab ${tabActiva === "buzon" ? "inicio-tab--activo" : ""}`}
                onClick={() => setTabActiva("buzon")}
              >
                <IconBuzon />
                <span>Buzón institucional</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tabActiva === "anuncios"}
                className={`inicio-tab ${tabActiva === "anuncios" ? "inicio-tab--activo" : ""}`}
                onClick={() => setTabActiva("anuncios")}
              >
                <IconAnuncio />
                <span>Avisos oficiales</span>
              </button>
            </div>
          </div>

          <div className="inicio-modulos">
            {(tabActiva === "ambos" || tabActiva === "buzon") && <Buzon />}
            {(tabActiva === "ambos" || tabActiva === "anuncios") && <Anuncios />}
          </div>
        </div>
      </div>
    </section>
  );
}
