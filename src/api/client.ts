import axios from 'axios'
import type { SubmitResult } from '@/lib/application-schema'

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12_000,
  validateStatus: (status) => status < 500,
})

export async function postApplication(payload: unknown): Promise<SubmitResult> {
  const response = await apiClient.post<SubmitResult>('/applications', payload)
  if (response.data && typeof response.data === 'object' && 'ok' in response.data) {
    return response.data
  }
  return { ok: false, error: 'unavailable' }
}
