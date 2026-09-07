/* ============================================================
   EGGY.JS — Lógica de la interfaz del asistente IA de Egglish
   ─────────────────────────────────────────────────────────────
   • CERO dependencias externas: no hay fetch a APIs de terceros,
     no hay claves ni tokens, no hay backend propio para el chat.
   • Todo el procesamiento del modelo ocurre en el dispositivo del
     usuario vía WebGPU, gracias a webllm-engine.js.
   • Streaming real: la respuesta de Eggy se va pintando palabra a
     palabra a medida que el modelo la genera.
   ============================================================ */

"use strict";

import { initEngine, preguntarEggyStream } from "/Secciones/Js/webllm-engine.js";

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

// Pantalla de arranque del motor local
const bootOverlay    = document.getElementById('eggy-boot-overlay');
const bootText       = document.getElementById('eggy-boot-text');
const bootFill       = document.getElementById('eggy-boot-fill');

/* ============================================================
   ESTADO INTERNO
   ============================================================ */
let isThinking     = false; // hay una generación en curso
let engineReady    = false; // el motor WebLLM ya terminó de cargar
let messageCount   = 0;
let conversationHistory = []; // [{role, content}, ...] para dar contexto al modelo

/* ============================================================
   UTILIDADES
   ============================================================ */

function getCurrentTime() {
  return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom(behavior = 'smooth') {
  eggyMessages.scrollTo({ top: eggyMessages.scrollHeight, behavior });
}

function hideWelcome() {
  if (eggyWelcome && !eggyWelcome.classList.contains('is-hidden')) {
    eggyWelcome.style.display = 'none';
  }
}

function showWelcome() {
  if (eggyWelcome) {
    eggyWelcome.style.display = '';
    eggyWelcome.classList.remove('is-hidden');
  }
}

function moveThinkingToEnd() {
  eggyMessages.appendChild(eggyThinking);
}

/* ============================================================
   PANTALLA DE ARRANQUE (carga del modelo local)
   ============================================================ */

function setBootStatus(text, progress = 0) {
  if (bootText) bootText.textContent = text;
  if (bootFill) bootFill.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
}

function hideBootOverlay() {
  bootOverlay?.classList.add('is-hidden');
}

function showBootError(message) {
  if (bootOverlay) {
    bootOverlay.classList.add('is-error');
    bootOverlay.classList.remove('is-hidden');
  }
  setBootStatus(message, 0);
}

/**
 * Descarga/inicializa el modelo local. Mientras esto ocurre, el
 * input y el botón de enviar permanecen bloqueados.
 */
async function bootEngine() {
  eggyTextarea.disabled = true;
  eggySendBtn.disabled  = true;

  setBootStatus('Preparando a Eggy... esto solo ocurre la primera vez.', 0);

  try {
    await initEngine(({ progress, text }) => {
      setBootStatus(text, progress);
    });

    engineReady = true;
    hideBootOverlay();

    eggyTextarea.disabled = false;
    eggyTextarea.placeholder = 'Pregúntale algo a Eggy...';
    updateSendBtn();
    eggyTextarea.focus();

    injectWelcomeMessage();
  } catch (error) {
    console.error('[Eggy] No se pudo iniciar el motor local:', error);
    showBootError(`No fue posible cargar el modelo de IA local. ${error?.message || 'Revisa la consola del navegador.'}`);
  }
}

/* ============================================================
   CREAR NODOS DE MENSAJE
   ============================================================ */

/**
 * Crea y devuelve el nodo HTML de un mensaje, con su contenido en
 * un elemento separado (`.eggy-msg__content`) para poder actualizarlo
 * progresivamente durante el streaming.
 * @param {'eggy'|'user'} sender
 * @param {string}        text
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

  const content = document.createElement('div');
  content.className = 'eggy-msg__content';
  content.innerHTML = parseMarkdown(text);
  bubble.appendChild(content);

  const time = document.createElement('span');
  time.className   = 'eggy-msg__time';
  time.textContent = getCurrentTime();
  bubble.appendChild(time);

  wrapper.appendChild(bubble);
  return wrapper;
}

/**
 * Convierte un subconjunto de Markdown a HTML seguro.
 * Soporta: **bold**, *italic* y saltos de línea.
 * Escapa HTML primero para prevenir XSS.
 */
function parseMarkdown(raw) {
  let safe = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  safe = safe.replace(/\n/g, '<br>');
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  return safe;
}

/* ============================================================
   FLUJO DE ENVÍO DE MENSAJES
   ============================================================ */

function appendMessage(sender, text) {
  hideWelcome();
  const node = createMessageNode(sender, text);
  eggyMessages.insertBefore(node, eggyThinking);
  scrollToBottom();
  messageCount++;
  return node;
}

/** Muestra el indicador "Eggy está pensando..." y bloquea el envío. */
function showThinking() {
  isThinking = true;
  eggySendBtn.disabled = true;
  eggyThinking.classList.remove('is-hidden');
  moveThinkingToEnd();
  scrollToBottom();
}

/** Solo oculta visualmente el indicador (no libera el envío). */
function hideThinkingIndicator() {
  eggyThinking.classList.add('is-hidden');
}

/** Libera el envío una vez terminó (o falló) la generación. */
function finishThinking() {
  isThinking = false;
  hideThinkingIndicator();
  updateSendBtn();
}

/**
 * Orquesta el envío:
 *   1. Lee textarea
 *   2. Añade mensaje del usuario
 *   3. Muestra indicador "pensando"
 *   4. Genera la respuesta LOCALMENTE con WebLLM, en streaming
 *   5. Va actualizando la burbuja de Eggy token a token
 */
async function sendMessage(overrideText) {
  const text = (overrideText ?? eggyTextarea.value).trim();
  if (!text || isThinking || !engineReady) return;

  eggyTextarea.value = '';
  autoGrow(eggyTextarea);
  updateSendBtn();

  // 1. Mensaje del usuario
  appendMessage('user', text);

  // Historial que se envía al modelo como contexto (limitado para
  // no crecer indefinidamente la ventana de contexto)
  const historyForModel = conversationHistory.slice(-12);

  // 2. Indicador de carga
  showThinking();

  let eggyNode    = null;
  let contentEl   = null;
  let streamedText = '';

  try {
    // 3. Generación local en streaming (sin red, sin backend)
    await preguntarEggyStream(
      text,
      (_delta, fullText) => {
        // Al llegar el primer token, reemplaza "pensando" por la burbuja real
        if (!eggyNode) {
          hideThinkingIndicator();
          eggyNode = appendMessage('eggy', '');
          contentEl = eggyNode.querySelector('.eggy-msg__content');
        }
        streamedText = fullText;
        contentEl.innerHTML = parseMarkdown(streamedText);
        scrollToBottom();
      },
      historyForModel
    );

    conversationHistory.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'assistant', content: streamedText });

  } catch (error) {
    console.error('[Eggy] Error generando respuesta local:', error);
    hideThinkingIndicator();
    appendMessage('eggy', `❌ No fue posible generar una respuesta local. ${error?.message || 'Revisa la consola del navegador para más detalles.'}`);
  } finally {
    finishThinking();
  }
}

