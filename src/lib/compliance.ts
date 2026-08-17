/**
 * Ad-path compliance vocabulary.
 *
 * Meta crawls the landing page and every page reachable from it, not just the
 * ad creative. A clean ad pointing at a page that names a controlled substance
 * still gets the ad account flagged, and the same vocabulary is what carriers
 * scrutinize during 10DLC review.
 *
 * These terms are banned on ad-linked pages ONLY. The main marketing site
 * (/peptides, /hormone-therapy) legitimately uses them for organic search —
 * which is exactly why ad traffic must never reach those pages.
 */

export type BannedTerm = { label: string; pattern: RegExp }

/**
 * Word-boundary anchored so real words are caught without false positives.
 * `\bRx\b` deliberately does not match "StrengthRX" — no boundary exists
 * between the "h" and the "RX".
 */
export const BANNED_TERMS: BannedTerm[] = [
  { label: 'TRT', pattern: /\bTRT\b/i },
  { label: 'testosterone', pattern: /\btestosterone\b/i },
  { label: 'peptide(s)', pattern: /\bpeptides?\b/i },
  { label: 'hormone replacement', pattern: /\bhormone\s+replacement\b/i },
  { label: 'steroid(s)', pattern: /\bsteroids?\b/i },
  { label: 'HGH', pattern: /\bHGH\b/i },
  { label: 'human growth hormone', pattern: /\bhuman\s+growth\s+hormone\b/i },
  { label: 'prescription', pattern: /\bprescriptions?\b/i },
  { label: 'Rx', pattern: /\bRx\b/i },
  { label: 'before/after', pattern: /\bbefore\s*(\/|and|&)\s*after\b/i },
  { label: 'guaranteed results', pattern: /\bguarantee(d|s)?\b/i },
  { label: 'cure', pattern: /\bcures?\b/i },
  { label: 'treat/treatment', pattern: /\btreat(s|ed|ing|ment|ments)?\b/i },
  { label: 'suffer from (viewer-attribute callout)', pattern: /\bsuffer(ing)?\s+from\b/i },
  // Specific drug names that show up in this vertical.
  { label: 'drug name', pattern: /\b(semaglutide|tirzepatide|ozempic|wegovy|clomid|anastrozole|sermorelin|ipamorelin|BPC-?157|enclomiphene)\b/i },
  /**
   * Credential accuracy. StrengthRX care is delivered by a Family Nurse
   * Practitioner, so "physician-supervised" / "physician-led" is a false
   * credential claim — a scope-of-practice misrepresentation to a state
   * licensing board, and a misleading health claim to Meta. The ads review
   * sheet says it plainly: never "physician".
   *
   * Use `provider-led`, `licensed provider`, `clinician-led` or
   * `nurse practitioner` instead.
   */
  { label: 'physician (provider is an FNP, not an MD)', pattern: /\bphysicians?\b/i },
  { label: 'doctor-led/doctor-supervised', pattern: /\bdoctors?[-\s](led|supervised|approved)\b/i },
  { label: 'medically supervised (implies physician)', pattern: /\bmedically\s+supervised\b/i },
]

/**
 * Viewer-attribute callouts. Meta's health rules prohibit copy implying you
 * know something about the person reading it. First-person storytelling is
 * the compliant alternative: "I thought being exhausted was just what being a
 * dad feels like" is a story; "Feeling exhausted?" is a callout.
 */
export const CALLOUT_PATTERNS: BannedTerm[] = [
  { label: 'are you / do you callout', pattern: /\b(are|do|have)\s+you\s+(feeling|struggling|experiencing|tired|exhausted|low)\b/i },
  { label: 'feeling X? callout', pattern: /\bfeeling\s+\w+\s*\?/i },
  { label: 'your low/declining X', pattern: /\byour\s+(low|declining|failing)\b/i },
  /**
   * Added after scanning the 2026-07-10 ad slate, where three headlines read
   * clean and were plainly callouts:
   *
   *   "You're not supposed to feel this tired."
   *   "Tired since 2018? It doesn't have to be that way."
   *   "Asleep on the couch by 8pm? That's your sign."
   *
   * The original patterns only caught the interrogative "Are you feeling…?"
   * form. Meta's rule is about asserting or implying knowledge of the viewer,
   * which second-person statements and bare symptom questions do just as
   * directly. A false negative here is the expensive direction: it reads green
   * and the ad account still gets restricted.
   */
  {
    label: "you're <symptom> (second-person state assertion)",
    pattern: /\byou(?:'re|’re| are)\s+(?:not\s+)?(?:supposed to feel\s+|feeling\s+|so\s+)?(?:this\s+)?(tired|exhausted|drained|run[-\s]?down|worn out|sluggish)\b/i,
  },
  {
    label: 'symptom posed as a question to the viewer',
    pattern: /\b(tired|exhausted|drained|run[-\s]?down|no energy|low energy|asleep on the couch|can'?t sleep|gaining weight)\b[^.!?]{0,60}\?/i,
  },
  { label: "that's your sign / sound familiar", pattern: /\b(that'?s your sign|sound familiar|if this is you)\b/i },
]

export type ComplianceViolation = { term: string; match: string; context: string }

/** Returns every banned term found in the supplied copy. */
export function findComplianceViolations(
  text: string,
  { includeCallouts = true }: { includeCallouts?: boolean } = {},
): ComplianceViolation[] {
  const terms = includeCallouts ? [...BANNED_TERMS, ...CALLOUT_PATTERNS] : BANNED_TERMS
  const violations: ComplianceViolation[] = []

  for (const { label, pattern } of terms) {
    const match = text.match(pattern)
    if (!match || match.index == null) continue

    const start = Math.max(0, match.index - 40)
    violations.push({
      term: label,
      match: match[0],
      context: text.slice(start, match.index + match[0].length + 40).replace(/\s+/g, ' ').trim(),
    })
  }

  return violations
}

/** Approved framing, for reference when writing new ad-path copy. */
export const APPROVED_FRAMING = [
  'telehealth access',
  'hormone optimization',
  'lab-based care',
  'provider-led',
  'licensed provider',
  'nurse practitioner',
  'performance assessment',
  'labs decide, not opinions',
  'clinician-led',
  'evidence-backed',
  'results acceleration membership',
] as const
