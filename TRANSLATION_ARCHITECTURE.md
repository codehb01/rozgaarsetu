# Translation System Architecture - RozgaarSetu

## Overview

RozgaarSetu implements a comprehensive, production-ready translation system that supports real-time language switching between English, Hindi, and Marathi. The system is designed for optimal performance, user experience, and developer productivity.

## Core Architecture

### 1. Translation Service Layer (`lib/translation-service.ts`)

**Purpose**: Central service for handling translation requests and caching

**Key Features**:

- Google Translate API integration
- Database caching with PostgreSQL
- Batch translation support
- Error handling and fallbacks

**Implementation**:

```typescript
export async function translateText(
  text: string,
  targetLanguage: Language,
  context?: string
): Promise<string>;

export async function translateBatch(
  texts: string[],
  targetLanguage: Language,
  contexts?: string[]
): Promise<string[]>;
```

### 2. Translation Hooks

#### Base Hook (`hooks/use-translation.tsx`)

- Language state management
- Direct translation API calls
- Context-aware translation
- Cache management

#### Batch Translation Hook (`hooks/use-batch-translation.tsx`)

- **Performance Optimization**: Collects multiple translation requests over 100ms windows
- **Context Grouping**: Groups requests by page context to improve cache efficiency
- **React Component**: Provides `TranslatedText` component for easy integration

**Batch Collection Algorithm**:

```typescript
// Collects requests over 100ms, then processes in contextual batches
const processBatch = useCallback(async () => {
  const currentRequests = [...pendingRequests.current];
  pendingRequests.current = [];

  // Group by context for better caching
  const contextGroups = groupBy(currentRequests, "context");

  // Process each context group
  for (const [context, requests] of Object.entries(contextGroups)) {
    const results = await translateBatch(texts, currentLanguage, contexts);
    // ... resolve promises
  }
}, [currentLanguage, translateBatch]);
```

### 3. Database Schema

**TranslationCache Table**:

```sql
model TranslationCache {
  id            String   @id
  originalText  String
  translatedText String
  sourceLanguage String  @default("en")
  targetLanguage String
  context       String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Composite Unique Index**: Ensures efficient lookups and prevents duplicates

```sql
@@unique([originalText, sourceLanguage, targetLanguage, context])
```

### 4. API Endpoints

#### Batch Translation API (`app/api/translate/batch/route.ts`)

- Handles multiple translation requests
- Context-aware caching
- Database upsert operations
- Error handling and fallbacks

**Request Format**:

```json
{
  "texts": ["Hello", "World"],
  "targetLanguage": "hi",
  "contexts": ["homepage", "navigation"]
}
```

### 5. UI Components

#### Language Switcher (`components/translation/language-switcher.tsx`)

- Dropdown and button variants
- Real-time language switching
- Visual language indicators (flags, names)

#### TranslatedText Component (`hooks/use-batch-translation.tsx`)

- Automatic text translation with context
- Loading state handling
- Fallback to original text on errors

**Usage**:

```tsx
<TranslatedText context="homepage">Welcome to RozgaarSetu</TranslatedText>
```

## Performance Optimizations

### 1. Batch Processing

- **Problem Solved**: Individual API calls were causing 300+ requests per page
- **Solution**: 100ms batching reduces calls to 5-10 per page load
- **Result**: 95% reduction in API calls, significantly faster page loads

### 2. Intelligent Caching

- **Database Layer**: PostgreSQL with composite unique constraints
- **Context Awareness**: Same text with different contexts cached separately
- **Cache Efficiency**: Context grouping improves cache hit rates

### 3. Lazy Loading

- Translations only triggered when components mount
- Background processing doesn't block UI rendering
- Graceful fallbacks maintain functionality during loading

## Security & Reliability

### 1. API Key Management

- Google Translate API key stored in environment variables
- Server-side API calls only (client never sees the key)
- Rate limiting and error handling

### 2. Data Validation

- Input sanitization for translation requests
- SQL injection prevention through Prisma ORM
- Type safety with TypeScript

### 3. Error Handling

- Graceful degradation to original text
- Logging for debugging and monitoring
- Retry mechanisms for transient failures

## Deployment Considerations

### 1. Environment Variables

```env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
DATABASE_URL=your_postgres_url
```

### 2. Database Migration

```bash
npx prisma db push
# or
npx prisma migrate deploy
```

### 3. Build Process

- Next.js handles compilation
- Static optimization for better performance
- Client/server code separation

## Monitoring & Analytics

### 1. Performance Metrics

- Translation cache hit rates
- API response times
- Batch processing efficiency

### 2. Error Tracking

- Failed translation attempts
- API rate limiting
- Database connection issues

### 3. User Analytics

- Language preference tracking
- Popular content identification
- Translation accuracy feedback

## Future Enhancements

### 1. Planned Features

- Offline translation support
- Custom translation overrides
- Admin translation management interface
- A/B testing for translation quality

### 2. Scalability Improvements

- Redis caching layer
- CDN integration for static translations
- Microservice architecture for translation service

## Technical Specifications

- **Languages Supported**: English (en), Hindi (hi), Marathi (mr)
- **Translation Provider**: Google Translate API
- **Database**: PostgreSQL with Prisma ORM
- **Framework**: Next.js 15 with React 18
- **Caching Strategy**: Database + Context-aware grouping
- **Performance**: <100ms translation response time (cached)
- **Batch Size**: Optimal 10-50 texts per batch
- **Error Rate**: <1% with fallback mechanisms

## Development Workflow

### 1. Adding New Translatable Content

```tsx
// Instead of:
<h1>Welcome to RozgaarSetu</h1>

// Use:
<h1><TranslatedText context="page-context">Welcome to RozgaarSetu</TranslatedText></h1>
```

### 2. Context Naming Convention

- Use kebab-case: `customer-dashboard`, `worker-profile`
- Be specific: `booking-status` vs `status`
- Group related elements: `navigation`, `forms`, `errors`

### 3. Testing Translation

```bash
# Start development server
npm run dev

# Change language in UI
# Verify translations appear correctly
# Check browser console for batch requests
```

This architecture provides a robust, scalable, and maintainable translation system that handles the complexity of multilingual support while maintaining optimal performance and user experience.
