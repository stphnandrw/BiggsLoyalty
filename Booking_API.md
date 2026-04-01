# Biggs Restaurant Booking API — Prompt Instructions

You are an expert Node.js backend developer. Build a REST API called the **Biggs Restaurant Booking System** using **Express.js** and **PostgreSQL**. Follow every instruction below exactly.

---

## Project Overview

Biggs is a restaurant chain with multiple branches. Each branch has one manager account. The system has two sides:

- **Manager side** (authenticated) — sets available time slots for booking, views and confirms or cancels customer reservations, and **can update their own assigned branch info** (title, description, contact, image filename)
- **Customer side** (public, no login) — browses branches with full image URLs, picks a date, sees available slots, and submits a booking

There is no super admin, no user registration. Manager accounts are pre-seeded. Each manager is locked to their own branch and **cannot touch another branch's data**.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (`pg` library with connection pool)
- **Auth:** JWT via `jsonwebtoken`, passwords hashed with `bcryptjs`
- **Other packages:** `cors`, `dotenv`

---

## Project Folder Structure

Generate exactly this structure:

```
biggs-booking-api/
├── config/
│   ├── db.js
│   └── imageUrl.js
├── controllers/
│   ├── AuthController.js
│   ├── BranchController.js
│   ├── SlotController.js
│   └── BookingController.js
├── middlewares/
│   └── auth.js
├── models/
│   ├── ManagerModel.js
│   ├── BranchModel.js
│   ├── SlotModel.js
│   └── BookingModel.js
├── routes/
│   └── index.js
├── schema.sql
├── seed.js
├── index.js
└── .env.example
```

---

## Environment Variables (.env.example)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=biggs_booking
JWT_SECRET=change_this_to_something_long_and_random
JWT_EXPIRES_IN=7d
IMAGE_BASE_URL=https://biggs.ph/biggs_website/controls/uploads
```

> `IMAGE_BASE_URL` is the base path for all branch images. **Never hardcode this URL** anywhere in the codebase — always read it from `process.env.IMAGE_BASE_URL`.

---

## Image URL Rule

Branch images are stored in the database as **filenames only** (e.g. `693921b9854ee.jpg`).

Whenever a branch object is returned in **any** API response, build the full `image_url` by combining:

```
process.env.IMAGE_BASE_URL + '/' + image_filename
```

**Example:**
- Stored in DB: `693921b9854ee.jpg`
- Returned in response: `https://biggs.ph/biggs_website/controls/uploads/693921b9854ee.jpg`

### config/imageUrl.js

Create this helper and import it wherever branches are returned:

```js
const getImageUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.IMAGE_BASE_URL}/${filename}`;
};

