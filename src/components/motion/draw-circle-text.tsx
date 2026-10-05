import { cn } from '@/lib/cn'

type DrawCircleTextProps = {
  text: string
  className?: string
  stroke?: string
}

export function DrawCircleText({ text, className, stroke = '#ffffff' }: DrawCircleTextProps) {
  return (
    <span className={cn('relative inline-block px-5 py-3', className)}>
      {text}
      <svg
        className="pointer-events-none absolute top-1/2 left-1/2 h-[180%] w-[150%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        viewBox="0 0 280 100"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="140"
          cy="50"
          rx="128"
          ry="38"
          stroke={stroke}
          strokeWidth="2.5"
          className="origin-center motion-safe:[stroke-dasharray:520] motion-safe:[stroke-dashoffset:520] motion-safe:animate-[circle-draw_1.1s_ease-out_forwards]"
        />
      </svg>
    </span>
  )
}
