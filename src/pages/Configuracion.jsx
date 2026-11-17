import { useState } from "react";
import { Calendar, Save, Bell } from "lucide-react";
import { toast } from "sonner";

export default function Configuracion() {
  const [ciclo, setCiclo] = useState("2026-A");
  const [califMinima, setCalifMinima] = useState("80.0");
  const [fechaLimite, setFechaLimite] = useState("2026-11-20");
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [registroAspirantes, setRegistroAspirantes] = useState(true);

  const guardar = (e) => {
    e.preventDefault();
    toast.success("Configuración del ciclo escolar actualizada.");
  };

  return (
    <section className="modulo-seccion">
      <div className="modulo-header">
        <div className="modulo-header__info">
          <h1 className="pagina__titulo">Configuración del Ciclo Escolar</h1>
          <p className="pagina__desc">
            Periodo activo, fechas límite de captura de calificaciones y parámetros de admisión.
          </p>
        </div>

        <div className="modulo-acciones">
          <button type="submit" form="form-config" className="boton-principal">
            <Save size={16} aria-hidden="true" />
            <span>Guardar cambios</span>
          </button>
        </div>
      </div>

      <form id="form-config" onSubmit={guardar} className="configuracion-grid">
        <div className="configuracion-card">
          <div className="configuracion-card__header">
            <Calendar size={18} className="configuracion-card__icono" aria-hidden="true" />
            <div>
              <h2 className="configuracion-card__titulo">Periodo y Admisión</h2>
              <p className="configuracion-card__desc">Parámetros generales del ciclo vigente.</p>
            </div>
          </div>

          <div className="configuracion-card__cuerpo">
            <label className="campo">
              <span className="campo__etiqueta">Ciclo escolar activo</span>
              <select
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                className="select-estilizado"
              >
                <option value="2026-A">Ciclo 2026-A (Enero – Junio)</option>
                <option value="2026-B">Ciclo 2026-B (Agosto – Diciembre)</option>
                <option value="2027-A">Ciclo 2027-A (Próxima apertura)</option>
              </select>
            </label>

            <label className="campo">
              <span className="campo__etiqueta">Fecha límite para captura de actas</span>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </label>

            <label className="campo">
              <span className="campo__etiqueta">Calificación mínima aprobatoria</span>
              <input
                type="number"
                min="70"
                max="100"
                step="0.5"
                value={califMinima}
                onChange={(e) => setCalifMinima(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="configuracion-card">
          <div className="configuracion-card__header">
            <Bell size={18} className="configuracion-card__icono" aria-hidden="true" />
            <div>
              <h2 className="configuracion-card__titulo">Registro y Avisos</h2>
              <p className="configuracion-card__desc">Recepción de solicitudes y alertas.</p>
            </div>
          </div>

          <div className="configuracion-card__cuerpo">
            <div className="toggle-row">
              <div>
                <strong>Recepción de solicitudes de aspirantes</strong>
                <p>Habilita el envío de documentos para el proceso de admisión.</p>
              </div>
              <input
                type="checkbox"
                checked={registroAspirantes}
                onChange={(e) => setRegistroAspirantes(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="toggle-row">
              <div>
                <strong>Avisos por correo electrónico</strong>
                <p>Notifica al alumno cuando se registre una calificación o dictamen.</p>
              </div>
              <input
                type="checkbox"
                checked={notifCorreo}
                onChange={(e) => setNotifCorreo(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
