# RozgaarSetu — Architecture Improvement Plan

## Why this document exists

You want to take RozgaarSetu from "working project" to "project I can confidently explain in a placement interview" — clean structure, consistent patterns, testable, and safe to change. The rules in `rules/frontend.md`, `rules/backend.md`, and `rules/api-architecture.md` were written for a different stack (Mongoose + Better-Auth), so we are not copying them directly. We are borrowing the **ideas** behind them (layers, separation of concerns, consistent validation/error handling, typed API calls) and applying them to what you actually have: **Next.js 15 + Prisma + PostgreSQL + Clerk**.

## Ground rules for the whole migration

1. **Never work directly on `master`.** Create a `development` branch once, and do all phases there.
2. **One phase = one (or a few) pull requests from `development` into `master`.** Each phase should leave the app in a fully working state — never merge a half-done phase.
3. **Test manually after every phase** (and automatically once Phase 1 adds tests) before merging to `master`.
4. **Smallest risk first.** We start with changes that cannot break running features (cleanup, CI, docs) and only touch business logic once we have a safety net (tests) in place.
5. **Every phase should be explainable in one sentence** — that sentence is what you say in the interview. It's written at the top of each phase below.

Suggested branch flow per phase:
```
development  ──► feature/phase-1-cicd  ──► PR into development ──► test ──► PR into master
```

---

## Progress log (updated as we go)

Branches that exist right now: `master`, `development` (currently same commit as `master`), and `feat/cicd-and-cleanup` (created off that commit — this is where all Phase 0 work below happened).

### Phase 0 — status: code changes done, not committed yet

What was actually done, on branch `feat/cicd-and-cleanup`:

- Removed `build.log`, `build2.log`, and root-level `migration.sql` from git tracking (`git rm --cached`) and deleted them from disk. Added `build.log`, `build2.log`, `*.log`, and `/migration.sql` to `.gitignore` (real migrations live in `prisma/migrations/`, which was untouched).
- Investigated `src/components/` and `src/hooks/` vs the root `components/`/`hooks/` duplication. Confirmed via grep that **nothing in the codebase imports from `@/src/*`** — those 4 files (`expandable-card-demo-grid.tsx`, `expandable-card-demo-standard.tsx`, `kokonutui/apple-activity-card.tsx`, `use-outside-click.tsx`) were dead/unused demo code, not an in-progress migration. **Deleted `src/` entirely** rather than moving it — root `components/`/`hooks/` remain the single source of truth.
- Added `.env.example` at the project root, listing every env var referenced in code (`process.env.*` grep) plus the ones already in the real `.env` (Clerk, Database, Razorpay, Cloudinary, Nominatim, Azure Translator, Google Translate) with values blanked out.
  - ⚠️ **Still open:** `.gitignore`'s `.env*` pattern also matches `.env.example`, so it won't get committed as-is. Needs one line added: `!.env.example` right after the `.env*` line.
