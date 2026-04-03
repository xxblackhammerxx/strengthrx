# Testing Patterns

**Analysis Date:** 2026-04-03

## Test Framework

**Integration Tests (Unit/API):**
- **Runner:** Vitest 3.2.3
- **Config:** `vitest.config.mts`
- **Environment:** jsdom

**E2E Tests:**
- **Framework:** Playwright 1.54.1
- **Config:** `playwright.config.ts`
- **Browser:** Chromium (Desktop Chrome)

**Supporting Libraries:**
- `@testing-library/react` 16.3.0 - React component testing utilities
- `@vitejs/plugin-react` 4.5.2 - React support for Vite/Vitest

**Run Commands:**
```bash
pnpm run test                # Run all tests (integration + e2e)
pnpm run test:int           # Run integration tests only
pnpm run test:e2e           # Run e2e tests only
pnpm run dev                # Start dev server for e2e testing
```

## Test File Organization

**Location:**
- Integration/Unit tests: `tests/int/` directory
- E2E tests: `tests/e2e/` directory

**Naming:**
- Integration tests: `*.int.spec.ts` (e.g., `api.int.spec.ts`)
- E2E tests: `*.e2e.spec.ts` (e.g., `frontend.e2e.spec.ts`)

**Vitest Configuration:**
```typescript
// vitest.config.mts
test: {
  environment: 'jsdom',
  setupFiles: ['./vitest.setup.ts'],
  include: ['tests/int/**/*.int.spec.ts'],
}
```

**Playwright Configuration:**
```typescript
// playwright.config.ts
testDir: './tests/e2e',
forbidOnly: !!process.env.CI,  // Fail on test.only in CI
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

## Test Structure

**Integration Test Suite Pattern:**
From `tests/int/api.int.spec.ts`:
```typescript
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})
```

**Patterns:**
- Test suites use `describe()` blocks
- Tests use `it()` for individual test cases
- `beforeAll()` for setup (runs once before all tests in suite)
- Async/await for handling asynchronous operations
- Explicit assertions with `expect()`

**E2E Test Suite Pattern:**
From `tests/e2e/frontend.e2e.spec.ts`:
```typescript
import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Payload Blank Template/)

    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Welcome to your new project.')
  })
})
```

**Patterns:**
- Test suites use `test.describe()`
- Tests use `test()` for individual test cases
- `test.beforeAll()` for browser/context setup
- Page object passed as fixture parameter
- Locators: `page.locator()` for element selection
- Page navigation: `await page.goto()`
- Assertions on page state: `await expect(page)...`

## Mocking

**Framework:** Vitest built-in mocking (via Vite)

**Current State:** 
- No explicit mocks currently implemented in test files
- Integration tests use real Payload instance (`await getPayload({ config: payloadConfig })`)
- E2E tests use real application running on `http://localhost:3000`

**What to Mock:**
- External API calls (Google Recaptcha, Resend email service)
- Payload CMS operations (when testing business logic in isolation)
- Network requests in component tests

**What NOT to Mock:**
- Payload core functionality in integration tests (tests should verify real payload behavior)
- Next.js routing in E2E tests (test real navigation)
- Database operations in E2E tests (test complete flow)

## Fixtures and Factories

**Test Data:**
- No centralized fixture factory currently exists
- Integration tests create instances directly via Payload API
- E2E tests use real application state

**Location:**
- Could be created at `tests/fixtures/` or `tests/factories/` if needed
- Currently tests are simple enough to not require fixtures

**Example Pattern to Follow (for future use):**
```typescript
// tests/fixtures/testData.ts
export const createTestClient = (payload: Payload) => {
  return payload.create({
    collection: 'clients',
    data: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPass123!',
      dateOfBirth: '1990-01-01',
    },
  })
}
```

## Coverage

**Requirements:** Not enforced

**Current State:**
- No coverage thresholds configured
- No coverage reporting configured

