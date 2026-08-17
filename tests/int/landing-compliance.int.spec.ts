import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'
import { LANDING_PAGES } from '@/content/landing-pages'
import { findComplianceViolations, BANNED_TERMS } from '@/lib/compliance'

/**
 * Guards the ad path against the vocabulary that gets a Meta ad account
 * flagged and a 10DLC campaign rejected.
 *
 * This is a test rather than a document because the failure mode is silent:
 * someone adds a persuasive line six months from now, nothing breaks locally,
 * and the ad account is restricted a week later.
 */

const LANDING_DIR = join(process.cwd(), 'src/app/(landing)')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

/** Strips comments — they name the banned terms deliberately, to explain them. */
const stripComments = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')

/**
 * Extracts what a visitor or crawler would actually read: JSX text nodes and
 * quoted copy. Import paths and code identifiers are excluded — the module
 * `@/lib/prescription-states` is not something anyone sees on the page.
 */
function extractVisibleCopy(source: string): string {
  const body = stripComments(source).replace(/^\s*import\s[\s\S]*?from\s+['"].*?['"]\s*$/gm, ' ')

  const jsxText = [...body.matchAll(/>([^<>{}]+)</g)].map((m) => m[1])
  const literals = [...body.matchAll(/'([^'\\]{4,})'|"([^"\\]{4,})"/g)]
    .map((m) => m[1] ?? m[2])
    // Drop module paths and URLs — not visible copy.
    .filter((value) => !/^[@./]|^https?:/.test(value))

  return [...jsxText, ...literals].join('\n')
}

describe('landing page copy compliance', () => {
  for (const page of LANDING_PAGES) {
    it(`"${page.slug}" contains no banned vocabulary`, () => {
      const copy = [
        page.metaTitle,
        page.metaDescription,
        page.eyebrow,
        page.headline,
        page.subhead,
        page.story,
        ...page.bullets,
        page.ctaLabel,
        page.formFootnote,
      ].join('\n')

      const violations = findComplianceViolations(copy)
      expect(
        violations,
        violations.map((v) => `"${v.match}" (${v.term}) in: ...${v.context}...`).join('\n'),
      ).toEqual([])
    })
  }

  it('every landing page declares an assessment type used by GHL', () => {
    for (const page of LANDING_PAGES) {
      expect(page.assessmentType).toBeTruthy()
    }
    // Slugs are the value of the `landing_page` custom field — must be unique.
    const slugs = LANDING_PAGES.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('ad path contains no route to banned-term pages', () => {
  const files = walk(LANDING_DIR).filter((f) => f.endsWith('.tsx'))

  it('finds the landing route group', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it('never renders MainNav or SiteFooter', () => {
    for (const file of files) {
      // MainNav links to /peptides, /hormone-therapy and /sexual-wellness.
      const source = stripComments(readFileSync(file, 'utf8'))
      expect(source, `${file} imports site navigation into the ad path`).not.toMatch(
        /MainNav|SiteFooter/,
      )
    }
  })

  it('links to no page whose vocabulary would flag the ad account', () => {
    const forbiddenHrefs = ['/peptides', '/hormone-therapy', '/sexual-wellness', '/services']

    for (const file of files) {
      const source = readFileSync(file, 'utf8')
      for (const href of forbiddenHrefs) {
        expect(source, `${file} links to ${href} from the ad path`).not.toContain(`"${href}"`)
      }
    }
  })

  it('renders no banned vocabulary in ad-path visible copy', () => {
    for (const file of files) {
      const copy = extractVisibleCopy(readFileSync(file, 'utf8'))
      const violations = findComplianceViolations(copy, { includeCallouts: false })
      expect(
        violations,
        `${file}: ${violations.map((v) => `"${v.match}" (${v.term}) in "${v.context}"`).join(', ')}`,
      ).toEqual([])
    }
  })
})

describe('compliance matcher', () => {
  it('does not flag the brand name as the banned term "Rx"', () => {
    expect(findComplianceViolations('StrengthRX is provider-led')).toEqual([])
  })

  it('catches a physician claim, because the provider is a nurse practitioner', () => {
    // Bobby Wolfe is an FNP. Claiming physician supervision misrepresents
    // scope of practice to a licensing board and is a misleading health claim
    // to Meta. The ads review sheet is explicit: never "physician".
    const found = findComplianceViolations('Physician-supervised telehealth')
    expect(found.map((v) => v.match.toLowerCase())).toContain('physician')
  })

  it('catches the terms it is supposed to catch', () => {
    for (const sample of [
      'Our TRT program',
      'optimize your testosterone',
      'peptide therapy available',
      'hormone replacement made simple',
      'guaranteed results in 30 days',
      'we treat low energy',
      'do you suffer from fatigue',
      'ask about semaglutide',
    ]) {
      expect(findComplianceViolations(sample).length, sample).toBeGreaterThan(0)
    }
  })

  it('permits the approved framing', () => {
    const approved =
      'Provider-led telehealth access with lab-based care. Clinician-led and evidence-backed. Labs decide, not opinions.'
    expect(findComplianceViolations(approved)).toEqual([])
  })

  it('flags viewer-attribute callouts from the real ad slate', () => {
    // These three shipped in the 2026-07-10 Meta slate and read clean under
    // the original patterns, which only caught the interrogative
    // "Are you feeling...?" form. Meta's rule is about implying knowledge of
    // the viewer, which a second-person statement does just as directly.
    const callouts = [
      "You're not supposed to feel this tired.",
      "Tired since 2018? It doesn't have to be that way.",
      "Asleep on the couch by 8pm? That's your sign.",
    ]
    for (const copy of callouts) {
      expect(findComplianceViolations(copy), copy).not.toEqual([])
    }
  })

  it('does not flag first-person narration that names the same feeling', () => {
    // The compliant alternative must survive the broader patterns, or the
    // approved framing becomes unusable and everyone routes around the check.
    const stories = [
      'For two years I assumed the afternoon crash was just what my forties were supposed to feel like.',
      'I put it off for most of a year because I assumed the first step would be complicated.',
    ]
    for (const copy of stories) {
      expect(findComplianceViolations(copy), copy).toEqual([])
    }
  })

  it('keeps the male-audience creative off the women\u2019s page', () => {
    // MOF3 closes with "feel like the man you need to become". Shipping it on
    // the metabolic reset page is not a policy violation, it is just wrong for
    // the audience — and wrong in a way nobody notices until the page
    // underperforms for a reason no dashboard shows.
    const womens = LANDING_PAGES.find((page) => page.slug === 'womens-metabolic-reset')
    expect(womens).toBeDefined()
    expect(womens!.video).toBeUndefined()
  })

  it('points every configured video at assets that exist', () => {
    for (const page of LANDING_PAGES) {
      if (!page.video) continue
      for (const asset of [page.video.src, page.video.poster]) {
        expect(
          existsSync(join(__dirname, '../../public', asset)),
          `${page.slug}: missing ${asset}`,
        ).toBe(true)
      }
    }
  })

  it('exposes a non-empty banned list', () => {
    expect(BANNED_TERMS.length).toBeGreaterThan(10)
  })
})
