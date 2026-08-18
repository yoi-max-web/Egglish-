// ============================================================
//  Secciones/Js/firebase-config.js
//  ✅ Versión para navegador puro (sin Node/Webpack/Vite)
//     Usa CDN oficial de Firebase con import maps
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export const USE_FIREBASE = true;

export const firebaseConfig = {
  apiKey:            "AIzaSyDdclYmiTP3f22TWtilK_CefP6NQd4LAV4",
  authDomain:        "egglish-55341.firebaseapp.com",
  projectId:         "egglish-55341",
  storageBucket:     "egglish-55341.firebasestorage.app",
  messagingSenderId: "450881410114",
  appId:             "1:450881410114:web:964a56f3addd6f4fbb49db"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Actualiza estadísticas de forma segura y atómica en Firestore.
 * @param {string} uid - ID del usuario.
 * @param {object} stats - Objeto con los campos a incrementar (ej: { exp: 50, medallas: 1 }).
 */
export async function updateUserStats(uid, stats) {
    if (!uid) return;
    
    const userRef = doc(db, 'users', uid);
    const updates = {};
    for (const key in stats) {
        updates[key] = increment(stats[key]);
    }

    try {
        await updateDoc(userRef, updates);
        console.log("Estadísticas actualizadas correctamente en Firestore.");
    } catch (e) {
        console.error("Error al actualizar estadísticas:", e);
    }
}