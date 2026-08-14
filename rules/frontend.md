---
description: Use this Rule when updating any frontend (client-side code) or its related.
alwaysApply: false
---

# Frontend Rules

**Scope**: Components, UI/UX, state management, and client-side interactions
**Last Updated**: November 2025

---

## Component Organization

### Directory Structure

```
components/
├── ui/              # shadcn components ONLY
├── common/          # Reusable across multiple features
└── v2/              # All new components should be stored here
    ├── common/      # Shared components across products
    ├── products/    # Product-specific components
    ├── project/     # Project-level components
    └── sidebar/     # Sidebar navigation components
```

**Important Notes:**

- All new components should go in `components/v2/`
- Use `components/common/` for legacy shared components
- Use `components/ui/` exclusively for shadcn components
- Always check existing route structure before making changes

### Component File Naming

- Use kebab-case for files: `agent-card.tsx`
- Use PascalCase for components: `AgentCard`
- One component per file
- Co-locate related files:
  ```
  components/v2/products/email-agent/
  ├── agent-card.tsx
  ├── agent-form.tsx
  ├── agent-list.tsx
  └── use-agent.ts        # Related hook (in src/hooks/)
  ```

---

## Component Architecture

### Separation of Concerns

**Always separate logic from UI:**

**❌ Bad - Mixed Logic and UI:**

```typescript
export function ProjectCard({ id }: Props) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(setProject);
  }, [id]);

  const handleDelete = async () => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return <div>{project?.name}</div>;
}
```

**✅ Good - Separated Logic and UI:**

```typescript
// src/hooks/use-project.ts or hooks/use-project.ts (Logic)
export function useProjectQuery(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProject(id)
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// components/v2/project/project-card.tsx (UI)
export function ProjectCard({ id }: Props) {
  const { data: project, isLoading } = useProjectQuery(id);
  const { mutate: deleteProject } = useDeleteProject();

  if (isLoading) return <ProjectCardSkeleton />;
  if (!project) return null;

  return (
    <Card>
      <CardHeader>{project.name}</CardHeader>
      <CardFooter>
        <Button onClick={() => deleteProject(id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
```

### Component Responsibility Rules

- Components should only handle presentation
- Custom hooks handle data fetching and state
- Utility functions handle transformations
- Keep components under 200 lines
- Split large components into smaller ones

---

## UI Component Standards

### Use shadcn Components First

Before creating custom components, check if shadcn has it:

- Buttons, inputs, forms
- Cards, dialogs, modals
- Dropdowns, selects
- Tables, tabs
- And many more

**Import from `@/components/ui/*`:**

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

**Import from `@/components/v2/*`:**

```typescript
import { ProjectCard } from '@/components/v2/project/project-card';
import { ProductDashboard } from '@/components/v2/products/email-agent/dashboard';
```

### When to Create Custom Components

- shadcn doesn't have it
- Need complex business logic
- Highly reusable pattern in your app
- Product-specific UI patterns

---

## Styling with Tailwind CSS

### Core Principles

- Use Tailwind utility classes exclusively
- No CSS modules or styled-components
- No inline styles (except dynamic values)
- Use `cn()` utility for conditional classes

### Conditional Styling

```typescript
import { cn } from '@/lib/utils';

export function Button({ variant, className }: Props) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium',
        variant === 'primary' && 'bg-blue-600 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        className  // Allow override
      )}
    >
      {children}
    </button>
  );
}
```

### Design Tokens

Use Tailwind's design system:

- Spacing: `p-4`, `m-2`, `gap-4` (increments of 4px)
- Colors: `bg-blue-600`, `text-gray-900`
- Typography: `text-lg`, `font-semibold`
- Shadows: `shadow-xs`, `shadow-md`
- Borders: `border`, `border-gray-200`, `rounded-lg`

**Never use arbitrary values unless absolutely necessary**

### Flexbox Spacing: Prefer `gap` over `space-*`

**Always use `gap` utilities with flexbox instead of `space-*` utilities:**

**❌ Bad - Using space-\* with flexbox:**

```typescript
<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**✅ Good - Using gap with flexbox:**

```typescript
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Why:**

- `gap` is more semantic and explicit for flexbox/grid layouts
- `gap` works consistently with both `flex-row` and `flex-col`
- `space-*` utilities add margins to child elements, which can cause unexpected layout issues
- `gap` is the modern CSS standard for spacing in flex and grid containers

**Rule:** When using `flex` or `grid`, always use `gap-*` instead of `space-*` utilities.

---

## Responsive Design

### Mobile-First Approach

Always design for mobile first, then scale up:

```typescript
// ✅ Good - Mobile first
<div className="
  flex flex-col           // Mobile: stack vertically
  md:flex-row            // Tablet+: horizontal layout
  gap-4                  // Spacing
  p-4 md:p-6 lg:p-8     // Responsive padding
">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>
```

### Breakpoint System

```
sm:  640px   (Mobile landscape, small tablets)
md:  768px   (Tablets)
lg:  1024px  (Desktops)
xl:  1280px  (Large desktops)
2xl: 1536px  (Extra large)
```

