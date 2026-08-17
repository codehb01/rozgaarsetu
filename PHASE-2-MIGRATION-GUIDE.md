# Phase 2 — API Route Standardization Migration Guide

## What was done

Created three foundation files to standardize all API routes:

### 1. `lib/api-response.ts`
Provides consistent response/error shapes and error handling wrapper:
- `sendSuccess(data, status)` — replace all `NextResponse.json({ success: true, ... })`
- `sendError(message, code, status, details)` — replace all manual error responses
- `withErrorHandling(handler)` — wrap routes to auto-catch errors

### 2. `lib/api-schemas.ts`
Zod schemas for request validation:
- `createReviewSchema` — already defined as example
- Add more here as you migrate routes

### 3. Example migration: `/api/reviews`
See `app/api/reviews/route.ts` for the refactored pattern — now it:
- Validates body with `createReviewSchema.safeParse()`
- Uses `sendError()` for all error responses (consistent shape)
- Uses `sendSuccess()` for success response
- Wrapped in `withErrorHandling()` for automatic error catching

---

## How to migrate each route (18 more to go)

**Pattern: 4 steps per route**

### 1. Create schema in `lib/api-schemas.ts`
```typescript
export const createJobSchema = z.object({
  description: z.string().min(1),
  location: z.string().min(1),
  // ... other fields
});
```

### 2. Replace response calls
**Before:**
```typescript
return NextResponse.json({ error: "..." }, { status: 400 });
```

**After:**
```typescript
return sendError("...", "ERROR_CODE", 400);
```

### 3. Replace validation checks
**Before:**
```typescript
if (!description || !location) {
  return NextResponse.json({ error: "Fields required" }, { status: 400 });
}
```

**After:**
```typescript
const validation = jobSchema.safeParse(body);
if (!validation.success) {
  return sendError("Invalid request", "VALIDATION_ERROR", 400, 
    validation.error.flatten().fieldErrors);
}
const { description, location } = validation.data;
```

