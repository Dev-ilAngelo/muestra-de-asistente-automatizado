/**
 * ==========================================
 * HEADER-SCROLL.JS - Auto-Ocultar Header
 * ==========================================
 * Este archivo hace que el header se esconda cuando scrolleas hacia abajo
 * y vuelva a aparecer cuando scrolleas hacia arriba.
 * Funciona en escritorio y móvil.
 */

// Esperar a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // 🔍 DEBUG: Verificar que el script se está ejecutando
    console.log("🔍 DEBUG: header-scroll.js iniciado");
    
    // ===== VARIABLES =====
    // Guardar la última posición del scroll
    let lastScrollTop = 0;
    
    // Buscar el header en la página
    const header = document.querySelector('.site-header');
    console.log("🔍 DEBUG: Header encontrado:", header);
    
    // Si el header no existe, mostrar error y detener
    if (!header) {
        console.error("❌ ERROR: No se encontró el header con clase '.site-header'");
        return;
    }
    
    // Cuántos píxeles hay que scrollear antes de que se esconda el header
    let scrollThreshold = 50;
    console.log("🔍 DEBUG: Umbral de scroll configurado en:", scrollThreshold, "px");
    
    // ===== DETECTAR CUANDO EL USUARIO HACE SCROLL =====
    window.addEventListener('scroll', function() {
        
        // Obtener la posición actual del scroll
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // --- CASO 1: Estás en la parte superior de la página ---
        // Si estás a menos de 10px del top, SIEMPRE mostrar el header
        if (scrollTop <= 10) {
            header.style.transform = 'translateY(0)'; // Mostrar header
            header.style.transition = 'transform 0.3s ease'; // Animación suave
            console.log("📍 DEBUG: En la parte superior - Header visible");
        }
        
        // --- CASO 2: Estás scrolleando HACIA ABAJO ---
        // Si bajaste más que la última vez Y pasaste el umbral mínimo
        else if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            header.style.transform = 'translateY(-100%)'; // Esconder header hacia arriba
            header.style.transition = 'transform 0.3s ease'; // Animación suave
            console.log("⬇️ DEBUG: Scrolleando ABAJO - Header OCULTO (scroll:", scrollTop, "px)");
        }
        
        // --- CASO 3: Estás scrolleando HACIA ARRIBA ---
        // Si subiste comparado con la última posición
        else if (scrollTop < lastScrollTop) {
            header.style.transform = 'translateY(0)'; // Mostrar header
            header.style.transition = 'transform 0.3s ease'; // Animación suave
            console.log("⬆️ DEBUG: Scrolleando ARRIBA - Header VISIBLE (scroll:", scrollTop, "px)");
        }
        
        // Guardar la posición actual para la próxima comparación
        lastScrollTop = scrollTop;
    });
    
    console.log("✅ DEBUG: header-scroll.js configurado correctamente");
});
