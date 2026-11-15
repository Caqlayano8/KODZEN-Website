# KRTZEN website integration — 2026-11-15

- Public product page: https://kodzen.tr/krtzen.html
- Hosting remains GitHub Pages, main branch, root directory. CNAME remains kodzen.tr.
- Shared navigation loads js/krtzen-integration.js on public pages. Its public routing key belongs exclusively to the kodzen tenant. It is not a private API/admin credential.
- The support control opens the first-party KRTZEN voice/text page in a new tab. That page requests consent and microphone access; the marketing site does not capture audio.
- Demo requests use the existing public company-request form. Admin review and manual tenant provisioning remain required.
- First-visit promotion uses localStorage key kodzen.krtzen.intro.v1. It appears once per browser profile, after the homepage introduction, and closes with Escape, close button, backdrop, or “Siteye devam et”. If localStorage is unavailable, sessionStorage is used. Clearing browser storage permits it to appear again.
- The older automatic project popup was disabled to avoid competing welcome dialogs. Its floating button and project form remain available.
- Product video is user initiated, preload=none, with Turkish captions; no autoplay or third-party video tracker was added.
- New marketing assets contain illustrative flows, no real customer conversation screenshots.
- Six owner-approved public knowledge records were added only to KODZEN, identified by sourceName https://kodzen.tr/krtzen.html#website-integration-20261115. Existing records and other tenants were untouched. They cover institution identity, KRTZEN, demo requests, and pricing availability. They are visible/editable in the existing knowledge administration.

## Validation

Desktop 1440px and mobile 390px: no horizontal overflow; product page and support loaded without JS errors. First-visit dialog opened, focused close control, closed with Escape, restored scrolling, and remained hidden after reload. Product nav entry and KODZEN-specific assistant URLs verified. Public assistant metadata returned KODZEN; a real HTTP text test was run, with the temporary conversation ended afterward. No WhatsApp/email was sent and no WhatsApp sessions were restarted.

## Rollback / maintenance

Revert the integration commit to remove website changes. Do not remove other production tenant data. Knowledge additions can be archived by their exact sourceName and tenantCode=kodzen. Changing the first-visit campaign version intentionally shows a new invitation. Update the public assistant routing URL if KODZEN's key changes; never substitute another company's key. Deployment success does not establish a guarantee of AI correctness or response speed.
