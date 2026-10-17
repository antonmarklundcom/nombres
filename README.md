# nombres.com.py

A fast baby-name site for families in Paraguay. Spanish with voseo, PHP 8.2+, local fonts and assets, no Composer, database, Node at runtime, analytics, cookies, third-party scripts, lead forms or WhatsApp calls to action. The business goal is introducing expecting parents to **[Mi Bebé](https://app.embarazo.com.py/)** through plain links.

## Run and verify

```bash
php -S 127.0.0.1:8080 router.php
./verify.sh
python3 tests/browser.py
python3 deploy/make-zip.py
./verify.sh --root dist/nombres-hostinger
```

Runtime: PHP 8.2 or later with core JSON, PCRE and hash support. No optional PHP extensions are required. Tests use Bash, Python 3 and `rg`; browser checks additionally use Python Playwright and Chromium. No package installation is required on Hostinger. The cloud task has PHP 8.2.34 under `/workspace/nombres-toolchain/bin`; prepend that directory to `PATH` there.

`verify.sh` lints PHP, checks the catalog, exercises the editing CLI in a temporary copy, starts its own server, crawls every sitemap page and the favorites page, checks old URLs and redirects, validates metadata/JSON-LD/links/assets, denies source paths and checks the server log. It terminates only its own server. CI runs the same checks against source and the deployment artifact.

## Edit names

The canonical catalog is [content/names.php](content/names.php). Pages, alphabetical lists, filters, JSON data and the XML sitemap all derive from it. A slug is a permanent URL identity. Edit a record directly, or use the validated CLI:

```bash
php tools/names.php export > /tmp/names.json
# Prepare an array containing only the complete records you want to add/update.
php tools/names.php upsert /tmp/changed-names.json
php tools/names.php upsert /tmp/changed-names.json --write
php tools/names.php validate
./verify.sh
git diff -- content/names.php
```

Dry run is the default. Updates preserve all other records; deletion is deliberately a manual review decision. See [the content model](docs/content-model.md), [the data audit](docs/name-audit.md), and the [review queue](docs/name-review-queue.csv). The catalog has 546 records, not 546 independently verified etymologies. Thirteen Guaraní lexical meanings have a recorded educational dictionary reference; personal-name usage and specialist language review remain separate work.

## Hostinger Git deployment

The repository root is the deploy root. Configure **PHP 8.2+**, HTTPS and the Hostinger Git deployment path **public_html**, using this repository and `master` **after reviewing and merging the PR**. The code does not require a build command, database, `.env` file, cron, writeable application folder or secret. PHP handles all page routes through `.htaccess` and `index.php`.

No deployment was performed by this rebuild. Follow [the deployment checklist](docs/deployment.md). Do not combine Git auto-deploy with a ZIP upload to the same live release. The ZIP is an alternate, flat deployment artifact with only runtime files. Git checkout also contains documentation and tools; the public routing rules deny those paths.

All previous indexable URLs are retained. Extension and slash variants receive 301 redirects; see [the URL map](docs/url-map.md). No canonical points to a staging or local host.

## Structure and boundaries

| Path | Purpose |
|---|---|
| `index.php`, `.htaccess`, `router.php` | Production front controller and matching local router |
| `content/names.php` | Canonical catalog, review state and source evidence |
| `content/editorial.php`, `content/site.php` | Spanish copy and fixed public destinations |
| `lib/`, `partials/`, `templates/` | Shared catalog helpers, metadata, design and page templates |
| `assets/` | Existing self-hosted fonts, styles, small client script and OG image |
| `tools/` | Catalog CLI, route manifest and one-time legacy importer |
| `deploy/`, `tests/` | Allowlisted ZIP packaging and meaningful verification |
| `docs/` | Audit, URL map, deployment, SEO plan, screenshots and project handoff |

The structure follows the `antonmarklundcom/php-site-template` repository's content arrays, helpers, partials, router, verification and artifact separation. Its lead capture, analytics and WhatsApp features are not included. No Mi Bebé application files or imagery were copied or edited; only the owner-supplied facts and links are used. The existing OG image and OFL fonts are reused.

The original babyshower promotion linked to `https://babyshower.com.py/`, `/revelacion-de-genero/` and `/bienvenida-de-bebe/`. It has been replaced in rendered pages by Mi Bebé. Archived legacy source under `tools/legacy/` retains the migration input and is never served or included in the ZIP.

The original Windows brief, manuals and custom skills were unavailable in the cloud. [The handoff](docs/manuals/nombres/README.md) includes proposed registry entries for your laptop; no claim is made that `C:` or `E:` was changed. No keyword volumes are invented; [SEO seeds](docs/seo-plan.md) are ready for a Keyword Planner export.
