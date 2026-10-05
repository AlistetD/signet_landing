import {
  applicationContactKey,
  applicationSchema,
  type Application,
  type SubmitResult,
} from '../src/lib/application-schema.ts'

const DEFAULT_WINDOW_MS = 10 * 60 * 1000

export type ApplicationStore = {
  hasRecent: (contactKey: string, city: string, sinceMs: number) => Promise<boolean>
  remember: (application: Application, atMs: number) => Promise<void>
}

export type RateLimiter = {
  hit: (key: string) => boolean
}

export type SubmitDeps = {
  deliver: (application: Application) => Promise<void>
  store: ApplicationStore
  rateLimiter: RateLimiter
  now?: () => number
  ip?: string
}

export function createRateLimiter(options: {
  limit: number
  windowMs: number
}): RateLimiter {
  const hits = new Map<string, Array<number>>()

  return {
    hit(key: string): boolean {
      const now = Date.now()
      const recent = (hits.get(key) ?? []).filter((at) => now - at < options.windowMs)
      recent.push(now)
      hits.set(key, recent)
      return recent.length <= options.limit
    },
  }
}

export function createMemoryApplicationStore(): ApplicationStore {
  const rows: Array<{ contactKey: string; city: string; atMs: number }> = []

  return {
    async hasRecent(contactKey, city, sinceMs) {
      return rows.some(
        (row) => row.contactKey === contactKey && row.city === city && row.atMs >= sinceMs,
      )
    },
    async remember(application, atMs) {
      rows.push({ contactKey: applicationContactKey(application), city: application.city, atMs })
    },
  }
}

export async function submitApplication(
  input: unknown,
  deps: SubmitDeps,
): Promise<SubmitResult> {
  const parsed = applicationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'validation' }
  }

  const now = deps.now?.() ?? Date.now()
  const ip = deps.ip ?? 'unknown'
  const contactKey = applicationContactKey(parsed.data)

  if (!deps.rateLimiter.hit(`ip:${ip}`) || !deps.rateLimiter.hit(`contact:${contactKey}`)) {
    return { ok: false, error: 'rate_limit' }
  }

  if (await deps.store.hasRecent(contactKey, parsed.data.city, now - DEFAULT_WINDOW_MS)) {
    return { ok: true }
  }

  try {
    await deps.deliver(parsed.data)
    await deps.store.remember(parsed.data, now)
    return { ok: true }
  } catch {
    return { ok: false, error: 'unavailable' }
  }
}
