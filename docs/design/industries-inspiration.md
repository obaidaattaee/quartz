# Industries pages: inspiration brief

Scope: `/{locale}/industries` and the five sector pages (education,
financial-services, government, healthcare, retail-pos). Audience: Gulf B2B
buyers (IT and operations leads, founders, digital teams inside regulated
organisations). Arabic first. Same Direction B system as the services pages.

## References studied

- Netguru industries index: https://www.netguru.com/industries
- Netguru healthcare: https://www.netguru.com/industries/healthcare
- Intellias Saudi page (how a vendor speaks to KSA): https://intellias.com/intellias-saudi/
- Vanta HIPAA (compliance verbs): https://www.vanta.com/products/hipaa
- DGA web accessibility guideline: https://dga.gov.sa/sites/default/files/2022-12/The%20Guideline%20for%20Web%20Accessibility%20of%20Government%20Websites%20%E2%80%93%20V1.0_1.pdf
- DGA whole-of-government platforms (Nafath and others): https://dga.gov.sa/en/Whole_of_Government_Platforms
- Saudi sector roundups (what local buyers expect to read: NPHIES, ZATCA,
  SAMA, DGA): https://www.suffescom.com/blog/top-software-companies-in-saudi-arabia
- Dribbble tags (titles only, shots do not render when fetched):
  https://dribbble.com/tags/industry-page, https://dribbble.com/tags/industries
- thoughtbot and Thoughtworks industry URLs returned 404; EPAM returned 403.

## What we adopt, and why

1. **Four pains in the buyer's words** (Netguru healthcare lists exactly four:
   manual workflows, engagement, regulation, disconnected systems). We keep
   3 to 4 per sector, written as operating reality ("stock differs between
   branches by evening"), not as abstract "challenges".
2. **Solutions that route to a service** (Netguru links every sector to
   delivery capabilities). Each "what we build" card names the service that
   delivers it and links to `/services/{slug}`. Industries and services stay
   one site, not two catalogues.
3. **Compliance as things we build for** (Vanta: "helps you meet",
   "contextualise the regulation into controls"). We name the frameworks a
   Gulf buyer will ask about (ZATCA, PDPL, NCA ECC, SAMA, NPHIES, DGA
   accessibility, Nafath) and say what we build or review against. Never
   "compliant", "certified" or "accredited". The client's compliance owner
   signs off, and the page says so.
4. **Local specifics beat global name-drops** (Intellias names nothing
   specific; that reads as generic). Arabic-first UI, RTL, Hijri dates,
   national identity sign-in, e-invoicing are concrete and credible.
5. **Sector FAQ** (Netguru puts compliance answers in the FAQ). 4 to 5
   procurement questions per sector, mirrored in FAQPage JSON-LD.
6. **A cross-sector matrix on the index** (Thoughtworks-style "capabilities
   across industries", which we could not fetch, rebuilt from our own data).
   Rows are sectors, columns are our four disciplines, cells are the systems
   we build. It shows breadth without logos and is derived from the
   per-sector solutions, so admins edit it in one place.

## What we reject

- Case-study carousels, client logos, testimonial quotes and outcome
  percentages (Netguru's main proof). We have none we can publish. Example
  systems are labelled "Illustrative example" on every card.
- Stock photography of hospitals, classrooms and shop floors. One blueprint
  line diagram per sector instead, labelled illustrative where it depicts a
  system.
- Timelines, prices and payment-gateway selling points. Scope and schedule
  are agreed per project in a written plan before signing.
- Selling our own platforms. The retail page is about building retail and
  point-of-sale systems for the client.

## Blueprint (a): industries index

1. Hero: h1 promise, a paragraph stating what the page is for (pick your
   sector, see what we build and the rules we build for), two actions.
2. Sector list: five large rows. Each: name, one-sentence summary, the
   systems we usually build there (from solutions), the rules we build for
   (from compliance items), a link.
3. "Sector not listed?": short note, link to contact.
4. Four disciplines across sectors: the sector by discipline matrix
   (Development, Automation, QA, Cybersecurity). Stacks per sector on phones.
5. Honest proof: 13+ live websites and products, 500K+ users, and a plain
   line on why sector pages show illustrative examples, not client names.
6. Closing CTA.

## Blueprint (b): sector page

1. Hero: sector crumb, h1 promise, lead, "Built for" line, primary CTA
   (contact with the sector's main service preselected), secondary anchor to
   "What we build", sector diagram.
2. Sector realities: 3 to 4 pains, each a short title and a sentence.
3. What we build: 4 to 5 solution cards, each tagged with and linking to the
   delivering service.
4. Rules and constraints we handle: intro, then name/what-we-do rows, plus
   a fixed note that compliance sign-off stays with the client.
5. Illustrative examples: 2 to 3 example systems, each badged.
6. FAQ accordion (4 to 5), mirrored in FAQPage JSON-LD.
7. Other sectors (links to the remaining four).
8. Closing CTA with three next steps (call, written plan with scope and
   schedule, build), no durations; sticky mobile CTA between hero and close.
