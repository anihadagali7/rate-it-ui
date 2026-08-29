# rate-it-ui

Frontend for **Rate It**, a social app for discovering, rating, and organizing movies, TV shows, music, and books.

Built with **React**, **Material UI**, and **React Query**. It talks to the [rate-it-service](https://github.com/anihadagali7/rate-it-service) API for authentication, media metadata, ratings, playlists, wishlists, search, and social features.

## What it does

- **Home** — explore public ratings; logged-in users also see a feed from people they follow
- **Search** — search movies, TV, music, books, and users
- **Media pages** — view details, add ratings, save to wishlist, and add to playlists
- **Profiles** — view user ratings, wishlists, and playlists; follow/unfollow users
- **Account** — sign up, log in, edit profile, and reset password
- **Playlists & wishlists** — browse and manage personal collections

Protected routes require a valid JWT stored in `localStorage`. The app sends the token on API requests and redirects to `/login` when the session is missing or invalid.

## Prerequisites

- Node.js `20.x` (see `engines` in `package.json`)
- npm `11.x`
- A running instance of **rate-it-service** (local or deployed)

## Environment variables

Create a `.env` file in the project root (gitignored):

```env
REACT_APP_BASE_URL=http://localhost:8080

REACT_APP_GOOGLE_CLIENT_ID=your-google-oauth-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
REACT_APP_APPLE_CLIENT_ID=your-apple-services-id
REACT_APP_APPLE_REDIRECT_URI=https://your-app-origin
```

| Variable | Required | Notes |
|----------|----------|--------|
| `REACT_APP_BASE_URL` | Yes | Base URL of the API (no trailing slash). Example: `https://your-rate-it-service.herokuapp.com` |
| `REACT_APP_GOOGLE_CLIENT_ID` | For Google sign-in | OAuth client ID from Google Cloud Console. Never put the client *secret* here — that stays backend-only |
| `REACT_APP_FACEBOOK_APP_ID` | For Facebook sign-in | From a Facebook Login app |
| `REACT_APP_APPLE_CLIENT_ID` / `REACT_APP_APPLE_REDIRECT_URI` | For Apple sign-in | Your Apple Services ID and its registered return URL. Apple's sign-in popup requires HTTPS, even locally |

Create React App reads `REACT_APP_*` variables at **build time**. If you change this value on Heroku, trigger a new deploy so the production bundle is rebuilt.

On the API side, make sure `CORS_ORIGIN` includes your UI origin (e.g. `http://localhost:3000` locally, or your Heroku UI URL in production).

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000) and proxies API calls to the URL in `REACT_APP_BASE_URL`.

Make sure the backend is running first (default `http://localhost:8080`):

```bash
# in rate-it-service
npm start
```

## Running tests

Run the test suite once (non-interactive):

```bash
npm test -- --watchAll=false
```

Run a specific test file:

```bash
npm test -- --watchAll=false --testPathPattern=Home.test
```

Tests use Jest and React Testing Library. API clients are mocked in unit tests; no backend is required to run them.

## Production build

Build optimized static assets into `build/`:

```bash
npm run build
```

Serve the build locally (optional):

```bash
npx serve -s build
```

## Deploying to Heroku

The app is deployed as a static React build served by a small Express server (`scripts/heroku-start.js`). The `Procfile` starts it with:

```text
web: node scripts/heroku-start.js
```

Heroku runs `heroku-postbuild` after install, which executes `npm run build`.

### First-time setup

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) and log in:

   ```bash
   heroku login
   ```

2. Create the Heroku app (skip if it already exists):

   ```bash
   heroku create your-rate-it-ui
   ```

3. Add the Heroku git remote:

   ```bash
   heroku git:remote -a your-rate-it-ui
   ```

4. Set config vars **before** deploying (values are baked into the build):

   ```bash
   heroku config:set REACT_APP_BASE_URL="https://your-rate-it-service.herokuapp.com"
   heroku config:set REACT_APP_GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   heroku config:set REACT_APP_FACEBOOK_APP_ID="your-facebook-app-id"
   heroku config:set REACT_APP_APPLE_CLIENT_ID="your-apple-services-id"
   heroku config:set REACT_APP_APPLE_REDIRECT_URI="https://your-rate-it-ui.herokuapp.com"
   ```

   Or set them in the Heroku Dashboard under **Settings → Config Vars**.

5. On **rate-it-service**, allow this UI origin in CORS:

   ```bash
   heroku config:set CORS_ORIGIN="https://your-rate-it-ui.herokuapp.com" -a your-rate-it-service
   ```

### Deploy a new version

1. Commit your changes:

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

2. Push to Heroku:

   ```bash
   git push heroku main
   ```

   If your default branch is `master`:

   ```bash
   git push heroku master
   ```

3. Verify the deployment:

   ```bash
   heroku open
   heroku logs --tail
   ```

### Notes for Heroku

- Do **not** commit `node_modules`, `.env`, or `build/`. Heroku installs dependencies and runs the production build during deploy.
- `REACT_APP_BASE_URL` must point at your deployed API. After changing it, redeploy the UI so the new value is compiled into the bundle.
- The Express server serves `build/index.html` for client-side routes so React Router works on refresh and deep links.
- If you update API env vars only, restart the API dyno: `heroku restart -a your-rate-it-service`.

## Project structure

```text
rate-it-ui/
├── public/                # Static assets and index.html
├── scripts/
│   └── heroku-start.js    # Express server for Heroku (serves build/)
├── src/
│   ├── client/            # API clients (axios)
│   ├── components/        # UI components
│   ├── navigation/        # Layout, header, sidebar
│   ├── pages/             # Route-level pages
│   ├── shared/            # Buttons, inputs, Protected route, errors, loading
│   ├── utils/             # Auth header helpers and axios interceptor
│   ├── App.js             # Routes and session bootstrap
│   └── index.js           # App entry point
├── Procfile               # Heroku process definition
└── package.json
```

## Related repo

- **API:** [rate-it-service](https://github.com/anihadagali7/rate-it-service) — backend, tests, and API deployment docs
