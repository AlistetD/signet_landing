# Architecture

Job-first careers Landing: one Russian page, in-repo Apply API on a Node/Hono process that matches Docker, HR adapter as a replaceable seam.

## Shape

```
Candidate → Landing (React SPA) → Apply API (Hono on Node) → HR adapter (file inbox)
                                                              ↑
                                          HRIS polls GET /api/hr/applications (Bearer)
```

Three deep modules (small interface, hidden implementation):

1. **Content** — vacancy copy and Store list. Callers read typed data. They do not fetch HTML or hardcode cities.
2. **Apply** — `submitApplication(input) → Result`. Validates, rate-limits, persists/forwards. The form never talks to the HR app.
3. **HR adapter** — persist a valid Application in the file inbox. HRIS pulls `GET /api/hr/applications` with Bearer auth. The form never talks to HRIS.

## Seams (real vs hypothetical)

| Seam | Why it is real |
|---|---|
| Content vs UI | Store list and copy arrive later and will change without UI rewrites |
| Apply vs HR adapter | HRIS polls the inbox; swapping storage must not touch the form |
| Browser vs Apply API | Secrets, rate limits, and PII handling stay off the client |
| Vite vs Node process | Local HMR vs Docker-identical HTTP server |

Do not add extra seams (candidate accounts, i18n) until a second public site exists. The Application is one payload for every role. HRIS pull is the read side of the HR adapter, not a second product.

## Non-goals for v1

- Multi-page careers portal
- i18n
- Candidate accounts
- Direct browser calls to the internal HR app

## Related

- Product choice: [DECISIONS/0001-job-first-single-page.md](./DECISIONS/0001-job-first-single-page.md)
- Apply payload: [DECISIONS/0008-unified-application.md](./DECISIONS/0008-unified-application.md)
- Apply + Docker: [DECISIONS/0003-docker-node-apply-api.md](./DECISIONS/0003-docker-node-apply-api.md)
- Apply flow: [BACKEND.md](./BACKEND.md)
- HRIS pull: [DECISIONS/0007-hris-pull-inbox.md](./DECISIONS/0007-hris-pull-inbox.md)
- Page sections: [FRONTEND.md](./FRONTEND.md)
