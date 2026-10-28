import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import BotonTema from "../components/BotonTema.jsx";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";

// Busca la imagen en src/assets/logo_login.(png|jpg|jpeg|svg|webp)
const imagenes = import.meta.glob("../assets/logo_login.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});
const logoLogin = Object.values(imagenes)[0];

export default function Login() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (enviando) return;
    setError("");
    setEnviando(true);
    try {
      await iniciarSesion(correo, password);
    } catch (err) {
      const credenciales = err?.code === "invalid_credentials" || err?.status === 400;
      setError(
        credenciales
          ? "Correo o contraseña incorrectos. Verifica tus credenciales."
          : "No pudimos iniciar sesión. Revisa tu conexión a internet e intenta de nuevo."
      );
      setEnviando(false);
    }
  };

  return (
    <div className="login">
      <div className="login__tema">
        <BotonTema />
      </div>

      <div className="login__tarjeta">
        {/* Lado Institucional / Branding */}
        <div className="login__imagen">
          {logoLogin ? (
            <div className="login__branding">
              <img className="login__logo" src={logoLogin} alt="Logotipo institucional" />
              <div className="login__bienvenida">
                <h2 className="login__bienvenida-titulo">Bienvenido</h2>
                <p className="login__bienvenida-sub">Sistema de Evaluación y Gestión de Posgrados</p>
              </div>
            </div>
          ) : (
            <div className="login__branding">
              {/* Emblema Institucional de Alto Nivel */}
              <div className="login__emblema">
                <div className="login__emblema-anillo">
                  <div className="login__emblema-icono">
                    <GraduationCap size={44} strokeWidth={1.7} />
                  </div>
                </div>
                <div className="login__emblema-tag">
                  <ShieldCheck size={14} />
                  <span>Portal Oficial Verificado</span>
                </div>
              </div>
              <div className="login__bienvenida">
                <h2 className="login__bienvenida-titulo">Posgrados Institucionales</h2>
                <p className="login__bienvenida-sub">
                  Plataforma integral de evaluación académica, expedientes y gestión de posgrados
                </p>
              </div>
            </div>
          )}

          <div className="login__seguridad-pie">
            <span className="login__seguridad-dot" />
            <span>Acceso Seguro • Encriptación 256-bit</span>
          </div>
        </div>

        {/* Lado del Formulario */}
        <form className="login__form" onSubmit={enviar}>
          <div className="login__form-header">
            <span className="login__kicker">Ingreso al Sistema</span>
            <h1 className="login__titulo">Iniciar sesión</h1>
            <p className="login__desc">Ingresa con tus credenciales institucionales registradas</p>
          </div>

          <label className="campo">
            <span className="campo__etiqueta">Correo electrónico institucional</span>
            <div className="campo__con-icono">
              <Mail className="campo__icono-lateral" size={18} />
              <input
                type="email"
                placeholder="ejemplo@posgrados.edu.mx"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Contraseña</span>
            <div className="campo__con-icono campo__password">
              <Lock className="campo__icono-lateral" size={18} />
              <input
                type={verPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="campo__ver"
                onClick={() => setVerPassword(!verPassword)}
                aria-label={verPassword ? "Ocultar contraseña" : "Ver contraseña"}
                tabIndex={-1}
              >
                {verPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="error-banner" role="alert">
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="boton-principal boton-login" disabled={enviando}>
            <span>{enviando ? "Verificando credenciales…" : "Acceder al portal"}</span>
            {!enviando && <ArrowRight size={18} />}
          </button>

          <p className="login__ayuda">
            ¿Problemas de acceso? Contacta a la coordinación escolar o soporte técnico de posgrados.
          </p>
        </form>
      </div>
    </div>
  );
}
