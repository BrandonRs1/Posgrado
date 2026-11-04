import Anuncios from "../components/Anuncios.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AnunciosPage() {
  return (
    <section className="seccion-fade" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <Link to="/" style={{ color: "var(--texto-suave)", textDecoration: "none" }}>
              Inicio
            </Link>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">Avisos y Convocatorias</span>
          </div>
          <h1 className="pagina__titulo">Tablón Oficial de Avisos</h1>
          <p className="pagina__desc">
            Convocatorias de becas, calendarios oficiales y comunicados de servicios escolares de posgrado.
          </p>
        </div>

        <div className="modulo-acciones">
          <Link to="/" className="boton-secundario" style={{ textDecoration: "none" }}>
            <ArrowLeft size={16} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px" }}>
        <Anuncios />
      </div>
    </section>
  );
}

