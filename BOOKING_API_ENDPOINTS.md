# Booking API Endpoints

## Public Endpoints (No Auth Required)

- **GET** `/api/booking/public/branches`  
  List all branches.

- **GET** `/api/booking/public/branches/:id`  
  Get branch details by ID.

- **GET** `/api/booking/public/promos`  
  Get promos for a branch.

- **GET** `/api/booking/public/slots?branch_id=34&date=YYYY-MM-DD`  
  Get available slots for a branch and date. Supports `branch_id` or `alias`.

- **POST** `http://192.168.4.143/api/booking/public/bookings`  
  Submit a booking.  
  **Body:** `{
  "slot_id": "number|string (required)",
  "user_name": "string (required)",
  "user_email": "string (optional)",
  "user_phone": "string (optional)",
  "party_size": "number (optional, default 1)",
  "note": "string (optional)",
  "promo_id": "number (optional)"
}`
**Sample Body:**
```
{
  "slot_id": 101,
  "user_name": "Juan Dela Cruz",
  "user_email": "juan.delacruz@email.com",
  "user_phone": "09171234567",
  "party_size": 2,
  "note": "Birthday reservation",
  "promo_id": 5
}
```
Success Response:
{
  "success": true,
  "message": "Booking submitted! Please wait for confirmation.",
  "booking": {
    "id": 123,
    "user_name": "Juan Dela Cruz",
    "party_size": 2,
    "status": "pending",
    "slot": {
      "date": "2026-03-25",
      "time_start": "09:00",
      "time_end": "21:00",
      "branch_id": 34
    }
  }
}



---

## Manager/Admin Endpoints (Auth Required)

- **PUT** `/api/booking/branches/mine`  
  Update own branch info (title, description, contact, image).

- **GET** `/api/booking/slots?date=YYYY-MM-DD`  
  Get slots for a date (manager's branch).

- **POST** `/api/booking/slots/bulk`  
  Bulk create slots.

- **POST** `/api/booking/slots`  
  Create a slot.

- **PUT** `/api/booking/slots/:id`  
  Update a slot.

- **DELETE** `/api/booking/slots/:id`  
  Deactivate a slot.

- **GET** `/api/booking/bookings/summary?date=YYYY-MM-DD&branch_id=...`  
  Get booking summary for a date and branch.

- **GET** `/api/booking/bookings?date=&status=&search=&page=&limit=&branch_id=`  
  List bookings (with filters).

- **GET** `/api/booking/bookings/:id`  
  Get booking by ID.

- **PATCH** `/api/booking/bookings/:id/status`  
  Update booking status.

---

## Admin Only

- **PUT** `/api/booking/branches/:id`  
  Update any branch by ID.

---

## Notes
- All manager/admin endpoints require JWT authentication and proper role.
- For full request/response details, see the backend controller logic in `controllers/BookingController.js` and `routes/bookingRoutes.js`.
