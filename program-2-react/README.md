# Program 2: React Parking Application

**Course Outcome Covered:**
- **CO3:** Develop modular, component-driven single-page web applications using React, JSX, unidirectional data flow, hooks (`useState`, `useEffect`), form handling, conditional rendering, and client-side view navigation.

---

## 1. Aim
To construct a modular Single Page Application (SPA) using React 18, demonstrating reusable functional components, reactive state management, prop passing, controlled inputs, and real-time slot occupancy tracking.

---

## 2. Component Hierarchy
```
App (Root Component - Global State & Storage Persistence)
├── Navbar (Tabs, Badge counters, Active navigation)
├── StatsSummary (Total slots, real-time availability, revenue)
├── SearchFilter (Controlled search query, city dropdown, vehicle filters)
├── Explore View
│   ├── ParkingCard (Location listings, free slot counters)
│   └── SlotGrid (Interactive matrix with conditional occupancy styling)
├── BookingModal (Portal/modal with controlled form inputs & strict validation)
├── BookingList (Reserved passes, detail breakdown, cancellation)
└── About (Architectural mapping for CO3)
```

---

## 3. How to Run on Windows

1. Navigate to the `program-2-react` directory:
```powershell
cd program-2-react
```

2. Install dependencies:
```powershell
npm.cmd install
```

3. Launch the Vite development server:
```powershell
npm.cmd run dev
```

4. Open the browser at `http://localhost:5174`
