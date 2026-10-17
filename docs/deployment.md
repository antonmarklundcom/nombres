# Hostinger release checklist

## Prepared, not deployed

This branch is deployable from its repository root on Apache/LiteSpeed with PHP 8.2+. It has no build step, database, Composer packages, Node runtime or secret configuration. The ZIP under ignored `dist/nombres-hostinger.zip` is an alternate artifact, not a second deployment to apply after Git. CI also builds and publishes that ZIP as a workflow artifact.

## Owner's hPanel actions

1. Review the PR, screenshots and name-audit limitations; merge only when satisfied.
2. Set the site's PHP version to 8.2 or newer. Keep HTTPS enabled. Do not change DNS, email, domain registration or hosting plan.
3. In Hostinger's Git integration, select `antonmarklundcom/nombres`, branch `master`, deployment directory `public_html`. Use the existing integration authorization. Do not place a token in a committed file.
4. If `public_html` contains only Hostinger's default page, follow hPanel's prompt to prepare the directory for the checkout. Back up and inspect any files first if it contains anything else. Do not blindly delete it.
5. Enable/use the Git deployment **once** after the approved merge. No install command is needed. The root `.htaccess` is part of the release; make sure dotfiles are included.
6. Verify the site live. If auto-deploy has already happened, verify that release; do not upload the ZIP as a duplicate deploy.

The Git checkout contains tools/docs, but rewrite rules send private paths to a 404 and fail closed if rewriting is unavailable. The ZIP allowlists only runtime files. Deployment must update tracked files and remove obsolete tracked HTML; an unrelated unmanaged `index.html` should not be used (`index.php` is first), but inspect/remove only confirmed default leftovers in hPanel.

## Live verification after deployment

Check HTTPS `/`, a name such as `/nombre/arami/`, a category, `/elegir/`, `/mi-lista/`, `/sitemap.xml`, `/robots.txt`, and an unknown URL. Confirm name data, accent rendering, favorites and Mi Bebé links on a real phone. Confirm `/content/names.php`, `/.git/config`, `/tools/names.php` and `/docs/name-audit.json` are denied. Check that HTTP and www redirect to the HTTPS apex, missing slashes redirect once, and no route loops.

From a developer machine, run `python3 tests/crawl.py --base https://nombres.com.py` against the deployed branch. That command is read-only. TLS verification stays enabled. Search Console sitemap submission and a mobile live check are useful owner follow-ups; no account or tracking code was added here.

Only after those checks pass is it appropriate to turn on Mi Bebé's `nombres_link` flag. This task did not edit that application or enable the flag. The site's actual live status must be established then, not inferred from a local server or a generated ZIP.

## Rollback

Keep the reviewed Git history and revert the merge if necessary, then deploy that reviewed revision once through the same Git integration. This migration has no database state to roll back. Keep any manual hPanel backup outside the public document root. Avoid enabling debug output or exposing tools on production.
