import type { Metadata } from 'next'
import Link from 'next/link'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'

/**
 * ── STATUS: drafted to 45 CFR 164.520, not yet reviewed by counsel ──────────
 *
 * The Notice of Privacy Practices is a distinct legal document from the
 * privacy policy, and this practice did not have one. HIPAA requires a covered
 * entity to maintain one, to make it available electronically on any website
 * that describes its services, and to make a good-faith effort to obtain
 * written acknowledgement of receipt from each patient.
 *
 * This draft covers the elements the regulation requires: the mandatory header,
 * uses and disclosures for treatment/payment/operations, uses requiring
 * authorization, the full set of individual rights, our duties, and the
 * complaint path. Counsel must confirm the content.
 *
 * Privacy Officer: Bobby Wolfe, designated Aug 2026. See
 * businessConfig.privacyOfficer.
 *
 * Acknowledgement of receipt is handled in Practice Better, not here. It is an
 * element of the StrengthRx Intake Form (attached in /api/onboarding as form
 * 69d43a44815b5d896fce824e) and is signed before any service is provided, which
 * is what 164.520(c)(2)(ii) asks for — do NOT add an acknowledgement checkbox to
 * /get-started. A second, unsigned "acknowledgement" collected before the real
 * one is noise at best and contradictory evidence at worst.
 *
 * This page exists to satisfy 164.520(c)(3) electronic availability, and it is
 * the copy the public sees.
 *
 * THEREFORE: this text and the notice in the Practice Better intake packet must
 * stay identical. Two notices in circulation is a live problem — we are required
 * to follow the terms of the notice currently in effect, and a patient or
 * regulator finds this one first. Any edit here needs the same edit there, and
 * the effective date below bumped in both.
 */
export const metadata: Metadata = {
  title: 'Notice of Privacy Practices',
  description:
    'How StrengthRX may use and disclose your protected health information, and your rights regarding that information under HIPAA.',
  alternates: {
    canonical: '/notice-of-privacy-practices',
  },
}

export default function NoticeOfPrivacyPracticesPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="md">
        <div className="prose max-w-none">
          <Heading as="h1" size="4xl" className="mb-6">
            Notice of Privacy Practices
          </Heading>

          {/* The all-caps header is prescribed by 45 CFR 164.520(b)(1)(i) and
              must appear prominently. Do not soften or restyle it away. */}
          <div className="bg-muted p-5 rounded-lg border border-border not-prose mb-8">
            <p className="font-bold uppercase text-sm leading-relaxed">
              This notice describes how medical information about you may be used and disclosed and
              how you can get access to this information. Please review it carefully.
            </p>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> August 17, 2026
          </p>

          <h2>Our Commitment</h2>
          <p>
            {businessConfig.name} is required by law to maintain the privacy of your Protected
            Health Information (&quot;PHI&quot;), to give you this notice describing our legal
            duties and privacy practices, and to notify you if a breach affects your unsecured PHI.
            We are required to follow the terms of the notice currently in effect.
          </p>
          <p>
            PHI is information that identifies you and relates to your physical or mental health,
            the care we provide you, or payment for that care.
          </p>

          <h2>How We May Use and Disclose Your Health Information</h2>

          <h3>Treatment</h3>
          <p>
            We use and disclose your PHI to provide and coordinate your care. For example, your
            provider may review your lab results to determine an appropriate protocol, or send a
            prescription to a compounding pharmacy so it can be dispensed to you.
          </p>

          <h3>Payment</h3>
          <p>
            We use and disclose your PHI to bill and collect payment for services. For example, we
            may share information with a payment processor to complete a transaction.
          </p>

          <h3>Health Care Operations</h3>
          <p>
            We use and disclose your PHI to run our practice — for example, reviewing the quality of
            care we deliver, training staff, and administrative activities. We use business
            associates, such as our patient records platform, to help us do this. Each is required
            by written agreement to safeguard your information.
          </p>

          <h3>Appointment Reminders and Health-Related Communications</h3>
          <p>
            We may contact you to remind you of an appointment, to follow up on your care, or to
            tell you about treatment alternatives or health-related benefits that may be of interest
            to you.
          </p>

          <h3>Other Uses and Disclosures Permitted or Required by Law</h3>
          <p>We may use or disclose your PHI without your authorization when the law allows or requires it, including:</p>
          <ul>
            <li>When required by federal, state, or local law</li>
            <li>For public health activities, including reporting adverse events related to medications</li>
            <li>To report suspected abuse, neglect, or domestic violence</li>
            <li>For health oversight activities, such as audits or licensure investigations</li>
            <li>In response to a court order, subpoena, or other lawful process</li>
            <li>For law enforcement purposes as permitted by law</li>
            <li>To avert a serious and imminent threat to health or safety</li>
            <li>To coroners, medical examiners, and funeral directors</li>
            <li>For workers&apos; compensation claims as authorized by law</li>
            <li>For research, where an institutional review board has approved a waiver</li>
            <li>To military, national security, or correctional authorities in specific circumstances</li>
          </ul>

          <h2>Uses and Disclosures That Require Your Written Authorization</h2>
          <p>
            Other uses and disclosures not described in this notice will be made only with your
            written authorization. In particular, we will not use or disclose your PHI for
            marketing purposes, and we will not sell your PHI, without your written authorization.
            Most uses and disclosures of psychotherapy notes require your authorization. You may
            revoke an authorization in writing at any time, except to the extent we have already
            acted in reliance on it.
          </p>
          <p>
            <strong>We do not disclose your health information to advertising platforms.</strong> We
            do not send your health goals, lab results, diagnoses, prescriptions, or any other PHI
            to any advertising or analytics service, in any form. Our{' '}
            <Link href="/privacy">Privacy Policy</Link> describes the limited advertising
            measurement we perform, which is confined to our advertising landing pages and never
            includes health information.
          </p>

          <h2>Your Rights Regarding Your Health Information</h2>

          <h3>Right to Access and Receive a Copy</h3>
          <p>
            You have the right to inspect and receive a copy of your health records, usually within
            30 days of your request. You may ask us to send the copy electronically or to transmit
            it to a person or entity you designate. We may charge a reasonable, cost-based fee.
          </p>

          <h3>Right to Request an Amendment</h3>
          <p>
            If you believe information in your record is incorrect or incomplete, you may ask us to
            amend it. We may deny your request in certain circumstances, and if we do, we will
            explain why in writing and you may submit a statement of disagreement to be included in
            your record.
          </p>

          <h3>Right to an Accounting of Disclosures</h3>
          <p>
            You have the right to request a list of certain disclosures we have made of your PHI in
            the six years before your request, other than disclosures for treatment, payment, and
            health care operations and certain other exceptions.
          </p>

          <h3>Right to Request Restrictions</h3>
          <p>
            You may ask us to limit how we use or disclose your PHI. We are not required to agree to
            most requests. However, if you pay for a service in full and out of pocket, you have the
            right to require that we not disclose that information to a health plan for payment or
            operations purposes, and we must honor that request.
          </p>

          <h3>Right to Confidential Communications</h3>
          <p>
            You may ask us to contact you in a specific way or at a specific location — for example,
            only by email, or only at a particular phone number. We will accommodate reasonable
            requests.
          </p>

          <h3>Right to a Paper Copy of This Notice</h3>
          <p>
            You may request a paper copy of this notice at any time, even if you agreed to receive
            it electronically.
          </p>

          <h3>Right to Be Notified of a Breach</h3>
          <p>
            You have the right to be notified if a breach occurs that may have compromised the
            privacy or security of your unsecured PHI.
          </p>

          <h3>Right to Choose Someone to Act for You</h3>
          <p>
            If you have given someone medical power of attorney, or if someone is your legal
            guardian, that person can exercise these rights on your behalf. We will verify their
            authority before acting.
          </p>

          <h2>Our Duties</h2>
          <ul>
            <li>We are required by law to protect the privacy and security of your PHI.</li>
            <li>
              We must notify you promptly if a breach occurs that may have compromised your
              information.
            </li>
            <li>We must follow the duties and privacy practices described in this notice.</li>
            <li>
              We will not use or share your information other than as described here unless you tell
              us in writing that we may. If you tell us we may, you may change your mind at any
              time.
            </li>
          </ul>

          <h2>Changes to This Notice</h2>
          <p>
            We may change the terms of this notice at any time, and the changes will apply to all
            information we hold about you. The current notice will always be posted on this page
            with its effective date, and you may request a copy at any time.
          </p>

          <h2>Complaints</h2>
          <p>
            If you believe your privacy rights have been violated, you may file a complaint with us
            using the contact information below, or with the U.S. Department of Health and Human
            Services, Office for Civil Rights, at 200 Independence Avenue S.W., Washington, D.C.
            20201, by calling 1-877-696-6775, or at{' '}
            <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/">
              hhs.gov/ocr/privacy/hipaa/complaints
            </a>
            . <strong>We will not retaliate against you for filing a complaint.</strong>
          </p>

          <h2>Contact Us</h2>
          <p>
            To exercise any right described in this notice, to request a paper copy, or to ask a
            question about our privacy practices, contact our Privacy Officer:
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="mb-2">
              <strong>{businessConfig.privacyOfficer.name}</strong>, Privacy Officer
            </p>
            <p className="mb-2">{businessConfig.name}</p>
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
        </div>
      </Container>
    </div>
  )
}
