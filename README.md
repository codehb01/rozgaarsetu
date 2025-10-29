# RozgaarSetu

A comprehensive platform connecting skilled workers with customers for various services across India. Built with modern web technologies to provide a seamless experience for both service providers and seekers.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

RozgaarSetu is a full-stack web application designed to bridge the gap between skilled workers and customers seeking services. The platform provides:

- **For Workers**: Profile creation, job applications, earnings tracking, and portfolio management
- **For Customers**: Service search, worker booking, payment processing, and review system
- **Secure Payments**: Integrated Razorpay payment gateway with verification
- **Location-based Search**: Find workers near you using GPS and geocoding
- **Real-time Updates**: Track job status from booking to completion

<!-- Add hero/landing page screenshot here -->

![Landing Page](./docs/images/landing-page.png)

---

## Key Features

### Worker Features

- **Profile Management**: Create detailed profiles with skills, experience, and certifications
- **Portfolio Showcase**: Upload previous work images to attract customers
- **Job Dashboard**: View and manage incoming job requests
- **Earnings Tracker**: Monitor completed jobs and payment history
- **Location Services**: Set service areas and availability zones

<!-- Add worker dashboard screenshot here -->

![Worker Dashboard](./docs/images/worker-dashboard.png)

### Customer Features

- **Advanced Search**: Find workers by skill, location, and ratings
- **Booking System**: Create detailed job requests with schedules
- **Payment Integration**: Secure online payments via Razorpay
- **Review & Ratings**: Rate workers after job completion
- **Booking Management**: Track all your bookings in one place

<!-- Add customer dashboard screenshot here -->

![Customer Dashboard](./docs/images/customer-dashboard.png)

### Platform Features

- **Multi-step Onboarding**: Guided registration for workers and customers
- **Role-based Access**: Separate interfaces and permissions for workers and customers
- **Responsive Design**: Fully functional on desktop, tablet, and mobile devices
- **Authentication**: Secure user authentication with Clerk
- **Image Storage**: Cloudinary integration for profile and portfolio images
- **Job Lifecycle Management**: Complete workflow from job creation to completion with proof of work

<!-- Add mobile responsive screenshots here -->

![Mobile Views](./docs/images/mobile-responsive.png)

---

## Screenshots

### Onboarding Process

<!-- Add onboarding flow screenshots here -->

![Onboarding Flow](./docs/images/onboarding-process.png)

### Search & Booking

<!-- Add search and booking screenshots here -->

![Search Workers](./docs/images/search-booking.png)

### Payment Flow

<!-- Add payment process screenshots here -->

![Payment Process](./docs/images/payment-flow.png)

### Job Management

<!-- Add job tracking screenshots here -->

![Job Tracking](./docs/images/job-management.png)

---

## Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Management**: React Hook Form
- **Validation**: Zod Schema Validation
- **State Management**: React Hooks

### Backend

- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database ORM**: Prisma
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **Payment Gateway**: Razorpay

### Database

- **Database**: PostgreSQL
- **Hosting**: Neon.tech (Serverless PostgreSQL)
- **Migration Tool**: Prisma Migrate

### DevOps & Deployment

- **Hosting**: Vercel
- **CI/CD**: Vercel Git Integration
- **Monitoring**: Vercel Analytics
- **Version Control**: Git/GitHub

### Third-party Services

- **Geocoding**: OpenStreetMap Nominatim API
- **Maps**: OpenStreetMap
- **Email**: Clerk Email Service
- **SMS**: (To be integrated)

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js Frontend - React Components, Tailwind CSS)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│         (Next.js API Routes, Server Components)             │
└────────────────────┬────────────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Clerk   │  │Cloudinary│  │ Razorpay │
│  (Auth)  │  │ (Images) │  │(Payments)│
└──────────┘  └──────────┘  └──────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│         (Prisma ORM + PostgreSQL on Neon.tech)              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

**Core Models:**

- `User`: Authentication and profile data
- `WorkerProfile`: Worker-specific information (skills, experience, rates)
- `CustomerProfile`: Customer-specific information (address, preferences)
- `Job`: Job postings and bookings
- `Review`: Customer reviews and ratings
- `Transaction`: Payment and earnings records
- `PreviousWork`: Worker portfolio items

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** or **pnpm**
- **Git**

You'll also need accounts for:

