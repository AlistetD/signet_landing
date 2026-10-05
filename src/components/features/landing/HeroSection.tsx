import { ShimmerButton } from '@/components/ui/shimmer-button'
import { landingContent } from '@/content/landing'

export function HeroSection() {
  const hero = landingContent.hero

  return (
    <section className="page-gutter pt-[clamp(0.5rem,1.4vh,1rem)]">
      <div className="relative mx-auto flex min-h-[min(28rem,calc(100svh-var(--header-h)-var(--safe-top)-2rem))] max-w-[1600px] flex-col justify-center py-[clamp(1.5rem,6vh,3rem)] text-fg md:aspect-video md:min-h-0 md:max-h-[calc(100svh-var(--header-h)-var(--safe-top)-1.25rem)] md:px-[clamp(2rem,8vw,6rem)]">
        <div className="relative max-w-4xl md:ml-[10%] lg:ml-[14%] dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_8px_24px_rgba(0,0,0,0.28)]">
          <h1 className="type-hero max-w-4xl leading-[1.25] tracking-[0.02em] uppercase">{hero.title}</h1>
          <p className="type-lead mt-[clamp(0.75rem,2.4vh,1.5rem)] max-w-2xl leading-relaxed normal-case tracking-normal">
            {hero.lead}
          </p>
          <ShimmerButton
            href={`#${landingContent.apply.id}`}
            className="mt-[clamp(1rem,3vh,2rem)] min-h-11 px-6 py-3 text-base font-semibold uppercase tracking-wide [text-shadow:none] md:min-h-12 md:px-7 md:py-3.5 md:text-lg"
          >
            {hero.cta}
          </ShimmerButton>
        </div>
      </div>
    </section>
  )
}
