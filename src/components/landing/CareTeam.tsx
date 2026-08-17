import Image from 'next/image'

/**
 * The two real people behind the consultation.
 *
 * Chosen over stock or generated lifestyle models on purpose. A smiling
 * stranger beside health copy reads as a patient testimonial to both a visitor
 * and a policy reviewer, and a testimonial needs a signed release plus a
 * results disclaimer — the ads review sheet already flags exactly that for the
 * BOF1 creative. Real named staff carry none of that exposure and are a
 * stronger trust signal anyway.
 *
 * Kendon is listed second and described as the person on the call because it
 * is his calendar the visitor is about to book. Showing the face they are
 * about to meet is the point; a generic "our team" strip is not.
 *
 * CREDENTIALS ARE LOAD-BEARING. Bobby is a Family Nurse Practitioner, never a
 * physician — `src/lib/compliance.ts` bans the word on the ad path and a test
 * enforces it. Kendon is operations, not clinical, and must never be described
 * in a way that implies he provides care.
 */

const TEAM = [
  {
    name: 'Bobby Wolfe, FNP',
    role: 'Family Nurse Practitioner',
    note: 'Reviews every assessment and your lab work.',
    src: '/bobby-profile.png',
    alt: 'Bobby Wolfe, Family Nurse Practitioner and founder of StrengthRX',
  },
  {
    name: 'Kendon Hatch',
    role: 'Co-Founder',
    note: "Your consultation is with him — that's his calendar.",
    src: '/kendon-profile.jpg',
    alt: 'Kendon Hatch, co-founder of StrengthRX',
  },
] as const

export function CareTeam() {
  return (
    <div className="mt-9 rounded-2xl border border-neutral-700/40 bg-neutral-900/30 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Who you&apos;ll be talking to
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {TEAM.map((person) => (
          <div key={person.name} className="flex items-start gap-3.5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-neutral-700/60 bg-neutral-800">
              <Image
                src={person.src}
                alt={person.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{person.name}</p>
              <p className="text-xs text-primary-400">{person.role}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400">{person.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
