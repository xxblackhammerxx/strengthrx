import { businessConfig } from '@/lib/business.config'

/**
 * Embeds Kendon's Google appointment schedule.
 *
 * Interim booking path used only until the GoHighLevel calendar is live.
 * Google appointment schedules offer no completion redirect and no postMessage
 * on booking, so a confirmed booking here is invisible to us — /book
 * deliberately does not fire Schedule in this mode rather than guessing.
 */
export function GoogleCalendarEmbed({ minHeight = 700 }: { minHeight?: number }) {
  return (
    <iframe
      src={businessConfig.urls.booking}
      title="Book your consultation"
      style={{ width: '100%', border: 'none', minHeight }}
      frameBorder="0"
    />
  )
}
