import "./lib/tema.js"; // aplica modo claro/oscuro antes de pintar
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";

function Pantalla({ titulo, texto, children }) {
  return (
    <div className="login">
      <div className="tarjeta-simple">
        {titulo && <h1 className="pagina__titulo">{titulo}</h1>}
        {texto && <p className="pagina__desc">{texto}</p>}
        {children}
      </div>
    </div>
  );
}

function Contenido() {
  const { sesion, perfil, cargando, errorPerfil, cerrarSesion } = useAuth();

  if (cargando) return <Pantalla texto="Cargando…" />;
  if (!sesion) return <Login />;

  if (errorPerfil || !perfil) {
    return (
      <Pantalla
        titulo="No pudimos abrir tu cuenta"
        texto={
          errorPerfil
            ? "Hubo un problema al cargar tu perfil. Intenta de nuevo en un momento."
            : "Tu cuenta todavía no tiene un perfil asignado. Pide al coordinador que la active."
        }
      >
        <button type="button" className="boton-principal" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </Pantalla>
    );
  }

  return <Layout />;
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <div className="fondo" aria-hidden="true" />
      <Contenido />
    </AuthProvider>
  );
}
