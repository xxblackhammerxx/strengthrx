'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Pill,
  Shield,
  HeartPulse,
  Zap,
  Download,
  Upload,
  Phone,
  MessageCircle,
  ChevronRight,
  Microscope,
  ClipboardCheck,
  Info,
  Mail,
  ExternalLink,
} from 'lucide-react'
import type { ClientPortalData } from '@/lib/portal-types'

// ─── Onboarding types ────────────────────────────────────────────────────────

type Step = {
  id: number
  title: string
  icon: React.ElementType
  status: 'completed' | 'current' | 'upcoming'
  description: string
}

// ─── Active-treatment mock data ──────────────────────────────────────────────

const progressData = [
  { date: 'Week 1', wellness: 65, energy: 60 },
  { date: 'Week 2', wellness: 70, energy: 68 },
  { date: 'Week 3', wellness: 75, energy: 72 },
  { date: 'Week 4', wellness: 78, energy: 76 },
  { date: 'Week 5', wellness: 82, energy: 80 },
  { date: 'Week 6', wellness: 85, energy: 83 },
]

const appointmentHistory = [
  {
    id: 1,
    type: 'Initial Consultation',
    date: '2025-11-15',
    provider: 'Dr. Sarah Miller',
    status: 'completed',
  },
  {
    id: 2,
    type: 'Lab Review',
    date: '2025-12-01',
    provider: 'Dr. Sarah Miller',
    status: 'completed',
  },
  {
    id: 3,
    type: 'Follow-up',
    date: '2026-01-10',
    provider: 'Dr. Sarah Miller',
    status: 'completed',
  },
  {
    id: 4,
    type: 'Treatment Adjustment',
    date: '2026-02-05',
    provider: 'Dr. Sarah Miller',
    status: 'scheduled',
  },
]

const documents = [
  { name: 'Lab Results - December 2025', type: 'Lab Report', date: '2025-12-01' },
  { name: 'Treatment Plan', type: 'Medical Record', date: '2025-11-20' },
  { name: 'Consent Form', type: 'Legal', date: '2025-11-15' },
  { name: 'Insurance Information', type: 'Billing', date: '2025-11-15' },
]

const treatmentSchedule = [
  { day: 'Monday', medication: 'Testosterone Cypionate', dosage: '100mg', time: '8:00 AM' },
  { day: 'Thursday', medication: 'Testosterone Cypionate', dosage: '100mg', time: '8:00 AM' },
]

