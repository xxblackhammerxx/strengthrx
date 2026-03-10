'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import {
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  Video,
  Share2,
  Mail,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

// Mock marketing materials - replace with real data from CMS
const socialMediaPosts = [
  {
    id: 1,
    platform: 'Instagram',
    title: 'Transformation Story',
    description: 'Before/After template with testimonial',
    imageUrl: '/marketing/instagram-transformation.jpg',
    caption:
      'Ready to optimize your health? Join hundreds who have transformed their lives with StrengthRX. DM me to get started! #TRT #Wellness #Optimization',
  },
  {
    id: 2,
    platform: 'Facebook',
    title: 'Service Overview',
    description: 'Comprehensive service breakdown',
    imageUrl: '/marketing/facebook-services.jpg',
    caption:
      'StrengthRX offers comprehensive hormone optimization, peptide therapy, and personalized treatment plans. Ask me how to get started today!',
  },
  {
    id: 3,
    platform: 'Instagram Story',
    title: 'Quick Stats',
    description: 'Vertical format with key benefits',
    imageUrl: '/marketing/instagram-story.jpg',
    caption: 'Swipe up to learn more!',
  },
]

const downloadableAssets = [
  {
    id: 1,
    category: 'Brochures',
    items: [
      {
        name: 'TRT Information Brochure',
        format: 'PDF',
        size: '2.4 MB',
        description: 'Comprehensive guide to testosterone replacement therapy',
      },
      {
        name: 'Peptide Therapy Overview',
        format: 'PDF',
        size: '1.8 MB',
        description: 'Benefits and process of peptide therapy',
      },
      {
        name: 'Getting Started Guide',
        format: 'PDF',
        size: '3.1 MB',
        description: 'Step-by-step onboarding process for new clients',
      },
    ],
  },
  {
    id: 2,
    category: 'Logos & Brand Assets',
    items: [
      {
        name: 'StrengthRX Logo Pack',
        format: 'ZIP',
        size: '5.2 MB',
        description: 'PNG, SVG, and vector formats in various sizes',
      },
      {
        name: 'Brand Style Guide',
        format: 'PDF',
        size: '4.7 MB',
        description: 'Colors, fonts, and brand usage guidelines',
      },
    ],
  },
  {
    id: 3,
    category: 'Video Content',
    items: [
      {
        name: 'Explainer Video (60s)',
        format: 'MP4',
        size: '45 MB',
        description: 'Short overview of StrengthRX services',
      },
      {
        name: 'Patient Testimonials',
        format: 'MP4',
        size: '78 MB',
        description: 'Compilation of success stories',
      },
    ],
  },
]

const emailTemplates = [
  {
    id: 1,
    subject: 'Transform Your Health with StrengthRX',
    preview:
      "Hi [Name], I wanted to share something that's been a game-changer for many of my clients...",
    useCase: 'Initial outreach to potential clients',
  },
  {
    id: 2,
    subject: 'Your Questions About TRT Answered',
    preview: 'Many people ask me about hormone optimization. Here are the most common questions...',
    useCase: 'Educational follow-up email',
  },
  {
    id: 3,
    subject: 'Special Consultation Offer',
    preview: "I'm offering a limited-time complimentary consultation for StrengthRX services...",
    useCase: 'Promotional campaign',
  },
]

const textTemplates = [
  {
    id: 1,
    title: 'Quick Introduction',
    message:
      "Hey [Name]! I've been working with StrengthRX for hormone optimization and it's been incredible. Would love to share more if you're interested in improving your energy, strength, and overall wellness!",
  },
  {
    id: 2,
    title: 'Follow-up After Gym',
    message:
      "Great workout today! By the way, have you ever looked into TRT or hormone optimization? I partner with StrengthRX and they've really helped take my training to the next level. Happy to chat about it!",
  },
  {
    id: 3,
    title: 'Response to Health Questions',
    message:
      "I actually work with StrengthRX for that! They specialize in hormone therapy, peptides, and wellness optimization. I can send you my referral link if you want to check out a consultation - they're amazing!",
  },
]

function FormatBadge({ format }: { format: string }) {
  const colorMap: Record<string, string> = {
    PDF: 'bg-red-500/10 text-red-400 border-red-500/20',
    ZIP: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    MP4: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }

  return (
    <span
      className={`inline-flex rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${colorMap[format] || 'bg-white/[0.06] text-neutral-400 border-white/[0.1]'}`}
    >
      {format}
    </span>
  )
}

function FormatIcon({ format }: { format: string }) {
  const iconClass = 'h-5 w-5'
  switch (format) {
    case 'MP4':
      return <Video className={`${iconClass} text-blue-400`} />
    case 'ZIP':
      return <ImageIcon className={`${iconClass} text-violet-400`} />
    default:
      return <FileText className={`${iconClass} text-red-400`} />
  }
}

