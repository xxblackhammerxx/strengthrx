'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { DashboardCard } from '@/components/ui/DashboardCard'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Users, UserCheck, DollarSign, TrendingUp, Activity, FileText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import type { AdminPortalData } from '@/lib/portal-types'

export default function AdminPortalContent({ adminData }: { adminData: AdminPortalData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const { stats, revenueData, referralData, recentClients } = adminData

  return (
    <>
      {/* Page Header */}
      <div className="border-b bg-white">
        <Container>
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your business operations</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Generate Report
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<Users className="h-8 w-8" />}
          />
          <DashboardCard
            title="Active Partners"
            value={stats.activePartners}
            icon={<UserCheck className="h-8 w-8" />}
          />
          <DashboardCard
            title="Total Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-8 w-8" />}
          />
          <DashboardCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={<TrendingUp className="h-8 w-8" />}
          />
          <DashboardCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            description="Requires CNP attention"
            icon={<FileText className="h-8 w-8" />}
          />
          <DashboardCard
            title="Total Referrals"
            value={stats.totalReferrals}
            icon={<Activity className="h-8 w-8" />}
          />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Client Growth Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Referral Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clients" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Partners */}
        {referralData.length > 0 && (
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Top Partners</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={referralData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="partner" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="referrals" fill="#8b5cf6" />
                <Bar dataKey="earnings" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Clients Table */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b p-6">
            <h3 className="text-lg font-semibold">Recent Clients</h3>
          </div>
          {recentClients.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No clients yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paperwork</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          client.status === 'complete'
                            ? 'bg-green-100 text-green-800'
                            : client.status === 'denied'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {client.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          client.paperwork === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : client.paperwork === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {client.paperwork.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(client.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <button className="text-sm text-blue-600 hover:underline">
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Container>
    </>
  )
}
