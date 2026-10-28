import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import BotonTema from "../components/BotonTema.jsx";

// Busca la imagen en src/assets/logo_login.(png|jpg|jpeg|svg|webp)
// Si todavía no existe, se muestra un espacio vacío en su lugar.
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
          ? "Correo o contraseña incorrectos."
          : "No pudimos iniciar sesión. Revisa tu conexión e intenta de nuevo."
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
        <div className="login__imagen">
          {logoLogin ? (
            <img className="login__logo" src={logoLogin} alt="Logo de la institución" />
          ) : (
            <div className="login__espacio">Aquí va la imagen (logo_login)</div>
          )}
        </div>

        <form className="login__form" onSubmit={enviar}>
          <div>
            <h1 className="pagina__titulo">Iniciar sesión</h1>
            <p className="pagina__desc login__desc">Evaluación de Posgrados</p>
          </div>

          <label className="campo">
            <span>Correo institucional</span>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className="campo">
            <span>Contraseña</span>
            <div className="campo__password">
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
              >
                {verPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="boton-principal" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
