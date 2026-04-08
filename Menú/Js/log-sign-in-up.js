

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
    // --- LÓGICA DEL MENÚ HAMBURGUESA CON ANIMACIÓN DE X ---
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            
            // ANIMACIÓN IGUAL AL DASHBOARD
            const spans = menuToggle.querySelectorAll('span');
            if(nav.classList.contains('active')) {
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
    const btnEntrar = document.getElementById("btn-entrar");
    const btnRegistro = document.getElementById("btn-registro");
    const authToggle = document.getElementById("auth-toggle");
    const bubbleText = document.getElementById("bubble-text");
    const avatarIcon = document.getElementById("avatar-icon");
    const submitBtn = document.getElementById("submit-btn");
    const nameFieldWrapper = document.getElementById("name-field-wrapper");
    const form = document.getElementById("auth-form");
    const containerForgot = document.getElementById("container-forgot");
    const modal = document.getElementById("reset-password-modal");
    const btnForgotPassword = document.getElementById("btn-forgot-password");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnSendReset = document.getElementById("btn-send-reset");

    let isLogin = true;

    function switchMode(mode) {
        if ((mode === 'entrar' && isLogin) || (mode === 'registro' && !isLogin)) return;
        if (mode === 'entrar') {
            isLogin = true;
            authToggle.classList.remove("right");
            btnEntrar.classList.add("active");
            btnRegistro.classList.remove("active");
            bubbleText.textContent = "¡Qué bueno verte de nuevo!";
            avatarIcon.textContent = "🐥";
            submitBtn.textContent = "Comenzar a aprender";
            nameFieldWrapper.classList.remove("show");
            if (containerForgot) containerForgot.style.display = 'block';
        } else {
            isLogin = false;
            authToggle.classList.add("right");
            btnRegistro.classList.add("active");
            btnEntrar.classList.remove("active");
            bubbleText.textContent = "¡Empecemos tu aventura!";
            avatarIcon.textContent = "🥚";
            submitBtn.textContent = "Crear mi cuenta gratis";
            nameFieldWrapper.classList.add("show");
            if (containerForgot) containerForgot.style.display = 'none';
        }
    }

    btnEntrar.addEventListener("click", () => switchMode('entrar'));
    btnRegistro.addEventListener("click", () => switchMode('registro'));

    // Lógica principal de clic en el botón de envío
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        try {
            if (isLogin) {
                // 1. Intentar inicio de sesión
                await signInWithEmailAndPassword(auth, email, password);
                alert("Sesión iniciada correctamente");
                // 2. Redirección manual tras éxito
                window.location.href = "Dashboard.html";
            } else {
                // 1. Intentar registro
                const name = document.getElementById("nombre").value;
                await createUserWithEmailAndPassword(auth, email, password);
                alert(`¡Bienvenido ${name || email}!`);
                // 2. Redirección manual tras éxito
                window.location.href = "Dashboard.html";
            }
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // Recuperación de contraseña (sin cambios)
    btnForgotPassword.addEventListener("click", (e) => { e.preventDefault(); modal.classList.add("show"); });
    btnCloseModal.addEventListener("click", () => modal.classList.remove("show"));
    btnSendReset.addEventListener("click", async () => {
        const email = document.getElementById("reset-email").value;
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Enlace enviado.");
                modal.classList.remove("show");
            } catch (error) { alert(error.message); }
        }
    });
});