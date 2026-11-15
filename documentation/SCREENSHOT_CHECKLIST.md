# PARKIFY Academic & Submission Screenshot Checklist

Use this checklist when taking screenshots for your college project report, GitHub README, and LinkedIn portfolio showcase.

---

## Program 1: Vanilla JavaScript (CO1, CO2)
- [ ] **P1-01:** Hero banner and responsive search filter form (`#search-section`).
- [ ] **P1-02:** Dynamic parking location cards with free slot count badges (`#locations-grid`).
- [ ] **P1-03:** Real-time slot bay matrix displaying Available (green), Booked (gray), and Selected (blue).
- [ ] **P1-04:** Reservation form with live bill estimation reacting to duration changes.
- [ ] **P1-05:** Active booking pass table showing generated pass IDs and cancellation action.
- [ ] **P1-06:** Validation error state (e.g. invalid vehicle number or phone).

---

## Program 2: React Component Application (CO3)
- [ ] **P2-01:** Top navigation bar with active tab indicators and live booking count badge.
- [ ] **P2-02:** Real-time metrics overview (Total bays, Available now, Occupied, Total revenue).
- [ ] **P2-03:** Interactive slot matrix with vehicle type filtering (Car, Bike, EV).
- [ ] **P2-04:** Controlled booking modal with real-time tariff breakdown.
- [ ] **P2-05:** "My Bookings" view showing reserved pass cards.
- [ ] **P2-06:** "Architecture (CO3)" panel detailing component hierarchy and state flow.

---

## Program 3: Core Node.js HTTP & Streams (CO4)
- [ ] **P3-01:** Web dashboard (`http://localhost:3003`) showing low-level architecture highlights.
- [ ] **P3-02:** Form submitting a new booking record via native `POST /api/bookings`.
- [ ] **P3-03:** Real-time terminal box showing audit logs streaming from `EventEmitter` (`booking:created`).
- [ ] **P3-04:** JSON file records table loaded dynamically from `data/bookings.json`.
- [ ] **P3-05:** Terminal execution of automated test suite `node test-crud.js` displaying 6 passed tests.

---

## Program 4: Express.js REST API & RBAC (CO5)
- [ ] **P4-01:** Terminal output starting Express server on port 4000 with route table.
- [ ] **P4-02:** Postman or automated test output showing JWT token issuance on login.
- [ ] **P4-03:** Custom request logger output in terminal showing method, path, status, and execution ms.
- [ ] **P4-04:** Double-booking prevention test returning HTTP `409 Conflict`.
- [ ] **P4-05:** Role-based security test showing HTTP `403 Forbidden` when standard user requests admin analytics.
- [ ] **P4-06:** Successful test suite output `node test-api.js` with all tests passing.

---

## Program 5: Integrated Full Stack Web Application (CO6)
- [ ] **P5-01:** Modern landing page with feature cards and demo credential chips.
- [ ] **P5-02:** Login interface with quick-fill demo buttons for User and Admin.
- [ ] **P5-03:** Driver dashboard with search, city filter, and interactive parking bay matrix.
- [ ] **P5-04:** Reservation modal with vehicle details and live calculated tariff.
- [ ] **P5-05:** "My Bookings" page displaying unique generated passes (`PKF-XXXXXX`).
- [ ] **P5-06:** Pass cancellation with instant green slot release.
- [ ] **P5-07:** Executive Admin Portal showing real-time occupancy and revenue analytics.
- [ ] **P5-08:** Admin location management and slot creation forms.
- [ ] **P5-09:** Admin booking ledger with status updater dropdowns (Confirmed, Completed, Cancelled).
- [ ] **P5-10:** User profile page displaying account details and update options.
