import { Marked, type Token, type Tokens } from 'marked'

/**
 * Markdown -> HTML for **untrusted** text (for example a SQL result cell on a public dashboard).
 *
 * `marked` copies raw HTML in the source straight into its output, so `{@html marked(text)}` is a
 * stored XSS. This renderer
 *  - escapes every raw HTML token (block and inline) instead of passing it through;
 *  - only keeps link/image targets that are relative or use an allow-listed scheme, and drops the
 *    link otherwise (browsers ignore whitespace/control characters inside a scheme, so those are
 *    stripped before the scheme is checked).
 *
 * Output is safe to use with `{@html}`.
 */

const LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])
const IMAGE_PROTOCOLS = new Set(['http:', 'https:'])

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/** Returns the href when it is safe to render, otherwise an empty string */
export function sanitizeHref(href: string | undefined | null, protocols: Set<string>): string {
  if (!href) return ''

  // Control, separator (incl. nbsp, U+2028) and format (zero-width, BOM) characters
  const invisible = /[\p{Cc}\p{Z}\p{Cf}]/gu
  const scheme = /^[a-z][a-z0-9+.-]*:/i.exec(href.replace(invisible, ''))

  // No scheme means a relative reference, which stays on the web
  if (!scheme) return href

  return protocols.has(scheme[0].toLowerCase()) ? href : ''
}

function walkTokens(token: Token) {
  if (token.type === 'heading') {
    // Headings start at h2: the page already has its own h1
    ;(token as Tokens.Heading).depth = Math.max((token as Tokens.Heading).depth, 2)
  } else if (token.type === 'link' || token.type === 'image') {
    const t = token as Tokens.Link | Tokens.Image
    const href = sanitizeHref(t.href, token.type === 'image' ? IMAGE_PROTOCOLS : LINK_PROTOCOLS)

    if (href) {
      // marked writes the URL into the attribute as is. Escaping `&` keeps entities such as
      // `&#106;avascript:` from being decoded by the browser into a scheme we never checked
      t.href = href.replace(/&/g, '&amp;')
    } else {
      // Render the label only: marked's text renderer escapes it (links keep their inner tokens)
      ;(token as Token).type = 'text'
    }
  }
}

const safeMarked = new Marked({
  gfm: true,
  async: false,
  walkTokens,
  renderer: {
    html: (token: Tokens.HTML | Tokens.Tag) => escapeHtml(token.text),
  },
})

export function safeMarkdownToHTML(markdown: string): string {
  return safeMarked.parse(markdown ?? '', { async: false }) as string
}
