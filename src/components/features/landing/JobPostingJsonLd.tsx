import { landingContent } from '@/content/landing'

export function JobPostingJsonLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: landingContent.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const job = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: 'Продавец-консультант в магазин',
    description: landingContent.meta.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'SigNet',
      legalName: landingContent.footer.legalName,
      sameAs: 'https://signet.by',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BY',
      },
    },
    employmentType: 'FULL_TIME',
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(job)}</script>
      <script type="application/ld+json">{JSON.stringify(faq)}</script>
    </>
  )
}
