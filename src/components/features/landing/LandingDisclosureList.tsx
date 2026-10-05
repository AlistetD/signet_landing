export type LandingDisclosureItem = {
  question: string
  answer: string
}

type LandingDisclosureListProps = {
  items: readonly LandingDisclosureItem[]
}

export function LandingDisclosureList({ items }: LandingDisclosureListProps) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="glass group rounded-[1.25rem] px-[clamp(0.85rem,3vw,1.25rem)] py-1"
        >
          <summary className="type-card min-h-11 cursor-pointer list-none py-3 font-display select-none marker:content-none">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <span aria-hidden="true" className="text-signet-red group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden text-signet-red group-open:inline">
                −
              </span>
            </span>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
