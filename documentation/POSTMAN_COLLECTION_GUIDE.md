# PARKIFY Postman API Testing Guide

This guide walks you through verifying all PARKIFY REST API endpoints (Program 4 on Port 4000, Program 5 on Port 5000) using Postman or any API client.

---

## 1. Environment Variables Setup in Postman
Create an environment in Postman with the following keys:
| Variable | Initial Value (Program 4) | Initial Value (Program 5) |
| :--- | :--- | :--- |
| `base_url` | `http://localhost:4000/api` | `http://localhost:5000/api` |
| `auth_token` | *(Leave blank, auto-populated upon login)* | *(Leave blank)* |

---

## 2. Test Execution Sequence

### Request 1: User Login
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/login`
- **Body (raw JSON):**
```json
{
  "email": "user@parkify.com",
  "password": "user123"
}
```
- **Postman Tests Script (Auto-save token):**
```javascript
const response = pm.response.json();
if (response.token) {
    pm.environment.set("auth_token", response.token);
    console.log("Token saved to environment.");
}
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});
```

---

### Request 2: Get Available Locations
- **Method:** `GET`
- **URL:** `{{base_url}}/locations`
- **Tests Script:**
```javascript
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});
pm.test("Locations array returned", () => {
    const data = pm.response.json();
    pm.expect(data.data.length).to.be.above(0);
});
```

---

### Request 3: Book a Parking Slot (Protected)
- **Method:** `POST`
- **URL:** `{{base_url}}/bookings`
- **Headers:**
  - `Authorization: Bearer {{auth_token}}`
- **Body (raw JSON):**
```json
{
  "locationId": 1,
  "slotId": 2,
  "vehicleNumber": "KA-05-TEST-1234",
  "vehicleType": "FOUR_WHEELER",
  "date": "2026-11-28",
  "startTime": "15:00",
  "durationHours": 3
}
```
- **Tests Script:**
```javascript
pm.test("Status code is 201 Created", () => {
    pm.response.to.have.status(201);
});
```

---

### Request 4: Verify Double-Booking Prevention (Expected 409 Conflict)
Re-send **Request 3** immediately with the identical `slotId` and `date`.
- **Expected Status:** `409 Conflict`
- **Tests Script:**
```javascript
pm.test("Status code is 409 Conflict", () => {
    pm.response.to.have.status(409);
});
pm.test("Error message returned", () => {
    const data = pm.response.json();
    pm.expect(data.error).to.include("Double");
});
```

---

### Request 5: Admin Login & Analytics Test
- **Method:** `POST`
- **URL:** `{{base_url}}/auth/login`
- **Body:**
```json
{
  "email": "admin@parkify.com",
  "password": "admin123"
}
```
Save the returned token as `admin_token`.

- **Method:** `GET`
- **URL:** `{{base_url}}/admin/analytics`
- **Headers:**
  - `Authorization: Bearer {{admin_token}}`
- **Tests Script:**
```javascript
pm.test("Admin Analytics status 200", () => {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.data.totalSlots).to.be.a("number");
});
```
