# GiftLink Frontend

Single-page application for the GiftLink platform, built with [Create React App](https://create-react-app.dev/). Consumes the API in [`giftlink-backend`](../giftlink-backend) — see the [monorepo README](../README.md) for how the two packages fit together.

## Tech stack

- React 18, React Router 6
- Bootstrap 5 / React-Bootstrap for styling
- Create React App / `react-scripts` 5 (Webpack, Babel, Jest, ESLint under the hood)

## Prerequisites

- Node.js 20.x and npm 10.x
- A running instance of `giftlink-backend` (locally or deployed) to point this app at

## Installation

```bash
cd giftlink-frontend
npm install
```

## Environment variables

Copy the sample file and set the backend URL — `.env` is gitignored and must never be committed:

```bash
cp .env.sample .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `REACT_APP_BACKEND_URL` | yes | Base URL of the running `giftlink-backend` API, e.g. `http://localhost:3060` |

Create React App only exposes variables prefixed with `REACT_APP_` to the client bundle, and it reads `.env` at build/start time — restart `npm start` after changing it.

## Running

```bash
npm start
```

Opens `http://localhost:3000` with hot reload.

## Validation

```bash
npm test        # jest + react-testing-library runner (no test files exist yet)
CI=true npm run build   # production build; CI=true treats eslint warnings as errors, matching the CI job
```

CI runs the production build the same way via [`.github/workflows/main.yml`](../.github/workflows/main.yml).

## Available routes

| Path | Component | Notes |
| --- | --- | --- |
| `/`, `/app` | `MainPage` | Gift listing |
| `/app/login` | `LoginPage` | |
| `/app/register` | `RegisterPage` | |
| `/app/search` | `SearchPage` | Filter by category, condition, age, and name |
| `/app/product/:productId` | `DetailsPage` | Single gift detail + static comments |
| `/app/profile` | `Profile` | Requires an `auth-token` in `sessionStorage`; redirects to login otherwise |

Authentication state is kept in `sessionStorage` (`auth-token`, `name`, `email`) and exposed to components through `src/context/AuthContext.js`.

## Project structure

```
giftlink-frontend/
├── public/                    # static assets, index.html, standalone home.html
├── src/
│   ├── components/            # one folder per page/route (MainPage, LoginPage, ...)
│   ├── context/AuthContext.js # login state shared across the app
│   ├── config.js              # reads REACT_APP_BACKEND_URL
│   ├── App.js                 # route definitions
│   └── index.js                # app entry point
└── package.json
```

## Known limitations

- `react-scripts` 5 is the last CRA major release; several dev-dependency vulnerabilities reported by `npm audit` only have fixes via `--force`, which downgrades `react-scripts` to a broken version, so they are left unresolved for now (see the root README's security notes).
- No test files exist yet, even though `@testing-library/react` and `@testing-library/jest-dom` are already installed.
- The "Home" navbar link points to the static `public/home.html` page instead of an in-app route, by design.
