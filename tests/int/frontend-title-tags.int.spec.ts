import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

const frontendTitleTemplate = '%s | StrengthRX'
const homepageDefaultTitle = 'StrengthRX | Strong body, strong minds, destroying mediocrity'

const targetPages = [
  ['/', 'src/app/(frontend)/layout.tsx', homepageDefaultTitle, false],
  ['/get-started', 'src/app/(frontend)/get-started/page.tsx', 'Get Started', true],
  ['/contact', 'src/app/(frontend)/(marketing)/contact/page.tsx', 'Contact Us', true],
  ['/services', 'src/app/(frontend)/(marketing)/services/page.tsx', 'Wellness Services', true],
  ['/hormone-therapy', 'src/app/(frontend)/(marketing)/hormone-therapy/page.tsx', 'Hormone Therapy', true],
  ['/weight-loss', 'src/app/(frontend)/(marketing)/weight-loss/page.tsx', 'Medical Weight Loss Programs', true],
  ['/sexual-wellness', 'src/app/(frontend)/(marketing)/sexual-wellness/page.tsx', 'Sexual Wellness', true],
  ['/locations', 'src/app/(frontend)/(marketing)/locations/page.tsx', 'Licensed Service Areas', true],
  ['/peptides', 'src/app/(frontend)/(marketing)/peptides/page.tsx', 'Peptide Therapy', true],
  ['/about', 'src/app/(frontend)/(marketing)/about/page.tsx', 'About the Practice', true],
  ['/terms', 'src/app/(frontend)/(marketing)/terms/page.tsx', 'Terms of Service', true],
  ['/privacy', 'src/app/(frontend)/(marketing)/privacy/page.tsx', 'Privacy Policy', true],
] as const

function source(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8')
}

function literalMetadataTitle(path: string) {
  const match = source(path).match(/export const metadata:[\s\S]*?title:\s*['"]([^'"]+)['"]/)
  return match?.[1]
}

function renderedTitle(metadataTitle: string, usesTemplate: boolean) {
  return usesTemplate ? frontendTitleTemplate.replace('%s', metadataTitle) : metadataTitle
}

describe('frontend core pages expose unique page-specific title tags', () => {
  it.each(targetPages)('%s declares the intended metadata title', (_route, path, expected) => {
    if (path.endsWith('layout.tsx')) {
      expect(source(path)).toContain(`default: '${expected}'`)
    } else {
      expect(literalMetadataTitle(path)).toBe(expected)
    }
  })

  it('renders unique titles for the audited core page groups', () => {
    const titles = targetPages.map(([route, , metadataTitle, usesTemplate]) => ({
      route,
      title: renderedTitle(metadataTitle, usesTemplate),
    }))

    expect(new Set(titles.map((page) => page.title)).size).toBe(titles.length)
    for (const { title } of titles) {
      expect(title).not.toMatch(/StrengthRX\s*[|-]\s*StrengthRX/)
    }
  })

  it('keeps contact metadata in a server page wrapper', () => {
    expect(source('src/app/(frontend)/(marketing)/contact/page.tsx')).not.toMatch(/^'use client'/)
    expect(source('src/app/(frontend)/(marketing)/contact/ContactPageClient.tsx')).toMatch(/^'use client'/)
  })
})
