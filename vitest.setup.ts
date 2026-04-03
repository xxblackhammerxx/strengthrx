// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Extend vitest matchers with jest-dom
import '@testing-library/jest-dom/vitest'

// Auto-cleanup after each test (required when globals: true is not set)
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
afterEach(cleanup)
