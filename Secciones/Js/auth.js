// ============================================================
//  Secciones/Js/auth.js
//  ✅ Versión corregida para navegador puro con Firebase CDN
//     NO requiere Node.js, Webpack ni Vite
//
//  🩹 FIX (bucle perfil <-> entrar):
//     Antes, `perfil.html` decidía si había sesión mirando SOLO
//     `localStorage`. Pero justo al hacer login, Firebase dispara
//     `onAuthStateChanged` (en entrar-logic.js) y navega a
//     perfil.html ANTES de que termine de ejecutarse el resto de
//     `loginUser()` (que es quien guarda la sesión en localStorage).
//     Resultado: la navegación aborta el script a medias, el
//     localStorage nunca se llega a escribir, y perfil.html rebota
//     de vuelta a entrar.html → bucle infinito.
//
//     Ahora `localStorage` es solo una CACHÉ para pintar rápido
//     (evitar parpadeo), pero la fuente de verdad real es SIEMPRE
//     Firebase Auth (`onAuthStateChanged`), tanto en entrar.html
//     como en perfil.html. Los datos extra (edad) se guardan en
//     Firestore, ya que Firebase Auth no tiene un campo para eso.
// ============================================================

import { USE_FIREBASE, auth as _sharedAuth, db as _sharedDb } from './firebase-config.js';

// ── URLs de Firebase CDN (navegador puro) ─────────────────────
const FB_CDN = 'https://www.gstatic.com/firebasejs/10.12.2';

// ── Instancia Firebase compartida ─────────────────────────────
// IMPORTANTE: reutilizamos la MISMA instancia `auth` que exporta
// firebase-config.js (y que usa entrar-logic.js / Perfil.js para
// onAuthStateChanged), en vez de crear una segunda con un import()
// dinámico. Tener dos instancias es una fuente de bugs difíciles
// de rastrear (p. ej. listeners que no se disparan en la instancia
// que uno cree que está usando).
async function getAuth() {
  return _sharedAuth;
}

// ── Clave de sesión en localStorage (solo caché, no fuente de verdad) ──
const SESSION_KEY = 'egglish_session';

// ─────────────────────────────────────────────────────────────
//  VALIDACIÓN DE CONTRASEÑA
// ─────────────────────────────────────────────────────────────
export function validatePassword(password) {
  const checks = [
    { id: 'length', label: 'Mínimo 8 caracteres', passed: password.length >= 8 },
    { id: 'uppercase', label: 'Al menos una letra mayúscula', passed: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'Al menos una letra minúscula', passed: /[a-z]/.test(password) },
    { id: 'number', label: 'Al menos un número', passed: /\d/.test(password) },
    { id: 'special', label: 'Al menos un símbolo o carácter especial', passed: /[^A-Za-z0-9\s]/.test(password) },
  ];

  const missing = checks.filter(item => !item.passed).map(item => item.label);
  const score = checks.filter(item => item.passed).length;

  let strength = 'Muy débil';
  if (score >= 5) strength = 'Muy fuerte';
  else if (score === 4) strength = 'Fuerte';
  else if (score === 3) strength = 'Media';
  else if (score === 2) strength = 'Débil';

  return {
    isValid: missing.length === 0,
    checks,
    missing,
    score,
    strength,
    message: missing.length
      ? `La contraseña no es válida. Faltan requisitos: ${missing.join(', ')}.`
      : '',
  };
}

