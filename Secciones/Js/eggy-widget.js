/* ============================================================
   EGGY-WIDGET.JS — Botón flotante + chat pequeño de Eggy IA
   ─────────────────────────────────────────────────────────────
   Cómo usarlo: agrega esta única línea antes de </body> en
   CADA página donde quieras que aparezca el pollito flotante:

     <script type="module" src="/Secciones/Js/eggy-widget.js"></script>

   No requiere el sidebar ni el historial de eggy.html/eggy.css —
   este widget es autónomo: inyecta su propio CSS y HTML, y
   reutiliza la lógica de gemini.js para responder.
   ============================================================ */

"use strict";

import { preguntarGemini } from './gemini.js';

/* ============================================================
   ESTILOS
   ============================================================ */
function injectStyles() {
  const style = document.createElement('style');
  style.id = 'eggy-fab-styles';
  style.textContent = `
  #eggy-fab-root {
    --blue:    #1cb0f6;
    --blue-d:  #0090d9;
    --yellow:  #f5a623;
    --yellow-d:#d48800;
    --white:   #ffffff;
    --bg:      #f0f4f8;
    --text:    #1a1a2e;
    --mid:     #4b5563;
    --border:  #e5e7eb;
    --font:    'Nunito', sans-serif;
    font-family: var(--font);
  }

  /* ---- Botón flotante ---- */
  .eggy-fab-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--blue);
    box-shadow: 0 6px 0 var(--blue-d), 0 8px 20px rgba(0,0,0,.18);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
    transition: transform .2s ease, box-shadow .2s ease;
    padding: 0;
  }
  .eggy-fab-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 9px 0 var(--blue-d), 0 10px 24px rgba(0,0,0,.2);
  }
  .eggy-fab-btn:active {
    transform: translateY(1px);
    box-shadow: 0 3px 0 var(--blue-d), 0 6px 14px rgba(0,0,0,.18);
  }
  .eggy-fab-btn img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    pointer-events: none;
  }
  .eggy-fab-btn__close-icon { display: none; }
  .eggy-fab-btn.is-open .eggy-fab-btn__chick-icon { display: none; }
  .eggy-fab-btn.is-open .eggy-fab-btn__close-icon { display: block; }

  /* Punto de notificación en el primer render */
  .eggy-fab-btn__ping {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #f04438;
    border: 2px solid var(--white);
  }

  /* ---- Panel del chat ---- */
  .eggy-fab-panel {
    position: fixed;
    bottom: 92px;
    right: 20px;
    width: min(300px, calc(100vw - 24px));
    height: min(420px, calc(100vh - 116px));
    background: var(--bg);
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(0,0,0,.22);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 9999;
    opacity: 0;
    transform: translateY(16px) scale(.97);
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
  }
  .eggy-fab-panel.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .eggy-fab-panel__header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: var(--white);
    border-bottom: 2px solid var(--border);
    flex-shrink: 0;
  }
  .eggy-fab-panel__avatar {
    width: 38px;
    height: 38px;
    object-fit: contain;
    background: #dbeafe;
    border-radius: 12px;
    padding: 3px;
    flex-shrink: 0;
  }
  .eggy-fab-panel__info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .eggy-fab-panel__name { font-size: .95rem; font-weight: 900; color: var(--text); }
  .eggy-fab-panel__status {
    display: flex; align-items: center; gap: 5px;
    font-size: .72rem; font-weight: 700; color: #10b981;
  }
  .eggy-fab-panel__status::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%; background: #10b981; flex-shrink: 0;
  }
  .eggy-fab-panel__new-btn,
  .eggy-fab-panel__close-btn {
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mid);
    transition: background .15s ease;
    flex-shrink: 0;
  }
  .eggy-fab-panel__new-btn:hover,
  .eggy-fab-panel__close-btn:hover { background: var(--bg); color: var(--text); }

  .eggy-fab-messages {
    flex: 1;
    overflow-y: auto;
    padding: 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .eggy-fab-msg {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    max-width: 100%;
    animation: eggyFabFadeIn .3s ease both;
  }
  @keyframes eggyFabFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .eggy-fab-msg--eggy { align-self: flex-start; }
  .eggy-fab-msg--user { align-self: flex-end; flex-direction: row-reverse; }

  .eggy-fab-msg__avatar {
    width: 28px; height: 28px; object-fit: contain;
    border-radius: 9px; background: #dbeafe; padding: 2px; flex-shrink: 0;
  }
  .eggy-fab-msg__avatar--user {
    width: 28px; height: 28px; border-radius: 9px; background: #fef3c7;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }

  .eggy-fab-msg__bubble {
    padding: 10px 14px;
    border-radius: 16px;
    font-size: .85rem;
    font-weight: 600;
    line-height: 1.5;
    max-width: calc(100% - 40px);
    word-wrap: break-word;
  }
  .eggy-fab-msg--eggy .eggy-fab-msg__bubble {
    background: var(--white);
    color: var(--text);
    border: 2px solid var(--border);
    border-bottom-left-radius: 4px;
    box-shadow: 0 3px 0 var(--border);
  }
  .eggy-fab-msg--user .eggy-fab-msg__bubble {
    background: var(--blue);
    color: var(--white);
    border-bottom-right-radius: 4px;
    box-shadow: 0 3px 0 var(--blue-d);
  }
  .eggy-fab-msg__time {
    font-size: .62rem; font-weight: 700; color: #9ca3af; margin-top: 4px; display: block;
  }
  .eggy-fab-msg--user .eggy-fab-msg__time { text-align: right; color: rgba(255,255,255,.75); }

  .eggy-fab-thinking {
    display: flex; align-items: flex-end; gap: 8px; align-self: flex-start;
    animation: eggyFabFadeIn .3s ease both;
  }
  .eggy-fab-thinking.is-hidden { display: none; }
  .eggy-fab-thinking__bubble {
    background: var(--white); border: 2px solid var(--border); border-radius: 16px;
    border-bottom-left-radius: 4px; padding: 10px 14px; display: flex; align-items: center; gap: 6px;
    box-shadow: 0 3px 0 var(--border);
  }
  .eggy-fab-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--blue);
    animation: eggyFabDot 1.2s infinite ease-in-out;
  }
  .eggy-fab-dot:nth-child(2) { animation-delay: .2s; }
  .eggy-fab-dot:nth-child(3) { animation-delay: .4s; }
  @keyframes eggyFabDot {
    0%, 80%, 100% { transform: scale(.6); opacity: .5; }
    40%           { transform: scale(1);   opacity: 1; }
  }

  .eggy-fab-welcome {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; flex: 1; gap: 10px; padding: 20px 12px;
  }
  .eggy-fab-welcome img { width: 56px; height: 56px; object-fit: contain; }
  .eggy-fab-welcome h2 { font-size: 1.05rem; font-weight: 900; color: var(--text); }
  .eggy-fab-welcome p { font-size: .82rem; font-weight: 600; color: var(--mid); max-width: 260px; line-height: 1.4; }
  .eggy-fab-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 6px; }
  .eggy-fab-chip {
    background: var(--white); border: 2px solid var(--border); border-radius: 20px;
    padding: 6px 12px; font-family: var(--font); font-size: .74rem; font-weight: 700;
    color: var(--mid); cursor: pointer; transition: all .15s ease;
  }
  .eggy-fab-chip:hover { background: #dbeafe; border-color: var(--blue); color: var(--blue); }

  .eggy-fab-input-area {
    padding: 12px 14px 14px;
    background: var(--white);
    border-top: 2px solid var(--border);
    flex-shrink: 0;
  }
  .eggy-fab-input-row {
    display: flex; align-items: flex-end; gap: 8px;
    background: var(--bg); border: 2px solid var(--border); border-radius: 16px;
    padding: 8px 10px; transition: border-color .15s ease, box-shadow .15s ease;
  }
  .eggy-fab-input-row:focus-within {
    border-color: var(--blue); box-shadow: 0 0 0 3px rgba(28,176,246,.15);
  }
  .eggy-fab-textarea {
    flex: 1; resize: none; border: none; background: transparent;
    font-family: var(--font); font-size: .85rem; font-weight: 600; color: var(--text);
    line-height: 1.4; max-height: 100px; overflow-y: auto; outline: none;
  }
  .eggy-fab-textarea::placeholder { color: #9ca3af; font-weight: 600; }
  .eggy-fab-send-btn {
    width: 36px; height: 36px; background: var(--blue); border: none; border-radius: 10px;
    box-shadow: 0 3px 0 var(--blue-d); display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; transition: all .15s ease;
  }
  .eggy-fab-send-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 0 var(--blue-d); }
  .eggy-fab-send-btn:disabled { background: #d1d5db; box-shadow: 0 3px 0 #b0b3b8; cursor: not-allowed; }

  @media (max-width: 480px) {
    .eggy-fab-btn { right: 16px; bottom: 16px; }
    .eggy-fab-panel { right: 12px; bottom: 84px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .eggy-fab-panel, .eggy-fab-btn, .eggy-fab-msg, .eggy-fab-thinking, .eggy-fab-dot {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
  }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   MARKUP
   ============================================================ */
const CHICK_URL = 'https://em-content.zobj.net/source/twitter/376/hatching-chick_1f423.png';

function buildMarkup() {
  const root = document.createElement('div');
  root.id = 'eggy-fab-root';
  root.innerHTML = `
    <button class="eggy-fab-btn" id="eggy-fab-btn" aria-label="Abrir chat con Eggy" aria-expanded="false">
      <span class="eggy-fab-btn__ping" id="eggy-fab-ping"></span>
      <img src="${CHICK_URL}" alt="" class="eggy-fab-btn__chick-icon"/>
      <svg class="eggy-fab-btn__close-icon" width="26" height="26" viewBox="0 0 24 24" fill="none"
           stroke="white" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
      </svg>
    </button>

    <section class="eggy-fab-panel" id="eggy-fab-panel" aria-label="Chat con Eggy IA" aria-hidden="true">
      <header class="eggy-fab-panel__header">
        <img src="${CHICK_URL}" alt="Eggy" class="eggy-fab-panel__avatar"/>
        <div class="eggy-fab-panel__info">
          <span class="eggy-fab-panel__name">Eggy IA</span>
          <span class="eggy-fab-panel__status">En línea</span>
        </div>
        <button class="eggy-fab-panel__new-btn" id="eggy-fab-new-btn" aria-label="Nuevo chat" title="Nuevo chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="eggy-fab-panel__close-btn" id="eggy-fab-close-btn" aria-label="Cerrar chat" title="Cerrar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>
      </header>

      <section class="eggy-fab-messages" id="eggy-fab-messages" aria-live="polite">
        <div class="eggy-fab-welcome" id="eggy-fab-welcome">
          <img src="${CHICK_URL}" alt="Eggy"/>
          <h2>¡Hola! Soy Eggy 🐣</h2>
          <p>Pregúntame gramática, vocabulario, pronunciación o practica conmigo.</p>
          <div class="eggy-fab-chips">
            <button class="eggy-fab-chip" data-suggestion="¿Cuál es la diferencia entre 'few' y 'a few'?">🥚 few vs a few</button>
            <button class="eggy-fab-chip" data-suggestion="Enséñame 5 phrasal verbs comunes">⚡ Phrasal verbs</button>
            <button class="eggy-fab-chip" data-suggestion="Practiquemos una conversación en inglés nivel B1">🎯 Practicar B1</button>
          </div>
        </div>

        <div class="eggy-fab-thinking is-hidden" id="eggy-fab-thinking">
          <img src="${CHICK_URL}" alt="Eggy" class="eggy-fab-msg__avatar"/>
          <div class="eggy-fab-thinking__bubble">
            <span class="eggy-fab-dot"></span><span class="eggy-fab-dot"></span><span class="eggy-fab-dot"></span>
          </div>
        </div>
      </section>

      <div class="eggy-fab-input-area">
        <div class="eggy-fab-input-row">
          <textarea class="eggy-fab-textarea" id="eggy-fab-textarea" placeholder="Pregúntale algo a Eggy..."
                    rows="1" maxlength="2000" aria-label="Escribe tu mensaje"></textarea>
          <button class="eggy-fab-send-btn" id="eggy-fab-send-btn" aria-label="Enviar mensaje" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
  document.body.appendChild(root);
  return root;
}

