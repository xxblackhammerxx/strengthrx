'use client'

import { useState } from 'react'
import { Link2, Check, Copy } from 'lucide-react'

interface ReferralLinkCardProps {
  referralCode: string
  baseUrl?: string
}

export function ReferralLinkCard({ referralCode, baseUrl }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false)

  // Use window.location.origin if baseUrl not provided
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const referralLink = `${origin}/signup/client?ref=${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/[0.04]">
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/15 p-2.5">
            <Link2 className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="font-heading text-base font-semibold text-white">Your Referral Link</h3>
        </div>

        <p className="mb-5 text-sm text-neutral-400">
          Share this link with potential clients. When they sign up using this link, you&apos;ll
          automatically receive credit for the referral.
        </p>

        <div className="mb-4">
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-neutral-500">
            Referral Code
          </label>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-mono text-lg font-bold tracking-wider text-white">
            {referralCode}
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-neutral-500">
            Full Link
          </label>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <p className="truncate font-mono text-sm text-neutral-400">{referralLink}</p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-500/10 bg-blue-500/[0.03] px-6 py-3.5">
        <p className="text-xs text-blue-300/70">
          <strong className="text-blue-300/90">Tip:</strong> Share this link on social media, in
          your email signature, or send it directly to potential clients. The referral will be
          tracked automatically!
        </p>
      </div>
    </div>
  )
}
