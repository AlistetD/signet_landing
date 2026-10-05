import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import { cn } from '@/lib/cn'

type ShimmerButtonProps = ComponentPropsWithoutRef<'a'> & {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

/**
 * Magic UI Shimmer Button, copied for Vite. Renders as a link: the careers CTA jumps to `#form`.
 */
export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '100px',
  background = '#ed1c24',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <a
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as CSSProperties
      }
      className={cn(
        'shimmer-cta group relative z-0 inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white select-none [border-radius:var(--radius)] [background:var(--bg)]',
        'transform-gpu fine-hover:brightness-110',
        className,
      )}
      {...props}
    >
      <div className="-z-30 blur-[2px] @container-[size] pointer-events-none absolute inset-0 overflow-visible">
        <div className="motion-safe:animate-shimmer-slide absolute inset-0 aspect-square h-[100cqh] rounded-none [mask:none]">
          <div className="motion-safe:animate-spin-around absolute -inset-full w-auto rotate-0 [translate:0_0] [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      <span className="relative z-10">{children}</span>
      <div
        className={cn(
          'pointer-events-none absolute inset-0 size-full rounded-[inherit]',
          'shadow-[inset_0_-8px_10px_#ffffff1f]',
          'transform-gpu transition-shadow duration-[120ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)]',
          'group-fine-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
          'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
        )}
      />
      <div className="pointer-events-none absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </a>
  )
}
