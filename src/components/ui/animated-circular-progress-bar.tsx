import { cn } from '@/lib/cn'

type AnimatedCircularProgressBarProps = {
  value: number
  min?: number
  max?: number
  gaugePrimaryColor: string
  gaugeSecondaryColor: string
  className?: string
  label?: string
}

export function AnimatedCircularProgressBar({
  value,
  min = 0,
  max = 100,
  gaugePrimaryColor,
  gaugeSecondaryColor,
  className,
  label,
}: AnimatedCircularProgressBarProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className={cn('relative size-28', className)} role="img" aria-label={label ?? `${Math.round(percent)}%`}>
      <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={gaugeSecondaryColor}
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={gaugePrimaryColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-500"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-lg font-extrabold">
        {label ?? `${Math.round(percent)}%`}
      </span>
    </div>
  )
}
