# Release validation — 17 October 2026

## Executed successfully

- Original Node build in a temporary copy: identical to tracked output on two runs; original verifier passed 123,683 checks.
- PHP **8.2.34** syntax checks across the new PHP files.
- Catalog validation: **546** records, unique slugs, consistent categories and source-state requirements.
- Editing workflow tests in a disposable copy: export, no-write dry run, update, add, automatic route inclusion, repeated import, and rejection of duplicate/invalid/markup-containing or unsupported “verified” data.
- Source checkout and unzipped runtime artifact: full `verify.sh` gate, **77,321 crawl checks**, **588 pages**, **587 sitemap URLs**. Counts are for the launch catalog and can change when names are added.
- Same full crawl through **Apache 2.4.68 + PHP 8.2 FastCGI**, using the actual repository `.htaccess`. Initial local FastCGI backend defaults and JSON authorization were diagnosed and corrected; the final complete crawl passed.
- Production Host-header tests: HTTP apex and www redirect to HTTPS apex with path/query retained. Apache gzip and immutable cache headers checked on local assets.
- Chromium through Apache: **77 explicit layout/privacy checks**, plus Playwright assertions for search with accents and ñ, filters, pagination, empty results, favorites, surname persistence, duel, fragment sharing, old query sharing, shared-list import, local-data clearing, escaped storage strings, unavailable localStorage and no-JavaScript server search.
- Layout widths **360, 375, 768, 1440**: no horizontal document overflow, including with body clipping disabled. Home, a Guaraní name, a long compound name, a category, search, favorites and pets were covered.
- Browser sessions observed no uncaught JavaScript errors, cookies, third-party resource requests or data-submission requests. Current screenshots and browser report are under `docs/screenshots/` and `docs/browser-report.json`.
- Runtime ZIP is allowlisted: PHP, catalog, templates, local assets and `.htaccess`; no Git metadata, tools, tests, docs or old generated HTML. Final artifact details can be reproduced with `python3 deploy/make-zip.py`.

## Performance evidence

Local Apache compressed CSS to about **5.4 KB**, JavaScript to **4.1 KB**, and the lazily loaded public name catalog to about **11.4 KB**. Initial home HTML was about **6 KB** compressed. Fonts total about **50 KB**. The home page does not fetch the name catalog until the picker needs it. Fonts/styles/scripts are local and versioned; there are no image-heavy home assets or runtime package downloads. These are local transfer measurements, not a claim about production Core Web Vitals or Paraguay mobile-network latency.

## Not established here

- A complete independent linguistic/onomastic review of all 546 names; 13 Guaraní lexical references do not establish personal-name usage. See `name-audit.md`.
- Hostinger's live deployment, TLS renewal, LiteSpeed-specific behavior, Search Console indexing or real production speed. Apache testing provides useful evidence but does not replace live verification.
- Laptop-only brief/manual requirements or actual registration in the owner's Windows registries. Proposed files are provided.
- GitHub API access: the current cloud policy blocked `api.github.com`. A domain addition was saved in the cloud environment draft; saving it did not apply it to this running instance. Git read/push and API access are separate capabilities.

There was no merge, Hostinger deployment, DNS/email/plan change, paid service, image generation, outreach, CRM integration or edit to Mi Bebé.
