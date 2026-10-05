import { Outlet, createRootRoute, type ErrorComponentProps } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: LandingError,
  notFoundComponent: LandingNotFound,
})

function RootLayout() {
  return <Outlet />
}

function LandingError({ error }: ErrorComponentProps) {
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

function LandingNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-fg">
      <h1 className="text-3xl">Страница не найдена</h1>
      <a href="/" className="mt-8 inline-flex text-signet-red">
        На главную
      </a>
    </main>
  )
}
