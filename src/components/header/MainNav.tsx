'use client'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Peptides', href: '/peptides' },
  { name: 'Weight Loss', href: '/weight-loss' },
  { name: 'Sexual Wellness', href: '/sexual-wellness' },
  { name: 'Hormone Therapy', href: '/hormone-therapy' },
  { name: 'About Us', href: '/about' },
]

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-700">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src={'/logo.png'} alt="logo image" width={120} height={60} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <a href="tel:602-708-6487">Call Now</a>
            </Button>
            <Button asChild>
              <Link href="/contact">Book Consult</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded="false"
            aria-label="Toggle navigation menu"
          >
            <svg
              className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-neutral-700 bg-neutral-900">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-white hover:text-accent hover:bg-neutral-800 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="ghost" className="w-full" asChild>
                  <a href="tel:602-708-6487" onClick={() => setIsOpen(false)}>
                    Call Now
                  </a>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Book Consult
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
