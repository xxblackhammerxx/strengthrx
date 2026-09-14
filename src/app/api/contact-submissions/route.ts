import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { canManageContactSubmissions } from '@/lib/contact-submissions-access'

const LEADS_ALLOWED_SORTS = new Set(['createdAt', '-createdAt', 'name', '-name', 'status', '-status'])
const LEADS_ALLOWED_STATUSES = new Set(['new', 'in-progress', 'responded', 'resolved', 'archived'])

const SPAM_KEYWORDS = [
  'casino',
  'viagra',
  'cialis',
  'cryptocurrency',
  'bitcoin',
  'forex',
  'loan offer',
  'earn money fast',
  'click here',
  'free money',
  'winner',
  'congratulations you',
  'seo services',
  'buy followers',
  'cheap meds',
  'adult',
  'xxx',
]

const CAMPAIGN_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'ref',
  'topic',
  'landingPage',
  'referrer',
] as const

const CAMPAIGN_FIELD_TO_COLUMN: Record<(typeof CAMPAIGN_FIELDS)[number], string> = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_content: 'utmContent',
  utm_term: 'utmTerm',
  ref: 'campaignRef',
  topic: 'campaignTopic',
  landingPage: 'landingPage',
  referrer: 'referrer',
}

type SubmissionPayload = Record<string, unknown>

function stringValue(data: SubmissionPayload, key: string, maxLength: number): string {
  const value = data[key]
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function campaignData(data: SubmissionPayload): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of CAMPAIGN_FIELDS) {
    const value = stringValue(data, key, 200)
    if (value) out[CAMPAIGN_FIELD_TO_COLUMN[key]] = value
  }
  return out
}

function isSpam(data: { name: string; email: string; message: string; subject: string }): boolean {
  const text = [data.name, data.email, data.message, data.subject].join(' ').toLowerCase()
  if (SPAM_KEYWORDS.some((keyword) => text.includes(keyword))) return true
  if ((text.match(/https?:\/\//g) || []).length > 3) return true
  if (/(.)\1{5,}/.test(data.email)) return true
  return false
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey || secretKey === 'your_recaptcha_secret_key_here') return true

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    })
    const result = (await response.json()) as { success?: boolean; score?: number; action?: string }
    if (result.action === 'contact_form') return result.success === true && (result.score ?? 0) >= 0.5
    return result.success === true
  } catch {
    // Do not drop paid traffic because Google's verification endpoint had a transient problem.
    console.warn('[contact-submissions] reCAPTCHA verification unavailable; accepting submission.')
    return true
  }
}

export async function POST(request: NextRequest) {
  let data: SubmissionPayload
  try {
    data = (await request.json()) as SubmissionPayload
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const name = stringValue(data, 'name', 160)
  const email = stringValue(data, 'email', 200).toLowerCase()
  const phone = stringValue(data, 'phone', 40)
  const productInterest = stringValue(data, 'state', 200)
  const subject = stringValue(data, 'subject', 200) || productInterest || 'Website inquiry'
  const message = stringValue(data, 'message', 5000)

  if (stringValue(data, 'website', 200) || stringValue(data, 'honeypot', 200)) {
    return NextResponse.json(
      { success: true, message: 'Contact submission received successfully' },
      { status: 201 },
    )
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
  }

  const recaptchaToken = stringValue(data, 'recaptchaToken', 4000)
  if (recaptchaToken && !(await verifyRecaptcha(recaptchaToken))) {
    return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 })
  }

  if (isSpam({ name, email, message, subject })) {
    // Avoid telling bots what was blocked, and do not log submitted PII.
    return NextResponse.json({ success: true, message: 'Contact submission received successfully' }, { status: 201 })
  }

  try {
    const payload = await getPayload({ config })
    const contactSubmission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
        ...campaignData(data),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Contact submission received successfully',
        id: contactSubmission.id,
      },
      { status: 201 },
    )
  } catch {
    console.error('[contact-submissions] Failed to create submission.')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/contact-submissions powers the portal Leads page. It requires a
 * privileged Payload admin/staff user because submissions contain lead PII.
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!canManageContactSubmissions(user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sp = request.nextUrl.searchParams
    const page = Math.max(1, Number.parseInt(sp.get('page') ?? '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(sp.get('limit') ?? '25', 10) || 25))
    const sortRaw = sp.get('sort') ?? '-createdAt'
    const sort = LEADS_ALLOWED_SORTS.has(sortRaw) ? sortRaw : '-createdAt'

    const and: Where[] = []
    const search = sp.get('search')?.trim().slice(0, 200)
    if (search) {
      and.push({
        or: [
          { name: { like: search } },
          { email: { like: search } },
          { phone: { like: search } },
          { subject: { like: search } },
          { message: { like: search } },
        ],
      })
    }

    const from = sp.get('from')
    if (from && !Number.isNaN(Date.parse(from))) and.push({ createdAt: { greater_than_equal: from } })

    const to = sp.get('to')
    if (to && !Number.isNaN(Date.parse(to))) and.push({ createdAt: { less_than_equal: to } })

    const status = sp.get('status')
    if (status && LEADS_ALLOWED_STATUSES.has(status)) and.push({ status: { equals: status } })

    const excludeStatus = sp.get('excludeStatus')
    if (excludeStatus && LEADS_ALLOWED_STATUSES.has(excludeStatus)) {
      and.push({ or: [{ status: { not_equals: excludeStatus } }, { status: { exists: false } }] })
    }

    const result = await payload.find({
      collection: 'contact-submissions',
      where: and.length ? { and } : undefined,
      page,
      limit,
      sort,
      depth: 0,
      overrideAccess: false,
      user,
    })

    return NextResponse.json(result)
  } catch {
    console.error('[contact-submissions] Failed to list submissions.')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
