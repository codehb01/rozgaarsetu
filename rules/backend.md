---
description: Use these Rules when making any changes in the backend (api routes or server action) or any logic related to server in this nextjs project
alwaysApply: false
---

## API Route Patterns

### Core Rule for API Routes

Every API route should follow these rules:

- use zod schema for validation for the api body or query param
- use data validator from `helper/dataValidator.ts` to validate the api body or query param with proper error formatting for response.

```typescript
import { dataValidator } from "@/helper/dataValidator";
import { API_ERROR_CODES } from "@/src/constants/errorCodes/api";
import { getAgentEmails } from "@/src/lib/data/dashboard/agent-overview";
import { AgentEmailsResponse } from "@/src/types/api/dashboard/agent-overview";
import { DashboardOverviewResponse } from "@/src/types/api/dashboard/overview";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { withDashboardCache } from "@/lib/cache/dashboard";

const bodySchema = z.object({
  from: z.coerce.date().nullable(),
  to: z.coerce.date().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nameSpace: string; productId: string }> },
) {
  try {
    const { nameSpace, productId } = await params;
    const body = await request.json();
    const result = await dataValidator(body, bodySchema);
    if (!result.success) {
      return NextResponse.json<DashboardOverviewResponse>(
        {
          success: false,
          message: "Validation failed",
          code: API_ERROR_CODES.VALIDATION_ERROR,
          error: result.error,
        },
        { status: 400 },
      );
    }
    const { from, to } = result.data;
    const agentEmailsData = await withDashboardCache(
      "agent",
      nameSpace,
      productId,
      { from, to },
      async () => {
        return await getAgentEmails({ nameSpace, productId, from, to });
      },
    );

    return NextResponse.json<AgentEmailsResponse>(
      { success: true, data: agentEmailsData },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting agent emails:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
        error: { message: "Internal server error" },
      },
      { status: 500 },
    );
  }
}
```

- make sure api are always properly typed
- use proper http status code and error code in response

## Server Actions

### File Organization

```
src/actions/
├── agents.ts          # Agent-related actions
├── projects.ts        # Project-related actions
└── users.ts          # User-related actions
```

### Server Action Rules

- Always mark with `'use server'` at top of file
- Always authenticate before operations if applicable
- Use `revalidatePath()` or `revalidateTag()` after mutations
- Throw errors for client to catch, don't return error objects
- Keep actions focused - one operation per function

---

## Database Operations

### MongoDB/Mongoose Best Practices

#### Always Use Indexes

Create indexes for:

- Frequently queried fields
- Foreign key references
- Compound queries
- Sorting fields

```typescript
// In Mongoose schema
agentSchema.index({ userId: 1, status: 1 });
agentSchema.index({ "inboxes.email": 1 });
agentSchema.index({ createdAt: -1 });
```

#### Query Optimization Rules

1. **Use `.lean()`** for read-only queries (returns plain objects, 5x faster)
2. **Select only needed fields** with `.select()` or projection
3. **Limit results** with `.limit()`
4. **Use `.explain()` to analyze** slow queries in development

**Example:**

```typescript
// ❌ Slow - Returns full Mongoose documents
const agents = await Agent.find({ userId });

// ✅ Fast - Returns plain objects with only needed fields
const agents = await Agent.find({ userId })
  .select("name email status")
  .lean()
  .exec();
```

#### Batch Operations

Use bulk operations for multiple writes:

```typescript
// ❌ Slow - N database calls
for (const email of emails) {
  await Email.updateOne({ _id: email.id }, { status: "processed" });
}

// ✅ Fast - Single database call
await Email.bulkWrite(
  emails.map((email) => ({
    updateOne: {
      filter: { _id: email.id },
      update: { $set: { status: "processed" } },
    },
  })),
);
```

---

## Performance Patterns

### Concurrent Operations

When operations are independent, run them in parallel:

```typescript
// ❌ Sequential - Slow
const users = await fetchUsers();
const projects = await fetchProjects();
const stats = await calculateStats();

// ✅ Concurrent - Fast
const [users, projects, stats] = await Promise.all([
  fetchUsers(),
  fetchProjects(),
  calculateStats(),
]);
```

### Caching Strategy

#### When to Cache

- Data that rarely changes (minutes to hours)
- Expensive computations
- External API responses
- Aggregate statistics

#### When NOT to Cache

- Real-time data requirements
- User-specific sensitive data (unless user-scoped cache)
- Rapidly changing data (seconds)
- Data with strict consistency requirements

#### Cache Layers

1. **Next.js Cache** - For page/route data
2. **React Query** - For client-side caching (frontend handles this)
3. **Redis/Memory** - For computed results, rate limiting (currently using for dashboard route)
4. **CDN** - For static assets (automatic)
   `

### Pagination

Always paginate large datasets:

```typescript
// Standard pagination parameters
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "20");
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Model.find(query).skip(skip).limit(limit).lean(),
  Model.countDocuments(query),
]);

return {
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
};
```

---

## Validation Patterns

### Three-Layer Validation

Always validate at these layers:

1. **Client** - UX feedback (React Hook Form + Zod)
2. **API** - Security (Zod schemas in API routes)
3. **Database** - Data integrity (Mongoose schema)

### API Route Validation

```typescript
export async function POST(request: Request) {
  const body = await request.json();

  // Use safeParse to handle errors gracefully
  const result = CreateAgentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Use validated data
  const agent = await createAgent(result.data);
  return NextResponse.json(agent, { status: 201 });
}
```

---

## Error Handling

### Error Handling in API Routes

```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  // Log unexpected errors
  console.error("Unexpected error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Internal server error",
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      error: { message: "Internal server error" },
    },
    { status: 500 },
  );
}
```

## Authentication & Authorization

### Authentication Check Pattern

```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});
if (!session) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 },
  );
}
```

---

## Database Schema Guidelines

### Index Strategy

- Add index for every foreign key
- Index fields used in queries frequently
- Create compound indexes for common query combinations
- Monitor index usage and remove unused indexes

### Schema Design

- Use references (ObjectId) for relationships
- Embed documents only for truly contained data
- Denormalize strategically for read performance
- Keep documents under 16MB (MongoDB limit)

### Timestamps

Always include timestamps:

```typescript
{
  timestamps: true; // Adds createdAt and updatedAt
}
```

---

## Logging Best Practices

### What to Log

- All errors with context
- Authentication attempts (success and failure)
- Rate limit hits
- Database slow queries
- External API calls

### What NOT to Log

- Passwords or sensitive tokens
- Full credit card numbers
- Personal identifying information (PII)
- Raw request bodies with sensitive data

### Log Structure

```typescript
logger.error("Agent creation failed", {
  userId: session.user.id,
  operation: "createAgent",
  error: error.message,
  timestamp: new Date().toISOString(),
});
```

---

## Quick Reference Checklist

**Every API Route Must Have:**

- [ ] Authentication check if applicable
- [ ] Input validation (Zod)
- [ ] Error handling (try-catch)
- [ ] Appropriate status codes
- [ ] Rate limiting (public endpoints)

**Every Server Action Must Have:**

- [ ] `'use server'` directive
- [ ] Authentication check
- [ ] Input validation
- [ ] Revalidation after mutations
- [ ] Error throwing (not returning)

**Every Database Query Should:**

- [ ] Use appropriate indexes
- [ ] Use `.lean()` for read-only
- [ ] Select only needed fields
- [ ] Implement pagination if many results
- [ ] Handle errors gracefully

---

_Apply these rules to all backend code: API routes, server actions, and database operations._
