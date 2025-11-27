document.addEventListener('DOMContentLoaded', function() {
    
   
    const allCards = document.querySelectorAll('.concert-card');
    const noResultsMsg = document.getElementById('noResults');

    function filterConcerts(filterType, filterValue) {
        let visibleCount = 0;

        allCards.forEach(card => {
            let isMatch = false;

            if (filterType === 'text') {
                
                if (card.textContent.toLowerCase().includes(filterValue.toLowerCase())) {
                    isMatch = true;
                }
            } else if (filterType === 'date') {
               
                if (card.getAttribute('data-date') === filterValue) {
                    isMatch = true;
                }
            } else {
              
                isMatch = true;
            }

            
            card.style.display = isMatch ? "block" : "none";
            if (isMatch) visibleCount++;
        });

       
        if (noResultsMsg) {
            noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
        }
    }


   
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        
        searchInput.addEventListener('input', function () {
            const term = searchInput.value.trim();
            if (term === "") {
                filterConcerts('reset', null);
            } else {
                filterConcerts('text', term);
            }
        });

       
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') e.preventDefault(); 
        });
    }


   
    const carousel = document.querySelector('.concert-carousel');
    const leftBtn = document.getElementById('scrollLeftBtn');
    const rightBtn = document.getElementById('scrollRightBtn');
    
    if (carousel && leftBtn && rightBtn) {
        leftBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -320, behavior: 'smooth' });
        });
        rightBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }


   
    const calendarGrid = document.getElementById('calendarGrid');
    if (calendarGrid) {
        const toggleBtn = document.getElementById('toggleCalendarBtn');
        const popup = document.getElementById('calendarPopup');
        const closeBtn = document.getElementById('closeCalendarBtn');
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');
        const clearBtn = document.getElementById('clearDateBtn');
        
        let currentMonth = new Date().getMonth(); 
        let currentYear = 2025; 
        let selectedDate = null;

        function renderCalendar() {
            calendarGrid.innerHTML = ''; 
            
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            document.getElementById('currentMonthYear').textContent = `${monthNames[currentMonth]} ${currentYear}`;

            const firstDay = new Date(currentYear, currentMonth, 1).getDay(); 
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                calendarGrid.appendChild(document.createElement('span'));
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dateObj = new Date(currentYear, currentMonth, day);
                const daySpan = document.createElement('span');
                daySpan.textContent = day;
                daySpan.classList.add('calendar-day');
                
                if (selectedDate && dateObj.getTime() === selectedDate.getTime()) {
                    daySpan.classList.add('selected-start');
                    daySpan.style.backgroundColor = "#007bff"; 
                    daySpan.style.color = "white";
                }

                daySpan.onclick = () => {
                    selectedDate = dateObj;
                    const y = dateObj.getFullYear();
                    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const d = String(dateObj.getDate()).padStart(2, '0');
                    const formattedDate = `${y}-${m}-${d}`;

                    filterConcerts('date', formattedDate);
                    renderCalendar();
                };

                calendarGrid.appendChild(daySpan);
            }
        }

        function toggleCalendar() {
            popup.classList.toggle('active');
            if (popup.classList.contains('active')) renderCalendar();
        }

        toggleBtn.addEventListener('click', toggleCalendar);
        closeBtn.addEventListener('click', toggleCalendar);
        
        prevBtn.addEventListener('click', () => { 
            currentMonth--; 
            if (currentMonth < 0) { currentMonth = 11; currentYear--; } 
            renderCalendar(); 
        });
        
        nextBtn.addEventListener('click', () => { 
            currentMonth++; 
            if (currentMonth > 11) { currentMonth = 0; currentYear++; } 
            renderCalendar(); 
        });

        clearBtn.addEventListener('click', () => {
            selectedDate = null;
            filterConcerts('reset', null); 
            renderCalendar();
        });
    }


   
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
      
        const params = new URLSearchParams(window.location.search);
        const concertName = params.get('concert');
        if (concertName) document.getElementById('selectedConcert').value = concertName;

        const ticketsInput = document.getElementById('tickets');
        const ticketTypeInput = document.getElementById('ticketType');
        
       
        const singlePriceInput = document.getElementById('singlePriceDisplay');
        const totalInput = document.getElementById('totalPrice');

        
        const basePrice = Math.floor(Math.random() * 101) + 50; 

        
        function updatePrice() {
            const qty = parseInt(ticketsInput.value) || 1;
            const multiplier = parseFloat(ticketTypeInput.value); // 1, 1.5, or 2.5
            
           
            const currentTicketPrice = Math.floor(basePrice * multiplier);
            
           
            const total = currentTicketPrice * qty;

           
            singlePriceInput.value = "$" + currentTicketPrice;
            totalInput.value = "$" + total;
        }

       
        updatePrice(); 

        
        if(ticketsInput) ticketsInput.addEventListener('input', updatePrice);
        if(ticketTypeInput) ticketTypeInput.addEventListener('change', updatePrice);

      
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const total = totalInput.value; 
            const typeText = ticketTypeInput.options[ticketTypeInput.selectedIndex].text;
            
            document.getElementById('message').innerHTML = `
                <span style="color:#00eaff; font-size:1.2rem;">
                    🎉 Booking Confirmed for ${name}!<br>
                    Type: ${typeText}<br>
                    Total Paid: ${total}
                </span>`;
            
            bookingForm.reset();
            setTimeout(updatePrice, 100); 
        });
    }

   
    const filterLinks = document.querySelectorAll('.filter-link');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const value = this.getAttribute('data-filter');
            
            if(searchInput) {
                
                searchInput.value = value;
                
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });

});
