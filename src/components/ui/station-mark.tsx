import type { ReactNode } from 'react'

type StationMarkProps = {
  children: ReactNode
}

export function StationMark({ children }: StationMarkProps) {
  return (
    <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-signet-red text-white shadow-[0_8px_20px_rgb(237_28_36_/_0.35)] md:size-14">
      {children}
    </span>
  )
}
