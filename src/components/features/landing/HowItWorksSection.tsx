import { ClipboardPen, Handshake, PhoneCall, type LucideIcon } from 'lucide-react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { StationMark } from '@/components/ui/station-mark'
import { landingContent } from '@/content/landing'
import { cn } from '@/lib/cn'

const STEP_ICONS = {
  apply: ClipboardPen,
  call: PhoneCall,
  meet: Handshake,
} as const satisfies Record<(typeof landingContent.path.steps)[number]['id'], LucideIcon>

export function HowItWorksSection() {
  const path = landingContent.path
  const lastIndex = path.steps.length - 1

  return (
    <section className="page-gutter section-y mx-auto max-w-6xl">
      <GlassPanel className="rounded-[1.25rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,3vh,2.5rem)]">
        <h2 className="type-title tracking-[0.02em] uppercase">{path.title}</h2>

        <ol className="relative mt-[clamp(1.5rem,4vh,2.5rem)] grid gap-0 md:grid-cols-3 md:gap-6">
          <span
            aria-hidden="true"
            className="path-spine path-spine-x absolute top-6 right-[16.5%] left-[16.5%] hidden h-0.5 md:block"
          />

          {path.steps.map((step, index) => {
            const Icon = STEP_ICONS[step.id]
            const isLast = index === lastIndex
            return (
              <li
                key={step.id}
                className="relative grid grid-cols-[auto_1fr] items-start gap-4 md:grid-cols-1 md:justify-items-center md:text-center"
              >
                <div className="flex flex-col items-center self-stretch md:self-auto">
                  <StationMark>
                    <Icon className="size-5 md:size-6" strokeWidth={1.75} aria-hidden="true" />
                  </StationMark>
                  {isLast ? null : (
                    <span
                      aria-hidden="true"
                      className="path-spine path-spine-y mt-1 w-0.5 flex-1 md:hidden"
                    />
                  )}
                </div>
                <div className={cn('min-w-0 pt-1 md:pt-4 md:pb-0', isLast ? 'pb-0' : 'pb-8')}>
                  <h3 className="type-card leading-snug uppercase">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </GlassPanel>
    </section>
  )
}
