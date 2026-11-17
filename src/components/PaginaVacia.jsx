export default function PaginaVacia({ titulo, descripcion }) {
  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">{titulo}</h1>
          <p className="pagina__desc">{descripcion}</p>
        </div>
      </div>

      <div className="modulo-vacio-card">
        <h2 className="modulo-vacio-titulo">Sin registros por el momento</h2>
        <p className="modulo-vacio-desc">
          Aún no hay información registrada en este apartado para el ciclo escolar actual.
        </p>
      </div>
    </section>
  );
}
