import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

type CitySelectProps = {
  id: string
  name: string
  value: string
  options: readonly string[]
  placeholder: string
  onBlur: () => void
  onChange: (city: string) => void
  className?: string
}

export function CitySelect({
  id,
  name,
  value,
  options,
  placeholder,
  onBlur,
  onChange,
  className,
}: CitySelectProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const activeIndexRef = useRef(0)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  activeIndexRef.current = activeIndex

  const close = () => {
    setOpen(false)
    onBlur()
  }

  const selectCity = (city: string) => {
    onChange(city)
    setOpen(false)
    onBlur()
  }

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      const last = options.length - 1
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        onBlur()
        return
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex((current) => Math.min(last, current + 1))
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex((current) => Math.max(0, current - 1))
        return
      }
      if (event.key === 'Home') {
        event.preventDefault()
        setActiveIndex(0)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        setActiveIndex(last)
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const city = options[activeIndexRef.current]
        if (city) {
          onChange(city)
          setOpen(false)
          onBlur()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onBlur, onChange, open, options])

  useEffect(() => {
    if (!open) {
      return
    }
    document.getElementById(`${id}-city-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, id, open])

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(className, 'flex items-center justify-between gap-3 text-left')}
        onClick={() => {
          setActiveIndex(Math.max(0, options.indexOf(value)))
          setOpen(true)
        }}
      >
        <span className={value ? 'text-fg' : 'text-subtle'}>{value || placeholder}</span>
        <ChevronDown className="size-5 shrink-0 text-muted" aria-hidden="true" strokeWidth={1.75} />
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-[55] flex items-end justify-center p-0 md:items-center md:p-4">
              <button
                type="button"
                className="absolute inset-0 bg-signet-black/55"
                aria-label="Закрыть список городов"
                onClick={close}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="glass relative flex max-h-[min(80dvh,32rem)] w-full max-w-md flex-col rounded-t-[1.25rem] md:rounded-[1.25rem]"
              >
                <div className="flex shrink-0 items-center gap-3 border-b border-[color:var(--glass-border)] px-4 pt-[calc(var(--safe-top)+0.75rem)] pb-3 md:pt-4">
                  <h2
                    id={titleId}
                    className="flex-1 font-display text-lg font-extrabold uppercase tracking-[0.04em] text-fg"
                  >
                    {placeholder}
                  </h2>
                  <button
                    ref={closeRef}
                    type="button"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-fg"
                    aria-label="Закрыть список городов"
                    onClick={close}
                  >
                    ×
                  </button>
                </div>
                <ul
                  role="listbox"
                  aria-labelledby={titleId}
                  aria-activedescendant={`${id}-city-${activeIndex}`}
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 pb-[calc(var(--safe-bottom)+0.5rem)] [-webkit-overflow-scrolling:touch]"
                >
                  {options.map((city, index) => {
                    const selected = city === value
                    const active = index === activeIndex
                    return (
                      <li key={city} className="list-none">
                        <button
                          id={`${id}-city-${index}`}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={cn(
                            'flex min-h-11 w-full items-center rounded-xl px-4 text-left text-base text-fg',
                            selected && 'bg-signet-red text-white',
                            !selected && active && 'bg-field',
                            !selected && 'fine-hover:bg-field',
                          )}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectCity(city)}
                        >
                          {city}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
