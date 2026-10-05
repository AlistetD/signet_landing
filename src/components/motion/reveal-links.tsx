import { cn } from '@/lib/cn'

type RevealLinksProps = {
  items: ReadonlyArray<{ href: string; label: string }>
  className?: string
  hoverClassName?: string
}

export function RevealLinks({
  items,
  className,
  hoverClassName = 'text-signet-red',
}: RevealLinksProps) {
  return (
    <nav aria-label="Навигация" className={cn('hidden items-center gap-6 md:flex', className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group relative overflow-hidden text-sm font-semibold tracking-wide uppercase"
        >
          <span className="block transition-transform duration-300 group-hover:-translate-y-full">
            {item.label}
          </span>
          <span
            className={cn(
              'absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0',
              hoverClassName,
            )}
          >
            {item.label}
          </span>
        </a>
      ))}
    </nav>
  )
}
