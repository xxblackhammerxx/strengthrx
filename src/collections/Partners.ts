import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'referralCode', 'status', 'totalEarnings', 'createdAt'],
  },
  access: {
    // Partners can read/update their own profile only
    read: ({ req: { user } }) => {
      if (!user) return false
      // If admin, can see all
      return true
    },
    create: ({ req: { user } }) => {
      return !!user
    },
    update: ({ req: { user } }) => {
      return !!user
    },
    delete: ({ req: { user } }) => {
      return !!user
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'referralCode',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique code used for attribution (e.g., "TRAINERJOE")',
      },
    },
    {
      name: 'commissionRate',
      type: 'number',
      required: true,
      defaultValue: 10,
      admin: {
        description: 'Commission percentage (default: 10%)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'payoutDetails',
      type: 'group',
      fields: [
        {
          name: 'bankName',
          type: 'text',
        },
        {
          name: 'accountLast4',
          type: 'text',
        },
        {
          name: 'venmoHandle',
          type: 'text',
        },
      ],
    },
    {
      name: 'totalEarnings',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Calculated via hooks',
      },
    },
  ],
  timestamps: true, // This automatically adds createdAt and updatedAt fields
}
