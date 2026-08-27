/* ============================================================
   EGGY.JS — Lógica de la interfaz del asistente IA de Egglish
   ─────────────────────────────────────────────────────────────
   • Sin dependencias externas
   • Integrado con Gemini vía gemini.js
   • Comentado sección por sección
   ============================================================ */

"use strict";

import { preguntarGemini } from "/Secciones/Js/gemini.js";

/* ============================================================
   IMPORTACIONES
   ─────────────────────────────────────────────────────────────
   Solo importamos preguntarGemini; toda la lógica de Gemini
   permanece aislada en gemini.js.
   =============================================
/* ============================================================
   SELECTORES — referencias al DOM
   ============================================================ */
const eggyMessages   = document.getElementById('eggy-messages');
const eggyTextarea   = document.getElementById('eggy-textarea');
const eggySendBtn    = document.getElementById('eggy-send-btn');
const eggyThinking   = document.getElementById('eggy-thinking');
const eggyWelcome    = document.getElementById('eggy-welcome');
const newChatBtn     = document.getElementById('new-chat-btn');
const sidebarToggle  = document.getElementById('sidebar-toggle-btn');
const eggySidebar    = document.getElementById('eggy-sidebar');
const eggyOverlay    = document.getElementById('eggy-overlay');
const historyItems   = document.querySelectorAll('.eggy-history-item');
const chipBtns       = document.querySelectorAll('.eggy-chip');

/* ============================================================
   ESTADO INTERNO
   ============================================================ */
let isThinking   = false; // evita envíos múltiples simultáneos
let messageCount = 0;     // contador de mensajes en pantalla

/* ============================================================
   UTILIDADES
   ============================================================ */

/**
 * Formatea la hora actual como HH:MM
 */
function getCurrentTime() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Hace scroll hasta el final del área de mensajes.
 * `smooth` para mensajes nuevos, `instant` para cargar historial.
 */
function scrollToBottom(behavior = 'smooth') {
  eggyMessages.scrollTo({ top: eggyMessages.scrollHeight, behavior });
}

/**
 * Oculta la pantalla de bienvenida al primer mensaje enviado.
 */
function hideWelcome() {
  if (eggyWelcome && !eggyWelcome.classList.contains('is-hidden')) {
    eggyWelcome.style.display = 'none';
  }
}

/**
 * Reactiva la pantalla de bienvenida (al hacer "Nuevo chat").
 */
function showWelcome() {
  if (eggyWelcome) {
    eggyWelcome.style.display = '';
    eggyWelcome.classList.remove('is-hidden');
  }
}

/**
 * Mueve el indicador "pensando" al final de la lista de mensajes.
 * (El nodo existe en el HTML; JS lo reposiciona.)
 */
function moveThinkingToEnd() {
  eggyMessages.appendChild(eggyThinking);
}

/* ============================================================
   CREAR NODOS DE MENSAJE
   ============================================================ */

/**
 * Crea y devuelve el nodo HTML de un mensaje.
 * @param {'eggy'|'user'} sender - quién envía
 * @param {string}        text   - contenido (soporta markdown básico)
 * @returns {HTMLElement}
 */
function createMessageNode(sender, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `eggy-msg eggy-msg--${sender}`;

  // Avatar
  if (sender === 'eggy') {
    const avatar = document.createElement('img');
    avatar.src       = 'https://em-content.zobj.net/source/twitter/376/hatching-chick_1f423.png';
    avatar.alt       = 'Eggy';
    avatar.className = 'eggy-msg__avatar';
    wrapper.appendChild(avatar);
  } else {
    const avatarEl = document.createElement('div');
    avatarEl.className   = 'eggy-msg__avatar--user';
    avatarEl.textContent = '🧑‍💻';
    avatarEl.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(avatarEl);
  }

  // Burbuja + contenido
  const bubble = document.createElement('div');
  bubble.className = 'eggy-msg__bubble';

  // Convierte markdown básico: **negrita**, *cursiva*, viñetas
  bubble.innerHTML = parseMarkdown(text);

  const time = document.createElement('span');
  time.className   = 'eggy-msg__time';
  time.textContent = getCurrentTime();
  bubble.appendChild(time);

  wrapper.appendChild(bubble);
  return wrapper;
}

/**
 * Convierte un subconjunto de Markdown a HTML seguro.
 * Soporta: **bold**, *italic* y viñetas (•, -)
 * Escapa HTML primero para prevenir XSS.
 */
