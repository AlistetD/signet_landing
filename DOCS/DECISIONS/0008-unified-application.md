# Unified Application form

Marketing dropped the store / office switch. One form collects name, +375 phone, city, desired position, optional resume URL, and PDN consent. Call time and email are gone. HRIS still sees legacy `track: store | office` rows in the file inbox; new rows export as `track: general`.

Idempotency and rate limits key off phone plus city.

**Status:** accepted  
**Date:** 2026-09-29  
**Supersedes:** [0006-dual-track-application.md](./0006-dual-track-application.md)
