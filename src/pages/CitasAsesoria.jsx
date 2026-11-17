import { useAuth } from "../context/AuthContext.jsx";
import { esAlumno } from "../lib/permisos.js";
import PanelCitasAsesoria from "../components/PanelCitasAsesoria.jsx";

export default function CitasAsesoria() {
  const { perfil } = useAuth();
  const rolVista = esAlumno(perfil) ? "alumno" : "asesor";
  const nombreUsuario = [perfil?.nombre, perfil?.apellido_paterno, perfil?.apellido_materno]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Citas de Asesoría de Tesis</h1>
          <p className="pagina__desc">
            Agenda citas entre alumno y asesor, acepta o rechaza con motivo, reprograma para otro
            día, registra asistencia con «Check» (límite de 1 hora) o cancela indicando la razón.
          </p>
        </div>
      </div>

      <PanelCitasAsesoria rolVista={rolVista} nombreUsuario={nombreUsuario} />
    </section>
  );
}

