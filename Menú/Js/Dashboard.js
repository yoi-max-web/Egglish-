document.addEventListener('DOMContentLoaded', () => {
    // 1. LÓGICA DEL MENÚ HAMBURGUESA
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    // Verificamos que el botón exista antes de asignarle el evento
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animación de las rayitas (spans)
            const spans = menuToggle.querySelectorAll('span');
            if(navLinks.classList.contains('active')) {
                if(spans.length >= 3) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                }
            } else {
                if(spans.length >= 3) {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }

    // 2. LÓGICA DEL LOGO (EL HACK DEL CLICK)
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            // Ruta para salir de /Menú/Htmls/ y llegar a index.html
            window.location.href = '../../index.html';
        });
    }

    // 3. ANIMACIÓN DE LA BARRA DE PROGRESO
    const progressFill = document.querySelector('.progress-fill');
    if(progressFill) {
        const finalWidth = progressFill.style.width || '65%';
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.width = finalWidth;
        }, 300);
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdclYmiTP3f22TWtilK_CefP6NQd4LAV4",
  authDomain: "egglish-55341.firebaseapp.com",
  projectId: "egglish-55341",
  storageBucket: "egglish-55341.firebasestorage.app",
  messagingSenderId: "450881410114",
  appId: "1:450881410114:web:964a56f3addd6f4fbb49db",
  measurementId: "G-Y9KGFBNJF5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// PROTECCIÓN DE RUTA: Verifica que el usuario tenga permiso de estar aquí
onAuthStateChanged(auth, (user) => {
    if (user) {
        // El objeto user.uid está disponible para tus consultas de Firestore
        console.log("Acceso concedido para UID:", user.uid);
        
        const greeting = document.getElementById("user-greeting");
        if (greeting) {
            greeting.textContent = `¡Hola, ${user.email.split('@')[0]}!`;
        }
    } else {
        // Bloqueo: Si intenta entrar por URL directa sin loguearse, lo expulsa
        window.location.href = "Log-sign-on-up.html";
    }
});