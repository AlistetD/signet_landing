import { z } from 'zod'
import { cities } from './cities'

const BY_PHONE = /^\+375\d{9}$/

export const callTimes = ['morning', 'day', 'evening'] as const
export type CallTime = (typeof callTimes)[number]

export function normalizeByPhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('375')) {
    return `+375${digits.slice(3, 12)}`
  }
  if (digits.length <= 9) {
    return `+375${digits}`
  }
  return `+${digits}`
}

export function formatByPhoneMask(input: string): string {
  const digits = input.replace(/\D/g, '')
  const local = (digits.startsWith('375') ? digits.slice(3) : digits).slice(0, 9)
  const p1 = local.slice(0, 2)
  const p2 = local.slice(2, 5)
  const p3 = local.slice(5, 7)
  const p4 = local.slice(7, 9)

  if (local.length === 0) {
    return '+375'
  }
  if (local.length <= 2) {
    return `+375 (${p1}`
  }
  if (local.length <= 5) {
    return `+375 (${p1}) ${p2}`
  }
  if (local.length <= 7) {
    return `+375 (${p1}) ${p2}-${p3}`
  }
  return `+375 (${p1}) ${p2}-${p3}-${p4}`
}

export function isValidByPhone(input: string): boolean {
  return BY_PHONE.test(normalizeByPhone(input))
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidResumeUrl(input: string): boolean {
  const resume = input.trim()
  return resume.length === 0 || isHttpUrl(resume)
}

const nameField = z.string().trim().min(2).max(80)
const cityField = z.enum(cities)
const positionField = z.string().trim().min(2).max(120)
const phoneField = z
  .string()
  .transform((value) => normalizeByPhone(value))
  .refine((value) => BY_PHONE.test(value))

export const applicationSchema = z
  .object({
    name: nameField,
    phone: phoneField,
    city: cityField,
    position: positionField,
    resumeUrl: z.string().optional().default(''),
    consent: z.literal(true),
  })
  .superRefine((value, ctx) => {
    if (!isValidResumeUrl(value.resumeUrl)) {
      ctx.addIssue({ code: 'custom', path: ['resumeUrl'], message: 'resumeUrl' })
    }
  })
  .transform((value) => {
    const resume = value.resumeUrl.trim()
    return {
      name: value.name,
      phone: value.phone,
      city: value.city,
      position: value.position,
      consent: true as const,
      ...(resume.length > 0 ? { resumeUrl: resume } : {}),
    }
  })

export type Application = z.infer<typeof applicationSchema>

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: 'validation' | 'rate_limit' | 'unavailable' }

export function applicationContactKey(application: {
  phone?: string
  email?: string
  name?: string
}): string {
  if (application.phone && application.phone.length > 4) {
    return application.phone
  }
  if (application.email) {
    return application.email
  }
  return application.name ?? 'unknown'
}

export type ApplicationDraft = {
  name: string
  phone: string
  city: string
  position: string
  resumeUrl: string
}

export function countCompletedFields(value: ApplicationDraft): number {
  const checks = [
    nameField.safeParse(value.name).success,
    phoneField.safeParse(value.phone).success,
    cityField.safeParse(value.city).success,
    positionField.safeParse(value.position).success,
  ]
  return checks.filter(Boolean).length
}
