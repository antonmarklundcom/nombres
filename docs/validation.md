# Release validation — 17 October 2026

## Current Paraguay SEO revision

- PHP **8.2.34** lint and catalog validation: **674** records, unique slugs/names, bounded SQL fields, consistent tags and valid review/source shapes. Review states: **479 legacy, 195 qualified, zero independently verified**.
- Full source, unpacked deployment artifact, SQL-backed HTTP site, and **Apache 2.4.68 + PHP FastCGI** each passed **160,933 crawl checks**, **726 pages**, **725 sitemap URLs**. All 584 original indexable URLs remain HTTP 200. Counts are verification activity, not an SEO score.
- Crawls validate one h1, unique title/description, canonical/OG/1200×630 image, schema, assets, internal links, source denial, sitemap/robots, old HTML/slash variants and unknown 404s. New list ItemList order matches the cards actually rendered, including gender grouping. The source/artifact gate checks a clean PHP server log.
- Intent/spelling aliases: niña/nena variants redirect once to the original girls canonical; niño variants to the original boys canonical; Emmanuel to Emanuel. Slashless/slash/`index.html` forms preserve queries. Aliases are excluded from the sitemap. JS and no-JS search find the single canonical Emanuel result. Aitana is searchable.
- Four new collections (biblical girls, biblical boys, Italian, Arabic) and a gemelos/mellizos guide have unique copy, real catalog targets, meaningful related links and appropriate breadcrumbs/schema. The practical twins article does not claim an unrelated dictionary citation. Guaraní metadata no longer promises unprovided validated pronunciation.
- Disposable editing workflow: export, no-write dry run, update/add, automatic routes, repeated import, and rejection of duplicate/invalid fields, markup, unsupported verified claims, missing comparisons and malformed sources/dates.
- **48 country/year/sex snapshot checks**, preserving the independently recorded statistical tables, expected 2024 leaders and distinct spellings. These are separate from Google keyword demand.
- Real **MariaDB 10.11.19 + PDO MySQL**: schema repeatability, all 674 records' Unicode/JSON round trip, execution of the actual phpMyAdmin SQL import, prepared dry-run/upsert, invalid-data rejection, cache invalidation, changed JSON/ETag and HTTP 304, stale-cache and packaged-file outage fallback. Malformed SQL editorial data serves the last valid snapshot. Twelve warm name-page requests produce **zero additional SQL SELECTs**. Only the isolated local `nombres_test` fixture was used.
- Chromium through Apache: **226 explicit layout/privacy checks**, plus interaction assertions. Twenty-one representative routes at **360/375/768/1024/1440px**, with body clipping disabled too, have no horizontal document overflow. New collections, twins guide, gender pages, letter A and existing tools/articles are covered. Search/favorites/surnames/duel/sharing, localStorage denial, no-JS pagination and alternate spelling work. No uncaught JS errors, cookies, third-party loaded resources or data-submission requests were observed.
- Nofollow promotions checked on the five new pages: pregnancy website, app/install guide and Cuentos.com.py all use plain nofollow links with no tracking query or remote widget. Earlier nine-route promotion checks also passed.
- Keyword parser: **9,300 selected literal rows, 41 priority intents**, pinned input hash and reproducible CSV/report. The three 6,600 rows are treated as ambiguous broader baby-name grouping, potentially including boy intent. No 19,800 sum or girls-exclusive estimate is claimed. Missing exact natural phrases do not imply zero demand. Automatic personal-name “places” do not generate city pages.

Screenshots/report are in `docs/screenshots/` and `docs/browser-report.json`. Final source formatting was checked to preserve every decoded editorial value exactly, then linted. Repackaging confirms **39 runtime files** byte-identical to their source files. ZIP: **158,173 bytes**; separate SQL import: **578,193 bytes**. Git metadata, tools, tests, docs, schema files and credentials are excluded from the public ZIP.

## Local transfer measurements

| Response | Gzip body bytes |
|---|---:|
| Home HTML | 6,839 |
| Picker HTML (48 initial results) | 6,798 |
| CSS | 5,997 |
| JavaScript | 4,331 |
| Lazy public name JSON | 14,752 |

Fonts total **49,580 bytes**. Picker data stays lazy. Assets are local/versioned; JSON uses content/alias-aware ETags and revalidation. There is no remote font/script, runtime package download or image-heavy hero. These local Apache measurements do not establish Hostinger TTFB, field Core Web Vitals or Paraguay mobile latency.

## Earlier migration evidence retained

The original Node build was run twice in a temporary copy and matched tracked output; its verifier passed 123,683 checks. PHP replaced generated HTML without requiring Node at runtime. Production Host-header HTTPS/apex rules, compression/cache headers and ACME challenge handling were exercised through the actual local Apache rules. Those rules were not changed by this keyword revision.

## Still outside this verification

- Independent etymology review of all entries and competent Guaraní specialist review. Thirteen lexical references and 130 records with scoped country-usage references have limited evidentiary scope. Search demand is neither etymology nor a Paraguay birth-name ranking.
- Full Google grouping/monthly series/date-window evidence; the supplied Markdown omits those. Source rows are estimates. The corrected phrase itself has no invented exact-match volume.
- Actual Hostinger deployment/database credentials, TLS/LiteSpeed behavior, production speed, Search Console ownership/indexing, rankings or traffic. No merge or deployment was performed.
- Remote CI execution. CI is configured for file/artifact gates and a disposable MariaDB service; check GitHub before merging. API access was denied in this current instance, so no PR number is claimed. Git read/push work separately.
- Windows-only manual files/registries: proposals remain in the repository. No C:/E: changes are claimed.
- Higgsfield artwork: tool unavailable, **0/50 credits spent**. Cloud draft saving/publication and fresh-task restoration are separate from current-instance validation.

No DNS/email/plan changes, paid services, new storefront/payment/affiliate integration, tracking/customer-data collection, outreach or edit to Mi Bebé was performed.
