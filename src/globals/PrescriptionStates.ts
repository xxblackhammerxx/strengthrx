import type { GlobalConfig } from 'payload'

export const PrescriptionStates: GlobalConfig = {
  slug: 'prescription-states',
  label: 'Prescription States',
  admin: {
    description:
      'Manage the states where prescription-related services are currently available. These are displayed across the site.',
  },
  fields: [
    {
      name: 'states',
      type: 'array',
      label: 'Prescription States',
      labels: {
        singular: 'State',
        plural: 'States',
      },
      admin: {
        description: 'States where prescription-related services are available.',
      },
      fields: [
        {
          name: 'code',
          type: 'text',
          label: 'State Code',
          required: true,
          admin: {
            description: 'Two-letter state abbreviation (e.g., AZ, CO, FL)',
          },
          maxLength: 2,
          minLength: 2,
        },
        {
          name: 'name',
          type: 'text',
          label: 'State Name',
          required: true,
          admin: {
            description: 'Full state name (e.g., Arizona, Colorado, Florida)',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: true,
          admin: {
            description: 'Brief description (e.g., "Phoenix and statewide coverage")',
          },
        },
      ],
    },
  ],
}
