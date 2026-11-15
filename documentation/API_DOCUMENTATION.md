# PARKIFY REST API Endpoints Specification

Complete endpoint reference for PARKIFY REST API (Program 4 & Program 5).

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 User Registration
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Access:** Public
- **Request Body (JSON):**
```json
{
  "name": "Vikram Mehta",
  "email": "vikram@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Vikram Mehta",
    "email": "vikram@example.com",
    "role": "user"
  }
}
```

### 1.2 User Login
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Access:** Public
- **Request Body (JSON):**
```json
{
  "email": "user@parkify.com",
  "password": "user123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Vikram Mehta",
    "email": "user@parkify.com",
    "role": "user",
    "phone": "9123456789"
  }
}
```

---

## 2. Parking Locations Endpoints (`/api/locations`)

### 2.1 Get All Locations
- **Method:** `GET`
- **URL:** `/api/locations`
- **Access:** Public
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Cyber City Corporate Parking",
      "address": "DLF Phase 2, Sector 24",
      "city": "Gurugram",
      "hourlyRate": 60.0,
      "totalSlots": 6,
      "availableSlots": 5
    }
  ]
}
```

### 2.2 Create Location (Admin Only)
- **Method:** `POST`
- **URL:** `/api/locations`
- **Header:** `Authorization: Bearer <ADMIN_JWT>`
- **Request Body:**
```json
{
  "name": "Indiranagar Metro Bay",
  "address": "100 Feet Road",
  "city": "Bengaluru",
  "hourlyRate": 50,
  "description": "Multi-tier covered parking"
}
```

---

## 3. Slot Management Endpoints (`/api/slots`)

### 3.1 Get Slots by Location
- **Method:** `GET`
- **URL:** `/api/slots/location/:locationId`
- **Access:** Public
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "id": 1,
      "locationId": 1,
      "slotNumber": "CC-01",
      "type": "FOUR_WHEELER",
      "status": "AVAILABLE",
      "hourlyRate": 60,
      "floor": "Ground"
    }
  ]
}
```

---

## 4. Booking Endpoints (`/api/bookings`)

### 4.1 Create Slot Booking (Protected)
- **Method:** `POST`
- **URL:** `/api/bookings`
- **Header:** `Authorization: Bearer <USER_JWT>`
- **Request Body:**
```json
{
  "locationId": 1,
  "slotId": 1,
  "vehicleNumber": "DL-01-AB-1234",
  "vehicleType": "FOUR_WHEELER",
  "date": "2026-11-20",
  "startTime": "14:00",
  "durationHours": 3
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Parking slot booked successfully!",
  "data": {
    "id": 10,
    "bookingCode": "PKF-749214",
    "vehicleNumber": "DL-01-AB-1234",
    "date": "2026-11-20",
    "durationHours": 3,
    "ratePerHour": 60,
    "totalAmount": 180,
    "status": "CONFIRMED"
  }
}
```

### 4.2 Double-Booking Collision Error
- **Response (409 Conflict):**
```json
{
  "success": false,
  "error": "Slot CC-01 is already booked for date 2026-11-20. Double reservation prevented."
}
```

### 4.3 Cancel Booking
- **Method:** `PUT`
- **URL:** `/api/bookings/:id/cancel`
- **Header:** `Authorization: Bearer <USER_JWT>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully. Slot has been released.",
  "data": {
    "id": 10,
    "status": "CANCELLED"
  }
}
```

---

## 5. Admin Endpoints (`/api/admin`)

### 5.1 Analytics Metrics
- **Method:** `GET`
- **URL:** `/api/admin/analytics`
- **Header:** `Authorization: Bearer <ADMIN_JWT>`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalLocations": 3,
    "totalSlots": 13,
    "occupiedSlots": 2,
    "availableSlots": 11,
    "occupancyRatePercent": 15.4,
    "totalBookings": 8,
    "activeBookings": 6,
    "totalRevenueRupees": 940,
    "totalUsers": 12
  }
}
```
