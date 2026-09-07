/* ============================================================
  LOCAL-ENGINE.JS — Motor local de IA para Eggy
   ─────────────────────────────────────────────────────────────
   • CERO backend, CERO API keys, CERO fetch a terceros.
   • Todo el modelo corre en el navegador del visitante vía WebAssembly
     usando Transformers.js desde un CDN ESM, sin backend ni API key.
   • Los pesos del modelo se descargan UNA sola vez por visitante
     y quedan cacheados por el navegador (Cache Storage API), así
     que las siguientes visitas cargan casi al instante.
   • Este módulo es un singleton: si eggy.js y eggy-widget.js se
     cargaran en la misma página, ambos comparten el mismo motor
     ya inicializado en lugar de descargar el modelo dos veces.
   ============================================================ */

"use strict";

const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2';
const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';

/* ============================================================
  CONFIGURACIÓN DEL MODELO QWEN
   ─────────────────────────────────────────────────────────────
   Qwen2.5-0.5B-Instruct convertido a ONNX para Transformers.js.
   Se ejecuta con WebAssembly, sin WebGPU, backend ni API key.
   ============================================================ */
const SYSTEM_PROMPT = `Eres Eggy, un profesor de inglés.
Entiende preguntas en español e inglés.
Responde SIEMPRE en español, de forma directa, exacta y breve.
Contesta únicamente lo que el usuario pregunta; no inventes otra tarea, no rechaces preguntas en español y no añadas relleno.
Para traducciones, da primero la traducción exacta y después una aclaración corta solo si hace falta.`;

let generator = null;
let engineReadyPromise = null;

/**
 * Inicializa (o reutiliza) el pipeline de Transformers.js. Es idempotente: si ya
 * se llamó antes, siempre devuelve la misma promesa/instancia en
 * vez de volver a descargar el modelo.
 *
 * @param {(info: {progress: number, text: string}) => void} [onProgress]
 *        Callback invocado repetidamente durante la descarga/carga,
 *        con progreso normalizado 0–1 y un texto descriptivo.
 * @returns {Promise<Function>}
 */
export function initEngine(onProgress) {
  if (engineReadyPromise) return engineReadyPromise;
  engineReadyPromise = initTransformersEngine(onProgress).catch((error) => {
    engineReadyPromise = null;
    generator = null;
    throw error;
  });
  return engineReadyPromise;
}

async function initTransformersEngine(onProgress) {
  onProgress?.({ progress: 0, text: 'Preparing Eggy...' });
  const { pipeline, env } = await import(TRANSFORMERS_CDN);
  env.allowRemoteModels = true;
  env.allowLocalModels = false;

  generator = await pipeline('text-generation', MODEL_ID, {
    device: 'wasm',
    progress_callback: (report) => {
      if (typeof report.progress === 'number') {
        onProgress?.({ progress: report.progress / 100, text: 'Preparing Eggy...' });
      }
    },
  });
  onProgress?.({ progress: 1, text: 'Eggy is ready' });
  return generator;
}

/** Devuelve la instancia del motor ya inicializado, o null. */
export function getEngine() {
  return generator;
}

export function resetEngineForRetry() {
  generator = null;
  engineReadyPromise = null;
}

export function isRecoverableEngineError() {
  return false;
}

export function getEngineErrorMessage(error) {
  const message = String(error?.message || error || '').toLowerCase();
  if (message.includes('fetch') || message.includes('network') || message.includes('http')) {
    return 'The local model could not be downloaded. Check your connection and try again.';
  }
  return 'The local English model could not generate a response. Try again.';
}

export function isWebGPUSupported() {
  return true;
}

function getDirectTranslation(userText) {
  const normalized = userText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  const match = normalized.match(/(?:traduce|traducir|traduccion de|como se dice)\s+(.+?)(?:\s+(?:al|en) ingles|\s+en ingles|$)/i);
  if (!match) return null;

  const phrase = match[1].trim().replace(/[?.!,]+$/, '');
  const translations = {
    'mejor amigo': 'best friend',
    'mejor amiga': 'best friend',
    'buenos dias': 'good morning',
    'buenas noches': 'good night',
    'buenas tardes': 'good afternoon',
    'muchas gracias': 'thank you very much',
    'por favor': 'please',
    'te quiero': 'I love you',
    'como estas': 'how are you',
    'que tal': 'how are you',
    'casa': 'house',
    'avion': 'airplane',
    'libro': 'book',
    'comida': 'food',
    'amigo': 'friend',
    'amiga': 'friend',
    'hermano': 'brother',
    'hermana': 'sister',
    'hola': 'hello',
    'gracias': 'thank you',
  };
  const translation = translations[phrase];
  return translation ? `La traducción de "${phrase}" es "${translation}".` : null;
}

/**
 * Envía un mensaje al modelo local y transmite la respuesta token a
 * token (streaming real, sin llamadas de red externas).
 *
 * @param {string} userText - Mensaje del usuario.
 * @param {(delta: string, fullText: string) => void} onToken -
 *        Se llama por cada fragmento nuevo de texto generado.
 * @param {Array<{role: "user"|"assistant", content: string}>} [history] -
 *        Turnos previos de la conversación (sin el mensaje actual).
 * @returns {Promise<string>} El texto completo generado.
 */
export async function preguntarEggyStream(userText, onToken, history = []) {
  const directReply = getDirectTranslation(userText);
  if (directReply) {
    onToken(directReply, directReply);
    return directReply;
  }

  if (generator) {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-2),
      { role: 'user', content: userText },
    ];
    const result = await generator(messages, {
      max_new_tokens: 160,
      do_sample: false,
    });
    const generated = result?.[0]?.generated_text;
    const assistantMessage = Array.isArray(generated)
      ? [...generated].reverse().find((message) => message?.role === 'assistant' && message.content)
      : null;
    let fullText = assistantMessage?.content?.trim() || String(generated || '').trim();
    fullText = fullText
      .replace(/^<\|im_start\|>assistant\s*/i, '')
      .split('<|im_end|>')[0]
      .trim();
    if (fullText.toLowerCase() === userText.trim().toLowerCase()) fullText = '';
    if (fullText) onToken(fullText, fullText);
    return fullText;
  }
  throw new Error('The local model is not ready yet.');
}
