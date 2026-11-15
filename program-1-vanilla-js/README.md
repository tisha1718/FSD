# Program 1: Vanilla JavaScript Parking Booking System

**Course Outcomes Covered:**
- **CO1:** Design responsive web pages using semantic HTML5 and modern CSS3 (Flexbox, CSS Grid, media queries, CSS variables).
- **CO2:** Build interactive client-side logic with DOM manipulation, event delegation, strict validation, and asynchronous data fetching via Fetch API & async/await.

---

## 1. Aim
To develop a responsive, standalone Parking Slot Booking web interface without external frontend frameworks, implementing dynamic DOM updates, real-time search & filtering, form validation, and asynchronous HTTP GET/POST handling with JSON persistence.

---

## 2. Key Features Implemented
1. **Semantic HTML5 & Modern CSS3:**
   - Card layouts, status badges, responsive grid, live pulse indicators, and modern typography.
   - Clean color coding for slot states: Available (Green), Selected (Blue), Booked (Gray/Muted).
2. **DOM Manipulation & Event Handling:**
   - Event delegation on parking locations grid and slot bay matrix.
   - Dynamic creation, updating, and removal of DOM nodes.
   - Live bill estimation that reacts immediately to duration changes.
3. **Strict Client-Side Validation:**
   - Driver name (min length 3).
   - Mobile phone number (10-digit Indian standard regex).
   - Vehicle plate format check (e.g. `MH12AB1234`).
   - Date validation ensuring past dates cannot be reserved.
   - Duration constraints (1 to 24 hours).
4. **Fetch API & Asynchronous Operations:**
   - Asynchronous `fetch()` calls with `async/await` and error handling.
   - Dynamic location loading from `GET /api/locations`.
   - Reservation submission via `POST /api/bookings`.
   - Graceful offline fallback to LocalStorage when the backend server is offline.
5. **Slot Lifecycle & Cancellation:**
   - Real-time slot state toggle upon booking.
   - Booking cancellation releasing occupied slots back to the available pool.

---

## 3. How to Run on Windows

### Option A: Using the Built-in Node.js HTTP Server (Recommended)
From PowerShell / Command Prompt:
```powershell
cd program-1-vanilla-js
node server.js
```
Open your browser and navigate to:
```
http://localhost:3001
```

### Option B: Standalone in Browser (No Server Needed)
Double click `index.html` or open directly in Chrome/Edge/Firefox. The application seamlessly initializes using client-side fallback storage.

---

## 4. Academic Summary (CO1 & CO2)
- **CO1:** Utilized CSS Grid for parking bays, Flexbox for navigational hierarchy, and CSS Custom Properties for theme tokens.
- **CO2:** Implemented asynchronous promises with `async/await`, `fetch()` with request headers and JSON serialization, DOM event listeners, and form input sanitization.
