// ============================================================
//  Secciones/Js/entrar-logic.js
//
//  Lógica de redirección post-login:
//  - Usuario NUEVO  (isNewUser === true en Firestore) → /placement-test.html
//    Solo pasa si alguien llega a entrar.html justo después de registrarse
//    sin haber cerrado sesión. En la práctica, Registro.html redirige directo.
//  - Usuario VIEJO  (isNewUser === false / campo ausente) → /Secciones/perfil.html
//
//  IMPORTANTE: onAuthStateChanged se dispara cuando:
//    1. El usuario acaba de hacer submit del loginForm (loginUser() llama a
//       signInWithEmailAndPassword, que autentica la sesión en Firebase).
//    2. El usuario ya tenía sesión activa al abrir entrar.html (ej. volvió
//       con la pestaña abierta). En ese caso lo redirigimos igual.
//  La bandera `redirectHandled` evita dobles disparos.
// ============================================================

import { loginUser } from './auth.js';
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Si ya hay sesión REAL en Firebase → decidir a dónde redirigir.
// - Usuario NUEVO (isNewUser === true en Firestore) → placement test
//   (solo ocurre cuando acaba de registrarse y aún no ha hecho el test)
// - Usuario EXISTENTE (isNewUser === false o campo ausente) → perfil
let redirectHandled = false;

onAuthStateChanged(auth, async (user) => {
  if (!user || redirectHandled) return;

  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists() && snap.data().isNewUser === true) {
      // Usuario recién registrado que todavía no ha hecho el placement test
      redirectHandled = true;
      window.location.replace('/placement-test.html');
    } else {
      // Usuario existente que está iniciando sesión → va a su perfil
      redirectHandled = true;
      window.location.replace('/Secciones/perfil.html');
    }
  } catch (e) {
    // Si Firestore falla por alguna razón, mandamos al perfil (usuario conocido)
    console.warn('[Egglish] No se pudo leer Firestore en onAuthStateChanged:', e);
    redirectHandled = true;
    window.location.replace('/Secciones/perfil.html');
  }
});

const EYE_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
`;
const EYE_OFF_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
`;

// ── Feedback inline ──────────────────────────────────────────
function setFormError(msg) {
  let el = document.getElementById('egglish-login-error');
  if (!el) {
    el = document.createElement('p');
    el.id = 'egglish-login-error';
    el.style.cssText = `
      color: #ef4444; font-weight: 700; font-size: 14px;
      text-align: center; margin: 4px 0 0 0;
      font-family: 'Nunito', sans-serif;
    `;
    const btn = document.querySelector('#loginForm button[type="submit"]');
    if (btn) btn.parentNode.insertBefore(el, btn);
    else document.querySelector('#loginForm')?.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function setButtonLoading(loading) {
  const btn = document.querySelector('#loginForm button[type="submit"]');
  if (!btn) return;
  btn.disabled      = loading;
  const label = btn.querySelector(".btn-label") || btn;
  label.textContent = loading ? "VERIFICANDO..." : "INGRESAR";
  btn.style.opacity = loading ? '0.7' : '1';
}

function injectShake() {
  if (document.getElementById('egglish-shake-style')) return;
  const s = document.createElement('style');
  s.id = 'egglish-shake-style';
  s.textContent = `@keyframes egglish-shake{
    0%,100%{transform:translateX(0)}
    20%,60%{transform:translateX(-8px)}
    40%,80%{transform:translateX(8px)}
  }`;
  document.head.appendChild(s);
}

// ── Conectar formulario ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectShake();

  const form    = document.getElementById('loginForm');
  const emailIn = document.getElementById('email');
  const passIn  = document.getElementById('password');
  const toggleBtn = document.getElementById('password-toggle');

  if (!form) {
    console.error('[Egglish] No se encontró #loginForm en entrar.html');
    return;
  }

  if (toggleBtn && passIn) {
    toggleBtn.innerHTML = EYE_ICON;
    toggleBtn.addEventListener('click', () => {
      const isPwd = passIn.getAttribute('type') === 'password';
      passIn.setAttribute('type', isPwd ? 'text' : 'password');
      toggleBtn.innerHTML = isPwd ? EYE_OFF_ICON : EYE_ICON;
      toggleBtn.setAttribute('aria-label', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormError('');
    setButtonLoading(true);

    const result = await loginUser({
      email:    emailIn.value.trim(),
      password: passIn.value,
    });

    setButtonLoading(false);

    if (result.ok) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const lbl = btn.querySelector('.btn-label') || btn;
        lbl.textContent = '¡Entrando!';
        btn.style.background = '#58cc02';
        btn.style.boxShadow  = '0 4px 0 #46a302';
      }
      // ✅ La redirección la maneja onAuthStateChanged arriba,
      //    que consulta Firestore y decide si ir al test o al perfil.
      //    No hace falta un setTimeout aquí.
    } else {
      setFormError(result.error);
      form.style.animation = 'egglish-shake .4s ease';
      setTimeout(() => (form.style.animation = ''), 400);
    }
  });
});