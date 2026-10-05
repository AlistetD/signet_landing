import { Star } from 'lucide-react'
import { GlassPanel } from '@/components/ui/glass-panel'
import { landingContent } from '@/content/landing'

export function ProofSection() {
  const proof = landingContent.proof

  return (
    <section className="page-gutter section-y mx-auto max-w-6xl">
      <GlassPanel className="rounded-[1.25rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.25rem,3vh,2.5rem)]">
        <h2 className="type-title max-w-3xl uppercase">{proof.title}</h2>
        <p className="type-lead mt-[clamp(0.75rem,2vh,1.25rem)] max-w-3xl leading-relaxed text-muted">
          {proof.intro}
        </p>
        <p className="type-rating mt-[clamp(1rem,3vh,2rem)] flex items-end gap-2 font-display md:gap-3">
          <Star
            className="mb-1 size-7 fill-signet-red text-signet-red md:mb-3 md:size-14"
            aria-hidden="true"
          />
          <span>
            {proof.rating}
            <span className="text-signet-red">/5</span>
          </span>
        </p>
        <blockquote className="mt-[clamp(1.25rem,3.5vh,2.5rem)] max-w-2xl">
          <p className="type-quote leading-relaxed">«{proof.quote}»</p>
          <footer className="mt-3 text-sm text-muted md:mt-4">— {proof.cite}</footer>
        </blockquote>
      </GlassPanel>
    </section>
  )
}
