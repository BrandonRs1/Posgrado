import Buzon from "../components/Buzon.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BuzonPage() {
  return (
    <section className="seccion-fade" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <Link to="/" style={{ color: "var(--texto-suave)", textDecoration: "none" }}>
              Inicio
            </Link>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">Buzón Institucional</span>
          </div>
          <h1 className="pagina__titulo">Buzón de Mensajes</h1>
          <p className="pagina__desc">
            Comunicaciones académicas, notificaciones de profesores y seguimiento oficial de posgrados.
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
        <Buzon />
      </div>
    </section>
  );
}

