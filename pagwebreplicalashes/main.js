/**
 * NORIS LASHES - SCRIPT PRINCIPAL
 * ==============================
 * Este archivo contiene la inteligencia del sitio web.
 * Controla: Modo oscuro, Slider de fotos y Menu movil.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOMContentLoaded significa: "Esperar a que el HTML termine de cargar"
    
    // --- 1. MODO OSCURO (Dark Mode) ---
    // Buscamos el boton por su ID
    const themeToggle = document.getElementById('theme-toggle');
    // Verificamos si el usuario ya habia elegido un tema antes
    const storedTheme = localStorage.getItem('theme');
    // Verificamos si la computadora del usuario prefiere modo oscuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aplicar tema inicial
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Escuchar click en el boton para cambiar tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Cambiar atributo en HTML y guardar preferencia
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }

    // --- 2. HERO SLIDER (Carrusel de fotos) ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Cambiar cada 5000ms (5 segundos)

    function nextSlide() {
        if (!slides.length) return;
        
        // Quitamos la clase 'active' de la foto actual
        slides[currentSlide].classList.remove('active');
        // Calculamos cual es la siguiente (usando modulo % para volver al 0)
        currentSlide = (currentSlide + 1) % slides.length;
        // Le ponemos 'active' a la nueva foto
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // --- 3. MENU MOVIL (Hamburguesa) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.main-navigation');

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            // .toggle() agrega la clase si no esta, y la quita si esta
            navigation.classList.toggle('toggled');
            
            // Actualizar accesibilidad (aria-expanded)
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
        
        // Cerrar menu al hacer click en un enlace
        document.querySelectorAll('.main-navigation a').forEach(link => {
            link.addEventListener('click', () => {
                navigation.classList.remove('toggled');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 4. SCROLL SUAVE (Smooth Scroll) ---
    // Atrapamos todos los clicks en enlaces internos (#)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Evitar salto brusco
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Deslizar suavemente
                });
            }
        });
    });

    // --- 5. EFECTO HEADER AL SCROLLEAR ---
    const header = document.getElementById('masthead');
    window.addEventListener('scroll', () => {
        // Si bajamos mas de 50px, agregamos clase 'scrolled'
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Revelar cuerpo (Efecto Fade In al cargar)
    document.body.classList.add('loaded');
});
