# Hostinger release checklist

## Prepared, not deployed

The repository root deploys on Apache/LiteSpeed with PHP 8.2+. There is no build command, Node runtime or Composer install. File mode works immediately. Optional MySQL requires PDO MySQL, a private config and a private writable cache folder. See [launch-tomorrow.md](launch-tomorrow.md) for the short sequence and [database.md](database.md) for import/editing details.

`python3 deploy/make-zip.py` creates two ignored artifacts: the runtime-only `dist/nombres-hostinger.zip` and separate `dist/nombres-catalog.sql`. The SQL is for phpMyAdmin, never a public upload. CI publishes both. The ZIP is an alternate deployment method; do not apply it after Git auto-deploy to the same release.

## Owner's hPanel actions

1. Review the branch, screenshots, name-audit limitations and GitHub CI; open/merge the PR when satisfied. GitHub API access was blocked here, so the prepared description is in `docs/review-summary.md` and no PR number is claimed.
2. Set PHP to 8.2 or newer, with PDO MySQL if using SQL. Keep HTTPS enabled. Do not change DNS, email, domain registration or hosting plan.
3. For SQL: create a blank database/user and import the separate catalog SQL through phpMyAdmin. Check 672 rows, schema version 1 and accents. Keep credentials private. Do not reimport automatically over subsequent editorial edits.
4. In Hostinger's Git integration, select `antonmarklundcom/nombres`, branch `master`, deployment directory `public_html`. Use the existing integration authorization; do not commit a token. No build/install command is needed.
5. If `public_html` contains only Hostinger's default page, follow hPanel's prompt to prepare it for the checkout. Back up and inspect any files first if it contains anything else. Do not blindly delete existing files.
6. Use Git deployment **once** after the approved merge. The root `.htaccess` is part of the release; include dotfiles. If auto-deploy already ran, verify that release instead of uploading a duplicate ZIP.
7. For SQL: securely copy the example to `../nombres-config.php` outside `public_html`, set the actual database credentials and `storage=mysql`. Ensure the private cache directory is writable. Temporarily set diagnostics true and require `X-Nombres-Storage: mysql` or `mysql-cache` on fresh responses, then turn diagnostics off. See `database.md` for fallback states and troubleshooting. Leave file mode active if SQL setup is unfinished.

The Git checkout includes docs/tools/schema, but rewrite rules deny private paths. The ZIP allowlists runtime files. Deployment must update tracked files and remove obsolete tracked HTML. `index.php` is first in DirectoryIndex; inspect/remove only confirmed unmanaged default leftovers in hPanel. Do not expose a test import script or phpinfo file in the web root.

## Live verification

Check HTTPS `/`, `/nombre/arami/`, `/nombre/mael/`, a category, both country pages, `/elegir/`, `/mi-lista/`, `/sitemap.xml`, `/robots.txt` and an unknown URL. Confirm accent rendering, favorites and Mi Bebé links on a real phone. Confirm `/content/names.php`, `/.git/config`, `/tools/database.php`, `/config.local.php`, `/database/schema.sql` and `/docs/name-audit.json` are denied. HTTP and www must redirect to the HTTPS apex, known missing-slash URLs must redirect once, and unknown URLs must remain 404.

From a developer machine at this revision, run `python3 tests/crawl.py --base https://nombres.com.py`. It is read-only and keeps TLS verification. Check actual mobile performance on the deployed site; local compression/timing is not field Core Web Vitals. Avoid an extra whole-page hosting cache until SQL edit invalidation is understood.

After live checks pass, enable Mi Bebé's `nombres_link` flag in that separate project. This task did not edit the app or enable it. Search Console ownership and sitemap submission are owner follow-ups. No tracking code, pixel or analytics cookie was added; use Search Console's search/indexing reports to guide editorial work.

## Rollback and durable edits

Keep reviewed Git history and a private database backup. Revert a bad merge and deploy the reviewed revision once through the same Git integration. Database changes are separate from Git and are not undone by a code revert. Restore a database backup only after assessing later edits, or switch to the reviewed file catalog as a temporary fallback while diagnosing. Never auto-seed on deploy: it overwrites matching SQL records. Cache refresh/invalidation and SQL editing commands are documented in `database.md`. Keep all backups outside the public document root and debug display off.
