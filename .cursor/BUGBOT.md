# Bugbot review rules — rate-it-ui

React 18 (Vite) frontend for Rate It. Full conventions are in `AGENTS.md`; these are the
rules most worth flagging in review. The API lives in `anihadagali7/rate-it-service`.

## Data fetching
- API calls must go through a static method on a `src/client/*Client.js` class, using
  `` `${API_URL}/api/...` `` (`BASE_URL` from `src/config.js`) and `getHeaders()`. Flag
  `axios`/`fetch` calls made directly in components or pages.
- API responses are `{ status, data: { <payload> } }`. `useQuery` should unwrap with
  `select: ({ data }) => data.data.<payload>`. Flag code that reads the wrong level.
- Every `useMutation` must `invalidateQueries` for each list it affects (ratings feeds,
  profile lists, wishlist, playlists). Flag mutations that leave stale lists.
- Errors come from `error.response.data.errors.msg`. Query errors render with
  `QueryErrorState`; action results with `Toast`. Flag swallowed errors.
- Loading states use a skeleton from `src/shared/loading/`, not a bare `CircularProgress`.

## Auth
- For logged-out users, action buttons (rate, like, follow, add to wishlist/playlist)
  must stay enabled and open `LoginErrorModal` on click — flag `disabled={!currentUser}`.
- Never log or render the JWT or other `localStorage` contents.
- New routes go in `src/App.js` with the right guard (`Protected`, `GuestOnly`).

## UI
- Colors, radius, shadows, and fonts come from `src/styles/tokens.js`. Flag hard-coded
  hex values and new Tailwind/daisyUI classes.
- Every screen must work at 375px and on desktop. Flag fixed pixel widths that overflow
  on mobile and layout that ignores `useMediaQuery(theme.breakpoints.down(...))`.
- Icon-only buttons need an `aria-label`; inputs need labels; clickable things must be
  real buttons or links.
- Check `src/shared/` before accepting a new component that duplicates an existing
  primitive (ScoreBadge, MediaPoster, EmptyState, UserAvatar, LikeButton, FollowButton, ...).

## Tests
- New pages/components with logic need tests for: data rendering, empty state, error
  state, the main interaction, and the logged-out path when relevant.
- Tests must mock `src/client/*` (`vi.mock(...)`) and never make real HTTP calls; render
  with `renderWithProviders`; query by role/label/text, not class names.

## Scope and config
- A new `VITE_*` variable must be exported from `src/config.js`, documented in `README.md`,
  and called out in the PR (it is baked in at build time and must be set on Heroku). Flag
  `import.meta.env` or `process.env` reads outside `src/config.js`.
- Flag unrelated refactors or drive-by changes outside the story's scope.
- If the PR relies on a new or changed endpoint, check that the response shape it reads
  matches the service, and that the PR says which service PR it depends on.
