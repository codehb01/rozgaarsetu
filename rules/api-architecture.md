---
description: Use this guide when implementing ANY new API route or modifying existing ones or mentioned by the user
alwaysApply: false
---

## When to Use This Guide

**Use this guide when:**

- Creating a new API endpoint (GET, POST, PUT, PATCH, DELETE)
- Modifying existing API routes
- Implementing server-side API functions
- Creating React Query hooks for API calls
- Setting up access control logic for resources
- Defining API request/response types

**This guide provides:**

- Layered architecture pattern (Access Logic → API Functions → Routes → Hooks)
- Type-safe API implementation with shared types
- Consistent error handling across all APIs
- Reusable patterns for common operations (CRUD)
- Best practices for separation of concerns
- Current repo-specific API auth/authz remediation rules

**Key Pattern**: This project uses a 6-layer architecture where access logic is separated from business logic, API functions are reusable server-side functions, routes are thin HTTP wrappers, and hooks handle client-side data fetching.

## Repo-Specific API Auth / Authz Rules

Before modifying `src/app/api/**`, check:

- `artifacts/api-auth-authz-remediation.md`

For protected project/product routes, use this remediation pattern:

1. get session with `auth.api.getSession(...)`
2. resolve the real project / product / target record from trusted data
3. run `requirePermission(session, 'project', 'view' | 'update' | 'delete', projectId)`
4. only then run business logic

Rules for this remediation pass:

- prefer fixing existing `route.ts` files directly
- do not create extra helper files unless explicitly requested
- keep response shapes stable where possible

Do not blindly protect these families with normal project session-auth:

- `/api/auth/*`
- `/api/oauth/*`
- webhook / callback routes
- `/api/wordpress/*`

If a route is public, classify it first as:

- okay to stay public
- needs alternate validation
- must be protected

Use the current classification from the remediation doc before changing public APIs.

---

## Overview

This project uses a **layered architecture** for API implementation that ensures:

- **Type Safety**: Shared types between server and client
- **Separation of Concerns**: Access logic, business logic, and routing are separated
- **Reusability**: API functions can be used in server actions, API routes, and other server contexts
- **Error Handling**: Consistent error handling across all APIs
- **Testability**: Pure functions for access logic make testing easier

---

## Architecture Layers

```
Layer 3: Access Logic (lib/access/*)
    ↓
Layer 4: API Functions (lib/api/*)
    ↓
Layer 5: API Routes (app/api/*)
    ↓
Layer 6: React Query Hooks (hooks/*)
```

---

## Directory Structure

```
src/
├── lib/
│   ├── access/              # Layer 3: Pure access control functions
│   │   └── [entity]_access.ts
│   └── api/                 # Layer 4: Server-side API functions
│       └── [entity]/
│           └── [action].api.ts
├── types/
│   └── api/                 # Shared API types
│       ├── common/           # Common types and utilities
│       └── [entity]/        # Entity-specific types
│           └── [action].ts
├── app/
│   └── api/                 # Layer 5: Next.js API routes
│       └── v1/
│           └── [entity]/
│               └── route.ts
└── hooks/                    # Layer 6: React Query hooks
    └── [entity]/
        ├── [entity]-query.tsx
        └── keys.ts
```

---

## Implementation Steps

### Step 1: Define API Types (`src/types/api/[entity]/[action].ts`)

**Purpose**: Define request parameters and response types that will be shared between server and client.

**Rules**:

- Create types for both request parameters and response
- Use descriptive names: `[Action]Params` and `[Action]Response`
- Export types that can be imported on both server and client
- Reference schema types from `@/model/maindb/*.schema`

**Example**:

```typescript
import { ProjectRole } from "@/model/maindb/project_members.schema";

export type ListProjectParams = {
  organizationId: string;
};

export type ListProjectResponse = {
  project: {
    id: string;
    projectName: string;
    nameSpace: string;
    multiProductInstanceMigrationStatus: "pending" | "migrated" | "ongoing";
    organizationId: string;
  };
  access: {
    role: ProjectRole;
    isDeveloper: boolean;
    isOrgAdmin: boolean;
  };
};
```

**File Location**: `src/types/api/[entity]/[action].ts`

---

### Step 2: Create Access Logic (`src/lib/access/[entity]_access.ts`)

## this step is optional and can be skipped in case implementation api doesn't require separate access level. (all project access will work for the 90% cases)

**Purpose**: Pure functions that determine user access levels. These functions are:

