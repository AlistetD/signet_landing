import { describe, expect, it } from 'vitest'
import type { Application } from '../src/lib/application-schema.ts'
import { createApp } from './app.ts'
import { createRateLimiter } from './apply.ts'
import type { StoredApplication } from './hr-export.ts'

const secret = 'test-landing-api-key-not-for-production'

const stored: StoredApplication = {
  track: 'store',
  name: 'Иван Петров',
  phone: '+375291112233',
  city: 'Минск',
  callTime: 'morning',
  consent: true,
  id: '8f3c2a1e-4b90-4c1d-9e2a-11aa22bb33cc',
  createdAt: Date.parse('2026-09-25T07:12:44.000Z'),
}

function appWithInbox(rows: Array<StoredApplication>, hrApiKey = secret) {
  const delivered: Array<Application> = []
  return createApp({
    hrApiKey,
    rateLimiter: createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 }),
    inbox: {
      store: {
        hasRecent: async () => false,
        remember: async () => undefined,
      },
      deliver: async (application) => {
        delivered.push(application)
      },
      list: async () => rows,
    },
  })
}

describe('GET /api/hr/applications', () => {
  it('returns 401 without a Bearer token', async () => {
    const app = appWithInbox([stored])
    const response = await app.request('/api/hr/applications', {
      headers: { Accept: 'application/json' },
    })
    expect(response.status).toBe(401)
  })

  it('returns 503 when the server key is not configured', async () => {
    const app = appWithInbox([stored], '')
    const response = await app.request('/api/hr/applications', {
      headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
    })
    expect(response.status).toBe(503)
  })

  it('returns the HRIS inbox payload', async () => {
    const app = appWithInbox([stored])
    const response = await app.request(
      '/api/hr/applications?since=2026-09-25T07:00:00.000Z&limit=100',
      {
        headers: { Authorization: `Bearer ${secret}`, Accept: 'application/json' },
      },
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({
      items: [
        {
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
        },
      ],
      hasMore: false,
    })
  })
})
