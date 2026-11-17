import Buzon from "../components/Buzon.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BuzonPage() {
  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Buzón de Mensajes</h1>
          <p className="pagina__desc">
            Mensajes directos de profesores y de la coordinación de posgrados.
          </p>
        </div>

        <div className="modulo-acciones">
          <Link to="/" className="boton-secundario">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>

      <Buzon />
    </section>
  );
}
