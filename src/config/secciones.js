import {
  IconInicio,
  IconProgramas,
  IconEvaluaciones,
  IconCriterios,
  IconReportes,
  IconConfiguracion,
  IconExpediente,
  IconCursos,
} from "../components/Iconos.jsx";
import {
  esAdministrativo,
  esCoordinador,
  esProfesor,
  esProfesorPropedeutico,
  esAlumno,
} from "../lib/permisos.js";
import Inicio from "../pages/Inicio.jsx";
import MiExpediente from "../pages/MiExpediente.jsx";
import MisCursos from "../pages/MisCursos.jsx";
import Programas from "../pages/Programas.jsx";
import Evaluaciones from "../pages/Evaluaciones.jsx";
import Criterios from "../pages/Criterios.jsx";
import Reportes from "../pages/Reportes.jsx";
import Configuracion from "../pages/Configuracion.jsx";

// ÚNICO lugar donde se decide quién ve qué sección.
// Para agregar una página: crea su archivo en /pages, impórtalo aquí y agrega una línea.
// "permiso" recibe el perfil y regresa true/false.
export const secciones = [
  { ruta: "/", nombre: "Inicio", icono: IconInicio, elemento: Inicio, permiso: () => true },
  { ruta: "/mi-expediente", nombre: "Mi expediente", icono: IconExpediente, elemento: MiExpediente, permiso: esAlumno },
  { ruta: "/mis-cursos", nombre: "Mis cursos", icono: IconCursos, elemento: MisCursos, permiso: esProfesorPropedeutico },
  { ruta: "/programas", nombre: "Programas", icono: IconProgramas, elemento: Programas, permiso: esAdministrativo },
  { ruta: "/evaluaciones", nombre: "Evaluaciones", icono: IconEvaluaciones, elemento: Evaluaciones, permiso: (p) => esAdministrativo(p) || esProfesor(p) },
  { ruta: "/criterios", nombre: "Criterios", icono: IconCriterios, elemento: Criterios, permiso: (p) => esAdministrativo(p) || esProfesor(p) },
  { ruta: "/reportes", nombre: "Reportes", icono: IconReportes, elemento: Reportes, permiso: esAdministrativo },
  { ruta: "/configuracion", nombre: "Configuración", icono: IconConfiguracion, elemento: Configuracion, permiso: esCoordinador },
];

export const seccionesPermitidas = (perfil) => secciones.filter((s) => s.permiso(perfil));
