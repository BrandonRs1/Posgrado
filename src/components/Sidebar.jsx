import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas } from "../config/secciones.js";
import { etiquetaRol } from "../lib/permisos.js";
import { IconSalir } from "./Iconos.jsx";

export default function Sidebar({ abierto, onNavegar }) {
  const { perfil, cerrarSesion } = useAuth();

  return (
    <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`}>
      <nav className="sidebar__nav">
        {seccionesPermitidas(perfil).map(({ ruta, nombre, icono: Icono }) => (
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
      </nav>

      <div className="sidebar__usuario">
        <div className="sidebar__nombre">
          {perfil.nombre} {perfil.apellido_paterno}
        </div>
        <div className="sidebar__rol">{etiquetaRol(perfil)}</div>
        <button type="button" className="sidebar__salir" onClick={cerrarSesion}>
          <IconSalir />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
