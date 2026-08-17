/**
 * Client-safe Meta Pixel configuration.
 *
 * Only NEXT_PUBLIC_* values belong in this file — it is imported by client
 * components. The Conversions API access token is read exclusively inside
 * `capi.ts`, which is marked server-only.
 */

/** Public pixel ID — ships in the browser by design. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''
