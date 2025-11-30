document.addEventListener('DOMContentLoaded', function() {

  
    const allCards = document.querySelectorAll('.concert-card');
    const noResultsMsg = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');

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

    const authModal = document.getElementById('authModal');
    const signInBtns = document.querySelectorAll('.sign-in-btn'); 
    const closeAuthBtn = document.querySelector('.close-modal-btn');
    const tabSignIn = document.getElementById('tabSignIn');
    const tabSignUp = document.getElementById('tabSignUp');
    const modalTitle = document.getElementById('modalTitle');
    const authForm = document.getElementById('authForm');
    const authMessage = document.getElementById('authMessage');
    
    let currentAuthAction = 'signin'; 

    signInBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.innerText.includes("Welcome")) return;
            if (authModal) authModal.style.display = 'flex';
        });
    });

    if(closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    if(tabSignIn && tabSignUp) {
        tabSignIn.addEventListener('click', () => {
            currentAuthAction = 'signin';
            modalTitle.textContent = 'Welcome Back';
            tabSignIn.classList.add('active-tab');
            tabSignUp.classList.remove('active-tab');
            authMessage.textContent = '';
        });

        tabSignUp.addEventListener('click', () => {
            currentAuthAction = 'signup';
            modalTitle.textContent = 'Create Account';
            tabSignUp.classList.add('active-tab');
            tabSignIn.classList.remove('active-tab');
            authMessage.textContent = '';
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const submitBtn = document.getElementById('authSubmitBtn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Checking...";
            authMessage.textContent = "";

            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;

            const formData = new FormData();
            formData.append('action', currentAuthAction);
            formData.append('email', email);
            formData.append('password', password);

            try {
                const response = await fetch('auth.php', {
                    method: 'POST',
                    body: formData
                });
                const text = await response.text();
                
                try {
                    const result = JSON.parse(text);

                    if (result.success) {
                        window.location.href = result.redirect || 'dashboard.html';
                    } else {
                        authMessage.textContent = result.message;
                        submitBtn.innerText = originalText;
                    }
                } catch (jsonError) {
                    console.error("JSON Parse Error:", jsonError);
                    alert("SERVER ERROR! \n\n" + text.substring(0, 400));
                    authMessage.textContent = "Server error.";
                    submitBtn.innerText = originalText;
                }

            } catch (networkError) {
                console.error(networkError);
                authMessage.textContent = "Network failed.";
                submitBtn.innerText = originalText;
            }
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
        const messageDisplay = document.getElementById('message');

        const basePrice = Math.floor(Math.random() * 101) + 50; 

        function updatePrice() {
            const qty = parseInt(ticketsInput.value) || 1;
            const multiplier = parseFloat(ticketTypeInput.value); 
            const currentTicketPrice = Math.floor(basePrice * multiplier);
            const total = currentTicketPrice * qty;

            singlePriceInput.value = "$" + currentTicketPrice;
            totalInput.value = "$" + total;
        }

        updatePrice();
        if(ticketsInput) ticketsInput.addEventListener('input', updatePrice);
        if(ticketTypeInput) ticketTypeInput.addEventListener('change', updatePrice);

        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            messageDisplay.innerHTML = '<span style="color:#aaa;">Processing...</span>';
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const concert = document.getElementById('selectedConcert').value;
            
            const qty = parseInt(ticketsInput.value);
            const rawTotal = totalInput.value.replace('$', ''); 
            const typeText = ticketTypeInput.options[ticketTypeInput.selectedIndex].text;

            const checkData = new FormData();
            checkData.append('email', email);
            checkData.append('concert', concert); 

            try {
                // A. Check Conflict
                const checkResponse = await fetch('check_booking.php', { method: 'POST', body: checkData });
                const checkResult = await checkResponse.json();

                if (checkResult.error) {
                    messageDisplay.innerHTML = `<span style="color:#ff4d4d; font-weight: bold; font-size: 1.1rem;">🛑 ${checkResult.message}</span>`;
                    return; 
                } 

                // B. Insert
                const insertData = { email: email, concert: concert, qty: qty, type: typeText, total: rawTotal };
                const insertResponse = await fetch('insert_booking.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(insertData)
                });
                const insertResult = await insertResponse.json();

                if (!insertResult.success) {
                    messageDisplay.innerHTML = `<span style="color:#ff4d4d;">⚠️ Save Failed: ${insertResult.message}</span>`;
                    return;
                }

                // C. Send Email
                const mailData = { name: name, email: email, concert: concert };
                await fetch('sendMail.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(mailData)
                });

                // D. Success
                messageDisplay.innerHTML = `<span style="color:#00eaff; font-size:1.2rem;">🎉 Booking Confirmed & Saved!<br>Email sent to ${email}</span>`;
                bookingForm.reset();
                setTimeout(updatePrice, 100);

            } catch (error) {
                messageDisplay.innerHTML = `<span style="color:#ff4d4d;">Network Error.</span>`;
            }
        });
    }

    const bookedListContainer = document.getElementById('bookedListContainer');
    const dashboardUserName = document.getElementById('dashboardUserName');

    if (bookedListContainer) {
        fetchDashboardData();
    }

    async function fetchDashboardData() {
        try {
            const response = await fetch('get_dashboard_data.php');
            const text = await response.text(); 
            
            try {
                const data = JSON.parse(text);
                
                if (!data.authenticated) {
                    bookedListContainer.innerHTML = '<p style="color:#ff4d4d;">You are not logged in. <a href="index.html" style="color:#00ff88;">Go back to Login</a></p>';
                    return;
                }

                if (dashboardUserName) dashboardUserName.textContent = data.user_name;

                if (data.bookings.length === 0) {
                    bookedListContainer.innerHTML = '<p style="color:#00ff88; font-weight: bold; font-size: 1.1rem;">🎉 No bookings yet! Check out the available concerts below.</p>'; 
                } else {
                    bookedListContainer.innerHTML = ''; 
                    
                    data.bookings.forEach(booking => {
                        // 🛑 ADDED CANCEL BUTTON HERE
                        const cardHTML = `
                            <div class="concert-card booked-card" id="booking-${booking.booking_id}" style="width: 280px;">
                                <img src="${booking.image_path || 'images/default.jpg'}" alt="${booking.name}">
                                <div class="card-info">
                                    <h3>${booking.name}</h3>
                                    <p class="date">${booking.date} • ${booking.venue || 'Venue TBD'}</p>
                                    
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                                        <div class="booking-status">
                                            <i class="fas fa-check-circle"></i> Confirmed
                                        </div>
                                        <button class="cancel-booking-btn" data-id="${booking.booking_id}" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.8rem;">
                                            Cancel
                                        </button>
                                    </div>

                                </div>
                            </div>
                        `;
                        bookedListContainer.insertAdjacentHTML('beforeend', cardHTML);
                    });

                    // 🛑 ATTACH CLICK LISTENERS FOR CANCEL
                    attachCancelListeners();
                }
            } catch (e) {
                console.error("Dashboard JSON Error:", text);
                bookedListContainer.innerHTML = '<p style="color:#ff4d4d;">No booking yet.</p>';
            }

        } catch (error) {
            console.error(error);
            bookedListContainer.innerHTML = '<p style="color:#ff4d4d;">Server connection failed.</p>';
        }
    }

    function attachCancelListeners() {
        const cancelBtns = document.querySelectorAll('.cancel-booking-btn');
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', async function() {
                const bookingId = this.getAttribute('data-id');
                
                // 1. Confirm Dialog
                const confirmCancel = confirm("Are you sure you want to cancel this event?");
                
                if (confirmCancel) {
                    try {
                        // 2. Send Request to PHP
                        const response = await fetch('cancel_booking.php', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ booking_id: bookingId })
                        });
                        const result = await response.json();

                        if (result.success) {
                            // 3. Success Alert & Remove Card
                            alert("Your booking is cancelled. You will get your refund.");
                            
                            // Remove element from screen
                            const cardToRemove = document.getElementById(`booking-${bookingId}`);
                            if (cardToRemove) cardToRemove.remove();
                            
                            // If no cards left, show message
                            if (document.querySelectorAll('.booked-card').length === 0) {
                                bookedListContainer.innerHTML = '<p style="color:#00ff88; font-weight: bold; font-size: 1.1rem;">🎉 No bookings yet! Check out the available concerts below.</p>';
                            }

                        } else {
                            alert("Error: " + result.message);
                        }
                    } catch (err) {
                        alert("Network error occurred.");
                    }
                }
            });
        });
    }

});
