import Credencial from "../components/Credencial.jsx";
import Buzon from "../components/Buzon.jsx";
import Anuncios from "../components/Anuncios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";
import { ExternalLink } from "lucide-react";

export default function Inicio() {
  const { perfil } = useAuth();

  const nombreCompleto = [
    perfil?.nombre,
    perfil?.apellido_paterno,
    perfil?.apellido_materno,
  ]
    .filter(Boolean)
    .join(" ");

  const estatusAlumno =
    perfil?.tipo === "alumno"
      ? perfil?.estatus === "aceptado"
        ? "Alumno RegularInscrito"
        : "Aspirante en Proceso"
      : etiquetaRol(perfil);

  return (
    <section className="portal-inicio">
      {/* Barra de resumen escolar sobria */}
      <header className="ficha-encabezado">
        <div className="ficha-encabezado__principal">
          <span className="ficha-encabezado__etiqueta">Ficha Escolar</span>
          <h1 className="ficha-encabezado__nombre">{nombreCompleto}</h1>
        </div>

        <dl className="ficha-encabezado__meta">
          <div className="ficha-encabezado__dato">
            <dt>Estatus / Rol</dt>
            <dd>
              {perfil?.tipo === "alumno"
                ? perfil?.estatus === "aceptado"
                  ? "Alumno Aceptado"
                  : "Aspirante"
                : etiquetaRol(perfil)}
            </dd>
          </div>
          {perfil?.posgrado && (
            <div className="ficha-encabezado__dato">
              <dt>Programa</dt>
              <dd>{perfil.posgrado}</dd>
            </div>
          )}
          <div className="ficha-encabezado__dato">
            <dt>Periodo</dt>
            <dd>2026–2027</dd>
          </div>
        </dl>
      </header>

      {/* Estructura en Grid Suizo: Credencial a la izquierda + Buzón y Anuncios al lado */}
      <div className="portal-inicio__grid">
        {/* Columna 1: Credencial Escolar */}
        <div className="portal-inicio__col-credencial">
          <div className="bloque-cabecera">
            <h2 className="bloque-cabecera__titulo">Credencial Escolar</h2>
            <span className="bloque-cabecera__sub">Identificación oficial</span>
          </div>
          <Credencial />
        </div>

        {/* Columnas 2 y 3: Buzón y Anuncios al lado de la credencial */}
        <div className="portal-inicio__col-comunicacion">
          <div className="portal-inicio__panel">
            <div className="bloque-cabecera">
              <h2 className="bloque-cabecera__titulo">Buzón de Mensajes</h2>
              <a
                href="/buzon"
                target="_blank"
                rel="noopener noreferrer"
                className="bloque-cabecera__enlace"
              >
                <span>Abrir vista completa</span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
            <Buzon />
          </div>

          <div className="portal-inicio__panel">
            <div className="bloque-cabecera">
              <h2 className="bloque-cabecera__titulo">Anuncios y Convocatorias</h2>
              <a
                href="/anuncios"
                target="_blank"
                rel="noopener noreferrer"
                className="bloque-cabecera__enlace"
              >
                <span>Abrir vista completa</span>
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            </div>
            <Anuncios />
          </div>
        </div>
      </div>
    </section>
  );
}
