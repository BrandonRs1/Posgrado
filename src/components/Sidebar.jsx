import { NavLink } from "react-router-dom";
import {
  IconInicio,
  IconProgramas,
  IconEvaluaciones,
  IconCriterios,
  IconReportes,
  IconConfiguracion,
} from "./Iconos.jsx";

export const secciones = [
  { ruta: "/", nombre: "Inicio", icono: IconInicio },
  { ruta: "/programas", nombre: "Programas", icono: IconProgramas },
  { ruta: "/evaluaciones", nombre: "Evaluaciones", icono: IconEvaluaciones },
  { ruta: "/criterios", nombre: "Criterios", icono: IconCriterios },
  { ruta: "/reportes", nombre: "Reportes", icono: IconReportes },
  { ruta: "/configuracion", nombre: "Configuración", icono: IconConfiguracion },
];

export default function Sidebar({ abierto, onNavegar }) {
  return (
    <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`}>
      <nav className="sidebar__nav">
        {secciones.map(({ ruta, nombre, icono: Icono }) => (
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
    </aside>
  );
}