// ─────────────────────────────────────────────────────────────
//  REGISTRO
// ─────────────────────────────────────────────────────────────
export async function registerUser({ name, email, age, password }) {

  if (!name || !email || !age || !password)
    return { ok: false, error: 'Completa todos los campos.' };

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid)
    return { ok: false, error: passwordValidation.message };

  // ── Modo FIREBASE REAL ──────────────────────────────────────
  if (USE_FIREBASE) {
    try {
      const auth = await getAuth();
      const { createUserWithEmailAndPassword, updateProfile } =
        await import(`${FB_CDN}/firebase-auth.js`);
      const { doc, setDoc } = await import(`${FB_CDN}/firebase-firestore.js`);

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      // Guardar datos extra (edad) en Firestore, ya que Firebase Auth
      // no tiene un campo nativo para eso. IMPORTANTE: esperamos a que
      // esto termine ANTES de resolver, para que cuando perfil.html
      // consulte Firestore los datos ya existan.
      try {
        await setDoc(doc(_sharedDb, 'users', user.uid), { name, email, age });
      } catch (e) {
        console.warn('[Egglish Auth] No se pudo guardar el perfil en Firestore:', e);
      }

      // Guardar caché local (solo para pintar rápido, no es la fuente de verdad)
      saveLocalSession({ uid: user.uid, name, email, age });
      return { ok: true };

    } catch (e) {
      console.error('[Egglish Auth] Error registro Firebase:', {
        code: e.code,
        message: e.message,
        emailIntentado: email,
      });
      return { ok: false, error: _firebaseError(e.code) };
    }
  }

  // ── Modo SIMULADO (localStorage) ───────────────────────────
  const users = _getUsers();
  if (users.find(u => u.email === email))
    return { ok: false, error: 'Este correo ya está registrado.' };

  const newUser = { uid: _uid(), name, email, age, password };
  users.push(newUser);
  _saveUsers(users);
  saveLocalSession({ uid: newUser.uid, name, email, age });
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
//  INICIO DE SESIÓN
// ─────────────────────────────────────────────────────────────
export async function loginUser({ email, password }) {

  if (!email || !password)
    return { ok: false, error: 'Ingresa tu correo y contraseña.' };

  // ── Modo FIREBASE REAL ──────────────────────────────────────
  if (USE_FIREBASE) {
    try {
      const auth = await getAuth();
      const { signInWithEmailAndPassword } =
        await import(`${FB_CDN}/firebase-auth.js`);

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // 🩹 Guardamos la caché local, pero OJO: esto puede NO llegar a
      // ejecutarse si la página ya navegó a perfil.html por culpa del
      // listener onAuthStateChanged (ver nota arriba). Por eso
      // Perfil.js YA NO depende de esto para decidir si hay sesión;
      // solo lo usa como caché opcional para pintar más rápido.
      saveLocalSession({
        uid:   user.uid,
        name:  user.displayName || email.split('@')[0],
        email: user.email,
        age:   null
      });
      return { ok: true };

    } catch (e) {
      // 🔍 DIAGNÓSTICO: deja esto activo hasta confirmar la causa real.
      // Firebase agrupa varios errores bajo 'auth/invalid-credential' por
      // seguridad, así que el código exacto es la única forma de saber
      // si el problema es el email, la contraseña, o la config del proyecto.
      console.error('[Egglish Auth] Error login Firebase:', {
        code: e.code,
        message: e.message,
        emailIntentado: email,
      });
      return { ok: false, error: _firebaseError(e.code) };
    }
  }

  // ── Modo SIMULADO ───────────────────────────────────────────
  const users = _getUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (!found)
    return { ok: false, error: 'Correo o contraseña incorrectos.' };

  saveLocalSession({ uid: found.uid, name: found.name, email: found.email, age: found.age });
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
//  CIERRE DE SESIÓN
// ─────────────────────────────────────────────────────────────
export async function logoutUser() {
  localStorage.removeItem(SESSION_KEY);

  if (USE_FIREBASE) {
    try {
      const { signOut } = await import(`${FB_CDN}/firebase-auth.js`);
      await signOut(_sharedAuth);
    } catch (e) {
      console.warn('[Egglish Auth] Error signOut:', e);
    }
  }

  window.location.href = '/index.html';
}

// ─────────────────────────────────────────────────────────────
//  DETECCIÓN DE SESIÓN (SOLO CACHÉ — no usar para proteger rutas)
// ─────────────────────────────────────────────────────────────
// ⚠️ Esta función lee localStorage, que es solo una caché para pintar
// rápido. NO la uses para decidir si redirigir a login: usa
// onAuthStateChanged(auth, ...) de Firebase, que es la fuente de verdad
// real (ver Perfil.js).
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return getSession() !== null;
}

export function saveLocalSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

// ─────────────────────────────────────────────────────────────
//  HELPERS PRIVADOS
// ─────────────────────────────────────────────────────────────
function _getUsers() {
  try { return JSON.parse(localStorage.getItem('egglish_users') || '[]'); }
  catch { return []; }
}

function _saveUsers(arr) {
  localStorage.setItem('egglish_users', JSON.stringify(arr));
}

function _uid() {
  return 'uid_' + Math.random().toString(36).slice(2, 10);
}

function _firebaseError(code) {
  const map = {
    'auth/email-already-in-use':    'Este correo ya está registrado.',
    'auth/invalid-email':           'El correo no es válido.',
    'auth/weak-password':           'La contraseña debe cumplir con los requisitos de seguridad.',
    'auth/user-not-found':          'No existe una cuenta con ese correo.',
    'auth/wrong-password':          'Contraseña incorrecta.',
    'auth/invalid-credential':      'Correo o contraseña incorrectos.',
    'auth/too-many-requests':       'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed':  'Sin conexión. Revisa tu internet.',
    'auth/operation-not-allowed':   'Método de login no habilitado en Firebase.',
  };
  return map[code] || `Error: ${code}. Intenta de nuevo.`;
}