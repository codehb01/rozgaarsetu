# 🚀 Team Setup Guide - Translation Feature

## ⚙️ Environment Setup

### 1. Clone and Install

```bash
git pull origin feature-translate-rc
npm install
```

### 2. Create Environment File

```bash
cp .env.example .env
```

### 3. Configure Your .env File

```env
# Your own Neon database connection
DATABASE_URL='postgresql://your_user:your_password@your_endpoint/your_db'

# Shared Google Translate API Key (replace with your own)
GOOGLE_TRANSLATE_API_KEY=your_google_api_key_here

# Your Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding

# Optional: Azure Translator (if you want comparison features)
AZURE_TRANSLATOR_KEY=your_azure_key
AZURE_TRANSLATOR_REGION=your_region
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
```

### 4. Setup Database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Run Development Server

```bash
npm run dev
```

## ✅ Verify Translation System

1. Visit `http://localhost:3000`
2. Use language selector in navbar
3. Check translation cache in database: `npx prisma studio`

## 🚨 Security Note

- Never commit `.env` files to git
- Each team member needs their own database and Clerk keys
- Google API key can be shared for development
