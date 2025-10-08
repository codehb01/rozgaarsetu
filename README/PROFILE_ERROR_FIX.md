# Worker Profile Page - Error Fix

## Issue
The worker profile page was failing with error: "Failed to load profile" when trying to fetch user data.

## Root Cause
The page was attempting to make an HTTP GET request to `/api/actions/onboarding`, which is a server action file (not an API route) and doesn't support HTTP requests.

## Solution

### 1. Updated Profile Page
- **Changed**: Removed HTTP fetch call
- **Added**: Direct import and use of `getCurrentUser` server action
- **File**: `app/(main)/worker/profile/page.tsx`

**Before:**
```typescript
const res = await fetch("/api/actions/onboarding", {
  method: "GET",
  cache: "no-store",
});
if (!res.ok) throw new Error("Failed to load profile");
const result = await res.json();
setData(result.user);
```

**After:**
```typescript
import { getCurrentUser } from "@/app/api/actions/onboarding";

const user = await getCurrentUser();
if (!user) {
  throw new Error("User not found");
}
setData(user);
```

### 2. Updated Server Action
- **Enhanced**: `getCurrentUser` function to include nested relations
- **Added**: `previousWorks` relation to `workerProfile`
- **File**: `app/api/actions/onboarding.ts`

**Before:**
```typescript
include: {
  workerProfile: true,
  customerProfile: true,
}
```

**After:**
```typescript
include: {
  workerProfile: {
    include: {
      previousWorks: true,
    },
  },
  customerProfile: true,
}
```

## Benefits

1. ✅ **Proper Server Action Usage**: Uses Next.js server actions correctly
2. ✅ **Type Safety**: Full TypeScript type checking
3. ✅ **Complete Data**: Includes all necessary relations (previousWorks)
4. ✅ **Better Error Handling**: Clear error messages
5. ✅ **Performance**: Direct database query without HTTP overhead

## Testing
- [x] Profile page loads without errors
- [x] Worker profile data displays correctly
- [x] Previous works are included in the data
- [x] TypeScript compilation succeeds
- [x] No console errors

## Files Modified
1. `app/(main)/worker/profile/page.tsx`
   - Replaced fetch call with server action
   - Updated import statements

2. `app/api/actions/onboarding.ts`
   - Enhanced `getCurrentUser` to include `previousWorks` relation

## Status
✅ **Fixed** - Profile page now loads successfully with all required data.
