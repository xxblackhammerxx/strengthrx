# Coding Conventions

**Analysis Date:** 2026-04-03

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `Hero.tsx`, `AnimatedSection.tsx`)
- Utilities/Hooks: camelCase (e.g., `useScrollAnimation.ts`, `utils.ts`, `auth.ts`)
- Collections: PascalCase (e.g., `Clients.ts`, `Partners.ts`, `Users.ts`)
- API routes: lowercase with dashes (e.g., `route.ts` in `/api/contact/route.ts`)
- Types/Interfaces: PascalCase for file names when exported (e.g., `portal-types.ts` contains `ClientPortalData`, `PartnerPortalData`)

**Functions:**
- Named functions use camelCase: `getAuthenticatedClient()`, `createAssessment()`, `useScrollAnimation()`
- Component functions use PascalCase: `Hero()`, `Button()`, `AnimatedSection()`
- Utility functions use camelCase: `cn()`, `getClient()`, `getTransform()`

**Variables:**
- camelCase for all variable declarations: `firstName`, `email`, `partnerId`, `elementRef`
- Private/internal variables may use leading underscore: `_ignoredVar` (per eslint config)
- Unused parameters/variables prefixed with underscore: Pattern allows `argsIgnorePattern: '^_'`

**Types:**
- Interfaces: PascalCase (e.g., `ButtonProps`, `AnimatedSectionProps`, `ClientPortalData`)
- Types: PascalCase (e.g., `AuthResult<T>`, `BusinessConfig`, `UseScrollAnimationOptions`)
- String literal types in select options: lowercase with underscores (e.g., `'not_started'`, `'in_progress'`, `'completed'`)

## Code Style

**Formatting:**
- **Tool:** Prettier v3.4.2
- **Quote Style:** Single quotes (`'`)
- **Trailing Commas:** All (including function params)
- **Print Width:** 100 characters
- **Semicolons:** Disabled (no semicolons at end of statements)

Example formatted code from `src/components/ui/Button.tsx`:
```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'destructive' | 'white'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}
```

**Linting:**
- **Tool:** ESLint 9.16.0 with flat config format
- **Base Config:** `next/core-web-vitals` and `next/typescript`
- **File:** `eslint.config.mjs`

**Key Rules:**
- `@typescript-eslint/ban-ts-comment`: warn
- `@typescript-eslint/no-empty-object-type`: warn
- `@typescript-eslint/no-explicit-any`: warn (allow `any` with warning)
- `@typescript-eslint/no-unused-vars`: warn with patterns
  - Variables starting with `_` are ignored
  - Parameters starting with `_` are ignored
  - Caught errors starting with `_` or `ignore` are ignored
- Ignores `.next/` directory

## Import Organization

**Order:**
1. External packages from `node_modules` (e.g., `import { useState } from 'react'`)
2. Next.js imports (e.g., `import { NextRequest, NextResponse } from 'next/server'`)
3. Payload/CMS imports (e.g., `import { getPayload } from 'payload'`)
4. Local path aliases (e.g., `import { cn } from '@/lib/utils'`)
5. Relative imports (e.g., `import AnimatedSection from './AnimatedSection'`)

**Path Aliases:**
- `@/*` → `./src/*` (main application code)
- `@payload-config` → `./src/payload.config.ts` (Payload CMS configuration)

Example from `src/components/ui/Button.tsx`:
```typescript
import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
```

Example from `src/app/api/contact/route.ts`:
```typescript
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
```

## Error Handling

**Patterns:**
- Try-catch blocks for async operations with explicit error logging
- Console.error() for logging errors (see `src/app/api/contact/route.ts` line 154)
- Distinguish between different error types (e.g., duplicate email validation at line 126)
- Return appropriate HTTP status codes: 400 for validation, 403 for auth failure, 500 for server errors
- Graceful degradation: catch non-critical errors and continue (e.g., referral creation failure at line 81 in signup route)

