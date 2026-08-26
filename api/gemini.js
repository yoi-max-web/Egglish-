/* ============================================================
   /api/gemini.js — Función serverless (Vercel)
   ─────────────────────────────────────────────────────────────
   Objetivo: que el cliente (widget.js) NUNCA vea la API key.
   El navegador llama a /api/gemini, y esta función es la única
   que habla con Google usando la key guardada en Vercel
   (Project Settings → Environment Variables → GEMINI_API_KEY).
   ============================================================ */

import { GoogleGenAI } from "@google/genai";

// La key vive solo en el servidor. Nunca se envía al navegador.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `
Eres "Eggy", un tutor de inglés estricto pero motivador dentro de la app Egglish.

Reglas de comportamiento:
- Responde siempre en español, salvo que el usuario pida explícitamente
  practicar en inglés o esté haciendo un ejercicio de conversación en inglés.
- Cuando el usuario escriba algo en inglés con errores (gramática, vocabulario,
  ortografía o uso), corrígelo SIEMPRE antes de continuar. Sé directo y claro
  sobre el error, pero nunca humillante.
- Estructura tus correcciones así: 1) el error señalado, 2) la forma correcta,
  3) una explicación breve de la regla o el porqué.
- Después de corregir, sé motivador: reconoce el esfuerzo y anima a seguir
  practicando. No seas condescendiente ni exageradamente efusivo.
- Sé exigente con la precisión (no dejes pasar errores por "sonar simpático"),
  pero mantén siempre un tono cálido y de apoyo, como un profesor que quiere
  que su estudiante mejore de verdad.
- Da ejemplos concretos y cortos. Evita respuestas demasiado largas o con
  demasiada teoría gramatical de golpe.
- Si el usuario pide practicar conversación, sigue el hilo en inglés, corrigiendo
  errores puntuales sobre la marcha sin romper el flujo de la conversación.
`.trim();

export default async function handler(req, res) {
  // Ajusta el origen a tu dominio real en producción en vez de "*"
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("[api/gemini] Falta GEMINI_API_KEY en las variables de entorno de Vercel.");
    return res.status(500).json({ error: "El servidor no está configurado correctamente." });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: 'Falta el campo "message".' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: "El mensaje es demasiado largo (máx. 2000 caracteres)." });
    }

    // Construye el historial en el formato que espera el SDK.
    // `history` es opcional: [{ role: 'user' | 'eggy', text: '...' }, ...]
    const contents = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) {
        if (turn && typeof turn.text === "string" && turn.text.trim()) {
          contents.push({
            role: turn.role === "eggy" ? "model" : "user",
            parts: [{ text: turn.text.slice(0, 2000) }],
          });
        }
      }
    }
    contents.push({ role: "user", parts: [{ text: message.trim() }] });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text;

    if (!reply) {
      return res.status(502).json({ error: "Gemini no devolvió una respuesta válida." });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("[api/gemini] Error al llamar a Gemini:", err);
    return res.status(500).json({ error: "No fue posible obtener respuesta de Eggy en este momento." });
  }
}