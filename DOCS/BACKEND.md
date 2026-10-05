# Backend

Apply API lives in this repository on **Hono + Node**. Same entry file locally (`localhost`) and in Docker. Vite never owns the production HTTP port.

## Public interface

`submitApplication` in `server/apply.ts`:

```ts
submitApplication(input: unknown): Promise<
  { ok: true } | { ok: false; error: 'validation' | 'rate_limit' | 'unavailable' }
>
```

HTTP: `POST /api/applications`. Browser uses a relative `/api` prefix.

HRIS pull: `GET /api/hr/applications`. `Authorization: Bearer <LANDING_API_KEY>`. Query `since` (ISO-8601, optional, inclusive) and `limit` (default/max 100). Sort `createdAt`, then `id`. Response `{ items, hasMore }`. No read-receipt. Do not put the key in `VITE_*` or the client. Missing/short key → 503; bad Bearer → 401.

The payload is a single `Application` (name, +375 phone, city, position, optional resume URL, PDN). See `src/lib/application-schema.ts`. Each stored row gets a stable `id` (UUID) at deliver time. `GET /api/hr/applications` maps new rows as `track: 'general'`; legacy file-inbox rows keep `store` / `office`.

Local: Vite on 5173, Hono on 3001 (proxy `/api`).  
Docker: multi-stage `Dockerfile` — `pnpm build`, then one Node process (`pnpm start`) serves `dist/` + `/api` on port 3000.

## Must-haves

- Runtime validation via `applicationSchema`.
- Rate limit by IP + contact key (phone).
- No secrets in `VITE_*`.
- PII: do not log raw phone/name/email.
- Idempotency: same contact + city in a 10-minute window is not delivered twice.
- Adapter timeout surfaces as `unavailable`.
- `resumeUrl`, if present, must be `http://` or `https://`.

## HR adapter

`deliverApplication` writes to `data/applications.json` (`server/adapters/hr-inbox.ts`). HRIS lists that inbox via `GET /api/hr/applications` (`server/hr-export.ts`). See [DECISIONS/0007-hris-pull-inbox.md](./DECISIONS/0007-hris-pull-inbox.md).
