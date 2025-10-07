# Translation Implementation Guide - RozgaarSetu

## Pages Translated & Implementation Examples

This guide provides developers with practical examples of how translation has been implemented across different pages and components in RozgaarSetu.

## Quick Reference

### How to Add Translation to Any Page

1. **Import the TranslatedText component**:

```tsx
import { TranslatedText } from "@/hooks/use-batch-translation";
```

2. **Wrap text content with context**:

```tsx
<h1>
  <TranslatedText context="page-name">Your Text Here</TranslatedText>
</h1>
```

3. **Use consistent context names** for related content on the same page

## Implemented Pages

### 1. Homepage (`app/page.tsx`)

**Context Used**: `homepage`

**Key Implementations**:

```tsx
// Hero section
<TranslatedText context="homepage">Find Skilled Workers for Any Job</TranslatedText>
<TranslatedText context="homepage">Connect with verified professionals</TranslatedText>

// Statistics
<TranslatedText context="homepage">Active Workers</TranslatedText>
<TranslatedText context="homepage">Jobs Completed</TranslatedText>

// Category cards
<TranslatedText context="homepage">Electricians</TranslatedText>
<TranslatedText context="homepage">Plumbers</TranslatedText>

// CTA buttons
<TranslatedText context="homepage">Find Workers</TranslatedText>
<TranslatedText context="homepage">Join as Worker</TranslatedText>
```

**Special Component**: `TranslatedShapeHero` for the animated hero section

### 2. Worker Dashboard (`app/(main)/worker/dashboard/page.tsx`)

**Context Used**: `worker-dashboard`

**Key Implementations**:

```tsx
// Page header
<TranslatedText context="worker-dashboard">Welcome back</TranslatedText>
<TranslatedText context="worker-dashboard">Here's your dashboard overview</TranslatedText>

// Stats cards
<TranslatedText context="worker-dashboard">Total Earnings</TranslatedText>
<TranslatedText context="worker-dashboard">Active Jobs</TranslatedText>
<TranslatedText context="worker-dashboard">Completed Jobs</TranslatedText>

// Status labels
<TranslatedText context="worker-dashboard">Available</TranslatedText>
<TranslatedText context="worker-dashboard">Busy</TranslatedText>

// Action buttons
<TranslatedText context="worker-dashboard">View All Jobs</TranslatedText>
<TranslatedText context="worker-dashboard">Update Profile</TranslatedText>
```

### 3. Worker Earnings Page (`app/(main)/worker/earnings/page.tsx`)

**Context Used**: `worker-earnings`

**Key Implementations**:

```tsx
// Loading and error states
<TranslatedText context="worker-earnings">Loading earnings...</TranslatedText>
<TranslatedText context="worker-earnings">Failed to load earnings data</TranslatedText>

// Page content
<TranslatedText context="worker-earnings">Earnings Analytics</TranslatedText>
<TranslatedText context="worker-earnings">Total Earnings</TranslatedText>
<TranslatedText context="worker-earnings">This Month</TranslatedText>
<TranslatedText context="worker-earnings">Monthly Change</TranslatedText>
```

### 4. Worker Jobs Page (`app/(main)/worker/job/page.tsx`)

**Context Used**: `worker-jobs`

**Key Implementations**:

```tsx
// Tab navigation
<TranslatedText context="worker-jobs">New</TranslatedText>
<TranslatedText context="worker-jobs">Previous</TranslatedText>

// Job details
<TranslatedText context="worker-jobs">Customer</TranslatedText>
<TranslatedText context="worker-jobs">At</TranslatedText>
<TranslatedText context="worker-jobs">Location</TranslatedText>
<TranslatedText context="worker-jobs">Charge</TranslatedText>

// Action buttons
<TranslatedText context="worker-jobs">Accept</TranslatedText>
<TranslatedText context="worker-jobs">Reject</TranslatedText>
```

### 5. Customer Dashboard (`app/(main)/customer/dashboard/page.tsx`)

**Context Used**: `customer-dashboard`

**Key Implementations**:

```tsx
// Welcome section
<TranslatedText context="customer-dashboard">Welcome back</TranslatedText>
<TranslatedText context="customer-dashboard">Find skilled professionals</TranslatedText>

// Stats section
<TranslatedText context="customer-dashboard">Active Bookings</TranslatedText>
<TranslatedText context="customer-dashboard">Completed Jobs</TranslatedText>
<TranslatedText context="customer-dashboard">Avg Rating Given</TranslatedText>

// Category browsing
<TranslatedText context="customer-dashboard">Browse by Category</TranslatedText>
<TranslatedText context="customer-dashboard">Available now</TranslatedText>

// Worker listings
<TranslatedText context="customer-dashboard">Recently Joined</TranslatedText>
<TranslatedText context="customer-dashboard">View Profile</TranslatedText>
```

