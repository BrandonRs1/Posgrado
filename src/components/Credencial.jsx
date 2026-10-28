import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../context/AuthContext.jsx";
import { etiquetaRol } from "../lib/permisos.js";
import { prepararFoto } from "../lib/foto.js";
import { Camera, QrCode, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  return [["Correo institucional", perfil.correo]];
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
      if (anterior) supabase.storage.from("fotos").remove([anterior]); // limpieza
    } catch (err) {
      setError(err?.amigable ? err.message : "No se pudo guardar la foto. Intenta de nuevo.");
    } finally {
      setSubiendo(false);
    }
  };

  const nombreCompleto = [perfil.nombre, perfil.apellido_paterno, perfil.apellido_materno]
    .filter(Boolean)
    .join(" ");

  const folioCorto = perfil.id ? perfil.id.substring(0, 8).toUpperCase() : "POS-2026";

  return (
    <article className="credencial" aria-label="Credencial Institucional">
      {/* Cinta reflectante y sello superior */}
      <div className="credencial__banda">
        <div className="credencial__institucion-wrapper">
          <ShieldCheck size={16} />
          <span className="credencial__institucion">Evaluación de Posgrados</span>
        </div>
        <span className="credencial__tipo-credencial">Digital ID</span>
      </div>

      <div className="credencial__cuerpo">
        {/* Foto de perfil interactiva */}
        <div className="credencial__foto">
          <div className="credencial__avatar-container">
            <button
              type="button"
              className="credencial__avatar"
              onClick={() => inputRef.current?.click()}
              disabled={subiendo}
              aria-label="Cambiar fotografía de perfil"
            >
              {fotoUrl ? (
                <img src={fotoUrl} alt={`Fotografía de ${perfil.nombre}`} />
              ) : (
                iniciales(perfil)
              )}
            </button>
            <button
              type="button"
              className="credencial__foto-badge"
              onClick={() => inputRef.current?.click()}
              disabled={subiendo}
              title="Actualizar foto de perfil"
            >
              <Camera size={13} />
            </button>
          </div>

          <button
            type="button"
            className="credencial__cambiar"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
          >
            {subiendo ? "Guardando…" : perfil.foto_ruta ? "Cambiar foto" : "Subir fotografía"}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={cambiarFoto}
          />
        </div>

        {/* Datos del acreditado */}
        <div className="credencial__datos">
          <div className="credencial__identidad-header">
            <h2 className="credencial__nombre">{nombreCompleto}</h2>
            <div className="credencial__rol-chip">
              <CheckCircle2 size={12} />
              <span>{etiquetaRol(perfil)}</span>
            </div>
          </div>

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

      {/* Pie de autenticación con código de seguridad institucional */}
      <div className="credencial__pie">
        <div className="credencial__qr-block">
          <QrCode size={28} className="credencial__qr-icon" />
          <div className="credencial__seguridad-meta">
            <span className="credencial__folio">ID: POS-{folioCorto}</span>
            <span className="credencial__vigencia">Válido Ciclo 2026-2027</span>
          </div>
        </div>
        <div className="credencial__holograma">
          <span>OFICIAL</span>
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
