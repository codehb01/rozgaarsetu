# 🌐 Hybrid Translation System Documentation

## 🎯 Overview

RozgaarSetu now implements a **Hybrid Translation System** that intelligently combines:

- **📄 JSON-based translations** for static UI elements (fast & consistent)
- **🤖 Azure AI translations** for dynamic content with **database caching** (smart & scalable)

## 🏗️ Architecture

### **System Components**

```
┌─────────────────────────────────────────────────────────────────┐
│                    HYBRID TRANSLATION SYSTEM                    │
├─────────────────────────────────────────────────────────────────┤
│  📄 STATIC CONTENT (JSON)          │  🤖 DYNAMIC CONTENT (AZURE) │
│  ├─ Navigation menus               │  ├─ User reviews             │
│  ├─ Button labels                  │  ├─ Job descriptions         │
│  ├─ Form fields                    │  ├─ Worker bios              │
│  ├─ Error messages                 │  ├─ Comments                 │
│  └─ System notifications           │  └─ User-generated content   │
├─────────────────────────────────────────────────────────────────┤
│                    💾 DATABASE CACHING LAYER                    │
│  ├─ TranslationCache model         │  ├─ Hash-based lookup       │
│  ├─ Instant retrieval              │  ├─ Content-type grouping   │
│  └─ Auto cache management          │  └─ Usage analytics         │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
├── lib/
│   ├── translation-service.ts      # 🧠 Hybrid translation service
│   ├── azure-translator.ts         # ☁️ Azure AI service
│   └── prisma.ts                   # 💾 Database connection
│
├── app/api/
│   ├── translate/route.ts          # 🔄 Single translation endpoint
│   └── translate-batch/route.ts    # 📦 Batch translation endpoint
│
├── hooks/
│   └── use-dynamic-translation.ts  # 🎣 React hooks for components
│
├── contexts/
│   └── language-context.tsx        # 🌐 Enhanced language context
│
├── components/
│   └── hybrid-translation-demo.tsx # 🎮 Demo component
│
├── locales/
│   ├── en.json                     # 🇺🇸 English (static)
│   ├── hi.json                     # 🇮🇳 Hindi (static)
│   └── mr.json                     # 🇮🇳 Marathi (static)
│
└── prisma/
    └── schema.prisma               # 💾 Database schema
```

## 🗄️ Database Schema

### TranslationCache Model

```sql
CREATE TABLE "TranslationCache" (
    id              TEXT PRIMARY KEY,
    originalText    TEXT NOT NULL,
    translatedText  TEXT NOT NULL,
    sourceLanguage  TEXT NOT NULL,
    targetLanguage  TEXT NOT NULL,
    contentType     TEXT NOT NULL,  -- 'review', 'job', 'bio', etc.
    contentId       TEXT,           -- Related content ID
    hashKey         TEXT UNIQUE,    -- SHA256 hash for fast lookup
    createdAt       TIMESTAMP DEFAULT now(),
    updatedAt       TIMESTAMP DEFAULT now(),
    lastAccessedAt  TIMESTAMP DEFAULT now()
);
```

## 🔧 Usage Guide

### **1. Static Content (JSON System)**

For UI elements that don't change:

```tsx
import { useLanguage } from "@/contexts/language-context";

function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t("nav.home")}</h1> {/* 📄 JSON translation */}
      <button>{t("common.submit")}</button>
    </div>
  );
}
```

### **2. Dynamic Content (Azure AI + Cache)**

For user-generated content:

```tsx
import { useReviewTranslation } from '@/hooks/use-dynamic-translation';

function ReviewCard({ review }) {
  const { translatedText, isLoading } = useReviewTranslation(
    review.comment,
    review.id
  );

  return (
    <div>
      {isLoading ? (
        <div>Translating...</div>
      ) : (
        <p>{translatedText}</p>        {/* 🤖 Azure AI translation */}
      )}
    </div>
  );
}
```

### **3. Batch Translation**

For multiple items at once:

```tsx
import { useBatchTranslation } from "@/hooks/use-dynamic-translation";

function ReviewsList({ reviews }) {
  const { translatedItems, isLoading } = useBatchTranslation(
    reviews.map((r) => ({ text: r.comment, id: r.id })),
    "review"
  );

  return (
    <div>
      {translatedItems.map((item) => (
        <div key={item.id}>
          {item.translatedText} {/* 🤖 Batch translated */}
        </div>
      ))}
    </div>
  );
}
```

## 🚀 API Endpoints

### **Single Translation**

```http
POST /api/translate
Content-Type: application/json

{
  "text": "Great service! Highly recommended.",
  "targetLanguage": "hi",
  "sourceLanguage": "en",
  "contentType": "review",
  "contentId": "review-123",
  "useCache": true
}
```

### **Batch Translation**

```http
POST /api/translate-batch
Content-Type: application/json

{
  "items": [
    {
      "text": "Excellent plumber work!",
      "targetLanguage": "hi",
      "contentType": "review",
      "contentId": "review-1"
    },
    {
      "text": "Fixed my sink perfectly.",
      "targetLanguage": "hi",
      "contentType": "review",
      "contentId": "review-2"
    }
  ]
}
```