- **Pure**: No database calls, no session checks
- **Reusable**: Can be used in multiple contexts
- **Testable**: Easy to unit test

**Rules**:

- Functions should accept all necessary parameters (userId, roles, etc.)
- Return structured access information
- Never make database queries or API calls
- Use descriptive function names: `determine[Entity]Access`, `can[Action][Entity]`

**Example**:

```typescript
// lib/access/project_access.ts

import { OrganizationMemberRole } from "@/model/maindb/organization_member.schema";
import { ProjectRole } from "@/model/maindb/project_members.schema";
import { UserRole } from "@/model/maindb/user.schema";

export interface ProjectAccessInfo {
  hasAccess: boolean;
  role: ProjectRole | null;
  isDeveloper: boolean;
  isOrgAdmin: boolean;
}

/**
 * Determine user's access level to a project
 * PURE FUNCTION - no DB calls, no session checks
 */
export function determineProjectAccess(
  userId: string,
  userAccountRole: UserRole | null,
  orgRole: OrganizationMemberRole | null,
  projectMemberRole: ProjectRole | null,
): ProjectAccessInfo {
  // 1. Developer role - full access
  if (userAccountRole === "developer") {
    return {
      hasAccess: true,
      role: "admin",
      isDeveloper: true,
      isOrgAdmin: false,
    };
  }

  // 2. Not in org - no access
  if (!orgRole) {
    return {
      hasAccess: false,
      role: null,
      isDeveloper: false,
      isOrgAdmin: false,
    };
  }

  // 3. Org owner/admin - full access
  if (orgRole === "owner" || orgRole === "admin") {
    return {
      hasAccess: true,
      role: "admin",
      isDeveloper: false,
      isOrgAdmin: true,
    };
  }

  // 4. Project member - use their project role
  if (projectMemberRole) {
    return {
      hasAccess: true,
      role: projectMemberRole,
      isDeveloper: false,
      isOrgAdmin: false,
    };
  }

  // 5. Org member but not project member - no access
  return {
    hasAccess: false,
    role: null,
    isDeveloper: false,
    isOrgAdmin: false,
  };
}
```

**File Location**: `src/lib/access/[entity]_access.ts`

**Key Points**:

- ✅ Pure functions only
- ✅ Accept all needed parameters
- ✅ Return structured access info
- ❌ No database queries
- ❌ No session/auth checks
- ❌ No side effects

---

### Step 3: Create API Function (`src/lib/api/[entity]/[action].api.ts`)

**Purpose**: Server-side functions that contain business logic, database queries, and use access logic.

**Rules**:

- Must start with `'server-only'` import to prevent client-side usage
- Handle authentication and session checks
- Perform database queries
- Use access logic functions from `lib/access`
- Throw errors using `ApiErrors` from `@/src/types/api/common`
- Return typed responses matching `[Action]Response` type
- Use explicit return types

**Example**:

```typescript
import "server-only";
import { Project } from "@/model/maindb/project";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { UserRole } from "@/model/maindb/user.schema";
import { ProjectRole } from "@/model/maindb/project_members.schema";
import { ProjectMembers } from "@/model/maindb/project_members";
import { determineProjectAccess } from "@/src/lib/access/project_access";
import {
  ListProjectParams,
  ListProjectResponse,
} from "@/src/types/api/project/list_project";
import { ApiErrors } from "@/src/types/api/common";

export const listProject = async ({
  organizationId,
}: ListProjectParams): Promise<ListProjectResponse[]> => {
  // 1. Authentication check
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  if (!session) {
    throw ApiErrors.unauthorized("No session found");
  }

  const userId = session.user.id;
  const userAccountRole =
    (session.user.role as UserRole | null | undefined) ?? null;

  // 2. Check org membership
  const orgMembership = await auth.api.getActiveMemberRole({
    query: { organizationId },
    headers: await headers(),
  });

  if (!orgMembership) {
    throw ApiErrors.forbidden("Not a member of this organization");
  }

  const orgRole = orgMembership.role;

  // 3. Database queries
  const allProjects = await Project.find({ organizationId })
    .select({
      _id: 1,
      projectName: 1,
      nameSpace: 1,
      multiProductInstanceMigrationStatus: 1,
      organizationId: 1,
    })
    .lean();

  // 4. Access logic and filtering
  if (
    userAccountRole === "developer" ||
    userAccountRole === "superAdmin" ||
    orgRole === "owner" ||
    orgRole === "admin"
  ) {
    return allProjects.map((project) => {
      const accessInfo = determineProjectAccess(
        userId,
        userAccountRole,
        orgRole,
        null, // No project membership for admins
      );
      return {
        project: {
          id: project._id.toString(),
          projectName: project.projectName,
          nameSpace: project.nameSpace,
          multiProductInstanceMigrationStatus:
            project.multiProductInstanceMigrationStatus,
          organizationId: project.organizationId?.toString() ?? "",
        },
        access: {
          role: accessInfo.role ?? "admin",
          isDeveloper: accessInfo.isDeveloper,
          isOrgAdmin: accessInfo.isOrgAdmin,
        },
      };
    });
  }

  // 5. Filter projects based on membership
  const projectMembers = await ProjectMembers.find({
    organizationId,
    userId,
  }).lean();
  const membershipMap = new Map(
    projectMembers.map((m) => [m.projectId, m.role]),
  );
  const projects = allProjects.filter((project) =>
    membershipMap.has(project._id.toString()),
  );

  return projects.map((project) => {
    const accessInfo = determineProjectAccess(
      userId,
      userAccountRole,
      orgRole,
      membershipMap.get(project._id.toString()) as ProjectRole,
    );
    return {
      project: {
        id: project._id.toString(),
        projectName: project.projectName,
        nameSpace: project.nameSpace,
        multiProductInstanceMigrationStatus:
          project.multiProductInstanceMigrationStatus,
        organizationId: project.organizationId?.toString() ?? "",
      },
      access: {
        role: accessInfo.role ?? "member",
        isDeveloper: accessInfo.isDeveloper,
        isOrgAdmin: accessInfo.isOrgAdmin,
      },
    };
  });
};
```

