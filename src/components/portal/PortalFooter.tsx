import Link from 'next/link'
import NextImage from 'next/image'
import { Mail, Phone, Shield, FileText } from 'lucide-react'

export function PortalFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center space-x-3">
              <NextImage
                src="/Logo.png"
                alt="StrengthRX"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-neutral-500">
              Professional wellness optimization through TRT, peptides, and performance protocols.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="flex items-center space-x-2.5 text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <a
                  href="tel:+16027086487"
                  className="flex items-center space-x-2.5 text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  <span>+1 (602) 708-6487</span>
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="flex items-center space-x-2.5 text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center space-x-2.5 text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Security & Privacy
            </h3>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
              <div className="mb-2 flex items-center space-x-2 text-emerald-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold">HIPAA Compliant</span>
              </div>
              <p className="text-xs leading-relaxed text-neutral-500">
                Your personal health information is encrypted and protected in compliance with HIPAA
                regulations.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/[0.06] pt-6">
          <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0">
            <p className="text-xs text-neutral-600">
              &copy; {currentYear} StrengthRX. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/"
                className="text-xs text-neutral-600 transition-colors hover:text-neutral-400"
              >
                Back to Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
