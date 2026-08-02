// api/gemini.js
export default async function handler(req, res) {
  // 1. Validar el método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { mensaje } = req.body;
  if (!mensaje) {
    return res.status(400).json({ error: 'El mensaje es requerido' });
  }

  // 2. Variables de entorno seguras (Vercel las provee)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  // Modelo actualizado: gemini-1.5-flash fue retirado por Google (dev retorna 404).
  // gemini-2.5-flash está activo (Google anuncia retiro para oct. 2026, hay que
  // revisar https://ai.google.dev/gemini-api/docs/changelog cuando llegue esa fecha).
  const GEMINI_MODEL = "gemini-2.5-flash";
  const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key no configurada en el servidor.' });
  }

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

  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: mensaje }] }],
    systemInstruction: { parts: [{ text: EGGY_SYSTEM_PROMPT }] },
    generationConfig: { temperature: 0.65, maxOutputTokens: 2048 },
    safetySettings: [
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: `Error de Google: ${errorText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Falla de red en el servidor Vercel' });
  }
}