**File Location**: `src/lib/api/[entity]/[action].api.ts`

**Key Points**:

- ✅ Always start with `'server-only'`
- ✅ Handle authentication
- ✅ Use access logic functions
- ✅ Throw errors using `ApiErrors`
- ✅ Explicit return types
- ✅ Use `.lean()` for Mongoose queries when possible
- ❌ Don't handle HTTP responses (that's the route's job)
- ❌ Don't use `NextResponse` here

---

### Step 4: Create API Route (`src/app/api/v1/[entity]/route.ts`)

**Purpose**: Thin wrapper that connects HTTP requests to API functions.

**Rules**:

- Use `withErrorHandling` wrapper for automatic error handling
- Extract parameters from request (query params, route params, body)
- Call the API function from `lib/api`
- Return responses using `sendSuccess` or `sendError`
- Keep route handlers minimal - business logic should be in API functions

**Example**:

```typescript
import { listProject } from "@/src/lib/api/project/list_project.api";
import { sendSuccess, withErrorHandling } from "@/src/types/api/common";
import { NextRequest } from "next/server";

export const GET = withErrorHandling(
  async (
    _request: NextRequest,
    ctx: RouteContext<"/api/v1/org/[orgId]/projects">,
  ) => {
    const { orgId } = await ctx.params;

    const projects = await listProject({ organizationId: orgId });
    return sendSuccess(projects);
  },
);
```

**For POST/PUT/PATCH with body**:

```typescript
export const POST = withErrorHandling(
  async (
    request: NextRequest,
    ctx: RouteContext<"/api/v1/org/[orgId]/projects">,
  ) => {
    const { orgId } = await ctx.params;
    const body = await request.json();

    // Validate body if needed (use Zod schemas)
    const result = await createProject({ organizationId: orgId, ...body });
    return sendSuccess(result, 201); // 201 for created
  },
);
```

**File Location**: `src/app/api/v1/[entity]/route.ts` or `src/app/api/v1/[entity]/[id]/route.ts`

**Key Points**:

- ✅ Always use `withErrorHandling`
- ✅ Extract params from request
- ✅ Call API function from `lib/api`
- ✅ Use `sendSuccess` or `sendError`
- ✅ Keep handlers thin
- ❌ Don't put business logic here
- ❌ Don't make direct database queries

---

### Step 5: Create React Query Hook (`src/hooks/[entity]/[entity]-query.tsx`)

**Purpose**: Client-side hooks for fetching and mutating data.

**Rules**:

- Create query key factory in `keys.ts`
- Use `apiFetch` from `@/src/types/api/common`
- Handle errors appropriately in retry logic
- Export types for the hook data
- Use proper staleTime and cacheTime settings

**Example**:

