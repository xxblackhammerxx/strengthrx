/**
 * Meta ships this package as an untyped UMD bundle. These are the only entry
 * points we call — see
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameter-builder-feature-library
 */
declare module 'meta-capi-param-builder-clientjs' {
  /** Meta's supported PII types for `getNormalizedAndHashedPII`. */
  export type MetaPiiDataType =
    | 'phone'
    | 'email'
    | 'first_name'
    | 'last_name'
    | 'date_of_birth'
    | 'gender'
    | 'city'
    | 'state'
    | 'zip_code'
    | 'country'
    | 'external_id'

  /**
   * Writes `_fbc`, `_fbp` and `_fbi` cookies, and recovers the backup click ID
   * that in-app browsers (the Facebook and Instagram webviews most ad traffic
   * arrives through) expose instead of a normal `fbclid`.
   *
   * @param url    Page URL to read the click ID from. Defaults to the current one.
   * @param getIpFn Resolves the visitor's IP, IPv6 preferred. Optional.
   */
  export function processAndCollectAllParams(
    url?: string | null,
    getIpFn?: () => string | Promise<string>,
  ): Promise<Record<string, string | null>>

  /** @deprecated Use `processAndCollectAllParams`. */
  export function processAndCollectParams(url?: string | null): Record<string, string>

  export function getFbc(): string | null
  export function getFbp(): string | null
  export function getClientIpAddress(): string | null
  export function getNormalizedAndHashedPII(
    piiValue: string,
    dataType: MetaPiiDataType,
  ): string | null
}
