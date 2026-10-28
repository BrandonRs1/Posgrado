import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BotonTema from "./BotonTema.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas, secciones } from "../config/secciones.js";
import { GraduationCap, Sparkles, Calendar } from "lucide-react";

const esEscritorio = () => window.innerWidth >= 900;

export default function Layout() {
  const { perfil } = useAuth();
  const location = useLocation();
  const [abierto, setAbierto] = useState(esEscritorio);

  const alNavegar = () => {
    if (!esEscritorio()) setAbierto(false);
  };

  const seccionActual = secciones.find((s) => s.ruta === location.pathname) || {
    nombre: "Portal",
  };

  const iniciales = (
    (perfil?.nombre?.[0] ?? "") + (perfil?.apellido_paterno?.[0] ?? "")
  ).toUpperCase() || "US";

  return (
    <div className={`layout ${abierto ? "layout--abierto" : ""}`}>
      {/* Barra Superior Flotante con Glassmorphism */}
      <header className="topbar">
        <div className="topbar__izq">
          <button
            className={`hamburguesa ${abierto ? "hamburguesa--activa" : ""}`}
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? "Ocultar menú" : "Mostrar menú"}
            aria-expanded={abierto}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar__branding">
            <div className="topbar__logo-badge">
              <GraduationCap size={19} strokeWidth={2.2} />
            </div>
            <div className="topbar__titulos">
              <span className="topbar__titulo">Evaluación de Posgrados</span>
              <span className="topbar__subtitulo">
                Plataforma Institucional • {seccionActual.nombre}
              </span>
            </div>
          </div>
        </div>

        <div className="topbar__acciones">
          {/* Indicador de Ciclo Activo */}
          <div className="topbar__ciclo-badge">
            <Calendar size={13} />
            <span>Ciclo 2026-2027</span>
          </div>

          <BotonTema />

          {/* Chip de Usuario en Topbar */}
          <div className="topbar__usuario-chip" title={`${perfil?.nombre} (${perfil?.tipo || "Usuario"})`}>
            <div className="topbar__avatar-mini">{iniciales}</div>
            <span className="topbar__usuario-nombre">{perfil?.nombre}</span>
          </div>
        </div>
      </header>

      <Sidebar abierto={abierto} onNavegar={alNavegar} />
      {abierto && <div className="velo" onClick={() => setAbierto(false)} />}

      <main className="pagina">
        <Routes>
          {seccionesPermitidas(perfil).map(({ ruta, elemento: Pagina }) => (
            <Route key={ruta} path={ruta} element={<Pagina />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