/* ============================================================
   LÓGICA (adaptada de eggy.js, sin sidebar/historial)
   ============================================================ */
function init() {
  injectStyles();
  buildMarkup();

  const fabBtn      = document.getElementById('eggy-fab-btn');
  const ping        = document.getElementById('eggy-fab-ping');
  const panel       = document.getElementById('eggy-fab-panel');
  const messages    = document.getElementById('eggy-fab-messages');
  const welcome     = document.getElementById('eggy-fab-welcome');
  const thinking    = document.getElementById('eggy-fab-thinking');
  const textarea    = document.getElementById('eggy-fab-textarea');
  const sendBtn     = document.getElementById('eggy-fab-send-btn');
  const newChatBtn  = document.getElementById('eggy-fab-new-btn');
  const closeBtn    = document.getElementById('eggy-fab-close-btn');
  const chipBtns    = messages.querySelectorAll('.eggy-fab-chip');

  let isOpen = false;
  let isThinking = false;
  let hasInjectedWelcome = false;

  function getCurrentTime() {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

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

  function scrollToBottom() {
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
  }

  function hideWelcome() {
    if (welcome && welcome.style.display !== 'none') welcome.style.display = 'none';
  }

  function createMessageNode(sender, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `eggy-fab-msg eggy-fab-msg--${sender}`;

    if (sender === 'eggy') {
      const avatar = document.createElement('img');
      avatar.src = CHICK_URL;
      avatar.alt = 'Eggy';
      avatar.className = 'eggy-fab-msg__avatar';
      wrapper.appendChild(avatar);
    } else {
      const avatarEl = document.createElement('div');
      avatarEl.className = 'eggy-fab-msg__avatar--user';
      avatarEl.textContent = '🧑‍💻';
      wrapper.appendChild(avatarEl);
    }

    const bubble = document.createElement('div');
    bubble.className = 'eggy-fab-msg__bubble';
    bubble.innerHTML = parseMarkdown(text);

    const time = document.createElement('span');
    time.className = 'eggy-fab-msg__time';
    time.textContent = getCurrentTime();
    bubble.appendChild(time);

    wrapper.appendChild(bubble);
    return wrapper;
  }

  function appendMessage(sender, text) {
    hideWelcome();
    const node = createMessageNode(sender, text);
    messages.insertBefore(node, thinking);
    scrollToBottom();
  }

  function showThinking() {
    isThinking = true;
    sendBtn.disabled = true;
    thinking.classList.remove('is-hidden');
    messages.appendChild(thinking);
    scrollToBottom();
  }

  function hideThinking() {
    isThinking = false;
    thinking.classList.add('is-hidden');
    updateSendBtn();
  }

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  function updateSendBtn() {
    const hasText = textarea.value.trim().length > 0;
    sendBtn.disabled = !hasText || isThinking;
  }

  async function sendMessage(overrideText) {
    const text = (overrideText ?? textarea.value).trim();
    if (!text || isThinking) return;

    textarea.value = '';
    autoGrow(textarea);
    updateSendBtn();

    appendMessage('user', text);
    showThinking();

    try {
      const reply = await preguntarGemini(text);
      hideThinking();
      appendMessage('eggy', reply);
    } catch (error) {
      console.error('[Eggy Widget] Error al comunicarse con Gemini:', error);
      hideThinking();
      appendMessage('eggy', `❌ No fue posible obtener respuesta de Eggy. ${error?.message || 'Revisa la consola del navegador.'}`);
    }
  }

  function injectWelcomeGreeting() {
    if (hasInjectedWelcome) return;
    hasInjectedWelcome = true;
    // El bloque .eggy-fab-welcome ya cumple el rol de saludo inicial,
    // así que no duplicamos un mensaje de chat aparte.
  }

  function openPanel() {
    isOpen = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    fabBtn.classList.add('is-open');
    fabBtn.setAttribute('aria-expanded', 'true');
    fabBtn.setAttribute('aria-label', 'Cerrar chat con Eggy');
    if (ping) ping.style.display = 'none';
    injectWelcomeGreeting();
    setTimeout(() => textarea.focus(), 150);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    fabBtn.classList.remove('is-open');
    fabBtn.setAttribute('aria-expanded', 'false');
    fabBtn.setAttribute('aria-label', 'Abrir chat con Eggy');
  }

  function resetChat() {
    messages.querySelectorAll('.eggy-fab-msg').forEach(n => n.remove());
    isThinking = false;
    thinking.classList.add('is-hidden');
    welcome.style.display = '';
    textarea.value = '';
    autoGrow(textarea);
    updateSendBtn();
    textarea.focus();
  }

  // ── Eventos ──
  fabBtn.addEventListener('click', () => (isOpen ? closePanel() : openPanel()));
  closeBtn.addEventListener('click', closePanel);
  newChatBtn.addEventListener('click', resetChat);

  textarea.addEventListener('input', () => {
    autoGrow(textarea);
    updateSendBtn();
  });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });
  sendBtn.addEventListener('click', () => sendMessage());

  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const suggestion = chip.dataset.suggestion;
      if (suggestion) sendMessage(suggestion);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closePanel();
  });

  updateSendBtn();
}

/* ============================================================
   EVITAR DOBLE INYECCIÓN
   (por si el script se incluye sin querer más de una vez)
   ============================================================ */
if (document.getElementById('eggy-fab-root')) {
  console.warn('[Eggy Widget] Ya estaba inyectado en esta página, se omite duplicado.');
} else {
  init();
}