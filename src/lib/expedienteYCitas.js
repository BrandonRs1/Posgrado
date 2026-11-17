import { supabase } from "./supabase.js";

const STORAGE_KEY_DOCS = "posgrados_documentos_expediente_v1";
const STORAGE_KEY_TESIS = "posgrados_seguimiento_tesis_v1";
const STORAGE_KEY_CITAS = "posgrados_citas_asesoria_v1";

export const DOCUMENTOS_INICIALES = [
  // ETAPA ASPIRANTE
  {
    id: "ASP-01",
    etapa: "Aspirante",
    nombre: "Solicitud de ingreso al posgrado",
    archivo: "Solicitud_Ingreso_Metalurgia.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "1.1 MB",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "ASP-02",
    etapa: "Aspirante",
    nombre: "Certificado de calificaciones de licenciatura",
    archivo: "Certificado_Calificaciones_Lic.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "2.3 MB",
    tienePlantilla: false,
    esTesis: false,
  },
  {
    id: "ASP-03",
    etapa: "Aspirante",
    nombre: "Cédula profesional de licenciatura",
    archivo: "Cedula_Licenciatura.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "950 KB",
    tienePlantilla: false,
    esTesis: false,
  },
  {
    id: "ASP-04",
    etapa: "Aspirante",
    nombre: "Identificación oficial vigente (INE)",
    archivo: "INE_Vigente.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "780 KB",
    tienePlantilla: false,
    esTesis: false,
  },

  // ETAPA ACEPTADO Y SEGUIMIENTO SEMESTRAL
  {
    id: "ACE-01",
    etapa: "Aceptado / Semestral",
    nombre: "Consentimiento informado para uso de datos personales",
    archivo: "Consentimiento_Datos_ITM.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "640 KB",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "ACE-02",
    etapa: "Aceptado / Semestral",
    nombre: "Carta de aceptación oficial emitida por Coordinación–Consejo",
    archivo: "Carta_Aceptacion_MCM_2026.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "890 KB",
    tienePlantilla: false,
    esTesis: false,
  },
  {
    id: "ACE-03",
    etapa: "Aceptado / Semestral",
    nombre: "Certificado global de licenciatura",
    archivo: "Certificado_Global_Licenciatura.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "2.8 MB",
    tienePlantilla: false,
    esTesis: false,
  },
  {
    id: "ACE-04",
    etapa: "Aceptado / Semestral",
    nombre: "Comprobante de idioma inglés TOEFL (vigencia máxima 2 años)",
    archivo: "TOEFL_Vigente_24meses.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "1.4 MB",
    tienePlantilla: false,
    esTesis: false,
  },
  {
    id: "ACE-05",
    etapa: "Aceptado / Semestral",
    nombre: "Carta de exclusividad SECIHTI firmada",
    archivo: "Carta_Exclusividad_SECIHTI_Firmada.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "1.2 MB",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "SEM-01",
    etapa: "Aceptado / Semestral",
    nombre: "Evaluación del desempeño del becario (EDB) con kárdex semestral",
    archivo: "EDB_y_Kardex_Semestre_Actual.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "1.9 MB",
    tienePlantilla: true,
    esTesis: false,
  },

  // ETAPA TITULACIÓN
  {
    id: "TIT-01",
    etapa: "Titulación",
    nombre: "1ra revisión de tesis firmada por comité tutorial",
    archivo: "1ra_Revision_Tesis_Firmada_Comite.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Validado",
    tamano: "3.1 MB",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "TIT-02",
    etapa: "Titulación",
    nombre: "2da revisión de tesis",
    archivo: "2da_Revision_Tesis.pdf",
    archivoUrl: null,
    rutaStorage: null,
    estatus: "En revisión",
    tamano: "3.4 MB",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "TIT-03",
    etapa: "Titulación",
    nombre: "Tesis digital versión final (Folio: MCM-ITM-2026-008)",
    archivo: null,
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Pendiente",
    tamano: "—",
    tienePlantilla: false,
    esTesis: true,
  },
  {
    id: "TIT-04",
    etapa: "Titulación",
    nombre: "Solicitud de acta de grado ante DEPI / Servicios Escolares",
    archivo: null,
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Pendiente",
    tamano: "—",
    tienePlantilla: true,
    esTesis: false,
  },
  {
    id: "TIT-05",
    etapa: "Titulación",
    nombre: "Carta de retribución social",
    archivo: null,
    archivoUrl: null,
    rutaStorage: null,
    estatus: "Pendiente",
    tamano: "—",
    tienePlantilla: true,
    esTesis: false,
  },
];

