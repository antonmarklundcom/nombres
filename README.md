# nombres.com.py

A fast baby-name site for families in Paraguay. Spanish with voseo, PHP 8.2+, local fonts and assets, an editable PHP catalog and optional MySQL storage. No Composer or Node at runtime, analytics, tracking cookies, third-party scripts, lead forms or WhatsApp calls to action. The business goal is introducing expecting parents to **[Mi Bebé](https://app.embarazo.com.py/)** through plain links.

## Run and verify

```bash
php -S 127.0.0.1:8080 router.php
./verify.sh
python3 tests/browser.py
python3 deploy/make-zip.py
./verify.sh --root dist/nombres-hostinger
```

Runtime: PHP 8.2 or later with core JSON, PCRE and hash support. File mode needs no optional extensions. MySQL mode additionally needs PDO MySQL and a private configuration file. Tests use Bash, Python 3 and `rg`; browser checks use Python Playwright and Chromium. No package installation is required on Hostinger. The cloud task has PHP 8.2.34 under `/workspace/nombres-toolchain/bin`; prepend that directory to `PATH` there.

`verify.sh` lints PHP, checks the catalog, exercises the editing CLI in a temporary copy, starts its own server, crawls every sitemap page and the favorites page, checks old URLs and redirects, validates metadata/JSON-LD/links/assets, denies source paths and checks the server log. It terminates only its own server. CI runs the same checks against source and the deployment artifact.

## Edit names

The packaged catalog is [content/names.php](content/names.php). Pages, alphabetical lists, filters, JSON data and the XML sitemap derive from the selected storage mode. A slug is a permanent URL identity. In file mode, edit a record directly or use the validated CLI:

```bash
php tools/names.php export > /tmp/names.json
# Prepare an array containing only the complete records you want to add/update.
php tools/names.php upsert /tmp/changed-names.json
php tools/names.php upsert /tmp/changed-names.json --write
php tools/names.php validate
./verify.sh
git diff -- content/names.php
```

Dry run is the default. Updates preserve all other records; deletion is a manual review decision. The file CLI always edits the packaged file, even if the website uses MySQL. For database editing, use `php tools/database.php export`, `upsert records.json [--write]`, `check` and `snapshot`; see [database operations](docs/database.md).

The catalog has **672 records**, including **126 additions with scoped 2024 international usage evidence**. These are not 672 independently verified etymologies. Thirteen Guaraní lexical meanings have an educational dictionary reference; specialist language review remains outstanding. See [the content model](docs/content-model.md), [data audit](docs/name-audit.md), [review queue](docs/name-review-queue.csv), and [statistical sources](docs/data-sources.md).

Country tables for the United States and France use checked 2024 data copies. A history/trends section compares selected years, explains spelling differences and keeps foreign statistics separate from Paraguay. Pet ideas remain secondary.

## Hostinger Git deployment

The repository root is the deploy root. Configure **PHP 8.2+**, HTTPS and the Hostinger Git deployment path **public_html**, using this repository and `master` **after reviewing and merging the branch**. No build command is needed. File mode works immediately. Optional MySQL setup uses the separate `dist/nombres-catalog.sql` phpMyAdmin import, PDO MySQL, a private `../nombres-config.php` and a private writable cache folder. Never commit credentials or put the SQL export under `public_html`.

No deployment was performed by this rebuild. Start with [tomorrow's checklist](docs/launch-tomorrow.md) and [deployment details](docs/deployment.md). Do not combine Git auto-deploy with a ZIP upload to the same live release. The ZIP is an alternate, flat deployment artifact with runtime files and an empty config example. Git checkout also contains documentation and tools; the public routing rules deny those paths.

All previous indexable URLs are retained. Extension and slash variants receive 301 redirects; see [the URL map](docs/url-map.md). No canonical points to a staging or local host.

## Structure and boundaries

| Path | Purpose |
|---|---|
| `index.php`, `.htaccess`, `router.php` | Production front controller and matching local router |
| `content/names.php` | Packaged catalog, review state and source evidence |
| `database/`, `lib/storage.php`, `config.example.php` | Optional SQL schema, cached public reads and private configuration example |
| `content/rankings.php`, `content/stories.php` | Dated country data and Spanish editorial content |
| `content/editorial.php`, `content/site.php` | Spanish copy and fixed public destinations |
| `lib/`, `partials/`, `templates/` | Shared catalog helpers, metadata, design and page templates |
| `assets/` | Existing self-hosted fonts, styles, small client script and OG image |
| `tools/` | Catalog CLI, route manifest and one-time legacy importer |
| `deploy/`, `tests/` | Allowlisted ZIP packaging and meaningful verification |
| `docs/` | Audit, URL map, deployment, SEO plan, screenshots and project handoff |

The structure follows the `antonmarklundcom/php-site-template` repository's content arrays, helpers, partials, router, verification and artifact separation. Its lead capture, analytics and WhatsApp features are not included. No Mi Bebé application files or imagery were copied or edited; only the owner-supplied facts and links are used. The existing OG image and OFL fonts are reused.

The original babyshower promotion linked to `https://babyshower.com.py/`, `/revelacion-de-genero/` and `/bienvenida-de-bebe/`. It has been replaced in rendered pages by Mi Bebé. Archived legacy source under `tools/legacy/` retains the migration input and is never served or included in the ZIP.

The original Windows brief, manuals and custom skills were unavailable in the cloud. [The handoff](docs/manuals/nombres/README.md) includes proposed registry entries for your laptop; no claim is made that `C:` or `E:` was changed. No keyword volumes are invented; [SEO seeds](docs/seo-plan.md) are ready for a Keyword Planner export.

Higgsfield was requested with a 50-credit ceiling, but no callable Higgsfield MCP was available. No images were generated and no credits spent. [Art direction](docs/higgsfield-art-direction.md) records the proposed next step. [Future monetization ideas](docs/monetization-plan.md) are a separate proposal, with no products, partners or payment integrations activated.
