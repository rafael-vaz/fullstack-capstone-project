# GiftLink

GiftLink is a full-stack sample application for a community gift-sharing platform. Users can register, log in, browse and search donated items, and view details for a specific gift. The project is split into two independently deployable packages:

| Package | Description | Docs |
| --- | --- | --- |
| [`giftlink-backend`](giftlink-backend) | REST API built with Express and MongoDB (authentication, gifts, search) | [giftlink-backend/README.md](giftlink-backend/README.md) |
| [`giftlink-frontend`](giftlink-frontend) | Single-page application built with Create React App | [giftlink-frontend/README.md](giftlink-frontend/README.md) |

## Repository layout

```
.
├── giftlink-backend/    # express + mongodb api
├── giftlink-frontend/   # react spa (create react app)
└── .github/workflows/   # ci: jshint lint + frontend production build
```

There is no root `package.json`; the two packages are managed independently, each with its own `npm install` and scripts. See each package's README for details.

## Prerequisites

- Node.js 20.x and npm 10.x (matches [`.github/workflows/main.yml`](.github/workflows/main.yml))
- A reachable MongoDB instance (local, containerized, or Atlas) for the backend

## Quick start

```bash
# 1. backend
cd giftlink-backend
cp .env.sample .env   # fill in MONGO_URL and JWT_SECRET
npm install
npm run dev            # http://localhost:3060

# 2. frontend (separate terminal)
cd giftlink-frontend
cp .env.sample .env    # set REACT_APP_BACKEND_URL to the backend url above
npm install
npm start               # http://localhost:3000
```

Full setup, environment variables, available scripts, and API/route references live in the package-level READMEs linked above.

## Continuous integration

[`.github/workflows/main.yml`](.github/workflows/main.yml) runs on every push and pull request to `main`/`master`:

| Job | What it does |
| --- | --- |
| `lint_js` | Runs JSHint against the backend entry point and route files, using [`giftlink-backend/.jshintrc`](giftlink-backend/.jshintrc) |
| `client_build` | Installs frontend dependencies and runs a production build (`npm run build`) with warnings treated as errors |

## Security notes

- Never commit `.env` files — only `.env.sample` templates are versioned (see the root [`.gitignore`](.gitignore)).
- If you ever find real credentials committed to git history, rotate them immediately; removing a file from tracking does not erase earlier commits.

## Known limitations

- No root-level workspace tooling (npm workspaces/Lerna); each package must be installed and run separately.
- The backend has no automated test suite yet (`npm test` runs Mocha but no test files exist).
- The CI pipeline lints and builds the code but does not run it against a live database.
