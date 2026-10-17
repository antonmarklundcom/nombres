# Optional Hostinger MySQL storage

File mode remains the default and can launch without a database. MySQL mode implements the owner's later request for editing on Hostinger. Both render the same routes and fields. There is no public admin panel, migration endpoint, login or database password in Git.

## First installation with phpMyAdmin

1. In hPanel create a blank MySQL database and its database user. Record the exact host, database name and username privately. Enable `pdo_mysql` for the site's PHP 8.2+ version.
2. Obtain `nombres-catalog.sql` from the branch's CI artifact, or run `php tools/database.php sql-export > /tmp/nombres-catalog.sql`. `python3 deploy/make-zip.py` also writes it under ignored `dist/`. It contains the schema and all 674 packaged records. It is separate from the public ZIP.
3. Select the new database in phpMyAdmin and import that file as UTF-8. Check `nombres_meta` has `schema_version=1` and `SELECT COUNT(*) FROM nombres_names` returns 674. Check accented examples: Ñasaindy, Maël and Raphaël. The import does not create a database/user or drop tables. Reimporting updates matching slugs: use it for initial setup, never as an automatic deployment step over later edits.
4. Copy `config.example.php` to `nombres-config.php` **one directory above `public_html`**, not inside the Git repository. Enter the real database credentials securely in that private file and set `storage` to `mysql`. Do not paste passwords into chat. The alternative ignored `public_html/config.local.php` is routed to 404, but an outside-root config is preferred.
5. The default cache is `../nombres-cache`, also outside `public_html`. PHP must be able to create/write it. If your account layout differs, set `cache_dir` to an absolute private path owned by the hosting account. Use restrictive account permissions, not world-writable permissions.
6. Temporarily set `diagnostics` to `true`; inspect the `X-Nombres-Storage` response header on a fresh request. It must be `mysql` or `mysql-cache`. Then set diagnostics back to `false`. A page loading by itself does not prove the SQL connection works, because outage fallback is intentional.

The configuration search order is an explicit `NOMBRES_CONFIG_FILE` path, otherwise private `../nombres-config.php`, otherwise ignored `config.local.php`, otherwise file defaults. The external config survives Git deployments. No `.env` dependency is required.

## Editing and backups

With SSH/terminal access, run from the repository root with the private config available:

```bash
php tools/database.php check
php tools/database.php export > /private/backup/nombres-before-edit.json
# Prepare a JSON array of complete records to add or replace.
php tools/database.php upsert /private/changes.json
php tools/database.php upsert /private/changes.json --write
php tools/database.php check
php tools/database.php snapshot
```

`upsert` defaults to a no-write dry run. The full merged catalog must pass semantic validation before writes. Updates use prepared statements and transactions. Cache invalidation is immediate for CLI changes. Back up the whole database through phpMyAdmin before major changes; store backups outside the web root. JSON export is a portable catalog backup, not a replacement for a full SQL backup.

Without SSH, phpMyAdmin can edit rows, but it does not run application validation. Export/back up first, keep slugs stable, edit text fields, preserve valid JSON in tags/variants/review/compare, and check the diagnostic header and changed page after the cache TTL. An invalid catalog is rejected as a whole, with the last valid copy served instead. A separate authenticated editorial interface with previews/revisions is future work.

File CLI commands (`tools/names.php`) always use the packaged PHP file. SQL CLI commands (`tools/database.php`) use the private database config, even while public `storage` is still `file`. Choose one editorial source of truth per release. MySQL edits are not silently written back to Git. To bring SQL edits into a reviewed file snapshot, export SQL records, upsert them into the packaged catalog in a development checkout, validate and review the diff. Upsert does not delete records missing from the input.

Never run `seed --write` on every deploy. It updates matching slugs from the packaged catalog and can overwrite database edits. There is no scheduled synchronization job. Never delete a known name/slug without an explicit old-URL redirect and updated URL tests.

## Cache and failure behavior

Each valid database read writes an atomic, private UTF-8 JSON catalog snapshot. Default freshness is 60 seconds, configurable from 0 to 3600. Warm page requests use the snapshot without SQL SELECTs. Edits made directly in phpMyAdmin appear after expiry; the CLI invalidates the snapshot immediately. Avoid enabling an extra whole-page hosting cache until its invalidation behavior is understood.

If a database read fails or returns invalid records, public rendering uses the last valid snapshot. If no snapshot exists, it uses the packaged catalog. Public errors never contain a connection string or password. The server log emits a generic diagnostic. `mysql-stale-cache` and `file-fallback` are failure states to investigate; they are not proof of successful MySQL setup. A database outage can temporarily show older names/edits.

The picker JSON has a catalog-derived ETag and a five-minute revalidation policy. Its version changes with actual SQL content. Server-rendered pages use the active catalog immediately after cache refresh; no Node build or generated JSON upload is needed.

## Schema and local verification

`database/schema.sql` targets MySQL 8+ / MariaDB 10.4+. `nombres_names` uses a unique ASCII slug and utf8mb4 text; the original public model is preserved, with JSON validation for array/source fields. `nombres_meta` records schema version 1. Schema installation is repeatable and does not delete application data. A future schema change needs a reviewed migration; do not change the version number casually.

For a new empty database with SSH, `php tools/database.php install` followed by `seed` (dry run) and `seed --write` is an alternative to importing the combined SQL artifact. Use one initial import method.

`tests/database_workflow.py` exercises a real MariaDB database, requires the isolated database name `nombres_test`, and checks Unicode round trips, actual SQL import, edits, cache/ETag invalidation, no warm SELECTs and outage fallback. It must never target production. CI includes a disposable MariaDB service. Local results are recorded in `validation.md`; remote CI status must be checked on GitHub.
