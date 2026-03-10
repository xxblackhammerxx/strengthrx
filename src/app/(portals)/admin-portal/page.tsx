import { redirect } from 'next/navigation'
import { getAuthenticatedAdmin } from '@/lib/auth'
import type {
  AdminPortalData,
  AdminStats,
  RevenueDataItem,
  ReferralPartnerItem,
  AdminRecentClient,
} from '@/lib/portal-types'
import AdminPortalContent from './AdminPortalContent'

export default async function AdminPortalPage() {
  const auth = await getAuthenticatedAdmin()

  if (!auth) {
    redirect('/admin')
  }

  const { payload } = auth

  // Run parallel queries for dashboard data
  const [
    clientsCount,
    activePartnersCount,
    referralsCount,
    pendingReviewsCount,
    recentClientsResult,
    allReferralsResult,
    topPartnersResult,
  ] = await Promise.all([
    payload.count({ collection: 'clients' }),
    payload.count({ collection: 'partners', where: { status: { equals: 'active' } } }),
    payload.count({ collection: 'referrals' }),
    payload.count({ collection: 'clients', where: { medicalReviewStatus: { equals: 'pending' } } }),
    payload.find({ collection: 'clients', sort: '-createdAt', limit: 5 }),
    payload.find({ collection: 'referrals', limit: 0 }),
    payload.find({ collection: 'partners', sort: '-totalEarnings', limit: 5 }),
  ])

  // Compute revenue from referrals
  const allReferrals = allReferralsResult.docs
  const totalRevenue = allReferrals.reduce((sum, r) => sum + (r.commissionSnapshot || 0), 0)

  // Compute conversion rate
  const convertedReferrals = allReferrals.filter((r) => r.status === 'converted').length
  const conversionRate =
    allReferrals.length > 0 ? Math.round((convertedReferrals / allReferrals.length) * 100) : 0

  const stats: AdminStats = {
    totalClients: clientsCount.totalDocs,
    activePartners: activePartnersCount.totalDocs,
    totalReferrals: referralsCount.totalDocs,
    pendingReviews: pendingReviewsCount.totalDocs,
    monthlyRevenue: totalRevenue,
    conversionRate,
  }

  // Build monthly revenue data (last 5 months)
  const now = new Date()
  const revenueData: RevenueDataItem[] = []
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = d.toLocaleDateString('en-US', { month: 'short' })
    const monthReferrals = allReferrals.filter((r) => {
      const rd = new Date(r.createdAt)
      return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
    })
    const revenue = monthReferrals.reduce((sum, r) => sum + (r.commissionSnapshot || 0), 0)
    revenueData.push({
      month: monthName,
      revenue,
      clients: monthReferrals.length,
    })
  }

  // Top partners data
  const referralData: ReferralPartnerItem[] = topPartnersResult.docs.map((p) => ({
    partner: p.fullName,
    referrals: allReferrals.filter((r) => {
      const trainerId = typeof r.trainer === 'object' ? r.trainer?.id : r.trainer
      return trainerId === p.id
    }).length,
    earnings: p.totalEarnings || 0,
  }))

  // Recent clients
  const recentClients: AdminRecentClient[] = recentClientsResult.docs.map((c) => ({
    id: c.id as number,
    name: `${c.firstName} ${c.lastName}`,
    status: c.medicalReviewStatus || 'pending',
    paperwork: c.paperworkStatus || 'not_started',
    date: c.createdAt,
  }))

  const adminData: AdminPortalData = {
    stats,
    revenueData,
    referralData,
    recentClients,
  }

  return <AdminPortalContent adminData={adminData} />
}
