import { cn } from '@/lib/cn'

type BrandWordmarkProps = {
  className?: string
}

/**
 * Light and dark lockups are stacked and swapped with `html.dark` so the
 * black plate never flashes on a theme change.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={cn('brand-wordmark', className)} aria-hidden="true">
      <img src="/brand/wordmark-light.png" alt="" className="brand-wordmark-on-light" />
      <img src="/brand/wordmark-dark.png" alt="" className="brand-wordmark-on-dark" />
    </span>
  )
}
