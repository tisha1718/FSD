/**
 * PARKIFY - Program 1: Vanilla JavaScript Implementation
 * Covers: CO1 (HTML5, CSS3), CO2 (Client-Side JavaScript, DOM Manipulation, Fetch API, Async/Await)
 */

// Initial Seed Data (serves as data source and mock API fallback)
const INITIAL_LOCATIONS = [
    {
        id: "LOC-01",
        name: "Central Metro Grand Station",
        address: "Sector 14, Commercial Hub, New Delhi",
        city: "Delhi",
        hourlyRate: 50,
        totalSlots: 12,
        vehicleTypes: ["FOUR_WHEELER", "TWO_WHEELER", "EV"],
        slots: [
            { id: "S101", number: "A-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 },
            { id: "S102", number: "A-02", type: "FOUR_WHEELER", status: "BOOKED", rate: 50 },
            { id: "S103", number: "A-03", type: "EV", status: "AVAILABLE", rate: 70 },
            { id: "S104", number: "A-04", type: "TWO_WHEELER", status: "AVAILABLE", rate: 25 },
            { id: "S105", number: "A-05", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 },
            { id: "S106", number: "B-01", type: "TWO_WHEELER", status: "AVAILABLE", rate: 25 },
            { id: "S107", number: "B-02", type: "EV", status: "BOOKED", rate: 70 },
            { id: "S108", number: "B-03", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 50 }
        ]
    },
    {
        id: "LOC-02",
        name: "Cyber Heights Tech Park",
        address: "Phase II, Electronic City, Bengaluru",
        city: "Bengaluru",
        hourlyRate: 60,
        totalSlots: 10,
        vehicleTypes: ["FOUR_WHEELER", "TWO_WHEELER", "EV"],
        slots: [
            { id: "S201", number: "CP-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 60 },
            { id: "S202", number: "CP-02", type: "EV", status: "AVAILABLE", rate: 80 },
            { id: "S203", number: "CP-03", type: "TWO_WHEELER", status: "BOOKED", rate: 30 },
            { id: "S204", number: "CP-04", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 60 },
            { id: "S205", number: "CP-05", type: "TWO_WHEELER", status: "AVAILABLE", rate: 30 },
            { id: "S206", number: "CP-06", type: "EV", status: "AVAILABLE", rate: 80 }
        ]
    },
    {
        id: "LOC-03",
        name: "Terminal 3 International Airport",
        address: "Aerocity Gateway, Mumbai",
        city: "Mumbai",
        hourlyRate: 90,
        totalSlots: 8,
        vehicleTypes: ["FOUR_WHEELER", "EV"],
        slots: [
            { id: "S301", number: "T3-01", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 90 },
            { id: "S302", number: "T3-02", type: "FOUR_WHEELER", status: "BOOKED", rate: 90 },
            { id: "S303", number: "T3-03", type: "EV", status: "AVAILABLE", rate: 110 },
            { id: "S304", number: "T3-04", type: "FOUR_WHEELER", status: "AVAILABLE", rate: 90 }
        ]
    }
];

// Application State
const state = {
    locations: [],
    selectedLocationId: null,
    selectedSlot: null,
    bookings: [],
    filters: {
        searchTerm: "",
        vehicleType: "ALL",
        status: "ALL"
    }
};

// DOM Elements Cache
const DOM = {
    locationsGrid: document.getElementById("locations-grid"),
    locationsCount: document.getElementById("locations-count"),
    slotsMatrix: document.getElementById("slots-matrix"),
    currentLocationTitle: document.getElementById("current-location-title"),
    currentLocationAddress: document.getElementById("current-location-address"),
    filterForm: document.getElementById("filter-form"),
    searchInput: document.getElementById("search-input"),
    vehicleFilter: document.getElementById("vehicle-filter"),
    statusFilter: document.getElementById("status-filter"),
    resetFilterBtn: document.getElementById("reset-filter-btn"),
    bookingForm: document.getElementById("booking-form"),
    slotNumberDisplay: document.getElementById("slot-number-display"),
    selectedSlotId: document.getElementById("selected-slot-id"),
    selectedLocationId: document.getElementById("selected-location-id"),
    ratePerHourDisplay: document.getElementById("rate-per-hour-display"),
    driverName: document.getElementById("driver-name"),
    driverPhone: document.getElementById("driver-phone"),
    vehicleNumber: document.getElementById("vehicle-number"),
    vehicleTypeSelect: document.getElementById("vehicle-type-select"),
    bookingDate: document.getElementById("booking-date"),
    startTime: document.getElementById("start-time"),
    durationHours: document.getElementById("duration-hours"),
    summaryDuration: document.getElementById("summary-duration"),
    summaryRate: document.getElementById("summary-rate"),
    summaryTotal: document.getElementById("summary-total"),
    submitBookingBtn: document.getElementById("submit-booking-btn"),
    bookingsTbody: document.getElementById("bookings-tbody"),
    clearRecordsBtn: document.getElementById("clear-records-btn"),
    toastContainer: document.getElementById("toast-container"),
    apiStatus: document.getElementById("api-status")
};

// ==========================================
// 1. DATA FETCHING (ASYNC / AWAIT & FETCH API)
// ==========================================
async function fetchParkingLocations() {
    try {
        // Try fetching from local API endpoint if running with server.js
        const response = await fetch("/api/locations", { method: "GET" });
        if (response.ok) {
            const data = await response.json();
            state.locations = data;
            DOM.apiStatus.textContent = "Live HTTP Server (Port 3001)";
        } else {
            throw new Error("HTTP endpoint not active, using seed store.");
        }
    } catch (err) {
        // Fallback to local memory / local storage
        const cached = localStorage.getItem("parkify_p1_locations");
        if (cached) {
            state.locations = JSON.parse(cached);
        } else {
            state.locations = JSON.parse(JSON.stringify(INITIAL_LOCATIONS));
            saveLocationsToStorage();
        }
        DOM.apiStatus.textContent = "Local Client Store (Active)";
    }

    loadStoredBookings();
    renderLocations();
    // Select first location by default
    if (state.locations.length > 0) {
        selectLocation(state.locations[0].id);
    }
}

function saveLocationsToStorage() {
    localStorage.setItem("parkify_p1_locations", JSON.stringify(state.locations));
}

function loadStoredBookings() {
    const saved = localStorage.getItem("parkify_p1_bookings");
    if (saved) {
        state.bookings = JSON.parse(saved);
    }
    renderBookings();
}

function saveBookingsToStorage() {
    localStorage.setItem("parkify_p1_bookings", JSON.stringify(state.bookings));
}

// ==========================================
// 2. DYNAMIC DOM RENDERING
// ==========================================
function renderLocations() {
    const { searchTerm } = state.filters;
    const filtered = state.locations.filter(loc => {
        const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              loc.address.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    DOM.locationsCount.textContent = `${filtered.length} Hubs Available`;

    if (filtered.length === 0) {
        DOM.locationsGrid.innerHTML = `
            <div class="empty-state">No parking hubs match "${escapeHTML(searchTerm)}". Try resetting filters.</div>
        `;
        return;
    }

    DOM.locationsGrid.innerHTML = filtered.map(loc => {
        const isSelected = loc.id === state.selectedLocationId;
        const availableSlots = loc.slots.filter(s => s.status === "AVAILABLE").length;

        return `
            <div class="location-card ${isSelected ? 'selected' : ''}" data-id="${loc.id}">
                <div class="location-header">
                    <h4 class="location-name">${escapeHTML(loc.name)}</h4>
                    <span class="badge ${availableSlots > 0 ? 'badge-green' : 'badge-amber'}">
                        ${availableSlots} Free Slots
                    </span>
                </div>
                <p class="location-address">${escapeHTML(loc.address)}</p>
                <div class="location-meta">
                    <span class="badge badge-blue">${escapeHTML(loc.city)}</span>
                    <span class="location-rate">₹${loc.hourlyRate} / hr</span>
                </div>
            </div>
        `;
    }).join("");
}

function renderSlots() {
    const loc = state.locations.find(l => l.id === state.selectedLocationId);
    if (!loc) {
        DOM.slotsMatrix.innerHTML = `<div class="empty-state">Please select a location above to view slots.</div>`;
        return;
    }

    DOM.currentLocationTitle = document.getElementById("current-location-title");
    DOM.currentLocationAddress = document.getElementById("current-location-address");
    DOM.currentLocationTitle.textContent = `${loc.name} - Slot Matrix`;
    DOM.currentLocationAddress.textContent = `${loc.address} (Base Rate: ₹${loc.hourlyRate}/hr)`;

    const { vehicleType, status } = state.filters;

    const filteredSlots = loc.slots.filter(s => {
        const matchVehicle = vehicleType === "ALL" || s.type === vehicleType;
        const matchStatus = status === "ALL" || s.status === status;
        return matchVehicle && matchStatus;
    });

    if (filteredSlots.length === 0) {
        DOM.slotsMatrix.innerHTML = `<div class="empty-state">No slots match the selected filters in this hub.</div>`;
        return;
    }

    DOM.slotsMatrix.innerHTML = filteredSlots.map(slot => {
        const isSelected = state.selectedSlot && state.selectedSlot.id === slot.id;
        const isBooked = slot.status === "BOOKED";

        let statusClass = "available";
        if (isBooked) statusClass = "booked";
        if (isSelected) statusClass = "selected";

        return `
            <div class="slot-box ${statusClass}" data-slot-id="${slot.id}" data-location-id="${loc.id}">
                <span class="slot-number">${escapeHTML(slot.number)}</span>
                <span class="slot-type">${slot.type.replace('_', ' ')}</span>
                <span class="slot-rate">₹${slot.rate}/hr</span>
            </div>
        `;
    }).join("");
}

function renderBookings() {
    if (state.bookings.length === 0) {
        DOM.bookingsTbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4" style="text-align: center; color: var(--dark-muted);">
                    No active reservations recorded. Select a slot and book above.
                </td>
            </tr>
        `;
        return;
    }

    DOM.bookingsTbody.innerHTML = state.bookings.map(b => `
        <tr>
            <td><strong>#${escapeHTML(b.bookingId)}</strong></td>
            <td>
                <div><strong>${escapeHTML(b.locationName)}</strong></div>
                <small style="color: var(--primary); font-weight: 700;">Slot: ${escapeHTML(b.slotNumber)} (${b.vehicleType})</small>
            </td>
            <td>
                <div>${escapeHTML(b.driverName)}</div>
                <small style="color: var(--dark-muted);">${escapeHTML(b.vehicleNumber)} &bull; ${escapeHTML(b.driverPhone)}</small>
            </td>
            <td>
                <div>${escapeHTML(b.date)}</div>
                <small style="color: var(--dark-muted);">${escapeHTML(b.startTime)}</small>
            </td>
            <td>
                <div>₹${b.totalAmount}</div>
                <small style="color: var(--dark-muted);">${b.durationHours} hr(s) @ ₹${b.ratePerHour}/hr</small>
            </td>
            <td>
                <span class="status-badge ${b.status.toLowerCase()}">${b.status}</span>
            </td>
            <td>
                ${b.status === "CONFIRMED" ? `
                    <button class="btn btn-sm btn-danger-outline cancel-booking-btn" data-id="${b.bookingId}">Cancel</button>
                ` : `<span style="font-size: 0.75rem; color: var(--dark-muted);">Archived</span>`}
            </td>
        </tr>
    `).join("");
}

// ==========================================
// 3. EVENT HANDLERS & SELECTION
// ==========================================
function selectLocation(locId) {
    state.selectedLocationId = locId;
    state.selectedSlot = null;
    clearSlotSelectionForm();
    renderLocations();
    renderSlots();
}

function selectSlot(slotId) {
    const loc = state.locations.find(l => l.id === state.selectedLocationId);
    if (!loc) return;

    const slot = loc.slots.find(s => s.id === slotId);
    if (!slot) return;

    if (slot.status === "BOOKED") {
        showToast("This slot is already occupied. Please pick an available slot.", "error");
        return;
    }

    state.selectedSlot = slot;
    DOM.slotNumberDisplay.value = `${slot.number} (${loc.name})`;
    DOM.selectedSlotId.value = slot.id;
    DOM.selectedLocationId.value = loc.id;
    DOM.ratePerHourDisplay.value = `₹${slot.rate} / hr`;
    DOM.vehicleTypeSelect.value = slot.type;

    calculatePrice();
    renderSlots();

    // Scroll smoothly to booking section
    document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
    showToast(`Selected Slot ${slot.number} at ₹${slot.rate}/hr`, "info");
}

function clearSlotSelectionForm() {
    DOM.slotNumberDisplay.value = "";
    DOM.selectedSlotId.value = "";
    DOM.selectedLocationId.value = "";
    DOM.ratePerHourDisplay.value = "";
    calculatePrice();
}

function calculatePrice() {
    const duration = parseInt(DOM.durationHours.value, 10) || 1;
    const rate = state.selectedSlot ? state.selectedSlot.rate : 50;
    const total = duration * rate;

    DOM.summaryDuration.textContent = `${duration} Hour(s)`;
    DOM.summaryRate.textContent = `₹${rate} / hr`;
    DOM.summaryTotal.textContent = `₹${total}`;
}

// ==========================================
// 4. FORM VALIDATION & HTTP POST BOOKING
// ==========================================
function validateBookingForm() {
    let isValid = true;

    // Reset error messages
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

    if (!state.selectedSlot) {
        showToast("Please choose an available parking slot from the grid first.", "error");
        isValid = false;
    }

    // Driver Name
    const nameVal = DOM.driverName.value.trim();
    if (!nameVal || nameVal.length < 3) {
        document.getElementById("name-error").textContent = "Name must be at least 3 characters long.";
        isValid = false;
    }

    // Driver Phone (10 digits)
    const phoneVal = DOM.driverPhone.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
        document.getElementById("phone-error").textContent = "Enter a valid 10-digit mobile number.";
        isValid = false;
    }

    // Vehicle Number
    const vehVal = DOM.vehicleNumber.value.trim();
    const vehRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i;
    if (vehVal.length < 5) {
        document.getElementById("vehicle-error").textContent = "Enter a valid vehicle registration plate.";
        isValid = false;
    }

    // Date
    const dateVal = DOM.bookingDate.value;
    if (!dateVal) {
        document.getElementById("date-error").textContent = "Select reservation date.";
        isValid = false;
    } else {
        const today = new Date().toISOString().split("T")[0];
        if (dateVal < today) {
            document.getElementById("date-error").textContent = "Date cannot be in the past.";
            isValid = false;
        }
    }

    // Time
    if (!DOM.startTime.value) {
        document.getElementById("time-error").textContent = "Select arrival entry time.";
        isValid = false;
    }

    // Duration
    const durVal = parseInt(DOM.durationHours.value, 10);
    if (!durVal || durVal < 1 || durVal > 24) {
        document.getElementById("duration-error").textContent = "Duration must be between 1 and 24 hours.";
        isValid = false;
    }

    return isValid;
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    if (!validateBookingForm()) return;

    const loc = state.locations.find(l => l.id === state.selectedLocationId);
    const slot = state.selectedSlot;
    const duration = parseInt(DOM.durationHours.value, 10);
    const totalAmount = duration * slot.rate;

    const newBooking = {
        bookingId: "PK-" + Math.floor(100000 + Math.random() * 900000),
        locationId: loc.id,
        locationName: loc.name,
        slotId: slot.id,
        slotNumber: slot.number,
        driverName: DOM.driverName.value.trim(),
        driverPhone: DOM.driverPhone.value.trim(),
        vehicleNumber: DOM.vehicleNumber.value.trim().toUpperCase(),
        vehicleType: DOM.vehicleTypeSelect.value,
        date: DOM.bookingDate.value,
        startTime: DOM.startTime.value,
        durationHours: duration,
        ratePerHour: slot.rate,
        totalAmount: totalAmount,
        status: "CONFIRMED",
        createdAt: new Date().toISOString()
    };

    // Toggle button loading UI
    const btnText = DOM.submitBookingBtn.querySelector(".btn-text");
    const btnLoader = DOM.submitBookingBtn.querySelector(".btn-loader");
    btnText.style.display = "none";
    btnLoader.style.display = "inline";
    DOM.submitBookingBtn.disabled = true;

    try {
        // Attempt HTTP POST request to backend if available
        let serverSuccess = false;
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBooking)
            });
            if (response.ok) {
                serverSuccess = true;
            }
        } catch (e) {
            // Local fallback
        }

        // Update local state & slot availability
        slot.status = "BOOKED";
        state.bookings.unshift(newBooking);
        saveBookingsToStorage();
        saveLocationsToStorage();

        // Re-render
        renderLocations();
        renderSlots();
        renderBookings();

        // Reset form
        DOM.bookingForm.reset();
        state.selectedSlot = null;
        clearSlotSelectionForm();
        setDefaultDateTime();

        showToast(`Pass Generated! Booking ID: #${newBooking.bookingId}`, "success");
        document.getElementById("records-section").scrollIntoView({ behavior: "smooth" });

    } catch (err) {
        showToast("Error confirming booking. Please retry.", "error");
    } finally {
        btnText.style.display = "inline";
        btnLoader.style.display = "none";
        DOM.submitBookingBtn.disabled = false;
    }
}

// ==========================================
// 5. CANCELLATION & ARCHIVE
// ==========================================
function cancelBooking(bookingId) {
    const booking = state.bookings.find(b => b.bookingId === bookingId);
    if (!booking) return;

    if (!confirm(`Are you sure you want to cancel booking #${bookingId}?`)) return;

    booking.status = "CANCELLED";

    // Free up the slot in state
    state.locations.forEach(loc => {
        if (loc.id === booking.locationId) {
            const sl = loc.slots.find(s => s.id === booking.slotId);
            if (sl) sl.status = "AVAILABLE";
        }
    });

    saveBookingsToStorage();
    saveLocationsToStorage();
    renderLocations();
    renderSlots();
    renderBookings();
    showToast(`Booking #${bookingId} has been cancelled and slot released.`, "info");
}

// ==========================================
// 6. UTILITIES & NOTIFICATIONS
// ==========================================
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHTML(str) {
    return String(str || "").replace(/[&<>'"]/g, 
        tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        }[tag] || tag)
    );
}

function setDefaultDateTime() {
    const today = new Date().toISOString().split("T")[0];
    DOM.bookingDate.value = today;
    DOM.bookingDate.min = today;

    const now = new Date();
    const hours = String(now.getHours() + 1).padStart(2, "0");
    DOM.startTime.value = `${hours}:00`;
    DOM.durationHours.value = 2;
    calculatePrice();
}

// ==========================================
// 7. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Location Card Delegation
    DOM.locationsGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".location-card");
        if (card && card.dataset.id) {
            selectLocation(card.dataset.id);
        }
    });

    // Slot Matrix Delegation
    DOM.slotsMatrix.addEventListener("click", (e) => {
        const slotBox = e.target.closest(".slot-box");
        if (slotBox && slotBox.dataset.slotId) {
            selectSlot(slotBox.dataset.slotId);
        }
    });

    // Filter Controls
    DOM.filterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        state.filters.searchTerm = DOM.searchInput.value.trim();
        state.filters.vehicleType = DOM.vehicleFilter.value;
        state.filters.status = DOM.statusFilter.value;
        renderLocations();
        renderSlots();
    });

    DOM.searchInput.addEventListener("input", (e) => {
        state.filters.searchTerm = e.target.value.trim();
        renderLocations();
    });

    DOM.vehicleFilter.addEventListener("change", (e) => {
        state.filters.vehicleType = e.target.value;
        renderSlots();
    });

    DOM.statusFilter.addEventListener("change", (e) => {
        state.filters.status = e.target.value;
        renderSlots();
    });

    DOM.resetFilterBtn.addEventListener("click", () => {
        DOM.filterForm.reset();
        state.filters.searchTerm = "";
        state.filters.vehicleType = "ALL";
        state.filters.status = "ALL";
        renderLocations();
        renderSlots();
    });

    // Duration input price recalculation
    DOM.durationHours.addEventListener("input", calculatePrice);

    // Form Submission
    DOM.bookingForm.addEventListener("submit", handleBookingSubmit);

    // Table Actions Delegation
    DOM.bookingsTbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("cancel-booking-btn")) {
            cancelBooking(e.target.dataset.id);
        }
    });

    // Clear Records
    DOM.clearRecordsBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear booking history?")) {
            state.bookings = [];
            saveBookingsToStorage();
            renderBookings();
            showToast("Booking history cleared.", "info");
        }
    });
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    setDefaultDateTime();
    setupEventListeners();
    fetchParkingLocations();
});