module.exports = getImageUrl;
```

Apply `getImageUrl` in **every** place a branch is included in a response:
- Public branch list
- Single branch detail
- Login response (`manager.branch`)
- `GET /auth/me` response
- Any slot or booking response that includes branch info

**Never return the raw `image` filename** in a response — always return the full `image_url`.

---

## Frontend Branch ID Mapping

The frontend uses the following **exact IDs** to identify branches. The `managers` table must store a `branch_id` column that matches these IDs so the frontend can link data correctly.

| branch_id | title              | image filename                    | contact        |
|-----------|--------------------|-----------------------------------|----------------|
| 14        | BIGGS GOA          | 66cfc35ea11a53.96310693.png       | 0928-664-4114  |
| 15        | BIGGS IRIGA        | 66cfc377c70269.53103733.png       | 0907-904-1992  |
| 17        | BIGGS SM NAGA      | 66cfc38323d474.17095477.png       | 0994-230-9660  |
| 27        | BIGGS BIA          | 66cfc38d5b1b80.27307739.png       | 0935-110-1728  |
| 28        | BIGGS CAMALIG      | 66cfc39916bc82.93169621.png       | 0917-143-0122  |
| 29        | BIGGS SM SORSOGON  | 66cfc3a3def788.38085444.png       | 0995-192-1944  |
| 31        | BIGGS BARLIN       | 66cfc3b1993744.61993949.png       | 0916-332-2258  |
| 32        | BIGGS ROBINSON     | 66cfc3bbad9b67.52558676.png       | 0995-842-4394  |
| 33        | BIGGS EMERALD      | 66cfc3c67b5e40.59990367.png       | 0992-961-9982  |
| 34        | BIGGS CENTRO NAGA  | 66cfc3d889cd52.61111850.png       | 0956-934-0799  |
| 35        | BIGGS PILI         | 66cfc3e3c61d31.17410180.png       | 0917-172-4447  |
| 36        | BIGGS PACIFIC MALL | 66cfc3f25edf53.62313944.png       | 0916-332-2158  |
| 37        | BIGGS MAGSAYSAY    | 66e137179edec5.34862951.png       | 0993-613-7348  |
| 38        | BIGGS SM LEGAZPI   | 66e2949022957.jpg                 | 0917-715-3367  |
| 39        | BIGGS AYALA MALLS  | 66e294c99bc2a.png                 | 0917-165-5000  |
| 40        | BIGGS SM LIPA      | 672c7801eac71.jpg                 | 0916-332-2017  |
| 41        | BIGGS BMC          | 673159eb7e645.JPG                 | 0970-668-1150  |
| 43        | BIGGS DAET         | 6731701c13b57.jpg                 | 0991-176-7214  |
| 44        | BIGGS SIPOCOT      | 67329df07e215.jpg                 | 0994-757-1807  |
| 45        | BIGGS MASBATE      | 67329ed827ab8.jpg                 | 0916-332-2123  |
| 46        | BIGGS OLD ALBAY    | 6732a223080c2.JPG                 | 0916-332-2177  |
| 48        | BIGGS POLANGUI     | 675819bb143bb.jpeg                | 09076311821    |
| 49        | BIGGS PAGBILAO     | 693920dfd1185.jpg                 | 09278854651    |
| 50        | BIGGS GRANDE       | 693921b9854ee.jpg                 | 09275852042    |
| 51        | BIGGS TABACO       | 6964bd068d779.jpg                 | 09369558498    |

> The `branch_id` in the `managers` table must use these exact values. Use them as the primary key of the `branches` table with `INTEGER` type (not `SERIAL`) so IDs are fixed and match the frontend.

---

## Database Schema (schema.sql)

Create four tables. Use `TIMESTAMPTZ DEFAULT NOW()` and foreign key constraints.

### Table 1: branches
```sql
CREATE TABLE IF NOT EXISTS branches (
    id          INTEGER PRIMARY KEY,   -- use exact IDs from the mapping above, NOT SERIAL
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    contact     VARCHAR(30),
    image       VARCHAR(255),          -- filename only, e.g. 693921b9854ee.jpg
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table 2: managers
```sql
CREATE TABLE IF NOT EXISTS managers (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    branch_id   INTEGER NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Table 3: booking_slots
```sql
CREATE TABLE IF NOT EXISTS booking_slots (
    id          SERIAL PRIMARY KEY,
    manager_id  INT  NOT NULL REFERENCES managers(id) ON DELETE CASCADE,
    branch_id   INT  NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    slot_date   DATE NOT NULL,
    time_start  TIME NOT NULL,
    time_end    TIME NOT NULL,
    max_seats   INT  NOT NULL DEFAULT 20,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (branch_id, slot_date, time_start)
);
```

### Table 4: bookings
```sql
CREATE TABLE IF NOT EXISTS bookings (
    id          SERIAL PRIMARY KEY,
    slot_id     INT          NOT NULL REFERENCES booking_slots(id) ON DELETE CASCADE,
    branch_id   INT          NOT NULL REFERENCES branches(id),
    manager_id  INT          NOT NULL REFERENCES managers(id),
    user_name   VARCHAR(100) NOT NULL,
    user_email  VARCHAR(100),
    user_phone  VARCHAR(30),
    party_size  INT  NOT NULL DEFAULT 1,
    note        TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_slots_branch_date  ON booking_slots(branch_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_slot      ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_branch    ON bookings(branch_id);
CREATE INDEX IF NOT EXISTS idx_bookings_manager   ON bookings(manager_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status    ON bookings(status);
```

### Auto updated_at Trigger
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_branches_updated_at
    BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_slots_updated_at
    BEFORE UPDATE ON booking_slots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
```

---

## config/db.js

Create a `pg.Pool` using environment variables. Export the pool. Add `pool.on('error', ...)` to log unexpected errors.

---

## config/imageUrl.js

```js
const getImageUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.IMAGE_BASE_URL}/${filename}`;
};

module.exports = getImageUrl;
```

---

## middlewares/auth.js

Export a single middleware called `authenticate`:
- Reads `Authorization` header, expects `Bearer <token>`
- Returns `401` if missing or malformed
- Verifies using `process.env.JWT_SECRET`
- Attaches decoded payload to `req.manager` (contains `id`, `username`, `branch_id`)
- Returns `401` with `'Invalid or expired token.'` on failure

---

## models/BranchModel.js

Export an object with these methods:

### `getAll()`
Query all branches. Return each branch with `image_url` built via `getImageUrl(row.image)`. Do **not** return the raw `image` field.

```sql
SELECT id, title, description, contact, image, updated_at FROM branches ORDER BY title
```

### `getById(id)`
Same as above but WHERE `id = $1`. Returns `null` if not found.

### `update(branchId, fields)`
Only the manager of this branch may call this — enforce that in the controller, not this model.

Allowed fields to update: `title`, `description`, `contact`, `image`.

Dynamically build the SET clause with `$N` placeholders. Append `WHERE id = $N`. Return the updated row with `image_url` applied.

---

## models/ManagerModel.js

Export an object with these methods:

### `findByEmail(email)`
```sql
SELECT m.*, b.title AS branch_title, b.image AS branch_image,
       b.description AS branch_description, b.contact AS branch_contact
FROM managers m
JOIN branches b ON b.id = m.branch_id
WHERE m.email = $1 AND m.is_active = TRUE
```
Returns the full row including `password`.

### `findById(id)`
Same JOIN as above. Returns `id, username, email, branch_id, branch_title, branch_image, branch_description, branch_contact, created_at`. No `password`.

### `comparePassword(plain, hash)`
Uses `bcrypt.compare`. Returns boolean.

### `signToken(manager)`
Signs JWT with payload `{ id, username, branch_id }`. Uses `process.env.JWT_SECRET` and `process.env.JWT_EXPIRES_IN`.

### `create({ username, email, password, branch_id })`
Hashes password (bcrypt, salt 10). Inserts into `managers`. Returns new `id`. Used only by seeder.

---

## models/SlotModel.js

### `getByDate(branchId, date)`
```sql
SELECT s.*,
  s.max_seats - COALESCE(
    (SELECT SUM(b.party_size) FROM bookings b
     WHERE b.slot_id = s.id AND b.status != 'cancelled'), 0
  ) AS seats_remaining,
  (SELECT COUNT(*) FROM bookings b
   WHERE b.slot_id = s.id AND b.status != 'cancelled') AS total_bookings
FROM booking_slots s
WHERE s.branch_id = $1 AND s.slot_date = $2
ORDER BY s.time_start
```

### `getById(slotId, branchId)`
WHERE `id = $1 AND branch_id = $2`. Returns `null` if not found.

### `create({ managerId, branchId, slot_date, time_start, time_end, max_seats })`
INSERT with `ON CONFLICT (branch_id, slot_date, time_start) DO UPDATE SET time_end, max_seats, is_active = TRUE, updated_at = NOW()`. Return full row.

### `bulkCreate(managerId, branchId, slot_date, slots)`
Open a pg client. `BEGIN`. Loop and upsert each slot. `COMMIT`. On error `ROLLBACK`. Always `release()`. Return array of rows.

### `update(slotId, branchId, fields)`
Allowed fields: `max_seats`, `time_start`, `time_end`, `is_active`. Dynamic SET. `WHERE id = $N AND branch_id = $N`. Return updated row or `null`.

### `deactivate(slotId, branchId)`
Check confirmed bookings first. If any exist, throw `new Error('Cannot deactivate a slot with confirmed bookings.')`. Otherwise set `is_active = FALSE`. Return row or `null`.

---

## models/BookingModel.js

### `create({ slot_id, user_name, user_email, user_phone, party_size, note })`
1. Query slot with `seats_remaining` calculated inline. WHERE `id = $1 AND is_active = TRUE AND slot_date >= CURRENT_DATE`.
2. If not found: throw `'This time slot is not available.'`
3. If `party_size > seats_remaining`: throw `'Only N seats remaining for this slot.'`
4. INSERT into `bookings` using `slot.manager_id` and `slot.branch_id`.
5. Return `{ booking: row, slot }`.

### `getAll({ managerId, branchId, date, status, page, limit })`
- Always filter `b.manager_id = $1`
- Optional filters: `s.slot_date`, `b.status`
- JOIN `booking_slots` for `slot_date, time_start, time_end`
- JOIN `branches` for `branch_title = br.title` and `branch_image = br.image`
- Apply `getImageUrl` to `branch_image` before returning
- Paginate with LIMIT/OFFSET
- Return `{ bookings, total }`

### `getById(bookingId, managerId)`
JOIN `bookings → booking_slots → branches → managers`. WHERE `b.id = $1 AND b.manager_id = $2`. Include `slot_date, time_start, time_end, branch_title, image_url`.

### `updateStatus(bookingId, managerId, status)`
UPDATE WHERE `id = $1 AND manager_id = $2`. Return updated row or `null`.

### `getSummary(managerId, date)`
Use `COUNT(*) FILTER (WHERE status = '...')` per status. `SUM(party_size) FILTER (WHERE status != 'cancelled')` as `total_guests`. JOIN `booking_slots` to filter by `slot_date = $2`. Return single row.

---

## controllers/AuthController.js

### `login(req, res)` — POST /api/auth/login
- Require `email` and `password`, else `400`
- `ManagerModel.findByEmail(email)` → `401` if not found
- `comparePassword` → `401` if false
- Build and return:
```json
{
  "success": true,
  "token": "<jwt>",
  "manager": {
    "id": 1,
    "username": "biggs_centro",
    "email": "centro@biggs.ph",
    "branch": {
      "id": 34,
      "title": "BIGGS CENTRO NAGA",
      "description": "...",
      "contact": "0956-934-0799",
      "image_url": "https://biggs.ph/biggs_website/controls/uploads/66cfc3d889cd52.61111850.png"
    }
  }
}
```

### `me(req, res)` — GET /api/auth/me
- `ManagerModel.findById(req.manager.id)` → `404` if not found
- Return same shape as login response (without token), with `image_url` applied to branch

---

## controllers/BranchController.js

### `getAll(req, res)` — GET /api/public/branches
- Call `BranchModel.getAll()`
- Return `{ success: true, branches }` with `image_url` on each branch

### `getById(req, res)` — GET /api/public/branches/:id
- Call `BranchModel.getById(req.params.id)`
- Return `404` if null
- Return `{ success: true, branch }` with `image_url`

### `update(req, res)` — PUT /api/branches/mine
- This route lets a manager update **only their own** branch
- The branch to update is `req.manager.branch_id` — **never trust a branch ID from the request body**
- Allowed body fields: `title`, `description`, `contact`, `image` (filename only)
- Call `BranchModel.update(req.manager.branch_id, req.body)`
- Return `{ success: true, message: 'Branch updated.', branch }` with `image_url`

---

## controllers/SlotController.js

### `getByDate(req, res)` — GET /api/slots?date=
- Require `date`, else `400`
- Call `SlotModel.getByDate(req.manager.branch_id, date)`
- Return `{ success: true, date, branch_id: req.manager.branch_id, slots }`

### `create(req, res)` — POST /api/slots
- Require `slot_date`, `time_start`, `time_end`, else `400`
- Call `SlotModel.create({ managerId: req.manager.id, branchId: req.manager.branch_id, ...req.body })`
- Return `201` with `{ success: true, message: 'Slot created.', slot }`

### `bulkCreate(req, res)` — POST /api/slots/bulk
- Require `slot_date` and non-empty `slots` array, else `400`
- Each slot must have `time_start` and `time_end`, else `400`
- Call `SlotModel.bulkCreate(req.manager.id, req.manager.branch_id, slot_date, slots)`
- Return `201` with `{ success: true, message: 'N slot(s) saved for DATE.', slots }`

### `update(req, res)` — PUT /api/slots/:id
- Call `SlotModel.update(req.params.id, req.manager.branch_id, req.body)`
- Return `404` if null, else `{ success: true, message: 'Slot updated.', slot }`

### `deactivate(req, res)` — DELETE /api/slots/:id
- Call `SlotModel.deactivate(req.params.id, req.manager.branch_id)`
- Catch confirmed-bookings error → `400`
- Return `404` if null, else `{ success: true, message: 'Slot deactivated.' }`

### `getPublic(req, res)` — GET /api/public/slots?branch_id=&date=
- Require `branch_id` and `date`, else `400`
- Query `booking_slots` WHERE `branch_id = $1 AND slot_date = $2 AND is_active = TRUE AND slot_date >= CURRENT_DATE`
- Compute `seats_remaining` inline
- Filter out slots where `seats_remaining <= 0`
- Return `{ success: true, branch_id, date, slots }`

---

## controllers/BookingController.js

### `create(req, res)` — POST /api/public/bookings
- Require `slot_id` and `user_name`, else `400`
- Call `BookingModel.create(req.body)`
- On error with `'seats'` or `'not available'` → `400`
- Return `201`:
```json
{
  "success": true,
  "message": "Booking submitted! Please wait for confirmation.",
  "booking": {
    "id": 1,
    "user_name": "Juan dela Cruz",
    "party_size": 4,
    "status": "pending",
    "slot": {
      "date": "2026-03-25",
      "time_start": "11:00:00",
      "time_end": "12:00:00",
      "branch_id": 34
    }
  }
}
```

### `getAll(req, res)` — GET /api/bookings
- Read `date`, `status`, `page`, `limit` from query
- Call `BookingModel.getAll({ managerId: req.manager.id, branchId: req.manager.branch_id, ... })`
- Return `{ success: true, total, bookings }`

### `getById(req, res)` — GET /api/bookings/:id
- Call `BookingModel.getById(req.params.id, req.manager.id)`
- Return `404` if null, else `{ success: true, booking }`

### `updateStatus(req, res)` — PATCH /api/bookings/:id/status
- Allow only `'confirmed'` or `'cancelled'`, else `400`
- Call `BookingModel.updateStatus(...)`
- Return `404` if null, else `{ success: true, message: 'Booking confirmed.' / 'Booking cancelled.', booking }`

### `getSummary(req, res)` — GET /api/bookings/summary
- Require `date`, else `400`
- Call `BookingModel.getSummary(req.manager.id, date)`
- Return `{ success: true, branch_id: req.manager.branch_id, date, summary }`

---

## routes/index.js

Mount all routes under `/api`. Register in this exact order:

```
// Auth
POST   /api/auth/login              → AuthController.login          (public)
GET    /api/auth/me                 → AuthController.me             (authenticate)

// Branch — manager edits their own branch
PUT    /api/branches/mine           → BranchController.update       (authenticate)

// Slots — manager manages availability
GET    /api/slots                   → SlotController.getByDate      (authenticate)  ?date=
POST   /api/slots                   → SlotController.create         (authenticate)
POST   /api/slots/bulk              → SlotController.bulkCreate     (authenticate)
PUT    /api/slots/:id               → SlotController.update         (authenticate)
DELETE /api/slots/:id               → SlotController.deactivate     (authenticate)

// Bookings — manager views and acts on reservations
GET    /api/bookings/summary        → BookingController.getSummary  (authenticate)  ?date=
GET    /api/bookings                → BookingController.getAll      (authenticate)  ?date= &status=
GET    /api/bookings/:id            → BookingController.getById     (authenticate)
PATCH  /api/bookings/:id/status     → BookingController.updateStatus (authenticate)

// Public — no auth required
GET    /api/public/branches         → BranchController.getAll       (public)
GET    /api/public/branches/:id     → BranchController.getById      (public)
GET    /api/public/slots            → SlotController.getPublic      (public)   ?branch_id= &date=
POST   /api/public/bookings         → BookingController.create      (public)
```

> **Critical:** `GET /api/bookings/summary` must be registered **before** `GET /api/bookings/:id`.

---

## index.js

- Load `dotenv`
- Create Express app
- Apply `cors()` and `express.json()`
- Mount router at `/api`
- `GET /health` → `{ status: 'ok' }`
- 404 handler for unmatched routes
- Global error handler
- Listen on `process.env.PORT || 3000`

---

## seed.js

Seed the `branches` table first (using the exact IDs from the mapping), then seed one manager per branch.

### Step 1 — Insert branches (exact IDs, not SERIAL)

```js
const branches = [
  { id: 14, title: 'BIGGS GOA',          description: '7:00AM - 8:00PM | With Function Hall | San Jose St., Goa, Camarines Sur',                                               contact: '0928-664-4114', image: '66cfc35ea11a53.96310693.png' },
  { id: 15, title: 'BIGGS IRIGA',         description: '8:00AM - 9:00PM | With FoodPanda & Function Hall | San Roque, Iriga City',                                              contact: '0907-904-1992', image: '66cfc377c70269.53103733.png' },
  { id: 17, title: 'BIGGS SM NAGA',       description: '10:00AM - 9:00PM | SM City Naga Triangulo 4400, Naga City, Camarines Sur',                                             contact: '0994-230-9660', image: '66cfc38323d474.17095477.png' },
  { id: 27, title: 'BIGGS BIA',           description: '4:00AM - 7:00PM | With FoodPanda | Bicol International Airport, Abolo, Daraga Albay',                                  contact: '0935-110-1728', image: '66cfc38d5b1b80.27307739.png' },
  { id: 28, title: 'BIGGS CAMALIG',       description: '24HRS | With FoodPanda & Function Hall | Bypass Road P1 Ilawod Camalig Albay',                                         contact: '0917-143-0122', image: '66cfc39916bc82.93169621.png' },
  { id: 29, title: 'BIGGS SM SORSOGON',   description: '8:00AM - 11:00PM | With FoodPanda | 187-188 G/F SM City Sorsogon, Maharlika Highway, Balogo Sorsogon City',            contact: '0995-192-1944', image: '66cfc3a3def788.38085444.png' },
  { id: 31, title: 'BIGGS BARLIN',        description: '7:00AM - 10:00PM | With FoodPanda & Function Hall | Calle Iglesia corner, Barlin Street, Santa Cruz, Naga City',       contact: '0916-332-2258', image: '66cfc3b1993744.61993949.png' },
  { id: 32, title: 'BIGGS ROBINSON',      description: '10:00AM - 9:00PM | G/F, Robinsons Place Naga, Roxas Avenue',                                                          contact: '0995-842-4394', image: '66cfc3bbad9b67.52558676.png' },
  { id: 33, title: 'BIGGS EMERALD',       description: '9AM - 9PM | With FoodPanda & Function Hall | Grand Emerald Plaza, San Felipe, Naga City',                              contact: '0992-961-9982', image: '66cfc3c67b5e40.59990367.png' },
  { id: 34, title: 'BIGGS CENTRO NAGA',   description: '24HRS | With FoodPanda & Function Hall | Elias Angeles St., Naga City',                                                contact: '0956-934-0799', image: '66cfc3d889cd52.61111850.png' },
  { id: 35, title: 'BIGGS PILI',          description: '24HRS | With FoodPanda & Function Hall | National Highway, Brgy. San Agustin, Pili, Camarines Sur',                    contact: '0917-172-4447', image: '66cfc3e3c61d31.17410180.png' },
  { id: 36, title: 'BIGGS PACIFIC MALL',  description: '10:00AM - 8:00PM | With FoodPanda & Function Hall | G/F, Pacific Mall, Legazpi City',                                  contact: '0916-332-2158', image: '66cfc3f25edf53.62313944.png' },
  { id: 37, title: 'BIGGS MAGSAYSAY',     description: '24HRS | With FoodPanda & Function Hall | Abella lot corner Magsaysay and Dayangdang St., Balatas Naga City',           contact: '0993-613-7348', image: '66e137179edec5.34862951.png' },
  { id: 38, title: 'BIGGS SM LEGAZPI',    description: '10:00AM - 9:00PM | 2/F SM City Legazpi, Legazpi City',                                                                contact: '0917-715-3367', image: '66e2949022957.jpg'              },
  { id: 39, title: 'BIGGS AYALA MALLS',   description: '10:00AM - 8:00PM | With FoodPanda | 2nd/F, Ayala Malls, Legazpi City',                                                 contact: '0917-165-5000', image: '66e294c99bc2a.png'              },
  { id: 40, title: 'BIGGS SM LIPA',       description: '10:00AM - 9:00PM | With FoodPanda | Ground/F, SM City Lipa',                                                           contact: '0916-332-2017', image: '672c7801eac71.jpg'              },
  { id: 41, title: 'BIGGS BMC',           description: '7:00AM - 9:00PM | With FoodPanda | J. Miranda Avenue Concepcion Penuena Naga City',                                    contact: '0970-668-1150', image: '673159eb7e645.JPG'              },
  { id: 43, title: 'BIGGS DAET',          description: '10:00AM - 9:00PM | With FoodPanda | 2/F SM City Daet, Camarines Norte',                                                contact: '0991-176-7214', image: '6731701c13b57.jpg'              },
  { id: 44, title: 'BIGGS SIPOCOT',       description: '24HRS | With Function Hall | Zone 4A Brgy. Tara, Sipocot Cam. Sur',                                                   contact: '0994-757-1807', image: '67329df07e215.jpg'              },
  { id: 45, title: 'BIGGS MASBATE',       description: '8:30AM - 8:00PM | With Function Hall | Gaisano Capital Masbate, Masbate City',                                         contact: '0916-332-2123', image: '67329ed827ab8.jpg'              },
  { id: 46, title: 'BIGGS OLD ALBAY',     description: '24HRS | With FoodPanda & Function Hall | Rizal Corner Ma. Clara Street, Brgy. 150 Ilawod East Pob. Legazpi City',     contact: '0916-332-2177', image: '6732a223080c2.JPG'              },
  { id: 48, title: 'BIGGS POLANGUI',      description: '7:00AM - 9:00PM | With FoodPanda & Function Hall | K&A Blgd, Centro Oriental, Polangui',                               contact: '09076311821',   image: '675819bb143bb.jpeg'             },
  { id: 49, title: 'BIGGS PAGBILAO',      description: '24HRS | With FoodPanda & Function Hall | Brgy. Talipan, Pagbilao, Quezon',                                             contact: '09278854651',   image: '693920dfd1185.jpg'              },
  { id: 50, title: 'BIGGS GRANDE',        description: '24HRS | With FoodPanda & Function Hall | Lot 8, Zone 2, Maharlika National Highway, Concepcion Grande, Naga City',     contact: '09275852042',   image: '693921b9854ee.jpg'              },
  { id: 51, title: 'BIGGS TABACO',        description: '24HRS | With FoodPanda & Function Hall | Ziga Avenue, Tabaco City, Albay',                                             contact: '09369558498',   image: '6964bd068d779.jpg'              },
];
```

Insert each branch:
```sql
INSERT INTO branches (id, title, description, contact, image)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (id) DO NOTHING
```

### Step 2 — Insert managers (one per branch, referencing branch_id)

| username           | email                   | branch_id |
|--------------------|-------------------------|-----------|
| biggs_goa          | goa@biggs.ph            | 14        |
| biggs_iriga        | iriga@biggs.ph          | 15        |
| biggs_smnaga       | smnaga@biggs.ph         | 17        |
| biggs_bia          | bia@biggs.ph            | 27        |
| biggs_camalig      | camalig@biggs.ph        | 28        |
| biggs_smsorsogon   | smsorsogon@biggs.ph     | 29        |
| biggs_barlin       | barlin@biggs.ph         | 31        |
| biggs_robinson     | robinson@biggs.ph       | 32        |
| biggs_emerald      | emerald@biggs.ph        | 33        |
| biggs_centro       | centro@biggs.ph         | 34        |
| biggs_pili         | pili@biggs.ph           | 35        |
| biggs_pacificmall  | pacificmall@biggs.ph    | 36        |
| biggs_magsaysay    | magsaysay@biggs.ph      | 37        |
| biggs_smlegazpi    | smlegazpi@biggs.ph      | 38        |
| biggs_ayala        | ayala@biggs.ph          | 39        |
| biggs_smlipa       | smlipa@biggs.ph         | 40        |
| biggs_bmc          | bmc@biggs.ph            | 41        |
| biggs_daet         | daet@biggs.ph           | 43        |
| biggs_sipocot      | sipocot@biggs.ph        | 44        |
| biggs_masbate      | masbate@biggs.ph        | 45        |
| biggs_oldalbay     | oldalbay@biggs.ph       | 46        |
| biggs_polangui     | polangui@biggs.ph       | 48        |
| biggs_pagbilao     | pagbilao@biggs.ph       | 49        |
| biggs_grande       | grande@biggs.ph         | 50        |
| biggs_tabaco       | tabaco@biggs.ph         | 51        |

- Default password for all: `Biggs@2024`
- Hash each password with `bcrypt` (salt 10)
- Use `ON CONFLICT (email) DO NOTHING`
- Wrap all inserts in a single transaction (`BEGIN / COMMIT / ROLLBACK`)
- Print each branch as it is inserted
- Call `process.exit()` when done

---

## Error Handling Rules

Apply consistently in all controllers:

| Situation | Status | Body |
|---|---|---|
| Missing required fields | `400` | `{ success: false, message: '...' }` |
| Not found / wrong manager | `404` | `{ success: false, message: '...' }` |
| Business rule violation | `400` | `{ success: false, message: err.message }` |
| PG unique violation (`err.code === '23505'`) | `409` | `{ success: false, message: '...' }` |
| All other errors | `500` | `{ success: false, message: 'Server error.' }` + `console.error(err)` |

---

## API Response Format

```json
{ "success": true, "data_key": ... }
{ "success": false, "message": "Human-readable error" }
```

For lists always include a `total` count alongside the array.

---

## Security Rules

- A manager can **only** read and modify data belonging to their own `branch_id`. Every query on `booking_slots` and `bookings` must include `branch_id = req.manager.branch_id` or `manager_id = req.manager.id`.
- For `PUT /api/branches/mine`, the branch ID comes from `req.manager.branch_id` — **never** from the request body or URL params.
- Never return the `password` field in any response.
- Never return the raw `image` filename — always return `image_url`.
- Public endpoints (`/api/public/*`) require no auth and expose only read-only data.

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in DB credentials and JWT secret

# 3. Create database and run schema
psql -U postgres -c "CREATE DATABASE biggs_booking;"
psql -U postgres -d biggs_booking -f schema.sql

# 4. Seed branches and managers
node seed.js

# 5. Start the server
npm start
```

Default password for all manager accounts after seeding: **`Biggs@2024`**