function parseMarkdown(raw) {
  // 1. Escapar HTML
  let safe = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Saltos de línea
  safe = safe.replace(/\n/g, '<br>');

  // 3. Negrita **texto**
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 4. Cursiva *texto* (sin consumir los ** ya procesados)
  safe = safe.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  return safe;
}

/* ============================================================
   FLUJO DE ENVÍO DE MENSAJES
   ============================================================ */

/**
 * Añade un mensaje al DOM y hace scroll.
 * @param {'eggy'|'user'} sender
 * @param {string}        text
 */
function appendMessage(sender, text) {
  hideWelcome();
  const node = createMessageNode(sender, text);
  // Insertar antes del indicador "pensando" (que vive al final)
  eggyMessages.insertBefore(node, eggyThinking);
  scrollToBottom();
  messageCount++;
}

/**
 * Muestra el indicador "Eggy está pensando..."
 */
function showThinking() {
  isThinking = true;
  eggySendBtn.disabled = true;
  eggyThinking.classList.remove('is-hidden');
  moveThinkingToEnd();
  scrollToBottom();
}

/**
 * Oculta el indicador "Eggy está pensando..."
 */
function hideThinking() {
  isThinking = false;
  eggyThinking.classList.add('is-hidden');
  updateSendBtn();
}

/**
 * Obtiene la respuesta de Eggy llamando a Gemini.
 * ─────────────────────────────────────────────────────────────
 * Toda la lógica de la API está en gemini.js.
 * Esta función solo sirve de puente entre la UI y el módulo.
 *
 * @param   {string}          userText - Mensaje del usuario
 * @returns {Promise<string>}           - Respuesta de Eggy
 */
async function getEggyResponse(userText) {
  return await preguntarGemini(userText);
}

/**
 * Orquesta el envío:
 *   1. Lee textarea
 *   2. Añade mensaje del usuario
 *   3. Muestra indicador "pensando"
 *   4. Llama a Gemini
 *   5. Oculta indicador
 *   6. Muestra respuesta de Eggy
 */
async function sendMessage() {
  const text = eggyTextarea.value.trim();
  if (!text || isThinking) return;

  // Limpia el textarea y resetea su altura
  eggyTextarea.value = '';
  autoGrow(eggyTextarea);
  updateSendBtn();

  // 1. Mensaje del usuario
  appendMessage('user', text);

  // 2. Indicador de carga
  showThinking();

  try {
    // 3. Llamada real a Gemini (a través de gemini.js)
    const reply = await getEggyResponse(text);

    // 4. Oculta loading y muestra respuesta
    hideThinking();
    appendMessage('eggy', reply);

  } catch (error) {
    // 5. Manejo de error visible en el chat
    console.error('[Eggy] Error al comunicarse con Gemini:', error);
    hideThinking();
    appendMessage('eggy', `❌ No fue posible obtener respuesta de Eggy. ${error?.message || 'Revisa la consola del navegador para más detalles.'}`);
  }
}

/* ============================================================
   NUEVO CHAT
   ============================================================ */

/**
 * Limpia la conversación y muestra la bienvenida de nuevo.
 */
function resetChat() {
  // Elimina todos los mensajes (.eggy-msg)
  eggyMessages.querySelectorAll('.eggy-msg').forEach(node => node.remove());

  // Reinicia estado
  isThinking   = false;
  messageCount = 0;
  eggyThinking.classList.add('is-hidden');

  // Muestra bienvenida
  showWelcome();

  // Quita estado activo del historial
  historyItems.forEach(item => item.classList.remove('is-active'));

  // Limpia textarea
  eggyTextarea.value = '';
  autoGrow(eggyTextarea);
  updateSendBtn();

  // Foco
  eggyTextarea.focus();
}

/* ============================================================
   TEXTAREA — AUTO-GROW Y VALIDACIÓN
   ============================================================ */

/**
 * Ajusta la altura del textarea automáticamente al contenido.
 */
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

/**
 * Activa o desactiva el botón enviar según si hay texto.
 */
function updateSendBtn() {
  const hasText = eggyTextarea.value.trim().length > 0;
  eggySendBtn.disabled = !hasText || isThinking;
}

/* ============================================================
   SIDEBAR MÓVIL
   ============================================================ */

