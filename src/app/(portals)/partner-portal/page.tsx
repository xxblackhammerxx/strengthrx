import { redirect } from 'next/navigation'
import { getAuthenticatedPartner } from '@/lib/auth'
import type {
  PartnerPortalData,
  StatusDataItem,
  EarningsDataItem,
  RecentReferral,
} from '@/lib/portal-types'
import PartnerPortalContent from './PartnerPortalContent'

const STATUS_COLORS: Record<string, string> = {
  converted: '#10b981',
  qualified: '#3b82f6',
  consult_booked: '#8b5cf6',
  lead_created: '#f59e0b',
  disqualified: '#ef4444',
}

const STATUS_LABELS: Record<string, string> = {
  converted: 'Converted',
  qualified: 'Qualified',
  consult_booked: 'Consult Booked',
  lead_created: 'Lead Created',
  disqualified: 'Disqualified',
}

export default async function PartnerPortalPage() {
  const auth = await getAuthenticatedPartner()

  if (!auth) {
    redirect('/signup/partner')
  }

  const { payload, user } = auth

  // Fetch all referrals for this partner
  const referralsResult = await payload.find({
    collection: 'referrals',
    where: {
      trainer: { equals: user.id },
    },
    limit: 0, // get all
    sort: '-createdAt',
  })

  const referrals = referralsResult.docs

  // Compute stats
  const totalReferrals = referrals.length
  const activeReferrals = referrals.filter(
    (r) => r.status === 'converted' || r.status === 'qualified' || r.status === 'consult_booked',
  ).length
  const convertedCount = referrals.filter((r) => r.status === 'converted').length
  const conversionRate =
    totalReferrals > 0 ? Math.round((convertedCount / totalReferrals) * 100) : 0

  // Compute total earnings from commissionSnapshot
  const totalEarnings = referrals.reduce((sum, r) => sum + (r.commissionSnapshot || 0), 0)

  // Compute monthly earnings (current month)
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const monthlyEarnings = referrals
    .filter((r) => {
      const d = new Date(r.createdAt)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, r) => sum + (r.commissionSnapshot || 0), 0)

  // Build status distribution for donut chart
  const statusCounts: Record<string, number> = {}
  for (const r of referrals) {
    const status = r.status || 'lead_created'
    statusCounts[status] = (statusCounts[status] || 0) + 1
  }
  const statusData: StatusDataItem[] = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#6b7280',
  }))

  // Build monthly earnings trend (last 5 months)
  const earningsData: EarningsDataItem[] = []
  for (let i = 4; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1)
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const monthEarnings = referrals
      .filter((r) => {
        const rd = new Date(r.createdAt)
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
      })
      .reduce((sum, r) => sum + (r.commissionSnapshot || 0), 0)
    earningsData.push({ month: monthName, earnings: monthEarnings })
  }

  // Recent referrals (latest 5)
  const recentReferrals: RecentReferral[] = referrals.slice(0, 5).map((r) => ({
    id: r.publicId,
    status: r.status || 'lead_created',
    earnings: r.commissionSnapshot || 0,
    date: r.createdAt,
  }))

  const partnerData: PartnerPortalData = {
    fullName: user.fullName,
    referralCode: user.referralCode,
    commissionRate: user.commissionRate,
    totalEarnings,
    monthlyEarnings,
    totalReferrals,
    activeReferrals,
    conversionRate,
    statusData,
    earningsData,
    recentReferrals,
  }

  return <PartnerPortalContent partnerData={partnerData} />
}
