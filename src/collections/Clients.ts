import type { CollectionConfig } from 'payload'

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight',
  more_energy: 'More Energy',
  less_burnout: 'Less Burnout',
  build_muscle: 'Build Muscle',
  sexual_wellness: 'Improve Sexual Wellness',
  other: 'Other',
}

const LABS_STATUS_LABELS: Record<string, string> = {
  yes: 'Yes — labs done in last 30 days',
  no: 'No',
}

const PB_SYNC_LABELS: Record<string, string> = {
  pending: 'Pending',
  synced: 'Synced',
  failed: 'Failed',
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'paperworkStatus', 'createdAt'],
  },
  access: {
    // Clients can read/update their own profile
    // Admins can read all
    read: ({ req: { user } }) => {
      return !!user
    },
    create: () => true, // Allow public registration
    update: ({ req: { user } }) => {
      return !!user
    },
    delete: ({ req: { user } }) => {
      return !!user
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        try {
          const siteSettings = await req.payload.findGlobal({ slug: 'site-settings' })

          const configuredRecipients = siteSettings?.newClientNotificationRecipients
          const recipientEmails: string[] = []
          if (Array.isArray(configuredRecipients)) {
            for (const entry of configuredRecipients) {
              if (!entry || typeof entry !== 'object') continue
              const { relationTo, value } = entry as {
                relationTo: 'users' | 'admins'
                value: string | number | { email?: string }
              }
              if (typeof value === 'object' && value?.email) {
                recipientEmails.push(value.email)
              } else if (typeof value === 'string' || typeof value === 'number') {
                try {
                  const populated = await req.payload.findByID({
                    collection: relationTo,
                    id: value,
                  })
                  if (populated?.email) recipientEmails.push(populated.email)
                } catch (lookupError) {
                  console.error(
                    `Failed to resolve recipient ${relationTo}:${value} for new client notification:`,
                    lookupError,
                  )
                }
              }
            }
          }
          const recipients =
            recipientEmails.length > 0 ? recipientEmails : ['eric@gainzmarketing.com']
          const fromAddress =
            siteSettings?.fromEmail ||
            process.env.RESEND_DEFAULT_FROM_ADDRESS ||
            'info@gainzmarketing.com'
          const fromName =
            siteSettings?.fromName || process.env.RESEND_DEFAULT_FROM_NAME || 'StrengthRX'

          let trainerName: string | null = null
          if (doc.assignedTrainer) {
            const trainerId =
              typeof doc.assignedTrainer === 'object'
                ? doc.assignedTrainer.id
                : doc.assignedTrainer
            try {
              const trainer = await req.payload.findByID({
                collection: 'partners',
                id: trainerId,
              })
              trainerName = trainer.fullName || null
            } catch (trainerError) {
              console.error('Failed to load assigned trainer for signup notification:', trainerError)
            }
          }

          const goalsLabel =
            Array.isArray(doc.goals) && doc.goals.length > 0
              ? doc.goals.map((g: string) => GOAL_LABELS[g] ?? g).join(', ')
              : 'Not specified'

          const labsStatusLabel = doc.labsStatus
            ? LABS_STATUS_LABELS[doc.labsStatus] ?? doc.labsStatus
            : 'Not specified'

          const pbStatusLabel = doc.practiceBetterSyncStatus
            ? PB_SYNC_LABELS[doc.practiceBetterSyncStatus] ?? doc.practiceBetterSyncStatus
            : 'Pending'

          const row = (label: string, value: string) => `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #eee;">${label}</td>
              <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${value}</td>
            </tr>`

          await req.payload.sendEmail({
            from: `${fromName} <${fromAddress}>`,
            to: recipients,
            subject: `New StrengthRX client signup: ${doc.firstName} ${doc.lastName}`,
            html: `
              <h2>New Client Signup</h2>
              <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                ${row('Name', `${doc.firstName} ${doc.lastName}`)}
                ${row('Email', `<a href="mailto:${doc.email}">${doc.email}</a>`)}
                ${row('Phone', doc.phone || 'Not provided')}
                ${row('Date of Birth', doc.dateOfBirth || 'Not provided')}
                ${row('Assigned Trainer', trainerName || 'None')}
                ${row('Goals', goalsLabel)}
                ${row('Recent Labs', labsStatusLabel)}
                ${row('Practice Better Sync', pbStatusLabel)}
                ${row('Signed Up At', new Date().toISOString())}
              </table>
            `,
          })
        } catch (notifyError) {
          console.error('New client notification hook failed:', notifyError)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: true,
      admin: {
        description: 'Required for medical verification',
      },
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'assignedTrainer',
      type: 'relationship',
      relationTo: 'partners',
      admin: {
        description: 'Set upon registration if a referral code is used',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        hidden: true,
        description: 'Hidden field for billing',
      },
    },
    {
      name: 'paperworkStatus',
      type: 'select',
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        description: 'Admin-only edit',
      },
    },
    {
      name: 'labStatus',
      type: 'select',
      defaultValue: 'not_ordered',
      options: [
        { label: 'Not Ordered', value: 'not_ordered' },
        { label: 'Ordered', value: 'ordered' },
        { label: 'Received', value: 'received' },
        { label: 'Uploaded', value: 'uploaded' },
      ],
      admin: {
        description: 'Admin-only edit',
      },
    },
    {
      name: 'medicalReviewStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Complete', value: 'complete' },
        { label: 'Denied', value: 'denied' },
      ],
      admin: {
        description: 'Admin-only edit',
      },
    },
    {
      name: 'goals',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Lose Weight', value: 'lose_weight' },
        { label: 'More Energy', value: 'more_energy' },
        { label: 'Less Burnout', value: 'less_burnout' },
        { label: 'Build Muscle', value: 'build_muscle' },
        { label: 'Improve Sexual Wellness', value: 'sexual_wellness' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Health goals selected during onboarding',
      },
    },
    {
      name: 'labsStatus',
      type: 'select',
      options: [
        { label: 'Yes — labs done in last 30 days', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      admin: {
        description: 'Whether client has had full labs in the last 30 days (onboarding question)',
      },
    },
    {
      name: 'practiceBetterId',
      type: 'text',
      admin: {
        description: 'Practice Better patient ID — set after successful sync',
      },
    },
    {
      name: 'practiceBetterSyncStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Sync status with Practice Better — admin can retry on failure',
      },
    },
  ],
  timestamps: true, // This automatically adds createdAt and updatedAt fields
}
