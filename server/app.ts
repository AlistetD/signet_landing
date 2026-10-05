import { Hono } from 'hono'
import type { SubmitResult } from '../src/lib/application-schema.ts'
import type { HrInbox } from './adapters/hr-inbox.ts'
import type { RateLimiter } from './apply.ts'
import { submitApplication } from './apply.ts'
import { authorizeHrBearer, listHrInbox } from './hr-export.ts'

export type AppDeps = {
  inbox: HrInbox
  rateLimiter: RateLimiter
  hrApiKey: string
}

export function createApp(deps: AppDeps): Hono {
  const app = new Hono()

  app.get('/api/health', (c) => c.json({ ok: true }))

  app.get('/api/hr/applications', async (c) => {
    if (deps.hrApiKey.length < 16) {
      return c.json({ error: 'unavailable' }, 503)
    }
    if (!authorizeHrBearer(c.req.header('authorization'), deps.hrApiKey)) {
      return c.json({ error: 'unauthorized' }, 401)
    }

    const listed = listHrInbox(await deps.inbox.list(), {
      since: c.req.query('since'),
      limit: c.req.query('limit'),
    })
    if (!listed.ok) {
      return c.json({ error: 'validation' }, 400)
    }
    return c.json(listed.body)
  })

  app.post('/api/applications', async (c) => {
    let body: unknown
    try {
      body = await c.req.json()
    } catch {
      return c.json({ ok: false, error: 'validation' } satisfies SubmitResult, 400)
    }

    const forwarded = c.req.header('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown'

    const result = await submitApplication(body, {
      deliver: deps.inbox.deliver,
      store: deps.inbox.store,
      rateLimiter: deps.rateLimiter,
      ip,
    })

    if (result.ok) {
      return c.json(result)
    }

    const status = result.error === 'unavailable' ? 503 : result.error === 'rate_limit' ? 429 : 400
    return c.json(result, status)
  })

  return app
}
