# nombres.com.py — project handoff

Prepared 17 October 2026. This is a repository copy for the owner's operations manual; the cloud task cannot write the laptop's `C:/operation manuals/` or inspect its existing registries.

- Repository: `https://github.com/antonmarklundcom/nombres`, default branch `master`.
- Review branch: `php-hostinger-rebuild`.
- Cloud checkout: `/workspace/nombres` (existing checkout reused; no second project clone or worktree).
- Requested laptop location: `E:/ai work/Projects/nombres/main`. Check existing checkouts before cloning there. Keep caches/temp under `E:/ai work`, outside OneDrive.
- Public site: `https://nombres.com.py/`; deployment remains an owner hPanel action after approval/merge. Local validation does not establish live status.
- Runtime: PHP 8.2+, Apache/LiteSpeed rewrite support; no DB, Node runtime, package install or secrets.
- Catalog: `content/names.php`. Edit or use `php tools/names.php upsert`; validate and review through Git. See `docs/content-model.md`.
- Purpose: Spanish baby-name discovery for Paraguayan families, directing parents to Mi Bebé via plain links. Pet names are a secondary area.
- App: `https://app.embarazo.com.py/`, free, Google account for personal tracking, installable web app. Install guide: `https://embarazo.com.py/instalar/`. Weekly pages: `https://embarazo.com.py/semana/<1-42>/`.
- Reciprocal app flag: `nombres_link`, currently off according to the owner. Enable only after the site is deployed and checked live.
- Verification: `./verify.sh`; optional browser dependency setup then `python3 tests/browser.py`; `python3 deploy/make-zip.py`; `./verify.sh --root dist/nombres-hostinger`.
- Privacy: local favorites and surname storage; new share links use a URL fragment; no tracking scripts/cookies, forms, CRM, WhatsApp CTA or medical advice.
- Sources: technical audit all 546 records, 53 editorial changes, 13 Guaraní lexical references, complete expert/documentary review outstanding. See audit/review queue.
- Deployment and rollback: `docs/deployment.md`. No DNS, email, hosting plan or Mi Bebé project changes made.

## Laptop registration still required

When back at the laptop, read the existing `PROJECTS.json`, `STORAGE-MAP.json` and `storage/AI-STORAGE-HANDOFF.md` first. Follow their actual schemas and merge this project's details without replacing unrelated entries. The adjacent `registration-proposal.json` is source information for that merge, not a replacement registry. Copy this README to `C:/operation manuals/nombres/README.md` after reviewing the local conventions. The original full brief and Mi Bebé README were not available to this cloud task; confirm any extra requirements they contain before publication.
