import { createHash, timingSafeEqual } from 'node:crypto'
import type { Application, CallTime } from '../src/lib/application-schema.ts'

export type LegacyStoreApplication = {
  track: 'store'
  name: string
  phone: string
  city: string
  callTime: CallTime
  consent: true
}

export type LegacyOfficeApplication = {
  track: 'office'
  name: string
  city: string
  position: string
  consent: true
  phone?: string
  email?: string
  resumeUrl?: string
}

export type StoredApplication = (Application | LegacyStoreApplication | LegacyOfficeApplication) & {
  id: string
  createdAt: number
}

export type HrApplicationItem = {
  id: string
  createdAt: string
  name: string
  phone: string | null
  email: string | null
  city: string
  track: 'store' | 'office' | 'general'
  position: string | null
  callTime: CallTime | null
  resumeUrl: string | null
}

export type HrInboxList = {
  items: Array<HrApplicationItem>
  hasMore: boolean
}

const DEFAULT_LIMIT = 100
const MAX_LIMIT = 100

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isLegacyStore(row: StoredApplication): row is LegacyStoreApplication & { id: string; createdAt: number } {
  return 'track' in row && row.track === 'store'
}

function isLegacyOffice(row: StoredApplication): row is LegacyOfficeApplication & { id: string; createdAt: number } {
  return 'track' in row && row.track === 'office'
}

export function toHrApplicationItem(row: StoredApplication): HrApplicationItem {
  if (isLegacyStore(row)) {
    return {
      id: row.id,
      createdAt: new Date(row.createdAt).toISOString(),
      name: row.name,
      phone: row.phone,
      email: null,
      city: row.city,
      track: 'store',
      position: null,
      callTime: row.callTime,
      resumeUrl: null,
    }
  }

  if (isLegacyOffice(row)) {
    const resume = row.resumeUrl && isHttpUrl(row.resumeUrl) ? row.resumeUrl : null
    return {
      id: row.id,
      createdAt: new Date(row.createdAt).toISOString(),
      name: row.name,
      phone: row.phone ?? null,
      email: row.email ?? null,
      city: row.city,
      track: 'office',
      position: row.position,
      callTime: null,
      resumeUrl: resume,
    }
  }

  const resume = row.resumeUrl && isHttpUrl(row.resumeUrl) ? row.resumeUrl : null
  return {
    id: row.id,
    createdAt: new Date(row.createdAt).toISOString(),
    name: row.name,
    phone: row.phone,
    email: null,
    city: row.city,
    track: 'general',
    position: row.position,
    callTime: null,
    resumeUrl: resume,
  }
}

export function listHrInbox(
  rows: Array<StoredApplication>,
  query: { since?: string; limit?: string },
): { ok: true; body: HrInboxList } | { ok: false; error: 'validation' } {
  let sinceMs = 0
  if (query.since !== undefined && query.since !== '') {
    const parsed = Date.parse(query.since)
    if (Number.isNaN(parsed)) {
      return { ok: false, error: 'validation' }
    }
    sinceMs = parsed
  }

  let limit = DEFAULT_LIMIT
  if (query.limit !== undefined && query.limit !== '') {
    const parsedLimit = Number.parseInt(query.limit, 10)
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
      return { ok: false, error: 'validation' }
    }
    limit = Math.min(parsedLimit, MAX_LIMIT)
  }

  const filtered = rows
    .filter((row) => row.createdAt >= sinceMs)
    .sort((a, b) => {
      if (a.createdAt !== b.createdAt) {
        return a.createdAt - b.createdAt
      }
      return a.id.localeCompare(b.id)
    })

  const page = filtered.slice(0, limit)
  return {
    ok: true,
    body: {
      items: page.map(toHrApplicationItem),
      hasMore: filtered.length > limit,
    },
  }
}

export function authorizeHrBearer(header: string | undefined, secret: string): boolean {
  if (secret.length < 16) {
    return false
  }
  const prefix = 'Bearer '
  const token = header?.startsWith(prefix) ? header.slice(prefix.length).trim() : ''
  const given = createHash('sha256').update(token).digest()
  const expected = createHash('sha256').update(secret).digest()
  return timingSafeEqual(given, expected)
}
