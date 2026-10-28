// Qué es cada usuario. El "perfil" lo arma AuthContext desde la base de datos.
// OJO: esto solo decide qué se MUESTRA. La seguridad real está en la BD (02_seguridad.sql).
export const esAdministrativo = (p) => p?.tipo === "administrativo";
export const esCoordinador = (p) => p?.tipo === "administrativo" && p?.puesto === "coordinador";
export const esProfesor = (p) => p?.tipo === "profesor";
export const esProfesorPropedeutico = (p) =>
  p?.tipo === "profesor" && Boolean(p.roles?.includes("propedeutico"));
export const esAlumno = (p) => p?.tipo === "alumno";

const NOMBRES_ROL = {
  propedeutico: "Prof. propedéutico",
  entrevistador: "Entrevistador",
  asesor: "Asesor",
};

export function etiquetaRol(p) {
  if (!p) return "";
  if (p.tipo === "administrativo") return p.puesto === "coordinador" ? "Coordinador" : "Secretaría";
  if (p.tipo === "profesor") {
    const roles = (p.roles ?? []).map((r) => NOMBRES_ROL[r] ?? r);
    return roles.length ? roles.join(", ") : "Profesor";
  }
  if (p.tipo === "alumno") return p.estatus === "aceptado" ? "Alumno" : "Aspirante";
  return "";
}