/* ============================================================
   NUEVO CHAT
   ============================================================ */

function resetChat() {
  eggyMessages.querySelectorAll('.eggy-msg').forEach(node => node.remove());

  isThinking   = false;
  messageCount = 0;
  conversationHistory = [];
  eggyThinking.classList.add('is-hidden');

  showWelcome();

  historyItems.forEach(item => item.classList.remove('is-active'));

  eggyTextarea.value = '';
  autoGrow(eggyTextarea);
  updateSendBtn();

  if (engineReady) {
    eggyTextarea.focus();
    injectWelcomeMessage();
  }
}

/* ============================================================
   TEXTAREA — AUTO-GROW Y VALIDACIÓN
   ============================================================ */

function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

/** Activa o desactiva el botón enviar según texto y estado del motor. */
function updateSendBtn() {
  const hasText = eggyTextarea.value.trim().length > 0;
  eggySendBtn.disabled = !hasText || isThinking || !engineReady;
}

/* ============================================================
   SIDEBAR MÓVIL
   ============================================================ */

function openSidebar() {
  eggySidebar.classList.add('is-open');
  eggyOverlay.classList.add('is-visible');
  eggyOverlay.setAttribute('aria-hidden', 'false');
  sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
  eggySidebar.classList.remove('is-open');
  eggyOverlay.classList.remove('is-visible');
  eggyOverlay.setAttribute('aria-hidden', 'true');
  sidebarToggle && sidebarToggle.setAttribute('aria-expanded', 'false');
}

