import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

const ADMIN_PASSWORD = 'Admin123!'
const PARTNER_PASSWORD = 'Partner123!'
const CLIENT_PASSWORD = 'Client123!'

async function seed() {
  console.log('🌱 Starting seed...\n')

  const payload = await getPayload({ config })

  // ── Admins ──────────────────────────────────────────────
  console.log('Creating admins...')
  const admin1 = await payload.create({
    collection: 'admins',
    data: {
      name: 'Dr. Sarah Mitchell',
      email: 'sarah@strengthrx.com',
      password: ADMIN_PASSWORD,
      role: 'owner',
    },
  })
  const admin2 = await payload.create({
    collection: 'admins',
    data: {
      name: 'Nurse Rachel Adams',
      email: 'rachel@strengthrx.com',
      password: ADMIN_PASSWORD,
      role: 'cnp',
    },
  })
  console.log(`  ✓ Created ${admin1.name} (owner)`)
  console.log(`  ✓ Created ${admin2.name} (cnp)`)

  // ── Partners ────────────────────────────────────────────
  console.log('\nCreating partners...')
  const partnersData = [
    { fullName: 'John Rivera', email: 'john@fitlife.com', referralCode: 'TRAINERJOHN', commissionRate: 12 },
    { fullName: 'Lisa Chen', email: 'lisa@ironwill.com', referralCode: 'COACHLISA', commissionRate: 10 },
    { fullName: 'Marcus Thompson', email: 'marcus@peakfit.com', referralCode: 'FITMARC', commissionRate: 15 },
  ]

  const partners = []
  for (const p of partnersData) {
    const partner = await payload.create({
      collection: 'partners',
      data: {
        ...p,
        password: PARTNER_PASSWORD,
        status: 'active',
        totalEarnings: 0,
      },
    })
    partners.push(partner)
    console.log(`  ✓ Created ${partner.fullName} (${partner.referralCode})`)
  }

  // ── Clients ─────────────────────────────────────────────
  console.log('\nCreating clients...')
  const clientsData = [
    { firstName: 'Alex', lastName: 'Thompson', email: 'alex.t@email.com', dateOfBirth: '1990-03-15', phone: '555-0101', paperworkStatus: 'completed' as const, labStatus: 'received' as const, medicalReviewStatus: 'complete' as const, partnerIdx: 0 },
    { firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@email.com', dateOfBirth: '1988-07-22', phone: '555-0102', paperworkStatus: 'completed' as const, labStatus: 'ordered' as const, medicalReviewStatus: 'pending' as const, partnerIdx: 0 },
    { firstName: 'Chris', lastName: 'Martinez', email: 'chris.m@email.com', dateOfBirth: '1992-11-08', phone: '555-0103', paperworkStatus: 'completed' as const, labStatus: 'uploaded' as const, medicalReviewStatus: 'complete' as const, partnerIdx: 0 },
    { firstName: 'Sophia', lastName: 'Nguyen', email: 'sophia.n@email.com', dateOfBirth: '1995-01-30', phone: '555-0104', paperworkStatus: 'in_progress' as const, labStatus: 'not_ordered' as const, medicalReviewStatus: 'pending' as const, partnerIdx: 1 },
    { firstName: 'David', lastName: 'Lee', email: 'david.l@email.com', dateOfBirth: '1985-06-14', phone: '555-0105', paperworkStatus: 'completed' as const, labStatus: 'received' as const, medicalReviewStatus: 'complete' as const, partnerIdx: 1 },
    { firstName: 'Olivia', lastName: 'Brown', email: 'olivia.b@email.com', dateOfBirth: '1993-09-25', phone: '555-0106', paperworkStatus: 'completed' as const, labStatus: 'ordered' as const, medicalReviewStatus: 'pending' as const, partnerIdx: 1 },
    { firstName: 'James', lastName: 'Taylor', email: 'james.t@email.com', dateOfBirth: '1991-04-17', phone: '555-0107', paperworkStatus: 'not_started' as const, labStatus: 'not_ordered' as const, medicalReviewStatus: 'pending' as const, partnerIdx: 2 },
    { firstName: 'Mia', lastName: 'Anderson', email: 'mia.a@email.com', dateOfBirth: '1994-12-03', phone: '555-0108', paperworkStatus: 'completed' as const, labStatus: 'received' as const, medicalReviewStatus: 'pending' as const, partnerIdx: 2 },
    { firstName: 'Ethan', lastName: 'Garcia', email: 'ethan.g@email.com', dateOfBirth: '1989-08-19', phone: '555-0109', paperworkStatus: 'completed' as const, labStatus: 'uploaded' as const, medicalReviewStatus: 'complete' as const, partnerIdx: 2 },
    { firstName: 'Ava', lastName: 'Johnson', email: 'ava.j@email.com', dateOfBirth: '1996-02-28', phone: '555-0110', paperworkStatus: 'completed' as const, labStatus: 'ordered' as const, medicalReviewStatus: 'pending' as const, partnerIdx: null },
  ]

  const clients = []
  for (const c of clientsData) {
    const { partnerIdx, ...clientFields } = c
    const client = await payload.create({
      collection: 'clients',
      data: {
        ...clientFields,
        password: CLIENT_PASSWORD,
        assignedTrainer: partnerIdx !== null ? partners[partnerIdx].id : undefined,
      },
    })
    clients.push(client)
    console.log(`  ✓ Created ${client.firstName} ${client.lastName}`)
  }

  // ── Referrals ───────────────────────────────────────────
  console.log('\nCreating referrals...')

  type ReferralStatus = 'lead_created' | 'consult_booked' | 'qualified' | 'converted' | 'disqualified'

  const referralsData: {
    partnerIdx: number
    clientIdx: number
    status: ReferralStatus
    commission: number
    monthsAgo: number
  }[] = [
    // Partner 0 (John Rivera) – 7 referrals
    { partnerIdx: 0, clientIdx: 0, status: 'converted', commission: 250, monthsAgo: 4 },
    { partnerIdx: 0, clientIdx: 1, status: 'consult_booked', commission: 50, monthsAgo: 1 },
    { partnerIdx: 0, clientIdx: 2, status: 'converted', commission: 250, monthsAgo: 3 },
    { partnerIdx: 0, clientIdx: 0, status: 'qualified', commission: 0, monthsAgo: 2 },
    { partnerIdx: 0, clientIdx: 1, status: 'lead_created', commission: 0, monthsAgo: 0 },
    { partnerIdx: 0, clientIdx: 2, status: 'converted', commission: 250, monthsAgo: 1 },
    { partnerIdx: 0, clientIdx: 0, status: 'disqualified', commission: 0, monthsAgo: 3 },

    // Partner 1 (Lisa Chen) – 6 referrals
    { partnerIdx: 1, clientIdx: 3, status: 'lead_created', commission: 0, monthsAgo: 0 },
    { partnerIdx: 1, clientIdx: 4, status: 'converted', commission: 200, monthsAgo: 2 },
    { partnerIdx: 1, clientIdx: 5, status: 'consult_booked', commission: 50, monthsAgo: 0 },
    { partnerIdx: 1, clientIdx: 3, status: 'qualified', commission: 0, monthsAgo: 1 },
    { partnerIdx: 1, clientIdx: 4, status: 'converted', commission: 200, monthsAgo: 3 },
    { partnerIdx: 1, clientIdx: 5, status: 'lead_created', commission: 0, monthsAgo: 4 },

    // Partner 2 (Marcus Thompson) – 5 referrals
    { partnerIdx: 2, clientIdx: 6, status: 'lead_created', commission: 0, monthsAgo: 0 },
    { partnerIdx: 2, clientIdx: 7, status: 'qualified', commission: 0, monthsAgo: 1 },
    { partnerIdx: 2, clientIdx: 8, status: 'converted', commission: 300, monthsAgo: 2 },
    { partnerIdx: 2, clientIdx: 6, status: 'consult_booked', commission: 75, monthsAgo: 0 },
    { partnerIdx: 2, clientIdx: 8, status: 'converted', commission: 300, monthsAgo: 4 },
  ]

  let refCounter = 1000
  for (const r of referralsData) {
    refCounter++
    const publicId = `REF-${refCounter}`

    // Compute a backdated createdAt
    const createdAt = new Date()
    createdAt.setMonth(createdAt.getMonth() - r.monthsAgo)
    // Randomize the day a bit
    createdAt.setDate(Math.floor(Math.random() * 28) + 1)

    await payload.create({
      collection: 'referrals',
      data: {
        trainer: partners[r.partnerIdx].id,
        client: clients[r.clientIdx].id,
        publicId,
        status: r.status,
        commissionSnapshot: r.commission,
        marketingSource: partners[r.partnerIdx].referralCode,
      },
    })
    console.log(`  ✓ Created ${publicId} (${r.status}) → Partner: ${partners[r.partnerIdx].fullName}`)
  }

  // ── Update partner totalEarnings ────────────────────────
  console.log('\nUpdating partner earnings...')
  for (let i = 0; i < partners.length; i++) {
    const partnerReferrals = referralsData.filter((r) => r.partnerIdx === i)
    const totalEarnings = partnerReferrals.reduce((sum, r) => sum + r.commission, 0)
    await payload.update({
      collection: 'partners',
      id: partners[i].id,
      data: { totalEarnings },
    })
    console.log(`  ✓ ${partners[i].fullName}: $${totalEarnings}`)
  }

  // ── Prescription States Global ──────────────────────────
  console.log('\nSeeding prescription states...')
  await payload.updateGlobal({
    slug: 'prescription-states',
    data: {
      states: [
        { code: 'AZ', name: 'Arizona', description: 'Phoenix and statewide coverage' },
        { code: 'ID', name: 'Idaho', description: 'Boise and statewide coverage' },
        { code: 'WY', name: 'Wyoming', description: 'Cheyenne and statewide coverage' },
        { code: 'IA', name: 'Iowa', description: 'Des Moines and statewide coverage' },
        { code: 'UT', name: 'Utah', description: 'Salt Lake City and statewide coverage' },
        { code: 'NM', name: 'New Mexico', description: 'Albuquerque and statewide coverage' },
        { code: 'NV', name: 'Nevada', description: 'Las Vegas and statewide coverage' },
        { code: 'CO', name: 'Colorado', description: 'Denver and statewide coverage' },
        { code: 'WA', name: 'Washington', description: 'Seattle and statewide coverage' },
        { code: 'VA', name: 'Virginia', description: 'Richmond and statewide coverage' },
        { code: 'NE', name: 'Nebraska', description: 'Omaha and statewide coverage' },
        { code: 'FL', name: 'Florida', description: 'Miami and statewide coverage' },
      ],
    },
  })
  console.log('  ✓ Prescription states seeded (12 states)')

  // ── Summary ─────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50))
  console.log('🎉 Seed complete!\n')
  console.log('Login Credentials:')
  console.log('─'.repeat(50))
  console.log(`Admin:   sarah@strengthrx.com / ${ADMIN_PASSWORD}`)
  console.log(`Admin:   rachel@strengthrx.com / ${ADMIN_PASSWORD}`)
  console.log(`Partner: john@fitlife.com / ${PARTNER_PASSWORD}`)
  console.log(`Partner: lisa@ironwill.com / ${PARTNER_PASSWORD}`)
  console.log(`Partner: marcus@peakfit.com / ${PARTNER_PASSWORD}`)
  console.log(`Client:  alex.t@email.com / ${CLIENT_PASSWORD}`)
  console.log(`Client:  emma.w@email.com / ${CLIENT_PASSWORD}`)
  console.log('─'.repeat(50))

  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
