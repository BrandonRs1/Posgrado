import Anuncios from "../components/Anuncios.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AnunciosPage() {
  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Anuncios y Convocatorias</h1>
          <p className="pagina__desc">
            Avisos oficiales, calendarios de evaluación y comunicados escolares.
          </p>
        </div>

        <div className="modulo-acciones">
          <Link to="/" className="boton-secundario">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>

      <Anuncios />
    </section>
  );
}