export const SEGUIMIENTO_TITULACION_INICIAL = [
  {
    id: "TIT-ALU-01",
    matricula: "M24120104",
    alumno: "Hernández Soto Mariana",
    semestre: "4° Semestre",
    asesor: "Dr. Roberto Sandoval Gómez",
    edbKardexSemestral: "Validado",
    primeraRevisionComite: "Firmada",
    segundaRevision: "Aprobada",
    numeroTesis: "MCM-ITM-2026-008",
    tesisArchivo: "Tesis_Final_Mariana_Hernandez.pdf",
    tesisTamano: "4.2 MB",
    tesisUrl: null,
    rutaStorage: null,
    tramiteDepiActaGrado: "Acta emitida",
    cartaRetribucionSocial: "Generada",
  },
  {
    id: "TIT-ALU-02",
    matricula: "M24120109",
    alumno: "Navarro Ruiz Emiliano",
    semestre: "4° Semestre",
    asesor: "Dra. Carmen Morales Benítez",
    edbKardexSemestral: "Validado",
    primeraRevisionComite: "Firmada",
    segundaRevision: "En revisión",
    numeroTesis: "MCM-ITM-2026-011",
    tesisArchivo: null,
    tesisTamano: null,
    tesisUrl: null,
    rutaStorage: null,
    tramiteDepiActaGrado: "En trámite",
    cartaRetribucionSocial: "Pendiente",
  },
  {
    id: "TIT-ALU-03",
    matricula: "M25120042",
    alumno: "Aguilar Domínguez Sofía",
    semestre: "2° Semestre",
    asesor: "Dr. Luis Villaseñor Reyes",
    edbKardexSemestral: "Validado",
    primeraRevisionComite: "En avance",
    segundaRevision: "—",
    numeroTesis: "MCM-ITM-2026-014",
    tesisArchivo: null,
    tesisTamano: null,
    tesisUrl: null,
    rutaStorage: null,
    tramiteDepiActaGrado: "—",
    cartaRetribucionSocial: "—",
  },
];

