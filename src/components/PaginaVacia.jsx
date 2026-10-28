import { Search, Filter, Plus, Download, Layers, ArrowUpRight, Sparkles } from "lucide-react";

export default function PaginaVacia({ titulo, descripcion }) {
  return (
    <section className="modulo-seccion seccion-fade">
      {/* Encabezado y Barra de Acciones del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Portal Académico</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">{titulo}</span>
          </div>
          <h1 className="pagina__titulo">{titulo}</h1>
          <p className="pagina__desc">{descripcion}</p>
        </div>

        <div className="modulo-acciones">
          <button type="button" className="boton-secundario" title="Exportar datos del módulo">
            <Download size={16} />
            <span>Exportar</span>
          </button>
          <button type="button" className="boton-principal" title="Agregar nuevo registro">
            <Plus size={16} />
            <span>Nuevo registro</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="modulo-toolbar">
        <div className="modulo-buscar">
          <Search size={16} className="modulo-buscar__icono" />
          <input
            type="text"
            placeholder={`Buscar en ${titulo.toLowerCase()}…`}
            className="modulo-buscar__input"
            disabled
          />
        </div>

        <button type="button" className="modulo-filtro-btn" disabled>
          <Filter size={15} />
          <span>Filtros avanzados</span>
        </button>

        <div className="modulo-estado-badge">
          <span className="modulo-estado-badge__dot" />
          <span>Módulo sincronizado</span>
        </div>
      </div>

      {/* Contenedor Ejecutivo de Contenido Vacío / Listo */}
      <div className="modulo-vacio-card">
        <div className="modulo-vacio-icono-container">
          <div className="modulo-vacio-icono-halo" />
          <div className="modulo-vacio-icono">
            <Layers size={36} strokeWidth={1.7} />
          </div>
        </div>

        <h2 className="modulo-vacio-titulo">Módulo de {titulo} preparado</h2>
        <p className="modulo-vacio-desc">
          Este apartado está vinculado con la base de datos institucional en Supabase.
          Actualmente no hay registros activos en este ciclo para mostrar o se encuentra en fase de captura.
        </p>

        <div className="modulo-vacio-acciones">
          <button type="button" className="boton-principal">
            <Plus size={16} />
            <span>Comenzar primer registro</span>
          </button>
          <button type="button" className="boton-secundario">
            <span>Guía de captura</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* Guía Rápida Institucional */}
        <div className="modulo-vacio-tips">
          <div className="modulo-tip">
            <Sparkles size={16} className="modulo-tip__icono" />
            <div>
              <span className="modulo-tip__titulo">Validación automática</span>
              <p className="modulo-tip__texto">Tus registros quedan auditados con tu perfil institucional.</p>
            </div>
          </div>
          <div className="modulo-tip">
            <Sparkles size={16} className="modulo-tip__icono" />
            <div>
              <span className="modulo-tip__titulo">Seguridad por roles</span>
              <p className="modulo-tip__texto">Solo el personal autorizado puede modificar los criterios del posgrado.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
