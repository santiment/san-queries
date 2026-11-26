import { describe, expect, it } from 'vitest'
import { getSafeRedirectPath } from './safe-redirect'

describe('getSafeRedirectPath', () => {
  it('keeps same-site paths', () => {
    expect(getSafeRedirectPath('https://app.santiment.net/query/12?a=1#b')).toBe('/query/12')
    expect(getSafeRedirectPath('https://queries.santiment.net/')).toBe('/')
  })

  it('rejects protocol-relative and backslash paths', () => {
    expect(getSafeRedirectPath('https://app.santiment.net//evil.com')).toBe('/')
    expect(getSafeRedirectPath('https://app.santiment.net//evil.com/x', '/query/new')).toBe(
      '/query/new',
    )
    expect(getSafeRedirectPath('https://app.santiment.net/\\evil.com')).toBe('/')
    expect(getSafeRedirectPath('https://app.santiment.net/%5Cevil.com')).toBe('/%5Cevil.com')
  })

  it('rejects other hosts, schemes and junk', () => {
    expect(getSafeRedirectPath('https://evil.com/')).toBe('/')
    expect(getSafeRedirectPath('https://santiment.net.evil.com/')).toBe('/')
    expect(getSafeRedirectPath('javascript:alert(1)')).toBe('/')
    expect(getSafeRedirectPath('//evil.com')).toBe('/')
    expect(getSafeRedirectPath('')).toBe('/')
    expect(getSafeRedirectPath(null)).toBe('/')
  })
})
