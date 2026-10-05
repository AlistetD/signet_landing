import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { createFileInbox } from './adapters/hr-inbox.ts'
import { createApp } from './app.ts'
import { createRateLimiter } from './apply.ts'

const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT ?? (isProduction ? 3000 : 3001))

const app = createApp({
  inbox: createFileInbox(),
  rateLimiter: createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 }),
  hrApiKey: process.env.LANDING_API_KEY ?? '',
})

if (isProduction) {
  app.use('/*', serveStatic({ root: './dist' }))
  app.get('*', serveStatic({ path: './dist/index.html' }))
}

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.info(`Apply API listening on http://127.0.0.1:${info.port}`)
})
