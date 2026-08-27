/* Cliente de Gemini para la interfaz de Eggy. */
"use strict";

const MODEL = "gemini-3.6-flash";
const MAX_REQUESTS = 5;
const REQUEST_WINDOW_MS = 12 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20 * 1000;
const REQUESTS_STORAGE_KEY = "egglish_gemini_request_timestamps";
const SYSTEM_INSTRUCTION = `
Eres "Eggy", un tutor de ingles estricto pero motivador dentro de la app Egglish.
Responde siempre en espanol, salvo que el usuario pida practicar en ingles.
Corrige los errores de ingles con claridad, explica brevemente la regla y anima al estudiante.
Da ejemplos concretos y cortos; evita explicaciones demasiado largas.
`.trim();

// Historial en memoria de la sesion actual (se pierde al recargar).
let sessionHistory = [];

function getRecentRequestTimestamps() {
  try {
    const stored = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || "[]");
    const cutoff = Date.now() - REQUEST_WINDOW_MS;
    const recent = Array.isArray(stored)
      ? stored.filter((timestamp) => Number.isFinite(timestamp) && timestamp > cutoff)
      : [];

    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(recent));
    return recent;
  } catch (error) {
    console.warn("[Egglish] No se pudo leer el limite local de consultas:", error);
    return [];
  }
}

function ensureRequestLimit() {
  const requests = getRecentRequestTimestamps();
  if (requests.length < MAX_REQUESTS) return;

  const availableAt = new Date(requests[0] + REQUEST_WINDOW_MS);
  throw new Error(
    `Alcanzaste el limite de ${MAX_REQUESTS} preguntas. Podras volver a usar la IA el ${availableAt.toLocaleString("es-ES")}.`
  );
}

function recordSuccessfulRequest() {
  const requests = getRecentRequestTimestamps();
  requests.push(Date.now());
  localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
}

/**
 * Envia un mensaje a Gemini y devuelve la respuesta de Eggy.
 * @param {string} userText
 * @returns {Promise<string>}
 */
export async function preguntarGemini(userText) {
  const apiKey = window.ENV?.GEMINI_API_KEY;

  if (!apiKey || apiKey === "PEGA_AQUI_TU_CLAVE_DE_GEMINI") {
    console.error(
      "[Egglish] Falta window.ENV.GEMINI_API_KEY. Crea config.js desde config.example.js y agrega tu clave de Gemini."
    );
    throw new Error("La IA no esta configurada. Revisa el archivo config.js local.");
  }

  if (typeof userText !== "string" || !userText.trim()) {
    throw new Error("Escribe un mensaje antes de enviarlo.");
  }

  ensureRequestLimit();

  const contents = sessionHistory.slice(-10).map((turn) => ({
    role: turn.role === "eggy" ? "model" : "user",
    parts: [{ text: turn.text }],
  }));
  contents.push({ role: "user", parts: [{ text: userText.trim() }] });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;

  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents,
      }),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Gemini tardo demasiado en responder. Intenta de nuevo.");
    }
    console.error("[Egglish] No fue posible conectar con Gemini:", error);
    throw new Error("No se pudo conectar con Gemini. Revisa tu conexion e intenta de nuevo.");
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Gemini devolvio una respuesta invalida.");
  }

  if (!res.ok) {
    const message = data?.error?.message || data?.error;
    console.error("[Egglish] Error de Gemini:", message || res.status);
    throw new Error(message || `No se pudo contactar a Gemini (${res.status}).`);
  }

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!reply) {
    console.error("[Egglish] Gemini no incluyo texto en su respuesta:", data);
    throw new Error("Gemini no devolvio una respuesta de texto.");
  }

  sessionHistory.push({ role: "user", text: userText.trim() });
  sessionHistory.push({ role: "eggy", text: reply });
  recordSuccessfulRequest();

  return reply;
}

/** Reinicia el historial de la sesion actual. */
export function reiniciarHistorialGemini() {
  sessionHistory = [];
}
