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
    tramiteDepiActaGrado: "—",
    cartaRetribucionSocial: "—",
  },
];

// Fechas de demostración relativas al momento actual para probar todos los estados
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
      solicitadaPor: "alumno", // 'alumno' | 'asesor'
      fechaAgendadaEn: new Date(ahora.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      estatus: "pendiente", // 'pendiente' | 'confirmada' | 'rechazada' | 'cancelada' | 'asistieron' | 'no_se_vieron'
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
      // Esta cita tenía estatus confirmada pero ya pasó más de 1 hora sin check -> se evalúa como 'no_se_vieron'
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
  if (!bytes || isNaN(bytes)) return "1.0 MB";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function convertirArchivoADataUrl(file) {
  return new Promise((resolve) => {
    // Si el archivo es menor a 3.5 MB lo guardamos en base64 para que persista al recargar;
    // si es mayor, usamos un ObjectURL de sesión para no saturar localStorage
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

// Intentar subir también a Supabase Storage si existe sesión activa
export async function intentarSubidaSupabase(usuarioId, codigoDoc, file) {
  if (!usuarioId || !file) return null;
  try {
    const nombreLimpio = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const ruta = `${usuarioId}/${codigoDoc}/${Date.now()}_${nombreLimpio}`;
    const { error } = await supabase.storage
      .from("documentos")
      .upload(ruta, file, { contentType: file.type || "application/pdf", upsert: true });
    if (error) return null;
    const { data } = await supabase.storage.from("documentos").createSignedUrl(ruta, 3600 * 24);
    return data?.signedUrl || null;
  } catch {
    return null;
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
    // En caso de límite de cuota en localStorage, conservamos metadatos sin base64 pesado
    const ligeros = docs.map((d) => ({
      ...d,
      archivoUrl: d.archivoUrl?.startsWith("data:") ? null : d.archivoUrl,
    }));
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(ligeros));
  }
  emitirCambio();
}

export async function subirDocumentoAlumnoDesdeDispositivo(docId, file, usuarioId = null) {
  const dataUrl = await convertirArchivoADataUrl(file);
  const signedUrl = await intentarSubidaSupabase(usuarioId, docId, file);
  const urlFinal = signedUrl || dataUrl;
  const tamanoStr = formatearTamano(file.size);

  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== docId) return d;
    return {
      ...d,
      archivo: file.name,
      archivoUrl: urlFinal,
      tamano: tamanoStr,
      estatus: "En revisión",
      subidoEn: new Date().toISOString(),
    };
  });

  guardarDocumentosExpediente(docs);

  // Si es el documento de Tesis Final (TIT-03), sincronizar también con el listado del profesor
  if (docId === "TIT-03") {
    const listaTesis = obtenerSeguimientoTitulacion();
    if (listaTesis.length > 0) {
      listaTesis[0] = {
        ...listaTesis[0],
        tesisArchivo: file.name,
        tesisTamano: tamanoStr,
        tesisUrl: urlFinal,
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
  emitirCambio();
}

export async function profesorSubirTesisAlumno(registroId, file, usuarioId = null) {
  const dataUrl = await convertirArchivoADataUrl(file);
  const signedUrl = await intentarSubidaSupabase(usuarioId, `tesis_${registroId}`, file);
  const urlFinal = signedUrl || dataUrl;
  const tamanoStr = formatearTamano(file.size);

  const lista = obtenerSeguimientoTitulacion().map((t) => {
    if (t.id !== registroId) return t;
    return {
      ...t,
      tesisArchivo: file.name,
      tesisTamano: tamanoStr,
      tesisUrl: urlFinal,
    };
  });
  guardarSeguimientoTitulacion(lista);

  // Sincronizar también con TIT-03 del expediente del alumno
  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== "TIT-03") return d;
    return {
      ...d,
      archivo: file.name,
      archivoUrl: urlFinal,
      tamano: tamanoStr,
      estatus: "Validado",
    };
  });
  guardarDocumentosExpediente(docs);

  return lista;
}

export function profesorEliminarTesisAlumno(registroId) {
  const lista = obtenerSeguimientoTitulacion().map((t) => {
    if (t.id !== registroId) return t;
    return {
      ...t,
      tesisArchivo: null,
      tesisTamano: null,
      tesisUrl: null,
    };
  });
  guardarSeguimientoTitulacion(lista);

  // Sincronizar también con TIT-03 del expediente del alumno si se eliminó la tesis
  const docs = obtenerDocumentosExpediente().map((d) => {
    if (d.id !== "TIT-03") return d;
    return {
      ...d,
      archivo: null,
      archivoUrl: null,
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

// Revisa automáticamente si alguna cita confirmada ya superó 1 hora sin que se marcara el "check"
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
  solicitadaPor, // 'alumno' | 'asesor'
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
    // Si ya pasó más de 1 hora desde la hora programada, se pone que no se vieron
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

// Función útil para pruebas en vivo: simula que la cita fue hace más de 1 hora sin marcar check
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

