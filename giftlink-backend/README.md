# GiftLink Backend

REST API for the GiftLink platform: user authentication and gift/search endpoints backed by MongoDB. Built with Node.js and Express. See the [monorepo README](../README.md) for the overall project and the [frontend README](../giftlink-frontend/README.md) for the client that consumes this API.

## Tech stack

- Node.js / Express 4
- MongoDB (official `mongodb` driver, no ODM)
- JSON Web Tokens (`jsonwebtoken`) for auth, `bcryptjs` for password hashing
- `express-validator` for request validation
- `pino` / `pino-http` for structured logging

## Prerequisites

- Node.js 20.x and npm 10.x
- A reachable MongoDB instance (local, Docker, or a hosted cluster)

## Installation

```bash
cd giftlink-backend
npm install
```

## Environment variables

Copy the sample file and fill in real values — `.env` is gitignored and must never be committed:

```bash
cp .env.sample .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URL` | yes | MongoDB connection string, e.g. `mongodb://user:password@host:27017` |
| `JWT_SECRET` | yes | Secret used to sign authentication tokens; use a long random value, never the sample placeholder |
| `NODE_ENV` | no | Set to `production` to switch logging to structured JSON (pino) instead of pretty-printed console output |

On startup, `app.js` also connects to MongoDB once and seeds the `gifts` collection from `util/import-mongo/gifts.json` if it is empty (see `util/import-mongo/index.js`).

## Running

```bash
npm run dev     # nodemon, auto-restarts on file changes
npm start       # node app.js
```

The server listens on port `3060` (`http://localhost:3060`).

## Validation

```bash
npx jshint app.js routes/*.js models/db.js util/import-mongo/index.js logger.js
npm test         # runs mocha (no test files yet, see Known limitations)
```

CI runs the same JSHint check via [`.github/workflows/main.yml`](../.github/workflows/main.yml), using the `.jshintrc` in this directory.

## API reference

Base path for all routes below: `http://localhost:3060`.

### Health

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Basic liveness check |

### Auth (`/api/auth`)

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{ firstName, lastName, email, password }` | Creates a user, returns `{ authtoken, email }` |
| POST | `/api/auth/login` | `{ email, password }` | Returns `{ authtoken, userName, userEmail }` |
| PUT | `/api/auth/update` | `{ name }`, header `Email: <email>` | Updates the signed-in user's first name |

### Gifts (`/api/gifts`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/gifts` | Lists all gifts |
| GET | `/api/gifts/:id` | Returns a single gift by `id` |
| POST | `/api/gifts` | Creates a gift from the request body |

### Search (`/api/search`)

| Method | Path | Query params | Description |
| --- | --- | --- | --- |
| GET | `/api/search` | `name`, `category`, `condition`, `age_years` | Filters gifts; `name` does a case-insensitive partial match, `age_years` matches gifts at or below the given age |

## Project structure

```
giftlink-backend/
├── app.js                    # express app, middleware and route wiring
├── logger.js                 # shared pino logger (pretty in dev, json in production)
├── models/db.js               # mongodb connection (singleton client)
├── routes/
│   ├── authRoutes.js          # register / login / update
│   ├── giftRoutes.js          # list / get / create gifts
│   └── searchRoutes.js        # filtered gift search
├── util/import-mongo/         # one-off seed script + gifts.json fixture
└── .jshintrc                  # shared jshint config (esversion 11, node globals)
```

## Known limitations

- No automated tests: `npm test` runs Mocha, but the `test/` directory does not exist yet, even though `chai`, `sinon`, and `supertest` are already installed as dev dependencies.
- No request-rate limiting or centralized input sanitization beyond `express-validator` on the update route.
- The database seed step (`util/import-mongo`) always runs on `app.js` startup; there is no flag to skip it in environments where that is undesirable.
