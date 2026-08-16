// ============================================================
//  Secciones/Js/Perfil.js
//  ✅ Lee la sesión guardada y rellena el perfil con datos reales
//     del usuario: nombre, email, edad, avatar con inicial
//  ✅ Rellena la navbar (Entrar/Registrarse o Cerrar sesión)
//     tal como en Juegos.html, tanto en escritorio como en el
//     menú hamburguesa off-canvas.
// ============================================================

// ── Leer sesión desde localStorage ───────────────────────────
function getSession() {
  try {
    const raw = localStorage.getItem('egglish_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Si no hay sesión → redirigir a login ─────────────────────
const session = getSession();
if (!session) {
  window.location.replace('/entrar.html');
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
document.addEventListener('DOMContentLoaded', () => {
  // La navbar (login/logout) se rellena siempre, haya o no sesión
  adaptNavbar(session);

  if (!session) return;

  const { name, email, age } = session;

  // ── 1. AVATAR ─────────────────────────────────────────────
  const avatarImg     = document.querySelector('.avatar-img');
  const avatarWrapper = document.querySelector('.avatar-wrapper');

  if (avatarImg && name) {
    // Reemplazar la imagen del pollito por un avatar con inicial
    const initial = name.charAt(0).toUpperCase();
    const color   = getAvatarColor(name);

    // Crear elemento de inicial
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

    // Sustituir la imagen por el div con inicial
    avatarImg.replaceWith(avatarDiv);
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
});

// ── Cerrar sesión (compartido entre botón desktop y móvil) ────
async function cerrarSesion() {
  localStorage.removeItem('egglish_session');

  // Si Firebase está activo, hacer signOut también
  try {
    const FB_CDN = 'https://www.gstatic.com/firebasejs/10.12.2';
    const { getAuth, signOut } = await import(`${FB_CDN}/firebase-auth.js`);
    const auth = getAuth();
    if (auth.currentUser) await signOut(auth);
  } catch (_) { /* ignorar si Firebase no está activo */ }

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