/** Abre la sidebar en móvil. */
function openSidebar() {
  eggySidebar.classList.add('is-open');
  eggyOverlay.classList.add('is-visible');
  eggyOverlay.setAttribute('aria-hidden', 'false');
  sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'true');
}

/** Cierra la sidebar en móvil. */
function closeSidebar() {
  eggySidebar.classList.remove('is-open');
  eggyOverlay.classList.remove('is-visible');
  eggyOverlay.setAttribute('aria-hidden', 'true');
  sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'false');
}

/* ============================================================
   MENSAJE DE BIENVENIDA INICIAL DE EGGY
   ============================================================ */

/**
 * Inyecta el mensaje de bienvenida de Eggy con un pequeño delay
 * para que la animación se vea natural.
 */
function injectWelcomeMessage() {
  const welcomeText = `👋 ¡Hola! Soy **Eggy**, tu profesor de inglés con plumas.\n\nEstoy aquí para ayudarte a aprender inglés de forma divertida y efectiva. Puedes preguntarme:\n\n• 🥚 Gramática y vocabulario\n• ⚡ Phrasal verbs y expresiones\n• 🗣️ Pronunciación y fonética\n• 🎯 Practicar conversaciones\n• 💡 Resolver cualquier duda\n\n¡Empieza escribiendo tu primera pregunta! Tú puedes. 🐣`;

  setTimeout(() => {
    appendMessage('eggy', welcomeText);
  }, 400);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

// ── Textarea: auto-grow + validación al escribir ──
eggyTextarea.addEventListener('input', () => {
  autoGrow(eggyTextarea);
  updateSendBtn();
});

// ── Textarea: Enter envía / Shift+Enter nueva línea ──
eggyTextarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!eggySendBtn.disabled) sendMessage();
  }
});

// ── Botón enviar ──
eggySendBtn.addEventListener('click', () => {
  sendMessage();
});

// ── Nuevo chat ──
if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    resetChat();
    closeSidebar();
  });
}

// ── Historial: selección de item ──
historyItems.forEach(item => {
  item.addEventListener('click', () => {
    historyItems.forEach(i => i.classList.remove('is-active'));
    item.classList.add('is-active');
    closeSidebar();
    // PUNTO DE INTEGRACIÓN FIRESTORE (futuro):
    // const chatId = item.dataset.chat;
    // loadChatFromFirestore(chatId);
  });
});

// ── Chips de sugerencias rápidas ──
chipBtns.forEach(chip => {
  chip.addEventListener('click', () => {
    const suggestion = chip.dataset.suggestion;
    if (suggestion) {
      eggyTextarea.value = suggestion;
      autoGrow(eggyTextarea);
      updateSendBtn();
      sendMessage();
    }
  });
});

// ── Sidebar móvil: toggle ──
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    eggySidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });
}

// ── Overlay: cerrar sidebar al tocar fuera ──
if (eggyOverlay) {
  eggyOverlay.addEventListener('click', closeSidebar);
}

// ── Cerrar sidebar con Escape ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && eggySidebar.classList.contains('is-open')) {
    closeSidebar();
  }
});

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

/**
 * Punto de entrada principal.
 * Se llama una sola vez al cargar el módulo.
 */
function init() {
  updateSendBtn();
  moveThinkingToEnd();
  injectWelcomeMessage();
  eggyTextarea.focus();
}

// Arranca
init();

/*
  ════════════════════════════════════════════════════════════
  GUÍA DE INTEGRACIÓN FUTURA
  ════════════════════════════════════════════════════════════

  1. FIREBASE AUTHENTICATION
     ─────────────────────────
     En init(), envuelve el código con onAuthStateChanged:
       onAuthStateChanged(auth, (user) => {
         if (!user) { window.location.href = '/entrar.html'; return; }
         // ... resto de la inicialización
       });

  2. FIRESTORE — GUARDAR HISTORIAL
     ─────────────────────────────
     En sendMessage(), después de obtener la respuesta:
       await guardarMensaje(chatId, 'user', text);
       await guardarMensaje(chatId, 'eggy', reply);

  3. CONTEXTO / HISTORIAL EN GEMINI
     ──────────────────────────────
     En gemini.js, cambia la firma de preguntarGemini para
     aceptar un array de mensajes previos y construir el
     historial de la conversación antes de enviar.

  ════════════════════════════════════════════════════════════
*/
