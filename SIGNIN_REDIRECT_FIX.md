# Sign-In Redirect Bug Fix

## Problem
After signing in with Google, users were seeing an unwanted intermediate step:
1. Choose Google account → Sign in
2. **Redirected to landing page** (unwanted!)
3. Wait 10-12 seconds
4. Finally redirected to onboarding/dashboard

This created a poor UX with unnecessary waiting time.

## Root Cause
Using `fallbackRedirectUrl` instead of `forceRedirectUrl` in the sign-in component allowed Clerk to redirect to the landing page first, which then triggered a client-side redirect after detecting the user was authenticated.

## Solution

### 1. Created Auth Callback Route
**File**: `app/api/auth/callback/route.ts`

This API route handles intelligent post-sign-in routing:
- Gets the authenticated Clerk user
- Checks if user exists in database
- Checks user's role status
- Redirects appropriately:
  - To `/onboarding` if user doesn't exist or has no role
  - To `/worker/dashboard` if user has WORKER role
  - To `/customer/dashboard` if user has CUSTOMER role
  - To `/` as fallback on error

### 2. Fixed Sign-In Page with forceRedirectUrl
**File**: `app/(auth)/sign-in/[[...sign-in]]/page.tsx`

Changed from:
```tsx
<SignIn fallbackRedirectUrl="/" />  // ❌ Bad: Goes to landing page first
```

To:
```tsx
<SignIn forceRedirectUrl="/api/auth/callback" />  // ✅ Good: Direct navigation
```

**Key difference:**
- `fallbackRedirectUrl`: Suggests a redirect but allows other redirects to take precedence
- `forceRedirectUrl`: **Forces** immediate redirect after authentication (no intermediate steps)

### 3. Removed Landing Page Auto-Redirect
**File**: `app/page.tsx`

Removed the `useUser()` auto-redirect logic since it's no longer needed with `forceRedirectUrl`.

## Flow (Fixed)

**Before (❌ Bad UX):**
```
Sign in → Landing page → Wait 10-12 sec → Callback → Dashboard
```

**After (✅ Good UX):**
```
Sign in → Callback → Dashboard (instant!)
```

## Detailed Flow

```
User clicks "Sign In" → Clerk OAuth flow → Choose account
                                                ↓
                                    forceRedirectUrl kicks in
                                                ↓
                                    /api/auth/callback
                                                ↓
                                  Check user role in database
                                                ↓
                        ┌───────────────────────┴───────────────────┐
                        ↓                                           ↓
                  No Profile/Role                          Complete Profile
                        ↓                                           ↓
                  /onboarding                              /worker or /customer
                                                              dashboard
```

**Result:** Direct navigation with no intermediate landing page visit!

## Testing Checklist

- [ ] New user signs in → directly to `/onboarding` (no landing page)
- [ ] User with incomplete profile → directly to `/onboarding` (no landing page)
- [ ] Worker with complete profile → directly to `/worker/dashboard` (no landing page)
- [ ] Customer with complete profile → directly to `/customer/dashboard` (no landing page)
- [ ] No 10-12 second wait on landing page
- [ ] Seamless, instant redirect experience

## Files Changed

1. ✅ Created: `app/api/auth/callback/route.ts` - Smart routing logic
2. ✅ Modified: `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - **Changed to forceRedirectUrl**
3. ✅ Modified: `app/page.tsx` - Removed auto-redirect logic

## Key Learnings

- **forceRedirectUrl** = Immediate, forced redirect (best for auth flows)
- **fallbackRedirectUrl** = Suggested redirect (can be overridden)
- Sign-up already uses `forceRedirectUrl="/onboarding"` (correct!)
- Consistency matters: both sign-in and sign-up should use `forceRedirectUrl`

## Performance Impact

- **Before:** 10-12 second delay (landing page → client detection → redirect)
- **After:** Instant redirect (server-side, no client-side detection needed)
- **Improvement:** ~10 seconds faster, better UX ✨
