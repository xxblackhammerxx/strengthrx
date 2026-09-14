import type { CollectionConfig } from 'payload'
import type { SiteSetting } from '@/payload-types'
import { canManageContactSubmissions } from '@/lib/contact-submissions-access'

type ContactEmailSettings = Pick<SiteSetting, 'contactFormRecipient' | 'fromEmail' | 'fromName'>

const htmlEscape = (value: unknown): string =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const optionalRow = (label: string, value: unknown): string => {
  const escaped = htmlEscape(value).trim()
  return escaped ? `<p><strong>${htmlEscape(label)}:</strong> ${escaped}</p>` : ''
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'status', 'createdAt'],
    group: 'Forms',
  },
  access: {
    // Contact submissions contain lead PII. Public forms write through the
    // server route using Payload's local API; direct collection read/manage
    // access is limited to privileged admin/staff users only.
    read: ({ req }) => canManageContactSubmissions(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => canManageContactSubmissions(req.user),
    delete: ({ req }) => canManageContactSubmissions(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
      maxLength: 160,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      maxLength: 40,
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject / Interest',
      maxLength: 200,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
      maxLength: 5000,
    },
    {
      type: 'collapsible',
      label: 'Lead Source',
      admin: {
        initCollapsed: true,
        description: 'Campaign and referral metadata captured at submission time.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text', label: 'utm_source', admin: { readOnly: true } },
            { name: 'utmMedium', type: 'text', label: 'utm_medium', admin: { readOnly: true } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmCampaign', type: 'text', label: 'utm_campaign', admin: { readOnly: true } },
            { name: 'utmContent', type: 'text', label: 'utm_content', admin: { readOnly: true } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'utmTerm', type: 'text', label: 'utm_term', admin: { readOnly: true } },
            { name: 'landingPage', type: 'text', label: 'Landing Page', admin: { readOnly: true } },
          ],
        },
        { name: 'campaignRef', type: 'text', label: 'Campaign Ref', admin: { readOnly: true } },
        { name: 'campaignTopic', type: 'text', label: 'Campaign Topic', admin: { readOnly: true } },
        { name: 'referrer', type: 'text', label: 'Referrer', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Responded', value: 'responded' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        try {
          const siteSettings = (await req.payload.findGlobal({
            slug: 'site-settings',
          })) as ContactEmailSettings

          const to = siteSettings.contactFormRecipient || process.env.CONTACT_EMAIL
          if (!to) {
            console.warn('[contact-submissions] No contact recipient configured; notification skipped.')
            return
          }

          const fromAddress =
            siteSettings.fromEmail ||
            process.env.RESEND_DEFAULT_FROM_ADDRESS ||
            'info@gainzmarketing.com'
          const fromName = siteSettings.fromName || process.env.RESEND_DEFAULT_FROM_NAME || 'StrengthRX'
          const subject = doc.subject ? `New Contact Form Submission: ${doc.subject}` : 'New Contact Form Submission'

          await req.payload.sendEmail({
            from: `${fromName} <${fromAddress}>`,
            to,
            replyTo: doc.email,
            subject,
            html: `
              <h2>New Contact Form Submission</h2>
              <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;">Contact Information</h3>
                ${optionalRow('Name', doc.name)}
                ${doc.email ? `<p><strong>Email:</strong> <a href="mailto:${htmlEscape(doc.email)}">${htmlEscape(doc.email)}</a></p>` : ''}
                ${doc.phone ? `<p><strong>Phone:</strong> <a href="tel:${htmlEscape(doc.phone)}">${htmlEscape(doc.phone)}</a></p>` : ''}
                ${optionalRow('Subject / Interest', doc.subject)}
              </div>
              <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;">Message</h3>
                <p style="white-space:pre-wrap;">${htmlEscape(doc.message)}</p>
              </div>
              <div style="background:#111827;color:white;padding:20px;border-radius:8px;margin:20px 0;">
                <p style="margin:0;font-size:14px;opacity:0.9;">
                  Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' })}
                </p>
              </div>
            `,
          })
        } catch {
          console.error('[contact-submissions] Notification email failed.')
          // Keep the stored lead even when notification delivery has a transient failure.
        }
      },
    ],
  },
}
