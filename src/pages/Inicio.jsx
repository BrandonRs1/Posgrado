import PaginaVacia from "../components/PaginaVacia.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";

export default function Inicio() {
  const { perfil } = useAuth();
  return (
    <PaginaVacia
      titulo={`Hola, ${perfil.nombre}`}
      descripcion={`Sesión iniciada como ${etiquetaRol(perfil).toLowerCase()}.`}
    />
  );
}