### 6. Customer Bookings Page (`app/(main)/customer/bookings/page.tsx`)

**Context Used**: `customer-bookings`

**Key Implementations**:

```tsx
// Page header
<TranslatedText context="customer-bookings">My Bookings</TranslatedText>
<TranslatedText context="customer-bookings">Manage and track your service bookings</TranslatedText>

// Status labels (using dynamic components)
const getStatusConfig = (status) => ({
  label: <TranslatedText context="customer-bookings">Pending</TranslatedText>,
  // ... other properties
});

// Tab navigation
<TranslatedText context="customer-bookings">Ongoing</TranslatedText>
<TranslatedText context="customer-bookings">Previous</TranslatedText>

// Empty states
<TranslatedText context="customer-bookings">No ongoing bookings</TranslatedText>
<TranslatedText context="customer-bookings">Find Workers</TranslatedText>
```

### 7. Onboarding Pages

#### Main Onboarding (`app/(main)/onboarding/page.tsx`)

**Context Used**: `onboarding`

```tsx
// Role selection
<TranslatedText context="onboarding">Join as a Customer</TranslatedText>
<TranslatedText context="onboarding">Join as a Worker</TranslatedText>

// Feature lists
<TranslatedText context="onboarding">Book trusted services</TranslatedText>
<TranslatedText context="onboarding">Secure payments</TranslatedText>

// CTA buttons
<TranslatedText context="onboarding">Get Started as Customer</TranslatedText>
<TranslatedText context="onboarding">Get Started as Worker</TranslatedText>
```

#### Customer Details (`app/(main)/onboarding/customer-details/page.tsx`)

**Context Used**: `onboarding`

```tsx
// Navigation
<TranslatedText context="onboarding">Back to Role Selection</TranslatedText>

// Form headers
<TranslatedText context="onboarding">Customer Profile Details</TranslatedText>
<TranslatedText context="onboarding">Tell us where you're located</TranslatedText>

// Form sections
<TranslatedText context="onboarding">Address Information</TranslatedText>

// Action buttons
<TranslatedText context="onboarding">Continue to Preview</TranslatedText>
```

#### Worker Details (`app/(main)/onboarding/worker-details/page.tsx`)

**Context Used**: `onboarding`

```tsx
// Page header
<TranslatedText context="onboarding">Worker Profile Setup</TranslatedText>
<TranslatedText context="onboarding">Let's create your professional profile</TranslatedText>

// Navigation
<TranslatedText context="onboarding">Previous</TranslatedText>
<TranslatedText context="onboarding">Next</TranslatedText>
<TranslatedText context="onboarding">Complete Setup</TranslatedText>

// Progress indicator
<TranslatedText context="onboarding">Step</TranslatedText>
<TranslatedText context="onboarding">of</TranslatedText>
```

#### Finish Page (`app/(main)/onboarding/finish/page.tsx`)

**Context Used**: `onboarding`

```tsx
// Success messages
<TranslatedText context="onboarding">Welcome to RozgaarSetu! 🎉</TranslatedText>
<TranslatedText context="onboarding">Your profile has been created successfully</TranslatedText>

// Profile types
<TranslatedText context="onboarding">Worker Profile</TranslatedText>
<TranslatedText context="onboarding">Customer Profile</TranslatedText>

// Status indicators
<TranslatedText context="onboarding">Skills & Experience</TranslatedText>
<TranslatedText context="onboarding">Added</TranslatedText>
<TranslatedText context="onboarding">Set</TranslatedText>
<TranslatedText context="onboarding">Configured</TranslatedText>

// Call to action
<TranslatedText context="onboarding">Go to Dashboard</TranslatedText>
```

## Layout Components

### Customer Layout (`app/(main)/customer/layout.jsx`)

**Language Switcher Integration**:

```jsx
import { LanguageSwitcher } from "@/components/translation/language-switcher";

// Mobile controls with side-by-side positioning
<div className="lg:hidden fixed top-4 left-4 right-4 z-30 flex justify-between items-center">
  <button>Menu</button>
  <LanguageSwitcher variant="select" />
</div>

// Desktop language switcher
<div className="hidden lg:block fixed top-4 right-4 z-30">
  <LanguageSwitcher variant="select" />
</div>
```

### Worker Layout (`app/(main)/worker/layout.tsx`)

