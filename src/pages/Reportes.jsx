import { Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

const METRICAS_INSTITUCIONALES = [
  {
    codigo: "IND-01",
    dimension: "Investigación",
    indicador: "Proyectos de investigación científica y tecnológica financiados",
    valorActual: "12 proyectos",
    cumplimiento: 92,
  },
  {
    codigo: "IND-02",
    dimension: "Investigación",
    indicador: "Académicos que participan en redes de investigación",
    valorActual: "14 académicos",
    cumplimiento: 88,
  },
  {
    codigo: "IND-03",
    dimension: "Investigación",
    indicador: "Académicos participantes en convocatorias de investigación",
    valorActual: "15 académicos",
    cumplimiento: 94,
  },
  {
    codigo: "IND-04",
    dimension: "Estudiantes",
    indicador: "Estudiantes participantes en convocatorias científicas",
    valorActual: "28 estudiantes",
    cumplimiento: 85,
  },
  {
    codigo: "IND-05",
    dimension: "Becas",
    indicador: "Estudiantes beneficiados con beca de posgrado",
    valorActual: "34 becarios",
    cumplimiento: 96,
  },
  {
    codigo: "IND-06",
    dimension: "Planta Docente",
    indicador: "Variación de académicos registrados en el SNI",
    valorActual: "+14.3% (16 en SNI)",
    cumplimiento: 95,
  },
  {
    codigo: "IND-07",
    dimension: "Estudiantes",
    indicador: "Estudiantes incorporados en proyectos de investigación",
    valorActual: "36 estudiantes",
    cumplimiento: 100,
  },
  {
    codigo: "IND-08",
    dimension: "Productividad",
    indicador: "Artículos publicados en revistas indexadas",
    valorActual: "24 artículos",
    cumplimiento: 90,
  },
  {
    codigo: "IND-09",
    dimension: "Movilidad",
    indicador: "Estudiantes en programas de intercambio o estancia",
    valorActual: "7 estudiantes",
    cumplimiento: 78,
  },
  {
    codigo: "IND-10",
    dimension: "Sustentabilidad",
    indicador: "Proyectos con enfoque en inclusión y sustentabilidad",
    valorActual: "75.0% (9 de 12)",
    cumplimiento: 75,
  },
  {
    codigo: "IND-11",
    dimension: "Oferta Educativa",
    indicador: "Programas de posgrado activos",
    valorActual: "6 programas",
    cumplimiento: 100,
  },
];

export default function Reportes() {
  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Reportes e Indicadores</h1>
          <p className="pagina__desc">
            Seguimiento de indicadores escolares, matrícula, becas y productividad académica.
          </p>
        </div>

        <div className="modulo-acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={() => toast.success("Reporte exportado en formato Excel.")}
          >
            <FileSpreadsheet size={16} aria-hidden="true" />
            <span>Exportar Excel</span>
          </button>
          <button
            type="button"
            className="boton-principal"
            onClick={() => toast.success("Informe institucional generado en PDF.")}
          >
            <Download size={16} aria-hidden="true" />
            <span>Descargar informe PDF</span>
          </button>
        </div>
      </div>

      {/* Resumen numérico en Azul y Blanco */}
      <div className="modulo-kpis-fila">
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Eficiencia terminal</span>
          <span className="modulo-kpi-item__valor">91.4%</span>
          <span className="modulo-kpi-item__sub">Promedio por cohorte</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Alumnos con beca</span>
          <span className="modulo-kpi-item__valor">34</span>
          <span className="modulo-kpi-item__sub">96% de cobertura</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Docentes en SNI</span>
          <span className="modulo-kpi-item__valor">16</span>
          <span className="modulo-kpi-item__sub">Núcleo académico</span>
        </div>
        <div className="modulo-kpi-item">
          <span className="modulo-kpi-item__label">Programas activos</span>
          <span className="modulo-kpi-item__valor">6</span>
          <span className="modulo-kpi-item__sub">5 maestrías · 1 doctorado</span>
        </div>
      </div>

      {/* Tabla de Indicadores */}
      <div className="modulo-tabla-card">
        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Categoría</th>
                <th className="text-left">Indicador</th>
                <th>Resultado</th>
                <th>Cumplimiento</th>
              </tr>
            </thead>
            <tbody>
              {METRICAS_INSTITUCIONALES.map((m) => (
                <tr key={m.codigo}>
                  <td>
                    <span className="badge-codigo">{m.codigo}</span>
                  </td>
                  <td>
                    <span className="programa-badge programa-badge--suave">{m.dimension}</span>
                  </td>
                  <td className="text-left">
                    <span className="nombre-persona">{m.indicador}</span>
                  </td>
                  <td>
                    <span className="calificacion-pill">{m.valorActual}</span>
                  </td>
                  <td style={{ minWidth: "160px" }}>
                    <div className="reporte-barra-track">
                      <div
                        className="reporte-barra-fill"
                        style={{ width: `${m.cumplimiento}%` }}
                      />
                    </div>
                    <span className="fecha-suave">{m.cumplimiento}% de la meta</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
