# Launch tomorrow

Nothing else needs approving tonight for the prepared code. It has not been merged or deployed. Review branch: [php-hostinger-rebuild](https://github.com/antonmarklundcom/nombres/tree/php-hostinger-rebuild). [Open the prepared pull request](https://github.com/antonmarklundcom/nombres/pull/new/php-hostinger-rebuild); its title/body are in `docs/review-summary.md`. The cloud's GitHub API was blocked, so no PR number was created here.

1. Review the branch/screenshots, open the PR, check GitHub CI, and merge into `master` when satisfied.
2. In Hostinger, set PHP to 8.2+ and enable PDO MySQL. Create a blank database and its user. Keep the exact credentials private.
3. Download `nombres-catalog.sql` from the workflow artifact (or generate it with `php tools/database.php sql-export`) and import it in phpMyAdmin. Expect 672 rows. Keep the SQL file outside `public_html`.
4. Set up Hostinger Git for `antonmarklundcom/nombres`, `master`, deployment directory `public_html`. There is **no build/install command**. Back up/inspect any existing files before preparing the directory; the owner reported only a default page. Use one Git deploy after merge, with `.htaccess` included. Do not also upload the ZIP.
5. Copy `config.example.php` to private `../nombres-config.php`, enter the actual database values securely, set `storage` to `mysql`, and ensure private `../nombres-cache` is writable by PHP. Temporarily enable diagnostics and check `X-Nombres-Storage: mysql` or `mysql-cache`, then turn diagnostics off. Full steps: [database.md](database.md).
6. Verify live HTTPS home, a name with accents, a category, both country articles, search, favorites, nofollow links to the pregnancy website/app and Cuentos.com.py, `/sitemap.xml`, `/robots.txt` and an unknown URL. Confirm private files return 404 and HTTP/www redirect to the HTTPS apex. Run the read-only crawler from this revision against the live domain: `python3 tests/crawl.py --base https://nombres.com.py`.
7. Only after the live checks pass, enable Mi Bebé's `nombres_link` flag in that separate app. This task did not edit the app. Verify Search Console ownership and submit `https://nombres.com.py/sitemap.xml`; check actual indexing and mobile performance after launch.

If the database takes longer, file mode is a complete launch option. MySQL is not needed for search engines to crawl the site. Switch later after importing and validating the same catalog. Preserve database backups before subsequent edits/deployments; never auto-seed over live edits.

Still outside this cloud task: production hosting/credentials, final release approval, live TLS/LiteSpeed behavior, Search Console ownership/indexing, full linguistic review, and laptop-only project registry updates. Higgsfield MCP was unavailable, so no image credits were spent. No paid service, partner integration, tracking or new customer-data collection is enabled.
