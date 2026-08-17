import type { Metadata } from 'next'
import Link from 'next/link'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { formatStateNames } from '@/lib/licensed-states'

/**
 * ── STATUS: accurate, but not yet reviewed by counsel ───────────────────────
 *
 * This replaced a placeholder that had been live for ten months and said, in
 * its own footer, "This is a sample privacy policy for demonstration purposes"
 * — while simultaneously asserting HIPAA compliance and disclosing none of the
 * third parties that actually receive user data.
 *
 * Everything below is written to match what the code genuinely does. Each
 * named recipient corresponds to a real call site:
 *
 *   GoHighLevel      lib/ghl/leads.ts  ← /api/contact, /api/leads, /api/onboarding
 *   Practice Better  lib/practice-better.ts ← /api/onboarding
 *   Meta             lib/meta/capi.ts + components/analytics/MetaPixel.tsx
 *                    — mounted ONLY in app/(landing), never in app/(frontend)
 *   Resend           /api/contact (notification to our own inbox)
 *   reCAPTCHA        both root layouts
 *
 * If you change a data flow, change this page in the same commit. A privacy
 * policy that has drifted from the code is worse than no policy: it converts
 * an engineering detail into an affirmative misrepresentation.
 *
 * Still outstanding, and NOT resolved by this file:
 *   1. Review and sign-off by healthcare regulatory counsel.
 *   2. Confirmation that a BAA is in place with GoHighLevel. Lead data
 *      including Get Started account creations flows there today.
 *   3. Counsel review of the Notice of Privacy Practices at
 *      /notice-of-privacy-practices, which is the HIPAA-facing document.
 */
