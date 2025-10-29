import { Container } from '@/components/ui/Container'
import Link from 'next/link'

const footerLinks = {
  company: [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Locations', href: '/locations' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

export function SiteFooter() {
  return (
    <footer className="bg-neutral-900 text-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">StrengthRX</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-sm">
              Strong body, strong minds, destroying mediocrity. Professional wellness optimization
              through TRT, peptides, and performance protocols.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Phoenix, AZ</p>
              <p>
                📞{' '}
                <a href="tel:602-708-6487" className="hover:text-white transition-colors">
                  602-708-6487
                </a>
              </p>
              <p>
                ✉️{' '}
                <a
                  href="mailto:Yourstrengthrx@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Yourstrengthrx@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} StrengthRX. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">Founded February 2022</p>
        </div>
      </Container>
    </footer>
  )
}
