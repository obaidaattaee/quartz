# Skill: Subscribe an email address to the Quartz newsletter

Subscribes an email address to the monthly Quartz Solutions engineering newsletter.

## Endpoint

POST `https://quartz-solutions.net/{locale}/newsletter/subscribe`

## Request body

| Field | Type   | Required | Notes               |
|-------|--------|----------|---------------------|
| email | string | yes      | Valid email address |

## Success response

`200 OK` with `{"ok": true}` when `Accept: application/json`.

## Error response

`422 Unprocessable Entity` if the email is malformed or already subscribed.

## Side effects

The address is added to a transactional mailing list. Confirmation email may be required depending on jurisdiction (GDPR / CAN-SPAM).