```typescript
// hooks/project/keys.ts
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: string) => [...projectKeys.lists(), filters] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
};

// hooks/project/project-query.tsx
import { useQuery } from "@tanstack/react-query";
import { projectKeys } from "./keys";
import { apiFetch, isApiError } from "@/src/types/api/common";
import { API_ERROR_CODES } from "@/src/constants/errorCodes/api";
import { ListProjectResponse } from "@/src/types/api/project/list_project";

export async function getProjectListForOrganization(orgId: string) {
  return apiFetch<ListProjectResponse[]>(`/api/v1/org/${orgId}/projects`);
}

export type ProjectListForOrganizationData = Awaited<
  ReturnType<typeof getProjectListForOrganization>
>;

export const useProjectListForOrganizationQuery = (
  orgId: string | undefined,
) => {
  return useQuery({
    queryKey: projectKeys.list(orgId ?? "unknown"),
    queryFn: () => {
      if (!orgId) throw new Error("Organization ID is required");
      return getProjectListForOrganization(orgId);
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5, // 5 minutes

    retry: (failureCount, error) => {
      if (isApiError(error)) {
        if (
          error.code === API_ERROR_CODES.UNAUTHORIZED ||
          error.code === API_ERROR_CODES.NOT_FOUND ||
          error.code === API_ERROR_CODES.FORBIDDEN
        ) {
          return false; // Don't retry auth errors
        }
      }
      return failureCount < 3;
    },
  });
};
```

**File Location**: `src/hooks/[entity]/[entity]-query.tsx` and `src/hooks/[entity]/keys.ts`

**Key Points**:

- ✅ Use `apiFetch` for all API calls
- ✅ Create query key factories
- ✅ Handle errors in retry logic
- ✅ Export types for hook data
- ✅ Use proper cache settings
- ❌ Don't use `fetch` directly
- ❌ Don't handle errors manually (let `apiFetch` handle it)

---

## Error Handling

### Using ApiErrors

Always use `ApiErrors` from `@/src/types/api/common` in API functions:

```typescript
import { ApiErrors } from "@/src/types/api/common";

// Validation error
throw ApiErrors.validation("Invalid input", [
  "field1: required",
  "field2: must be string",
]);

// Not found
throw ApiErrors.notFound("Project");

// Unauthorized
throw ApiErrors.unauthorized("No session found");

// Forbidden
throw ApiErrors.forbidden("Access denied");

// Bad request
throw ApiErrors.badRequest("Invalid organization ID");

// Conflict
throw ApiErrors.conflict("Project already exists");

// Internal server error
throw ApiErrors.internal("Database connection failed");

// Rate limit
throw ApiErrors.rateLimit("Too many requests");
```

### Error Codes

All error codes are defined in `src/constants/errorCodes/api.ts`. If you need a new error code:

1. Add it to `API_ERROR_CODES` constant
2. Add mapping in `ERROR_CODE_TO_STATUS` in `src/types/api/common/index.ts`
3. Add a helper in `ApiErrors` object if it's commonly used

---

## Type Safety Checklist

When implementing a new API, ensure:

- [ ] Types are defined in `src/types/api/[entity]/[action].ts`
- [ ] API function has explicit return type: `Promise<[Action]Response>`
- [ ] API function parameters match `[Action]Params` type
- [ ] Route handler uses typed API function
- [ ] Hook uses typed `apiFetch` call
- [ ] Hook exports type for the data: `type [Action]Data = Awaited<ReturnType<typeof [action]>>`

---

## Common Patterns

### Pattern 1: List/Index Endpoint

```typescript
// types/api/project/list_project.ts
export type ListProjectParams = { organizationId: string };
export type ListProjectResponse = {
  /* ... */
}[];

// lib/api/project/list_project.api.ts
export const listProject = async ({
  organizationId,
}: ListProjectParams): Promise<ListProjectResponse[]> => {
  // ... implementation
};

// app/api/v1/org/[orgId]/projects/route.ts
export const GET = withErrorHandling(async (request, ctx) => {
  const { orgId } = await ctx.params;
  const projects = await listProject({ organizationId: orgId });
  return sendSuccess(projects);
});

// hooks/project/project-query.tsx
export async function getProjectListForOrganization(orgId: string) {
  return apiFetch<ListProjectResponse[]>(`/api/v1/org/${orgId}/projects`);
}
```

### Pattern 2: Create Endpoint

