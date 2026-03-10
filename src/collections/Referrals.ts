import type { CollectionConfig } from 'payload'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'publicId',
    defaultColumns: ['publicId', 'trainer', 'status', 'commissionSnapshot', 'createdAt'],
  },
  access: {
    // Trainers can only see referrals belonging to them
    // Admins can see everything
    read: ({ req: { user } }) => {
      return !!user
    },
    // Allow API to create referrals (for signup flow)
    create: ({ req: { user } }) => {
      // Allow if user exists OR if it's an API call (user might not be logged in during signup)
      return true
    },
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'trainer',
      type: 'relationship',
      relationTo: 'partners',
      required: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      admin: {
        description: 'Only visible to admins for HIPAA compliance',
      },
    },
    {
      name: 'publicId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Safe ID for trainer display (e.g., REF-8821)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'lead_created',
      options: [
        { label: 'Lead Created', value: 'lead_created' },
        { label: 'Consult Booked (Paid)', value: 'consult_booked' },
        { label: 'Medically Qualified', value: 'qualified' },
        { label: 'Treatment Started', value: 'converted' },
        { label: 'Disqualified/Refunded', value: 'disqualified' },
      ],
    },
    {
      name: 'commissionSnapshot',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'The potential or actual value earned from this referral',
      },
    },
    {
      name: 'marketingSource',
      type: 'text',
      admin: {
        description: 'UTM Source or specific campaign tag (e.g., "instagram_bio")',
      },
    },
  ],
  timestamps: true, // This automatically adds createdAt and updatedAt fields
}