### Responsive Typography

```typescript
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
<p className="text-sm md:text-base lg:text-lg">
  Responsive paragraph text
</p>
```

### Responsive Spacing

```typescript
<div className="
  p-4 md:p-6 lg:p-8          // Padding
  mx-4 md:mx-6 lg:mx-auto    // Margins
  gap-4 md:gap-6             // Gap in flex/grid (preferred)
">
```

**Note:** Always use `gap-*` with flexbox/grid layouts. Avoid `space-*` utilities when using flex or grid containers.

---

## Layout Patterns

### Use Relative Units

**❌ Avoid Fixed Sizes:**

```typescript
<div className="w-20 h-20">     // Too rigid
<div className="w-96">          // Fixed width
<div className="absolute top-20 left-40">
```

**✅ Use Flexible Sizing:**

```typescript
<div className="w-full max-w-4xl">           // Responsive width
<div className="h-screen flex flex-col">     // Full height
<div className="aspect-video">               // Maintain aspect ratio
<div className="min-h-[200px]">             // Minimum height
```

### Container Pattern

```typescript
<div className="container mx-auto px-4 md:px-6 max-w-7xl">
  {/* Content automatically centered with responsive padding */}
</div>
```

### Grid Layouts

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>

// Auto-fit grid (fills available space)
<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

### Flex Layouts

```typescript
// Responsive flex direction with gap (preferred)
<div className="flex flex-col md:flex-row gap-4">
  <aside className="w-full md:w-64">Sidebar</aside>
  <main className="flex-1">Content</main>
</div>

// Space between items
<div className="flex justify-between items-center">
  <h1>Title</h1>
  <Button>Action</Button>
</div>

// Vertical spacing in flex column - use gap, not space-y
<div className="flex flex-col gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

**Important:** Always use `gap-*` with flex containers. Never use `space-*` utilities (`space-y-*`, `space-x-*`) when the parent has `flex` or `grid` classes.

---

## Animation with Framer Motion

### Import as `motion`

```typescript
import { motion, AnimatePresence } from 'motion/react';
```

### Common Animation Patterns

#### Fade In on Mount

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

#### Slide Up on Mount

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
```

#### Hover Effects

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Click me
</motion.button>
```

#### Stagger Children

```typescript
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Animation Performance

- Animate `transform` and `opacity` only (hardware accelerated)
- Avoid animating `width`, `height`, `top`, `left` (triggers layout)
- Use `layoutId` for shared element transitions
- Keep animations under 400ms for responsiveness

---

## Forms with React Hook Form + Zod

### Standard Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAgentSchema } from '@/model/maindb/agent.schema';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AgentForm() {
  const form = useForm({
    resolver: zodResolver(CreateAgentSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'active'
    }
  });

  const createMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      form.reset();
      toast.success('Agent created');
    }
  });

  function onSubmit(data: z.infer<typeof CreateAgentSchema>) {
    createMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Agent'}
        </Button>
      </form>
    </Form>
  );
}
```

### Form Best Practices

- Always use Zod for validation
- Show validation errors inline with `FormMessage`
- Disable submit button while submitting
- Reset form after successful submission
- Show loading state during submission
- Handle errors with toast notifications

---

## State Management

### React Query for Server State

Use React Query (TanStack Query) for all server data:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['agents', userId],
  queryFn: () => fetchAgents(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Mutations
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: createAgent,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['agents'] });
    toast.success('Agent created');
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Query Keys Convention

```typescript
['agents'][('agents', userId)][('agents', agentId)][('agents', agentId, 'stats')]; // List all agents // List user's agents // Single agent // Agent stats
```

### When to Invalidate Queries

- After create: Invalidate list queries
- After update: Invalidate both list and detail
- After delete: Invalidate list queries
- After bulk operations: Invalidate related queries

### React State for UI State

Use `useState` for:

- Modal open/closed state
- Form input (when not using React Hook Form)
- UI toggles (dropdown open, tab selected)
- Temporary UI state

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('overview');
```

---

## Query Parameters with nuqs

### Basic Usage

```typescript
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

export function ProjectList() {
  const [search, setSearch] = useQueryState('search', parseAsString);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [status, setStatus] = useQueryState('status', parseAsString);

  // URL automatically updates: ?search=test&page=2&status=active

  return (
    <div>
      <Input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value || null)}
      />
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

### Parsers

- `parseAsString` - String values
- `parseAsInteger` - Numbers
- `parseAsBoolean` - Booleans
- `parseAsArrayOf(parseAsString)` - Arrays
- `.withDefault(value)` - Default value

### Use Cases

- Search filters
- Pagination
- Tab selection
- Sort order
- Modal/drawer state (when shareable)

---

## Loading States

### Skeleton Loading

Use skeletons instead of spinners for better UX:

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

// Usage
export function ProjectCard({ id }: Props) {
  const { data, isLoading } = useProject(id);

  if (isLoading) return <ProjectCardSkeleton />;
  if (!data) return null;

  return <Card>...</Card>;
}
```

### Loading Pattern

```typescript
const { data, isLoading, error } = useQuery({...});

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <Content data={data} />;
```