Example from `src/app/api/signup/route.ts`:
```typescript
try {
  // ... main logic
} catch (error) {
  console.error('Signup error:', error)

  // Handle duplicate email error
  if (error instanceof Error && error.message.includes('duplicate')) {
    return NextResponse.json(
      { error: 'An account with this email already exists' },
      { status: 409 },
    )
  }

  return NextResponse.json(
    { error: 'Failed to create account. Please try again.' },
    { status: 500 },
  )
}
```

## Logging

**Framework:** Console API (native)

**Patterns:**
- `console.log()` for info/debug messages
- `console.warn()` for warnings
- `console.error()` for error messages
- Log format varies by context: structured info for business logic, formatted strings for status updates

Example from `src/app/api/contact/route.ts`:
```typescript
console.log(`reCAPTCHA score: ${score}`)
console.warn(`reCAPTCHA token invalid: ${response.tokenProperties?.invalidReason}`)
console.error('reCAPTCHA assessment error:', error)
```

## Comments

**When to Comment:**
- Block comments explain high-level business logic (e.g., "Cache the client instance across requests")
- Inline comments clarify non-obvious code decisions or workarounds
- JSDoc not heavily used in this codebase; inline comments preferred

Example from `src/app/api/contact/route.ts`:
```typescript
// Cache the client instance across requests
let client: RecaptchaEnterpriseServiceClient | null = null

// Check if the token is valid
if (!response.tokenProperties?.valid) {
```

**JSDoc/TSDoc:**
- Minimal usage; focus is on readable code rather than extensive documentation
- Function parameters and return types use TypeScript syntax instead of JSDoc

## Function Design

**Size:** Functions generally 20-50 lines; some utility functions are <10 lines

**Parameters:**
- Destructured parameters for objects (e.g., `{ threshold = 0.1, delay = 0, duration = 600, direction = 'up', once = true }`)
- Default values provided in destructured params and function defaults
- Type annotations on all parameters

Example from `src/hooks/useScrollAnimation.ts`:
```typescript
export function useScrollAnimation({
  threshold = 0.1,
  delay = 0,
  duration = 600,
  direction = 'up',
  once = true,
}: UseScrollAnimationOptions = {}) {
```

**Return Values:**
- Explicit return types annotated
- Promise-based returns for async functions
- Generic types for reusable patterns (e.g., `AuthResult<T>`)

Example from `src/lib/auth.ts`:
```typescript
type AuthResult<T> = { payload: Payload; user: T }

export async function getAuthenticatedClient(): Promise<AuthResult<{
  id: number
  email: string
  firstName: string
  // ...
}> | null>
```

## Module Design

**Exports:**
- Named exports preferred: `export function`, `export interface`, `export const`
- Default exports used for React components: `export default function AnimatedSection()`
- Collections and configs use named constants: `export const Clients: CollectionConfig`

**Barrel Files:**
- Not heavily used; components imported directly
- Component directories follow this pattern: `/components/ui/`, `/components/sections/`, `/components/portal/`, `/components/header/`, `/components/footer/`

Example from `src/components/ui/Button.tsx`:
```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // ...
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // ...
)

export { Button }
```

## TypeScript Configuration

**Strict Mode:** Enabled (`"strict": true`)

**Target:** ES2022

**Module:** ESNext

**Key Compiler Options:**
- `skipLibCheck: true` - Skip type checking of declaration files
- `esModuleInterop: true` - Enable CommonJS/ES module interop
- `resolveJsonModule: true` - Allow importing JSON files
- `isolatedModules: true` - Transpile each file independently
- `allowJs: true` - Allow JavaScript files

## React/Component Patterns

**Functional Components:** All components are functional, using hooks

**Refs and Forwarding:**
- `forwardRef` used for components that need ref exposure: `Button.tsx`
- Display names set for debugging: `Button.displayName = 'Button'`

**Props:** Interface-based prop typing with spread syntax:
```typescript
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
```

**Client Components:** Marked with `'use client'` directive in browser-only code:
- `src/components/sections/AnimatedSection.tsx`
- `src/hooks/useScrollAnimation.ts`

---

*Convention analysis: 2026-04-03*
