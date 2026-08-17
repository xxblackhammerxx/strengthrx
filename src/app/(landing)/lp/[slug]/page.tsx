import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { getLandingPage, LANDING_PAGES } from '@/content/landing-pages'
import { DEFAULT_PRESCRIPTION_STATES } from '@/lib/prescription-states'
import { LeadForm } from '@/components/landing/LeadForm'
import { CareTeam } from '@/components/landing/CareTeam'
import { VerticalVideo } from '@/components/landing/VerticalVideo'
import { TrackViewContent } from '@/components/analytics/TrackViewContent'

export function generateStaticParams() {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLandingPage(slug)
  if (!page) return {}

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    // Ad destinations must not compete with the service pages organically.
    robots: { index: false, follow: false },
  }
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getLandingPage(slug)
  if (!page) notFound()

  // Rendered from the static list, not the CMS — see DEFAULT_PRESCRIPTION_STATES.
  // Keeps the page fully static so it stays up (and fast) regardless of the
  // database. The API route applies the authoritative licensure gate.
  const states = DEFAULT_PRESCRIPTION_STATES

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Generic content name — never the assessment type. Pairing a treatment
          interest with a matchable identifier is health data. */}
      <TrackViewContent contentName="Landing Page" contentCategory="Acquisition" />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-400">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {page.headline}
          </h1>
          <p className="mt-4 text-base text-neutral-400 sm:text-lg">{page.subhead}</p>

          <blockquote className="mt-7 border-l-2 border-primary/60 pl-5 text-[15px] italic leading-relaxed text-neutral-300">
            {page.story}
          </blockquote>

          <ul className="mt-7 space-y-3">
            {page.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-neutral-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {page.video ? <VerticalVideo video={page.video} /> : null}

          <CareTeam />

          <p className="mt-8 text-xs text-neutral-600">
            Provider-led telehealth. A licensed provider reviews every assessment. Individual results
            vary.
          </p>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <LeadForm
            landingPage={page.slug}
            ctaLabel={page.ctaLabel}
            footnote={page.formFootnote}
            states={states}
          />
        </div>
      </div>
    </div>
  )
}