```typescript
// types/api/project/create_project.ts
export type CreateProjectParams = {
  organizationId: string;
  projectName: string;
};
export type CreateProjectResponse = { id: string; projectName: string };

// lib/api/project/create_project.api.ts
export const createProject = async (
  params: CreateProjectParams,
): Promise<CreateProjectResponse> => {
  // ... implementation
  return { id: project._id.toString(), projectName: project.projectName };
};

// app/api/v1/org/[orgId]/projects/route.ts
export const POST = withErrorHandling(async (request, ctx) => {
  const { orgId } = await ctx.params;
  const body = await request.json();
  const project = await createProject({ organizationId: orgId, ...body });
  return sendSuccess(project, 201);
});
```

### Pattern 3: Update Endpoint

```typescript
// types/api/project/update_project.ts
export type UpdateProjectParams = { projectId: string; projectName?: string };
export type UpdateProjectResponse = { id: string; projectName: string };

// lib/api/project/update_project.api.ts
export const updateProject = async ({
  projectId,
  ...updates
}: UpdateProjectParams): Promise<UpdateProjectResponse> => {
  // ... implementation
};

// app/api/v1/projects/[projectId]/route.ts
export const PATCH = withErrorHandling(async (request, ctx) => {
  const { projectId } = await ctx.params;
  const body = await request.json();
  const project = await updateProject({ projectId, ...body });
  return sendSuccess(project);
});
```

### Pattern 4: Delete Endpoint

```typescript
// types/api/project/delete_project.ts
export type DeleteProjectParams = { projectId: string };
export type DeleteProjectResponse = { success: boolean };

// lib/api/project/delete_project.api.ts
export const deleteProject = async ({
  projectId,
}: DeleteProjectParams): Promise<DeleteProjectResponse> => {
  // ... implementation
  return { success: true };
};

// app/api/v1/projects/[projectId]/route.ts
export const DELETE = withErrorHandling(async (request, ctx) => {
  const { projectId } = await ctx.params;
  await deleteProject({ projectId });
  return sendSuccess({ success: true });
});
```

---

## Validation

### Server-Side Validation

Use Zod schemas for validation in API functions:

```typescript
import { z } from "zod";
import { ApiErrors } from "@/src/types/api/common";

const createProjectSchema = z.object({
  projectName: z.string().min(1).max(100),
  organizationId: z.string(),
});

export const createProject = async (
  params: CreateProjectParams,
): Promise<CreateProjectResponse> => {
  const validation = createProjectSchema.safeParse(params);
  if (!validation.success) {
    throw ApiErrors.validation(
      "Invalid project data",
      validation.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      ),
    );
  }

  const { projectName, organizationId } = validation.data;
  // ... rest of implementation
};
```

---

## Testing Considerations

### Access Logic (Layer 3)

- Easy to test - pure functions
- Test with different role combinations
- No mocks needed for database

### API Functions (Layer 4)

- Mock database queries
- Mock authentication
- Test error cases
- Test access control

### API Routes (Layer 5)

- Test HTTP layer
- Test error handling
- Test status codes

### Hooks (Layer 6)

- Test React Query behavior
- Test error handling
- Test retry logic

---

## Migration Guide

When migrating existing API routes to this pattern:

1. **Extract types** → Move to `src/types/api/[entity]/[action].ts`
2. **Extract access logic** → Move to `src/lib/access/[entity]_access.ts`
3. **Extract business logic** → Move to `src/lib/api/[entity]/[action].api.ts`
4. **Simplify route** → Keep only HTTP handling in `app/api/.../route.ts`
5. **Create hook** → Add React Query hook in `hooks/[entity]/[entity]-query.tsx`

---

## Non-Negotiables

1. **Always use `'server-only'`** in API functions (`lib/api/*`)
2. **Always use `withErrorHandling`** in route handlers
3. **Always use `apiFetch`** in hooks (never raw `fetch`)
4. **Always define types** in `src/types/api` before implementation
5. **Always use `ApiErrors`** for throwing errors (never `throw new Error()`)
6. **Always use explicit return types** on API functions
7. **Access logic must be pure** - no DB calls, no side effects
8. **Route handlers must be thin** - delegate to API functions

---

## Quick Reference

| Layer         | Location       | Purpose                   | Can Use                         |
| ------------- | -------------- | ------------------------- | ------------------------------- |
| Access Logic  | `lib/access/*` | Pure access control       | Types only                      |
| API Functions | `lib/api/*`    | Business logic + DB       | Access logic, Types, Models     |
| API Routes    | `app/api/*`    | HTTP handling             | API functions, Common utilities |
| Hooks         | `hooks/*`      | Client-side data fetching | Types, `apiFetch`               |

---

_Always follow this pattern when implementing new APIs or modifying existing ones._
