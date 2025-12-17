/**
 * ==========================================
 * SLIDER.JS - Carrusel de Imágenes del Hero
 * ==========================================
 * Este archivo hace que las imágenes del hero (sección principal)
 * cambien automáticamente cada 5 segundos.
 */

// Esperar a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== BUSCAR TODAS LAS IMÁGENES DEL SLIDER =====
    // Encontrar todos los elementos con clase 'slide' dentro del slider
    const slides = document.querySelectorAll('.hero-slider .slide');
    
    // Variable para saber cuál imagen está mostrándose ahora
    let currentSlide = 0;
    
    // Cada cuántos milisegundos cambiar de imagen (5000 = 5 segundos)
    const slideInterval = 5000;

    /**
     * Función para cambiar a la siguiente imagen
     */
    function nextSlide() {
        // Quitar la clase 'active' de la imagen actual (la esconde)
        slides[currentSlide].classList.remove('active');
        
        // Calcular cuál es la siguiente imagen
        // El símbolo % hace que vuelva al principio cuando llega al final
        // Ejemplo: si hay 5 imágenes (0,1,2,3,4), después de 4 vuelve a 0
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Añadir clase 'active' a la nueva imagen (la muestra)
        slides[currentSlide].classList.add('active');
    }

    // ===== INICIAR EL CARRUSEL AUTOMÁTICO =====
    // Solo si hay imágenes disponibles
    if (slides.length > 0) {
        // Ejecutar la función nextSlide cada X milisegundos
        setInterval(nextSlide, slideInterval);
    }
});
