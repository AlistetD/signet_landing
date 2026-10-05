import { BrandWordmark } from '@/components/ui/brand-wordmark'
import { landingContent } from '@/content/landing'

export function SiteFooter() {
  const footer = landingContent.footer
  const year = new Date().getFullYear()

  return (
    <footer className="glass mt-[clamp(1rem,3vh,2rem)] rounded-none pb-[var(--safe-bottom)]">
      <div className="page-gutter mx-auto flex max-w-6xl flex-col gap-5 py-[clamp(1.5rem,4vh,2.5rem)] text-sm text-muted">
        <a
          href={`#${landingContent.apply.id}`}
          className="flex min-h-11 items-center gap-3"
          aria-label="SigNet"
        >
          <img src="/brand/mark.png" alt="" className="size-8 sm:size-9" />
          <BrandWordmark />
        </a>
        <p>
          © {footer.copyrightName}, {year}
        </p>
        <p className="text-xs text-subtle">{footer.legalName}</p>
        <div className="flex flex-col gap-1 md:flex-row md:gap-6">
          <a href={footer.phoneHref} className="inline-flex min-h-11 items-center font-semibold text-fg">
            {footer.phoneLabel}
          </a>
          <a
            href={`mailto:${footer.email}`}
            className="inline-flex min-h-11 items-center font-semibold text-fg"
          >
            {footer.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