### 4. Wrap in `withErrorHandling`
**Before:**
```typescript
export async function POST(req: NextRequest) {
  try {
    // ... logic
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

**After:**
```typescript
export const POST = withErrorHandling(async (req: NextRequest) => {
  // ... logic (no try/catch needed)
});
```

---

## Remaining routes to migrate

**Easy (no auth, simple validation):**
- `/api/geocode` — POST, reverse-geocode → add rate limiting
- `/api/workers` → GET, already public

**Medium (has auth, standard CRUD):**
- `/api/user/profile` — GET/POST
- `/api/customer/profile` — GET/POST
- `/api/worker/profile` — GET/POST
- `/api/upload` — POST

**Hard (complex state/payment logic):**
- `/api/jobs/[id]` — PATCH (the complex one — booking lifecycle)
- `/api/jobs` — GET/POST
- `/api/customer/jobs` — GET
- `/api/worker/jobs` — GET/PATCH
- `/api/worker/earnings` — GET
- `/api/user/check-profile` — POST
- `/api/user/subscription` — GET/POST
- `/api/user/usage-stats` — GET
- `/api/auth/callback` — POST (Clerk, skip for now)

---

## Code patterns by route type

### Public route (no auth)
```typescript
export const GET = withErrorHandling(async (req: NextRequest) => {
  // No auth check needed
  const result = await prisma.worker.findMany();
  return sendSuccess(result);
});
```

### Authenticated route (customer/worker)
```typescript
export const POST = withErrorHandling(async (req: NextRequest) => {
  const { user, response } = await protectCustomerApi(req);
  if (response) return response;

  const customer = user as User;
  const body = await req.json();
  const validation = mySchema.safeParse(body);
  if (!validation.success) {
    return sendError("Invalid", "VALIDATION_ERROR", 400, 
      validation.error.flatten().fieldErrors);
  }

  // ... business logic
  return sendSuccess(result, 201);
});
```

### With rate limiting (public endpoints)
```typescript
// TODO: Add simple in-memory rate limiter or Upstash integration
// For now, just use the pattern above
```

---

## Suggested order (do 2-3 per PR)

1. **PR 1:** `/api/geocode`, `/api/reverse-geocode` (simple)
2. **PR 2:** `/api/user/profile`, `/api/customer/profile` (auth + CRUD)
3. **PR 3:** `/api/worker/profile`, `/api/upload` (upload validation)
4. **PR 4:** `/api/jobs`, `/api/customer/jobs`, `/api/worker/jobs` (medium)
5. **PR 5:** `/api/jobs/[id]` (the hardest — payment + state machine)
6. **PR 6:** Everything else + add rate limiting

Each PR should compile and pass CI before merging to `development`.

---

## Key patterns to remember

- ✅ Always use schemas from `lib/api-schemas.ts`
- ✅ Always use `sendSuccess()` / `sendError()` for responses
- ✅ Always wrap in `withErrorHandling()`
- ✅ Cast `user as User` after auth checks
- ✅ No raw `NextResponse.json()` calls
- ❌ Don't add try/catch (withErrorHandling handles it)
- ❌ Don't add manual error responses (use sendError)

---

## 🎓 Interview/Placement Guide: Understanding the API Workflow

If you're explaining this project in an interview, here is a simple breakdown of how our API architecture works, why we made these Phase 2 changes, and how the data flows from start to finish.

### 1. What We Did (The "Why" and "How")

**The Problem (Before Phase 2):**
Initially, every API route was built independently. If an error occurred, developers had to manually write `try { ... } catch { return NextResponse.json(...) }`. Validation was done manually using simple `if (!body.field)` checks. This led to:
- **Inconsistent Error Messages:** Some APIs returned `{ error: "..." }`, others `{ message: "..." }`.
- **Code Duplication:** Repeating `try/catch` everywhere.
- **Fragile Validation:** Manual `if` checks are prone to missing edge cases.

**The Solution (What we did in Phase 2):**
We introduced a **Standardized API Layer**. 
- **How:** We created a higher-order wrapper function `withErrorHandling` that automatically wraps every API request in a `try/catch`. 
- **How:** We built `sendSuccess` and `sendError` helpers so every API always returns the exact same JSON structure.
- **How:** We used **Zod** (`api-schemas.ts`) to strictly validate incoming data before the main logic even runs.

### 2. How to Build This Workflow From Scratch

If a developer were to build this backend flow from scratch, they would follow these layers:

1. **The Request Layer (Next.js Route Handlers):** You create standard Next.js API routes (e.g., `app/api/jobs/route.ts`).
2. **The Authentication Layer:** Use Clerk (`auth()`) to verify *who* is making the request.
3. **The Validation Layer (Zod):** Pass the incoming JSON body through a Zod schema to ensure it has the correct data types.
4. **The Business Logic Layer (Prisma):** Talk to the Postgres database to create, read, update, or delete records.
5. **The Response Layer:** Return a standardized JSON response back to the frontend.

### 3. The Core Data Flow (Step-by-Step)

Here is exactly how data flows through our API files when a user makes a request (e.g., creating a job):

1. **Client Request:** 
   The frontend sends a POST request with JSON data (like job details) to `/api/jobs`.

2. **The Wrapper Catch-All (`lib/api-response.ts`):** 
   The request enters our `withErrorHandling` function. If the server crashes at any point, this wrapper catches it and prevents a raw 500 error page, returning a clean JSON error instead.

3. **Authentication (`app/api/jobs/route.ts`):** 
   The route calls `protectCustomerApi(req)`. It talks to Clerk to ensure the user is logged in and verifies in the database that their role is `CUSTOMER`.

4. **Validation (`lib/api-schemas.ts`):** 
   The route calls `createJobSchema.safeParse(body)`. Zod checks if `charge` is a positive number, `workerId` exists, etc. If it fails, we instantly return `sendError` with exactly what fields were missing.

5. **Database Operation (`lib/prisma.ts`):** 
   We use Prisma ORM to insert the new Job into the Postgres database. We also create a `JobLog` to keep an audit trail of the action.

6. **Standardized Response (`lib/api-response.ts`):** 
   Finally, we call `sendSuccess({ job }, 201)`. The frontend receives `{ success: true, data: { job: ... } }`.

### 4. Summary for Interviews

> "In this project, I implemented a robust, type-safe API architecture using Next.js Route Handlers, Prisma ORM, and Zod validation. To ensure high maintainability, I centralized the API response and error-handling logic into a reusable wrapper pattern. This eliminated redundant `try/catch` blocks across 19 API endpoints, guaranteed a consistent JSON contract for the frontend, and abstracted authentication and validation into clean, separate layers."
