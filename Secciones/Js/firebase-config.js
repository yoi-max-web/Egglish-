// ============================================================
//  Secciones/Js/firebase-config.js
//  ✅ Versión para navegador puro (sin Node/Webpack/Vite)
//     Usa CDN oficial de Firebase con import maps
//  🔧 CORREGIDO: "10.x.x" no es una versión real del CDN de
//     Firebase (eso rompía los imports). Se fija a 10.12.2,
//     la misma versión que ya usaba Perfil.js para signOut.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const USE_FIREBASE = true;

export const firebaseConfig = {
  apiKey:            "AIzaSyBOAEgDwFjdqnUgZoPrkrhfEazGAn6bEos",
  authDomain:        "egglish-81d65.firebaseapp.com",
  projectId:         "egglish-81d65",
  storageBucket:     "egglish-81d65.firebasestorage.app",
  messagingSenderId: "130716951695",
  appId:             "1:130716951695:web:0e0eb31e28bc31f8bd3cfa"
};

// Inicializa Firebase y exporta Auth y Firestore (db)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);