- Added `.github/workflows/ci.yml` — runs on PRs/pushes to `master`/`development`, steps: checkout → setup Node 20 → `npm ci --legacy-peer-deps` → `npm run lint` → `npx tsc --noEmit` → `npm run build`. Build-time env vars (`DATABASE_URL`, Clerk keys) use `secrets.X || 'placeholder'` fallback so it runs without real secrets configured, but picks up real GitHub repo secrets automatically if added later. Confirmed this needs no paid plan — GitHub Actions is free for this repo size.
- Set `eslint.ignoreDuringBuilds` to `false` in `next.config.ts`.
- Found and fixed all **17 blocking ESLint errors** across 7 files so the build passes with linting enforced (139 pre-existing warnings were left as-is — they don't fail the build and are lower priority):
  - `app/(main)/customer/bookings/page.tsx` — replaced `Razorpay: any` / `response: any` with real `RazorpayOptions`/`RazorpayPaymentResponse`/`RazorpayInstance` types.
  - `components/ui/expandable.tsx` — added missing `displayName` on `Expandable` and `ExpandableContent`; typed `transition?: any` as `Transition` (from `motion/react`).
  - `components/ui/infinite-moving-cards.tsx` — escaped literal quotes in JSX (`&quot;`).
  - `components/ui/map-preview.tsx` — replaced `(mapRef.current as any)._markerLayer` with a proper `MapWithMarkerLayer` type (`L.Map & { _markerLayer?: L.LayerGroup }`); typed the Leaflet `popupopen` handler as `L.PopupEvent` and simplified the popup-element lookup to `e.popup?.getElement()`.
  - `components/ui/smart-date-time-picker.tsx` — replaced the untyped `any` props with a proper `SmartDateTimePickerFieldProps` type; removed an unnecessary `as any` cast on `buttonVariants(...)`.
  - `lib/subscription-service.ts` / `lib/usage-tracker.ts` — these are no-op stub services (subscription/usage-limit features were previously ripped out); removed `as any` casts on their stub return values by giving them concrete literal types instead.
- Verified clean: `npx eslint .` → **0 errors** (131 warnings), `npx tsc --noEmit` → clean, `npm run build` → succeeds with ESLint enforced, 34 routes generated.
- **Not yet done:** the actual `git add` / `git commit` / push / PR — user chose to run that step manually. Remaining steps before Phase 0 is truly closed out:
  1. Add `!.env.example` to `.gitignore` (see above).
  2. `git add .`, review with `git status`, commit.
  3. Push `feat/cicd-and-cleanup`, open PR into `development`, merge after review.

---

## Phase 0 — Safety net & housekeeping (no logic changes, zero risk)

**Interview line:** *"Before refactoring anything, I set up CI and cleaned up the repo so every change afterward was verified automatically."*

- [x] Create a branch for this work (`feat/cicd-and-cleanup`, off `development`/`master`).
- [x] Add `.env.example` (all variable names from your real `.env`, values blanked out) so the required config is documented. *(needs the `.gitignore` fix above before it'll actually get committed)*
- [x] Remove stray committed files that shouldn't be in git: `build.log`, `build2.log`, root-level `migration.sql`. Added them to `.gitignore`.
- [x] Resolved the `src/components`/`src/hooks` vs root `components`/`hooks` duplication — turned out to be dead code, so it was deleted rather than merged.
- [x] Add a `.github/workflows/ci.yml` that runs on every PR: `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm run build`. This is your first real CI pipeline.
- [x] Turn `eslint.ignoreDuringBuilds` back to `false` in `next.config.ts` — fixed all 17 lint errors that surfaced, file-by-file, so the build stays green.
- [ ] Commit and push this branch, open the PR into `development`.

**Why this order:** none of this touches business logic, so there's nothing to "break." It gives you CI before Phase 1 even starts, which is itself a strong interview point (you didn't just refactor blindly, you built a net first).

---

## Phase 1 — Testing foundation

**Interview line:** *"I added a testing layer before touching architecture, so every later refactor could be verified instead of manually re-clicked."*

- [ ] Add **Vitest** for unit tests (fast, works well with TS + Next.js). Start with the parts that have real logic and no UI: `lib/razorpay-service.ts` (signature verification), `lib/geocoding.ts`/Haversine distance calc, `lib/schema.ts` (zod schemas).
- [ ] Add **Playwright** for one end-to-end smoke test: sign in → search worker → view profile. Just one flow is enough to start — it proves the critical path still works after every future change.
- [ ] Add `npm run test` to `package.json` and wire it into the Phase 0 CI workflow so PRs fail if tests fail.

**Why this order:** this is the single highest-leverage phase for interviews *and* for you personally — every phase after this can be validated by running `npm test` instead of manually clicking through the app.

---

## Phase 2 — Standardize API routes (no restructuring yet, just consistency)

**Interview line:** *"I standardized every API route to the same validation → auth → response contract, so a reviewer can predict the shape of any endpoint without reading it."*

Do this **one route at a time**, on its own small PR, so nothing breaks all at once:

- [x] Create one shared response helper, e.g. `lib/api-response.ts`, exporting `sendSuccess(data, status?)` and `sendError(message, code, status)` — small wrappers over `NextResponse.json`. This replaces the current copy-pasted `{ error: "..." }` objects with one consistent shape everywhere.
- [x] Create one shared error-handling wrapper, e.g. `withErrorHandling(handler)`, that wraps a route handler in try/catch and returns a standard 500 response on unexpected errors — replacing the repeated try/catch blocks.
- [x] For every route under `app/api/`, replace manual field checks (`if (!workerId || !description...)`) with a `zod` schema + `.safeParse()`. You already have `lib/schema.ts` for forms — extend it with server-side request schemas (can live in the same file or a new `lib/schema/api/*.ts`).
- [x] Replace every hand-rolled `auth()` + `prisma.user.findUnique` + role-check block with the existing `lib/api-auth.ts` helpers (`protectCustomerApi`/`protectWorkerApi`). Fix the `unknown` cast issue while you're here by giving these helpers a proper generic return type instead of `unknown`.
- [x] Add basic rate limiting (e.g. `@upstash/ratelimit` with Redis, or a simple in-memory limiter for now) to the public routes: `/api/geocode`, `/api/reverse-geocode`, `/api/workers`.

**Why this order:** this fixes the most commonly-asked interview question ("how do you keep 19 API routes consistent?") without moving a single file — you're changing the *inside* of each route, not its location.

---

## Phase 3 — Introduce the layered backend (the "real" architecture change)

**Interview line:** *"I separated each API route into an access-control layer, a business-logic layer, and a thin HTTP layer, so logic is reusable and testable outside of Next.js request/response objects."*

This is the adapted version of `api-architecture.md`'s pattern, but using **Prisma** instead of Mongoose and **Clerk** instead of Better-Auth:

```
lib/
├── access/          # pure functions: "can this user do X?" — no DB calls
│   └── job-access.ts
├── services/         # business logic + Prisma queries ("server-only")
│   └── job-service.ts
app/api/
└── jobs/[id]/route.ts   # thin: parse request → call service → sendSuccess/sendError
```

Do this **one entity at a time**, starting with `jobs` (it's your most impressive/complex flow — booking lifecycle + payments — so it's the best interview story):

- [ ] Move authorization checks (e.g. "only the assigned worker can mark a job started") into `lib/access/job-access.ts` as pure functions like `canTransitionJobStatus(user, job, action)`.
- [ ] Move the actual Prisma queries + state-transition logic out of `app/api/jobs/[id]/route.ts` into `lib/services/job-service.ts`, marked with `import "server-only"`.
- [ ] The route file becomes: validate request (Phase 2's zod schema) → call `job-service` function → `sendSuccess`/`sendError`. Nothing else.
- [ ] Repeat for `worker`, then `customer`, then `reviews`. Leave `JobPosting`/`JobApplication` alone for now — flag it as "unused/half-built" and decide later whether to finish or remove it (don't refactor dead code).

**Why this order:** you already have your best logic in `app/api/jobs/[id]/route.ts` — moving it into testable, framework-independent functions is the single best "system design" story you can tell, and Phase 1's tests let you prove nothing broke.

---

## Phase 4 — Frontend data layer (replace manual fetch/useEffect)

**Interview line:** *"I introduced a single client-side data-fetching pattern with caching and automatic error/loading states, replacing manual useEffect+fetch calls scattered across pages."*

- [ ] Add **TanStack Query (React Query)**.
- [ ] For each entity (jobs, workers, profile...), create one hooks file, e.g. `hooks/jobs/use-jobs.ts`, exporting `useJobsQuery()`, `useJobMutation()` etc. — calling the API routes you already standardized in Phase 2.
- [ ] Migrate pages one at a time from manual `useState`/`useEffect` fetch logic to these hooks. Start with a small page first (e.g. `customer/help`) to prove the pattern, then move to the big ones (`worker/profile`, `worker/job`, `customer/bookings`).
- [ ] This phase naturally starts shrinking your 1000+ line page files, because all the fetch/loading/error state disappears into the hook.

**Why this order:** doing this *after* Phase 2/3 means the API responses are already consistent and typed, so the hooks layer is simple to write instead of fighting inconsistent response shapes.

---

## Phase 5 — Component cleanup

**Interview line:** *"I split monolithic page components into presentation components + hooks, following a consistent component size and folder convention."*

- [ ] Now that Phase 4 removed the data-fetching code from big pages, split what's left: each page should mostly be JSX composition. Pull repeated UI blocks into `components/<feature>/*.tsx`.
- [ ] Adopt a simple rule (your own scaled-down version of `frontend.md`'s v2 pattern): **components under ~200 lines**, one component per file, colocate a feature's components in `components/<feature>/`.
- [ ] Remove the leftover debug `console.log`s and the manual "test confetti" button in `onboarding/finish/page.tsx`.
- [ ] Add loading skeletons (you likely already have some shadcn primitives) instead of blank/spinner states, now that React Query gives you clean `isLoading` flags.

**Why this order:** structural frontend cleanup is easiest once data-fetching noise is already gone (Phase 4) — otherwise you're splitting files that still have 3 concerns tangled together.

---

## Phase 6 — Security & production hardening

**Interview line:** *"I did a security pass: locked down image sources, added input constraints, added error boundaries, and validated environment variables at boot."*

- [ ] Restrict `next.config.ts`'s `images.remotePatterns` to only the real hosts you use (Cloudinary domain, your own domain) instead of `hostname: "**"`.
- [ ] Add `app/error.tsx` and `app/not-found.tsx` so uncaught errors show a real branded page instead of Next's default.
- [ ] Add length/format limits to free-text fields in your zod schemas (job `description`, `details`, etc.) to avoid unbounded input.
- [ ] Add a small `lib/env.ts` that validates `process.env` with zod at startup, so a missing/misnamed env var fails fast with a clear message instead of a mysterious runtime error.
- [ ] Revisit the `JobPosting`/`JobApplication` models — either wire them up into a real feature or remove them from the schema so the data model matches reality.

**Why this order:** security/hardening is done last because it's cheap to explain and low-risk, but you want the core architecture already clean so these fixes are quick, targeted diffs.

---

## Phase 7 — Tell the story (documentation)

**Interview line:** *"I documented the architecture and the reasoning behind each major decision, not just the code."*

- [ ] Update `README.md`'s architecture section to reflect the new `access/service/route/hook` layering.
- [ ] Add a short `docs/decisions/` folder with 1-paragraph ADRs (Architecture Decision Records) for the big calls: *why Prisma over raw SQL*, *why Clerk*, *why the layered API pattern*, *why React Query*. These are gold in interviews — they show you can justify decisions, not just execute them.
- [ ] Add a simple architecture diagram (even a hand-drawn one exported as an image, or a Mermaid diagram in the README) showing: Client → Hooks → API Routes → Services → Prisma → Postgres, with Clerk/Razorpay/Cloudinary as side integrations.

---

## Suggested order of attack, if time is limited

If you're short on time before an interview, the highest-value subset is:
**Phase 0 → Phase 1 (at least the E2E smoke test) → Phase 2 → Phase 3 (just the `jobs` entity) → Phase 7.**

That alone gives you: CI, one real test, consistent API contracts, one deeply-refactored "flagship" feature you can whiteboard in detail, and documentation that ties it all together — which is usually more convincing in an interview than a fully finished but unexplainable refactor.