function crearCitasIniciales() {
  const ahora = new Date();
  const manana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
  const fechaManana = manana.toISOString().slice(0, 10);
  const hoy = ahora.toISOString().slice(0, 10);
  const haceDosDias = new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const haceTresHoras = new Date(ahora.getTime() - 3 * 60 * 60 * 1000);
  const fechaHaceTresHoras = haceTresHoras.toISOString().slice(0, 10);
  const horaHaceTresHoras = haceTresHoras.toTimeString().slice(0, 5);

  return [
    {
      id: "CITA-01",
      alumnoNombre: "Hernández Soto Mariana",
      matricula: "M24120104",
      asesorNombre: "Dr. Roberto Sandoval Gómez",
      fechaCita: fechaManana,
      horaCita: "11:00",
      modalidad: "Presencial · Cubículo 4 (Lab. Metalurgia)",
      motivo: "Revisión de correcciones del capítulo 3 y resultados de microscopía.",
      solicitadaPor: "alumno",
      fechaAgendadaEn: new Date(ahora.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      estatus: "pendiente",
      checkProfesor: false,
      checkAlumno: false,
      checkMarcadoEn: null,
      motivoRechazo: "",
      rechazadaPor: "",
      motivoCancelacion: "",
      canceladaPor: "",
    },
    {
      id: "CITA-02",
      alumnoNombre: "Navarro Ruiz Emiliano",
      matricula: "M24120109",
      asesorNombre: "Dra. Carmen Morales Benítez",
      fechaCita: hoy,
      horaCita: "13:30",
      modalidad: "Presencial · Sala de Juntas DEPI",
      motivo: "Firma de 2da revisión de tesis y validación de formato final.",
      solicitadaPor: "asesor",
      fechaAgendadaEn: new Date(ahora.getTime() - 20 * 60 * 60 * 1000).toISOString(),
      estatus: "confirmada",
      checkProfesor: false,
      checkAlumno: false,
      checkMarcadoEn: null,
      motivoRechazo: "",
      rechazadaPor: "",
      motivoCancelacion: "",
      canceladaPor: "",
    },
    {
      id: "CITA-03",
      alumnoNombre: "Aguilar Domínguez Sofía",
      matricula: "M25120042",
      asesorNombre: "Dr. Luis Villaseñor Reyes",
      fechaCita: fechaHaceTresHoras,
      horaCita: horaHaceTresHoras,
      modalidad: "En línea · Google Meet Institucional",
      motivo: "Revisión de protocolo semestral y avance experimental.",
      solicitadaPor: "alumno",
      fechaAgendadaEn: new Date(ahora.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      estatus: "confirmada",
      checkProfesor: false,
      checkAlumno: false,
      checkMarcadoEn: null,
      motivoRechazo: "",
      rechazadaPor: "",
      motivoCancelacion: "",
      canceladaPor: "",
    },
    {
      id: "CITA-04",
      alumnoNombre: "Hernández Soto Mariana",
      matricula: "M24120104",
      asesorNombre: "Dr. Roberto Sandoval Gómez",
      fechaCita: haceDosDias,
      horaCita: "10:00",
      modalidad: "Presencial · Cubículo 4 (Lab. Metalurgia)",
      motivo: "Revisión de estructura general de tesis y liberación de 1ra revisión.",
      solicitadaPor: "asesor",
      fechaAgendadaEn: new Date(ahora.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      estatus: "asistieron",
      checkProfesor: true,
      checkAlumno: true,
      checkMarcadoEn: new Date(ahora.getTime() - 47 * 60 * 60 * 1000).toISOString(),
      motivoRechazo: "",
      rechazadaPor: "",
      motivoCancelacion: "",
      canceladaPor: "",
    },
  ];
}

function emitirCambio() {
  window.dispatchEvent(new CustomEvent("posgrados:sync"));
}

export function formatearTamano(bytes) {
  const num = Number(bytes);
  if (!num || isNaN(num)) return "1.0 MB";
  if (num < 1024 * 1024) {
    return `${Math.max(1, Math.round(num / 1024))} KB`;
  }
  return `${(num / (1024 * 1024)).toFixed(2)} MB`;
}

export function convertirArchivoADataUrl(file) {
  return new Promise((resolve) => {
    if (file.size <= 3.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    } else {
      resolve(URL.createObjectURL(file));
    }
  });
}

async function resolverUsuarioIdActual(usuarioIdProvisto = null) {
  if (usuarioIdProvisto) return usuarioIdProvisto;
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const authUid = sessionData?.session?.user?.id;
    if (!authUid) return null;
    const { data: u } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_uid", authUid)
      .maybeSingle();
    return u?.id || null;
  } catch {
    return null;
  }
}

// ============================================================================
// SUBIDA Y SINCRONIZACIÓN REAL CON SUPABASE ENTRE DISTINTAS PCs
// ============================================================================
// Formato de archivo en el bucket 'documentos':
//   <carpetaUsuario>/DOC_<claveId>_<timestamp>_<tamanoBytes>___<nombreArchivo.pdf>
//   <carpetaUsuario>/DEL_<claveId>_<timestamp>_0___eliminado.pdf
//IMPORTANTE: Se usa upsert: false para que funcione con la política INSERT de 02_seguridad.sql
// incluso si aún no se ha corrido 06_tesis_y_citas_asesoria.sql.

const REGEX_EVENTO_STORAGE = /^(DOC|DEL)_([A-Za-z0-9-]+)_(\d+)_(\d+)___(.+)$/;

export async function subirEventoArchivoSupabase(usuarioId, claveId, file) {
  const uid = await resolverUsuarioIdActual(usuarioId);
  if (!uid || !file) return { signedUrl: null, ruta: null };

  const nombreSeguro = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const nombreObjeto = `DOC_${claveId}_${timestamp}_${file.size}___${nombreSeguro}`;
  const ruta = `${uid}/${nombreObjeto}`;

  try {
    const { error } = await supabase.storage
      .from("documentos")
      .upload(ruta, file, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      return { signedUrl: null, ruta: null, error };
    }

    const { data } = await supabase.storage
      .from("documentos")
      .createSignedUrl(ruta, 3600 * 24 * 7);

    return {
      signedUrl: data?.signedUrl || null,
      ruta,
    };
  } catch (err) {
    return { signedUrl: null, ruta: null, error: err };
  }
}

export async function registrarEliminacionEnSupabase(usuarioId, claveId) {
  const uid = await resolverUsuarioIdActual(usuarioId);
  if (!uid) return;

  const timestamp = Date.now();
  const nombreObjeto = `DEL_${claveId}_${timestamp}_0___eliminado.pdf`;
  const ruta = `${uid}/${nombreObjeto}`;
  const pdfMinimo = new Blob(["%PDF-1.4\n%eliminado\n"], { type: "application/pdf" });

  try {
    await supabase.storage.from("documentos").upload(ruta, pdfMinimo, {
      contentType: "application/pdf",
      upsert: false,
    });
  } catch {
    // Ignorar si no hay red
  }
}

// Guarda también en la tabla estado_compartido_posgrado si el usuario ya corrió 06_tesis_y_citas_asesoria.sql
async function guardarEstadoRemotoTabla(clave, datos) {
  try {
    // Limpiamos data URLs base64 largos para guardar solo metadatos y rutas de Supabase Storage
    const datosLimpios = Array.isArray(datos)
      ? datos.map((item) => ({
          ...item,
          archivoUrl: item.archivoUrl?.startsWith("data:") ? null : item.archivoUrl,
          tesisUrl: item.tesisUrl?.startsWith("data:") ? null : item.tesisUrl,
        }))
      : datos;

    await supabase.from("estado_compartido_posgrado").upsert(
      {
        clave,
        datos: datosLimpios,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: "clave" }
    );
  } catch {
    // Si la tabla 06 aún no existe, el respaldo por Supabase Storage sigue funcionando
  }
}

// Abrir un PDF generando un Signed URL fresco desde Supabase Storage si se abrió desde otra PC
export async function obtenerUrlParaAbrirPdf(rutaStorage, urlActual) {
  if (rutaStorage) {
    try {
      const { data } = await supabase.storage
        .from("documentos")
        .createSignedUrl(rutaStorage, 3600 * 12);
      if (data?.signedUrl) return data.signedUrl;
    } catch {
      // Fallback a urlActual
    }
  }
  return urlActual || null;
}

// Lee desde Supabase (tanto la tabla estado_compartido_posgrado como las carpetas del bucket 'documentos')
// para que al abrir la página en OTRA PC aparezcan todos los PDFs, tesis y citas actualizados.
export async function sincronizarDesdeSupabase(usuarioId = null) {
  const uid = await resolverUsuarioIdActual(usuarioId);
  let huboActualizacion = false;

  // 1) Intentar leer desde la tabla estado_compartido_posgrado (si 06_tesis_y_citas_asesoria.sql está activo)
  try {
    const { data: filasEstado, error: errTabla } = await supabase
      .from("estado_compartido_posgrado")
      .select("clave, datos");

    if (!errTabla && Array.isArray(filasEstado) && filasEstado.length > 0) {
      for (const fila of filasEstado) {
        if (fila.clave === "documentos" && Array.isArray(fila.datos)) {
          localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(fila.datos));
          huboActualizacion = true;
        } else if (fila.clave === "titulacion" && Array.isArray(fila.datos)) {
          localStorage.setItem(STORAGE_KEY_TESIS, JSON.stringify(fila.datos));
          huboActualizacion = true;
        } else if (fila.clave === "citas" && Array.isArray(fila.datos)) {
          const { citas } = evaluarExpiracionUnaHora(fila.datos);
          localStorage.setItem(STORAGE_KEY_CITAS, JSON.stringify(citas));
          huboActualizacion = true;
        }
      }
    }
  } catch {
    // Continuar con el escaneo directo del bucket 'documentos'
  }

  // 2) Escanear directamente el bucket 'documentos' en Supabase Storage (funciona con 02_seguridad.sql)
  try {
    const carpetasAEscanear = new Set();
    if (uid) carpetasAEscanear.add(uid);

    // Si es admin/coordinador o profesor, puede ver los IDs de usuarios visibles en public.usuarios
    const { data: usuariosVisibles } = await supabase.from("usuarios").select("id");
    if (Array.isArray(usuariosVisibles)) {
      usuariosVisibles.forEach((u) => {
        if (u?.id) carpetasAEscanear.add(u.id);
      });
    }

    const eventosStorage = [];

    for (const carpeta of carpetasAEscanear) {
      const { data: archivos, error } = await supabase.storage
        .from("documentos")
        .list(carpeta, { limit: 100 });

      if (!error && Array.isArray(archivos)) {
        for (const arch of archivos) {
          const match = arch.name?.match(REGEX_EVENTO_STORAGE);
          if (match) {
            const [, tipoAccion, claveId, tsStr, bytesStr, nombreOriginal] = match;
            eventosStorage.push({
              tipoAccion, // 'DOC' | 'DEL'
              claveId,
              timestamp: Number(tsStr),
              tamanoBytes: Number(bytesStr),
              nombreOriginal,
              rutaCompleta: `${carpeta}/${arch.name}`,
            });
          }
        }
      }
    }

    if (eventosStorage.length > 0) {
      // Ordenar cronológicamente para quedarnos siempre con la última acción de cada documento/tesis
      eventosStorage.sort((a, b) => a.timestamp - b.timestamp);

      const ultimoPorClave = {};
      for (const ev of eventosStorage) {
        ultimoPorClave[ev.claveId] = ev;
      }

      let docsActuales = obtenerDocumentosExpediente();
      let tesisActuales = obtenerSeguimientoTitulacion();
      let cambioEnDocs = false;
      let cambioEnTesis = false;

      for (const [claveId, ev] of Object.entries(ultimoPorClave)) {
        if (ev.tipoAccion === "DOC") {
          const tamanoFormateado = formatearTamano(ev.tamanoBytes);

          // ¿Corresponde a un documento del expediente (ASP-*, ACE-*, SEM-*, TIT-*)?
          const idxDoc = docsActuales.findIndex((d) => d.id === claveId);
          if (idxDoc !== -1) {
            if (
              docsActuales[idxDoc].archivo !== ev.nombreOriginal ||
              docsActuales[idxDoc].rutaStorage !== ev.rutaCompleta
            ) {
              docsActuales[idxDoc] = {
                ...docsActuales[idxDoc],
                archivo: ev.nombreOriginal,
                rutaStorage: ev.rutaCompleta,
                tamano: tamanoFormateado,
                estatus:
                  docsActuales[idxDoc].estatus === "Pendiente"
                    ? "En revisión"
                    : docsActuales[idxDoc].estatus,
              };
              cambioEnDocs = true;
            }

            // Si es TIT-03, reflejar también en el primer alumno de titulación
            if (claveId === "TIT-03" && tesisActuales.length > 0) {
              tesisActuales[0] = {
                ...tesisActuales[0],
                tesisArchivo: ev.nombreOriginal,
                tesisTamano: tamanoFormateado,
                rutaStorage: ev.rutaCompleta,
              };
              cambioEnTesis = true;
            }
          }

          // ¿Corresponde a una tesis subida a un alumno específico (TIT-ALU-01, etc.)?
          const idxTesis = tesisActuales.findIndex((t) => t.id === claveId);
          if (idxTesis !== -1) {
            if (
              tesisActuales[idxTesis].tesisArchivo !== ev.nombreOriginal ||
              tesisActuales[idxTesis].rutaStorage !== ev.rutaCompleta
            ) {
              tesisActuales[idxTesis] = {
                ...tesisActuales[idxTesis],
                tesisArchivo: ev.nombreOriginal,
                tesisTamano: tamanoFormateado,
                rutaStorage: ev.rutaCompleta,
              };
              cambioEnTesis = true;
            }

            if (claveId === "TIT-ALU-01") {
              docsActuales = docsActuales.map((d) =>
                d.id === "TIT-03"
                  ? {
                      ...d,
                      archivo: ev.nombreOriginal,
                      rutaStorage: ev.rutaCompleta,
                      tamano: tamanoFormateado,
                      estatus: "Validado",
                    }
                  : d
              );
              cambioEnDocs = true;
            }
          }
        } else if (ev.tipoAccion === "DEL") {
          const idxTesis = tesisActuales.findIndex((t) => t.id === claveId);
          if (idxTesis !== -1 && tesisActuales[idxTesis].tesisArchivo !== null) {
            tesisActuales[idxTesis] = {
              ...tesisActuales[idxTesis],
              tesisArchivo: null,
              tesisTamano: null,
              tesisUrl: null,
              rutaStorage: null,
            };
            cambioEnTesis = true;
          }

          if (claveId === "TIT-ALU-01" || claveId === "TIT-03") {
            docsActuales = docsActuales.map((d) =>
              d.id === "TIT-03"
                ? {
                    ...d,
                    archivo: null,
                    archivoUrl: null,
                    rutaStorage: null,
                    tamano: "—",
                    estatus: "Pendiente",
                  }
                : d
            );
            cambioEnDocs = true;
          }
        }
      }

      if (cambioEnDocs) {
        localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docsActuales));
        huboActualizacion = true;
      }
      if (cambioEnTesis) {
        localStorage.setItem(STORAGE_KEY_TESIS, JSON.stringify(tesisActuales));
        huboActualizacion = true;
      }
    }
  } catch {
    // Sin conexión o sin sesión
  }

  if (huboActualizacion) {
    emitirCambio();
  }
}

