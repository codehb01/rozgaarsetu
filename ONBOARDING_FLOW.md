# RozgaarSetu Onboarding Flow Documentation

## Overview

The RozgaarSetu onboarding system provides a comprehensive multi-step registration process for both customers and workers, ensuring complete profile setup before platform access.

## Flow Architecture

### Customer Onboarding Flow

1. **Role Selection** (`/onboarding`)

   - User selects "Customer" role
   - Redirects to customer details page

2. **Customer Details** (`/onboarding/customer-details`)

   - Collects address information
   - Form validation with error handling
   - Data stored in sessionStorage for preview

3. **Preview** (`/onboarding/preview`)

   - Shows profile summary
   - Allows back navigation for edits
   - Submits final data to create profile

4. **Finish** (`/onboarding/finish`)
   - Success confirmation
   - Platform introduction
   - Direct link to customer dashboard

### Worker Onboarding Flow

1. **Role Selection** (`/onboarding`)

   - User selects "Worker" role
   - Redirects to worker details page

2. **Worker Details** (`/onboarding/worker-details`)

   - **Personal Information**: Aadhar number, years of experience, qualification, certificates, bio
   - **Skills & Services**: Skilled areas, available service locations
   - **Pricing**: Hourly rate and minimum fee (new feature)
   - **Address**: Complete location details
   - **Profile Picture**: Optional profile image URL
   - Form validation with comprehensive error handling
   - Data stored in sessionStorage for next steps

3. **Previous Work** (`/onboarding/previous-work`) - Optional

   - Add portfolio images with titles and descriptions
   - Image URL input with external hosting support
   - Skip option available
   - Multiple work items supported
   - Real-time preview of added work

4. **Preview** (`/onboarding/preview`)

   - Complete profile preview including:
     - Personal and professional details
     - Skills and pricing information
     - Previous work portfolio (if added)
     - Service areas
   - Edit navigation available
   - Final profile submission

5. **Finish** (`/onboarding/finish`)
   - Success confirmation with role-specific messaging
   - Profile completion checklist
   - Platform guidance for next steps
   - Direct link to worker dashboard

## Technical Implementation

### Data Flow

- **SessionStorage**: Temporary data storage between steps
- **Form Validation**: Zod schema validation for all forms
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Clerk integration with user role management

### Key Features

#### New Worker Pricing Fields

- **Hourly Rate**: Required field for service pricing
- **Minimum Fee**: Base fee after booking acceptance
- Both fields validated as positive numbers ≥ ₹1

#### Previous Work Portfolio

- **Optional Step**: Workers can skip if no previous work to show
- **Image Upload**: External URL-based image hosting
- **Multiple Items**: Add multiple previous work examples
- **Rich Preview**: Title, description, and image preview
- **Database Storage**: `PreviousWork` model with worker relationship

#### Enhanced User Experience

- **Progressive Navigation**: Clear step indicators
- **Back Navigation**: Return to previous steps for edits
- **Form Persistence**: Data preserved during navigation
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive validation feedback

### Database Schema Updates

#### WorkerProfile Model

```prisma
model WorkerProfile {
  // ... existing fields
  hourlyRate   Float?   // New: Hourly service rate
  minimumFee   Float?   // New: Minimum booking fee
  previousWorks PreviousWork[] // Relation to portfolio items
}
```

#### PreviousWork Model

```prisma
model PreviousWork {
  id          String   @id @default(uuid())
  workerId    String
  worker      WorkerProfile @relation(fields: [workerId], references: [id])
  title       String?
  description String?
  images      String[]  // Array of image URLs
  location    String?
  createdAt   DateTime @default(now())
}
```

### API Endpoints

#### `/app/api/actions/onboarding.ts`

- **setUserRole**: Handles final profile creation for both roles
- **getCurrentUser**: Retrieves user profile with role information
- **Enhanced validation**: Includes new required fields
- **Portfolio creation**: Handles previous work items creation

## User Journey Examples

### Customer Journey

```
Select Role → Customer Details → Preview → Finish → Dashboard
```

### Worker Journey (Complete)

```
Select Role → Worker Details → Previous Work → Preview → Finish → Dashboard
```

### Worker Journey (Skip Portfolio)

```
Select Role → Worker Details → Skip Previous Work → Preview → Finish → Dashboard
```

## Validation Rules

### Worker Details

- Aadhar: 12-digit number, unique across platform
- Qualification: Minimum 2 characters
- Years Experience: Non-negative number
- Hourly Rate: ≥ ₹1, required
- Minimum Fee: ≥ ₹1, required
- Skills: At least one skill required
- Address: Complete address required

### Customer Details

- Address: Minimum 3 characters
- City, State, Country: Minimum 2 characters each
- Postal Code: Minimum 4 characters

## Security & Data Protection

- **Session Management**: Temporary data cleared after submission
- **Validation**: Server-side validation for all inputs
- **Unique Constraints**: Aadhar number uniqueness enforced
- **Error Handling**: Graceful error messages for users
- **Authentication**: Clerk integration ensures secure user management

## Future Enhancements

- File upload for images (currently URL-based)
- Skill suggestions/autocomplete
- Location-based service area mapping
- Profile completion percentage indicator
- Email verification for new registrations
- SMS verification for phone numbers
