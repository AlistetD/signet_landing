import { useEffect, useId, useRef } from 'react'
import { landingContent } from '@/content/landing'
import { privacyPolicy, type PrivacyBlock } from '@/content/privacy-policy'
import { cn } from '@/lib/cn'

export type PrivacyPolicyIntent = 'consent' | 'read'

type PrivacyPolicyDialogProps = {
  intent: PrivacyPolicyIntent
  onClose: () => void
  onConfirm: () => void
}

export function PrivacyPolicyDialog({ intent, onClose, onConfirm }: PrivacyPolicyDialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const footer = landingContent.footer
  const ackLabel = intent === 'consent' ? landingContent.apply.consentAck : footer.privacyClose

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) {
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 md:items-center md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-signet-black/55"
        aria-label={footer.privacyCloseAria}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass relative flex max-h-[100dvh] w-full max-w-3xl flex-col rounded-none md:max-h-[min(90dvh,52rem)] md:rounded-[1.25rem]"
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-[color:var(--glass-border)] px-[clamp(1rem,4vw,1.5rem)] pt-[calc(var(--safe-top)+0.75rem)] pb-3 md:pt-4">
          <h2
            id={titleId}
            className="type-title min-w-0 flex-1 font-display font-extrabold uppercase leading-tight tracking-[0.04em] text-fg"
          >
            {privacyPolicy.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-fg"
            aria-label={footer.privacyCloseAria}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[clamp(1rem,4vw,1.5rem)] py-4 [-webkit-overflow-scrolling:touch]">
          {privacyPolicy.sections.map((section) => (
            <section key={section.heading} className="mb-6 last:mb-2">
              <h3 className="text-base font-extrabold uppercase tracking-[0.03em] text-fg">{section.heading}</h3>
              {section.blocks.map((block, index) => (
                <PolicyBlock key={`${section.heading}-${index}`} block={block} />
              ))}
            </section>
          ))}
        </div>
        <div className="shrink-0 border-t border-[color:var(--glass-border)] px-[clamp(1rem,4vw,1.5rem)] pt-3 pb-[calc(var(--safe-bottom)+0.75rem)] md:pb-4">
          <button
            type="button"
            className="h-12 min-h-11 w-full rounded-full bg-signet-red font-semibold uppercase tracking-wide text-white transition fine-hover:brightness-110"
            onClick={intent === 'consent' ? onConfirm : onClose}
          >
            {ackLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function PolicyBlock({ block }: { block: PrivacyBlock }) {
  if (block.type === 'paragraph') {
    return <p className="mt-3 text-sm leading-relaxed text-muted">{block.text}</p>
  }

  if (block.type === 'terms') {
    return (
      <dl className="mt-3 space-y-3">
        {block.items.map((item) => (
          <div key={item.term}>
            <dt className="text-sm font-bold text-fg">{item.term}</dt>
            <dd className="text-sm leading-relaxed text-muted">{item.definition}</dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <ul className={cn('mt-3 space-y-2 pl-5 text-sm leading-relaxed text-muted', 'list-disc marker:text-signet-red')}>
      {block.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
