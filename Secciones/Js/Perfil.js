import { auth, db } from '/Secciones/Js/firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const SESSION_KEY = 'egglish_session';

function getCachedSession() { try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
function saveCachedSession(data) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {} }
function clearCachedSession() { localStorage.removeItem(SESSION_KEY); localStorage.removeItem('egglish_join_date'); }

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

// ── Renderizado Dinámico ─────────────────────
function renderList(containerId, data, templateFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p style="color:#9ca3af; font-size:0.8rem; padding:10px;">Aún sin datos.</p>';
    return;
  }
  container.innerHTML = data.map(templateFn).join('');
}

function updateProfileDynamicContent(data) {
  // Render Idiomas
  renderList('languages-container', data.idiomas || [], (lang) => `
    <div class="language-item">
      <img src="${lang.flagUrl}" alt="${lang.nombre}" class="flag-img"/>
      <div>
        <p class="lang-name">${lang.nombre}</p>
        <p class="lang-level">${lang.nivel}</p>
      </div>
    </div>
  `);

  // Render Amigos
  renderList('friends-container', data.amigos || [], (friend) => `
    <div class="friend-item">
      <div class="friend-avatar" style="background:${friend.color || '#1cb0f6'}">${friend.nombre.charAt(0).toUpperCase()}</div>
      <div>
        <p class="friend-name">${friend.nombre}</p>
        <p class="friend-exp">${friend.exp} EXP</p>
      </div>
    </div>
  `);
}

function fillStats(session) {
  document.getElementById('stat-racha').textContent = session.racha ?? 0;
  document.getElementById('stat-exp').textContent = session.exp ?? 0;
  document.getElementById('stat-division').textContent = session.division ?? 'Bronce';
  document.getElementById('stat-medallas').textContent = session.medallas ?? 0;
}

function fillProfile(session) {
  const { name, email, age } = session;
  const avatarImg = document.querySelector('.avatar-img');
  if (name && avatarImg) {
    const initial = name.charAt(0).toUpperCase();
    const color = getAvatarColor(name);
    const avatarDiv = document.createElement('div');
    avatarDiv.id = 'user-avatar-initial';
    avatarDiv.style.cssText = `width: 110px; height: 110px; border-radius: 50%; background: ${color}; border: 4px solid #1cb0f6; display: flex; align-items: center; justify-content: center; font-size: 2.8rem; font-weight: 900; color: white; box-shadow: 0 4px 16px rgba(0,0,0,0.12);`;
    avatarDiv.textContent = initial;
    avatarImg.replaceWith(avatarDiv);
  }
  document.querySelector('.profile-name').textContent = name || 'Usuario';
  document.querySelector('.profile-username').textContent = generateUsername(name);
  document.querySelector('.profile-joined').textContent = getJoinDate();
  document.getElementById('profile-email').textContent = email || '';
  if (document.getElementById('profile-age')) document.getElementById('profile-age').textContent = age ? `${age} años` : '';
}

document.addEventListener('DOMContentLoaded', () => {
  const cached = getCachedSession();
  if (cached) {
    adaptNavbar(cached);
    fillProfile(cached);
    fillStats(cached);
    updateProfileDynamicContent(cached);
  } else {
    adaptNavbar(null);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) { clearCachedSession(); window.location.replace('/entrar.html'); return; }

  let userData = { age: null, racha: 0, exp: 0, division: 'Bronce', medallas: 0, idiomas: [], amigos: [] };
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) {
      const data = snap.data();
      userData = { ...userData, ...data };
    }
  } catch (e) { console.warn(e); }

  const session = { uid: user.uid, name: user.displayName || user.email?.split('@')[0] || 'Usuario', email: user.email, ...userData };

  saveCachedSession(session);
  adaptNavbar(session);
  fillProfile(session);
  fillStats(session);
  updateProfileDynamicContent(session);
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