import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type GradientCardProps = {
  title: string
  body: string
  children?: ReactNode
  className?: string
}

export function GradientCard({ title, body, children, className }: GradientCardProps) {
  return (
    <article className={cn('glass relative overflow-hidden rounded-[1.25rem] p-6', className)}>
      <h3 className="text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
      {children}
    </article>
  )
}
