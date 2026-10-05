---
name: docs-map
description: Keep DOCS/ as the navigation layer for this repo. Use when starting a session, adding a module, changing a public interface, resolving a domain term, or writing an ADR.
---

# Docs map

## Steps

1. Read `DOCS/INDEX.md`. Stop if the task is already answered there.
2. Open only the linked file for the area you will change (`GLOSSARY`, `ARCHITECTURE`, `FRONTEND`, `BACKEND`, `CONTENT`, `DECISIONS`).
3. Change code and the matching doc in the same turn when a public interface, folder, or domain term moves.
4. Done when INDEX still points at the real files and the glossary term matches the names in code.

## Paths (this repo)

| Skill default | Here |
|---|---|
| `CONTEXT.md` | `DOCS/GLOSSARY.md` |
| `docs/adr/` | `DOCS/DECISIONS/` |

## ADR bar

Write `DOCS/DECISIONS/NNNN-slug.md` only when the choice is hard to reverse, surprising without context, and a real trade-off. Number from the highest existing file.

## Do not

Restate `package.json` scripts or paste a second file tree. Point to the path.