export const metadata: Metadata = {
  title: 'Privacy Policy | StrengthRX',
  description:
    'How StrengthRX collects, uses, shares, and protects your personal and health information.',
  alternates: {
    canonical: '/privacy',
  },
  // Preserved from the previous version of this page rather than changed as a
  // side effect of the rewrite. Note that noindex does not stop Meta or a
  // 10DLC reviewer from fetching the URL — both reach it directly.
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
            <strong>Effective Date:</strong> August 17, 2026
            <br />
            <strong>Last Updated:</strong> August 17, 2026
          </p>

          <h2>1. Scope of This Policy</h2>
          <p>
            {businessConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates this
            website and provides telehealth services in {formatStateNames()}. This Privacy Policy
            explains what information we collect through our website and marketing, how we use it,
            and who receives it.
          </p>
          <p>
            <strong>Two different sets of rules apply to us, and it matters which one covers you.</strong>{' '}
            Information you give us before you become a patient — for example, submitting a contact
            form or requesting a consultation — is governed by this Privacy Policy. Once you become
            a patient, the medical information we create and maintain about you is Protected Health
            Information under HIPAA and is governed by our{' '}
            <Link href="/notice-of-privacy-practices">Notice of Privacy Practices</Link>, which
            gives you additional rights. Where the two documents differ regarding your health
            information, the Notice of Privacy Practices controls.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>Information you give us directly</h3>
          <ul>
            <li>
              <strong>Contact and consultation requests:</strong> your name, email address, phone
              number, state of residence, and the content of your message.
            </li>
            <li>
              <strong>Account creation:</strong> your name, email address, phone number, date of
              birth, and a password.
            </li>
            <li>
              <strong>Health information you choose to provide:</strong> the wellness goals you
              select and whether you have had recent lab work, along with any history, symptoms, or
              medical details you share during onboarding or a consultation.
            </li>
            <li>
              <strong>Communication preferences:</strong> whether you have agreed to receive text
              messages from us.
            </li>
          </ul>

          <h3>Information collected automatically</h3>
          <ul>
            <li>IP address, browser type, device information, and operating system</li>
            <li>Pages you visit, referring page, and the date and time of your visit</li>
            <li>
              Marketing attribution data, including campaign parameters in the link you arrived on
              (such as <code>utm_source</code> and <code>utm_campaign</code>) and advertising click
              identifiers from Meta and Google
            </li>
            <li>Cookies and similar technologies, described in Section 5</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To respond to your inquiry and schedule consultations</li>
            <li>To determine whether we are licensed to provide services in your state</li>
            <li>To provide, coordinate, and bill for care once you become a patient</li>
            <li>To create and maintain your account and patient records</li>
            <li>
              To send you messages about your care, and — only if you have separately agreed —
              marketing messages, which you can stop at any time
            </li>
            <li>To measure how our advertising performs, subject to the limits in Section 5</li>
            <li>To protect our website from spam, fraud, and abuse</li>
            <li>To comply with our legal and professional obligations</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>
            <strong>We do not sell your personal information, and we do not share it with anyone
            for their own independent marketing purposes.</strong> We do rely on service providers
            to operate, and information is shared with them for that purpose. We disclose the
            specific recipients rather than describing them only in general terms:
          </p>
          <ul>
            <li>
              <strong>Practice Better</strong> — our patient records and telehealth platform. It
              receives your name, contact details, date of birth, and your clinical records.
            </li>
            <li>
              <strong>GoHighLevel</strong> — our customer relationship management system, used to
              manage inquiries, appointments, and follow-up. It receives your name, email address,
              phone number, state, how you found us, and the marketing attribution data described in
              Section 2.
            </li>
            <li>
              <strong>Meta Platforms</strong> — receives advertising measurement data from our
              advertising landing pages only, as described in Section 5.
            </li>
            <li>
              <strong>Resend</strong> — our email delivery provider, used to route your contact form
              submission to our own inbox.
            </li>
            <li>
              <strong>Google</strong> — reCAPTCHA Enterprise receives technical signals from your
              browser to distinguish real visitors from automated abuse.
            </li>
            <li>
              <strong>Laboratories and compounding pharmacies</strong> — receive the information
              necessary to complete lab work or dispense a prescription written for you.
            </li>
            <li>
              <strong>Legal and safety</strong> — we may disclose information when required by law,
              regulation, subpoena, or court order, or to protect the rights, safety, or property of
              our patients, our staff, or the public.
            </li>
            <li>
              <strong>Business transfers</strong> — if our business is acquired or merged,
              information may transfer as part of that transaction, subject to this policy.
            </li>
          </ul>
          <p>
            Where these providers handle Protected Health Information on our behalf, we require a
            Business Associate Agreement obligating them to safeguard it under HIPAA.
          </p>

          <h2>5. Cookies, Tracking, and Advertising</h2>
          <p>
            Our website uses cookies and similar technologies to keep the site working, remember
            your preferences, and understand how visitors arrived. You can control cookies through
            your browser settings, though some features may not work correctly if you block them.
          </p>
          <p>
            <strong>Advertising measurement.</strong> On our advertising landing pages only, we use
            the Meta (Facebook) pixel and Meta&apos;s Conversions API to measure how our ads
            perform. These tools may receive your IP address, browser and device information, the
            page you visited, advertising click identifiers, and — if you submit a form on one of
            those pages — a cryptographically hashed copy of the contact details you entered, so
            that Meta can match your response to the ad you saw.
          </p>
          <p>
            <strong>Where we deliberately do not use them.</strong> We do not place advertising or
            analytics trackers on our patient onboarding flow, on the pages describing specific
            clinical services, or anywhere inside the patient portal.{' '}
            <strong>
              We never transmit your health goals, lab history, symptoms, diagnoses, prescriptions,
              or any other health information to any advertising platform, in any form, including
              hashed or de-identified form.
            </strong>{' '}
            We do not use advertising tools to build audiences based on any health condition or
            treatment.
          </p>
          <p>
            We honor Global Privacy Control and similar browser-level opt-out signals where required
            by applicable law.
          </p>

          <h2>6. Text Messages</h2>
          <p>
            We send text messages only to people who have separately agreed to receive them. Consent
            to receive marketing texts is never a condition of receiving care. You can stop at any
            time by replying STOP. Message and data rates may apply. Full details are in our{' '}
            <Link href="/sms-terms">Messaging Terms</Link>.
          </p>
          <p>
            {/*
              Carrier-mandated phrasing for 10DLC campaign review — asserted by
              tests/int/a2p-consent.int.spec.ts. Reword it and the campaign can
              be rejected. Keep "do not share or sell mobile information" and
              "for marketing purposes" intact.
            */}
            <strong>
              We do not share or sell mobile information, including your phone number and your SMS
              consent, to third parties or affiliates for marketing purposes.
            </strong>{' '}
            Text messaging originator opt-in data is not shared with any third party for their own
            marketing.
          </p>

          <h2>7. Protected Health Information</h2>
          <p>
            As a healthcare provider, we are a covered entity under the Health Insurance Portability
            and Accountability Act. Your Protected Health Information is subject to HIPAA and to our{' '}
            <Link href="/notice-of-privacy-practices">Notice of Privacy Practices</Link>, which
            describes how we may use and disclose it and the specific rights you have — including
            the right to access, amend, and request restrictions on your health information, and to
            receive an accounting of certain disclosures.
          </p>

          <h2>8. Data Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards intended to protect your
            information, including encryption of data in transit and at rest, access limited to
            those who need it to do their job, staff training on privacy and security, and vendor
            agreements requiring comparable protections. No method of transmission or storage is
            completely secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. How Long We Keep Information</h2>
          <p>
            We keep medical records for the period required by the laws of the state in which you
            received care and by professional recordkeeping requirements, which is typically several
            years. Inquiry and marketing records are kept only as long as needed for the purpose
            described in this policy, and then deleted or de-identified.
          </p>

          <h2>10. Your Rights and Choices</h2>
          <p>Regardless of where you live, you may:</p>
          <ul>
            <li>Ask what personal information we hold about you and request a copy</li>
            <li>Ask us to correct information that is inaccurate</li>
            <li>Ask us to delete information, subject to our recordkeeping obligations</li>
            <li>Opt out of marketing emails and text messages at any time</li>
            <li>Ask questions about, or complain about, our privacy practices</li>
          </ul>
          <p>
            <strong>State privacy rights.</strong> Residents of certain states we serve — including
            Colorado, Utah, Iowa, and Nevada — have additional rights under state privacy law, which
            may include the right to confirm whether we process your personal data, to obtain a
            portable copy, to correct or delete it, to opt out of targeted advertising and of any
            sale of personal data, and to appeal a decision we make about your request. Some state
            laws also give specific protections to consumer health data. To exercise any of these
            rights, contact us using the details in Section 13. We will not discriminate against you
            for exercising them. If we deny your request, you may appeal by replying to our
            response, and you may contact your state Attorney General.
          </p>
          <p>
            To verify your identity before we act on a request, we may ask you to confirm
            information we already hold. An authorized agent may submit a request on your behalf
            with written permission.
          </p>

          <h2>11. Children&apos;s Privacy</h2>
          <p>
            Our services are intended for adults 18 and older. We do not knowingly collect personal
            information from anyone under 18. If you believe a minor has provided us information,
            contact us and we will delete it.
          </p>

          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated policy on
            this page and revise the &quot;Last Updated&quot; date above. If we make a material
            change to how we handle your information, we will provide a more prominent notice.
          </p>

          <h2>13. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, want to exercise a privacy right, or
            wish to file a complaint about our privacy practices, contact us:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2">
              <strong>{businessConfig.name}</strong>
            </p>
            <p className="mb-2">
              Privacy Officer: {businessConfig.privacyOfficer.name}
            </p>
            <p className="mb-2">
              Email:{' '}
              <a href={businessConfig.privacyOfficer.href} className="text-primary hover:underline">
                {businessConfig.privacyOfficer.email}
              </a>
            </p>
            <p className="mb-2">
              Phone:{' '}
              <a href={businessConfig.phone.href} className="text-primary hover:underline">
                {businessConfig.phone.display}
              </a>
            </p>
            <p>Address: {businessConfig.location.display}</p>
          </div>
          <p className="mt-4">
            You also have the right to file a complaint with the U.S. Department of Health and Human
            Services, Office for Civil Rights. We will not retaliate against you for filing a
            complaint.
          </p>
        </div>
      </Container>
    </div>
  )
}
