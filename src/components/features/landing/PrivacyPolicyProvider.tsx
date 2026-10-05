import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  PrivacyPolicyDialog,
  type PrivacyPolicyIntent,
} from '@/components/features/landing/PrivacyPolicyDialog'

export type { PrivacyPolicyIntent }

type OpenPrivacyPolicy = (intent: PrivacyPolicyIntent, onConfirm?: () => void) => void

type PrivacyPolicyContextValue = {
  openPrivacyPolicy: OpenPrivacyPolicy
}

const PrivacyPolicyContext = createContext<PrivacyPolicyContextValue | null>(null)

export function PrivacyPolicyProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<PrivacyPolicyIntent | null>(null)
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)

  const close = useCallback(() => {
    setIntent(null)
    setOnConfirm(null)
  }, [])

  const openPrivacyPolicy = useCallback<OpenPrivacyPolicy>((nextIntent, confirm) => {
    setOnConfirm(() => confirm ?? null)
    setIntent(nextIntent)
  }, [])

  const confirm = useCallback(() => {
    onConfirm?.()
    close()
  }, [close, onConfirm])

  const value = useMemo(() => ({ openPrivacyPolicy }), [openPrivacyPolicy])

  return (
    <PrivacyPolicyContext value={value}>
      {children}
      {intent ? (
        <PrivacyPolicyDialog intent={intent} onClose={close} onConfirm={confirm} />
      ) : null}
    </PrivacyPolicyContext>
  )
}

export function usePrivacyPolicy() {
  const value = use(PrivacyPolicyContext)
  if (!value) {
    throw new Error('usePrivacyPolicy must be used within PrivacyPolicyProvider')
  }
  return value
}
