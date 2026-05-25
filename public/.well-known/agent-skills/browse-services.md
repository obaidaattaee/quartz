# Skill: Browse Quartz Solutions services

Read the catalogue of services Quartz Solutions offers.

## Endpoint

GET `https://quartz-solutions.net/{locale}/services/{slug}`

`locale` ∈ `{en, ar}`. `slug` is one of:

- `development` — custom line-of-business software
- `web-development` — marketing + product web
- `mobile-apps` — iOS / Android, native + cross-platform
- `qa` — automated and manual quality engineering
- `cybersecurity` — pentest, SOC augmentation, human-risk training
- `automation` — workflow engines, RPA, ops tooling

## Headers

Send `Accept: text/markdown` to receive a markdown body suitable for ingestion (this site implements Markdown for Agents content negotiation). HTML is the default.

## Response

Service page with title, description, features list, FAQs, and an inline CTA back to the contact form. See `contact.md` to submit an inquiry from the same flow.
