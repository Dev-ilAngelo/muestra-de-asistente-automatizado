/**
 * Agent Data Source
 * Mock Database for Services and Availability Logic
 */

const AGENT_DATA = {
    services: [
        { id: 'lifting', name: 'Lifting de Pestañas', price: 20000, duration: 60 },
        { id: 'perfilado', name: 'Perfilado de Cejas', price: 14000, duration: 30 },
        { id: 'pelo_x_pelo', name: 'Pestañas Pelo x Pelo', price: 24000, duration: 90 },
        { id: 'volumen_ruso', name: 'Volumen Ruso', price: 28000, duration: 120 },
        { id: 'mega_volumen', name: 'Mega Volumen', price: 30000, duration: 150 }
    ],
    
    // Simulate API call to check availability
    getSlots: function(date) {
        // Logic to generate realistic looking slots based on input date
        // In a real app, this would fetch from Google Calendar / Setmore API
        
        const day = new Date(date).getDay();
        
        // Closed on Sundays (0)
        if (day === 0) return []; 

        const slots = [
            '10:00', '11:30', '14:00', '16:00', '17:30', '19:00'
        ];

        // Randomly remove some slots to simulate "busy" days
        return slots.filter(() => Math.random() > 0.3);
    }
};
