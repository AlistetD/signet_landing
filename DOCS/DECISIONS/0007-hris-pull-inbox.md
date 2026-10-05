# HRIS pulls Applications from a Bearer inbox

HRIS cannot receive inbound webhooks (no public site). It already polls HH.ru and Rabota.by, so the Landing exposes `GET /api/hr/applications` with `Authorization: Bearer`. HRIS sends `since` (last `createdAt`) and `limit`; there is no read-receipt. Direct browser→HRIS calls stay rejected.

**Status:** accepted  
**Date:** 2026-09-25
