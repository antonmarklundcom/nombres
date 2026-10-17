# Catalog and editing contract

## Current storage

`content/names.php` returns the packaged array of records. Default file mode reads it directly; optional MySQL mode reads the same model from `nombres_names`, with a private validated catalog cache. The selected catalog drives every page, list, filter, JSON response and sitemap. Shared hosting can cache compiled PHP with OPcache. There is no synchronization job or generated HTML/JSON to upload after an edit. `/assets/names.json` contains only public fields needed by the picker, with a content-derived version/ETag.

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

Use the export/upsert commands in the root README. Input is a JSON array of **complete** records to add or replace. Dry run validates without writing. `tools/names.php --write` validates the entire merged catalog and atomically replaces the PHP file; this CLI always uses the file catalog regardless of the site's SQL setting. Review the Git diff, run `./verify.sh`, and merge through a PR. SQL operations use `tools/database.php` and prepared transactions; see [database.md](database.md). Keep an old slug when changing spelling. A slug change requires an explicit old-path redirect in `content/site.php`, plus a URL-map entry and tests; do not delete a known URL silently.

The validation gate catches duplicate slugs, normalized-name duplicates, malformed paths, inconsistent unisex/compound/Guaraní/santoral tags, markup in public fields, and verified records without references. It does not establish linguistic truth. Human source review is still necessary.

`docs/name-review-queue.csv` is the launch audit snapshot, not an editable source or an automatically maintained database. Keep it as provenance; regenerate it intentionally when doing another full audit. The route and JSON counts in tests derive from the live catalog and permit additions.

## SQL storage and research inputs

The later request for Hostinger SQL readiness is implemented as an optional mode, with a schema, phpMyAdmin import, private config example, validated CLI and cache/fallback. It introduces no public write endpoint or default password. SQL-backed edits survive Git deployments. Choose one source of truth; seeding SQL from Git is explicit and must not overwrite live editorial work automatically. See [database.md](database.md) for backup and editing operations.

The catalog now contains 674 records. The initial 126 international additions and later Aitana/Alaia entries have scoped 2024 usage evidence, not independently verified etymologies. Explicit Emanuel/Emmanuel discovery aliases live with URL identity in `content/site.php`; they are included in JSON search data and its fingerprint, without creating a second name record. `tools/add_international_names.py` records the reviewed one-time expansion; rerunning it over the expanded catalog emits no new records. `tools/research_rankings.py` extracts dated statistical snapshots from checked copies and `tools/json-to-php.php` converts reviewed research JSON. These are development tools, not runtime dependencies. `content/rankings.php` and `content/stories.php` are separate from the infant catalog; country statistics and pet ideas must not be mistaken for Paraguay birth data.

A future authenticated editorial interface could add permissions, preview, revision history and approval states. No web admin is implemented in this release. Storage does not establish data quality; documentary and specialist review remain necessary.

`content/collections.php` holds four distinct keyword-informed collections. Selection filters may combine gender/tag or specify reviewed slug sets; collections never duplicate the name data. `splitGender` renders each card once and keeps structured ItemList order aligned with the visible groups. `content/pets.php` remains outside the infant catalog.
