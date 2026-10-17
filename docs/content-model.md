# Catalog and editing contract

## Current storage

`content/names.php` returns an array of records. This is the only live source of names. PHP reads it; no database connection exists. Shared hosting can cache compiled PHP with OPcache. There is no synchronization job, generated HTML or generated JSON to forget after an edit. `/assets/names.json` is generated from the same catalog and contains only public fields needed by the picker.

Required keys:

| Key | Contract |
|---|---|
| `slug` | Unique lower-case ASCII letters/numbers separated by hyphens; permanent URL identity |
| `name` | Display spelling, with Spanish/Guaraní accents preserved |
| `gender` | `f`, `m`, `u`; an editorial discovery category, not language grammar or official usage statistics |
| `origin` | Plain-language tradition/language; multiple origins may use ` y ` |
| `meaning` | Short plain text; qualify uncertainty rather than invent a literal meaning |
| `tags` | Any of `clasico`, `moderno`, `corto`, `compuesto`, `biblico`, `guarani`, `santo`, `unisex`; no duplicates |
| `review` | `status`, `sources`, `note`; described below |

Optional keys: `variants` (array of related display forms), `saint` (traditional date), `note` (specific editorial qualification), `native_form` (reference-language spelling, distinguished from a personal-name adaptation), `context` (specific, useful editorial explanation), and `compare` (explicit existing slugs to compare with that explanation). Comparisons must target actual records; a shared theme does not imply identical etymology or equivalent spelling. The browser's picker JSON intentionally omits these longer editorial fields.

`review.status` is `legacy` (inherited, not independently verified), `qualified` (explicit uncertainty/correction or partial lexical evidence), or `verified` (requires documentary evidence). Every source requires `title`, an HTTPS `url`, and a `checked` date in `YYYY-MM-DD`. Optional `scope` states exactly what the reference supports. A dictionary word does not prove a name's popularity, gender or inscription history. Do not mark a whole personal-name record verified on that evidence alone.

The importer in `tools/import-legacy.mjs` records the one-time conversion and explicit corrections. It writes to stdout. Do not regenerate over future catalog edits. `tools/legacy/` preserves the original inputs; it is not an alternate live catalog.

## Add or update

Use the export/upsert commands in the root README. Input is a JSON array of **complete** records to add or replace. Dry run validates without writing. `--write` validates the entire merged catalog and atomically replaces the PHP file. Review the Git diff, run `./verify.sh`, and merge through a PR. Keep an old slug when changing spelling. A slug change requires an explicit old-path redirect in `content/site.php`, plus a URL-map entry and tests; do not delete a known URL silently.

The validation gate catches duplicate slugs, normalized-name duplicates, malformed paths, inconsistent unisex/compound/Guaraní/santoral tags, markup in public fields, and verified records without references. It does not establish linguistic truth. Human source review is still necessary.

`docs/name-review-queue.csv` is the launch audit snapshot, not an editable source or an automatically maintained database. Keep it as provenance; regenerate it intentionally when doing another full audit. The route and JSON counts in tests derive from the live catalog and permit additions.

## Database plan

At 546 names, a reviewed PHP array is small, fast, cheap to back up in Git, and has no credentials or public write surface. It directly satisfies this release's no-DB requirement. Start here. A database would not improve data quality by itself.

If several nontechnical editors need frequent changes, introduce a separate authenticated editorial system in another task. Keep the same fields and stable slug IDs, add revision history, source records and approval state, then export a validated PHP snapshot for public serving. A future MySQL schema could separate `names`, `name_variants`, `tags`, `name_tags`, `sources`, `name_sources`, and `revisions`, with unique constraints on slug and validated status transitions. Do not introduce public write endpoints, a guessed admin password, or synchronization into this release.
