# rate-it-ui — agent guide

Frontend for **Rate It**, a social app for rating movies, TV, music, and books.
The API lives in the sibling repo `../rate-it-service` (Express + MongoDB). Most
features touch both repos — see [Cross-repo work](#cross-repo-work).

This file is read by Claude Code (via `CLAUDE.md`) and Cursor (natively). Keep it
accurate: if you change a convention described here, update this file in the same PR.

## Commands

```bash
npm install          # NOTE: postinstall also runs a production build
npm start            # dev server on http://localhost:3000
npm run test:ci      # full test suite, non-interactive (what CI runs)
npx react-scripts test --watchAll=false src/pages/Wishlist.test.js   # one file
npm run build
```

Always run `npm run test:ci` before opening a PR. The UI needs the API running
locally (`npm start` in `../rate-it-service`, port 8080) to be used in the browser.

## Stack

- React 18 on Create React App (`react-scripts` 5), plain JavaScript
- React Router v6 — all routes are declared in `src/App.js`
- TanStack React Query **v4** (`@tanstack/react-query`) for all server state
- MUI v5 for components; style with the `sx` prop and design tokens from
  `src/styles/tokens.js` (colors, fonts, radius, shadows). Tailwind/daisyUI are
  installed but not used — don't introduce them.
- axios for HTTP; Prettier via lint-staged
- Deployed on Heroku (`Procfile` → `scripts/heroku-start.js` serves the build)

## Project structure

| Folder | Role |
|--------|------|
| `src/pages/` | One component per route (`Home`, `Search`, `MediaInfo`, `Profile`, ...). |
| `src/components/<feature>/` | Feature components (`ratingcard`, `mediainfo`, `playlist`, `profile`, `modals`, `Search`, ...). |
| `src/shared/` | Reusable building blocks: `primitives/` (ScoreBadge, MediaPoster, EmptyState, SurfaceCard, UserAvatar), `layout/` (FeedLayout, RightRail, AuthLayout, SectionHeader), `feedback/Toast`, `errors/` (QueryErrorState, ErrorBoundary), `loading/` skeletons, `hooks/`, `social/` (LikeButton, FollowButton, CommentThread), `buttons/`, `inputfield/`. **Check here before building something new.** |
| `src/client/` | One static class per API area (`RatingClient`, `UserClient`, ...). Every API call goes through these. |
| `src/navigation/` | App shell: `ResponsiveLayout`, `Sidebar`, `TopAppBar`, `Masthead`. |
| `src/utils/` | `AuthorizationUtils.getHeaders()`, `authInterceptor`. |
| `src/styles/` | `tokens.js`, MUI `Theme.js`. |
| `src/testUtils/` | `renderWithProviders`. |

## Conventions

### Data fetching

- Add API calls as static methods on the matching `src/client/*Client.js` class, using
  `` `${process.env.REACT_APP_BASE_URL}/api/...` `` and `getHeaders()`.
- Use `useQuery` / `useMutation` in components. API responses are
  `{ status, data: { <payload> } }`, so unwrap with `select: ({ data }) => data.data.<payload>`.
- After a mutation, `queryClient.invalidateQueries({ queryKey: [...] })` for every
  affected list (see `src/shared/layout/RightRail.js`).
- Errors come back as `error.response.data.errors.msg`. Show query errors with
  `QueryErrorState` and action results with `Toast`.
- Show a skeleton from `src/shared/loading/` (or add one) while loading — not a bare spinner.

### Auth

- The JWT is stored in `localStorage` as `accessToken`, plus `userName`.
- Current user: `useContext(UserContext)` → `{ currentUser, setCurrentUser }`.
- Route guards: `Protected` (must be logged in), `GuestOnly` (login/signup),
  `RequireCompleteProfile` (wraps the whole app).
- For logged-out users, **don't disable action buttons** — let them click and prompt
  login (`LoginErrorModal`). See `RatingCard.js` / `MediaInfo.js`.
- `authInterceptor` logs the user out on 401/403 with `"Token not found"`/`"Invalid token"`.

### UI

- Every screen must work on mobile and desktop. Use
  `useMediaQuery(theme.breakpoints.down("sm" | "md"))`; larger differences get separate
  components (e.g. `MobilePlaylistDrawer` vs `DesktopPlaylistDialog`).
- Use `tokens` for colors, radius, shadows, and fonts — no hard-coded hex values.
- Use accessible markup: real buttons/links, labels on inputs, `aria-label` on icon buttons.

## Tests

- Jest + React Testing Library, colocated as `<Component>.test.js`.
- Render with `renderWithProviders(ui, { userContextValue, route })` from
  `src/testUtils/renderWithProviders.js` (QueryClient + UserContext + MemoryRouter).
- Mock the API layer with `jest.mock("../client/<Name>Client")` and
  `mockResolvedValue({ data: { data: { ... } } })`. Never make real HTTP calls.
- Query by role/label/text as a user would (`getByRole`, `findByText`), not by class names.
- New pages or components with logic need tests for: rendering data, empty state,
  error state, and the main user interaction. Cover the logged-out path when relevant.

## Environments & data safety

- `REACT_APP_BASE_URL` points at the API. Locally that's `http://localhost:8080`, whose
  `.env` uses the **dev** MongoDB. Never point the UI at the prod API while testing.
- Do not read or print `.env` values; variable names are documented in `README.md`.
- `REACT_APP_*` vars are baked in at build time. A new one must be added to the README
  and set on Heroku; call this out in the PR.

## Verifying changes in the browser

After UI changes, run the app (`npm start`, port 3000; the API must be running on 8080)
and check the change at both mobile (375px) and desktop widths. Check the console for
errors. Include a screenshot in the PR for visual changes when possible.

## Cross-repo work

The API is at `../rate-it-service`. Its routes are in `routes/`, the logic in `services/`,
and the full endpoint table is in `../rate-it-service/AGENTS.md`.

- If a story needs a new or changed endpoint, that's a backend story that ships first.
  Don't guess at response shapes — read the service code.
- UI stories that depend on an unmerged backend change should say so in the PR.

## Git & PR workflow

- Never commit or push directly to `master`. Branch as `feature/<slug>`, `fix/<slug>`,
  or `chore/<slug>`.
- One story per branch and PR. Keep PRs focused; don't refactor unrelated code.
- PR description: summary, `Closes #<issue>`, how it was tested (tests + browser check),
  screenshots for visual changes, and any env var or backend dependencies.
- Stories are GitHub Issues. See `.agents/workflows/` for the `write-story` and
  `build-story` workflows (`/story` and `/build-story` in Claude Code and Cursor).

## Known issues / tech debt

- Create React App is deprecated; a migration (Vite and TypeScript) is planned as its
  own story. Don't add CRA-specific config in the meantime.
- `src/mockdata/` holds old fixtures; prefer inline test data in new tests.
