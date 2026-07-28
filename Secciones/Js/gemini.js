/* ============================================================
   GEMINI.JS — Módulo de comunicación con la API de Gemini
   ─────────────────────────────────────────────────────────────
   • Exporta únicamente: preguntarGemini(mensaje)
   • Sin dependencias externas
   • Usa el SDK oficial @google/genai vía CDN de esm.sh
   ─────────────────────────────────────────────────────────────
   📌 INSTRUCCIÓN PARA PEGAR LA API KEY:
      Reemplaza el valor de GEMINI_API_KEY en la línea de abajo.
      Solo necesitas sustituir el texto "AQUI_VA_LA_API_KEY"
      por tu clave real de Google AI Studio.
      Ejemplo: const GEMINI_API_KEY = "AIzaSyB...tu_clave...";
   ============================================================ */

// ─── CONFIGURACIÓN DEL MODELO ───────────────────────────────
// NOTA DE SEGURIDAD: esta versión llama directamente a la API
// de Gemini desde el navegador. Eso significa que tu API key
// queda visible en el código fuente para quien inspeccione la
// página. Está bien para pruebas/desarrollo o un proyecto
// personal, pero si esto pasa a producción con tráfico real,
// lo correcto es mover esta llamada a un backend (función
// serverless) que guarde la key de forma privada.
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function getEnvValue(name) {
  return window?.[name] || null;
}

// ─── SYSTEM PROMPT DE EGGY ──────────────────────────────────
// Define la personalidad y rol del asistente.
// Aquí puedes ajustar el tono, nivel, idioma de respuesta, etc.
const EGGY_SYSTEM_PROMPT = `
Eres Eggy, el asistente de inteligencia artificial de Egglish,
una plataforma para aprender inglés diseñada para hispanohablantes.

Tu personalidad:
- Eres amigable, motivador y paciente.
- Usas un tono cercano y juvenil pero profesional.
- Te refieres a ti mismo como "Eggy" y ocasionalmente usas emojis
  relacionados con huevos y pollitos (🥚🐣🐥) de forma natural y no excesiva.
- Celebras los logros del usuario y lo animas cuando se equivoca.

Tu rol:
- Enseñas inglés a hispanohablantes.
- Respondes principalmente en español, salvo cuando el contexto
  requiera usar inglés (ejemplos, frases, ejercicios, etc.).
- Corriges errores gramaticales del usuario con amabilidad.
- Das explicaciones claras con ejemplos concretos.
- Puedes ayudar con gramática, vocabulario, pronunciación,
  phrasal verbs, expresiones idiomáticas y práctica de conversación.

Formato de respuestas:
- Usa **negrita** para resaltar palabras o reglas importantes.
- Usa viñetas (•) para listas cuando sea necesario.
- Mantén respuestas concisas a menos que el usuario pida profundidad.
- Nunca rompas el personaje de Eggy.
`.trim();

/* ============================================================
   FUNCIÓN PRINCIPAL
   ============================================================ */

/**
 * Envía un mensaje a Gemini y devuelve la respuesta en texto.
 *
 * @param   {string}          mensaje  - Texto del usuario
 * @returns {Promise<string>}          - Respuesta de Gemini como string
 * @throws  {Error}                    - Si la llamada a la API falla
 */
export async function preguntarGemini(mensaje) {
  const GEMINI_MODEL = getEnvValue('GEMINI_MODEL') || DEFAULT_GEMINI_MODEL;
  const GEMINI_API_KEY = getEnvValue('GEMINI_API_KEY');

  if (!GEMINI_API_KEY) {
    throw new Error(
      'No se encontró la API key de Gemini. Revisa que env-config.js defina window.GEMINI_API_KEY y que el <script> se cargue antes que eggy.js.'
    );
  }

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: mensaje }] }
    ],
    systemInstruction: {
      parts: [{ text: EGGY_SYSTEM_PROMPT }]
    },
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 2048,
    },
    // Eggy es un asistente educativo de inglés: necesita poder explicar
    // vocabulario normal (anatomía, salud, relaciones, etc.) sin que el
    // filtro por defecto corte respuestas a mitad de camino. Esto NO
    // desactiva el bloqueo de contenido realmente explícito/dañino,
    // solo evita el sobre-bloqueo de palabras de diccionario comunes.
    safetySettings: [
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    throw new Error('No se pudo conectar con la API de Gemini. Revisa tu conexión a internet.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de Gemini (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Motivo de bloqueo (filtros de seguridad, etc.) si no hay candidatos
  if (data?.promptFeedback?.blockReason) {
    throw new Error(`Gemini bloqueó la respuesta: ${data.promptFeedback.blockReason}`);
  }

  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.map(p => p.text).join('') || null;

  if (!text) {
    // Sin texto: puede ser bloqueo total (finishReason SAFETY sin contenido)
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error('Gemini bloqueó esta respuesta por sus filtros de seguridad. Intenta reformular la pregunta.');
    }
    throw new Error('La respuesta de Gemini no contiene texto válido. Revisa la consola del navegador.');
  }

  // Hay texto, pero puede estar incompleto/cortado
  if (candidate?.finishReason === 'SAFETY') {
    console.warn('[Eggy] Respuesta cortada por filtros de seguridad de Gemini.');
    return text + '\n\n_(Nota: mi respuesta se cortó por los filtros de seguridad de Gemini. Puedes intentar reformular la pregunta si necesitas más detalle.)_';
  }
  if (candidate?.finishReason === 'MAX_TOKENS') {
    console.warn('[Eggy] Respuesta cortada por límite de tokens.');
    return text + '\n\n_(Nota: mi respuesta se cortó por longitud. Pídeme que continúe si quieres el resto.)_';
  }

  return text;
}