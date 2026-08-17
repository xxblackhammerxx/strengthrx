import type { Metadata } from 'next'
import { businessConfig } from '@/lib/business.config'
import { Container } from '@/components/ui/Container'
import { Heading } from '@/components/ui/Heading'
import { SMS_CONSENT_TEXT } from '@/lib/consent'

export const metadata: Metadata = {
  title: 'Messaging Terms | StrengthRX',
  description:
    'Terms for the StrengthRX SMS program: message types, frequency, rates, and how to opt out.',
  alternates: { canonical: '/sms-terms' },
  // Indexed on purpose, unlike /privacy and /terms. Carriers fetch this page
  // during 10DLC campaign review and an unreachable or noindexed terms page is
  // a common rejection reason.
  robots: { index: true, follow: true },
}

/**
 * SMS program terms.
 *
 * Required by A2P 10DLC. During campaign registration a carrier follows the
 * link shown next to the opt-in checkbox and checks that this page exists,
 * matches the consent language, and states the opt-out instructions. Keep it in
 * step with `@/lib/consent` — the opt-in sentence below is rendered from that
 * module rather than retyped so the two cannot drift.
 */
export default function SmsTermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container size="md">
        <div className="prose max-w-none">
          <Heading as="h1" size="4xl" className="mb-8">
            Messaging Terms
          </Heading>

          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> August 7, 2026
          </p>

          <h2>1. Program description</h2>
          <p>
            StrengthRX operates an SMS program used to schedule and confirm consultations, send
            appointment reminders, answer questions about getting started, and follow up on an
            inquiry you submitted to us. We do not send clinical information by text message.
          </p>

          <h2>2. How you opt in</h2>
          <p>
            You opt in by checking the messaging consent box on a form on this website and
            submitting it. The box is never pre-checked. The exact language you agree to is:
          </p>
          <blockquote>{SMS_CONSENT_TEXT}</blockquote>
          <p>
            You may also opt in by texting us first, or by giving verbal consent to a member of our
            team, in which case we record when and how that consent was given.
          </p>

          <h2>3. Message frequency</h2>
          <p>
            Message frequency varies and depends on how you interact with us. A typical inquiry
            results in a small number of messages around scheduling.
          </p>

          <h2>4. Cost</h2>
          <p>
            Message and data rates may apply. StrengthRX does not charge for the messages
            themselves; your mobile carrier&apos;s standard rates apply.
          </p>

          <h2>5. Opting out</h2>
          <p>
            Reply <strong>STOP</strong> to any message to stop receiving text messages. You will
            receive one confirmation that you have been unsubscribed, and no further messages after
            that. You can opt back in at any time by texting <strong>START</strong> or by submitting
            a form again.
          </p>

          <h2>6. Help</h2>
          <p>
            Reply <strong>HELP</strong> to any message for assistance, or contact us at{' '}
            <a href={businessConfig.email.href}>{businessConfig.email.display}</a> or{' '}
            <a href={businessConfig.phone.href}>{businessConfig.phone.display}</a>.
          </p>

          <h2>7. Consent is not a condition of purchase</h2>
          <p>
            You are not required to agree to receive text messages in order to book a consultation,
            create an account, or purchase anything from StrengthRX.
          </p>

          <h2>8. Carriers</h2>
          <p>
            Supported carriers are not liable for delayed or undelivered messages. Delivery is not
            guaranteed.
          </p>

          <h2>9. Your information</h2>
          <p>
            <strong>
              We do not share or sell mobile information, or consent to receive text messages, to
              any third party or affiliate for marketing purposes.
            </strong>{' '}
            Phone numbers collected for SMS are used only to deliver the messages described above.
            Information may be shared with the messaging providers that deliver those messages on
            our behalf, and with no one else for marketing. See our{' '}
            <a href="/privacy">Privacy Policy</a> for how we handle your information generally.
          </p>
        </div>
      </Container>
    </div>
  )
}