**Language Switcher Integration**:

```tsx
import { LanguageSwitcher } from "@/components/translation/language-switcher";

// Fixed positioning for language switcher
<div className="fixed top-20 right-4 z-30">
  <LanguageSwitcher variant="select" />
</div>;
```

## Context Naming Strategy

### Context Organization

- **Page-specific contexts**: `homepage`, `worker-dashboard`, `customer-bookings`
- **Feature-specific contexts**: `navigation`, `forms`, `errors`
- **Shared contexts**: `categories`, `status-labels`, `common-actions`

### Best Practices for Context Names

```tsx
// ✅ Good - Specific and descriptive
<TranslatedText context="customer-dashboard">Active Bookings</TranslatedText>
<TranslatedText context="worker-earnings">Monthly Revenue</TranslatedText>

// ❌ Avoid - Too generic
<TranslatedText context="dashboard">Active Bookings</TranslatedText>
<TranslatedText context="page">Monthly Revenue</TranslatedText>

// ✅ Good - Consistent naming
<TranslatedText context="booking-status">Pending</TranslatedText>
<TranslatedText context="booking-status">Completed</TranslatedText>

// ❌ Avoid - Inconsistent contexts for related content
<TranslatedText context="status">Pending</TranslatedText>
<TranslatedText context="booking">Completed</TranslatedText>
```

## Performance Considerations

### Batch Optimization Examples

**Before Implementation** (Individual API calls):

```tsx
// This would make 5 separate API calls
<div>
  <TranslatedText>Title 1</TranslatedText>
  <TranslatedText>Title 2</TranslatedText>
  <TranslatedText>Title 3</TranslatedText>
  <TranslatedText>Title 4</TranslatedText>
  <TranslatedText>Title 5</TranslatedText>
</div>
```

**After Implementation** (Batched):

```tsx
// This makes 1 batched API call for all 5 texts
<div>
  <TranslatedText context="page">Title 1</TranslatedText>
  <TranslatedText context="page">Title 2</TranslatedText>
  <TranslatedText context="page">Title 3</TranslatedText>
  <TranslatedText context="page">Title 4</TranslatedText>
  <TranslatedText context="page">Title 5</TranslatedText>
</div>
```

### Context Grouping Benefits

```tsx
// These will be batched together (same context)
<TranslatedText context="navigation">Home</TranslatedText>
<TranslatedText context="navigation">About</TranslatedText>
<TranslatedText context="navigation">Contact</TranslatedText>

// These will be in separate batches (different contexts)
<TranslatedText context="header">Welcome</TranslatedText>
<TranslatedText context="footer">Copyright</TranslatedText>
```

## Hydration Issues & Solutions

### Preventing Hydration Mismatches

```tsx
// Add suppressHydrationWarning to form elements
<Input
  placeholder="Search..."
  suppressHydrationWarning
/>

<Button
  onClick={handleClick}
  suppressHydrationWarning
>
  Submit
</Button>
```

## Testing Translation Implementation

### 1. Manual Testing Steps

```bash
# 1. Start development server
npm run dev

# 2. Navigate to any translated page
# 3. Change language using the language switcher
# 4. Verify all text translates correctly
# 5. Check browser console for batch requests (should see few requests, not many)
```

### 2. Checking Translation Performance

- Open Browser DevTools → Network tab
- Filter by "translate" requests
- Should see 5-10 batch requests per page instead of 100+ individual requests

### 3. Debugging Translation Issues

```tsx
// Add logging in development
useEffect(() => {
  console.log("Translation context:", context);
  console.log("Original text:", children);
  console.log("Translated text:", translatedText);
}, [context, children, translatedText]);
```

## Common Patterns & Components

### 1. Dynamic Status Labels

```tsx
const getStatusConfig = (status) => {
  switch (status) {
    case "PENDING":
      return {
        label: <TranslatedText context="status">Pending</TranslatedText>,
        // ... styling
      };
    // ... other cases
  }
};
```

### 2. Conditional Translation

```tsx
{
  userRole === "WORKER" ? (
    <TranslatedText context="dashboard">Worker Dashboard</TranslatedText>
  ) : (
    <TranslatedText context="dashboard">Customer Dashboard</TranslatedText>
  );
}
```

### 3. Loading States

```tsx
{
  isLoading ? (
    <TranslatedText context="common">Loading...</TranslatedText>
  ) : (
    <TranslatedText context="page">Content loaded</TranslatedText>
  );
}
```

This guide provides developers with everything needed to implement translation in new pages or components following the established patterns and performance optimizations.
