import { describe, expect, it } from 'vitest'
import { isStoredTheme, PLASMA_TINT, resolveTheme } from './theme'

describe('resolveTheme', () => {
  it('uses a stored light preference', () => {
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('uses a stored dark preference', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('follows the system when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })
})

describe('isStoredTheme', () => {
  it('accepts only explicit light or dark', () => {
    expect(isStoredTheme('light')).toBe(true)
    expect(isStoredTheme('dark')).toBe(true)
    expect(isStoredTheme(null)).toBe(false)
    expect(isStoredTheme('system')).toBe(false)
  })
})

describe('PLASMA_TINT', () => {
  it('uses cool gray steam on light and Signet red on dark', () => {
    expect(PLASMA_TINT.light).toBe('#6a6e74')
    expect(PLASMA_TINT.dark).toBe('#e60000')
  })
})