---

## Error Handling

### Error Boundaries

Wrap sections in error boundaries:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error) => logErrorToService(error)}
>
  <Dashboard />
</ErrorBoundary>
```

### Toast Notifications

```typescript
import { toast } from 'sonner'; // or your toast library

// Success
toast.success('Agent created successfully');

// Error
toast.error('Failed to create agent');

// With action
toast.error('Failed to save', {
  action: {
    label: 'Retry',
    onClick: () => retry(),
  },
});
```

---

## Accessibility

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible

```typescript
// Good focus styles
<button className="focus:outline-hidden focus:ring-2 focus:ring-blue-500">
  Click me
</button>
```

### ARIA Labels

```typescript
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<Input aria-describedby="email-error" />
<span id="email-error" role="alert">{error}</span>
```

### Semantic HTML

```typescript
// ✅ Good
<button onClick={handleClick}>Submit</button>
<nav><a href="/dashboard">Dashboard</a></nav>

// ❌ Bad
<div onClick={handleClick}>Submit</div>
<div><span onClick={() => navigate('/dashboard')}>Dashboard</span></div>
```

### Color Contrast

- Text must have sufficient contrast (WCAG AA)
- Don't rely on color alone to convey information
- Test with tools like axe DevTools

---

## Figma Design Integration

### When Converting Figma Designs

1. **Always Add Responsiveness**
   - Figma designs are often desktop-only
   - Add mobile and tablet breakpoints
   - Convert fixed sizes to flexible layouts

2. **Convert Fixed to Relative**

   ```typescript
   // Figma: 1440px container
   // Code: max-w-7xl (1280px) with responsive padding
   <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
   ```

3. **Touch Targets**
   - Minimum 44x44px for touch on mobile
   - Add padding to small icons/buttons
   - Increase spacing between interactive elements on mobile

4. **Improve Typography Hierarchy**

   ```typescript
   // Figma: 32px heading
   // Code: Responsive heading
   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
   ```

5. **Test Thoroughly**
   - Test at 375px (mobile)
   - Test at 768px (tablet)
   - Test at 1024px+ (desktop)

---

## Component Reusability

### Make Components Composable

```typescript
// ✅ Good - Composable
<Card>
  <CardHeader>
    <CardTitle>Project Name</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// ❌ Bad - Monolithic
<ProjectCard
  title="Project Name"
  description="Description"
  content="Content"
  action={<Button>Action</Button>}
/>
```

### Prop Patterns

```typescript
// Spread native props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={cn(baseStyles, className)} {...props} />;
}
```

---

## Performance Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <Skeleton className="h-96" />
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={48}
  height={48}
  className="rounded-full"
/>
```

### Memoization

Use sparingly, only when necessary:

```typescript
import { memo, useMemo, useCallback } from 'react';

// Expensive calculation
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Prevent function recreation
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Prevent component re-render
export const MemoizedComponent = memo(Component);
```

---

## Testing Frontend Components

- use proper data-testid for each components button, link, images etc for playwrite

---

## Directory Structure Reference

### Component Locations

- **New components**: `components/v2/` (with subdirectories: `common/`, `products/`, `project/`, `sidebar/`)
- **Legacy shared components**: `components/common/`
- **shadcn components**: `components/ui/`
- **Hooks**: `src/hooks/` or `hooks/` (root level)
- **Utilities**: `src/lib/` or `lib/` (root level)
- **Types**: `src/types/` or `types/` (root level)
- **App routes**: `src/app/` (Next.js 13+ App Router)

### Import Path Aliases

All imports use `@/*` alias which maps to project root:

- `@/components/*` - All components
- `@/lib/*` - Utilities and helpers
- `@/hooks/*` - Custom React hooks
- `@/types/*` - TypeScript type definitions
- `@/src/*` - Can also use explicit src path
- `@/model/*` - Database schemas and models

---

## Quick Reference Checklist

**Every Component Should:**

- [ ] Use shadcn components when available
- [ ] Be placed in `components/v2/` (new components) or appropriate legacy directory
- [ ] Have responsive design (mobile, tablet, desktop)
- [ ] Use Tailwind CSS for all styling
- [ ] Separate logic (hooks) from UI
- [ ] Handle loading and error states
- [ ] Be keyboard accessible
- [ ] Have proper TypeScript types
- [ ] Include `data-testid` attributes for Playwright testing

**Responsive Design Must:**

- [ ] Work on 375px mobile screens
- [ ] prefer Use of relative units (not fixed w-20, h-20)
- [ ] Have mobile-first breakpoints
- [ ] Test on multiple screen sizes

**Forms Must:**

- [ ] Use React Hook Form
- [ ] Validate with Zod
- [ ] Show inline errors
- [ ] Disable submit while loading
- [ ] Handle success/error states

**Directory Rules:**

- [ ] Check existing route structure before making changes
- [ ] Use `components/v2/` for all new components
- [ ] Follow the v2 subdirectory structure (common/, products/, project/, sidebar/)
- [ ] Use import aliases (`@/*`) instead of relative paths

---

_Apply these rules to all frontend code: components, pages, and client-side interactions._