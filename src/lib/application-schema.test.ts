import { describe, expect, it } from 'vitest'
import {
  applicationSchema,
  countCompletedFields,
  formatByPhoneMask,
  normalizeByPhone,
} from './application-schema'

describe('normalizeByPhone', () => {
  it('keeps a complete +375 number', () => {
    expect(normalizeByPhone('+375291234567')).toBe('+375291234567')
  })

  it('strips mask characters', () => {
    expect(normalizeByPhone('+375 (29) 123-45-67')).toBe('+375291234567')
  })
})

describe('formatByPhoneMask', () => {
  it('formats nine local digits', () => {
    expect(formatByPhoneMask('291234567')).toBe('+375 (29) 123-45-67')
  })
})

describe('applicationSchema', () => {
  const valid = {
    name: 'Анна Ковалева',
    phone: '+375 (29) 123-45-67',
    city: 'Минск',
    position: 'Продавец-консультант',
    consent: true,
  }

  it('accepts a complete application without a resume', () => {
    const parsed = applicationSchema.parse(valid)
    expect(parsed.phone).toBe('+375291234567')
    expect(parsed.position).toBe('Продавец-консультант')
    expect(parsed.resumeUrl).toBeUndefined()
  })

  it('keeps an http resume URL', () => {
    const parsed = applicationSchema.parse({
      ...valid,
      resumeUrl: 'https://example.com/cv',
    })
    expect(parsed.resumeUrl).toBe('https://example.com/cv')
  })

  it('rejects an empty name', () => {
    const result = applicationSchema.safeParse({ ...valid, name: ' ' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-BY phone', () => {
    const result = applicationSchema.safeParse({
      ...valid,
      phone: '+37061111111',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a city outside the store list', () => {
    const result = applicationSchema.safeParse({ ...valid, city: 'Вильнюс' })
    expect(result.success).toBe(false)
  })

  it('rejects a city dropped from the official store list', () => {
    const result = applicationSchema.safeParse({ ...valid, city: 'Кобрин' })
    expect(result.success).toBe(false)
  })

  it('accepts Слоним from the official store list', () => {
    const parsed = applicationSchema.parse({ ...valid, city: 'Слоним' })
    expect(parsed.city).toBe('Слоним')
  })

  it('rejects missing PDN consent', () => {
    const result = applicationSchema.safeParse({ ...valid, consent: false })
    expect(result.success).toBe(false)
  })

  it('rejects a javascript resume URL', () => {
    const result = applicationSchema.safeParse({
      ...valid,
      resumeUrl: 'javascript:alert(1)',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a missing position', () => {
    const result = applicationSchema.safeParse({ ...valid, position: ' ' })
    expect(result.success).toBe(false)
  })
})

describe('countCompletedFields', () => {
  it('counts four required fields and ignores resume', () => {
    expect(
      countCompletedFields({
        name: 'Анна',
        phone: '+375 (29) 123-45-67',
        city: 'Минск',
        position: 'Продавец',
        resumeUrl: '',
      }),
    ).toBe(4)
    expect(
      countCompletedFields({
        name: '',
        phone: '+375',
        city: '',
        position: '',
        resumeUrl: 'https://example.com/cv',
      }),
    ).toBe(0)
  })
})