function ProgressChart({ data }: { data: typeof progressData }) {
  const maxVal = 100
  const chartHeight = 200
  const chartWidth = 100

  return (
    <div className="relative h-[240px] w-full">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex h-[200px] flex-col justify-between text-[11px] text-neutral-600">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      {/* Chart area */}
      <div className="ml-8 h-[200px] w-[calc(100%-2rem)]">
        {/* Grid lines */}
        <div className="relative h-full w-full">
          {[0, 25, 50, 75, 100].map((val) => (
            <div
              key={val}
              className="absolute left-0 right-0 border-t border-white/[0.04]"
              style={{ top: `${((maxVal - val) / maxVal) * chartHeight}px` }}
            />
          ))}

          {/* SVG Chart */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* Wellness area fill */}
            <defs>
              <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="energyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Wellness area */}
            <path
              d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${((maxVal - d.wellness) / maxVal) * chartHeight}`).join(' L ')} L 100%,${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#wellnessGrad)"
            />
            {/* Wellness line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${((maxVal - d.wellness) / maxVal) * chartHeight}`,
                )
                .join(' ')}
              fill="none"
              stroke="rgb(59 130 246)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Energy area */}
            <path
              d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${((maxVal - d.energy) / maxVal) * chartHeight}`).join(' L ')} L 100%,${chartHeight} L 0,${chartHeight} Z`}
              fill="url(#energyGrad)"
            />
            {/* Energy line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1)) * 100}%,${((maxVal - d.energy) / maxVal) * chartHeight}`,
                )
                .join(' ')}
              fill="none"
              stroke="rgb(16 185 129)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Wellness dots */}
            {data.map((d, i) => (
              <circle
                key={`w-${i}`}
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={((maxVal - d.wellness) / maxVal) * chartHeight}
                r="4"
                fill="rgb(59 130 246)"
                stroke="rgb(23 23 23)"
                strokeWidth="2"
              />
            ))}
            {/* Energy dots */}
            {data.map((d, i) => (
              <circle
                key={`e-${i}`}
                cx={`${(i / (data.length - 1)) * 100}%`}
                cy={((maxVal - d.energy) / maxVal) * chartHeight}
                r="4"
                fill="rgb(16 185 129)"
                stroke="rgb(23 23 23)"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-8 mt-3 flex w-[calc(100%-2rem)] justify-between text-[11px] text-neutral-600">
        {data.map((d) => (
          <span key={d.date}>{d.date}</span>
        ))}
      </div>
    </div>
  )
}

export default function ClientPortalContent({ clientData }: { clientData: ClientPortalData }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Determine whether onboarding is complete
  const isOnboarded = clientData.medicalReviewStatus === 'complete'

  if (!isOnboarded) {
    return <OnboardingView clientData={clientData} />
  }

  return <ActiveDashboardView clientData={clientData} />
}

// ─── Onboarding View (formerly CustomerPortalContent) ────────────────────────

function OnboardingView({ clientData }: { clientData: ClientPortalData }) {
  // Determine step statuses based on client data
  const getStepStatus = (stepId: number): 'completed' | 'current' | 'upcoming' => {
    switch (stepId) {
      case 1: // Paperwork
        if (clientData.paperworkStatus === 'completed') return 'completed'
        if (clientData.paperworkStatus === 'in_progress') return 'current'
        return 'current' // First step is always at least current
      case 2: // Labs
        if (clientData.labStatus === 'uploaded' || clientData.labStatus === 'received')
          return 'completed'
        if (
          clientData.paperworkStatus === 'completed' &&
          (clientData.labStatus === 'ordered' || clientData.labStatus === 'not_ordered')
        )
          return 'current'
        return 'upcoming'
      case 3: // Medical Review
        if (clientData.medicalReviewStatus === 'complete') return 'completed'
        if (
          (clientData.labStatus === 'uploaded' || clientData.labStatus === 'received') &&
          clientData.medicalReviewStatus === 'pending'
        )
          return 'current'
        return 'upcoming'
      case 4: // Treatment Plan
        if (clientData.medicalReviewStatus === 'complete') return 'current'
        return 'upcoming'
      default:
        return 'upcoming'
    }
  }

  const steps: Step[] = [
    {
      id: 1,
      title: 'Finalize Paperwork',
      icon: Mail,
      status: getStepStatus(1),
      description: 'Check your inbox for intake forms',
    },
    {
      id: 2,
      title: 'Labs',
      icon: Microscope,
      status: getStepStatus(2),
      description: 'Blood work and lab results submission',
    },
    {
      id: 3,
      title: 'Medical Review',
      icon: ClipboardCheck,
      status: getStepStatus(3),
      description: 'Provider reviews your information',
    },
    {
      id: 4,
      title: 'Treatment Plan',
      icon: Pill,
      status: getStepStatus(4),
      description: 'Receive your personalized treatment plan',
    },
  ]

  // Get current step for "What's Next" card
  const currentStep = steps.find((step) => step.status === 'current') || steps[0]

  const getWhatsNextContent = () => {
    switch (currentStep.id) {
      case 1:
        return {
          title: 'Check Your Inbox',
          description:
            'We\'ve sent your intake paperwork to your email via Practice Better, your patient portal. Complete your medical history forms and consent documents to move forward with treatment.',
          actions: [
            'Check your email for an invitation from Practice Better',
            'Create your Practice Better account if prompted',
            'Complete the intake forms and consent documents',
            'You\'ll be notified once your paperwork is received',
          ],
          estimatedTime: '15-20 minutes',
          ctaText: '',
          ctaLink: '',
        }
      case 2:
        return {
          title: 'Get Your Labs Done',
          description:
            'Your lab requisition has been sent to your email. Visit any Quest Diagnostics or LabCorp location to complete your blood work.',
          actions: [
            'Check your email for the lab requisition',
            'Fast for 8-12 hours before your appointment',
            'Visit a Quest or LabCorp location near you',
            'Results typically available in 3-5 business days',
          ],
          estimatedTime: 'Results in 3-5 days',
          ctaText: 'View Lab Requisition',
          ctaLink: '/client-portal/labs',
        }
      case 3:
        return {
          title: 'Medical Review in Progress',
          description:
            "Our medical team is currently reviewing your lab results and medical history. You'll be notified once the review is complete.",
          actions: [
            'Your provider is reviewing your lab results',
            'We may reach out if additional information is needed',
            'Typical review time is 2-3 business days',
            "You'll receive an email once the review is complete",
          ],
          estimatedTime: '2-3 business days',
          ctaText: 'View Lab Results',
          ctaLink: '/client-portal/labs',
        }
      case 4:
        return {
          title: 'Your Treatment Plan is Ready!',
          description:
            'Congratulations! Your provider has approved your treatment plan. Review your personalized protocol and place your first order.',
          actions: [
            'Review your treatment protocol details',
            'Watch the instructional videos',
            'Place your first medication order',
            'Schedule your follow-up appointment',
          ],
          estimatedTime: 'Ready now',
          ctaText: 'View Treatment Plan',
          ctaLink: '/client-portal/treatment-plan',
        }
      default:
        return {
          title: 'Welcome to StrengthRX',
          description: 'Get started with your wellness journey.',
          actions: ['Complete your profile'],
          estimatedTime: '10 minutes',
          ctaText: 'Get Started',
          ctaLink: '/client-portal',
        }
    }
  }

  const whatsNext = getWhatsNextContent()

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[400px] -top-[200px] h-[800px] w-[800px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
        <div className="absolute -right-[300px] top-[400px] h-[600px] w-[600px] rounded-full bg-primary-600/[0.03] blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative border-b border-white/[0.06]">
        <Container>
          <div className="py-8 sm:py-10">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-500">
              Welcome back
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {clientData.firstName}
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Member since{' '}
              {new Date(clientData.memberSince).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </Container>
      </div>

      <Container className="relative py-8">
        {/* Journey Progress Steps */}
        <div className="mb-10">
          <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Your Journey to Treatment
          </h2>

          {/* Desktop Steps */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-[12.5%] right-[12.5%] top-8 h-px bg-white/[0.08]">
                <div
                  className="h-full bg-blue-500 transition-all duration-700 ease-out"
                  style={{
                    width: `${(steps.filter((s) => s.status === 'completed').length / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-4 gap-4">
                {steps.map((step) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                          step.status === 'completed'
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                            : step.status === 'current'
                              ? 'border-blue-500/60 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                              : 'border-white/[0.08] bg-white/[0.03] text-neutral-600'
                        }`}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-7 w-7" />
                        ) : (
                          <Icon className="h-7 w-7" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="mt-4 text-center">
                        <h3
                          className={`text-sm font-semibold ${
                            step.status === 'upcoming' ? 'text-neutral-600' : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-1 max-w-[160px] text-xs leading-relaxed ${
                            step.status === 'upcoming' ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                        >
                          {step.description}
                        </p>
                        {step.status === 'current' && (
                          <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                            Current Step
                          </span>
                        )}
                        {step.status === 'completed' && (
                          <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Steps */}
          <div className="md:hidden">
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      step.status === 'completed'
                        ? 'border-emerald-500/20 bg-emerald-500/[0.04]'
                        : step.status === 'current'
                          ? 'border-blue-500/30 bg-blue-500/[0.06]'
                          : 'border-white/[0.06] bg-white/[0.02]'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        step.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : step.status === 'current'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-white/[0.04] text-neutral-600'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className={`text-sm font-semibold ${step.status === 'upcoming' ? 'text-neutral-600' : 'text-white'}`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs ${step.status === 'upcoming' ? 'text-neutral-600' : 'text-neutral-400'}`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Status */}
                    {step.status === 'current' && (
                      <span className="flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                      </span>
                    )}
                    {step.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* What's Next Card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-400" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-white">What&apos;s Next?</h2>
            </div>
            {whatsNext.estimatedTime && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-3 py-1 text-xs text-neutral-400">
                <Clock className="h-3.5 w-3.5" />
                {whatsNext.estimatedTime}
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="px-6 py-6 md:px-8">
            <h3 className="mb-2 text-xl font-semibold text-white">{whatsNext.title}</h3>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-neutral-400">
              {whatsNext.description}
            </p>

            <div className="mb-6 space-y-2.5">
              {whatsNext.actions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-white/[0.02] px-4 py-2.5"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <span className="text-xs font-semibold text-blue-400">{index + 1}</span>
                  </div>
                  <span className="text-sm text-neutral-300">{action}</span>
                </div>
              ))}
            </div>

            {whatsNext.ctaText && (
              <a
                href={whatsNext.ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500"
              >
                {whatsNext.ctaText}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <button className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div>
              <h3 className="text-sm font-semibold text-white">Schedule Appointment</h3>
              <p className="text-xs text-neutral-500">Book a consultation</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/15">
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
          </button>

          <button className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div>
              <h3 className="text-sm font-semibold text-white">Contact Support</h3>
              <p className="text-xs text-neutral-500">We&apos;re here to help</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/15">
              <MessageCircle className="h-4 w-4 text-blue-400" />
            </div>
          </button>

          <button className="group flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
            <div>
              <h3 className="text-sm font-semibold text-white">View Documents</h3>
              <p className="text-xs text-neutral-500">Access your files</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/15">
              <FileText className="h-4 w-4 text-blue-400" />
            </div>
          </button>
        </div>
      </Container>
    </div>
  )
}

// ─── Active Dashboard View (for onboarded clients) ──────────────────────────

function ActiveDashboardView({ clientData }: { clientData: ClientPortalData }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-amber-400" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  const latestWellness = progressData[progressData.length - 1].wellness
  const latestEnergy = progressData[progressData.length - 1].energy
  const wellnessChange = latestWellness - progressData[0].wellness
  const energyChange = latestEnergy - progressData[0].energy

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[400px] -top-[200px] h-[800px] w-[800px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
        <div className="absolute -right-[300px] top-[400px] h-[600px] w-[600px] rounded-full bg-primary-600/[0.03] blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative border-b border-white/[0.06]">
        <Container>
          <div className="flex items-end justify-between py-8 sm:py-10">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-500">
                Welcome back
              </p>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {clientData.firstName} {clientData.lastName}
              </h1>
              <p className="mt-1.5 text-sm text-neutral-500">
                Member since{' '}
                {new Date(clientData.memberSince).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button className="hidden items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100 sm:flex">
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </button>
          </div>
        </Container>
      </div>

      <Container className="relative py-8">
        {/* Quick Status Cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Treatment Status */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Treatment Status
                </p>
                <p className="mt-1.5 text-2xl font-bold text-emerald-400">Active</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <HeartPulse className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400/70">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>On track</span>
            </div>
          </div>

          {/* Medical Review */}
          <div
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all ${
              clientData.medicalReviewStatus === 'complete'
                ? 'border-emerald-500/20 bg-emerald-500/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Medical Review
                </p>
                <p
                  className={`mt-1.5 text-2xl font-bold ${
                    clientData.medicalReviewStatus === 'complete'
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {clientData.medicalReviewStatus === 'complete'
                    ? 'Approved'
                    : clientData.medicalReviewStatus === 'denied'
                      ? 'Denied'
                      : 'Pending'}
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Paperwork */}
          <div
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all ${
              clientData.paperworkStatus === 'completed'
                ? 'border-emerald-500/20 bg-emerald-500/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Paperwork
                </p>
                <p
                  className={`mt-1.5 text-2xl font-bold ${
                    clientData.paperworkStatus === 'completed' ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {clientData.paperworkStatus === 'completed'
                    ? 'Complete'
                    : clientData.paperworkStatus === 'in_progress'
                      ? 'In Progress'
                      : 'Not Started'}
                </p>
              </div>
              <div
                className={`rounded-xl p-2.5 ${
                  clientData.paperworkStatus === 'completed'
                    ? 'bg-emerald-500/10'
                    : 'bg-blue-500/10'
                }`}
              >
                <FileText
                  className={`h-5 w-5 ${
                    clientData.paperworkStatus === 'completed'
                      ? 'text-emerald-400'
                      : 'text-blue-400'
                  }`}
                />
              </div>
            </div>
            {clientData.paperworkStatus === 'completed' && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400/70">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>All documents submitted</span>
              </div>
            )}
          </div>

          {/* Lab Results */}
          <div
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all ${
              clientData.labStatus === 'received' || clientData.labStatus === 'uploaded'
                ? 'border-emerald-500/20 bg-emerald-500/[0.06] hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Lab Results
                </p>
                <p
                  className={`mt-1.5 text-2xl font-bold ${
                    clientData.labStatus === 'received' || clientData.labStatus === 'uploaded'
                      ? 'text-emerald-400'
                      : 'text-white'
                  }`}
                >
                  {clientData.labStatus === 'not_ordered'
                    ? 'Not Ordered'
                    : clientData.labStatus === 'ordered'
                      ? 'Ordered'
                      : clientData.labStatus === 'received'
                        ? 'Received'
                        : 'Uploaded'}
                </p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div>
              <h3 className="font-heading text-base font-semibold text-white">Your Progress</h3>
              <p className="mt-0.5 text-xs text-neutral-500">6-week treatment overview</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-xs text-neutral-400">Wellness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-neutral-400">Energy</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Score summary */}
            <div className="mb-6 flex gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{latestWellness}</p>
                  <p className="text-[11px] text-emerald-400">+{wellnessChange} pts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{latestEnergy}</p>
                  <p className="text-[11px] text-emerald-400">+{energyChange} pts</p>
                </div>
              </div>
            </div>

            <ProgressChart data={progressData} />
          </div>
        </div>

        {/* Treatment Schedule */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h3 className="font-heading text-base font-semibold text-white">Treatment Schedule</h3>
            <p className="mt-0.5 text-xs text-neutral-500">Your prescribed medication schedule</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {treatmentSchedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10">
                    <Pill className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.day}</p>
                    <p className="text-xs text-neutral-500">{item.medication}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{item.dosage}</p>
                  <p className="text-xs text-neutral-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] bg-blue-500/[0.04] px-6 py-3.5">
            <p className="text-xs text-blue-300/80">
              <strong className="text-blue-300">Reminder:</strong> Always take your medication as
              prescribed. Contact your provider if you have any questions or concerns.
            </p>
          </div>
        </div>

        {/* Two-column grid: Appointments + Documents */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appointment History */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h3 className="font-heading text-base font-semibold text-white">
                Appointment History
              </h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {appointmentHistory.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{appointment.type}</p>
                    <p className="text-xs text-neutral-500">{appointment.provider}</p>
                  </div>
                  <div className="mx-4 text-xs text-neutral-500">
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(appointment.status)}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span className="capitalize">{appointment.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <h3 className="font-heading text-base font-semibold text-white">Documents</h3>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/[0.08]">
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                      <FileText className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-neutral-500">
                        {doc.type} &middot;{' '}
                        {new Date(doc.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-neutral-300">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                <Shield className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-white">Need Help?</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Our support team is here to assist you with any questions about your treatment.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500">
                <Phone className="h-4 w-4" />
                Contact Support
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.08]">
                <MessageCircle className="h-4 w-4" />
                View FAQs
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Schedule Button */}
        <div className="mt-6 sm:hidden">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100">
            <Calendar className="h-4 w-4" />
            Schedule Appointment
          </button>
        </div>
      </Container>
    </div>
  )
}
