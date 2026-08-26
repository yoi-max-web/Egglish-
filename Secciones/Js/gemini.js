/* ============================================================
   GEMINI.JS — Puente entre la UI (eggy.js / eggy-widget.js)
   y el backend seguro (/api/gemini)
   ─────────────────────────────────────────────────────────────
   IMPORTANTE: este archivo YA NO usa GEMINI_API_KEY ni llama
   a Google directamente. Solo hace fetch a tu propia función
   serverless en Vercel, que es la única que conoce la key.
   ============================================================ */

"use strict";

const ENDPOINT = "/api/gemini";

// Historial en memoria de la sesión actual (se pierde al recargar).
// Se envía al backend para que Eggy tenga contexto de la conversación.
let sessionHistory = [];

/**
 * Envía un mensaje del usuario al backend y devuelve la respuesta de Eggy.
 * Firma compatible con el código existente: preguntarGemini(texto).
 *
 * @param   {string}          userText
 * @returns {Promise<string>}
 */
export async function preguntarGemini(userText) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: userText,
      history: sessionHistory,
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Respuesta inválida del servidor.");
  }

  if (!res.ok) {
    throw new Error(data?.error || `Error del servidor (${res.status}).`);
  }

  // Actualiza el historial local para mantener contexto en la sesión.
  sessionHistory.push({ role: "user", text: userText });
  sessionHistory.push({ role: "eggy", text: data.reply });

  return data.reply;
}

/**
 * Reinicia el historial de la sesión (llámalo al presionar "Nuevo chat").
 */
export function reiniciarHistorialGemini() {
  sessionHistory = [];
}