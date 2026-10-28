import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { IconAnuncio, IconCampana } from "./Iconos.jsx";

const DEMO_ANUNCIOS = [
  {
    id: "demo-a1",
    titulo: "Publicación del Calendario Oficial de Evaluaciones",
    contenido:
      "Se encuentra disponible para consulta el calendario de exámenes, entrega de calificaciones y actas finales del ciclo escolar. Por favor revisa las fechas límites de registro de actas y trámites de titulación.",
    categoria: "academico",
    importante: false,
    dirigido_a: "todos",
    autor_nombre: "Coordinación General de Posgrados",
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "demo-a2",
    titulo: "Aviso a Aspirantes: Recepción de Documentación Física",
    contenido:
      "A todos los aspirantes registrados en el proceso de admisión: deberán presentarse en la ventanilla de Servicios Escolares de Posgrado con sus certificados y actas originales para cotejo y validación de expediente.",
    categoria: "urgente",
    importante: true,
    dirigido_a: "aspirantes",
    autor_nombre: "Servicios Escolares",
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "demo-a3",
    titulo: "Convocatoria de Becas de Apoyo a la Investigación",
    contenido:
      "Se abre la recepción de solicitudes para financiamiento de estancias académicas y proyectos de tesis para estudiantes de maestría y doctorado. La recepción de expedientes concluirá a fin de mes.",
    categoria: "convocatoria",
    importante: true,
    dirigido_a: "aceptados",
    autor_nombre: "Dirección de Investigación",
    creado_en: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

function formatearFecha(isoString) {
  try {
    const f = new Date(isoString);
    return f.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Fecha reciente";
  }
}

export default function Anuncios() {
  const { perfil } = useAuth();
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("todos"); // 'todos', 'importante', 'academico', 'convocatoria'
  const [abiertos, setAbiertos] = useState({});

  useEffect(() => {
    let cancelado = false;

    async function cargarAnuncios() {
      setCargando(true);
      try {
        let query = supabase
          .from("anuncios")
          .select(
            `id, titulo, contenido, categoria, importante, dirigido_a, creado_en,
             autor:usuarios!autor_id (nombre, apellido_paterno)`
          )
          .order("creado_en", { ascending: false });

        // Filtrado por tipo de público según el perfil
        if (perfil?.tipo === "alumno") {
          const estatus = perfil.estatus === "aceptado" ? "aceptados" : "aspirantes";
          query = query.in("dirigido_a", ["todos", estatus]);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
          // Si la tabla no tiene datos o no se ha corrido la migración, mostramos demo acordes al usuario
          const relevantes = DEMO_ANUNCIOS.filter((a) => {
            if (perfil?.tipo !== "alumno") return true;
            const target = perfil.estatus === "aceptado" ? "aceptados" : "aspirantes";
            return a.dirigido_a === "todos" || a.dirigido_a === target;
          });
          if (!cancelado) setAnuncios(relevantes);
        } else {
          const formateados = data.map((a) => ({
            id: a.id,
            titulo: a.titulo,
            contenido: a.contenido,
            categoria: a.categoria,
            importante: a.importante,
            dirigido_a: a.dirigido_a,
            creado_en: a.creado_en,
            autor_nombre: a.autor
              ? `${a.autor.nombre} ${a.autor.apellido_paterno}`
              : "Coordinación",
          }));
          if (!cancelado) setAnuncios(formateados);
        }
      } catch {
        if (!cancelado) setAnuncios(DEMO_ANUNCIOS);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarAnuncios();
    return () => {
      cancelado = true;
    };
  }, [perfil?.id, perfil?.estatus, perfil?.tipo]);

  const toggleExpandir = (id) => {
    setAbiertos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const anunciosFiltrados = anuncios.filter((a) => {
    if (filtro === "importante") return a.importante;
    if (filtro === "academico") return a.categoria === "academico";
    if (filtro === "convocatoria") return a.categoria === "convocatoria";
    return true;
  });

  return (
    <article className="panel-actividad" aria-label="Tablón de Anuncios">
      <header className="panel-actividad__header">
        <div className="panel-actividad__titulo-grupo">
          <div className="panel-actividad__icono-circulo panel-actividad__icono-circulo--azul">
            <IconAnuncio />
          </div>
          <div>
            <h2 className="panel-actividad__titulo">Anuncios Oficiales</h2>
            <p className="panel-actividad__subtitulo">
              Avisos y comunicados emitidos por la administración
            </p>
          </div>
        </div>

        <div className="panel-actividad__acciones">
          <div className="panel-chips">
            <button
              type="button"
              className={`panel-chip ${filtro === "todos" ? "panel-chip--activo" : ""}`}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`panel-chip ${filtro === "importante" ? "panel-chip--activo" : ""}`}
              onClick={() => setFiltro("importante")}
            >
              Importantes
            </button>
            <button
              type="button"
              className={`panel-chip ${filtro === "convocatoria" ? "panel-chip--activo" : ""}`}
              onClick={() => setFiltro("convocatoria")}
            >
              Convocatorias
            </button>
          </div>
        </div>
      </header>

      <div className="panel-actividad__cuerpo">
        {cargando ? (
          <div className="panel-estado-vacio">Cargando anuncios…</div>
        ) : anunciosFiltrados.length === 0 ? (
          <div className="panel-estado-vacio">
            <div className="panel-estado-vacio__check">
              <IconCampana />
            </div>
            <p>No hay avisos publicados en esta categoría por el momento.</p>
          </div>
        ) : (
          <div className="anuncios-grid">
            {anunciosFiltrados.map((a) => {
              const expandido = !!abiertos[a.id];
              return (
                <div
                  key={a.id}
                  className={`anuncio-tarjeta ${a.importante ? "anuncio-tarjeta--importante" : ""}`}
                  onClick={() => toggleExpandir(a.id)}
                >
                  <div className="anuncio-tarjeta__encabezado">
                    <div className="anuncio-tarjeta__etiquetas">
                      {a.importante && (
                        <span className="anuncio-badge anuncio-badge--importante">
                          Importante
                        </span>
                      )}
                      <span className="anuncio-badge anuncio-badge--categoria">
                        {a.categoria === "urgente"
                          ? "Urgente"
                          : a.categoria === "convocatoria"
                          ? "Convocatoria"
                          : a.categoria === "academico"
                          ? "Académico"
                          : "General"}
                      </span>
                      {a.dirigido_a !== "todos" && (
                        <span className="anuncio-badge anuncio-badge--dirigido">
                          {a.dirigido_a === "aspirantes"
                            ? "Aspirantes"
                            : "Alumnos Aceptados"}
                        </span>
                      )}
                    </div>
                    <time className="anuncio-tarjeta__fecha">
                      {formatearFecha(a.creado_en)}
                    </time>
                  </div>

                  <h3 className="anuncio-tarjeta__titulo">{a.titulo}</h3>

                  <p className="anuncio-tarjeta__contenido">
                    {expandido ? a.contenido : `${a.contenido.slice(0, 110)}…`}
                  </p>

                  <div className="anuncio-tarjeta__pie">
                    <span className="anuncio-tarjeta__autor">{a.autor_nombre}</span>
                    <button type="button" className="anuncio-tarjeta__expandir-btn">
                      {expandido ? "Cerrar" : "Ver detalle"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

