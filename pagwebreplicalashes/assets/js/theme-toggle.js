/**
 * ==========================================
 * THEME-TOGGLE.JS - Cambio de Modo Claro/Oscuro
 * ==========================================
 * Este archivo controla el botón que cambia entre modo claro y oscuro.
 * Guarda la preferencia del usuario para que se mantenga entre visitas.
 */

// Esperar a que la página cargue completamente antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // 1. Initial Load: Check localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Optional: Check system preference
        /*
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
        }
        */
        // Default to light as per theme request
        htmlElement.setAttribute('data-theme', 'light');
    }
    
    // 2. Event Listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Dispatch event for other scripts if needed
            window.dispatchEvent(new Event('themeChanged'));
        });
    } else {
        console.warn('Theme Toggle button not found.');
    }
});
