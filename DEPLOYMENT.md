# SkillCompare — Complete Deployment & Architecture Guide

## Table of Contents
1. [Package Version Matrix](#package-version-matrix)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup (Neon)](#database-setup-neon)
4. [Google OAuth Setup](#google-oauth-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Database Indexing Strategy](#database-indexing-strategy)
7. [Performance Optimizations](#performance-optimizations)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Folder Structure Reference](#folder-structure-reference)

---

## Package Version Matrix

All versions are pinned and compatibility-verified as of 2026:

| Package | Version | Compatibility Note |
|---|---|---|
| `next` | `14.2.15` | App Router — stable |
| `react` | `18.3.1` | Required for Next.js 14 |
| `react-dom` | `18.3.1` | Must match `react` |
| `typescript` | `5.4.5` | Strict mode enabled |
| `next-auth` | `5.0.0-beta.25` | Auth.js v5 for App Router |
| `@auth/prisma-adapter` | `2.7.2` | v5 adapter — NOT `@next-auth/prisma-adapter` |
| `prisma` | `5.17.0` | Latest stable |
| `@prisma/client` | `5.17.0` | Must match `prisma` |
| `tailwindcss` | `3.4.13` | v4 avoided (alpha) |
| `framer-motion` | `11.3.31` | Latest stable |
| `@tanstack/react-table` | `8.19.3` | v8 ONLY — v7 is deprecated |
| `zustand` | `4.5.5` | Latest stable |
| `zod` | `3.23.8` | Latest stable |
| `react-hook-form` | `7.52.2` | Latest stable |
| `@hookform/resolvers` | `3.9.0` | Must match RHF major version |
| `bcryptjs` | `2.4.3` | Password hashing |
| `sonner` | `1.5.0` | Toast notifications |
| `next-themes` | `0.3.0` | Dark mode |

---

## Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- pnpm, npm, or yarn
- PostgreSQL database (or Neon free tier)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/yourorg/skillcompare
cd skillcompare
npm install

# 2. Environment setup
cp .env.example .env
# Edit .env with your actual values

# 3. Database setup
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed with sample data

# 4. Start dev server
npm run dev
```

### Test Accounts (after seeding)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@skillcompare.app` | `admin123456` |
| User | `demo@skillcompare.app` | `user123456` |

---

## Database Setup (Neon)

### 1. Create Neon Project
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Choose PostgreSQL region closest to your Vercel deployment

### 2. Get Connection Strings
From your Neon dashboard → Connection Details:
- **Pooled connection** (for `DATABASE_URL`): Use the "Pooled" connection string. Add `&pgbouncer=true` to use PgBouncer pooling.
- **Direct connection** (for `DIRECT_URL`): Use the "Direct" connection string. Required for Prisma migrations.

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
```

> **Why two URLs?** Neon uses PgBouncer for connection pooling in serverless environments. Prisma migrations require a direct connection, while queries can use the pooled connection.

### 3. Run Migrations

```bash
# For development (creates migration files)
npm run db:migrate

# For production deployment (applies existing migrations)
npx prisma migrate deploy

# Quick schema push (no migration files — for prototyping)
npm run db:push
```

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Application type: "Web application"
6. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env`

---

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

Or connect via [vercel.com](https://vercel.com) dashboard → "Import Project"

### 2. Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct connection string |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-domain.vercel.app` |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### 3. Build Settings (Vercel auto-detects, but verify)

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 4. Post-deploy Database Migration

After first deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.production.local
DATABASE_URL="..." npx prisma migrate deploy

# Or add to package.json build script:
# "build": "prisma generate && prisma migrate deploy && next build"
```

### 5. Recommended Vercel Settings

- Enable **Edge Network** for global CDN
- Set **Node.js** version to `20.x`
- Enable **Analytics** for Core Web Vitals tracking

---

## Database Indexing Strategy

All indexes are defined in `prisma/schema.prisma`. Here's the rationale:

### Implemented Indexes

```
Course:
  @@index([slug])          → Lookup by URL slug (every detail page)
  @@index([status])        → Filter published/draft/archived
  @@index([level])         → Filter by difficulty level
  @@index([categoryId])    → Filter by category
  @@index([platformId])    → Filter by platform
  @@index([price])         → Sort/filter by price
  @@index([rating])        → Sort by top-rated

User:
  @@index([email])         → Login lookups

Platform/Category:
  @@index([slug])          → URL-based lookups

Review:
  @@index([courseId])      → Load reviews for a course
  @@index([userId])        → Load user's reviews

Wishlist:
  @@index([userId])        → Load user's wishlist

ComparisonHistory:
  @@index([userId])        → Load user's history
```

### Full-Text Search Strategy

For production at scale, upgrade to PostgreSQL full-text search:

```sql
-- Add to migration:
CREATE INDEX courses_fts_idx ON courses
USING GIN (to_tsvector('english', title || ' ' || description || ' ' || COALESCE(instructor, '')));

-- Query example:
WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('english', 'machine learning')
```

Currently using `ILIKE` which is sufficient for < 100K courses with the existing indexes.

---

## Performance Optimizations

### 1. Server Components by Default
All pages are React Server Components. Only interactive elements use `"use client"`:
- Navbar (theme toggle, comparison count)
- Comparison bar (Zustand state)
- Search (debounced API calls)
- Filters (URL updates)
- Course card (add to compare)
- Auth forms (form state)

### 2. Data Fetching Strategy
- **Parallel fetches**: Use `Promise.all()` for independent data (see `CoursesPage`)
- **Prisma select**: Never `findMany` without specific `select` or `include`
- **Pagination**: All list queries are paginated (PAGE_SIZE = 12 or 20)

### 3. Image Optimization
All images use Next.js `<Image>` via `next/image` with:
- `remotePatterns` configured in `next.config.ts`
- `sharp` installed for server-side optimization
- WebP/AVIF automatic format conversion

### 4. Caching Strategy
- **Static pages**: Homepage, category pages → ISR with 1hr revalidation
- **Course detail**: ISR with 30min revalidation (`export const revalidate = 1800`)
- **User data**: No caching (always fresh from DB with `no-store`)
- **Search API**: No caching (real-time)

Add to course detail page for ISR:
```typescript
export const revalidate = 1800; // 30 minutes
```

### 5. Bundle Optimization
- `bcryptjs` in `serverComponentsExternalPackages` — prevents server-side bundle issues
- Dynamic imports for heavy client components:
```typescript
const ComparisonTable = dynamic(() => import('./comparison-table'), {
  loading: () => <Skeleton />
});
```

### 6. Database Connection
The Prisma singleton pattern (`lib/prisma.ts`) prevents connection pool exhaustion during Next.js hot reloads.

---

## Error Handling Strategy

### 1. Not Found Pages
Create `app/not-found.tsx`:
```typescript
export default function NotFound() {
  return <div>Page not found</div>;
}
```

Course detail uses `notFound()` from `next/navigation` for non-existent slugs.

### 2. Error Boundaries
Create `app/error.tsx` and `app/(main)/error.tsx`:
```typescript
"use client";
export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 3. Server Action Errors
All server actions:
- Return `{ error: string }` for user-facing errors
- Throw for unexpected errors (caught by error boundaries)
- Use Zod for input validation before any DB operations

### 4. API Route Errors
All route handlers:
- Wrap in `try/catch`
- Return appropriate HTTP status codes
- Never expose stack traces in production

### 5. Auth Errors
- Middleware handles unauthorized access → redirect to `/login`
- `callbackUrl` preserves intended destination
- Auth errors surfaced via `searchParams.error` on login page

### 6. Monitoring (Production)
Add to production:
```bash
npm install @sentry/nextjs
```

Sentry provides:
- Server-side error tracking
- API route performance
- User session replays

---

## Folder Structure Reference

```
skillcompare/
├── app/
│   ├── (main)/                     # Public-facing routes
│   │   ├── layout.tsx              # Navbar + ComparisonBar
│   │   ├── page.tsx                # Homepage
│   │   ├── courses/
│   │   │   ├── page.tsx            # Course listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Course detail
│   │   └── compare/
│   │       └── page.tsx            # Comparison page
│   ├── (auth)/                     # Auth routes (no navbar)
│   │   ├── layout.tsx              # Split layout
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/                # Protected user routes
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── wishlist/page.tsx
│   ├── (admin)/                    # ADMIN ONLY routes
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       └── courses/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── courses/
│   │       ├── search/route.ts
│   │       └── by-ids/route.ts
│   ├── globals.css
│   └── layout.tsx                  # Root layout
│
├── components/
│   ├── admin/                      # Admin-specific components
│   ├── auth/                       # Login, register forms
│   ├── comparison/                 # Compare bar, table, button
│   ├── courses/                    # Course cards, grid, filters, search
│   ├── dashboard/                  # Dashboard sidebar, stats
│   ├── home/                       # Hero, categories, how-it-works
│   ├── layout/                     # Navbar, footer
│   ├── providers/                  # Theme provider
│   ├── reviews/                    # Review form and list
│   ├── seo/                        # JSON-LD structured data
│   ├── ui/                         # Shared: EmptyState, Pagination
│   └── wishlist/                   # Wishlist button and grid
│
├── lib/
│   ├── actions/                    # Server Actions
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── reviews.ts
│   │   ├── wishlist.ts
│   │   └── comparison.ts
│   ├── prisma.ts                   # Prisma singleton
│   └── utils.ts                   # cn() utility
│
├── store/
│   ├── comparison-store.ts         # Zustand: comparison state
│   └── ui-store.ts                # Zustand: UI state
│
├── types/
│   └── next-auth.d.ts             # Session type augmentation
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── auth.ts                         # Auth.js v5 config (ROOT LEVEL)
├── middleware.ts                   # Route protection
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.example
└── package.json
```

---

## Security Checklist

- ✅ Auth secret is 32+ chars random string
- ✅ Passwords hashed with bcrypt (cost factor 12)
- ✅ Role-based access enforced in middleware AND server actions
- ✅ All mutations use server actions (no client-side DB access)
- ✅ Zod validation on all user inputs
- ✅ DIRECT_URL not exposed to client
- ✅ `dangerouslySetInnerHTML` only used for sanitized JSON-LD
- ✅ Cascading deletes prevent orphaned data
- ✅ SQL injection impossible (Prisma parameterized queries)
- ✅ Google OAuth redirect URIs explicitly whitelisted
