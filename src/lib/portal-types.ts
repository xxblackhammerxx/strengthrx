export interface ClientPortalData {
  firstName: string
  lastName: string
  email: string
  memberSince: string
  paperworkStatus: string
  labStatus: string
  medicalReviewStatus: string
}

export interface PartnerPortalData {
  fullName: string
  referralCode: string
  commissionRate: number
  totalEarnings: number
  monthlyEarnings: number
  totalReferrals: number
  activeReferrals: number
  conversionRate: number
  statusData: StatusDataItem[]
  earningsData: EarningsDataItem[]
  recentReferrals: RecentReferral[]
}

export interface StatusDataItem {
  name: string
  value: number
  color: string
}

export interface EarningsDataItem {
  month: string
  earnings: number
}

export interface RecentReferral {
  id: string
  status: string
  earnings: number
  date: string
}

export interface AdminPortalData {
  stats: AdminStats
  revenueData: RevenueDataItem[]
  referralData: ReferralPartnerItem[]
  recentClients: AdminRecentClient[]
}

export interface AdminStats {
  totalClients: number
  activePartners: number
  totalReferrals: number
  pendingReviews: number
  monthlyRevenue: number
  conversionRate: number
}

export interface RevenueDataItem {
  month: string
  revenue: number
  clients: number
}

export interface ReferralPartnerItem {
  partner: string
  referrals: number
  earnings: number
}

export interface AdminRecentClient {
  id: number
  name: string
  status: string
  paperwork: string
  date: string
}
