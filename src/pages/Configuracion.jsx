import { useState } from "react";
import {
  Settings,
  Calendar,
  Save,
  ShieldCheck,
  Bell,
  Mail,
  Lock,
  Database,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function Configuracion() {
  const [ciclo, setCiclo] = useState("2026-A");
  const [califMinima, setCalifMinima] = useState("80.0");
  const [fechaLimite, setFechaLimite] = useState("2026-11-20");
  const [notifCorreo, setNotifCorreo] = useState(true);
  const [registroAspirantes, setRegistroAspirantes] = useState(true);

  const guardar = (e) => {
    e.preventDefault();
    toast.success("Parámetros del sistema y ciclo escolar actualizados exitosamente.");
  };

  return (
    <section className="modulo-seccion seccion-fade">
      {/* Cabecera del Módulo */}
      <div className="modulo-header">
        <div className="modulo-header__info">
          <div className="modulo-breadcrumbs">
            <span>Coordinación General</span>
            <span className="modulo-breadcrumbs__sep">/</span>
            <span className="modulo-breadcrumbs__actual">Configuración Institucional</span>
          </div>
          <h1 className="pagina__titulo">Parámetros del Sistema de Posgrados</h1>
          <p className="pagina__desc">
            Administración del ciclo activo, fechas límite de dictamen y reglas de admisión.
          </p>
        </div>

        <div className="modulo-acciones">
          <button type="submit" form="form-config" className="boton-principal">
            <Save size={16} />
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </div>

      <form id="form-config" onSubmit={guardar} className="configuracion-grid">
        {/* Panel 1: Ciclo y Calendario */}
        <div className="configuracion-card">
          <div className="configuracion-card__header">
            <Calendar size={20} className="configuracion-card__icono" />
            <div>
              <h2 className="configuracion-card__titulo">Ciclo Académico y Convocatoria</h2>
              <p className="configuracion-card__desc">Define las fechas de operación del sistema escolar.</p>
            </div>
          </div>

          <div className="configuracion-card__cuerpo">
            <label className="campo">
              <span>Ciclo Escolar Activo</span>
              <select
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                className="select-estilizado"
              >
                <option value="2026-A">Ciclo 2026-A (Semestre Enero - Junio)</option>
                <option value="2026-B">Ciclo 2026-B (Semestre Agosto - Diciembre)</option>
                <option value="2027-A">Ciclo 2027-A (Próxima apertura)</option>
              </select>
            </label>

            <label className="campo">
              <span>Fecha Límite para Captura de Actas y Dictámenes</span>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </label>

            <label className="campo">
              <span>Calificación Mínima Aprobatoria de Admisión</span>
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

        {/* Panel 2: Notificaciones y Accesos */}
        <div className="configuracion-card">
          <div className="configuracion-card__header">
            <Bell size={20} className="configuracion-card__icono" />
            <div>
              <h2 className="configuracion-card__titulo">Alertas y Registro de Aspirantes</h2>
              <p className="configuracion-card__desc">Canales de comunicación y control de acceso.</p>
            </div>
          </div>

          <div className="configuracion-card__cuerpo">
            <div className="toggle-row">
              <div>
                <strong>Apertura de Registro a Nuevos Aspirantes</strong>
                <p>Permitir que nuevos candidatos envíen documentación al portal.</p>
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
                <strong>Notificaciones Automáticas por Correo</strong>
                <p>Enviar aviso al estudiante cuando un profesor asiente su calificación.</p>
              </div>
              <input
                type="checkbox"
                checked={notifCorreo}
                onChange={(e) => setNotifCorreo(e.target.checked)}
                className="toggle-checkbox"
              />
            </div>

            <div className="seguridad-aviso-box">
              <ShieldCheck size={20} />
              <div>
                <strong>Auditoría Criptográfica Activa</strong>
                <p>Todas las transacciones y firmas de actas quedan firmadas en la base de datos de Supabase.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
