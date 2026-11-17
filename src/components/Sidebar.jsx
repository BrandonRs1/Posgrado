import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas } from "../config/secciones.js";
import { etiquetaRol } from "../lib/permisos.js";
import { LogOut } from "lucide-react";

export default function Sidebar({ abierto, onNavegar }) {
  const { perfil, cerrarSesion } = useAuth();
  const permitidas = seccionesPermitidas(perfil);

  return (
    <nav
      className={`nav-institucional ${abierto ? "nav-institucional--abierto" : ""}`}
      aria-label="Navegación principal"
    >
      <ul className="nav-institucional__lista">
        {permitidas.map(({ ruta, nombre, icono: Icono }) => (
          <li key={ruta} className="nav-institucional__item">
            <NavLink
              to={ruta}
              end={ruta === "/"}
              onClick={onNavegar}
              className={({ isActive }) =>
                `nav-institucional__link ${isActive ? "nav-institucional__link--activo" : ""}`
              }
            >
              <Icono size={17} />
              <span>{nombre}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Pie visible solo en menú móvil */}
      <div className="nav-institucional__movil-pie">
        <div className="nav-institucional__movil-usuario">
          <strong>
            {perfil?.nombre} {perfil?.apellido_paterno}
          </strong>
          <span>{etiquetaRol(perfil)}</span>
        </div>
        <button type="button" className="boton-secundario" onClick={cerrarSesion}>
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
