import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas } from "../config/secciones.js";
import { etiquetaRol } from "../lib/permisos.js";
import { IconSalir } from "./Iconos.jsx";
import { GraduationCap, ShieldCheck } from "lucide-react";

// Categorías para organizar el menú en un formato corporativo/universitario
const CATEGORIAS = {
  general: ["/", "/mi-expediente", "/mis-cursos"],
  gestion: ["/programas", "/evaluaciones", "/criterios", "/reportes"],
  sistema: ["/configuracion"],
};

export default function Sidebar({ abierto, onNavegar }) {
  const { perfil, cerrarSesion } = useAuth();

  const permitidas = seccionesPermitidas(perfil);

  const enlacesGeneral = permitidas.filter((s) => CATEGORIAS.general.includes(s.ruta));
  const enlacesGestion = permitidas.filter((s) => CATEGORIAS.gestion.includes(s.ruta));
  const enlacesSistema = permitidas.filter((s) => CATEGORIAS.sistema.includes(s.ruta));

  const iniciales = (
    (perfil?.nombre?.[0] ?? "") + (perfil?.apellido_paterno?.[0] ?? "")
  ).toUpperCase() || "US";

  return (
    <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`}>
      {/* Encabezado Institucional del Sidebar */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-logo">
          <GraduationCap size={22} strokeWidth={2} />
        </div>
        <div className="sidebar__brand-info">
          <span className="sidebar__brand-title">POSGRADOS</span>
          <span className="sidebar__brand-sub">Portal Académico</span>
        </div>
      </div>

      {/* Navegación Agrupada */}
      <nav className="sidebar__nav">
        {enlacesGeneral.length > 0 && (
          <div className="sidebar__grupo">
            <span className="sidebar__grupo-titulo">Principal</span>
            {enlacesGeneral.map(({ ruta, nombre, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                end={ruta === "/"}
                onClick={onNavegar}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--activo" : ""}`
                }
              >
                <Icono />
                <span>{nombre}</span>
              </NavLink>
            ))}
          </div>
        )}

        {enlacesGestion.length > 0 && (
          <div className="sidebar__grupo">
            <span className="sidebar__grupo-titulo">Gestión Académica</span>
            {enlacesGestion.map(({ ruta, nombre, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                end={ruta === "/"}
                onClick={onNavegar}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--activo" : ""}`
                }
              >
                <Icono />
                <span>{nombre}</span>
              </NavLink>
            ))}
          </div>
        )}

        {enlacesSistema.length > 0 && (
          <div className="sidebar__grupo">
            <span className="sidebar__grupo-titulo">Sistema</span>
            {enlacesSistema.map(({ ruta, nombre, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                end={ruta === "/"}
                onClick={onNavegar}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? "sidebar__link--activo" : ""}`
                }
              >
                <Icono />
                <span>{nombre}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Tarjeta Ejecutiva de Usuario */}
      <div className="sidebar__usuario">
        <div className="sidebar__usuario-card">
          <div className="sidebar__avatar-wrapper">
            <div className="sidebar__avatar">{iniciales}</div>
            <span className="sidebar__status-dot" title="En línea" />
          </div>

          <div className="sidebar__usuario-detalles">
            <span className="sidebar__nombre" title={`${perfil?.nombre} ${perfil?.apellido_paterno}`}>
              {perfil?.nombre} {perfil?.apellido_paterno}
            </span>
            <span className="sidebar__rol-badge">
              <ShieldCheck size={11} />
              <span>{etiquetaRol(perfil)}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar__salir"
          onClick={cerrarSesion}
          title="Finalizar sesión actual"
        >
          <IconSalir />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
