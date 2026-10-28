import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

// PostgREST a veces regresa un objeto y a veces una lista de un elemento
const uno = (x) => (Array.isArray(x) ? x[0] : x);

// Arma el perfil: datos básicos + puesto / roles / estatus según el tipo de usuario.
// (Cada consulta pasa por los permisos de la BD: solo regresa lo que ese usuario puede ver)
async function cargarPerfil(authUid) {
  const { data: u, error } = await supabase
    .from("usuarios")
    .select("id, nombre, apellido_paterno, apellido_materno, correo, tipo, foto_ruta")
    .eq("auth_uid", authUid)
    .maybeSingle();
  if (error) throw error;
  if (!u) return null;

  const perfil = { ...u };
  if (u.tipo === "administrativo") {
    const { data } = await supabase
      .from("administrativos")
      .select("puesto")
      .eq("usuario_id", u.id)
      .maybeSingle();
    perfil.puesto = data?.puesto ?? null;
  } else if (u.tipo === "profesor") {
    const { data } = await supabase.from("profesor_roles").select("rol").eq("usuario_id", u.id);
    perfil.roles = (data ?? []).map((r) => r.rol);
  } else if (u.tipo === "alumno") {
    const { data: a } = await supabase
      .from("alumnos")
      .select("estatus, numero_aspirante, numero_control, posgrados(nombre)")
      .eq("usuario_id", u.id)
      .maybeSingle();
    perfil.estatus = a?.estatus ?? null;
    perfil.numeroAspirante = a?.numero_aspirante ?? null;
    perfil.numeroControl = a?.numero_control ?? null;
    perfil.posgrado = uno(a?.posgrados)?.nombre ?? null;

    // Calificación del aspirante: la final del propedéutico (existe cuando se genera el acta)
    const { data: inscripciones } = await supabase
      .from("inscripciones_propedeutico")
      .select("calificacion_final, cursos_propedeutico(fecha_fin)")
      .eq("alumno_id", u.id)
      .not("calificacion_final", "is", null);
    const masReciente = [...(inscripciones ?? [])].sort((x, y) =>
      (uno(y.cursos_propedeutico)?.fecha_fin ?? "").localeCompare(uno(x.cursos_propedeutico)?.fecha_fin ?? "")
    )[0];
    perfil.calificacionAspirante = masReciente?.calificacion_final ?? null;
  }
  return perfil;
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState(false);

  // 1) Estar atento a la sesión (inicio, cierre, renovación)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      if (!data.session) setCargando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion);
      if (!nuevaSesion) {
        setPerfil(null);
        setCargando(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 2) Cuando hay un usuario distinto, cargar su perfil
  const userId = sesion?.user?.id;
  useEffect(() => {
    if (!userId) return;
    let cancelado = false;
    setCargando(true);
    setErrorPerfil(false);
    cargarPerfil(userId)
      .then((p) => !cancelado && setPerfil(p))
      .catch(() => !cancelado && setErrorPerfil(true))
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, [userId]);

  const iniciarSesion = async (correo, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.trim(),
      password,
    });
    if (error) throw error;
  };

  const cerrarSesion = () => supabase.auth.signOut();

  // Vuelve a leer el perfil sin mostrar "Cargando…" (ej. después de cambiar la foto)
  const refrescarPerfil = async () => {
    if (!userId) return;
    setPerfil(await cargarPerfil(userId));
  };

  return (
    <AuthContext.Provider
      value={{ sesion, perfil, cargando, errorPerfil, iniciarSesion, cerrarSesion, refrescarPerfil }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
