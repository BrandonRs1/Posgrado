import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Inicio from "./pages/Inicio.jsx";
import Programas from "./pages/Programas.jsx";
import Evaluaciones from "./pages/Evaluaciones.jsx";
import Criterios from "./pages/Criterios.jsx";
import Reportes from "./pages/Reportes.jsx";
import Configuracion from "./pages/Configuracion.jsx";

const esEscritorio = () => window.innerWidth >= 900;

export default function App() {
  // En escritorio arranca abierto, en celular cerrado
  const [abierto, setAbierto] = useState(esEscritorio);

  const alNavegar = () => {
    if (!esEscritorio()) setAbierto(false);
  };

  return (
    <div className={`layout ${abierto ? "layout--abierto" : ""}`}>
      <div className="fondo" aria-hidden="true" />

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
      </header>

      <Sidebar abierto={abierto} onNavegar={alNavegar} />
      {abierto && <div className="velo" onClick={() => setAbierto(false)} />}

      <main className="pagina">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/programas" element={<Programas />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          <Route path="/criterios" element={<Criterios />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </main>
    </div>
  );
}