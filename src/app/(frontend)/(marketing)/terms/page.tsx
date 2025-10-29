import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

export const metadata: Metadata = {
  title: 'Terms of Service | StrengthRX',
  description: 'StrengthRX terms of service outlining the terms and conditions for using our telehealth wellness optimization services.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="md">
        <div className="prose max-w-none">
          <Heading as="h1" size="4xl" className="mb-8">
            Terms of Service
          </Heading>
          
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> October 28, 2025<br />
            <strong>Last Updated:</strong> October 28, 2025
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using StrengthRX services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
          </p>

          <h2>2. Description of Services</h2>
          <p>
            StrengthRX provides telehealth wellness optimization services, including but not limited to:
          </p>
          <ul>
            <li>Virtual medical consultations</li>
            <li>Hormone replacement therapy (HRT/TRT)</li>
            <li>Peptide therapy protocols</li>
            <li>Weight management programs</li>
            <li>Performance optimization strategies</li>
            <li>Laboratory testing coordination</li>
          </ul>

          <h2>3. Medical Disclaimer</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 mb-0">
              <strong>Important:</strong> StrengthRX services are for educational and informational purposes and do not replace the relationship between you and your primary care physician. Our services are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare provider before making any medical decisions.
            </p>
          </div>

          <h2>4. Eligibility and Patient Requirements</h2>
          <p>To use our services, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Reside in a state where we are licensed to provide services</li>
            <li>Provide accurate and complete health information</li>
            <li>Have access to reliable internet and video calling capabilities</li>
            <li>Agree to follow prescribed treatment protocols</li>
          </ul>

          <h2>5. Telehealth Consent and Limitations</h2>
          <p>By using our telehealth services, you acknowledge and agree that:</p>
          <ul>
            <li>Telehealth has certain limitations compared to in-person care</li>
            <li>Technology failures may occur during consultations</li>
            <li>Emergency situations require immediate in-person medical attention</li>
            <li>You will seek immediate medical care for any emergency conditions</li>
            <li>Video consultations may be recorded for quality assurance (with your consent)</li>
          </ul>

          <h2>6. Payment Terms</h2>
          <p>
            Our services operate on a direct-pay model. By using our services, you agree to:
          </p>
          <ul>
            <li>Pay all fees as outlined in your treatment agreement</li>
            <li>Provide accurate payment information</li>
            <li>Notify us immediately of any billing disputes</li>
            <li>Understand that services may be suspended for non-payment</li>
          </ul>

          <h2>7. Prescription Medications</h2>
          <p>
            If prescribed medications, you acknowledge that:
          </p>
          <ul>
            <li>Prescriptions are based on your reported health information</li>
            <li>You will use medications only as directed</li>
            <li>You will report any adverse reactions immediately</li>
            <li>You are responsible for prescription costs and logistics</li>
            <li>Controlled substances have additional monitoring requirements</li>
          </ul>

          <h2>8. Privacy and Confidentiality</h2>
          <p>
            We are committed to protecting your privacy in accordance with HIPAA and other applicable laws. Please review our Privacy Policy for detailed information about how we handle your personal health information.
          </p>

          <h2>9. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Providing accurate and complete health information</li>
            <li>Attending scheduled appointments or providing adequate notice of cancellation</li>
            <li>Following prescribed treatment protocols</li>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>Using our platform and services in compliance with all applicable laws</li>
          </ul>

          <h2>10. Prohibited Uses</h2>
          <p>You may not use our services to:</p>
          <ul>
            <li>Obtain controlled substances for illicit purposes</li>
            <li>Provide false or misleading health information</li>
            <li>Share your account with other individuals</li>
            <li>Attempt to circumvent our security measures</li>
            <li>Use services for any illegal or unauthorized purpose</li>
          </ul>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, StrengthRX and its providers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless StrengthRX from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
          </p>

          <h2>13. Termination</h2>
          <p>
            Either party may terminate the service relationship at any time. StrengthRX reserves the right to terminate services for violation of these Terms or for any reason deemed necessary for patient safety or legal compliance.
          </p>

          <h2>14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Arizona, without regard to conflict of law principles.
          </p>

          <h2>15. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of significant changes, and your continued use of our services constitutes acceptance of the modified Terms.
          </p>

          <h2>16. Emergency Protocols</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 mb-2">
              <strong>Emergency Situations:</strong> If you are experiencing a medical emergency, do not use our telehealth services. Instead:
            </p>
            <ul className="text-red-800 mb-0">
              <li>Call 911 immediately</li>
              <li>Go to your nearest emergency room</li>
              <li>Contact your local emergency services</li>
            </ul>
          </div>

          <h2>17. Contact Information</h2>
          <p>
            For questions about these Terms or our services, please contact us:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2"><strong>StrengthRX</strong></p>
            <p className="mb-2">Email: <a href="mailto:Yourstrengthrx@gmail.com" className="text-primary hover:underline">Yourstrengthrx@gmail.com</a></p>
            <p className="mb-2">Phone: <a href="tel:602-708-6487" className="text-primary hover:underline">602-708-6487</a></p>
            <p>Address: Phoenix, AZ</p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Legal Notice:</strong> These are sample terms of service for demonstration purposes. In a real application, you should work with qualified legal counsel to ensure compliance with all applicable laws and regulations, including state-specific telehealth requirements.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}