export default function MarketingMaterialsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = (fileName: string) => {
    console.log('Downloading:', fileName)
    alert(`Download started: ${fileName}\n\nIn production, this would download the actual file.`)
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[400px] top-[100px] h-[700px] w-[700px] rounded-full bg-blue-600/[0.03] blur-[120px]" />
        <div className="absolute -right-[300px] top-[800px] h-[600px] w-[600px] rounded-full bg-violet-600/[0.03] blur-[120px]" />
      </div>

      {/* Page Header */}
      <div className="relative border-b border-white/[0.06]">
        <Container>
          <div className="py-8 sm:py-10">
            <Link
              href="/partner-portal"
              className="mb-4 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </Link>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Marketing Materials
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Download and share professional content to help grow your referrals
            </p>
          </div>
        </Container>
      </div>

      <Container className="relative py-8">
        {/* Social Media Posts */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <Share2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Social Media Posts</h2>
              <p className="text-xs text-neutral-500">Ready-to-share content for your platforms</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {socialMediaPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
              >
                {/* Image placeholder */}
                <div className="relative aspect-square bg-white/[0.02]">
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-neutral-700" />
                  </div>
                  <div className="absolute right-3 top-3">
                    <span className="rounded-lg border border-white/[0.1] bg-neutral-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300 backdrop-blur-sm">
                      {post.platform}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{post.title}</h3>
                    <button
                      onClick={() => handleDownload(post.title)}
                      className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-neutral-300"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4 text-xs text-neutral-500">{post.description}</p>

                  {/* Caption */}
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      Suggested Caption
                    </p>
                    <p className="text-xs leading-relaxed text-neutral-400">{post.caption}</p>
                    <button
                      onClick={() => handleCopy(post.caption, `post-${post.id}`)}
                      className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                      {copiedId === `post-${post.id}` ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Caption
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Downloadable Assets */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <FileText className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Downloadable Assets</h2>
              <p className="text-xs text-neutral-500">
                Brochures, videos, and brand materials for your clients
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {downloadableAssets.map((category) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
              >
                <div className="border-b border-white/[0.06] px-6 py-4">
                  <h3 className="font-heading text-base font-semibold text-white">
                    {category.category}
                  </h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                          <FormatIcon format={item.format} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                          <p className="text-xs text-neutral-500">{item.description}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <FormatBadge format={item.format} />
                            <span className="text-[11px] text-neutral-600">{item.size}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(item.name)}
                        className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-300 transition-colors hover:bg-white/[0.08]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email Templates */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2.5">
              <Mail className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Email Templates</h2>
              <p className="text-xs text-neutral-500">
                Pre-written emails to send to potential clients
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {emailTemplates.map((template) => (
              <div
                key={template.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{template.subject}</h3>
                      <p className="mt-0.5 text-xs text-neutral-500">{template.useCase}</p>
                    </div>
                    <button
                      onClick={() =>
                        handleCopy(
                          `Subject: ${template.subject}\n\n${template.preview}...`,
                          `email-${template.id}`,
                        )
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
                        copiedId === `email-${template.id}`
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/[0.1] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {copiedId === `email-${template.id}` ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Template
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-sm leading-relaxed text-neutral-400">{template.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Text/SMS Templates */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2.5">
              <MessageSquare className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Text Message Templates
              </h2>
              <p className="text-xs text-neutral-500">Quick messages for SMS or direct messaging</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {textTemplates.map((template) => (
              <div
                key={template.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all hover:border-white/[0.12]"
              >
                <div className="flex-1 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-white">{template.title}</h3>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-xs leading-relaxed text-neutral-400">{template.message}</p>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] px-5 py-3">
                  <button
                    onClick={() => handleCopy(template.message, `text-${template.id}`)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                      copiedId === `text-${template.id}`
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {copiedId === `text-${template.id}` ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h2 className="font-heading text-xl font-bold text-white">
                Marketing Best Practices
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Guidelines for effective and compliant marketing
              </p>
            </div>
            <div className="grid gap-px bg-white/[0.04] md:grid-cols-2">
              <div className="bg-neutral-950 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-400">Do&apos;s</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Always include your unique referral link',
                    'Share authentic personal testimonials',
                    'Focus on benefits and transformation',
                    'Engage with comments and questions',
                    'Post consistently on your platforms',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                      <span className="text-sm text-neutral-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-neutral-950 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <h3 className="text-sm font-semibold text-red-400">Don&apos;ts</h3>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Make medical claims without disclaimers',
                    'Share client information without consent',
                    'Use aggressive or pushy language',
                    'Guarantee specific results',
                    'Spam or over-post on social media',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/50" />
                      <span className="text-sm text-neutral-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  )
}
