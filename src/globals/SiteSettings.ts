import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Global site configuration managed from the admin panel.',
  },
  fields: [
    {
      name: 'contactFormRecipient',
      type: 'email',
      label: 'Contact Form Recipient Email',
      required: true,
      defaultValue: 'eric@gainzmarketing.com',
      admin: {
        description: 'The email address that receives contact form submissions from the website.',
      },
    },
    {
      name: 'fromEmail',
      type: 'email',
      label: 'From Email Address',
      defaultValue: 'info@gainzmarketing.com',
      admin: {
        description:
          'The "from" email address used when sending emails (must be a verified domain in Resend).',
      },
    },
    {
      name: 'fromName',
      type: 'text',
      label: 'From Name',
      defaultValue: 'StrengthRX',
      admin: {
        description: 'The display name shown in the "from" field of outgoing emails.',
      },
    },
    {
      name: 'newClientNotificationRecipient',
      type: 'email',
      label: 'New Client Notification Recipient',
      defaultValue: 'eric@gainzmarketing.com',
      admin: {
        description:
          'Email address that receives notifications when a new client account is created.',
      },
    },
  ],
}
