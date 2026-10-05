import { cn } from '@/lib/cn'

type SliderToggleProps = {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  id: string
}

export function SliderToggle({ checked, onChange, label, id }: SliderToggleProps) {
  return (
    <div className="flex min-h-11 items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-signet-red' : 'bg-fg/20',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </button>
      <label htmlFor={id} className="cursor-pointer text-sm leading-snug text-muted">
        {label}
      </label>
    </div>
  )
}