// ---------- 1. DOCUMENTOS DEL EXPEDIENTE DEL ALUMNO ----------
export function obtenerDocumentosExpediente() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_DOCS);
    if (!guardado) return DOCUMENTOS_INICIALES;
    return JSON.parse(guardado);
  } catch {
    return DOCUMENTOS_INICIALES;
  }
}

export function guardarDocumentosExpediente(docs) {
  try {
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
  } catch {
    const ligeros = docs.map((d) => ({
      ...d,
      archivoUrl: d.archivoUrl?.startsWith("data:") ? null : d.archivoUrl,
    }));
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(ligeros));
  }
  guardarEstadoRemotoTabla("documentos", docs);
  emitirCambio();
}

export async function subirDocumentoAlumnoDesdeDispositivo(docId, file, usuarioId = null) {
  const dataUrl = await convertirArchivoADataUrl(file);
  const { signedUrl, ruta } = await subirEventoArchivoSupabase(usuarioId, docId, file);
  const urlFinal = signedUrl || dataUrl;
  const tamanoStr = formatearTamano(file.size);

  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== docId) return d;
    return {
      ...d,
      archivo: file.name,
      archivoUrl: urlFinal,
      rutaStorage: ruta,
      tamano: tamanoStr,
      estatus: "En revisión",
      subidoEn: new Date().toISOString(),
    };
  });

  guardarDocumentosExpediente(docs);

  if (docId === "TIT-03") {
    const listaTesis = obtenerSeguimientoTitulacion();
    if (listaTesis.length > 0) {
      listaTesis[0] = {
        ...listaTesis[0],
        tesisArchivo: file.name,
        tesisTamano: tamanoStr,
        tesisUrl: urlFinal,
        rutaStorage: ruta,
      };
      guardarSeguimientoTitulacion(listaTesis);
    }
  }

  return docs;
}

