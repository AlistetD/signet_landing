import { LandingDisclosureList } from '@/components/features/landing/LandingDisclosureList'
import { landingContent } from '@/content/landing'

export function FaqSection() {
  const faq = landingContent.faq

  return (
    <section id={faq.id} className="page-gutter section-y scroll-anchor mx-auto max-w-3xl">
      <LandingDisclosureList items={faq.items} />
    </section>
  )
}
