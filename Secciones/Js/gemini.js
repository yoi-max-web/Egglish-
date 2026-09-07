/* ============================================================
   GEMINI.JS — Puente entre el frontend de Egglish y el backend
   ─────────────────────────────────────────────────────────────
   Ya NO llama a la librería de Google directamente ni usa una
   API Key en el navegador. En su lugar, hace fetch() a la
   Serverless Function desplegada en Vercel, que es quien habla
   con Gemini de forma segura.

   IMPORTANTE:
   Reemplaza BACKEND_URL por la URL real de tu despliegue en
   Vercel una vez lo tengas (paso 4 de la guía de despliegue).
   ============================================================ */

"use strict";

// URL de producción de la Serverless Function en Vercel.
// Ejemplo: "https://egglish-backend.vercel.app/api/chat"
const BACKEND_URL = "https://egglish-backend.vercel.app/api/chat";

/**
 * Envía el mensaje del usuario al backend (Vercel) y devuelve
 * la respuesta de texto generada por Eggy/Gemini.
 *
 * @param   {string}          texto - Mensaje escrito por el usuario
 * @returns {Promise<string>}       - Respuesta de Eggy
 * @throws  {Error}                 - Si la petición falla o el
 *                                    servidor responde con error
 */
export async function preguntarGemini(texto) {
  let response;

  try {
    response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto }),
    });
  } catch (networkError) {
    // Problemas de red, CORS, backend caído, etc.
    console.error("[gemini.js] Error de red al contactar el backend:", networkError);
    throw new Error("No pude conectarme con el servidor de Eggy. Revisa tu conexión.");
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error("[gemini.js] Respuesta del backend no es JSON válido:", parseError);
    throw new Error("El servidor de Eggy respondió de forma inesperada.");
  }

  if (!response.ok) {
    // El backend siempre responde { error: "..." } cuando algo falla.
    const mensaje = data?.error || `Error del servidor (${response.status}).`;
    throw new Error(mensaje);
  }

  if (!data.reply) {
    throw new Error("Eggy no envió ninguna respuesta.");
  }

  return data.reply;
}