// ---------- 2. TESIS POR ALUMNO (VISTA PROFESOR / COORDINADOR) ----------
export function obtenerSeguimientoTitulacion() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_TESIS);
    if (!guardado) return SEGUIMIENTO_TITULACION_INICIAL;
    return JSON.parse(guardado);
  } catch {
    return SEGUIMIENTO_TITULACION_INICIAL;
  }
}

export function guardarSeguimientoTitulacion(lista) {
  try {
    localStorage.setItem(STORAGE_KEY_TESIS, JSON.stringify(lista));
  } catch {
    const ligeros = lista.map((item) => ({
      ...item,
      tesisUrl: item.tesisUrl?.startsWith("data:") ? null : item.tesisUrl,
    }));
    localStorage.setItem(STORAGE_KEY_TESIS, JSON.stringify(ligeros));
  }
  guardarEstadoRemotoTabla("titulacion", lista);
  emitirCambio();
}

export async function profesorSubirTesisAlumno(registroId, file, usuarioId = null) {
  const dataUrl = await convertirArchivoADataUrl(file);
  const { signedUrl, ruta } = await subirEventoArchivoSupabase(usuarioId, registroId, file);
  const urlFinal = signedUrl || dataUrl;
  const tamanoStr = formatearTamano(file.size);

  const lista = obtenerSeguimientoTitulacion().map((t) => {
    if (t.id !== registroId) return t;
    return {
      ...t,
      tesisArchivo: file.name,
      tesisTamano: tamanoStr,
      tesisUrl: urlFinal,
      rutaStorage: ruta,
    };
  });
  guardarSeguimientoTitulacion(lista);

  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== "TIT-03") return d;
    return {
      ...d,
      archivo: file.name,
      archivoUrl: urlFinal,
      rutaStorage: ruta,
      tamano: tamanoStr,
      estatus: "Validado",
    };
  });
  guardarDocumentosExpediente(docs);

  return lista;
}

