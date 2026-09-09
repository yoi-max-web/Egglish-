/* ================================================================
   EGGLISH — Sincronización de progreso real con Firebase
   Usado por Lecciones, Escucha y Juegos para reportar, cada vez que
   el usuario interactúa de verdad con un ejercicio, sus puntos (exp),
   su racha y el contador específico de esa sección. Perfil.js solo
   LEE estos campos; este módulo es el único que los escribe.
================================================================ */
import { auth, db } from '/Secciones/Js/firebase-config.js';
import { doc, getDoc, setDoc, increment } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const SESSION_KEY = 'egglish_session';

/**
 * Devuelve el uid del usuario actual, esperando si hace falta a que
 * Firebase Auth termine de restaurar la sesión.
 *
 * ¿Por qué? Auth.currentUser es SÍNCRONO, pero Firebase tarda un
 * instante en restaurar la sesión guardada (revisa IndexedDB/local
 * storage). En páginas como lecciones.html o juegos.html, donde
 * Firebase recién se toca por primera vez cuando el usuario termina
 * la actividad, auth.currentUser casi siempre llega como null en ese
 * momento aunque el usuario SÍ esté logueado — y como antes no se
 * esperaba nada, el progreso se perdía en silencio. Ahora, si no hay
 * usuario disponible al instante, esperamos al primer aviso real de
 * onAuthStateChanged (con un margen de 4s por si algo falla).
 */
function getUid() {
  return new Promise((resolve) => {
    if (auth.currentUser) { resolve(auth.currentUser.uid); return; }

    let resolved = false;
    let unsubscribe = () => {};

    const finish = (uid) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      unsubscribe();
      resolve(uid);
    };

    unsubscribe = onAuthStateChanged(auth, (user) => {
      finish(user ? user.uid : null);
    });

    // Si Firebase no responde a tiempo, no escribimos con una identidad
    // antigua que pudiera haber quedado en localStorage.
    const timer = setTimeout(() => finish(null), 4000);
  });
}

/** Calcula la nueva racha comparando fechas de calendario (no horas exactas),
 *  para que practicar en cualquier momento del "mismo día" cuente como un
 *  único día de racha, sin duplicar el conteo. */
function calcularNuevaRacha(prevRacha, prevUltimaActividadISO) {
  if (!prevUltimaActividadISO) return 1;
  const prevDate = new Date(prevUltimaActividadISO);
  if (isNaN(prevDate.getTime())) return 1;

  const prevDay = prevDate.toDateString();
  const todayDay = new Date().toDateString();
  if (prevDay === todayDay) return prevRacha || 1; // ya se practicó hoy

  const yesterdayDay = new Date(Date.now() - 86400000).toDateString();
  return prevDay === yesterdayDay ? (prevRacha || 0) + 1 : 1;
}

function sincronizarCacheLocal({ exp, campo, incremento, racha }) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    if (!session?.uid || session.uid !== auth.currentUser?.uid) return;
    session.exp = (session.exp || 0) + exp;
    session.racha = racha;
    session.ultimaActividad = new Date().toISOString();
    if (campo) session[campo] = (session[campo] || 0) + incremento;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* almacenamiento no disponible, no es crítico */ }
}

/**
 * Registra progreso real del usuario en Firestore.
 * @param {Object}  opts
 * @param {number}  opts.exp          Puntos ganados en ESTA actividad (no acumulado histórico).
 * @param {string} [opts.campo]       'leccionesCompletadas' | 'escuchaCompletados' | 'juegosGanados'.
 * @param {number} [opts.incremento]  Cuánto sumar a `campo` (por defecto 1).
 * @returns {Promise<boolean>} true si se sincronizó con Firebase.
 */
export async function registrarProgreso({ exp = 0, campo = null, incremento = 1 } = {}) {
  const uid = await getUid();
  if (!uid) {
    console.warn('Egglish: no se pudo identificar al usuario (Auth no respondió a tiempo); el progreso no se guardó.');
    return false;
  }

  const userRef = doc(db, 'users', uid);
  let racha = 1;

  try {
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : {};
    racha = calcularNuevaRacha(data.racha || 0, data.ultimaActividad || null);
  } catch (e) {
    console.warn('No se pudo leer el progreso previo del usuario:', e);
  }

  const updates = {
    exp: increment(exp),
    racha,
    ultimaActividad: new Date().toISOString(),
  };
  if (campo && incremento) updates[campo] = increment(incremento);

  try {
    // setDoc con merge crea el documento si aún no existe (evita el
    // error "No document to update" de updateDoc en usuarios nuevos)
    // y lo actualiza normalmente si ya existe.
    await setDoc(userRef, updates, { merge: true });
  } catch (e) {
    console.warn('No se pudo guardar el progreso en Firebase:', e);
    return false;
  }

  sincronizarCacheLocal({ exp, campo, incremento, racha });
  return true;
}