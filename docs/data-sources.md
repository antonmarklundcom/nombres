# Country statistics and name evidence

Research snapshot: 17 October 2026. The public country pages use **2024** data, not an invented 2026 ranking or a claim to contain the newest release. Official SSA/INSEE downloads were blocked from this environment. We checked accessible, commit-pinned copies, preserved input hashes and extracted the published rows ourselves. That distinction is disclosed on the site.

| Dataset | Official source | Checked copy |
|---|---|---|
| U.S. baby names, selected years 1900–2024 | [Social Security Administration](https://www.ssa.gov/oact/babynames/) | [seattletravis/babynames at 81facbe5](https://github.com/seattletravis/babynames/tree/81facbe5ad6acb40a3cdeb08f6d3c4534f4da863/babynames) |
| French given names, national rows 1900–2024 | [INSEE, release 8595130](https://www.insee.fr/fr/statistiques/8595130) | [mthiboust/prenomscope at 9a071029](https://github.com/mthiboust/prenomscope/blob/9a07102934727c307701b8fbb4d9988cc09f6840/preprocessing/prenoms-2024.parquet) |
| Thirteen Guaraní lexical senses | Educational dictionary, not a birth registry | [Sugar Labs at f0001d16](https://github.com/sugarlabs/diccionario-guarani-castellano-activity/blob/f0001d16948e07227880cebc9be208473c652990/lang/guarani/dic.txt) |

## Coverage and calculation

U.S. files contain spelling, recorded F/M sex and count for a birth year, with at least five occurrences per published name/sex row. The consulted edition was tabulated on 2 March 2025. Keep every spelling separate; Sophia and Sofia are different rows. Sort count descending then spelling ascending; assign sequential ranks to match the SSA tie convention. Historical coverage is not identical to a modern census of every birth. The public trend table shows leaders for five sampled years, not an annual growth curve or causal analysis.

French input columns are `sexe`, `prenom`, `periode`, `niveau_geographique`, `geographie`, `valeur`. Select only `niveau_geographique='FRANCE'` and `geographie='F'`, with `sexe='2'` for female and `'1'` for male. Do not sum national, regional and departmental rows. Exclude suppressed aggregate placeholders beginning `_`. Preserve accents and separate spellings; display converts uppercase spelling to title case without phonetic normalization. Use published values, whose precision/diffusion rules may include rounding. Tied values share a competition rank. We do not use the host project's phonetic/grouped results.

The public pages show ten names per sex in 2024. `rankings-snapshot.csv` contains the ten-name extracts for five historical years in both countries (200 rows). `name-usage-2024.csv` contains the top 100 rows for each country/sex (400 rows). Their country/sex categories describe the source, independently of the catalog's editorial discovery categories.

These sources establish usage in their named countries and years. They **do not verify etymology, linguistic gender, legal acceptance or popularity in Paraguay**. All 126 new catalog records remain `qualified`; no entry was marked `verified` from statistical usage evidence. No national Paraguay, Argentina or Brazil ranking was fabricated. Additional country pages should wait for an inspectable dataset with adequate coverage/methodology.

## Input SHA-256

| File | SHA-256 |
|---|---|
| SSA `yob1900.txt` | `989b4dbd5dc291b265b2201a57bd782844b73d6a74f61b30f985ea9d86b69d8e` |
| SSA `yob1950.txt` | `21af329adefa3166a5298a1950a6627dcbf15a74d76a86b0f13ebbf9f1d255cd` |
| SSA `yob1980.txt` | `267a579551800bd26ad693f0718848c37548c6b2b31c72051e064fe2feb3ec78` |
| SSA `yob2000.txt` | `97e320c9e06a691b8b7b0f511bff85bd0d50efc28be0687579b80740a7e8c133` |
| SSA `yob2024.txt` | `13a7c1e1a7eacf326331387b96f6a673c335a960a0ed65271ab4061b0aa1c3aa` |
| INSEE `prenoms-2024.parquet` | `cea2d47b0fcf5b33c79d2a74709dc1cce61c833e03e29db569d52792811a4f00` |

## Reproduce or refresh

Research tools require Python plus DuckDB for Parquet, outside the runtime checkout/deployment. Obtain the pinned copies, verify these hashes, then:

```bash
python3 tools/research_rankings.py --usa /private/research/babynames --france /private/research/prenoms-2024.parquet --output /tmp/rankings.json
php tools/json-to-php.php /tmp/rankings.json > /tmp/rankings.php
# Review CSV/content changes and source methodology before replacing content/rankings.php.
python3 tests/rankings.py
./verify.sh
```

The extractor writes the two CSV extracts and the requested JSON. The PHP converter only writes to stdout. Do not replace researched content blindly on startup. An annual update must inspect official methodology, year/edition, spelling/tie rules and changes in precision; record new pinned sources/hashes, revise Spanish titles/copy and check tables. Keep useful stable URLs instead of making yearly near-duplicate pages. Historical claims need consistent coverage; neither a foreign ranking nor Google search demand is a Paraguay birth count.

For the original 546 names and the Guaraní limitations, see `name-audit.md`. Specialist review and independent etymology sources remain the highest-value data improvement.

## Keyword-driven catalog follow-up

The original 126 additions came from the top-100 usage extracts. Two later additions, Aitana and Alaia, use exact rows from the full pinned SSA 2024 file. Existing Emanuel and Gael also have explicitly scoped spelling/usage references. `data/name-usage-followup-2024.csv` records these four rows and ranks; they are separate from the original 400-row top-100 extract. The Emanuel reference documents the spelling Emmanuel, as its scope says. No usage row independently verifies etymology or Paraguay frequency.

The supplied Keyword Planner Markdown is a different source, used for discovery priorities only. See `seo/paraguay-keyword-analysis.md` for source hash, parsing and grouping limits. The 6,600 estimate is potentially shared between broader baby-name intents and is not attributed exclusively to girls.
