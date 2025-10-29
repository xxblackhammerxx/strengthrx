import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

export const metadata: Metadata = {
  title: 'Privacy Policy | StrengthRX',
  description: 'StrengthRX privacy policy outlining how we collect, use, and protect your personal health information.',
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="md">
        <div className="prose max-w-none">
          <Heading as="h1" size="4xl" className="mb-8">
            Privacy Policy
          </Heading>
          
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> October 28, 2025<br />
            <strong>Last Updated:</strong> October 28, 2025
          </p>

          <h2>1. Introduction</h2>
          <p>
            StrengthRX ("we," "our," or "us") is committed to protecting your privacy and personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our telehealth services and website.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <ul>
            <li>Name, address, phone number, and email address</li>
            <li>Date of birth and gender</li>
            <li>Health insurance information</li>
            <li>Payment and billing information</li>
          </ul>

          <h3>Health Information</h3>
          <ul>
            <li>Medical history and current medications</li>
            <li>Symptoms, health goals, and treatment preferences</li>
            <li>Laboratory results and diagnostic information</li>
            <li>Treatment plans and clinical notes</li>
            <li>Consultation recordings (with consent)</li>
          </ul>

          <h3>Technical Information</h3>
          <ul>
            <li>IP address, browser type, and device information</li>
            <li>Website usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide medical consultations and treatment services</li>
            <li>Process payments and manage billing</li>
            <li>Communicate about appointments and treatment plans</li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Improve our services and website functionality</li>
            <li>Send educational materials and service updates (with consent)</li>
          </ul>

          <h2>4. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Healthcare Providers:</strong> Licensed physicians and medical staff involved in your care</li>
            <li><strong>Service Providers:</strong> Third-party vendors who assist with our operations (e.g., laboratory services, payment processing)</li>
            <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
            <li><strong>Emergency Situations:</strong> To prevent serious harm to you or others</li>
          </ul>

          <h2>5. HIPAA Compliance</h2>
          <p>
            As a healthcare provider, we comply with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable privacy laws. Your protected health information (PHI) is handled according to HIPAA requirements, and you have specific rights regarding your health information.
          </p>

          <h2>6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your information, including:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure, HIPAA-compliant communication platforms</li>
            <li>Regular security assessments and updates</li>
            <li>Employee training on privacy and security practices</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>

          <h2>7. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive copies of your health information</li>
            <li>Request corrections to your health information</li>
            <li>Request restrictions on the use of your information</li>
            <li>Receive confidential communications</li>
            <li>File a complaint about our privacy practices</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            Our website uses cookies and similar technologies to improve functionality and analyze usage. You can control cookie settings through your browser preferences.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
          </p>

          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of significant changes by posting the updated policy on our website and updating the effective date.
          </p>

          <h2>12. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2"><strong>StrengthRX</strong></p>
            <p className="mb-2">Email: <a href="mailto:Yourstrengthrx@gmail.com" className="text-primary hover:underline">Yourstrengthrx@gmail.com</a></p>
            <p className="mb-2">Phone: <a href="tel:602-708-6487" className="text-primary hover:underline">602-708-6487</a></p>
            <p>Address: Phoenix, AZ</p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Notice:</strong> This is a sample privacy policy for demonstration purposes. In a real application, you should work with legal counsel to ensure compliance with all applicable privacy laws and regulations.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}