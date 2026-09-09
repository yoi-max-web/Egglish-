import { auth, db } from '/Secciones/Js/firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const SESSION_KEY = 'egglish_session';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Sesión "en memoria" del usuario actual, usada por el handler de subida de foto
let currentSession = null;

function saveCachedSession(data) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {} }
function clearCachedSession() { localStorage.removeItem(SESSION_KEY); localStorage.removeItem('egglish_join_date'); }

// ── Avatar guardado LOCALMENTE en el dispositivo (no en Firebase) ──────
// Firebase Storage no está disponible/configurado en este proyecto, así
// que la foto de perfil se guarda como imagen comprimida (base64) en
// localStorage, ligada al uid del usuario. Esto significa que la foto
// solo se ve en este dispositivo/navegador, no se sincroniza entre
// dispositivos (porque nunca se sube a ningún servidor).
const AVATAR_PREFIX = 'egglish_avatar_';

function getLocalAvatar(uid) {
  if (!uid) return null;
  try { return localStorage.getItem(AVATAR_PREFIX + uid); } catch { return null; }
}

function saveLocalAvatar(uid, dataUrl) {
  if (!uid) return false;
  try { localStorage.setItem(AVATAR_PREFIX + uid, dataUrl); return true; }
  catch (e) {
    console.warn('No se pudo guardar el avatar en localStorage:', e);
    return false;
  }
}

/**
 * Lee un archivo de imagen y lo redimensiona/comprime con un <canvas>
 * antes de convertirlo a base64. Esto es necesario porque localStorage
 * tiene un límite de ~5MB por sitio, y una foto de cámara sin comprimir
 * puede pesar varios MB por sí sola.
 */
