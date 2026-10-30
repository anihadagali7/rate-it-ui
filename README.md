# rate-it-ui

Frontend for **Rate It**, a social app for discovering, rating, and organizing movies, TV shows, music, and books.

Built with **React**, **Vite**, **Material UI**, and **React Query**. It talks to the [rate-it-service](https://github.com/anihadagali7/rate-it-service) API for authentication, media metadata, ratings, playlists, wishlists, search, and social features.

## What it does

- **Home** — explore public ratings; logged-in users also see a feed from people they follow
- **Search** — search movies, TV, music, books, and users
- **Media pages** — view details, add ratings, save to wishlist, and add to playlists
- **Profiles** — view user ratings, wishlists, and playlists; follow/unfollow users
- **Account** — sign up, log in, edit profile, and reset password
- **Playlists & wishlists** — browse and manage personal collections

Protected routes require a valid JWT stored in `localStorage`. The app sends the token on API requests and redirects to `/login` when the session is missing or invalid.

## Prerequisites

- Node.js `24.x` (see `engines` in `package.json` and `.nvmrc`)
- npm `11.x`
- A running instance of **rate-it-service** (local or deployed)

## Environment variables

Copy `.env.example` to `.env` in the project root (`.env` is gitignored) and fill in the values:

```bash
cp .env.example .env
```

```env
VITE_BASE_URL=http://localhost:8080

VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

| Variable | Required | Notes |
|----------|----------|--------|
| `VITE_BASE_URL` | Yes | Base URL of the API (no trailing slash). `http://localhost:8080` for a local API, or `https://rate-it-service.herokuapp.com` for the dev Heroku API; never the production API while testing |
| `VITE_GOOGLE_CLIENT_ID` | For Google sign-in | OAuth client ID from Google Cloud Console. Never put the client *secret* here — that stays backend-only |

Code reads these values through `src/config.ts`. Locally, Vite compiles them in from `.env` at build time; only variables with the `VITE_` prefix reach the browser. On Heroku, `scripts/heroku-start.js` serves each app's own values as `/config.js` when the page loads, so one build works on every app in the pipeline (see [Notes for Heroku](#notes-for-heroku)).

On the API side, make sure `CORS_ORIGIN` includes your UI origin (e.g. `http://localhost:3000` locally, or your Heroku UI URL in production).

## Getting started

1. Pick an API. Either:

   - **Run it locally** (needed if you're changing the API too). Follow [rate-it-service](https://github.com/anihadagali7/rate-it-service)'s README; it runs on `http://localhost:8080`. Check that it's up and on the dev database:

     ```bash
     curl http://localhost:8080/api   # {"status":"UP","environment":"dev"}
     ```

   - **Use the dev Heroku API** (UI-only work, no local API or database needed). Set `VITE_BASE_URL=https://rate-it-service.herokuapp.com` in step 3. That's the staging API on the dev database, and it already allows `http://localhost:3000` in CORS. Never use `rate-it-service-prod`.

2. In this repo, switch to Node 24 and install dependencies (this also installs the Prettier pre-commit hook):

   ```bash
   nvm use
   npm install
   ```

3. Create `.env` from `.env.example` (see [Environment variables](#environment-variables)). `VITE_BASE_URL` (from step 1) is the only value you need. Never point it at the production API while testing.

4. Start the dev server:

   ```bash
   npm start
   ```

   The app runs at [http://localhost:3000](http://localhost:3000). It must be port 3000: the API's CORS allowlist and email links expect it.

## Using the app locally

- **Browse without an account:** Home, Search and media pages work logged out. Actions like rating or saving prompt you to log in.
- **Create an account:** go to `/signup` and sign up with email and password. You're logged in straight away. Google sign-ups are first asked to finish their profile at `/complete-profile`. Email verification isn't required to use the app. Without `BREVO_API_KEY` on the API, no verification email is sent.
- **Google sign-in:** needs a real Google OAuth client ID on both the UI and the API. Email and password is the easiest way to sign in locally.
- **Forgot password:** the API prints the reset link to its console outside production, so you can test it without email (see the service README). With the dev Heroku API, find it in `heroku logs --tail -a rate-it-service`.
- **Log out:** to reset the session, use the app's log out, or clear `accessToken` and `userName` from `localStorage`.

## Running tests

Run the test suite once (non-interactive):

```bash
npm run test:ci
```

Type-check the TypeScript files (CI runs this too):

```bash
npm run typecheck
```

Run a specific test file (or `npm test` for watch mode):

```bash
npx vitest run src/pages/Home.test.js
```

Tests use Vitest and React Testing Library. API clients are mocked in unit tests; no backend is required to run them.

## API types

The API types in `src/types/` are generated from the service's OpenAPI spec. After a
change to `openapi.json` merges in [rate-it-service](https://github.com/anihadagali7/rate-it-service),
update the copy here from a checkout next to this repo:

```bash
npm run api:sync       # copy ../rate-it-service/openapi.json and regenerate src/types/api.generated.ts
npm run api:generate   # regenerate only, from the committed src/types/openapi.json
```

Commit both files. Don't edit them by hand: CI regenerates `api.generated.ts` and fails
if it differs. The generator lives in `tools/api-codegen/` with its own lockfile,
because it needs TypeScript 5 and the app uses TypeScript 7.

## Production build

Build optimized static assets into `build/`:

```bash
npm run build
```

Serve the build locally (optional):

```bash
npm run preview
```

## Deploying to Heroku

The app is deployed as a static React build served by a small Express server (`scripts/heroku-start.js`). The `Procfile` starts it with:

```text
web: node scripts/heroku-start.js
```

Heroku runs `heroku-postbuild` after install, which executes `npm run build`.

There are two apps in one Heroku pipeline:

| App | Stage | API (`VITE_BASE_URL`) |
|-----|-------|-----------------------|
| `rate-it-ui` | staging | `rate-it-service` (dev database) |
| `rate-it-ui-prod` | production | `rate-it-service-prod` |

### First-time setup

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and log in:

   ```bash
   heroku login
   ```

2. Create both apps and add them to a pipeline (staging and production). On the staging app, connect the GitHub repo under **Deploy** and enable **Automatic deploys** from `master`.

3. Set config vars on each app (each app in the pipeline sets its own; they're read when the page loads):

   ```bash
   heroku config:set VITE_BASE_URL="https://your-rate-it-service.herokuapp.com"
   heroku config:set VITE_GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   ```

   Or set them in the Heroku Dashboard under **Settings → Config Vars**.

4. On each API app, allow the matching UI origin in CORS:

   ```bash
   heroku config:set CORS_ORIGIN="https://your-rate-it-ui.herokuapp.com" -a your-rate-it-service
   ```

### Deploy a new version

1. Open a PR. When it merges to `master` (after CI passes), Heroku deploys it to the staging app `rate-it-ui` automatically. Don't push to Heroku by hand.
2. Check staging:

   ```bash
   heroku open -a rate-it-ui
   heroku logs --tail -a rate-it-ui
   ```

3. Promote the same build to production, from the pipeline in the Heroku Dashboard or with:

   ```bash
   heroku pipelines:promote -a rate-it-ui
   ```

   The promoted build reads `rate-it-ui-prod`'s own config vars at page load, so it calls the prod API. If the change needs a new API endpoint, promote the service first.

### Notes for Heroku

- Do **not** commit `node_modules`, `.env`, or `build/`. Heroku installs dependencies and runs the production build during deploy.
- `VITE_BASE_URL` must point at that app's API (staging → `rate-it-service`, production → `rate-it-service-prod`). `scripts/heroku-start.js` serves the `VITE_*` config vars as `/config.js` when the page loads, and `src/config.ts` prefers them over the values compiled into the bundle. So promoting a build through the pipeline is safe, and changing a value only needs the restart that `heroku config:set` does, not a rebuild.
- Only the keys listed in `scripts/runtimeConfig.js` are sent to the browser. Adding a new client value means adding it there too; never add a secret.
- The Express server serves `build/index.html` for client-side routes so React Router works on refresh and deep links.
- If you update API env vars only, restart the API dyno: `heroku restart -a your-rate-it-service`.

## Project structure

```text
rate-it-ui/
├── index.html             # Vite entry HTML
├── public/                # Static assets copied as-is into build/
├── scripts/
│   ├── apiTypes.js        # npm run api:sync / api:generate
│   ├── heroku-start.js    # Express server for Heroku (serves build/ and /config.js)
│   └── runtimeConfig.js   # Builds /config.js from the app's VITE_* config vars
├── tools/api-codegen/     # openapi-typescript + TypeScript 5, with their own lockfile
├── src/
│   ├── client/            # API clients (axios)
│   ├── components/        # UI components
│   ├── navigation/        # Layout, header, sidebar
│   ├── pages/             # Route-level pages
│   ├── shared/            # Reusable primitives, layout, social, errors, loading skeletons, hooks
│   ├── styles/            # Design tokens and MUI theme
│   ├── testUtils/         # renderWithProviders for tests
│   ├── types/             # API types: api.ts aliases, generated from openapi.json
│   ├── utils/             # Auth header helpers and axios interceptor
│   ├── App.js             # Routes and session bootstrap
│   ├── config.ts          # Client config: /config.js values, else VITE_* from the build
│   └── index.js           # App entry point
├── Procfile               # Heroku process definition
├── vite.config.mjs        # Vite + Vitest config
└── package.json
```

## Related repo

- **API:** [rate-it-service](https://github.com/anihadagali7/rate-it-service) — backend, tests, and API deployment docs
