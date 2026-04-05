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
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector(".nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", () => {
    const btnEntrar = document.getElementById("btn-entrar");
    const btnRegistro = document.getElementById("btn-registro");
    const authToggle = document.getElementById("auth-toggle");
    const bubbleText = document.getElementById("bubble-text");
    const avatarIcon = document.getElementById("avatar-icon");
    const submitBtn = document.getElementById("submit-btn");
    const nameFieldWrapper = document.getElementById("name-field-wrapper");
    const form = document.getElementById("auth-form");
    const modal = document.getElementById("reset-password-modal");
    const btnForgotPassword = document.getElementById("btn-forgot-password");
    const btnCloseModal = document.getElementById("btn-close-modal");
    const btnSendReset = document.getElementById("btn-send-reset");
    
    // Nueva constante para el contenedor que tiene el espacio y el botón
    const containerForgot = document.getElementById("container-forgot");

    let isLogin = true;

    function switchMode(mode) {
        if ((mode === 'entrar' && isLogin) || (mode === 'registro' && !isLogin)) return;

        bubbleText.style.opacity = '0';
        avatarIcon.style.opacity = '0';
        avatarIcon.style.transform = 'scale(0.8)';
        submitBtn.style.opacity = '0';

        setTimeout(() => {
            if (mode === 'entrar') {
                isLogin = true;
                authToggle.classList.remove("right");
                btnEntrar.classList.add("active");
                btnRegistro.classList.remove("active");
                bubbleText.textContent = "¡Qué bueno verte de nuevo!";
                avatarIcon.textContent = "🐥";
                submitBtn.textContent = "Comenzar a aprender";
                nameFieldWrapper.classList.remove("show");
                
                // MUESTRA el botón de recuperar contraseña
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
                
                // OCULTA el botón de recuperar contraseña
                if (containerForgot) containerForgot.style.display = 'none';
            }

            bubbleText.style.opacity = '1';
            avatarIcon.style.opacity = '1';
            avatarIcon.style.transform = 'scale(1)';
            submitBtn.style.opacity = '1';
        }, 200); 
    }

    btnEntrar.addEventListener("click", () => switchMode('entrar'));
    btnRegistro.addEventListener("click", () => switchMode('registro'));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("correo").value;
        const password = document.getElementById("password").value;

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Sesión iniciada correctamente");
            } else {
                const name = document.getElementById("nombre").value;
                await createUserWithEmailAndPassword(auth, email, password);
                alert(`Cuenta creada para ${name || email}`);
            }
        } catch (error) {
            alert(error.message);
        }
    });

    btnForgotPassword.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("show");
    });

    btnCloseModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    btnSendReset.addEventListener("click", async () => {
        const email = document.getElementById("reset-email").value;
        if (email) {
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Enlace enviado. Revisa tu bandeja de entrada.");
                modal.classList.remove("show");
            } catch (error) {
                alert(error.message);
            }
        } else {
            alert("Por favor ingresa un correo electrónico.");
        }
    });
});