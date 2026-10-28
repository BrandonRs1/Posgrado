import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";
import { prepararFoto } from "../lib/foto.js";
import "../credencial.css";

const iniciales = (p) => ((p.nombre?.[0] ?? "") + (p.apellido_paterno?.[0] ?? "")).toUpperCase();

const formatoCalificacion = (n) =>
  Number(n).toLocaleString("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

// Qué datos se muestran según el tipo de usuario
function filasDe(perfil) {
  if (perfil.tipo === "alumno") {
    if (perfil.estatus === "aceptado") {
      return [
        ["No. de control", perfil.numeroControl ?? "—"],
        ["Posgrado que cursa", perfil.posgrado ?? "—"],
      ];
    }
    return [
      ["No. de aspirante", perfil.numeroAspirante ?? "—"],
      [
        "Calificación",
        perfil.calificacionAspirante != null ? formatoCalificacion(perfil.calificacionAspirante) : "Pendiente",
      ],
    ];
  }
  return [["Correo", perfil.correo]];
}

export default function Credencial() {
  const { perfil, refrescarPerfil } = useAuth();
  const [fotoUrl, setFotoUrl] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // La foto vive en un almacenamiento privado: pedimos un enlace temporal para mostrarla
  useEffect(() => {
    let cancelado = false;
    if (!perfil.foto_ruta) {
      setFotoUrl(null);
      return;
    }
    supabase.storage
      .from("fotos")
      .createSignedUrl(perfil.foto_ruta, 3600)
      .then(({ data }) => {
        if (!cancelado) setFotoUrl(data?.signedUrl ?? null);
      });
    return () => {
      cancelado = true;
    };
  }, [perfil.foto_ruta]);

  const cambiarFoto = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;

    setError("");
    setSubiendo(true);
    try {
      const imagen = await prepararFoto(archivo);
      const ruta = `${perfil.id}/${crypto.randomUUID()}.jpg`;

      const { error: errorSubida } = await supabase.storage
        .from("fotos")
        .upload(ruta, imagen, { contentType: "image/jpeg" });
      if (errorSubida) throw errorSubida;

      const { error: errorRuta } = await supabase.rpc("actualizar_mi_foto", { p_ruta: ruta });
      if (errorRuta) throw errorRuta;

      const anterior = perfil.foto_ruta;
      await refrescarPerfil();
      if (anterior) supabase.storage.from("fotos").remove([anterior]); // limpieza, si falla no importa
    } catch (err) {
      setError(err?.amigable ? err.message : "No se pudo guardar la foto. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  const nombreCompleto = [perfil.nombre, perfil.apellido_paterno, perfil.apellido_materno]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="credencial" aria-label="Credencial">
      <div className="credencial__banda">Evaluación de Posgrados</div>

      <div className="credencial__cuerpo">
        <div className="credencial__foto">
          <button
            type="button"
            className="credencial__avatar"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            aria-label="Cambiar foto de perfil"
          >
            {fotoUrl ? <img src={fotoUrl} alt={`Foto de ${perfil.nombre}`} /> : iniciales(perfil)}
          </button>
          <button
            type="button"
            className="credencial__cambiar"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            {subiendo ? "Subiendo…" : perfil.foto_ruta ? "Cambiar foto" : "Agregar foto"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={cambiarFoto}
          />
        </div>

        <div className="credencial__datos">
          <h2 className="credencial__nombre">{nombreCompleto}</h2>
          <span className="credencial__rol">{etiquetaRol(perfil)}</span>
          <dl className="credencial__filas">
            {filasDe(perfil).map(([titulo, valor]) => (
              <div key={titulo} className="credencial__fila">
                <dt>{titulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {error && (
        <p className="error credencial__error" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
