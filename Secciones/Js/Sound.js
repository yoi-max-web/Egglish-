// ============================================
//  EGGLISH – JUEGOS  |  Sound.js
//  Sistema de audio 100% generado con Web Audio API.
//  No requiere archivos .mp3/.wav externos.
//  Expone un único objeto global: SoundManager
// ============================================

window.SoundManager = (function () {

  // ---------- ESTADO INTERNO ----------
  let ctx = null;                 // AudioContext (se crea al primer gesto del usuario)
  let masterGain = null;          // Volumen general de efectos
  const STORAGE_KEY = 'egglish-audio-muted';

  // Lee la preferencia guardada (por defecto: sonido activado)
  let muted = localStorage.getItem(STORAGE_KEY) === 'true';

  // ---------- INICIALIZACIÓN PEREZOSA ----------
  // Los navegadores bloquean el AudioContext hasta que hay una
  // interacción del usuario (click/tap). Esta función se llama en
  // el primer gesto y crea el contexto y el nodo de ganancia.
  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();

    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.5;
    masterGain.connect(ctx.destination);

    return ctx;
  }

  // Algunos navegadores crean el AudioContext "suspended"; hay que
  // reanudarlo tras el gesto del usuario.
  function resumeIfNeeded() {
    ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
  }

  // ---------- GENERADOR BÁSICO DE TONOS ----------
  // Crea un oscilador + envolvente de volumen (ataque/caída) para
  // que el sonido no "chasquee" al empezar o terminar.
  function tone({ freq = 440, type = 'sine', duration = 0.15, delay = 0, volume = 1, glideTo = null }) {
    if (muted) return;
    resumeIfNeeded();
    const now = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);           // ataque suave
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);    // caída suave

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // ---------- EFECTOS DE INTERFAZ ----------

  // Click suave para tocar opciones, chips, botones, etc.
  function playClick() {
    tone({ freq: 520, type: 'sine', duration: 0.07, volume: 0.35 });
  }

  // Selección/arrastre (más corto y agudo que el click normal)
  function playSelect() {
    tone({ freq: 660, type: 'triangle', duration: 0.06, volume: 0.3 });
  }

  // Arpegio ascendente alegre para "¡Correcto!"
  function playCorrect() {
    const notes = [523.25, 659.25, 783.99]; // Do - Mi - Sol
    notes.forEach((freq, i) => {
      tone({ freq, type: 'triangle', duration: 0.18, delay: i * 0.09, volume: 0.4 });
    });
  }

  // Tono descendente y "apagado" para respuesta incorrecta (sin ser agresivo)
  function playWrong() {
    tone({ freq: 220, type: 'sawtooth', duration: 0.22, volume: 0.28, glideTo: 140 });
  }

  // Fanfarria breve para pantalla de resultados
  function playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // Do - Mi - Sol - Do agudo
    notes.forEach((freq, i) => {
      tone({ freq, type: 'triangle', duration: 0.22, delay: i * 0.1, volume: 0.4 });
    });
  }

  // ---------- MUTE / UNMUTE ----------
  function applyMuteState() {
    if (masterGain) masterGain.gain.value = muted ? 0 : 0.5;
  }

  function setMuted(value) {
    muted = value;
    localStorage.setItem(STORAGE_KEY, String(muted));
    if (ctx) applyMuteState();
  }

  function toggleMute() {
    setMuted(!muted);
    return muted;
  }

  function isMuted() {
    return muted;
  }

  // ---------- API PÚBLICA ----------
  return {
    init: ensureContext,   // llamar en el primer click de la página
    unlock: resumeIfNeeded,
    playClick,
    playSelect,
    playCorrect,
    playWrong,
    playVictory,
    toggleMute,
    setMuted,
    isMuted,
  };

})();