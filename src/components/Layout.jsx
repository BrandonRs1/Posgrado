import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BotonTema from "./BotonTema.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas, secciones } from "../config/secciones.js";
import { etiquetaRol } from "../lib/permisos.js";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import BuzonPage from "../pages/BuzonPage.jsx";
import AnunciosPage from "../pages/AnunciosPage.jsx";

export default function Layout() {
  const { perfil, cerrarSesion } = useAuth();
  const location = useLocation();
  const [menuMovil, setMenuMovil] = useState(false);

  const cerrarMenuMovil = () => setMenuMovil(false);

  const seccionActual =
    secciones.find((s) => s.ruta === location.pathname) ||
    (location.pathname === "/buzon"
      ? { nombre: "Buzón de Mensajes" }
      : location.pathname === "/anuncios"
      ? { nombre: "Avisos y Convocatorias" }
      : { nombre: "Inicio" });

  const iniciales =
    ((perfil?.nombre?.[0] ?? "") + (perfil?.apellido_paterno?.[0] ?? "")).toUpperCase() || "US";

  const nombreCompleto = [perfil?.nombre, perfil?.apellido_paterno].filter(Boolean).join(" ");

  return (
    <div className="app-shell">
      {/* Franja Institucional Superior (Azul Marino) */}
      <header className="inst-header">
        <div className="inst-header__top">
          <div className="inst-header__contenedor">
            <div className="inst-header__marca">
              <div className="inst-header__escudo" aria-hidden="true">
                <GraduationCap size={20} strokeWidth={2} />
              </div>
              <div className="inst-header__textos">
                <span className="inst-header__institucion">
                  Instituto Tecnológico de Morelia
                </span>
                <span className="inst-header__sistema">
                  Sistema de Gestión de Posgrados · Ciclo 2026–2027
                </span>
              </div>
            </div>

            <div className="inst-header__controles">
              <div className="inst-header__usuario">
                <div className="inst-header__avatar" aria-hidden="true">
                  {iniciales}
                </div>
                <div className="inst-header__usuario-info">
                  <span className="inst-header__usuario-nombre">{nombreCompleto}</span>
                  <span className="inst-header__usuario-rol">{etiquetaRol(perfil)}</span>
                </div>
              </div>

              <BotonTema />

              <button
                type="button"
                className="inst-header__salir"
                onClick={cerrarSesion}
                title="Cerrar sesión"
              >
                <LogOut size={16} aria-hidden="true" />
                <span>Salir</span>
              </button>

              <button
                type="button"
                className="inst-header__menu-btn"
                onClick={() => setMenuMovil(!menuMovil)}
                aria-label={menuMovil ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuMovil}
              >
                {menuMovil ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Navegación Horizontal (Blanco y Azul) */}
        <div className="inst-header__nav-bar">
          <div className="inst-header__contenedor inst-header__nav-inner">
            <Sidebar abierto={menuMovil} onNavegar={cerrarMenuMovil} />
            <span className="inst-header__ubicacion" aria-live="polite">
              Sección: <strong>{seccionActual.nombre}</strong>
            </span>
          </div>
        </div>
      </header>

      {menuMovil && <div className="velo" onClick={cerrarMenuMovil} />}

      {/* Contenedor Principal Centrado */}
      <main className="contenedor-principal">
        <Routes>
          {seccionesPermitidas(perfil).map(({ ruta, elemento: Pagina }) => (
            <Route key={ruta} path={ruta} element={<Pagina />} />
          ))}
          <Route path="/buzon" element={<BuzonPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="inst-footer">
        <div className="inst-header__contenedor inst-footer__inner">
          <span>División de Estudios de Posgrado e Investigación (DEPI)</span>
          <span>Portal Escolar · ITM</span>
        </div>
      </footer>
    </div>
  );
}
