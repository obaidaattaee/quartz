# Skill: Browse Quartz Solutions case studies

List published case studies with outcomes.

## Endpoints

- List: GET `https://quartz-solutions.net/{locale}/portfolio`
- Detail: GET `https://quartz-solutions.net/{locale}/portfolio/{slug}`

`locale` ∈ `{en, ar}`.

## Headers

Send `Accept: text/markdown` on the detail endpoint to receive the case study as markdown (title, outcome headline, challenge / approach / results sections). The detail endpoint also returns a structured `featuredCase` payload for Inertia clients.

## Notable slugs

- `quartz-pos-platform` — internal product, end-to-end retail OS
- `ecommerce-platform-redesign` — legacy PHP → Laravel + React, +35% conversion
- `devops-pipeline-automation` — 4h manual deploys → 15min automated, zero downtime
- `security-audit-hardening` — HIPAA compliance, 47+ findings remediated
