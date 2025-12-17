/**
 * Agent Core System - Logic V2
 * Includes State Machine for Booking Flow
 */

document.addEventListener('DOMContentLoaded', () => {
    window.AgentSystem.init();
});

window.AgentSystem = {
    state: {
        step: 'IDLE', // IDLE, SERVICE_SELECTION, DATE_SELECTION, TIME_SELECTION, CONFIRMATION
        voiceEnabled: false,
        booking: {
            service: null,
            date: null,
            time: null
        }
    },

    init: function() {
        this.injectAgentHTML();
        this.setupEventListeners();
        
        // MARKETING ENGINE: Check if user is returning
        const retentionMsg = this.checkRetention();
        
        // Auto-open greeting
        setTimeout(() => {
            const chat = document.getElementById('agentWindow');
            if (!chat.classList.contains('open')) {
                // If retention triggered, force open with special message
                if(retentionMsg) {
                    this.dom.window.classList.add('open');
                    this.addMessage(retentionMsg);
                } else {
                    // Standard greeting handled by HTML or generic init
                }
            }
            
            // Auto-hide Voice Promo after 10 seconds to avoid annoyance
            setTimeout(() => {
                const promo = document.getElementById('voicePromo');
                if(promo) promo.style.display = 'none';
            }, 10000);
            
        }, 3000);
    },

    checkRetention: function() {
        const lastVisit = localStorage.getItem('agent_last_visit');
        const now = Date.now();
        const daysDiff = lastVisit ? (now - lastVisit) / (1000 * 60 * 60 * 24) : 0;
        
        // Save current visit
        localStorage.setItem('agent_last_visit', now);

        if (daysDiff > 21) {
            return "👋 ¡Hola de nuevo! Hace más de 3 semanas que no te veíamos. ¿Te gustaría agendar un **Service** para mantener tu mirada divina? Tenemos un descuento especial para vos. 💖";
        }
        return null;
    },

    injectAgentHTML: function() {
        // ... (Same HTML structure as before) ...
        const agentHTML = `
            <div class="agent-fab" id="agentFab">
                <span class="agent-fab-label">¿Necesitás asistencia? 🤖</span>
                <!-- Robot Icon -->
                <svg viewBox="0 0 24 24"><path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" /></svg>
            </div>
            
            <div class="agent-window" id="agentWindow">
                <div class="agent-header">
                    <div class="agent-title">
                        <h4>Asistente Noris 🤖</h4>
                        <span>● En línea</span>
                    </div>
                    <div>
                        <button class="agent-close" id="agentSound" title="Activar/Desactivar Voz" style="margin-right: 10px; font-size: 1rem;">🔈</button>
                        <button class="agent-close" id="agentClose">×</button>
                    </div>
                </div>
                <div class="agent-messages" id="agentMessages">
                    <div class="message bot">
                        Hola ✨ soy el asistente virtual de Noris Lashes. 
                        <br>¿Te gustaría agendar un turno o ver la lista de precios?
                    </div>
                     <div class="agent-options">
                        <div class="agent-chip" onclick="window.AgentSystem.handleOption('agendar')">📅 Quiero un turno</div>
                        <div class="agent-chip" onclick="window.AgentSystem.handleOption('precios')">💎 Ver Precios</div>
                    </div>
                </div>
                <div class="agent-input-area">
                    <input type="text" id="agentInput" placeholder="Escribe un mensaje..." onkeypress="window.AgentSystem.handleInput(event)">
                    <!-- Voice Mode Button -->
                    <button id="agentVoice" onclick="window.AgentSystem.handleVoice()" style="margin-right:5px; background: #333;" title="Hablar con IA">🎙️</button>
                    <button id="agentSend" onclick="window.AgentSystem.handleSend()">➤</button>
                </div>
                
                <!-- Voice Promo Hint -->
                <div class="voice-promo" id="voicePromo">
                    📞 ¡Nuevo! Probá la asistencia por voz
                    <span class="promo-close" onclick="document.getElementById('voicePromo').style.display='none'">×</span>
                </div>
            </div>
        `;

        // Inject styles
        if(!document.querySelector('link[href*="agent-style.css"]')){
             const link = document.createElement('link');
             link.rel = 'stylesheet';
             link.href = './booking_agent/agent-style.css';
             document.head.appendChild(link);
        }


        const container = document.createElement('div');
        container.id = 'agent-root';
        container.innerHTML = agentHTML;
        document.body.appendChild(container);

        this.cacheDOM();
    },

    cacheDOM: function() {
        this.dom = {
            fab: document.getElementById('agentFab'),
            window: document.getElementById('agentWindow'),
            close: document.getElementById('agentClose'),
            sound: document.getElementById('agentSound'), // New
            messages: document.getElementById('agentMessages'),
            input: document.getElementById('agentInput')
        };
    },

    setupEventListeners: function() {
        if (!this.dom) return;
        
        this.dom.fab.addEventListener('click', () => {
            this.dom.window.classList.add('open');
            this.dom.fab.style.transform = 'scale(0)';
        });

        this.dom.close.addEventListener('click', () => {
            this.dom.window.classList.remove('open');
            this.dom.fab.style.transform = 'scale(1)';
        });

        // TTS Toggle
        this.dom.sound.addEventListener('click', () => {
            this.state.voiceEnabled = !this.state.voiceEnabled;
            this.dom.sound.innerText = this.state.voiceEnabled ? '🔊' : '🔈';
            // Welcome speak if enabling
            if(this.state.voiceEnabled) this.speak("Voz activada. ¿En qué te ayudo?");
        });
    },

    speak: function(text) {
        if (!this.state.voiceEnabled || !window.speechSynthesis) return;
        // Clean text (remove HTML tags)
        const cleanText = text.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES'; // Spanish
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
    },

    addMessage: function(text, type = 'bot') {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        div.innerHTML = text;
        this.dom.messages.appendChild(div);
        this.scrollToBottom();
        
        // Speak if bot
        if (type === 'bot') this.speak(text);
    },

    addOptions: function(options) {
        const div = document.createElement('div');
        div.className = 'agent-options';
        
        options.forEach(opt => {
            const chip = document.createElement('div');
            chip.className = 'agent-chip';
            chip.innerText = opt.label;
            chip.onclick = () => this.handleOption(opt.value, opt.label);
            div.appendChild(chip);
        });
        
        this.dom.messages.appendChild(div);
        this.scrollToBottom();
    },

    showTyping: function() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'typing-indicator';
        div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        this.dom.messages.appendChild(div);
        this.scrollToBottom();
        return id;
    },

    removeTyping: function(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    scrollToBottom: function() {
        this.dom.messages.scrollTop = this.dom.messages.scrollHeight;
    },

    // --- LOGIC FLOW ---

    handleInput: function(e) {
        if (e.key === 'Enter') this.handleSend();
    },

    handleVoice: function() {
        // Hide Promo
        const promo = document.getElementById('voicePromo');
        if(promo) promo.style.display = 'none';

        // Mock Voice Interface
        const btn = document.getElementById('agentVoice');
        btn.style.color = 'red';
        btn.classList.add('pulse'); // You might need to add this class to CSS
        
        this.addMessage("🎙️ <i>Escuchando...</i>", 'bot');
        
        setTimeout(() => {
            btn.style.color = 'white';
            const responses = ["Quiero un turno para mañana", "Consultar precios", "¿Tienen disponibilidad hoy?"];
            const randomInput = responses[Math.floor(Math.random() * responses.length)];
            
            this.addMessage(`"${randomInput}"`, 'user');
            this.processUserInput(randomInput);
        }, 2000);
    },

    handleSend: function() {
        const text = this.dom.input.value.trim();
        if (!text) return;
        
        this.addMessage(text, 'user');
        this.dom.input.value = '';
        
        // Simple NLP simulation
        this.processUserInput(text);
    },

    handleOption: function(value, label) {
        // Visual feedback
        this.addMessage(label || value, 'user');
        // Remove old options interaction? (Optional, keeping simple fore now)
        this.processFlow(value);
    },

    processUserInput: function(text) {
        const lower = text.toLowerCase();
        
        // Basic intent detection
        if (lower.includes('turno') || lower.includes('reserva') || lower.includes('cita')) {
            this.processFlow('agendar');
        } else if (lower.includes('precio') || lower.includes('cuanto')) {
            this.processFlow('precios');
        } else if (lower.includes('gracias') || lower.includes('chau')) {
             this.simulateBotResponse("¡De nada! Estoy aquí si necesitas algo más para tu mirada. ✨");
        } else {
            this.simulateBotResponse("Entendido. Para ayudarte mejor, ¿preferís ver nuestros servicios o hablar con un humano por WhatsApp?", [
                { label: 'Ver Servicios', value: 'agendar' },
                { label: 'WhatsApp', value: 'whatsapp' }
            ]);
        }
    },

    processFlow: function(action) {
        const typingId = this.showTyping();

        setTimeout(() => {
            this.removeTyping(typingId);
            
            switch (action) {
                case 'agendar':
                    this.state.step = 'SERVICE_SELECTION';
                    this.addMessage("¡Genial! Vamos a reservarte un momento de relax. ¿Qué servicio te gustaría realizarte?");
                    // Load services from DATA
                    const services = AGENT_DATA.services.map(s => ({
                        label: `${s.name} ($${s.price})`,
                        value: `service_${s.id}`
                    }));
                    this.addOptions(services);
                    break;

                case 'precios':
                    this.addMessage("Aquí tienes nuestra lista de precios actualizada. Si te interesa alguno, solo dime.");
                    // Could show an image or text list. For now, simple text.
                    this.addMessage("Lifting: $20k | Pelo x Pelo: $24k | Volumen: $28k");
                    this.addOptions([{ label: 'Agendar ahora', value: 'agendar' }]);
                    break;
                
                case 'whatsapp':
                    window.open('https://wa.me/5491100000000', '_blank'); // Replace with real number
                    this.addMessage("Te he abierto el chat de WhatsApp en otra ventana.");
                    break;
                
                default:
                    if (action.startsWith('service_')) {
                        const serviceId = action.replace('service_', '');
                        this.state.booking.service = AGENT_DATA.services.find(s => s.id === serviceId);
                        this.state.step = 'DATE_SELECTION';
                        this.addMessage(`¡Excelente elección! **${this.state.booking.service.name}**. ¿Para cuándo te gustaría buscar turno?`);
                        this.addOptions([
                            { label: 'Hoy', value: 'date_today' },
                            { label: 'Mañana', value: 'date_tomorrow' },
                            { label: 'Elegir otra fecha', value: 'date_pick' }
                        ]);
                    } else if (action.startsWith('date_')) {
                        // Simulation of date picking
                        let dateText = "hoy";
                        if (action === 'date_tomorrow') dateText = "mañana";
                        
                        this.state.step = 'TIME_SELECTION';
                        this.addMessage(`Buscando disponibilidad para ${dateText}...`);
                        
                        setTimeout(() => {
                            const slots = AGENT_DATA.getSlots(new Date()); // Always get slots for now
                            if (slots.length > 0) {
                                this.addMessage("Encontré estos horarios disponibles:");
                                const timeOpts = slots.map(t => ({ label: t, value: `time_${t}` }));
                                this.addOptions(timeOpts);
                            } else {
                                this.addMessage("Ups, parece que para hoy estamos llenos. ¿Probamos otra fecha?");
                                this.addOptions([{ label: 'Ver mañana', value: 'date_tomorrow' }]);
                            }
                        }, 1000);
                    } else if (action.startsWith('time_')) {
                         const time = action.replace('time_', '');
                         this.state.booking.time = time;
                         this.state.step = 'CONFIRMATION';
                         this.addMessage(`Perfecto. Resumen de tu turno:
                         <br>• Servicio: <b>${this.state.booking.service.name}</b>
                         <br>• Horario: <b>${time} horas</b>
                         <br>• Precio: <b>$${this.state.booking.service.price}</b>
                         <br><br>¿Confirmo la reserva?`);
                         
                         this.addOptions([
                             { label: '✅ Sí, confirmar', value: 'confirm_yes' },
                             { label: '❌ Cancelar', value: 'confirm_no' }
                         ]);
                    } else if (action === 'confirm_yes') {
                        // PHASE 3 TRIGGER will go here
                        this.addMessage("¡Tu turno está casi listo! 🥳");
                        this.addMessage("Para asegurar tu lugar, necesitamos una pequeña seña. Te genero el link de pago...");
                        
                        // Fake Payment Link generation
                        setTimeout(() => {
                            this.addMessage(`<a href="#" class="agent-chip" style="background:#009ee3;color:white;text-align:center;display:block;">Pagar Seña con Mercado Pago</a>`);
                            this.addMessage("Una vez abonado, te llegará la confirmación por WhatsApp.");
                        }, 1500);

                    } else if (action === 'confirm_no') {
                        this.addMessage("Entendido, operación cancelada. Avísame cuando quieras retomar.");
                        this.init(); // Reset or just wait
                    }
                    break;
            }
        }, 800);
    },

    simulateBotResponse: function(text, options = []) {
        const typingId = this.showTyping();
        setTimeout(() => {
            this.removeTyping(typingId);
            this.addMessage(text);
            if(options.length) this.addOptions(options);
        }, 1000);
    }
};
