// ============================================================
//  Secciones/Js/firebase-config.js
//  ✅ Versión para navegador puro (sin Node/Webpack/Vite)
//     Usa CDN oficial de Firebase con import maps
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

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