**To Enable Coverage (if needed):**
Add to `vitest.config.mts`:
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'tests/',
    ]
  }
}
```

Run coverage:
```bash
pnpm run test:int -- --coverage
```

## Test Types

**Unit/Integration Tests (Vitest):**
- **Scope:** Single function or component in isolation or with its dependencies
- **Approach:** Test Payload API operations directly
- **Example:** `api.int.spec.ts` tests payload data fetch
- **Duration:** Fast (milliseconds to seconds)
- **Database:** Uses configured Payload database (postgres in production config)

**E2E Tests (Playwright):**
- **Scope:** Complete user workflows from browser perspective
- **Approach:** Real application running, real browser automation
- **Example:** `frontend.e2e.spec.ts` tests page navigation and DOM content
- **Duration:** Slower (seconds per test)
- **Server:** Auto-started via `webServer` config (runs `pnpm dev`)

**Component Tests:**
- Not currently implemented
- Could use Vitest + `@testing-library/react` for isolated component testing
- Pattern would follow: render component → user interaction → assertion

## Common Patterns

**Async Testing:**
All test functions are async and use `await` for async operations:
```typescript
it('fetches users', async () => {
  const users = await payload.find({
    collection: 'users',
  })
  expect(users).toBeDefined()
})
```

**Error Testing:**
Currently minimal error testing. Pattern to follow:
```typescript
it('returns error for invalid input', async () => {
  try {
    await payload.find({
      collection: 'clients',
      where: {
        email: { equals: null }, // Invalid
      },
    })
    expect.fail('Should have thrown error')
  } catch (error) {
    expect(error).toBeDefined()
  }
})
```

Or with Vitest assertion:
```typescript
it('throws on invalid query', async () => {
  expect(() =>
    payload.find({ collection: 'invalid' })
  ).rejects.toThrow()
})
```

**Navigation Testing (E2E):**
```typescript
test('navigates to page', async ({ page }) => {
  await page.goto('http://localhost:3000/signup')
  await expect(page).toHaveURL(/signup/)
  
  const heading = page.locator('h1')
  await expect(heading).toContainText('Sign Up')
})
```

**API Route Testing (Integration):**
Could be added with Payload's native request testing:
```typescript
it('POST /api/contact returns success', async () => {
  // Use Payload to test API routes
  const result = await payload.request({
    path: '/api/contact',
    method: 'post',
    body: {
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message',
      recaptchaToken: 'mock-token',
    },
  })
  expect(result).toHaveProperty('success', true)
})
```

## Setup Files

**Vitest Setup:**
- **File:** `vitest.setup.ts`
- **Content:** Loads `.env` files for test environment variables

```typescript
// vitest.setup.ts
import 'dotenv/config'
```

**Environment:**
- Vitest runs in `jsdom` environment (browser-like DOM)
- Access to `window`, `document`, `fetch`, etc.
- `.env` file loaded before tests run

## CI/CD Testing

**Playwright CI Configuration:**
```typescript
// playwright.config.ts
forbidOnly: !!process.env.CI,    // Fail if test.only found
retries: process.env.CI ? 2 : 0,  // Retry failed tests 2x in CI
workers: process.env.CI ? 1 : undefined, // Serial execution in CI
reporter: 'html',                 // HTML report generation
trace: 'on-first-retry',          // Trace on failure
```

**Local Testing:**
- No retries
- Parallel test execution
- Immediate feedback

**CI Testing:**
- Automatic retries for flaky tests
- Serial execution to avoid resource conflicts
- HTML report for investigation
- Traces captured on first retry

## Test Coverage Gaps

**Areas Currently Untested:**
- Component rendering and user interactions (no component tests)
- API route validation logic (signup, login, contact endpoints)
- Error states and edge cases
- Authentication flows
- Form submission handling
- Email sending (Resend integration)
- reCAPTCHA verification

**High Priority to Test:**
1. `src/app/api/signup/route.ts` - User registration logic
2. `src/app/api/login/route.ts` - Authentication
3. `src/app/api/contact/route.ts` - Form submission and email
4. `src/lib/auth.ts` - Auth helper functions
5. React components with complex state (Hero, AnimatedSection)

---

*Testing analysis: 2026-04-03*
