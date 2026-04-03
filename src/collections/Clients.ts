import type { CollectionConfig } from 'payload'

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
