// Prepara la foto de perfil: la recorta cuadrada, la achica a 480x480 y la guarda como JPG.
// Así pesa poco y además se le quitan los datos ocultos (ubicación GPS, etc.).
const LADO = 480;
const TIPOS = ["image/jpeg", "image/png", "image/webp"];

const errorAmigable = (mensaje) => Object.assign(new Error(mensaje), { amigable: true });

export async function prepararFoto(archivo) {
  if (!TIPOS.includes(archivo.type)) throw errorAmigable("Usa una imagen JPG, PNG o WebP.");
  if (archivo.size > 10 * 1024 * 1024) throw errorAmigable("La imagen pesa demasiado (máximo 10 MB).");

  let imagen;
  try {
    imagen = await createImageBitmap(archivo);
  } catch {
    throw errorAmigable("No pudimos leer esa imagen. Prueba con otra.");
  }

  const lado = Math.min(imagen.width, imagen.height);
  const origenX = (imagen.width - lado) / 2;
  const origenY = (imagen.height - lado) / 2;

  const lienzo = document.createElement("canvas");
  lienzo.width = LADO;
  lienzo.height = LADO;
  const ctx = lienzo.getContext("2d");
  ctx.fillStyle = "#ffffff"; // por si el PNG tiene fondo transparente
  ctx.fillRect(0, 0, LADO, LADO);
  ctx.drawImage(imagen, origenX, origenY, lado, lado, 0, 0, LADO, LADO);
  imagen.close?.();

  const blob = await new Promise((ok) => lienzo.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw errorAmigable("No pudimos procesar la imagen.");
  return blob;
}