function readAndResizeImage(file, maxSize = 320, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('El archivo no es una imagen válida.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) { height = Math.round(height * (maxSize / width)); width = maxSize; }
        else if (height > maxSize) { width = Math.round(width * (maxSize / height)); height = maxSize; }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function getAvatarColor(name) {
  const colors = ['#1cb0f6', '#58cc02', '#f5a623', '#ff4b4b', '#9b59b6', '#e67e22', '#2ecc71', '#e74c3c'];
  const index = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

function generateUsername(name) {
  if (!name) return '@usuario';
  return '@' + name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function getJoinDate() {
  const raw = localStorage.getItem('egglish_join_date');
  if (raw) return raw;
  const now = new Date();
  const formatted = `📅 Se unió en ${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
  localStorage.setItem('egglish_join_date', formatted);
  return formatted;
}

// ── Racha (Streak) ─────────────────────
// Si pasaron más de 24h desde la última actividad registrada en Firebase
// (campo `ultimaActividad`), la racha se reinicia a 0.
function calcularRachaValidada(session) {
  const actual = session.racha ?? 0;
  if (!session.ultimaActividad) return actual;

  const ultima = new Date(session.ultimaActividad);
  if (isNaN(ultima.getTime())) return actual;

  const diffMs = Date.now() - ultima.getTime();
  return diffMs > ONE_DAY_MS ? 0 : actual;
}

async function validarRachaEnFirebase(session) {
  const rachaValidada = calcularRachaValidada(session);
  if (rachaValidada !== session.racha) {
    session.racha = rachaValidada;
    try {
      await updateDoc(doc(db, 'users', session.uid), { racha: 0 });
    } catch (e) { console.warn('No se pudo reiniciar la racha en Firebase:', e); }
  }
  return session;
}

// ── Medallas y Logros (100% dinámicos) ─────────────────────
// Cada logro lee un campo real del documento del usuario en Firestore.
// Esos campos deben ser incrementados por las otras secciones de la app
// cada vez que el usuario interactúa con ellas:
//   - racha                 -> ya se actualiza junto con `ultimaActividad`
//   - exp                   -> puntos ganados en Lecciones/Escucha/Juegos
//   - leccionesCompletadas  -> incrementar en Lecciones al completar una lección
//   - escuchaCompletados    -> incrementar en Escucha al completar un ejercicio
//   - juegosGanados         -> incrementar en Juegos al ganar/terminar una partida
// Ningún valor está hardcodeado: si el campo no existe aún, el logro
// simplemente se muestra en 0/objetivo hasta que el usuario juegue.
const ACHIEVEMENTS_CONFIG = [
  {
    id: 'racha',
    name: 'Incendiario',
    icon: '🔥',
    colorClass: 'orange-bg',
    field: 'racha',
    tiers: [
      { level: 1, threshold: 3,  desc: 'Alcanza una racha de 3 días.' },
      { level: 2, threshold: 7,  desc: 'Alcanza una racha de 7 días.' },
      { level: 3, threshold: 14, desc: 'Alcanza una racha de 14 días.' },
      { level: 4, threshold: 30, desc: 'Alcanza una racha de 30 días.' },
    ],
  },
  {
    id: 'puntos',
    name: 'Sabio',
    icon: '⭐',
    colorClass: 'yellow-bg',
    field: 'exp',
    tiers: [
      { level: 1, threshold: 500,  desc: 'Gana 500 puntos.' },
      { level: 2, threshold: 1500, desc: 'Gana 1500 puntos.' },
      { level: 3, threshold: 3000, desc: 'Gana 3000 puntos.' },
      { level: 4, threshold: 5000, desc: 'Gana 5000 puntos.' },
    ],
  },
  {
    id: 'lecciones',
    name: 'Estudiante aplicado',
    icon: '📖',
    colorClass: 'blue-light-bg',
    field: 'leccionesCompletadas',
    tiers: [
      { level: 1, threshold: 5,  desc: 'Completa 5 lecciones.' },
      { level: 2, threshold: 15, desc: 'Completa 15 lecciones.' },
      { level: 3, threshold: 30, desc: 'Completa 30 lecciones.' },
      { level: 4, threshold: 50, desc: 'Completa 50 lecciones.' },
    ],
  },
  {
    id: 'escucha',
    name: 'Oído de oro',
    icon: '🎧',
    colorClass: 'pink-bg',
    field: 'escuchaCompletados',
    tiers: [
      { level: 1, threshold: 5,  desc: 'Completa 5 ejercicios de escucha.' },
      { level: 2, threshold: 15, desc: 'Completa 15 ejercicios de escucha.' },
      { level: 3, threshold: 30, desc: 'Completa 30 ejercicios de escucha.' },
      { level: 4, threshold: 50, desc: 'Completa 50 ejercicios de escucha.' },
    ],
  },
  {
    id: 'juegos',
    name: 'Jugador estrella',
    icon: '🎮',
    colorClass: 'orange-bg',
    field: 'juegosGanados',
    tiers: [
      { level: 1, threshold: 3,  desc: 'Gana 3 juegos.' },
      { level: 2, threshold: 10, desc: 'Gana 10 juegos.' },
      { level: 3, threshold: 25, desc: 'Gana 25 juegos.' },
      { level: 4, threshold: 50, desc: 'Gana 50 juegos.' },
    ],
  },
];

function renderAchievement(cfg, rawValue) {
  const value = Number(rawValue) || 0;
  const tiers = cfg.tiers;

  // Índice del tier más alto ya alcanzado (-1 si ninguno)
  let completedIdx = -1;
  for (let i = 0; i < tiers.length; i++) {
    if (value >= tiers[i].threshold) completedIdx = i;
  }
  const maxed = completedIdx === tiers.length - 1;
  const activeTier = maxed ? tiers[completedIdx] : tiers[completedIdx + 1];

  const progressPct = maxed ? 100 : Math.max(0, Math.min(100, Math.round((value / activeTier.threshold) * 100)));
  const progressLabel = maxed ? `${activeTier.threshold} / ${activeTier.threshold}` : `${value} / ${activeTier.threshold}`;
  const barClass = maxed ? 'progress-bar--yellow' : 'progress-bar--blue';
  const iconCompletedClass = maxed ? 'achievement-icon--completed' : '';
  const checkBadge = maxed ? '<span class="check-badge">✅</span>' : '';

  return `
    <div class="achievement-item">
      <div class="achievement-icon ${iconCompletedClass} ${cfg.colorClass}">${cfg.icon}${checkBadge}</div>
      <div class="achievement-info">
        <div class="achievement-top-row">
          <span class="achievement-name">${cfg.name}</span>
          <span class="achievement-level">Nivel ${activeTier.level}</span>
        </div>
        <p class="achievement-desc">${activeTier.desc}</p>
        <div class="progress-bar-wrapper">
          <div><div class="progress-bar ${barClass}" style="width: ${progressPct}%"></div></div>
          <span class="progress-text">${progressLabel}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAchievements(session) {
  const container = document.getElementById('achievements-container');
  if (!container) return;
  container.innerHTML = ACHIEVEMENTS_CONFIG.map((cfg) => renderAchievement(cfg, session?.[cfg.field])).join('');
}

// ── Estadísticas simplificadas: Puntos y Racha ─────────────────────
function fillStats(session) {
  const statRacha = document.getElementById('stat-racha');
  const statPuntos = document.getElementById('stat-puntos');
  if (statRacha) statRacha.textContent = session.racha ?? 0;
  if (statPuntos) statPuntos.textContent = session.exp ?? 0;
}

// ── Avatar (foto de perfil persistente) ─────────────────────
function renderAvatar(session) {
  const wrapper = document.querySelector('.avatar-wrapper');
  if (!wrapper) return;
  const existing = document.getElementById('avatar-display');
  const name = session?.name || '';

  if (session?.fotoURL) {
    if (existing && existing.tagName === 'IMG') {
      existing.src = session.fotoURL;
      existing.classList.remove('avatar-initial');
    } else {
      const img = document.createElement('img');
      img.id = 'avatar-display';
      img.className = 'avatar-img';
      img.alt = 'Avatar';
      img.src = session.fotoURL;
      if (existing) existing.replaceWith(img); else wrapper.prepend(img);
    }
  } else {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const color = getAvatarColor(name);
    if (existing && existing.tagName === 'DIV' && existing.classList.contains('avatar-initial')) {
      existing.textContent = initial;
      existing.style.background = color;
    } else {
      const div = document.createElement('div');
      div.id = 'avatar-display';
      div.className = 'avatar-img avatar-initial';
      div.style.background = color;
      div.textContent = initial;
      if (existing) existing.replaceWith(div); else wrapper.prepend(div);
    }
  }
}

function bindAvatarUpload() {
  const editBtn = document.getElementById('avatar-edit-btn');
  const fileInput = document.getElementById('avatar-file-input');
  if (!editBtn || !fileInput) return;

  editBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!currentSession || !currentSession.uid) { fileInput.value = ''; return; }

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.');
      fileInput.value = '';
      return;
    }

    const originalLabel = editBtn.textContent;
    editBtn.textContent = '⏳';
    editBtn.disabled = true;

    try {
      // 🩹 Firebase Storage no está disponible en este proyecto, así que
      // la foto se comprime y se guarda directamente en localStorage,
      // en este dispositivo. No requiere conexión ni Firebase.
      const dataUrl = await readAndResizeImage(file);
      const saved = saveLocalAvatar(currentSession.uid, dataUrl);
      if (!saved) {
        alert('No se pudo guardar la foto: el almacenamiento local está lleno. Intenta con una imagen más pequeña.');
        return;
      }

      currentSession.fotoURL = dataUrl;
      saveCachedSession(currentSession);
      renderAvatar(currentSession);
    } catch (err) {
      console.warn('Error guardando la foto de perfil:', err);
      alert('No se pudo actualizar la foto de perfil. Inténtalo de nuevo.');
    } finally {
      editBtn.textContent = originalLabel;
      editBtn.disabled = false;
      fileInput.value = '';
    }
  });
}

// ── Perfil general ─────────────────────
function fillProfile(session) {
  const { name, email, age } = session;
  renderAvatar(session);
  document.querySelector('.profile-name').textContent = name || 'Usuario';
  document.querySelector('.profile-username').textContent = generateUsername(name);
  document.querySelector('.profile-joined').textContent = getJoinDate();
  document.getElementById('profile-email').textContent = email || '';
  if (document.getElementById('profile-age')) document.getElementById('profile-age').textContent = age ? `${age} años` : '';
}

document.addEventListener('DOMContentLoaded', () => {
  bindAvatarUpload();
  // No pintar la caché aquí: podría pertenecer a la cuenta anterior.
  // Auth confirma la identidad y los datos reales en el listener inferior.
  adaptNavbar(null);
});

onAuthStateChanged(auth, async (user) => {
  if (!user) { clearCachedSession(); window.location.replace('/entrar.html'); return; }

  let userData = {
    age: null,
    racha: 0,
    exp: 0,
    ultimaActividad: null,
    fotoURL: null,
    leccionesCompletadas: 0,
    escuchaCompletados: 0,
    juegosGanados: 0,
  };
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();
      userData = { ...userData, ...data };
    }
  } catch (e) { console.warn(e); }

  let session = { uid: user.uid, name: user.displayName || user.email?.split('@')[0] || 'Usuario', email: user.email, ...userData };

  // 🩹 La foto de perfil vive SOLO en localStorage de este dispositivo
  // (Firebase Storage no está disponible). Si existe una guardada aquí,
  // tiene prioridad sobre cualquier valor viejo que pudiera venir de Firestore.
  const localAvatar = getLocalAvatar(user.uid);
  if (localAvatar) session.fotoURL = localAvatar;

  // Valida la racha contra la última actividad registrada en Firebase
  session = await validarRachaEnFirebase(session);

  currentSession = session;
  saveCachedSession(session);
  adaptNavbar(session);
  fillProfile(session);
  fillStats(session);
  renderAchievements(session);
});

