// ============================================================
//  Secciones/Js/Perfil.js
//  ✅ Lee la sesión REAL desde Firebase (onAuthStateChanged) y
//     rellena el perfil con datos del usuario: nombre, email,
//     edad, avatar con inicial.
//  ✅ Rellena la navbar (Entrar/Registrarse o Cerrar sesión)
//     tal como en Juegos.html, tanto en escritorio como en el
//     menú hamburguesa off-canvas.
//
//  🩹 FIX (bucle perfil <-> entrar):
//     Antes este archivo decidía si había sesión mirando SOLO
//     localStorage ('egglish_session'). El problema es que, al
//     hacer login, Firebase dispara `onAuthStateChanged` (en
//     entrar-logic.js) y navega a esta página ANTES de que
//     `loginUser()` termine de guardar esa clave en localStorage
//     (la navegación aborta el script de entrar.html a medias).
//     Resultado: localStorage nunca se llenaba, esta página
//     rebotaba a entrar.html, Firebase decía "sí hay sesión" y
//     te mandaba de vuelta aquí → bucle infinito.
//
//     Ahora la ÚNICA fuente de verdad es Firebase Auth
//     (onAuthStateChanged), igual que en entrar-logic.js.
//     localStorage se usa solo como caché para pintar rápido
//     mientras Firebase termina de inicializar (evita parpadeo),
//     pero nunca para decidir si redirigir.
// ============================================================

import { auth, db } from '/Secciones/Js/firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const SESSION_KEY = 'egglish_session';

// ── Caché local (solo para pintar rápido, NO para decidir sesión) ──
function getCachedSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCachedSession(data) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function clearCachedSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('egglish_join_date');
}

// ── Generar avatar con inicial del nombre ─────────────────────
function getAvatarColor(name) {
  const colors = [
    '#1cb0f6', '#58cc02', '#f5a623', '#ff4b4b',
    '#9b59b6', '#e67e22', '#2ecc71', '#e74c3c'
  ];
  const index = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

// ── Generar username a partir del nombre ──────────────────────
function generateUsername(name) {
  if (!name) return '@usuario';
  return '@' + name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// ── Fecha de registro (se guarda al crear cuenta) ─────────────
function getJoinDate() {
  const raw = localStorage.getItem('egglish_join_date');
  if (raw) return raw;
  // Si no existe, guardar la fecha actual
  const now = new Date();
  const formatted = `📅 Se unió en ${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`;
  localStorage.setItem('egglish_join_date', formatted);
  return formatted;
}

// ── Rellenar el perfil con datos reales ───────────────────────
function fillProfile(session) {
  const { name, email, age } = session;

  // ── 1. AVATAR ─────────────────────────────────────────────
  const avatarImg     = document.querySelector('.avatar-img');
  const existingAvatar = document.getElementById('user-avatar-initial');

  if (name && (avatarImg || existingAvatar)) {
    const initial = name.charAt(0).toUpperCase();
    const color   = getAvatarColor(name);

    if (existingAvatar) {
      // Ya se había sustituido antes (p. ej. re-render con datos de Firestore)
      existingAvatar.textContent = initial;
      existingAvatar.style.background = color;
    } else {
      const avatarDiv = document.createElement('div');
      avatarDiv.id = 'user-avatar-initial';
      avatarDiv.style.cssText = `
        width: 110px;
        height: 110px;
        border-radius: 50%;
        background: ${color};
        border: 4px solid #1cb0f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.8rem;
        font-weight: 900;
        color: white;
        font-family: 'Nunito', sans-serif;
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      `;
      avatarDiv.textContent = initial;
      avatarImg.replaceWith(avatarDiv);
    }
  }

  // ── 2. NOMBRE ─────────────────────────────────────────────
  const nameEl = document.querySelector('.profile-name');
  if (nameEl) nameEl.textContent = name || 'Usuario';

  // ── 3. USERNAME ───────────────────────────────────────────
  const usernameEl = document.querySelector('.profile-username');
  if (usernameEl) usernameEl.textContent = generateUsername(name);

  // ── 4. FECHA DE REGISTRO ──────────────────────────────────
  const joinedEl = document.querySelector('.profile-joined');
  if (joinedEl) joinedEl.textContent = getJoinDate();

  // ── 5. EMAIL en sección de info (opcional, si existe el elemento) ──
  const emailEl = document.getElementById('profile-email');
  if (emailEl) emailEl.textContent = email || '';

  // ── 6. EDAD en sección de info (opcional) ─────────────────
  const ageEl = document.getElementById('profile-age');
  if (ageEl && age) ageEl.textContent = `${age} años`;
}

// ── Pintado optimista con caché mientras Firebase inicializa ──
// (Firebase tarda un instante en confirmar la sesión al cargar la
// página; sin esto, se ve un parpadeo de "sin datos" cada vez).
document.addEventListener('DOMContentLoaded', () => {
  const cached = getCachedSession();
  if (cached) {
    adaptNavbar(cached);
    fillProfile(cached);
  } else {
    // Estado neutro mientras se confirma con Firebase; se corrige
    // en cuanto onAuthStateChanged responda (abajo).
    adaptNavbar(null);
  }
});

// ── Firebase es la ÚNICA fuente de verdad sobre la sesión ─────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // No hay sesión real → limpiar caché y mandar a login
    clearCachedSession();
    window.location.replace('/entrar.html');
    return;
  }

  // Traer datos extra (edad) desde Firestore, guardados al registrarse
  let age = null;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) age = snap.data().age ?? null;
  } catch (e) {
    console.warn('[Egglish] No se pudo leer el perfil en Firestore:', e);
  }

  const session = {
    uid:   user.uid,
    name:  user.displayName || user.email?.split('@')[0] || 'Usuario',
    email: user.email,
    age,
  };

  saveCachedSession(session);
  adaptNavbar(session);
  fillProfile(session);
});

