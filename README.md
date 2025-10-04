# RozgaarSetu

RozgaarSetu is a platform connecting workers with customers for various services. Built with Next.js 15, TypeScript, and modern web technologies.

## Features

- 🚀 **Multi-step Onboarding**: Comprehensive onboarding flow for workers and customers
- 🔐 **Authentication**: Secure authentication with Clerk
- 🖼️ **Image Uploads**: Cloudinary integration for profile pictures and work portfolios
- 📱 **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- 🎨 **Modern UI**: Beautiful UI components with shadcn/ui
- 📝 **Form Validation**: Robust form validation with Zod and React Hook Form

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Image Storage**: Cloudinary
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- PostgreSQL database
- Cloudinary account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd rozgaarsetu
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables to `.env.local`:

   ```env
   # Database
   DATABASE_URL="your-postgresql-connection-string"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # App URL (used for Referer in geocoding requests)
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # OpenStreetMap Nominatim identification (required by usage policy)
   # Provide a descriptive UA with contact method for production deployments.
   NOMINATIM_USER_AGENT="RozgaarSetu/1.0 (contact: you@example.com)"
   ```

### Setup Instructions

#### 1. Database Setup

```bash
# Initialize Prisma
npx prisma generate
npx prisma db push
```

#### 2. Clerk Authentication Setup

1. Create account at [Clerk.com](https://clerk.com)
2. Create a new application
3. Copy the API keys to your `.env.local`
4. Configure sign-in/sign-up URLs

#### 3. Cloudinary Setup

1. Create account at [Cloudinary.com](https://cloudinary.com)
2. Go to Dashboard to get your credentials
3. Add Cloud Name, API Key, and API Secret to `.env.local`

#### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Location and Geocoding

- This project uses OpenStreetMap Nominatim for geocoding (search and reverse geocode); all requests are proxied via our Next.js API and cached in-memory (10 min TTL) to be friendly to rate limits.
- We also send proper identification headers per the Nominatim usage policy. Configure `NEXT_PUBLIC_APP_URL` and `NOMINATIM_USER_AGENT` in your `.env.local`.
- A minimal best-effort 1 req/sec throttle is applied per endpoint. In serverless/multi-instance environments, consider a centralized rate limiter (e.g., Redis) if you expect higher traffic.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
