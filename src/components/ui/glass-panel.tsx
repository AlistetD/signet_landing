import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type GlassTag = 'div' | 'article' | 'section' | 'header' | 'footer' | 'dl'

type GlassPanelProps = {
  as?: GlassTag
  className?: string
  children: ReactNode
  id?: string
}

export function GlassPanel({ as: Tag = 'div', className, children, id }: GlassPanelProps) {
  return (
    <Tag id={id} className={cn('glass', className)}>
      {children}
    </Tag>
  )
}
