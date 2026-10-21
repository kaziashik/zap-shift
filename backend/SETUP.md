# ZapShift Backend — Setup

## Architecture (standardized)

```text
backend/
├── index.js                 # Vercel entry (re-exports src/server handler)
├── src/
│   ├── server.js            # Single startup entry (listen only when run directly)
│   ├── app.js               # createApp() only — Express, CORS, routes, errors
│   ├── app/
│   │   ├── config/
│   │   ├── lib/             # database, firebase, stripe, bootstrap
│   │   ├── middleware/      # requireAuth, requireAdmin, requireRider, …
│   │   ├── utils/
│   │   └── interfaces/
│   └── modules/             # feature modules
│       ├── user/            # route · controller · model
│       ├── parcel/
│       ├── payment/
│       ├── rider/
│       ├── tracking/
│       ├── contact/         # + contact.validator.js
│       └── review/
├── tests/
│   └── smoke.test.js
├── package.json
└── vercel.json
```

**Rules**
- Importing `src/server.js` / `createApp` does **not** auto-start the server.
- Run `node src/server.js` (or `npm run dev`) to listen locally.
- Controllers call models; routes stay thin; DB connect stays in `lib/database.js`.

## Env

```env
PORT=5001
DB_USER=
DB_PASS=
FB_SERVICE_KEY=
STRIPE_SECRET_KEY=
SITE_DOMAIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

## Run

```bash
npm install
npm run dev
```

```bash
npm test
```

API: `http://localhost:5001`
