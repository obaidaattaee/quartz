# Services pages: inspiration brief

Scope: `/{locale}/services` and the six detail pages (development, automation,
web-development, mobile-apps, qa, cybersecurity). Audience: Gulf B2B buyers
(founders, ops managers, CTOs at SMEs and mid-size companies). Arabic first.

## References studied

- thoughtbot services: https://thoughtbot.com/services
- Netguru, software development: https://www.netguru.com/services/software-development
- Fueled services: https://www.fueled.com/services
- Clay services: https://clay.global/services
- Instrument: https://www.instrument.com/
- Zapier Experts directory (how automation partners pitch): https://www.zapier.com/experts
- Element8, Saudi software development: https://www.element8.sa/software-development-company-saudi
- Riyadh agencies (B-IT, Code7x, SDE) via search: https://b-it.co/ar/locations/riyadh, https://code7x.sa/
- Dribbble tags: https://dribbble.com/tags/services_page, https://dribbble.com/tags/service-details
  (shots do not render when fetched, so only titles and descriptions were used)
- Engagement-model write-ups: https://www.broworks.net/blog/webflow-agency-pricing-models-retainer-fixed-scope-and-sprint-compared,
  https://phosailabs.com/blog/ai-consulting-engagement-models

## What we adopt, and why

1. **Route by problem, not by catalogue** (Zapier Experts, thoughtbot "stages").
   Buyers arrive with a pain ("we re-type orders into the ERP"), not a service
   name. The index opens with a problem-to-service guide.
2. **Who it is for, in the hero** (thoughtbot). One plain line naming roles and
   company stage. Removes the "is this for me?" doubt before scrolling.
3. **Pain then change, side by side** (Netguru "Top challenges"). Each pain is
   written in the client's words and paired with what changes. Scannable on mobile.
4. **Deliverables as concrete things you can hold** (Clay lists 4 to 6 per
   service). Repos, dashboards, reports, runbooks. No abstract nouns.
5. **A staged way in** (Element8 engagement models, the 2026 "hybrid" standard:
   fixed discovery, then build, then retainer). Matches our homepage FAQ:
   fixed scope for discovery, capped build, monthly retainer. "You know the
   ceiling before you sign" is repeated where the decision happens.
6. **Process with durations, not just verbs**. Most agency pages list
   "Discover / Design / Build" with no time. Durations make it a plan.
7. **Local specifics as a quiet trust signal** (Element8, Riyadh agencies):
   Arabic and RTL by default, ZATCA e-invoicing, local payment gateways
   (mada, Apple Pay, STC Pay), PDPL-aware data handling, NCA ECC as a
   reference framework. Mentioned as things we build for, never as certifications.
8. **Proof without logos**. Netguru and Clay lean on logos and staff counts.
   We cannot, so we use the two real numbers (13+ live products, 500K+ users)
   and say what they mean, plus a link to the Work page.
9. **Service-specific FAQ near the end** (Netguru, 6 questions). Answers the
   procurement questions: ownership, timeline, Arabic support, what if we
   already have a team.
10. **One CTA verb, repeated** (Netguru repeats "Estimate project" three
    times). Every page ends in a contact link with the service preselected,
    and mobile gets a slim sticky CTA once the hero scrolls away.

## What we reject

- Logo walls, award badges, staff counts, client quotes (none are real yet).
- Image carousels and stock photos (Fueled, Instrument). We use line diagrams.
- Flat lists of six equal cards. Web and mobile sit under Software development.

## Blueprint (a): services index

1. Hero: h1 promise, one paragraph on what the page is for, two actions
   (find your service, book a call).
2. Problem guide: "Which one do you need?" Six pains as buttons; the panel
   names the service, why, and the first step, with a link.
3. The four disciplines: Development and Automation as large panels
   (web and mobile are entry points inside Development); QA and
   Cybersecurity as compact rows.
4. One team: a single diagram of a project passing build, test, secure,
   automate, with three lines on why one team beats four vendors.
5. Shared process: four steps with durations (call, diagnostic, build, run).
6. Proof: 13+ live products, 500K+ users, link to Work.
7. Closing CTA.

## Blueprint (b): service detail page

1. Hero: service name, h1 promise, lead, "built for" line, primary CTA
   (contact with service preselected) and secondary (see where to start),
   a line diagram specific to the service.
2. Problems it solves: intro paragraph, then 3 to 4 pain/change pairs.
3. What you get: deliverable grid.
4. How we work: approach paragraph, timeline with durations.
5. Where to start: three engagement cards (diagnostic, build, retainer),
   the first flagged as the usual first step.
6. Tools we use: plain chips, mainstream tools only.
7. Related services (specialisms or parent discipline).
8. FAQ accordion (4 to 5 questions), mirrored in FAQPage JSON-LD.
9. Closing CTA; sticky mobile CTA bar between hero and closing CTA.
