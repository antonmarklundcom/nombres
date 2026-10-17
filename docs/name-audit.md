# Name audit — 17 October 2026

Baseline: `20da13d0b0e6ea0317b247a3430dabdfbeb35612`. The original build produced 586 HTML files and 584 sitemap URLs, and the existing verifier passed 123,683 checks. The original build was also run in a temporary copy: two builds were byte-for-byte identical to the tracked generated output.

## Scope and results

All **546** records were structurally audited: **288** categorized as niña, **245** as varón, **13** as unisex; **20** linked to Guaraní. No duplicate slugs were found. No original name slug was removed. The JSON audit lists every changed field: [name-audit.json](name-audit.json). The spreadsheet-ready review queue has one row per record: [name-review-queue.csv](name-review-queue.csv).

**53 records** have editorial changes or added spelling qualifications. Maria compounds no longer inherit an unsupported literal “amada” claim. Catalina/Karen, Elena, Mónica, Arturo, Ignacio/Ignacia, Luana and others now qualify uncertain explanations. Alessia is linked to Alessio rather than incorrectly being called the Italian form of Alejandra. Verónica separates the Berenice connection from the later “vera icon” interpretation. Francisco and its related text distinguish “French” from the broad “free” gloss.

Guaraní edits remove invented Spanish-style phonetic spellings and automatic equivalences such as Porã/Porá or Jasy/Yací. Traditional personal-name spellings remain available at their old URLs; the reference lexical spelling is a separate field. Itatí is presented through its devotional association without asserting an uncertain literal translation. Irupé no longer claims an unsupported decomposition. Gender labels are explicitly editorial rather than grammatical or statistical.

## Documentary evidence

Thirteen lexical senses were checked against the educational [Sugar Labs Guaraní-Castellano dictionary](https://github.com/sugarlabs/diccionario-guarani-castellano-activity/blob/f0001d16948e07227880cebc9be208473c652990/lang/guarani/dic.txt): Jasy, Yvoty, Kuarahy, Mainumby, Arandú/arandu, Ñasaindy, Mbyja, Mburucuyá/mburukuja, Ysapy, Arapoty, Poty, Araí/arai and Yerutí/jeruti. Each record has a commit-pinned source link to its entry, consultation date and evidence scope. This is a secondary educational source, not a government naming registry or an expert endorsement. No software or dictionary database was copied into the runtime; references support short lexical facts.

Direct requests to SPL, RAE, Wiktionary and Behind the Name were blocked by the cloud network policy. GitHub-hosted reference material was accessible. We therefore do **not** claim that all 546 meanings, saint dates, gender assignments, historical variants or personal-name usage in Paraguay have been independently verified. Current states are 482 `legacy`, 64 `qualified`, zero `verified`. The site exposes its limits and does not fabricate popularity or search volumes.

## Content depth

The SEO follow-up adds specific practical context to the thirteen lexically referenced Guaraní entries, preserves all review states, and links existing related forms and compound-name parts. It does not add unsourced names or mark incomplete research as verified.

The old name pages relied heavily on a shared template. This release offers a useful individual meaning/origin summary, specific notes where available, source state, related forms, surname examples, local-only surname comparison, related names and category links. These are useful interactions, not proof that every page merits indexing. There is no automatic word-count padding or claim that related names share the same etymology. All old pages remain functional; no automatic mass noindex was applied without search evidence.

Next editorial priority: verify all 20 Guaraní entries with a competent speaker and current dictionary; then disputed etymologies, compound names and saint dates; then all remaining records. Record exact source evidence and its scope. Merge equivalent variants only after considering existing URLs, user meaning and real search data. Add names because parents find them useful and their facts can be supported, not to reach an arbitrary page count.
