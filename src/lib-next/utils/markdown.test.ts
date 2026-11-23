import { describe, expect, it } from 'vitest'

import { safeMarkdownToHTML } from './markdown'

// Nothing a user types may produce an executable element, event handler or script URL
const EXECUTABLE = /<script|<img[^>]*\son\w+=|<[a-z][^>]*\son\w+\s*=|href="\s*javascript:/i

describe('safeMarkdownToHTML', () => {
  it('renders ordinary markdown', () => {
    expect(safeMarkdownToHTML('**bold** and `code`')).toBe(
      '<p><strong>bold</strong> and <code>code</code></p>\n',
    )
    expect(safeMarkdownToHTML('1. a\n2. b')).toContain('<ol>')
  })

  it('starts headings at h2', () => {
    expect(safeMarkdownToHTML('# Title')).toBe('<h2>Title</h2>\n')
  })

  it('keeps http(s)/mailto/relative links and https images', () => {
    expect(safeMarkdownToHTML('[a](https://santiment.net/x?a=1&b=2)')).toContain(
      '<a href="https://santiment.net/x?a=1&amp;b=2">a</a>',
    )
    expect(safeMarkdownToHTML('[a](mailto:a@b.co)')).toContain('href="mailto:a@b.co"')
    expect(safeMarkdownToHTML('[a](/relative)')).toContain('href="/relative"')
    expect(safeMarkdownToHTML('![alt](https://a.b/i.png)')).toContain(
      '<img src="https://a.b/i.png"',
    )
  })

  it.each([
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<a href="javascript:alert(1)">x</a>',
    '<iframe src="https://evil.example"></iframe>',
    'text <b onclick=alert(1)>bold</b> text',
    '<div>\n<img src=x onerror=alert(1)>\n</div>',
  ])('escapes raw HTML: %s', (payload) => {
    const html = safeMarkdownToHTML(payload)

    expect(html).not.toMatch(EXECUTABLE)
    expect(html).not.toMatch(/<(script|iframe|svg|div)\b/i)
    expect(html).toContain('&lt;')
  })

  it.each([
    '[x](javascript:alert(1))',
    '[x](JaVaScRiPt:alert(1))',
    '[x](  javascript:alert(1))',
    '[x](<javascript:alert(1)>)',
    '[x](&#106;avascript:alert(1))',
    '[x](&#x6A;avascript&colon;alert(1))',
    '[x](java&Tab;script:alert(1))',
    '[x](data:text/html,<script>alert(1)</script>)',
    '[x](vbscript:msgbox(1))',
    '[x][r]\n\n[r]: javascript:alert(1)',
    '<javascript:alert(1)>',
    '![x](javascript:alert(1))',
    '![x](data:image/svg+xml;base64,PHN2Zz4=)',
  ])('never emits a script-capable URL: %s', (payload) => {
    const html = safeMarkdownToHTML(payload)

    expect(html).not.toMatch(EXECUTABLE)
    // Whatever survives as an href/src must not be decodable into a non-http(s) scheme
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      expect(url).not.toMatch(/^[\s\S]{0,12}(javascript|vbscript|data):/i)
      expect(url.replace(/&amp;/g, '')).not.toContain('&')
    }
  })

  it('drops the link but keeps its label when the URL is unsafe', () => {
    expect(safeMarkdownToHTML('[click me](javascript:alert(1))')).toBe('<p>click me</p>\n')
  })

  it('does not throw on empty or missing input', () => {
    expect(safeMarkdownToHTML('')).toBe('')
    expect(safeMarkdownToHTML(undefined as unknown as string)).toBe('')
  })
})
