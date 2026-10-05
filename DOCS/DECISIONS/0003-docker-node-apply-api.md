# Docker-shaped Apply API, Vite only for the SPA

Local and production must share the same HTTP process: a Node server (Hono) that serves the Apply API and, in production, the built SPA. Vite is the frontend bundler and the local HMR tool — not the production server. A Vite-only `/api` middleware was rejected: it would not match the Docker host where the app will run. The SPA calls the API with a relative `/api` path so localhost and Docker need no public CORS dance.

**Status:** accepted  
**Date:** 2026-09-22
