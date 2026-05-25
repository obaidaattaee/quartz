# Skill: Submit a project inquiry to Quartz Solutions

Use this skill to send a structured project inquiry to Quartz Solutions. A
principal engineer responds in writing within 48 hours.

## Endpoint

POST `https://quartz-solutions.net/{locale}/contact`

`locale` is either `en` or `ar`.

## Headers

- `Content-Type: application/x-www-form-urlencoded` (or `application/json` with `Accept: application/json`)
- `Accept: application/json` — recommended for agents so validation errors return as JSON instead of an HTML re-render
- `X-CSRF-TOKEN` — required only for browser/session-cookie requests; agents authenticating via a stateless flow can omit

## Request body

| Field    | Type   | Required | Notes                                             |
|----------|--------|----------|---------------------------------------------------|
| name     | string | yes      | Contact name, ≤ 120 chars                         |
| company  | string | yes      | Company / organisation, ≤ 120 chars               |
| email    | string | yes      | Valid email address                               |
| scope    | string | yes      | One of: `Software build`, `Automation`, `QA`, `Cybersecurity`, `Discovery / advisory` |
| msg      | string | no       | Free-form message, ≤ 2000 chars                   |

## Success response

`302` redirect back to the contact page with a session flash `wasSuccessful = true`, or `200 OK` with `{"ok": true}` when `Accept: application/json`.

## Error response

`422 Unprocessable Entity` with `{"errors": {"<field>": ["<message>"]}}` when fields fail validation. Rate-limited per IP (`throttle:contact`); on limit hit returns `429`.

## Side effects

Sends an email to `hello@quartz-solutions.net`. No CRM record is created automatically.
