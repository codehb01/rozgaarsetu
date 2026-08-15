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
