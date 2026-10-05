import { describe, expect, it } from 'vitest'
import type { Application } from '../src/lib/application-schema.ts'
import { createMemoryApplicationStore, createRateLimiter, submitApplication } from './apply.ts'

const valid: Application = {
  name: 'Анна Ковалева',
  phone: '+375291234567',
  city: 'Минск',
  position: 'Продавец-консультант',
  consent: true,
}

function setup() {
  const delivered: Array<Application> = []
  const store = createMemoryApplicationStore()
  const rateLimiter = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 })
  return {
    delivered,
    deps: {
      deliver: async (application: Application) => {
        delivered.push(application)
      },
      store,
      rateLimiter,
      now: () => 1_700_000_000_000,
      ip: '127.0.0.1',
    },
  }
}

describe('submitApplication', () => {
  it('delivers a valid application', async () => {
    const { delivered, deps } = setup()
    const result = await submitApplication(valid, deps)
    expect(result).toEqual({ ok: true })
    expect(delivered).toHaveLength(1)
    expect(delivered[0]?.position).toBe('Продавец-консультант')
  })

  it('rejects invalid payload', async () => {
    const { delivered, deps } = setup()
    const result = await submitApplication({ ...valid, position: '' }, deps)
    expect(result).toEqual({ ok: false, error: 'validation' })
    expect(delivered).toHaveLength(0)
  })

  it('does not deliver a duplicate contact+city in the window', async () => {
    const { delivered, deps } = setup()
    await submitApplication(valid, deps)
    const result = await submitApplication(valid, deps)
    expect(result).toEqual({ ok: true })
    expect(delivered).toHaveLength(1)
  })

  it('rate-limits repeated IP hits', async () => {
    const { deps } = setup()
    deps.rateLimiter = createRateLimiter({ limit: 1, windowMs: 10 * 60 * 1000 })
    await submitApplication(valid, deps)
    const result = await submitApplication({ ...valid, city: 'Брест' }, deps)
    expect(result).toEqual({ ok: false, error: 'rate_limit' })
  })

  it('returns unavailable when the adapter throws', async () => {
    const { deps } = setup()
    deps.deliver = async () => {
      throw new Error('hr down')
    }
    const result = await submitApplication(valid, deps)
    expect(result).toEqual({ ok: false, error: 'unavailable' })
  })
})
