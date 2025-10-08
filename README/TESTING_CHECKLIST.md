# Booking Workflow Testing Checklist

## ✅ Pre-Test Setup

1. **Dev Server Running**
   ```powershell
   npm run dev
   ```
   Server should be at: http://localhost:3000

2. **Database Ready**
   - Ensure PostgreSQL is running
   - Database has User table with CUSTOMER and WORKER roles
   - At least one WORKER user exists for testing

3. **Authentication**
   - Clerk is configured (NEXT_PUBLIC_CLERK_* env vars set)
   - Can sign in as CUSTOMER
   - Can sign in as WORKER (for verification)

## 📋 Test Steps

### Test 1: Unauthenticated User
**Steps:**
1. Log out if logged in
2. Navigate to `/customer/search`
3. Click "Book" button on any worker card

**Expected:**
- Should redirect to `/sign-in`

**Status:** ⬜ Pass ⬜ Fail

---

### Test 2: Full Booking Flow (Happy Path)
**Steps:**
1. Sign in as a CUSTOMER user
2. Navigate to `/customer/search`
3. Click "Book" on a worker card
4. **Step 1 - Title & Details:**
   - Enter title (e.g., "Fix leaking faucet")
   - Optionally enter details
   - Click "Next"
5. **Step 2 - When:**
   - Try typing "tomorrow at 2pm" in the smart picker
   - OR click calendar icon and select date/time
   - Click "Next: Price"
6. **Step 3 - Location:**
   - Type location in search box OR
   - Click "Use current location" button
   - Click "Next: Price"
7. **Step 4 - Review:**
   - Verify all fields show correct values (not "(will be filled)")
   - Enter price (e.g., 500)
   - Click "Book" button

**Expected:**
- Step 4 review should show:
  - ✅ Title: [your title]
  - ✅ When: [formatted datetime]
  - ✅ Location: [your location]
  - ✅ Price: ₹[amount]
- After clicking "Book":
  - ✅ Page reloads
  - ✅ Booking appears in `/customer/bookings` under "ONGOING" tab

**Console Logs to Verify:**
```
BookWorkerButton: Book button clicked
BookWorkerButton: Submitting booking
BookWorkerButton: Response status 200
BookWorkerButton: Booking created successfully
```

**Status:** ⬜ Pass ⬜ Fail

**Notes:**
_____________________________________________________

---

### Test 3: Validation - Missing Title
**Steps:**
1. Open booking dialog
2. Leave title empty
3. Click "Next"

**Expected:**
- ⬜ Error message appears: "Please add a short title"
- ⬜ Cannot advance to step 2

**Status:** ⬜ Pass ⬜ Fail

---

### Test 4: Validation - Missing Date/Time
**Steps:**
1. Fill title, click Next
2. Don't select date/time
3. Click "Next: Price"

**Expected:**
- ⬜ Error message appears: "Please select date & time"
- ⬜ Cannot advance to step 3

**Status:** ⬜ Pass ⬜ Fail

---

### Test 5: Validation - Missing Location
**Steps:**
1. Fill title, click Next
2. Select date/time, click Next
3. Don't select location
4. Click "Next: Price"

**Expected:**
- ⬜ Error message appears: "Please select a location"
- ⬜ Cannot advance to step 4

**Status:** ⬜ Pass ⬜ Fail

---

### Test 6: Worker Receives Booking
**Steps:**
1. Complete a booking as CUSTOMER
2. Note the worker's ID
3. Sign out
4. Sign in as that WORKER
5. Navigate to worker dashboard/jobs page

**Expected:**
- ⬜ New booking appears in worker's pending/incoming jobs
- ⬜ Shows status: PENDING
- ⬜ Worker can see customer name, job description, date, time, location, price

**Status:** ⬜ Pass ⬜ Fail

---

### Test 7: Customer Sees Booking in "My Bookings"
**Steps:**
1. After creating a booking
2. Navigate to `/customer/bookings`

**Expected:**
- ⬜ Booking appears in "ONGOING" tab
- ⬜ Shows worker name, description, date/time, location, price
- ⬜ Status is "PENDING"

**Status:** ⬜ Pass ⬜ Fail

---

## 🐛 Debugging

### If booking doesn't work, check:

#### 1. Browser Console (F12)
Look for error messages or failed network requests.

**Expected logs:**
```javascript
BookWorkerButton: Book button clicked { loading: false, step: 3 }
BookWorkerButton: Submitting booking { workerId: "...", description: "...", ... }
BookWorkerButton: Response status 200
BookWorkerButton: Booking created successfully { job: { id: "...", ... } }
```

**Common errors:**
- ❌ "Unauthorized" → Not logged in
- ❌ "User not found" → User hasn't completed onboarding
- ❌ "Access denied. CUSTOMER role required" → User is WORKER, not CUSTOMER
- ❌ "Invalid worker" → Worker doesn't exist or wrong role
- ❌ "Missing required fields" → Form data incomplete

#### 2. Network Tab (F12 → Network)
**Check POST request to `/api/jobs`:**

**Request:**
- Method: POST
- Headers: Content-Type: application/json
- Payload should contain:
  ```json
  {
    "workerId": "clxxx...",
    "description": "Fix leaking faucet",
    "details": "Kitchen sink is dripping",
    "datetime": "2025-10-06T14:00:00.000Z",
    "location": "123 Main St",
    "charge": 500
  }
  ```

**Response:**
- Status: 200 OK
- Body should contain:
  ```json
  {
    "success": true,
    "job": {
      "id": "clxxx...",
      "customerId": "clxxx...",
      "workerId": "clxxx...",
      "description": "Fix leaking faucet",
      "status": "PENDING",
      ...
    }
  }
  ```

#### 3. Server Console (VS Code Terminal)
Look for errors in the terminal where `npm run dev` is running.

**Common errors:**
- Database connection errors
- Prisma query errors
- Foreign key constraint violations
- Authentication errors

#### 4. Database Query (if needed)
```sql
-- Check if job was created
SELECT * FROM "Job" ORDER BY "createdAt" DESC LIMIT 5;

-- Check customer exists
SELECT id, name, email, role FROM "User" WHERE role = 'CUSTOMER';

-- Check worker exists
SELECT id, name, email, role FROM "User" WHERE role = 'WORKER';
```

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Unauthenticated User | ⬜ | |
| Full Booking Flow | ⬜ | |
| Missing Title Validation | ⬜ | |
| Missing Date Validation | ⬜ | |
| Missing Location Validation | ⬜ | |
| Worker Receives Booking | ⬜ | |
| Customer Sees in My Bookings | ⬜ | |

---

## 🎯 Success Criteria

All tests should pass with:
- ✅ Form validation working correctly
- ✅ Review section populated on step 4
- ✅ Booking created in database
- ✅ Customer sees booking in "My Bookings"
- ✅ Worker sees booking in their jobs list
- ✅ Worker can accept/reject booking
- ✅ No console errors
- ✅ No network errors

---

## 📝 Additional Notes

**Browser Developer Tools Shortcuts:**
- F12 - Open DevTools
- Ctrl+Shift+C - Inspect element
- Ctrl+Shift+J - Jump to Console
- Ctrl+Shift+E - Jump to Network tab

**Useful Console Commands:**
```javascript
// Check if user is signed in
console.log(window.Clerk?.user)

// Check current path
console.log(window.location.pathname)

// Re-run last network request
// Right-click request in Network tab → Replay XHR
```

**Quick Database Reset (if needed):**
```powershell
npx prisma db push --force-reset
npx prisma db seed  # if you have seed data
```
