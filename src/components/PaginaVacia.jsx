export default function PaginaVacia({ titulo, descripcion }) {
  return (
    <section>
      <h1 className="pagina__titulo">{titulo}</h1>
      <p className="pagina__desc">{descripcion}</p>
      <div className="vacio">Esta sección está lista para recibir contenido.</div>
    </section>
  );
}
