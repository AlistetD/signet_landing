import { describe, expect, it } from 'vitest'
import type { Application } from '../src/lib/application-schema.ts'
import type { LegacyOfficeApplication, LegacyStoreApplication, StoredApplication } from './hr-export.ts'
import { listHrInbox, toHrApplicationItem, authorizeHrBearer } from './hr-export.ts'

const general: Application = {
  name: 'Мария Козлова',
  phone: '+375291000001',
  city: 'Гродно',
  position: 'Продавец-консультант',
  resumeUrl: 'https://example.com/maria',
  consent: true,
}

const store: LegacyStoreApplication = {
  track: 'store',
  name: 'Иван Петров',
  phone: '+375291112233',
  city: 'Минск',
  callTime: 'morning',
  consent: true,
}

const office: LegacyOfficeApplication = {
  track: 'office',
  name: 'Анна Сидорова',
  phone: '+375447778899',
  email: 'anna.office@example.com',
  city: 'Минск',
  position: 'HR-менеджер',
  consent: true,
}

describe('toHrApplicationItem', () => {
  it('maps a unified application as general', () => {
    expect(
      toHrApplicationItem({
        ...general,
        id: '7c1',
        createdAt: Date.parse('2026-09-29T10:00:00.000Z'),
      }),
    ).toEqual({
      id: '7c1',
      createdAt: '2026-09-29T10:00:00.000Z',
      name: 'Мария Козлова',
      phone: '+375291000001',
      email: null,
      city: 'Гродно',
      track: 'general',
      position: 'Продавец-консультант',
      callTime: null,
      resumeUrl: 'https://example.com/maria',
    })
  })

  it('maps a legacy store application with nulls for office-only fields', () => {
    expect(
      toHrApplicationItem({
        ...store,
        id: '8f3c2a1e-4b90-4c1d-9e2a-11aa22bb33cc',
        createdAt: Date.parse('2026-09-25T07:12:44.000Z'),
      }),
    ).toEqual({
      id: '8f3c2a1e-4b90-4c1d-9e2a-11aa22bb33cc',
      createdAt: '2026-09-25T07:12:44.000Z',
      name: 'Иван Петров',
      phone: '+375291112233',
      email: null,
      city: 'Минск',
      track: 'store',
      position: null,
      callTime: 'morning',
      resumeUrl: null,
    })
  })

  it('maps a legacy office application with null callTime when missing', () => {
    expect(
      toHrApplicationItem({
        ...office,
        id: '9a1b',
        createdAt: Date.parse('2026-09-25T07:15:01.000Z'),
      }),
    ).toEqual({
      id: '9a1b',
      createdAt: '2026-09-25T07:15:01.000Z',
      name: 'Анна Сидорова',
      phone: '+375447778899',
      email: 'anna.office@example.com',
      city: 'Минск',
      track: 'office',
      position: 'HR-менеджер',
      callTime: null,
      resumeUrl: null,
    })
  })
})

describe('listHrInbox', () => {
  const rows: Array<StoredApplication> = [
    { ...store, id: 'b', createdAt: Date.parse('2026-09-25T08:00:00.000Z') },
    { ...office, id: 'a', createdAt: Date.parse('2026-09-25T07:00:00.000Z') },
    { ...store, name: 'Третий', id: 'c', createdAt: Date.parse('2026-09-25T08:00:00.000Z') },
  ]

  it('sorts by createdAt then id and includes since', () => {
    const result = listHrInbox(rows, { since: '2026-09-25T08:00:00.000Z', limit: '100' })
    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }
    expect(result.body.items.map((item) => item.id)).toEqual(['b', 'c'])
    expect(result.body.hasMore).toBe(false)
  })

  it('sets hasMore when more rows remain after limit', () => {
    const result = listHrInbox(rows, { limit: '1' })
    expect(result.ok).toBe(true)
    if (!result.ok) {
      return
    }
    expect(result.body.items).toHaveLength(1)
    expect(result.body.items[0]?.id).toBe('a')
    expect(result.body.hasMore).toBe(true)
  })

  it('rejects an invalid since', () => {
    const result = listHrInbox(rows, { since: 'yesterday' })
    expect(result).toEqual({ ok: false, error: 'validation' })
  })
})

describe('authorizeHrBearer', () => {
  const secret = 'test-landing-api-key-not-for-production'

  it('accepts a matching Bearer token', () => {
    expect(authorizeHrBearer(`Bearer ${secret}`, secret)).toBe(true)
  })

  it('rejects a missing or wrong token', () => {
    expect(authorizeHrBearer(undefined, secret)).toBe(false)
    expect(authorizeHrBearer('Bearer other', secret)).toBe(false)
    expect(authorizeHrBearer(`Bearer ${secret}`, '')).toBe(false)
  })
})
