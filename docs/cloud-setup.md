# Cloud development environment handoff

The existing `/workspace/nombres` checkout was reused. The Windows brief/manual paths were not mounted. Development tooling is outside the repository under `/workspace/nombres-toolchain`; caches and local fixtures are under `/tmp` or that tooling directory. No project worktree was created.

PHP 8.2.34 and PDO MySQL are extracted from Debian packages using signature/checksum-verifying apt sources. No TLS or package-verification bypass is used. Add `/workspace/nombres-toolchain/bin` to PATH. File mode needs no services. `php -S 127.0.0.1:8080 router.php` starts the site; `./verify.sh` starts/stops its own test server. Python/Chromium/Playwright are available for browser validation. Apache/FastCGI was separately used to test the actual `.htaccess` rules.

A socket-only local MariaDB 10.11 fixture supports real SQL tests. Retained helpers initialize `/tmp/nombres-mariadb-data`, start the server in a persistent tool session, and create only `nombres_test` plus a private local config. No production database credential is required. Services must restart after environment restoration; do not assume open sessions or `/tmp` data survive. The saved startup instructions contain the exact tested commands and readiness checks.

The cloud configuration draft was successfully saved with the complete install script and startup instructions, preserving existing custom `api.github.com` access and adding `www.ssa.gov`, `www.insee.fr`, `www.spl.gov.py`, `nombres.com.py` and `www.nombres.com.py` for source/live verification work. Package-manager presets were preserved. No secret values or production credential bindings were added. Saving a draft does not apply network changes or publish a snapshot. Review/save the cloud settings and publish the environment when ready; a fresh-task restoration has not been independently verified.

Git read and push work through the existing platform proxy. GitHub API requests were denied in this running instance, so an automatic PR could not be created. No personal token was requested/extracted. The prepared PR body and creation link are in `review-summary.md` and `launch-tomorrow.md`.

Higgsfield MCP was not exposed by the available tools/resources, so the authorized artwork work remains pending with zero credits spent. No alternate paid image tool was substituted. This limitation does not prevent file/SQL site development or deployment.
