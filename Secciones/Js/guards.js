// ============================================================
//  Secciones/Js/guards.js
//  Protege los enlaces de contenido en todas las páginas.
//  Rutas ajustadas a la estructura real:
//    EGGLISH/
//    ├── index.html
//    ├── entrar.html
//    └── Secciones/
//        ├── Registro.html
//        ├── lecciones.html
//        ├── Escucha.html
//        ├── juegos.html
//        └── perfil.html
// ============================================================

import { isLoggedIn, getSession, logoutUser } from './auth.js';

// ── Rutas que requieren sesión activa ─────────────────────────
const PROTECTED_PATHS = [
  '/Secciones/lecciones.html',
  '/Secciones/Escucha.html',
  '/Secciones/juegos.html',
  '/Secciones/perfil.html',
  '/Secciones/eggy.html',
];

// ─────────────────────────────────────────────────────────────
//  TOAST DE ACCESO DENEGADO
// ─────────────────────────────────────────────────────────────
function injectToastCSS() {
  if (document.getElementById('egglish-toast-style')) return;
  const style = document.createElement('style');
  style.id = 'egglish-toast-style';
  style.textContent = `
    #egglish-toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #1a1a2e;
      color: #fff;
      padding: 18px 28px;
      border-radius: 18px;
      font-family: 'Nunito', sans-serif;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.30);
      z-index: 9999;
      max-width: 92vw;
      text-align: left;
      opacity: 0;
      pointer-events: none;
      transition: transform .42s cubic-bezier(.34,1.56,.64,1), opacity .35s ease;
    }
    #egglish-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    #egglish-toast .t-icon { font-size: 22px; flex-shrink: 0; }
    #egglish-toast .t-body  { display: flex; flex-direction: column; gap: 10px; }
    #egglish-toast .t-msg   { line-height: 1.4; }
    #egglish-toast .t-btns  { display: flex; gap: 8px; flex-wrap: wrap; }
    #egglish-toast .t-btn {
      padding: 8px 18px;
      border-radius: 10px;
      font-family: 'Nunito', sans-serif;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      border: none;
      text-decoration: none;
      display: inline-block;
      line-height: 1.3;
      transition: opacity .15s;
    }
    #egglish-toast .t-btn:hover { opacity: .85; }
    #egglish-toast .t-btn-login    { background: #1cb0f6; color: #fff; }
    #egglish-toast .t-btn-register { background: #f5a623; color: #fff; }
  `;
  document.head.appendChild(style);
}

function getOrCreateToast() {
  let el = document.getElementById('egglish-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'egglish-toast';
    el.innerHTML = `
      <span class="t-icon">🔒</span>
      <div class="t-body">
        <span class="t-msg">Debes iniciar sesión para acceder a este contenido.</span>
        <div class="t-btns">
          <a href="/entrar.html"              class="t-btn t-btn-login">→ Entrar</a>
          <a href="/Secciones/Registro.html"  class="t-btn t-btn-register">Crear cuenta gratis</a>
        </div>
      </div>`;
    document.body.appendChild(el);
  }
  return el;
}

let _toastTimer = null;
function showAccessToast() {
  injectToastCSS();
  const toast = getOrCreateToast();
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

// ─────────────────────────────────────────────────────────────
//  INTERCEPTAR CLICS EN ENLACES PROTEGIDOS
// ─────────────────────────────────────────────────────────────
export function guardProtectedLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');

    const isProtected = PROTECTED_PATHS.some(p =>
      href === p || href === p.slice(1)
    );
    if (!isProtected) return;

    if (!isLoggedIn()) {
      e.preventDefault();
      showAccessToast();
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  ADAPTAR NAVBAR: muestra botón "Cerrar sesión" si hay sesión
//  o botones "Entrar / Registrarse" si NO la hay.
//  ► SIN saludo ni nombre de usuario. ◄
// ─────────────────────────────────────────────────────────────
export function adaptNavbarToSession() {
  const authDiv = document.querySelector('.navbar-auth');
  if (!authDiv) return;

  if (isLoggedIn()) {
    // ── Usuario autenticado: solo botón rojo de cerrar sesión ──
    authDiv.innerHTML = `
      <button id="btn-logout" style="
        font-weight:800;
        color:#fff;
        background:#ef4444;
        border:none;
        padding:10px 22px;
        border-radius:12px;
        cursor:pointer;
        font-family:'Nunito',sans-serif;
        box-shadow:0 4px 0 #b91c1c;
        font-size:0.95rem;
        letter-spacing:.3px;
        transition: transform .15s, box-shadow .15s;">
        Cerrar sesión
      </button>`;

    document.getElementById('btn-logout')
      .addEventListener('click', logoutUser);

    // Pequeño efecto hover via JS (no requiere hoja de estilos extra)
    const logoutBtn = document.getElementById('btn-logout');
    logoutBtn.addEventListener('mouseenter', () => {
      logoutBtn.style.transform = 'translateY(-2px)';
    });
    logoutBtn.addEventListener('mouseleave', () => {
      logoutBtn.style.transform = 'translateY(0)';
    });

  } else {
    // ── Sin sesión: botones originales Entrar / Registrarse ──
    // El HTML de cada página ya los trae por defecto,
    // así que solo actuamos si por alguna razón no están.
    if (!authDiv.querySelector('.btn-entrar')) {
      authDiv.innerHTML = `
        <a href="/entrar.html" class="btn-entrar">→ Entrar</a>
        <a href="/Secciones/Registro.html" class="btn-registrarse">Registrarse</a>`;
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  PUNTO DE ENTRADA ÚNICO — válido para index.html y secciones
// ─────────────────────────────────────────────────────────────
export function initIndexGuards() {
  guardProtectedLinks();
  adaptNavbarToSession();
}