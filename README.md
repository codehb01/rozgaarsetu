<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white" alt="Next.js 15"/>
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

<p align="center">
  <b>RozgaarSetu</b> — A full-stack job marketplace connecting skilled workers with customers across India.
</p>

<p align="center">
  One unified platform for service discovery, booking, payment, and reviews with role-based access for workers and customers.
</p>

---

## Contents

- [What is RozgaarSetu?](#what-is-rozgaarsetu)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## What is RozgaarSetu?

RozgaarSetu is a **full-stack job marketplace** that brings together service providers (workers) and service seekers (customers) on a single platform. It handles the complete job lifecycle—from discovery and booking through payment and reviews—with secure authentication, payment processing, and location-based search.

**For Workers**: Create profiles, showcase portfolios, manage incoming jobs, track earnings, and build reputation.

**For Customers**: Search workers by skill and location, book services, pay securely, leave reviews, and track job status.

**For the Platform**: Enforced input validation, graceful error handling, environment validation at startup, and restricted image sources for security.

---

## Core Features

| Area | What it does |
|---|---|
| **Authentication** | Clerk-based secure auth with role-based access (Worker/Customer) |
| **Job Booking** | Create requests with date, time, location, charge; accept/start/complete workflow |
| **Worker Search** | Filter by skill, location, ratings; distance calculation using GPS |
| **Profiles** | Detailed worker portfolios with skills, experience, certifications, and previous work |
| **Payments** | Razorpay integration with order creation, signature verification, and automatic status updates |
| **Reviews & Ratings** | Post-completion feedback system for quality control |
| **Image Storage** | Cloudinary for profile pics, portfolios, and work proofs |
| **Responsive Design** | Works on desktop, tablet, and mobile with Tailwind CSS |
| **Location Services** | Nominatim (OpenStreetMap) geocoding + reverse-geocoding for address lookup |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · React Query |
| **Backend** | Next.js API Routes · Zod validation · Custom middleware (auth, rate-limit, cache, error handling) |
| **Database** | Prisma ORM · PostgreSQL |
| **Auth** | Clerk |
| **Storage** | Cloudinary (images) |
| **Payments** | Razorpay |
| **DevOps** | Vercel · GitHub Actions · TypeScript type checking |

---

## Quick Start

### Prerequisites

- Node.js 18+ · npm/yarn/pnpm · Git
- Accounts: Clerk · Neon.tech (PostgreSQL) · Cloudinary · Razorpay

### Install & Run

```bash
# Clone and install
git clone https://github.com/yourusername/rozgaarsetu.git
cd rozgaarsetu
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys (see "Environment Setup" below)

# Initialize database
npx prisma db push

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

### Request Flow

```
Client (Next.js Frontend)
    ↓
Middleware chain
  → Request ID logging
  → Clerk authentication
  → Rate limiting (Redis)
  → Response caching (Redis)
  → Guardrail evaluation
    ↓
API Routes (handlers)
  → Zod schema validation
  → Access control (can this user do this?)
  → Business logic (services)
  → Prisma queries
    ↓
PostgreSQL (data persistence)

Side integrations:
  → Clerk (auth tokens)
  → Cloudinary (image uploads)
  → Razorpay (payment orders + verification)
  → Nominatim (geocoding)
```

### Core Models

- **User** — Clerk sync + local profile (name, email, phone, role)
- **WorkerProfile** — Skills, experience, rates, location, portfolio
- **CustomerProfile** — Address, service preferences
- **Job** — Booking with status (PENDING → ACCEPTED → IN_PROGRESS → COMPLETED)
- **Review** — Ratings and feedback post-completion
- **Transaction** — Payment records with earnings split

---

## Project Structure

```
app/
  ├── (auth)/              # Sign-in / sign-up pages
  ├── (main)/
  │   ├── customer/        # Customer dashboard, profile, search, bookings
  │   ├── worker/          # Worker dashboard, profile, job management, earnings
  │   └── onboarding/      # Multi-step setup for both roles
  ├── api/                 # REST endpoints
  │   ├── jobs/
  │   ├── workers/
  │   ├── reviews/
  │   ├── customer/
  │   ├── worker/
  │   └── user/
  ├── error.tsx            # Error boundary
  ├── not-found.tsx        # 404 page
  └── layout.tsx

components/
  ├── ui/                  # shadcn components (button, card, input, etc.)
  ├── customer/            # Customer-specific UI
  ├── worker/              # Worker-specific UI
  └── [others]

hooks/
  ├── api/                 # React Query hooks (useJobsQuery, useWorkersSearchQuery, etc.)
  └── use-location.ts

lib/
  ├── access/              # Authorization checks (can-X functions)
  ├── services/            # Business logic (job-service, worker-service, etc.)
  ├── api-auth.ts          # Auth helpers
  ├── api-response.ts      # Response formatting
  ├── env.ts               # Environment validation at startup
  ├── schema.ts            # Zod schemas with constraints
  ├── geocoding.ts         # Address ↔ coordinates
  ├── razorpay-service.ts  # Payment helper
  └── [utils]

prisma/
  ├── schema.prisma        # Data models
  └── migrations/

public/                    # Static assets
```

---

## Environment Setup

Create `.env.local` (or use `.env.example` as template):

```env
# Database
DATABASE_URL="postgresql://user:password@neon.tech/db?sslmode=require"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Cloudinary Images
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Razorpay Payments
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."

# Geocoding
NEXT_PUBLIC_NOMINATIM_URL="https://nominatim.openstreetmap.org"
```

All variables are validated on startup — missing or invalid values fail fast with clear error messages.

---

## API Endpoints

All endpoints require Clerk authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs` | List jobs (filtered by role/status) |
| PATCH | `/api/jobs/[id]` | Update job status (accept/start/complete/cancel) |
| GET | `/api/workers` | Search workers (by skill, location, lat/lng) |
| GET | `/api/worker/profile` | Get current worker profile |
| PATCH | `/api/worker/profile` | Update profile |
| GET | `/api/worker/earnings` | Earnings summary |
| GET | `/api/customer/profile` | Get customer profile |
| PATCH | `/api/customer/profile` | Update customer address |
| POST | `/api/reviews` | Submit job review |
| GET | `/health` | Liveness probe |

---

## Development

### Commands

```bash
# Linting (with errors fail the build)
npm run lint

# Type checking
npx tsc --noEmit

# Build
npm run build

# Format with Prettier
npm run format

# Database studio (GUI)
npx prisma studio
```

### Code Style

- **TypeScript**: No `any` types; use proper typing
- **Validation**: All user input validated with Zod before use
- **API Responses**: Consistent shape via `lib/api-response.ts`
- **Error Handling**: Try/catch with `withErrorHandling` middleware
- **Constraints**: Input lengths, number ranges, coordinate bounds all enforced in schemas

---

## Deployment

### To Vercel (Recommended)

1. Connect your GitHub repo in [Vercel Dashboard](https://vercel.com)
2. Add environment variables (from `.env.local`)
3. Vercel auto-detects Next.js configuration and deploys on push
4. Run migrations: `npx prisma migrate deploy`

### Pre-deployment Checklist

- [ ] Environment variables set in Vercel project
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Clerk production keys configured
- [ ] Razorpay live (or test) keys set
- [ ] Cloudinary API keys valid
- [ ] GitHub Actions CI passing (lint, build, type check)

---

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

### Code Requirements

- Changes pass `npm run lint` and `npx tsc --noEmit`
- No `any` types; proper TypeScript
- Input validated with Zod
- PR description includes what/why/how

---

## License

MIT — See [LICENSE](LICENSE) for details.

---

**Connecting skilled workers with customers across India.**
