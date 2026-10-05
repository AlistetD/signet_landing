import { createFileRoute, type ErrorComponentProps } from '@tanstack/react-router'
import { ApplyForm } from '@/components/features/apply/ApplyForm'
import { FaqSection } from '@/components/features/landing/FaqSection'
import { HeroSection } from '@/components/features/landing/HeroSection'
import { HowItWorksSection } from '@/components/features/landing/HowItWorksSection'
import { JobPostingJsonLd } from '@/components/features/landing/JobPostingJsonLd'
import { PlasmaBackground } from '@/components/features/landing/PlasmaBackground'
import { ProofSection } from '@/components/features/landing/ProofSection'
import { SiteFooter } from '@/components/features/landing/SiteFooter'
import { SiteHeader } from '@/components/features/landing/SiteHeader'

export const Route = createFileRoute('/')({
  component: HomePage,
  errorComponent: HomeError,
})

function HomeError({ error }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка'

  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-fg">
      <h1 className="text-3xl">Страница временно недоступна</h1>
      <p className="mt-4 text-muted">{message}</p>
      <a href="/" className="mt-8 inline-flex text-signet-red">
        На главную
      </a>
    </main>
  )
}

function HomePage() {
  return (
    <>
      <PlasmaBackground />
      <JobPostingJsonLd />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <ProofSection />
        <HowItWorksSection />
        <div className="page-gutter section-y mx-auto max-w-2xl">
          <ApplyForm />
        </div>
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
