# Zap Shift Server — API Documentation

## 1. About This Project

Zap Shift is a **parcel delivery backend** built with **Node.js + Express** and **MongoDB**. It manages three types of users — **regular users** (senders), **riders** (delivery agents), and **admins** — and handles the full lifecycle of a parcel: booking, payment, rider assignment, delivery, and tracking.

**Tech stack:**
- **Express.js** — REST API server
- **MongoDB** (native driver) — database
- **Firebase Admin SDK** — authentication (verifies ID tokens from the frontend)
- **Stripe** — payment processing

**User roles:** `user` (default) → `rider` → `admin`. Roles are stored on the user document and control what a request is allowed to do.

---

## 2. Authentication

There is **no `/login` or `/register` route on this backend.** Authentication happens on the **frontend** using Firebase Auth. The flow is:

1. User signs in on the frontend via Firebase (email/password, Google, etc.).
2. Firebase gives the frontend an **ID token**.
3. The frontend sends that token on every request to this backend as:
   ```
   Authorization: Bearer <firebase_id_token>
   ```
4. The backend's `verifyFBToken` middleware checks the token with Firebase Admin and attaches the user's email to the request (`req.decoded_email`).
5. Two extra middlewares gate certain routes:
   - `verifyAdmin` — only lets the request through if the user's role in the DB is `admin`.
   - `verifyRider` — only lets the request through if the user's role in the DB is `rider`.

**Every endpoint below is marked with what auth it needs.**

---

## 3. Project Folder Structure

```
server/
├── index.js                  # App entry point — starts server, wires up routes
├── config/
│   ├── database.js           # MongoDB connection
│   └── firebase.js            # Firebase Admin SDK setup
├── middleware/
│   ├── auth.js                # verifyFBToken, verifyAdmin, verifyRider
│   ├── collections.js         # attaches DB collections to each request
│   └── logging.js             # writes tracking log entries
├── models/                    # Data-access layer (one class per collection)
│   ├── User.js
│   ├── Rider.js
│   ├── Parcel.js
│   ├── Payment.js
│   ├── Tracking.js
│   └── index.js
├── controllers/                # Business logic for each route
│   ├── userController.js
│   ├── riderController.js
│   ├── parcelController.js
│   ├── paymentController.js
│   ├── trackingController.js
│   └── index.js
├── routes/                     # Route definitions (path + middleware + controller)
│   ├── users.js
│   ├── riders.js
│   ├── parcels.js
│   ├── payments.js
│   └── trackings.js
└── utils/
    └── trackingId.js            # generates unique tracking IDs (e.g. PRCL-20250101-ABC123)
```

**Request flow:** `routes/*.js` → (auth middleware) → `controllers/*.js` → `models/*.js` → MongoDB.

> ⚠️ **Known issue:** `payments.js` routes are currently **commented out** in `index.js`. Uncomment `paymentRoutes(app, controllers)` (and its `require`) to enable the Payments endpoints below.

---

## 4. API Endpoints

### 👤 Users

| # | Method | Endpoint | Auth Required | Description |
|---|--------|----------|----------------|-------------|
| 1 | `POST` | `/users` | None | Register a new user in the DB (called right after Firebase signup). Skips insert if email already exists. |
| 2 | `GET` | `/users?searchText=` | Any logged-in user | List users, optional search by name/email. |
| 3 | `GET` | `/users/:id` | Any logged-in user | Get a user by Mongo `_id`. Users can only view their own profile; admins can view anyone. |
| 4 | `GET` | `/users/:email/role` | Any logged-in user | Get a user's role by email. Users can only check their own; admins can check anyone's. |
| 5 | `PATCH` | `/users/:id/role` | Admin only | Change a user's role (`user` / `rider` / `admin`). |

**Create User — body example:**
```json
{
  "displayName": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/avatar.jpg",
  "role": "user"
}
```

---

### 🏍️ Riders

| # | Method | Endpoint | Auth Required | Description |
|---|--------|----------|----------------|-------------|
| 1 | `POST` | `/riders` | None | Apply to become a rider. Status defaults to `pending`. |
| 2 | `GET` | `/riders?status=&district=&workStatus=` | Any logged-in user | List riders, filterable by status/district/work status. |
| 3 | `GET` | `/riders/delivery-per-day` | Rider only | Delivered-parcel counts grouped by day, for the logged-in rider. |
| 4 | `PATCH` | `/riders/:id` | Admin only | Approve/reject a rider application. If approved, that email's user role is auto-set to `rider`. |

**Apply as Rider — body example:**
```json
{
  "name": "Jane Rider",
  "email": "rider@example.com",
  "age": 28,
  "district": "Dhaka",
  "phone": "01700000000",
  "nid": "1234567890",
  "bikeBrand": "Yamaha",
  "bikeRegNumber": "DHK-1234"
}
```

**Update Rider Status — body example:**
```json
{
  "status": "approved",
  "email": "rider@example.com"
}
```

---

