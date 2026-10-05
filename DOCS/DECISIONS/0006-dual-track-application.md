# Dual-track Application: store and office

Marketing asked for two apply tracks on the same Landing: store consultant and office specialist. The Application is now a discriminated union (`track: store | office`). Store collects phone, city, and preferred call time. Office collects city, desired position, and phone or email. Age is no longer collected; adult hiring stays a policy, not a form field.

Idempotency and rate limits key off contact (phone, else email) plus city, so an email-only office Application still de-dupes.

**Status:** superseded by [0008-unified-application.md](./0008-unified-application.md)  
**Date:** 2026-09-22  
**Supersedes:** [0005-age-eighteen.md](./0005-age-eighteen.md)
