'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import {
  DollarSign,
  Users,
  TrendingUp,
  Share2,
  Image as ImageIcon,
  Settings,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  CalendarClock,
} from 'lucide-react'
import { ReferralLinkCard } from '@/components/portal/ReferralLinkCard'
import type { PartnerPortalData, EarningsDataItem, StatusDataItem } from '@/lib/portal-types'

function EarningsChart({ data }: { data: EarningsDataItem[] }) {
  if (data.length === 0) return <p className="text-sm text-neutral-500">No earnings data yet.</p>

  const maxVal = Math.max(...data.map((d) => d.earnings), 1) * 1.15
  const chartHeight = 200

  return (
    <div className="relative h-[240px] w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-[11px] text-neutral-600">
        <span>${(maxVal / 1000).toFixed(1)}k</span>
        <span>${((maxVal * 0.75) / 1000).toFixed(1)}k</span>
        <span>${((maxVal * 0.5) / 1000).toFixed(1)}k</span>
        <span>${((maxVal * 0.25) / 1000).toFixed(1)}k</span>
        <span>$0</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 h-[200px] w-[calc(100%-3rem)]">
        <div className="relative h-full w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <div
              key={pct}
              className="absolute left-0 right-0 border-t border-white/[0.04]"
              style={{ top: `${(1 - pct) * chartHeight}px` }}
            />
          ))}

          {/* SVG Chart */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="earningsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${((maxVal - d.earnings) / maxVal) * chartHeight}`).join(' L ')} L 100%,${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#earningsGrad)"
            />
            {/* Line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${((maxVal - d.earnings) / maxVal) * chartHeight}`,
                )
                .join(' ')}
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dots */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={((maxVal - d.earnings) / maxVal) * chartHeight}
                r="5"
                fill="rgb(16 185 129)"
                stroke="rgb(23 23 23)"
                strokeWidth="2.5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-12 mt-3 flex w-[calc(100%-3rem)] justify-between text-[11px] text-neutral-600">
        {data.map((d) => (
          <span key={d.month}>{d.month}</span>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ data }: { data: StatusDataItem[] }) {
  if (data.length === 0) return <p className="text-sm text-neutral-500">No referral data yet.</p>

  const total = data.reduce((acc, d) => acc + d.value, 0)
  const radius = 70
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  let cumulativePercent = 0

  return (
    <div className="flex items-center justify-center gap-8">
      <div className="relative">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {data.map((segment, i) => {
            const percent = segment.value / total
            const dashLength = circumference * percent
            const dashOffset = circumference * (1 - cumulativePercent) + circumference * 0.25
            cumulativePercent += percent

            return (
              <circle
                key={i}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-500"
                style={{ opacity: 0.85 }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-xs text-neutral-500">Total</span>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <div>
              <p className="text-sm font-medium text-neutral-300">{d.name}</p>
              <p className="text-xs text-neutral-600">
                {d.value} &middot; {((d.value / total) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PartnerPortalContent({ partnerData }: { partnerData: PartnerPortalData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'qualified':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'consult_booked':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20'
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'converted':
        return <CheckCircle2 className="h-3.5 w-3.5" />
      case 'qualified':
        return <Clock className="h-3.5 w-3.5" />
      default:
        return <AlertCircle className="h-3.5 w-3.5" />
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-[400px] -top-[200px] h-[800px] w-[800px] rounded-full bg-emerald-600/[0.03] blur-[120px]" />
        <div className="absolute -left-[300px] top-[600px] h-[600px] w-[600px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative border-b border-white/[0.06]">
        <Container>
          <div className="flex items-end justify-between py-8 sm:py-10">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-500">
                Partner Dashboard
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome, {partnerData.fullName}
              </h1>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
                <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-500">
                  Your Referral Code
                </p>
                <code className="text-lg font-bold tracking-wider text-white">
                  {partnerData.referralCode}
                </code>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Earnings */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Total Earnings
                </p>
                <p className="mt-1.5 text-2xl font-bold text-emerald-400">
                  ${partnerData.totalEarnings.toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">All time</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  This Month
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">
                  ${partnerData.monthlyEarnings.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Referrals */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Total Referrals
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">
                  {partnerData.totalReferrals}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {partnerData.activeReferrals} active
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Conversion Rate
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">
                  {partnerData.conversionRate}%
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {partnerData.commissionRate}% commission
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Share2 className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-8">
          <ReferralLinkCard referralCode={partnerData.referralCode} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          <Link
            href="/partner-portal/marketing"
            className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <ImageIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Marketing Materials</h3>
                <p className="text-xs text-neutral-500">Get promotional content</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400" />
          </Link>

          <button className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <Users className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">View All Referrals</h3>
                <p className="text-xs text-neutral-500">Track your clients</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400" />
          </button>

          <button className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-500/10 p-2.5">
                <Settings className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Payment Settings</h3>
                <p className="text-xs text-neutral-500">Update payout info</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400" />
          </button>
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Earnings Trend */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h3 className="font-heading text-base font-semibold text-white">Earnings Trend</h3>
              <p className="mt-0.5 text-xs text-neutral-500">Monthly earnings overview</p>
            </div>
            <div className="p-6">
              <EarningsChart data={partnerData.earningsData} />
            </div>
          </div>

          {/* Referral Status Distribution */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h3 className="font-heading text-base font-semibold text-white">
                Referral Distribution
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">Status breakdown of all referrals</p>
            </div>
            <div className="flex items-center justify-center p-6">
              <DonutChart data={partnerData.statusData} />
            </div>
          </div>
        </div>

        {/* Recent Referrals Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h3 className="font-heading text-base font-semibold text-white">Recent Referrals</h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Client names are hidden for privacy compliance
            </p>
          </div>

          {partnerData.recentReferrals.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-neutral-500">
              No referrals yet. Share your referral link to get started!
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden border-b border-white/[0.04] px-6 py-3 sm:grid sm:grid-cols-4">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Reference ID
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Earnings
                </span>
                <span className="text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Date
                </span>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/[0.04]">
                {partnerData.recentReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="grid grid-cols-2 gap-2 px-6 py-3.5 transition-colors hover:bg-white/[0.02] sm:grid-cols-4 sm:gap-0"
                  >
                    <div className="font-mono text-sm font-medium text-white">{referral.id}</div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(referral.status)}`}
                      >
                        {getStatusIcon(referral.status)}
                        <span className="capitalize">{referral.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {referral.earnings > 0 ? (
                        <span className="text-emerald-400">${referral.earnings}</span>
                      ) : (
                        <span className="text-neutral-600">&mdash;</span>
                      )}
                    </div>
                    <div className="text-right text-xs text-neutral-500">
                      {new Date(referral.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Payout Info */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-white">
                  Payout Information
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Payouts are processed on the 15th of each month.
                  {partnerData.monthlyEarnings > 0 && (
                    <>
                      {' '}Your next payout of{' '}
                      <span className="font-semibold text-emerald-400">
                        ${partnerData.monthlyEarnings.toLocaleString()}
                      </span>{' '}
                      will be processed soon.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2.5">
              <CalendarClock className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">15th of month</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
