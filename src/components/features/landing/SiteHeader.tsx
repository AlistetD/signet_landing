import { BrandWordmark } from '@/components/ui/brand-wordmark'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { landingContent } from '@/content/landing'

export function SiteHeader() {
  return (
    <header className="glass-nav sticky top-0 z-40 pt-[var(--safe-top)] text-fg">
      <div className="page-gutter mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-2 sm:gap-4">
        <a href="#form" className="flex min-h-11 items-center gap-3" aria-label="SigNet">
          <img src="/brand/mark.png" alt="" className="size-8 sm:size-9" />
          <span className="hidden md:inline-flex">
            <BrandWordmark />
          </span>
        </a>
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <ShimmerButton
            href={`#${landingContent.apply.id}`}
            className="min-h-11 px-3 py-0 text-xs font-semibold uppercase tracking-wide sm:px-4 sm:text-sm"
          >
            {landingContent.hero.cta}
          </ShimmerButton>
        </div>
      </div>
    </header>
  )
}
