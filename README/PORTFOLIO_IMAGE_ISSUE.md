# Portfolio Image Issue - Root Cause & Fix

## Problem
Portfolio images uploaded during onboarding are not visible on the worker profile page.

## Root Cause

### Current Flow (BROKEN):
1. **Previous Work Page** (`app/(main)/onboarding/previous-work/page.tsx`):
   - User uploads images as `File` objects
   - Images are stored in state as `File[]`
   - File objects are displayed using `URL.createObjectURL(file)` - creates temporary blob URLs like `blob:http://localhost:3000/abc123`

2. **Preview Page** (`app/(main)/onboarding/preview/page.tsx`):
   - Calls `JSON.stringify(previousWorks)` on line 265
   - **PROBLEM**: `File` objects become `{}` when stringified (File data is not serializable)
   - FormData sends stringified data to API

3. **API** (`app/api/actions/onboarding.ts`):
   - Receives malformed/empty image data
   - Stores `images: [work.imageUrl]` but `imageUrl` is `{}` or invalid

4. **Database**:
   - `images` column stores: `["{}", "{}"]` or `[""]` or malformed JSON strings

5. **Profile Page** (`app/(main)/worker/profile/page.tsx`):
   - Tries to parse and display images
   - Gets invalid data → shows placeholder icon

### Why This Happens:
```javascript
const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
console.log(JSON.stringify(file)); // Output: "{}" ❌

// Blob URLs are temporary and session-specific
const blobUrl = URL.createObjectURL(file);
console.log(blobUrl); // "blob:http://localhost:3000/abc123"
// This URL expires when page closes or refreshes ❌
```

## Solution Options

### Option 1: Upload Images to Server (RECOMMENDED)
**Pros**: Permanent storage, proper image management
**Cons**: Requires file upload implementation

#### Implementation Steps:

1. **Create Upload API** (`app/api/upload/portfolio/route.ts`):
```typescript
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to public/uploads/portfolio/
  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public/uploads/portfolio', filename);
  await writeFile(path, buffer);

  return NextResponse.json({ 
    url: `/uploads/portfolio/${filename}` 
  });
}
```

2. **Update Previous Work Page** - Upload images when added:
```typescript
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/upload/portfolio', {
    method: 'POST',
    body: formData,
  });
  
  const data = await res.json();
  return data.url; // "/uploads/portfolio/123-image.jpg"
};

const addWork = async () => {
  // Upload images first
  const uploadedUrls = await Promise.all(
    newWork.images.map(file => uploadImage(file))
  );
  
  const work = {
    id: Date.now().toString(),
    ...newWork,
    images: uploadedUrls, // Store URLs, not File objects
  };
  
  setPreviousWorks([...previousWorks, work]);
};
```

3. **Update Preview Page** - Images are already URLs:
```typescript
// No changes needed - previousWorks already contains URL strings
formData.append("previousWorks", JSON.stringify(previousWorks));
```

4. **Update API** - Handle URL arrays:
```typescript
await prisma.previousWork.createMany({
  data: previousWorks.map((work) => ({
    workerId: workerProfile.id,
    title: work.title,
    description: work.description || null,
    images: work.images, // Already an array of URL strings
    location: work.location || null,
  })),
});
```

### Option 2: Convert to Base64 (QUICK FIX)
**Pros**: No server upload needed
**Cons**: Large database size, slower performance

#### Implementation:
```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

const addWork = async () => {
  const base64Images = await Promise.all(
    newWork.images.map(file => fileToBase64(file))
  );
  
  const work = {
    ...newWork,
    images: base64Images, // data:image/jpeg;base64,/9j/4AAQ...
  };
  
  setPreviousWorks([...previousWorks, work]);
};
```

### Option 3: Cloud Storage (PRODUCTION)
Use services like:
- **AWS S3** - Industry standard
- **Cloudinary** - Image optimization built-in
- **Vercel Blob** - Easy Next.js integration
- **Supabase Storage** - Open source

## Immediate Debug Steps

1. Open browser console on profile page
2. Look for console.logs:
   ```
   Work: khvkgvvf
   Raw images array: ["{}"]  ← Problem!
   First image: "{}"
   Parsed image URL: null
   ```

3. Check database directly:
   ```sql
   SELECT id, title, images FROM "PreviousWork";
   ```

4. Expected formats:
   ```javascript
   // Good:
   images: ["/uploads/portfolio/123-image.jpg"]
   images: ["https://cdn.example.com/image.jpg"]
   images: ["data:image/jpeg;base64,/9j/4AAQ..."]
   
   // Bad (current):
   images: ["{}"]
   images: [""]
   images: ["blob:http://localhost:3000/abc123"] // Won't work after refresh
   ```

## Testing Checklist

After implementing fix:
- [ ] Upload portfolio image during onboarding
- [ ] Complete onboarding flow
- [ ] Navigate to worker profile page
- [ ] Verify image displays correctly
- [ ] Refresh page - image should still show
- [ ] Check browser console - no errors
- [ ] Inspect database - proper URL strings stored

## Migration Plan (If Needed)

If users already completed onboarding with broken images:

```typescript
// Migration script to clean up invalid image data
await prisma.previousWork.updateMany({
  where: {
    OR: [
      { images: { has: "{}" } },
      { images: { has: "" } },
    ],
  },
  data: {
    images: [], // Clear invalid images
  },
});
```

Users will need to re-upload portfolio images through profile edit feature.

## Recommended Approach

**For MVP**: Use **Option 1** (server upload to `public/uploads/`)
**For Production**: Use **Option 3** (cloud storage like Cloudinary)

This ensures:
✅ Images persist across sessions
✅ Images accessible via stable URLs
✅ Better performance
✅ Scalable architecture