## ⚡ Performance Benefits

### **Caching Strategy**

| Translation Type      | First Request   | Subsequent Requests | Cache Duration |
| --------------------- | --------------- | ------------------- | -------------- |
| 📄 **JSON**           | ~1ms (local)    | ~1ms (local)        | Permanent      |
| 🤖 **Azure (New)**    | ~500ms (API)    | ~5ms (database)     | 30 days        |
| 🤖 **Azure (Cached)** | ~5ms (database) | ~5ms (database)     | Auto-refresh   |

### **Smart Caching**

1. **Hash-based Lookup**: SHA256 hash of `text + source + target` for instant retrieval
2. **Content Grouping**: Reviews, jobs, bios cached separately for analytics
3. **Auto-cleanup**: Old cache entries removed after 30 days of inactivity
4. **Batch Optimization**: Multiple translations in single database transaction

## 📊 Which Pages Use What System?

### **📄 JSON Translation (Static UI)**

| **Page**                 | **Elements**                   | **Performance** |
| ------------------------ | ------------------------------ | --------------- |
| **Homepage** (`/`)       | Hero text, buttons, navigation | ⚡ Instant      |
| **About** (`/about`)     | Company info, mission, values  | ⚡ Instant      |
| **Workers** (`/workers`) | Search filters, labels, UI     | ⚡ Instant      |
| **All Pages**            | Headers, footers, form labels  | ⚡ Instant      |

### **🤖 Azure AI Translation (Dynamic Content)**

| **Content Type**     | **Examples**               | **Performance** | **Cache** |
| -------------------- | -------------------------- | --------------- | --------- |
| **Reviews**          | User testimonials, ratings | 🚀 500ms → 5ms  | ✅ Cached |
| **Job Descriptions** | Task details, requirements | 🚀 500ms → 5ms  | ✅ Cached |
| **Worker Bios**      | Professional summaries     | 🚀 500ms → 5ms  | ✅ Cached |
| **Comments**         | User discussions, feedback | 🚀 500ms → 5ms  | ✅ Cached |

## 🎮 Demo Pages

### **1. Hybrid Translation Demo**

- **URL**: `/hybrid-demo`
- **Features**: Live examples of both systems
- **Content**: Reviews, jobs, worker profiles with real-time translation

### **2. Azure Translator Playground**

- **URL**: `/translator`
- **Features**: Interactive translation interface
- **Content**: Text input, language detection, live translation

## 🛠️ Development Commands

```bash
# Database migration for caching
npx prisma migrate dev --name add-translation-cache

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev

# Test translation APIs
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","targetLanguage":"hi","useCache":true}'
```

## 🔍 Monitoring & Analytics

### **Cache Performance**

```tsx
// Get cache statistics
const stats = await translationService.getCacheStats();
console.log(stats);
// Output: { totalEntries: 1250, byContentType: {...}, byLanguagePair: {...} }
```

### **Cache Cleanup**

```tsx
// Clean old cache entries (30+ days)
const cleaned = await translationService.cleanupOldCache(30);
console.log(`Cleaned ${cleaned} old entries`);
```

## 🚨 Best Practices

### **1. Choose the Right Translation Type**

```tsx
// ✅ Good - Static UI elements
const { t } = useLanguage();
<button>{t("common.save")}</button>;

// ✅ Good - Dynamic user content
const { translatedText } = useReviewTranslation(review.text, review.id);
<p>{translatedText}</p>;

// ❌ Avoid - Using Azure for static content
const { translatedText } = useReviewTranslation("Save Button", "static-text");
```

### **2. Optimize for Performance**

```tsx
// ✅ Good - Batch multiple items
const { translatedItems } = useBatchTranslation(reviews, "review");

// ❌ Avoid - Individual API calls in loops
reviews.map((review) => useReviewTranslation(review.text, review.id));
```

### **3. Handle Loading States**

```tsx
// ✅ Good - Show loading indicators
const { translatedText, isLoading } = useReviewTranslation(text, id);
return <div>{isLoading ? <Spinner /> : <p>{translatedText}</p>}</div>;
```

## 🎯 Next Steps

1. **✅ Setup Complete** - Hybrid system is ready to use
2. **📝 Content Migration** - Update existing pages to use appropriate translation methods
3. **📊 Analytics** - Monitor cache hit rates and performance
4. **🔄 Pre-warming** - Cache common content during deployment
5. **🌐 Language Expansion** - Add more languages as needed

---

## 🏃‍♂️ Quick Start

1. **Visit Demo**: Navigate to `/hybrid-demo` to see the system in action
2. **Change Language**: Use language switcher to see real-time translations
3. **Monitor Cache**: Check console logs for cache hits/misses
4. **Test API**: Use `/translator` page for interactive testing

**🎉 Your hybrid translation system is now live and ready to scale!**
