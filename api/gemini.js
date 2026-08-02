/* ============================================================
   GEMINI.JS — Módulo de comunicación con el backend (Vercel)
   ============================================================ */

export async function preguntarGemini(mensaje) {
  let response;
  
  try {
    // Llamamos a nuestro propio endpoint en Vercel
    response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    });
  } catch (networkError) {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión a internet.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Fallo en el servidor (${response.status}): ${errorData.error || 'Error desconocido'}`);
  }

  const data = await response.json();

  if (data?.promptFeedback?.blockReason) {
    throw new Error(`Gemini bloqueó la respuesta: ${data.promptFeedback.blockReason}`);
  }

  const candidate = data?.candidates?.[0];
  const text = candidate?.content?.parts?.map(p => p.text).join('') || null;

  if (!text) {
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error('Bloqueado por filtros de seguridad. Reformula la pregunta.');
    }
    throw new Error('Respuesta inválida. Revisa la consola.');
  }

  if (candidate?.finishReason === 'SAFETY') {
    return text + '\n\n_(Nota: mi respuesta se cortó por los filtros de seguridad de Gemini.)_';
  }
  if (candidate?.finishReason === 'MAX_TOKENS') {
    return text + '\n\n_(Nota: mi respuesta se cortó por longitud.)_';
  }

  return text;
}