export async function profesorEliminarTesisAlumno(registroId, usuarioId = null) {
  await registrarEliminacionEnSupabase(usuarioId, registroId);

  const lista = obtenerSeguimientoTitulacion().map((t) => {
    if (t.id !== registroId) return t;
    return {
      ...t,
      tesisArchivo: null,
      tesisTamano: null,
      tesisUrl: null,
      rutaStorage: null,
    };
  });
  guardarSeguimientoTitulacion(lista);

  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== "TIT-03") return d;
    return {
      ...d,
      archivo: null,
      archivoUrl: null,
      rutaStorage: null,
      tamano: "—",
      estatus: "Pendiente",
    };
  });
  guardarDocumentosExpediente(docs);

  return lista;
}

// ---------- 3. CITAS DE ASESORÍA Y REGLA AUTOMÁTICA DE 1 HORA ----------
export function obtenerTimestampCita(fechaCita, horaCita) {
  if (!fechaCita || !horaCita) return null;
  const isoLocal = `${fechaCita}T${horaCita}:00`;
  const ms = new Date(isoLocal).getTime();
  return isNaN(ms) ? null : ms;
}

export function evaluarExpiracionUnaHora(citas) {
  const ahoraMs = Date.now();
  const UNA_HORA_MS = 60 * 60 * 1000;
  let huboCambios = false;

  const actualizadas = citas.map((cita) => {
    if (cita.estatus === "confirmada") {
      const citaMs = obtenerTimestampCita(cita.fechaCita, cita.horaCita);
      if (citaMs && ahoraMs > citaMs + UNA_HORA_MS) {
        huboCambios = true;
        return {
          ...cita,
          estatus: "no_se_vieron",
        };
      }
    }
    return cita;
  });

  return { citas: actualizadas, huboCambios };
}