// ── Cerrar sesión (compartido entre botón desktop y móvil) ────
async function cerrarSesion() {
  clearCachedSession();
  try {
    await signOut(auth);
  } catch (_) { /* ignorar si ya estaba desconectado */ }
  window.location.href = '/index.html';
}

// ── Adaptar navbar (desktop + off-canvas móvil) ───────────────
// Si hay sesión → botón "Cerrar sesión"
// Si NO hay sesión → enlaces "Entrar" y "Registrarse"
function adaptNavbar(session) {
  const authZoneDesktop = document.getElementById('navbar-auth-zone');
  const authZoneMobile  = document.getElementById('navbar-auth-zone-mobile');
  if (!authZoneDesktop && !authZoneMobile) return;

  if (session) {
    // ── Sesión activa: botón Cerrar sesión ──
    if (authZoneDesktop) {
      authZoneDesktop.innerHTML = `
        <button id="btn-cerrar-sesion" type="button"
          class="text-sm font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-hard-soft no-underline transition-colors">
          Cerrar sesión
        </button>`;
    }
    if (authZoneMobile) {
      authZoneMobile.innerHTML = `
        <button id="btn-cerrar-sesion-mobile" type="button"
          class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-bold text-white bg-red-500 hover:bg-red-600 shadow-hard-soft no-underline transition-colors">
          Cerrar sesión
        </button>`;
    }
  } else {
    // ── Sin sesión: enlaces Entrar / Registrarse ──
    if (authZoneDesktop) {
      authZoneDesktop.innerHTML = `
        <a href="/entrar.html" class="text-sm font-bold text-[#4b5563] dark:text-gray-300 hover:text-[#1a1a2e] dark:hover:text-white px-3 py-2 no-underline">→ Entrar</a>
        <a href="/Secciones/Registro.html" class="text-sm font-black text-white bg-egg-yellow hover:brightness-105 px-5 py-2.5 rounded-full shadow-hard-soft no-underline transition-transform">Registrarse</a>`;
    }
    if (authZoneMobile) {
      authZoneMobile.innerHTML = `
        <a href="/entrar.html" class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-bold text-[#1a1a2e] dark:text-white border-2 border-gray-200 dark:border-gray-700 no-underline">→ Entrar</a>
        <a href="/Secciones/Registro.html" class="egg-offcanvas-link w-full text-center rounded-full px-6 py-3 font-black text-white bg-egg-yellow shadow-hard-soft no-underline">Registrarse</a>`;
    }
  }

  // Mostrar la zona de escritorio (estaba oculta con "hidden" para evitar parpadeo)
  if (authZoneDesktop) authZoneDesktop.classList.remove('hidden');

  // Conectar el/los botón(es) de cerrar sesión si existen
  const logoutBtn = document.getElementById('btn-cerrar-sesion');
  const logoutBtnMobile = document.getElementById('btn-cerrar-sesion-mobile');
  if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);
  if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', cerrarSesion);
}