- [Clerk](https://clerk.com) - Authentication
- [Neon.tech](https://neon.tech) - Database hosting
- [Cloudinary](https://cloudinary.com) - Image storage
- [Razorpay](https://razorpay.com) - Payment processing

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/rozgaarsetu.git
cd rozgaarsetu
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

See [Environment Configuration](#environment-configuration) section for detailed setup.

4. **Initialize the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database (Neon.tech PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Cloudinary (Image Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Geocoding (OpenStreetMap Nominatim)
NOMINATIM_USER_AGENT="RozgaarSetu/1.0 (contact: your-email@example.com)"
```

### Environment Variables Explanation

| Variable                            | Description                                 | Required |
| ----------------------------------- | ------------------------------------------- | -------- |
| `DATABASE_URL`                      | PostgreSQL connection string from Neon.tech | Yes      |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client-side)         | Yes      |
| `CLERK_SECRET_KEY`                  | Clerk secret key (server-side)              | Yes      |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                  | Yes      |
| `CLOUDINARY_API_KEY`                | Cloudinary API key                          | Yes      |
| `CLOUDINARY_API_SECRET`             | Cloudinary API secret                       | Yes      |
| `RAZORPAY_KEY_ID`                   | Razorpay key ID (test or live)              | Yes      |
| `RAZORPAY_KEY_SECRET`               | Razorpay key secret                         | Yes      |
| `NEXT_PUBLIC_APP_URL`               | Your application URL                        | Yes      |
| `NOMINATIM_USER_AGENT`              | User agent for geocoding requests           | Yes      |

---

## Database Setup

### Schema Overview

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Core user model linked to Clerk authentication
- **WorkerProfile**: Extended profile for service providers
- **CustomerProfile**: Extended profile for service seekers
- **Job**: Job postings with status tracking
- **Review**: Rating and feedback system
- **Transaction**: Financial records
- **JobLog**: Audit trail for job state changes

### Running Migrations

For development:

```bash
npx prisma migrate dev --name descriptive_name
```

For production:

```bash
npx prisma migrate deploy
```

### Database Seeding (Optional)

```bash
npx prisma db seed
```

### Viewing Database

```bash
npx prisma studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) to view and edit data.

---

## Payment Integration

### Razorpay Setup

1. **Create a Razorpay Account**

   - Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Complete KYC verification for live mode

2. **Get API Keys**

   - For testing: Use test mode keys (`rzp_test_...`)
   - For production: Use live mode keys (`rzp_live_...`)

3. **Configure Environment**

   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

4. **Test Payment Flow**
   - Use Razorpay test cards: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Payment Features

- Order creation with job details
- Payment verification with signature validation
- Automatic status updates on success
- Platform fee calculation (10% of job charge)
- Worker earnings tracking
- Transaction history

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**

   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your Git repository
   - Vercel auto-detects Next.js configuration

2. **Configure Environment Variables**

   - Add all environment variables from `.env.local`
   - Set appropriate values for production
   - Use live keys for Razorpay, Clerk, etc.

3. **Configure Build Settings**

   ```json
   {
     "buildCommand": "prisma generate && next build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

4. **Deploy**

   - Push to your main branch
   - Vercel automatically deploys
   - Each commit triggers a new deployment

5. **Custom Domain (Optional)**
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed
   - SSL certificates are auto-generated

### Post-Deployment Checklist

- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow with Clerk
- [ ] Test payment integration with Razorpay
- [ ] Verify image uploads to Cloudinary
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Monitor logs for errors
- [ ] Set up monitoring and alerts

### Alternative Deployment Options

- **Railway**: Similar to Vercel, supports PostgreSQL
- **Render**: Good for full-stack apps
- **AWS/Azure/GCP**: For enterprise deployments
- **Docker**: Containerized deployment

---

## API Documentation

### Authentication Endpoints

All API routes require Clerk authentication unless specified.

### Jobs API

**Create Job**

```
POST /api/jobs
Content-Type: application/json

{
  "description": "Need plumber for kitchen sink",
  "details": "Leak in kitchen sink, urgent",
  "date": "2025-11-01T10:00:00Z",
  "location": "123 Main St, Mumbai",
  "charge": 500,
  "workerId": "worker-uuid"
}
```

**Get Jobs**

```
GET /api/jobs
Query params: ?status=PENDING&role=CUSTOMER
```

**Update Job Status**

```
PATCH /api/jobs/[id]
{
  "action": "ACCEPT" | "START" | "COMPLETE" | "CANCEL"
}
```

### Workers API

**Search Workers**

```
GET /api/workers
Query params: ?skill=plumber&city=Mumbai&lat=19.0760&lng=72.8777
```

**Get Worker Profile**

```
GET /api/workers/[id]
```

### Reviews API

**Create Review**

```
POST /api/reviews
{
  "jobId": "job-uuid",
  "rating": 5,
  "comment": "Excellent work!"
}
```

### Payment API

**Create Payment Order**

```
PATCH /api/jobs/[id]
{
  "action": "COMPLETE"
}
```

**Verify Payment**

```
POST /api/jobs/[id]
{
  "razorpayPaymentId": "pay_xxxxx",
  "razorpaySignature": "signature"
}
```

---

## Location and Geocoding

The application uses OpenStreetMap Nominatim API for geocoding services:

- **Search API**: Convert addresses to coordinates
- **Reverse Geocode**: Convert coordinates to addresses
- **Caching**: In-memory cache with 10-minute TTL
- **Rate Limiting**: 1 request per second per endpoint
- **Compliance**: Proper User-Agent headers as per OSM policy

Configure the following in `.env.local`:

```env
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NOMINATIM_USER_AGENT="RozgaarSetu/1.0 (contact: admin@your-domain.com)"
```

For production with high traffic, consider:

- Self-hosted Nominatim instance
- Commercial geocoding services (Google Maps, Mapbox)
- Redis-based centralized rate limiting

---

## Project Structure

```
rozgaarsetu/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/                   # Main application
│   │   ├── customer/             # Customer pages
│   │   ├── worker/               # Worker pages
│   │   └── onboarding/           # Onboarding flow
│   ├── api/                      # API routes
│   │   ├── jobs/
│   │   ├── workers/
│   │   ├── reviews/
│   │   └── user/
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Helper functions
│   └── schema.ts                 # Zod schemas
├── prisma/                       # Database
│   ├── schema.prisma             # Prisma schema
│   └── migrations/               # Migration files
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## Contributing

We welcome contributions to RozgaarSetu! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For issues, questions, or contributions:

- **GitHub Issues**: [Report a bug](https://github.com/yourusername/rozgaarsetu/issues)
- **Email**: support@rozgaarsetu.com
- **Documentation**: [Wiki](https://github.com/yourusername/rozgaarsetu/wiki)

---

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Clerk for authentication services
- shadcn for the beautiful UI components
- OpenStreetMap contributors for geocoding data

---

**Built with ❤️ for connecting workers and customers across India**
