document.addEventListener('DOMContentLoaded', function() {
    let bookingData = {
        service: null,
        price: null,
        duration: null,
        date: null,
        time: null,
        clientName: null,
        clientPhone: null,
        clientEmail: null,
        clientNotes: null
    };

    // Step 1: Service Selection
    const serviceBtns = document.querySelectorAll('.service-select-btn');
    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class from all
            serviceBtns.forEach(b => b.classList.remove('selected'));
            // Add to clicked
            this.classList.add('selected');
            
            // Save data
            bookingData.service = this.dataset.service;
            bookingData.price = this.dataset.price;
            bookingData.duration = this.dataset.duration;
            
            // Move to next step
            setTimeout(() => {
                showStep('step-datetime');
                initCalendar();
            }, 300);
        });
    });

    // Navigation
    window.showStep = function(stepId) {
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(stepId).classList.add('active');
    }

    // Step 2: Calendar Logic
    function initCalendar() {
        const calendarGrid = document.getElementById('calendar-days');
        calendarGrid.innerHTML = '';
        
        // Generate next 14 days
        const today = new Date();
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        for(let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const dayElem = document.createElement('div');
            dayElem.className = 'calendar-day';
            
            // Disable Sundays
            if(date.getDay() === 0) {
                dayElem.classList.add('disabled');
            } else {
                dayElem.onclick = () => selectDate(date, dayElem);
            }
            
            dayElem.innerHTML = `
                <div>${days[date.getDay()]}</div>
                <strong>${date.getDate()}</strong>
            `;
            
            calendarGrid.appendChild(dayElem);
        }
    }

    function selectDate(date, elem) {
        // Visual selection
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        elem.classList.add('selected');
        
        bookingData.date = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('selected-date-display').innerText = bookingData.date;
        
        // Show time slots
        document.getElementById('time-slots-container').style.display = 'block';
        generateTimeSlots();
    }

    function generateTimeSlots() {
        const slotsContainer = document.getElementById('time-slots');
        slotsContainer.innerHTML = '';
        
        // Slots: 10:00 to 18:00
        const startHour = 10;
        const endHour = 18;
        
        for(let h = startHour; h < endHour; h++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.innerText = `${h}:00`;
            slot.onclick = () => selectTime(`${h}:00`, slot);
            slotsContainer.appendChild(slot);
            
            // Half hour slot
            const slotHalf = document.createElement('div');
            slotHalf.className = 'time-slot';
            slotHalf.innerText = `${h}:30`;
            slotHalf.onclick = () => selectTime(`${h}:30`, slotHalf);
            slotsContainer.appendChild(slotHalf);
        }
    }

    function selectTime(time, elem) {
        document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
        elem.classList.add('selected');
        
        bookingData.time = time;
        document.getElementById('btn-next-to-form').disabled = false;
    }

    // Next to client info form
    document.getElementById('btn-next-to-form').addEventListener('click', function() {
        if(!bookingData.date || !bookingData.time) {
            alert('Por favor selecciona fecha y hora');
            return;
        }
        showStep('step-client-info');
    });

    // Final Step: Confirm with WhatsApp
    document.getElementById('btn-confirm-booking').addEventListener('click', function() {
        // Get form data
        bookingData.clientName = document.getElementById('client-name').value;
        bookingData.clientPhone = document.getElementById('client-phone').value;
        bookingData.clientEmail = document.getElementById('client-email').value;
        bookingData.clientNotes = document.getElementById('client-notes').value;
        
        // Validate
        if(!bookingData.clientName || !bookingData.clientPhone) {
            alert('Por favor completa tu nombre y teléfono');
            return;
        }
        
        if(!bookingData.service || !bookingData.date || !bookingData.time) {
            alert('Datos de reserva incompletos');
            return;
        }
        
        // Build WhatsApp message
        const whatsappNumber = document.querySelector('[data-whatsapp]')?.dataset.whatsapp || "5491112345678";
        let message = `¡Hola! Quiero reservar un turno:%0A%0A`;
        message += `👤 *Nombre:* ${bookingData.clientName}%0A`;
        message += `📞 *Teléfono:* ${bookingData.clientPhone}%0A`;
        if(bookingData.clientEmail) {
            message += `📧 *Email:* ${bookingData.clientEmail}%0A`;
        }
        message += `%0A💅 *Servicio:* ${bookingData.service}%0A`;
        message += `📅 *Fecha:* ${bookingData.date}%0A`;
        message += `🕐 *Hora:* ${bookingData.time}%0A`;
        message += `💰 *Precio:* $${parseInt(bookingData.price).toLocaleString('es-AR')}%0A`;
        if(bookingData.clientNotes) {
            message += `%0A📝 *Notas:* ${bookingData.clientNotes}`;
        }
        
        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        
        // Show confirmation
        alert('¡Perfecto! Te estamos redirigiendo a WhatsApp para confirmar tu reserva.');
    });
});
