<?php
/**
 * Noris Sales Agent - WordPress Integration
 * 
 * Copia este código en el archivo functions.php de tu tema activo (ej: wp-content/themes/astra/functions.php).
 * Asegurate de subir también la carpeta 'booking_agent' a la raíz de tu tema.
 */

function cargar_agente_ventas() {
    // 1. Estilos CSS del Agente
    wp_enqueue_style(
        'agent-css', 
        get_template_directory_uri() . '/booking_agent/agent-style.css',
        array(), 
        '1.0.0'
    );

    // 2. Datos (Servicios/Horarios) - Debe cargarse ANTES del core
    wp_enqueue_script(
        'agent-data', 
        get_template_directory_uri() . '/booking_agent/agent-data.js', 
        array(), 
        '1.0.0', 
        true // Cargar en el footer
    );

    // 3. Cerebro del Agente (Core) - Depende de agent-data
    wp_enqueue_script(
        'agent-core', 
        get_template_directory_uri() . '/booking_agent/agent-core.js', 
        array('agent-data'), 
        '1.0.0', 
        true // Cargar en el footer
    );
}

// Hook para inyectar los scripts en el sitio
add_action('wp_enqueue_scripts', 'cargar_agente_ventas');