async function cerrarSesion() { clearCachedSession(); try { await signOut(auth); } catch (_) {} window.location.href = '/index.html'; }

function adaptNavbar(session) {
  const authZoneDesktop = document.getElementById('navbar-auth-zone');
  const authZoneMobile = document.getElementById('navbar-auth-zone-mobile');
  if (!authZoneDesktop && !authZoneMobile) return;

  if (session) {
    if (authZoneDesktop) authZoneDesktop.innerHTML = `<button id="btn-cerrar-sesion" type="button" class="text-sm font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-hard-soft transition-colors">Cerrar sesión</button>`;
    if (authZoneMobile) authZoneMobile.innerHTML = `<button id="btn-cerrar-sesion-mobile" type="button" class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-bold text-white bg-red-500 hover:bg-red-600 shadow-hard-soft transition-colors">Cerrar sesión</button>`;
  } else {
    if (authZoneDesktop) authZoneDesktop.innerHTML = `<a href="/entrar.html" class="text-sm font-bold text-[#4b5563] dark:text-gray-300 hover:text-[#1a1a2e] px-3 py-2 no-underline">→ Entrar</a><a href="/Secciones/Registro.html" class="text-sm font-black text-white bg-egg-yellow px-5 py-2.5 rounded-full shadow-hard-soft no-underline">Registrarse</a>`;
    if (authZoneMobile) authZoneMobile.innerHTML = `<a href="/entrar.html" class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-bold text-[#1a1a2e] dark:text-white border-2 border-gray-200 no-underline">→ Entrar</a><a href="/Secciones/Registro.html" class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-black text-white bg-egg-yellow shadow-hard-soft no-underline">Registrarse</a>`;
  }
  if (authZoneDesktop) authZoneDesktop.classList.remove('hidden');
  const logoutBtn = document.getElementById('btn-cerrar-sesion');
  const logoutBtnMobile = document.getElementById('btn-cerrar-sesion-mobile');
  if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', cerrarSesion);
}