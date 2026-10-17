# Release validation — 17 October 2026

## Passed locally

- Original Node build in a temporary copy: identical to tracked output on two runs; original verifier passed 123,683 checks. The PHP runtime does not use Node.
- PHP **8.2.34** lint and catalog validation: **672** records, unique slugs/names, consistent categories, bounded SQL fields and valid source state/shape. Review states: 482 legacy, 190 qualified, zero verified.
- Disposable file-editing workflow: export, no-write dry run, update, add, automatic route inclusion, repeated import, and rejection of duplicates, invalid paths/tags/references/markup, malformed source fields/dates and unsupported verified claims.
- **48 country/year/sex snapshot checks** against checked CSV excerpts; expected 2024 leaders, original distinct spellings and coverage statements. Statistical extracts do not verify etymology.
- Full source checkout, unpacked runtime artifact, SQL-backed HTTP site, and **Apache 2.4.68 + PHP FastCGI**: each passed **142,651 crawl checks**, **719 pages**, **718 sitemap URLs**. All 584 original indexable URLs remain. Counts describe this catalog, not an SEO score.
- Crawls verify response status, h1/title/meta/canonical/OG/1200×630 image, JSON-LD, links, assets, sitemap/robots, old URL alternates/301s, denied private files and unknown-path 404s. The gate also checks a clean PHP server log. A malformed editorial source anchor found during visual review was fixed; link-attribute and visible-narrative assertions prevent that regression.
- Real **MariaDB 10.11.19** and **PDO MySQL**: repeatable schema install/seed, every field's Unicode/JSON round trip, execution of the actual phpMyAdmin import, prepared dry-run/upsert with apostrophes/backslashes/ñ/ã/ë, invalid comparison rejection, cache invalidation, and changed SQL content producing new picker data/ETags followed by HTTP 304 revalidation.
- SQL failure tests: socket outage serves stale valid cache, no cache falls back to packaged file, and malformed source data entered directly in SQL is rejected while the last valid snapshot remains public. Twelve consecutive warm name-page requests produced **zero additional SQL SELECTs**. These tests used only the isolated local `nombres_test` fixture.
- Chromium through Apache: **146 explicit layout/privacy checks**, plus search/favorites/surname/duel/sharing/storage assertions. Widths **360, 375, 768, 1024, 1440**, including with body clipping disabled: no horizontal document overflow. Mobile menu, Escape/focus, French diacritics, actual country narrative/table rendering, no-JS search and 48-result second-page navigation are covered.
- Browser sessions observed no uncaught JavaScript errors, cookies, third-party resource requests or data-submission requests. Screenshots/report are under `docs/screenshots/` and `docs/browser-report.json`.
- Final runtime artifact: **37 files**, byte-identical to their runtime sources; ZIP **148,758 bytes**. Tools/tests/docs/schema/credentials/Git are excluded. Separate phpMyAdmin SQL artifact: **574,202 bytes**, never inside the public ZIP. Artifacts can be regenerated; minor archive compression/timestamp variation is possible.
- Local production Host-header rules redirect HTTP/www to HTTPS apex with path/query preserved. Compression, versioned asset cache headers, private-path denial and ACME challenge routing were exercised through actual Apache rules.

## Local transfer measurements

| Response | Gzip body bytes |
|---|---:|
| Home HTML | 6,588 |
| Picker HTML (48 initial results) | 6,559 |
| CSS | 5,997 |
| JavaScript | 4,304 |
| Lazy public name JSON | 14,645 |

Fonts total **49,580 bytes**. The home does not fetch the full catalog until the picker/favorites interaction needs it. Styles/scripts/fonts are local and versioned; JSON revalidates instead of receiving immutable caching. There is no image-heavy hero, remote font service, runtime package download or third-party library.

These measurements are from local Apache, without a mobile network. They do **not** establish production Core Web Vitals, Hostinger TTFB or Paraguay mobile latency. Measure those after deployment.

## Still outside this verification

- Full independent onomastic review of all 672 entries and competent Guaraní specialist review. Thirteen lexical references and 126 country-usage records have explicitly limited evidence scope; see `name-audit.md` and `data-sources.md`.
- Hostinger production deployment, actual database credentials, TLS/LiteSpeed behavior, Search Console ownership/indexing or ranking/traffic outcomes. Nothing was merged or deployed by this task.
- Remote GitHub CI execution. CI includes file/artifact gates and a disposable MariaDB job, but the API was blocked here. Git push works separately; check CI on GitHub before merging. The PR body/screenshots are prepared, but no PR number is claimed.
- Laptop-only full brief/manual requirements and actual changes to Windows registries. Proposed handoff/registration data are in the repository.
- Higgsfield artwork: no callable MCP tool, **0/50 credits used**, no substituted provider. Existing local artwork/fonts remain.
- Fresh-task cloud restoration/publication. Setup/startup/network changes were saved as a draft, not applied/published by the save operation; see `cloud-setup.md`.

No DNS/email/hosting-plan changes, paid service, affiliate/partner activation, tracking/data-collection feature, outreach, or edit to Mi Bebé was performed.