export function obtenerCitasAsesoria() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY_CITAS);
    const base = guardado ? JSON.parse(guardado) : crearCitasIniciales();
    const { citas, huboCambios } = evaluarExpiracionUnaHora(base);
    if (!guardado || huboCambios) {
      localStorage.setItem(STORAGE_KEY_CITAS, JSON.stringify(citas));
    }
    return citas;
  } catch {
    return crearCitasIniciales();
  }
}

export function guardarCitasAsesoria(citas) {
  const { citas: evaluadas } = evaluarExpiracionUnaHora(citas);
  localStorage.setItem(STORAGE_KEY_CITAS, JSON.stringify(evaluadas));
  guardarEstadoRemotoTabla("citas", evaluadas);
  emitirCambio();
  return evaluadas;
}

export function agendarNuevaCita({
  alumnoNombre,
  matricula,
  asesorNombre,
  fechaCita,
  horaCita,
  modalidad,
  motivo,
  solicitadaPor,
  citaReprogramadaId = null,
}) {
  const actuales = obtenerCitasAsesoria();
  const nueva = {
    id: `CITA-${Date.now().toString().slice(-4)}`,
    alumnoNombre: alumnoNombre || "Hernández Soto Mariana",
    matricula: matricula || "M24120104",
    asesorNombre: asesorNombre || "Dr. Roberto Sandoval Gómez",
    fechaCita,
    horaCita,
    modalidad: modalidad || "Presencial · Cubículo de Asesoría",
    motivo: motivo || "Revisión de avance de tesis",
    solicitadaPor,
    fechaAgendadaEn: new Date().toISOString(),
    estatus: "pendiente",
    checkProfesor: false,
    checkAlumno: false,
    checkMarcadoEn: null,
    motivoRechazo: "",
    rechazadaPor: "",
    motivoCancelacion: "",
    canceladaPor: "",
    reprogramadaDe: citaReprogramadaId,
  };

  return guardarCitasAsesoria([nueva, ...actuales]);
}

