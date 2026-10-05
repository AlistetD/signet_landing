import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import {
  applicationContactKey,
  applicationSchema,
  callTimes,
  type Application,
  type CallTime,
} from '../../src/lib/application-schema.ts'
import type { ApplicationStore } from '../apply.ts'
import type {
  LegacyOfficeApplication,
  LegacyStoreApplication,
  StoredApplication,
} from '../hr-export.ts'

const DEFAULT_FILE = path.resolve(process.cwd(), 'data/applications.json')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asStored(value: unknown): StoredApplication | null {
  if (!isRecord(value) || typeof value.createdAt !== 'number') {
    return null
  }

  const id = typeof value.id === 'string' && value.id.length > 0 ? value.id : randomUUID()
  const createdAt = value.createdAt

  if (value.track === 'store') {
    if (
      typeof value.name !== 'string' ||
      typeof value.phone !== 'string' ||
      typeof value.city !== 'string' ||
      typeof value.callTime !== 'string' ||
      !callTimes.includes(value.callTime as CallTime)
    ) {
      return null
    }
    const row: LegacyStoreApplication & { id: string; createdAt: number } = {
      track: 'store',
      name: value.name,
      phone: value.phone,
      city: value.city,
      callTime: value.callTime as CallTime,
      consent: true,
      id,
      createdAt,
    }
    return row
  }

  if (value.track === 'office') {
    if (typeof value.name !== 'string' || typeof value.city !== 'string' || typeof value.position !== 'string') {
      return null
    }
    const row: LegacyOfficeApplication & { id: string; createdAt: number } = {
      track: 'office',
      name: value.name,
      city: value.city,
      position: value.position,
      consent: true,
      id,
      createdAt,
    }
    if (typeof value.phone === 'string' && value.phone.length > 0) {
      row.phone = value.phone
    }
    if (typeof value.email === 'string' && value.email.length > 0) {
      row.email = value.email
    }
    if (typeof value.resumeUrl === 'string' && value.resumeUrl.length > 0) {
      row.resumeUrl = value.resumeUrl
    }
    return row
  }

  const parsed = applicationSchema.safeParse({
    name: value.name,
    phone: value.phone,
    city: value.city,
    position: value.position,
    resumeUrl: typeof value.resumeUrl === 'string' ? value.resumeUrl : '',
    consent: true,
  })
  if (!parsed.success) {
    return null
  }
  return { ...parsed.data, id, createdAt }
}

async function readRows(filePath: string): Promise<Array<StoredApplication>> {
  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.flatMap((row) => {
      const stored = asStored(row)
      return stored ? [stored] : []
    })
  } catch {
    return []
  }
}

export type HrInbox = {
  store: ApplicationStore
  deliver: (application: Application) => Promise<void>
  list: () => Promise<Array<StoredApplication>>
}

export function createFileInbox(filePath = DEFAULT_FILE): HrInbox {
  async function persist(rows: Array<StoredApplication>): Promise<void> {
    await mkdir(path.dirname(filePath), { recursive: true })
    await writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, 'utf8')
  }

  return {
    store: {
      async hasRecent(contactKey, city, sinceMs) {
        const rows = await readRows(filePath)
        return rows.some(
          (row) =>
            applicationContactKey(row) === contactKey &&
            row.city === city &&
            row.createdAt >= sinceMs,
        )
      },
      async remember() {
        // File inbox already persisted on deliver.
      },
    },
    async deliver(application) {
      const rows = await readRows(filePath)
      rows.push({ ...application, id: randomUUID(), createdAt: Date.now() })
      await persist(rows)
    },
    async list() {
      const rows = await readRows(filePath)
      await persist(rows)
      return rows
    },
  }
}