/* ============================================================
   MENSAJE DE BIENVENIDA INICIAL DE EGGY
   ============================================================ */

let hasSentWelcome = false;

function injectWelcomeMessage() {
  if (hasSentWelcome) return;
  hasSentWelcome = true;

  const welcomeText = `👋 ¡Hola! Soy **Eggy**, tu profesor de inglés con plumas.\n\nAhora funciono 100% dentro de tu navegador: no envío tus mensajes a ningún servidor. Puedes preguntarme:\n\n• 🥚 Gramática y vocabulario\n• ⚡ Phrasal verbs y expresiones\n• 🗣️ Pronunciación y fonética\n• 🎯 Practicar conversaciones\n• 💡 Resolver cualquier duda\n\n¡Empieza escribiendo tu primera pregunta! Tú puedes. 🐣`;

  setTimeout(() => {
    appendMessage('eggy', welcomeText);
  }, 300);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

eggyTextarea.addEventListener('input', () => {
  autoGrow(eggyTextarea);
  updateSendBtn();
});

eggyTextarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!eggySendBtn.disabled) sendMessage();
  }
});

eggySendBtn.addEventListener('click', () => {
  sendMessage();
});

if (newChatBtn) {
  newChatBtn.addEventListener('click', () => {
    resetChat();
    closeSidebar();
  });
}

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

chipBtns.forEach(chip => {
  chip.addEventListener('click', () => {
    const suggestion = chip.dataset.suggestion;
    if (suggestion && engineReady) {
      eggyTextarea.value = suggestion;
      autoGrow(eggyTextarea);
      updateSendBtn();
      sendMessage();
    }
  });
});

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    eggySidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });
}

if (eggyOverlay) {
  eggyOverlay.addEventListener('click', closeSidebar);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && eggySidebar.classList.contains('is-open')) {
    closeSidebar();
  }
});

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */

function init() {
  updateSendBtn();
  moveThinkingToEnd();
  bootEngine(); // dispara la descarga/carga del modelo local
}

init();

/*
  ════════════════════════════════════════════════════════════
  GUÍA DE INTEGRACIÓN FUTURA
  ════════════════════════════════════════════════════════════

  1. FIREBASE AUTHENTICATION
     ─────────────────────────
     En init(), envuelve el arranque con onAuthStateChanged:
       onAuthStateChanged(auth, (user) => {
         if (!user) { window.location.href = '/entrar.html'; return; }
         bootEngine();
       });

  2. FIRESTORE — GUARDAR HISTORIAL
     ─────────────────────────────
     En sendMessage(), después de obtener la respuesta completa:
       await guardarMensaje(chatId, 'user', text);
       await guardarMensaje(chatId, 'eggy', streamedText);

  3. CAMBIAR DE MODELO
     ──────────────────
     Ajusta MODEL_ID en webllm-engine.js. Todos los IDs disponibles
     están en webllm.prebuiltAppConfig.model_list.

  ════════════════════════════════════════════════════════════
*/