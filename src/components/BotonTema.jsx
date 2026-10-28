import { useState } from "react";
import { IconSol, IconLuna } from "./Iconos.jsx";
import { aplicarTema } from "../lib/tema.js";

export default function BotonTema() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.tema);
  const oscuro = tema === "oscuro";

  const cambiar = () => {
    const nuevo = oscuro ? "claro" : "oscuro";
    aplicarTema(nuevo);
    setTema(nuevo);
  };

  const texto = oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  return (
    <button type="button" className="boton-icono" onClick={cambiar} aria-label={texto} title={texto}>
      {oscuro ? <IconSol /> : <IconLuna />}
    </button>
  );
}