### 📦 Parcels

| # | Method | Endpoint | Auth Required | Description |
|---|--------|----------|----------------|-------------|
| 1 | `POST` | `/parcels` | Any logged-in user | Book/create a new parcel. Server auto-sets `trackingId`, `senderEmail`, `createdAt`. |
| 2 | `GET` | `/parcels?email=&deliveryStatus=` | Any logged-in user | List parcels. Regular users see only their own; admins see all (or filter by `email`). |
| 3 | `GET` | `/parcels/rider?deliveryStatus=` | Rider only | Parcels assigned to the logged-in rider (excludes delivered ones by default). |
| 4 | `GET` | `/parcels/delivery-status/stats` | Admin only | Count of parcels grouped by delivery status. |
| 5 | `GET` | `/parcels/:id` | Any logged-in user | Get one parcel. Only the sender, assigned rider, or admin can view it. |
| 6 | `PATCH` | `/parcels/:id/status` | Assigned rider or Admin | Update delivery status. If set to `parcel_delivered`, rider's `workStatus` resets to `available`. |
| 7 | `PATCH` | `/parcels/:id` | Admin only | Assign a rider to a parcel (sets status to `driver_assigned`). |
| 8 | `DELETE` | `/parcels/:id` | Admin only | Delete a parcel. |

**Create Parcel — body example:**
```json
{
  "parcelName": "Sample Package",
  "parcelType": "document",
  "cost": 100,
  "senderName": "John Doe",
  "senderRegion": "Dhaka",
  "senderContact": "01700000000",
  "senderAddress": "House 1, Road 1",
  "receiverName": "Jane Smith",
  "receiverRegion": "Chattogram",
  "receiverContact": "01800000000",
  "receiverAddress": "House 2, Road 2",
  "deliveryStatus": "pending"
}
```

**Update Parcel Status — body example:**
```json
{
  "deliveryStatus": "parcel_delivered",
  "riderId": "<rider_mongo_id>",
  "trackingId": "PRCL-20250101-ABC123"
}
```

**Assign Rider To Parcel — body example:**
```json
{
  "riderId": "<rider_mongo_id>",
  "riderName": "Jane Rider",
  "riderEmail": "rider@example.com",
  "trackingId": "PRCL-20250101-ABC123"
}
```

---

### 💳 Payments
> ⚠️ Disabled by default — see the note in section 3.

| # | Method | Endpoint | Auth Required | Description |
|---|--------|----------|----------------|-------------|
| 1 | `POST` | `/payment-checkout-session` | None | Creates a Stripe Checkout session, returns `{ url }` to redirect the user to. |
| 2 | `PATCH` | `/payment-success?session_id=` | None | Called by the frontend after Stripe redirects back. Confirms payment, marks parcel as paid, logs a tracking event. |
| 3 | `GET` | `/payments?email=` | Any logged-in user | List payments. If filtering by `email`, it must match the logged-in user's own email. |

**Create Checkout Session — body example:**
```json
{
  "cost": 100,
  "parcelName": "Sample Package",
  "parcelId": "<parcel_mongo_id>",
  "trackingId": "PRCL-20250101-ABC123",
  "senderEmail": "john@example.com"
}
```

---

### 🚚 Tracking

| # | Method | Endpoint | Auth Required | Description |
|---|--------|----------|----------------|-------------|
| 1 | `GET` | `/trackings/:trackingId/logs` | Any logged-in user | Full log history for a parcel's tracking ID. Only the sender, assigned rider, or admin can view it. |

---

## 5. 🔒 Admin-Only Endpoints (Quick Reference)

All routes below require a Bearer token from a user whose role is `admin` (enforced by the `verifyAdmin` middleware). They're listed individually above too — this table just groups them in one place for quick reference.

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | `PATCH` | `/users/:id/role` | Change any user's role (`user` / `rider` / `admin`) |
| 2 | `PATCH` | `/riders/:id` | Approve or reject a rider application |
| 3 | `GET` | `/parcels/delivery-status/stats` | Parcel counts grouped by delivery status |
| 4 | `PATCH` | `/parcels/:id` | Assign a rider to a parcel |
| 5 | `DELETE` | `/parcels/:id` | Delete a parcel |

> Note: `PATCH /parcels/:id/status` (update delivery status) is **not** in this list — it can be done by an admin *or* the assigned rider, so it's not strictly admin-only.

---

## 6. Quick Reference — Roles & Access

| Role | Can do |
|------|--------|
| **user** (default) | Create/view own parcels, view own payments, apply as rider |
| **rider** | Everything a user can, plus: view assigned parcels, update delivery status, see own delivery stats |
| **admin** | Everything, plus: manage all users/riders/parcels, view stats, approve riders, assign riders, delete parcels |

There's no built-in way to become the first admin — set a user's `role` field to `"admin"` directly in MongoDB to bootstrap one.

---

## 7. Related Files

- Postman collection for testing all endpoints above: `zap-shift-server.postman_collection.json`
