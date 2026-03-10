'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { User, LogOut, Menu, X, Home, Users, UserCheck, FileText, Image } from 'lucide-react'

export function PortalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine portal base path
  const portalBase = pathname?.startsWith('/admin-portal')
    ? '/admin-portal'
    : pathname?.startsWith('/partner-portal')
      ? '/partner-portal'
      : '/client-portal'

  const handleLogout = useCallback(async () => {
    try {
      // Clear the auth cookie
      document.cookie = 'payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [router])

  const handleAccount = useCallback(() => {
    router.push(`${portalBase}/account`)
  }, [router, portalBase])

  // Determine portal type based on pathname
  const isAdmin = pathname?.startsWith('/admin-portal')
  const isPartner = pathname?.startsWith('/partner-portal')
  const isClient = pathname?.startsWith('/client-portal')

  const getPortalName = () => {
    if (isAdmin) return 'Admin Portal'
    if (isPartner) return 'Partner Portal'
    if (isClient) return 'Client Portal'
    return 'Portal'
  }

  const getPortalLinks = () => {
    if (isAdmin) {
      return [
        { href: '/admin-portal', label: 'Dashboard', icon: Home },
        { href: '/admin-portal/clients', label: 'Clients', icon: Users },
        { href: '/admin-portal/partners', label: 'Partners', icon: UserCheck },
        { href: '/admin-portal/reports', label: 'Reports', icon: FileText },
      ]
    }
    if (isPartner) {
      return [
        { href: '/partner-portal', label: 'Dashboard', icon: Home },
        { href: '/partner-portal/referrals', label: 'Referrals', icon: Users },
        { href: '/partner-portal/earnings', label: 'Earnings', icon: FileText },
        { href: '/partner-portal/marketing', label: 'Marketing', icon: Image },
      ]
    }
    if (isClient) {
      return [
        { href: '/client-portal', label: 'Dashboard', icon: Home },
        { href: '/client-portal/appointments', label: 'Appointments', icon: FileText },
        { href: '/client-portal/documents', label: 'Documents', icon: FileText },
      ]
    }
    return []
  }

  const links = getPortalLinks()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Portal Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-24 w-24">
                <NextImage
                  src="/logo.png"
                  alt="StrengthRX Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="text-xs font-medium tracking-widest uppercase text-neutral-500">
                  {getPortalName()}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleAccount}
              className="hidden cursor-pointer rounded-lg p-2 text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-neutral-300 md:block"
              title="Account"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden cursor-pointer rounded-lg p-2 text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400 md:block"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/[0.06] md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.06] bg-neutral-950/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-3 pb-4 pt-3">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <div className="my-2 border-t border-white/[0.06]" />
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleAccount()
              }}
              className="flex w-full cursor-pointer items-center space-x-3 rounded-lg px-3 py-2.5 text-base font-medium text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
            >
              <User className="h-5 w-5" />
              <span>Account</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleLogout()
              }}
              className="flex w-full cursor-pointer items-center space-x-3 rounded-lg px-3 py-2.5 text-base font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
