# Local Setup Guide

## Folder structure (PH-Healthcare style)

```text
backend/
├── index.js                 # Entry (local + Vercel)
├── src/
│   ├── server.js            # DB connect + listen
│   ├── app.js               # Express app + route mounts
│   └── app/
│       ├── config/          # Env config
│       ├── lib/             # database, firebase, stripe, bootstrap
│       ├── middleware/      # checkAuth, validateRequest, errors
│       ├── utils/           # pricing, trackingId, deliveryStatus, …
│       ├── interfaces/
│       └── module/
│           ├── user/        # user.route / .controller / .model
│           ├── parcel/
│           ├── payment/
│           ├── rider/
│           ├── tracking/
│           ├── contact/
│           └── review/
├── package.json
└── vercel.json
```

## Prerequisites

1. **Node.js** 18+
2. **MongoDB Atlas** credentials
3. **Firebase** service account (base64 in `.env`)
4. **Stripe** secret key

## Installation

```bash
npm install
```

Create `backend/.env`:

```env
PORT=5001
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
FB_SERVICE_KEY=your_base64_encoded_firebase_service_account_key
STRIPE_SECRET_KEY=sk_test_xxx
SITE_DOMAIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

### Firebase service account → base64

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\serviceAccountKey.json"))
```

```bash
# Mac/Linux
base64 -i path/to/serviceAccountKey.json
```

## Run

```bash
npm run dev
```

API: `http://localhost:5001` (or your `PORT`)

## Notes

- Public API paths are unchanged (`/users`, `/parcels`, `/riders`, …).
- Only folder layout + Express `Router` style were standardized.
- `.env` is gitignored — do not commit secrets.
