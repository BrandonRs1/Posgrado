import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import BotonTema from "../components/BotonTema.jsx";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from "lucide-react";

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
        {/* Lado Institucional */}
        <div className="login__imagen">
          <div className="login__branding">
            {logoLogin ? (
              <img className="login__logo" src={logoLogin} alt="Logotipo institucional" />
            ) : (
              <div className="login__emblema" aria-hidden="true">
                <GraduationCap size={28} strokeWidth={1.6} />
              </div>
            )}
            <div className="login__bienvenida">
              <p className="login__kicker login__kicker--claro">División de Estudios de Posgrado</p>
              <h2 className="login__bienvenida-titulo">Sistema de Evaluación y Gestión de Posgrados</h2>
              <ul className="login__lista">
                <li>Expediente digital por etapas</li>
                <li>Ponderación, dictámenes y titulación</li>
                <li>Buzón y anuncios oficiales</li>
              </ul>
            </div>
          </div>

          <p className="login__seguridad-pie">Instituto Tecnológico de Morelia · TecNM</p>
        </div>

        {/* Lado del Formulario */}
        <form className="login__form" onSubmit={enviar}>
          <div className="login__form-header">
            <h1 className="login__titulo">Iniciar sesión</h1>
            <p className="login__desc">Usa el correo y la contraseña que te asignó la coordinación.</p>
          </div>

          <label className="campo">
            <span className="campo__etiqueta">Correo institucional</span>
            <div className="campo__con-icono">
              <Mail className="campo__icono-lateral" size={18} aria-hidden="true" />
              <input
                type="email"
                placeholder="nombre@morelia.tecnm.mx"
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
              <Lock className="campo__icono-lateral" size={18} aria-hidden="true" />
              <input
                type={verPassword ? "text" : "password"}
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
                aria-pressed={verPassword}
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
            <span>{enviando ? "Verificando…" : "Entrar"}</span>
            {!enviando && <ArrowRight size={18} aria-hidden="true" />}
          </button>

          <p className="login__ayuda">
            ¿No puedes entrar? Escribe a la coordinación de tu posgrado para restablecer tu acceso.
          </p>
        </form>
      </div>
    </div>
  );
}
