// Modo claro / oscuro. Se guarda en el navegador; si no hay nada guardado, usa el del sistema.
const CLAVE = "tema";

function temaInicial() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === "claro" || guardado === "oscuro") return guardado;
  } catch {
    /* sin acceso a localStorage */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "oscuro" : "claro";
}

export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    /* sin acceso a localStorage */
  }
}

// Al cargar el archivo se pone el tema de inmediato (sin guardarlo)
document.documentElement.dataset.tema = temaInicial();
