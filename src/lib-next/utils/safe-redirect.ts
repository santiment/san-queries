const ALLOWED_HOST_SUFFIX = '.santiment.net'

/**
 * Path to navigate to after login, taken from a user-controlled absolute URL.
 * Only same-site hosts are accepted and the result is always a single-slash, same-origin path:
 * `https://app.santiment.net//evil.com` has the pathname `//evil.com`, which `goto` would treat as a
 * protocol-relative URL and leave the site.
 */
export function getSafeRedirectPath(from: string | null | undefined, fallback = '/'): string {
  if (!from) return fallback

  try {
    const url = new URL(from)

    if (url.protocol !== 'https:' && url.protocol !== 'http:') return fallback
    if (!url.hostname.endsWith(ALLOWED_HOST_SUFFIX)) return fallback

    const path = url.pathname

    if (!/^\/(?![/\\])/.test(path) || /[\\\u0000-\u001f]/.test(path)) return fallback

    return path
  } catch {
    return fallback
  }
}