export function aceptarCitaAsesoria(citaId) {
  const actuales = obtenerCitasAsesoria().map((c) => {
    if (c.id !== citaId) return c;
    return {
      ...c,
      estatus: "confirmada",
      motivoRechazo: "",
      rechazadaPor: "",
    };
  });
  return guardarCitasAsesoria(actuales);
}

export function rechazarCitaAsesoria(citaId, motivoRechazo, rechazadaPor) {
  const actuales = obtenerCitasAsesoria().map((c) => {
    if (c.id !== citaId) return c;
    return {
      ...c,
      estatus: "rechazada",
      motivoRechazo: motivoRechazo.trim(),
      rechazadaPor,
    };
  });
  return guardarCitasAsesoria(actuales);
}

export function cancelarCitaAsesoria(citaId, motivoCancelacion, canceladaPor) {
  const actuales = obtenerCitasAsesoria().map((c) => {
    if (c.id !== citaId) return c;
    return {
      ...c,
      estatus: "cancelada",
      motivoCancelacion: motivoCancelacion.trim(),
      canceladaPor,
    };
  });
  return guardarCitasAsesoria(actuales);
}

export function marcarCheckAsistenciaCita(citaId, rolQuienMarca = "ambos") {
  const ahoraMs = Date.now();
  const UNA_HORA_MS = 60 * 60 * 1000;

  const actuales = obtenerCitasAsesoria().map((c) => {
    if (c.id !== citaId) return c;

    const citaMs = obtenerTimestampCita(c.fechaCita, c.horaCita);
    if (citaMs && ahoraMs > citaMs + UNA_HORA_MS && c.estatus !== "asistieron") {
      return {
        ...c,
        estatus: "no_se_vieron",
      };
    }

    return {
      ...c,
      estatus: "asistieron",
      checkProfesor: true,
      checkAlumno: true,
      checkMarcadoEn: new Date().toISOString(),
      confirmadoPor: rolQuienMarca,
    };
  });
  return guardarCitasAsesoria(actuales);
}

export function simularPasoDeUnaHoraSinCheck(citaId) {
  const hace75Min = new Date(Date.now() - 75 * 60 * 1000);
  const fecha = hace75Min.toISOString().slice(0, 10);
  const hora = hace75Min.toTimeString().slice(0, 5);

  const actuales = obtenerCitasAsesoria().map((c) => {
    if (c.id !== citaId) return c;
    return {
      ...c,
      fechaCita: fecha,
      horaCita: hora,
      estatus: "confirmada",
      checkProfesor: false,
      checkAlumno: false,
    };
  });
  return guardarCitasAsesoria(actuales);
}
