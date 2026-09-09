const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_INSTRUCTION = {
  parts: [{
    text: "Eres Eggy, un profesor de inglés para estudiantes hispanohablantes. Responde en español, con claridad, precisión y de forma breve. Enseña gramática, vocabulario, pronunciación y conversación. No inventes información.",
  }],
};

function sendJson(res, status, body) {
  res.status(status).json(body);
}

function toGeminiHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-12).flatMap((message) => {
    if (!message || typeof message.content !== "string") return [];
    const text = message.content.trim().slice(0, 4000);
    if (!text) return [];
    return [{
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text }],
    }];
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Método no permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, { error: "Falta configurar GEMINI_API_KEY en Vercel." });
  }

  const texto = typeof req.body?.texto === "string" ? req.body.texto.trim() : "";
  if (!texto) return sendJson(res, 400, { error: "El mensaje es obligatorio." });
  if (texto.length > 2000) return sendJson(res, 400, { error: "El mensaje supera el límite de 2000 caracteres." });

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: SYSTEM_INSTRUCTION,
        contents: [...toGeminiHistory(req.body?.history), { role: "user", parts: [{ text: texto }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini API error:", response.status, data);
      return sendJson(res, 502, { error: "Eggy no pudo generar una respuesta. Inténtalo de nuevo." });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!reply) return sendJson(res, 502, { error: "Eggy no generó una respuesta." });
    return sendJson(res, 200, { reply });
  } catch (error) {
    console.error("Unexpected chat error:", error);
    return sendJson(res, 500, { error: "No fue posible conectar con Eggy." });
  }
}
