import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BotonTema from "./BotonTema.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { seccionesPermitidas } from "../config/secciones.js";

const esEscritorio = () => window.innerWidth >= 900;

export default function Layout() {
  const { perfil } = useAuth();
  // En escritorio arranca abierto, en celular cerrado
  const [abierto, setAbierto] = useState(esEscritorio);

  const alNavegar = () => {
    if (!esEscritorio()) setAbierto(false);
  };

  return (
    <div className={`layout ${abierto ? "layout--abierto" : ""}`}>
      <header className="topbar">
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
        <span className="topbar__titulo">Evaluación de Posgrados</span>
        <div className="topbar__acciones">
          <BotonTema />
        </div>
      </header>

      <Sidebar abierto={abierto} onNavegar={alNavegar} />
      {abierto && <div className="velo" onClick={() => setAbierto(false)} />}

      <main className="pagina">
        <Routes>
          {seccionesPermitidas(perfil).map(({ ruta, elemento: Pagina }) => (
            <Route key={ruta} path={ruta} element={<Pagina />} />
          ))}
          {/* Si alguien entra a una ruta que no le toca, lo regresamos al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
