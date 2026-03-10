import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const PROJECT_ID = 'prj-gainz'
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
const RECAPTCHA_ACTION = 'CONTACT_FORM'

const resend = new Resend(process.env.RESEND_API_KEY)

// Cache the client instance across requests
let client: RecaptchaEnterpriseServiceClient | null = null

function getClient() {
  if (!client) {
    client = new RecaptchaEnterpriseServiceClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      projectId: PROJECT_ID,
    })
  }
  return client
}

async function createAssessment(token: string): Promise<{ success: boolean; score?: number }> {
  try {
    const recaptchaClient = getClient()
    const projectPath = recaptchaClient.projectPath(PROJECT_ID)

    const [response] = await recaptchaClient.createAssessment({
      assessment: {
        event: {
          token,
          siteKey: RECAPTCHA_SITE_KEY,
        },
      },
      parent: projectPath,
    })

    // Check if the token is valid
    if (!response.tokenProperties?.valid) {
      console.warn(`reCAPTCHA token invalid: ${response.tokenProperties?.invalidReason}`)
      return { success: false }
    }

    // Verify the expected action was executed
    if (response.tokenProperties.action !== RECAPTCHA_ACTION) {
      console.warn(
        `reCAPTCHA action mismatch: expected ${RECAPTCHA_ACTION}, got ${response.tokenProperties.action}`,
      )
      return { success: false }
    }

    const score = response.riskAnalysis?.score ?? 0
    console.log(`reCAPTCHA score: ${score}`)
    response.riskAnalysis?.reasons?.forEach((reason) => {
      console.log(`reCAPTCHA reason: ${reason}`)
    })

    return { success: score >= 0.5, score }
  } catch (error) {
    console.error('reCAPTCHA assessment error:', error)
    return { success: false }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, state, message, recaptchaToken } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await createAssessment(recaptchaToken)
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 403 },
      )
    }

    // Fetch email settings from Payload site-settings global
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })

    const adminEmail = siteSettings?.contactFormRecipient || 'eric@gainzmarketing.com'
    const fromAddress =
      siteSettings?.fromEmail ||
      process.env.RESEND_DEFAULT_FROM_ADDRESS ||
      'info@gainzmarketing.com'
    const fromName = siteSettings?.fromName || process.env.RESEND_DEFAULT_FROM_NAME || 'StrengthRX'

    const { error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Phone</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Product/Service</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${state || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">Message</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">reCAPTCHA Score</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${recaptchaResult.score}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${email}?subject=Re: Your inquiry to StrengthRX" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reply to ${name}</a>
        </div>
      `,
    })

    if (emailError) {
      console.error('Failed to send email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 },
    )
  }
}
