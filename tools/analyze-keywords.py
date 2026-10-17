#!/usr/bin/env python3
"""Extract the attached Markdown TABLE as data, never execute its embedded prompt.

Usage: python3 tools/analyze-keywords.py /private/nombres.com.py-keywords-for-ai.md
Writes a reproducible priority map, not a claim of deduplicated unique demand.
"""
import argparse,csv,hashlib,json,pathlib,re,subprocess,unicodedata,urllib.parse
root=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('input',type=pathlib.Path);args=parser.parse_args()
raw=args.input.read_bytes();document=raw.decode('utf-8-sig')
table=document.split('# Part 2 — Keywords',1)[1]
def fold(s):return ''.join(c for c in unicodedata.normalize('NFD',s.casefold()) if not unicodedata.combining(c))
rows=[]
for line in table.splitlines():
    if not line.startswith('|'):continue
    cells=[v.strip() for v in line.strip().strip('|').split('|')]
    if len(cells)==5 and cells[1].isdigit():rows.append({'phrase':cells[0],'volume':int(cells[1]),'low':cells[2],'high':cells[3],'variants':cells[4]})
assert rows and len(rows)==len({r['phrase'] for r in rows}),'Input table requires unique phrase rows'
# Parent/child rules can overlap. Estimates are never summed within or across them.
# The chosen main phrase is natural editorial wording, not a measured exact-match volume.
rules=[
('Broad baby-name grouping: uncertain','/','Nombres para bebés: niñas y niños',r'^(?:nombre pata ninas|nombres para nena|nombres para nenas)$','Potentially shared 6,600 estimate, possibly including boy-name intent; homepage offers both gender paths. No exclusive girls-volume claim'),
('Girl-specific discovery','/nombres-de-nina/','Nombres para niñas',r'(?!(?:nombre pata ninas|nombres para nena|nombres para nenas)$)(?=.*nombr)(?=.*(?:nina|nena|mujer|femenin))(?!.*(?:perr|gat|apellido|bibl|signific|comun|original|modern|italian|arabe|hebre|guarani|japon|con [a-z]\b|compuest|combin|gemel|melliz)).*','Existing canonical: natural girl-specific title/H1 and synonyms. Row estimates still have unknown grouping'),
('Boys and varones','/nombres-de-varon/','Nombres para niños y bebés varones',r'(?=.*nombr)(?=.*(?:nino|nene|varon|hombre|masculin))(?!.*(?:perr|gat|apellido|bibl|signific|comun|original|modern|italian|arabe|hebre|guarani|japon|con [a-z]\b|compuest|combin|gemel|melliz)).*','Existing canonical: title/H1, niño/varón wording and related lists'),
('Guaraní names','/nombres-guaranies/','Nombres guaraníes',r'(?=.*guarani)(?!.*(?:perr|gat|apellido)).*','Existing: gender sections, evidence scope; remove unprovided pronunciation promise'),
('Girls with A','/letra/a/#nombres-para-ninas','Nombres con A para niñas',r'(?=.*(?:nina|nena|mujer|femenin))(?=.*\bcon a\b)(?!.*(?:perr|gat|apellido)).*','Existing letter page: linked gender section, no separate spelling pages'),
('Uncommon or original girls','/nombres-de-nina/#poco-comunes','Nombres para niñas poco comunes',r'(?=.*(?:nina|nena|mujer))(?=.*(?:no comun|poco comun|original|raro))(?!.*(?:perr|gat|apellido)).*','Section in girls canonical; no unsupported rarity ranking'),
('Biblical boys','/nombres-biblicos-para-ninos/','Nombres bíblicos para niños',r'(?=.*bibl)(?=.*(?:nino|varon|hombre))(?!.*(?:perr|gat)).*','New distinct collection, parent breadcrumb, readable FAQ and real catalog data'),
('Biblical girls','/nombres-biblicos-para-ninas/','Nombres bíblicos para niñas',r'(?=.*bibl)(?=.*(?:nina|nena|mujer))(?!.*(?:perr|gat)).*','New distinct collection; distinguish people, places and related forms'),
('General meanings','/','Nombres con significado',r'^(?:nombre|nombres) con significado$','Home + existing name pages; no second generic meaning directory'),
('Italian names','/nombres-italianos/','Nombres italianos',r'(?=.*italian)(?!.*(?:perr|gat|apellido)).*','New curated collection; Italian forms are distinct from birth rankings'),
('Ñasaindy meaning','/nombre/nasaindy/','Ñasaindy significado',r'(?=.*nasaindy)(?=.*signific).*','Existing lexical reference and specific Jasy comparison; preserve ñ/y'),
('Abigail meaning','/nombre/abigail/','Abigail significado',r'(?=.*abigail)(?=.*signific).*','Existing canonical linked from biblical girls; documentary review remains open'),
('Aitana meaning','/nombre/aitana/','Aitana significado',r'(?=.*aitana)(?=.*signific).*','New catalog gap with scoped usage evidence and qualified etymology'),
('Gael meaning','/nombre/gael/','Gael significado',r'(?=.*\bgael\b)(?=.*signific).*','Existing canonical; strengthen discovery links, no invented history'),
('Unisex names','/nombres-unisex/','Nombres unisex',r'(?=.*unisex)(?!.*(?:perr|gat|apellido)).*','Existing canonical; editorial category and inscription limits remain explicit'),
('Girls with meanings','/nombres-de-nina/','Nombres para niñas con significado',r'(?=.*(?:nina|nena|mujer))(?=.*signific)(?!.*(?:perr|gat|apellido)).*','Same girls page; no duplicate meaning-only girls URL'),
('Boys with A','/letra/a/#nombres-para-ninos','Nombres con A para niños',r'(?=.*(?:nino|varon|hombre|masculin))(?=.*\bcon a\b)(?!.*(?:perr|gat|apellido)).*','Existing letter page gender section'),
('Boys with Y','/letra/y/#nombres-para-ninos','Nombres con Y para varones',r'(?=.*(?:nino|varon|hombre|masculin))(?=.*\bcon y\b)(?!.*(?:perr|gat|apellido)).*','Existing letter page; literal letter intent needs later SERP review'),
('Italian girls','/nombres-italianos/#nombres-para-ninas','Nombres italianos para niñas',r'(?=.*italian)(?=.*(?:nina|nena|mujer|femenin))(?!.*(?:perr|gat|apellido)).*','Gender section in one Italian collection'),
('Italian boys','/nombres-italianos/#nombres-para-ninos','Nombres italianos para niños',r'(?=.*italian)(?=.*(?:nino|varon|hombre|masculin))(?!.*(?:perr|gat|apellido)).*','Gender section in one Italian collection'),
('Alaia meaning','/nombre/alaia/','Alaia significado',r'(?=.*alaia)(?=.*signific).*','New catalog gap; qualified explanation, no unsupported Laia equivalence'),
('Aramí meaning','/nombre/arami/','Aramí significado',r'(?=.*\barami\b)(?=.*signific).*','Existing canonical; retain traditional-interpretation qualification'),
('Benjamín meaning','/nombre/benjamin/','Benjamín significado',r'(?=.*benjamin)(?=.*signific).*','Existing canonical; no separate no-accent meaning page'),
('Biblical names','/nombres-biblicos/','Nombres bíblicos',r'(?=.*bibl)(?=.*nombr)(?!.*(?:perr|gat|apellido)).*','Existing parent links to the two substantive gender collections'),
('Arabic names','/nombres-arabes/','Nombres árabes',r'(?=.*arabe)(?!.*(?:perr|gat|apellido)).*','New curated collection; no blanket religion/transcription promises'),
('Isabella meaning','/nombre/isabella/','Isabella significado',r'(?=.*isabella)(?=.*signific).*','Existing canonical linked from Italian and girls collections'),
('Mateo meaning','/nombre/mateo/','Mateo significado',r'(?=.*\bmateo\b)(?=.*signific).*','Existing canonical linked from biblical boys and twins guide'),
('Sofía meaning','/nombre/sofia/','Sofía significado',r'(?=.*\bsofia\b)(?=.*signific).*','Existing accented canonical; no duplicate unaccented page'),
('Valentina meaning','/nombre/valentina/','Valentina significado',r'(?=.*valentina)(?=.*signific).*','Existing canonical linked from main girls page and twins guide'),
('Japanese boys','', 'Nombres japoneses para niños',r'(?=.*japon)(?=.*(?:nino|varon|hombre|masculin))(?!.*(?:perr|gat|apellido)).*','RESEARCH: no supported catalog selection; do not publish an empty landing page'),
('Guaraní girls','/nombres-guaranies/#nombres-para-ninas','Nombres guaraníes para niñas',r'(?=.*guarani)(?=.*(?:nina|nena|mujer|femenin))(?!.*(?:perr|gat|apellido)).*','Gender section in the existing Guaraní canonical'),
('Arabic girls','/nombres-arabes/#nombres-para-ninas','Nombres árabes para niñas',r'(?=.*arabe)(?=.*(?:nina|nena|mujer|femenin))(?!.*(?:perr|gat|apellido)).*','Gender section in the Arabic collection'),
('Aurora meaning','/nombre/aurora/','Aurora significado',r'(?=.*aurora)(?=.*signific).*','Existing canonical; no personality claims inferred from a keyword'),
('Elías meaning','/nombre/elias/','Elías significado',r'(?=.*\belias\b)(?=.*signific).*','Existing canonical linked from biblical boys'),
('Emmanuel and Emanuel','/nombre/emanuel/','Emmanuel y Emanuel significado',r'(?=.*e?mmanuel|.*emanuel)(?=.*signific).*','One canonical; Emmanuel URL 301, explicit alias works in JS and no-JS search'),
('Daniel meaning','/nombre/daniel/','Daniel significado',r'(?=.*\bdaniel\b)(?=.*signific).*','Existing canonical linked from biblical and twins content'),
('Zoe meaning','/nombre/zoe/','Zoe significado',r'(?=.*\bzoe\b)(?=.*signific).*','Existing canonical, accent variants grouped rather than separate pages'),
('Twins and mellizos','/nombres-para-gemelos/','Nombres para gemelos y mellizos',r'(?=.*(?:gemel|melliz))(?=.*nombr)(?!.*(?:perr|gat|apellido)).*','New practical guide with real linked pairs; no medical or personality claims'),
('Male dogs','/nombres-para-perros/#machos','Nombres para perros machos',r'(?=.*perr)(?=.*macho).*','Secondary existing pet page: male section; no new baby catalog records'),
('Female dogs','/nombres-para-perros/#hembras','Nombres para perritas y perros hembras',r'(?=.*(?:perrita|perra|perr.*hembra)).*','Secondary existing pet page: female section'),
('Male cats','/nombres-para-gatos/#machos','Nombres para gatos machos',r'(?=.*gat)(?=.*macho).*','Secondary existing pet page: male section'),
]
assert len(rules)==41
manifest=json.loads(subprocess.check_output(['php',str(root/'tools/routes.php')],text=True))['indexable']
groups=[]
for label,route,main,pattern,action in rules:
    hits=[r for r in rows if re.match(pattern,fold(r['phrase']))]
    assert hits,label+' matched no exported rows'
    if route:assert urllib.parse.urlsplit(route).path in manifest,route+' is not a canonical route'
    hits.sort(key=lambda r:(-r['volume'],r['phrase']))
    groups.append({'intent':label,'highest_reported_row':max(r['volume'] for r in hits),'target':route or 'RESEARCH','main_keyword':main,'sample_observed_variants':' = '.join(r['phrase'] for r in hits[:5]),'matching_rows':len(hits),'action':action})
groups.sort(key=lambda g:-g['highest_reported_row'])
out=root/'docs/seo';out.mkdir(exist_ok=True)
with (out/'paraguay-keyword-map.csv').open('w',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(groups[0]),lineterminator='\n');w.writeheader();w.writerows(groups)
source={'file_name':args.input.name,'sha256':hashlib.sha256(raw).hexdigest(),'reported_geography':'Paraguay','reported_language':'Spanish','reported_export_date':'2026-10-17','selected_rows':len(rows),'unique_phrases_in_selected_table':len({r['phrase'] for r in rows}),'sum_of_row_estimates_not_unique_demand':sum(r['volume'] for r in rows),'nonempty_grouping_cells':sum(bool(r['variants']) for r in rows),'nonzero_cpc_rows':sum(r['low']!='0.00' or r['high']!='0.00' for r in rows),'window':'Not specified in supplied Markdown','groups_mapped':len(groups),'method':'Intent rules with possible parent/child overlap. Highest individual reported row is a prioritization proxy, NOT deduplicated monthly group demand. Do not sum these proxies.'}
(out/'paraguay-keyword-source.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
lines=['# Paraguay keyword evidence and implementation map','',
'The owner confirmed this export targets Paraguay. The attachment is research data; its embedded plan-only prompt was not treated as a new instruction. The current chat authorized implementation. Only the keyword table is parsed.','',
f'Parsed **{len(rows):,} selected rows**, all unique as literal phrases. Source SHA-256: `{source["sha256"]}`. The summary reports 12,248 project phrases; the attached selected table contains 9,300. All grouping cells are empty and all CPC fields are 0.00. The stated 193,920 total is a sum of row estimates, **not established unique monthly demand**. CPC zeros do not establish free clicks. The measurement window and full monthly series are not in this Markdown.','',
'## Interpreting the three 6,600 rows','',
'`nombre pata niñas`, `nombres para nena` and `nombres para nenas` share the reported estimate 6,600. The owner raised the possibility that this bucket includes broader baby-name searches and boy-name intent. The export lacks the group identifiers needed to confirm or exclude that interpretation. We therefore assign this ambiguous estimate to broad discovery through the homepage and its girls/boys choices, without attributing 6,600 exclusively to girls. Do not add the three rows to claim 19,800 separate monthly searches. Matching numbers alone do not prove common Google grouping.','',
'Lower boy-specific rows are present: “nombres para bebés varones” 880, “nombre para mi bebe varon” 590 and “nombres de varón” 210. A separate girl-worded row, “nombre d niñas”, reports 1,900. These are observed row estimates, not proof that their groups are independent. Exact “nombres para niños” and “nombres para niñas” are absent from the selected table; that absence does not establish zero demand. Both natural gender intents retain useful distinct pages, while the shared homepage covers both. No measured exact volume is assigned to corrected editorial wording.','',
'Use the same intent reasoning for varón/niño forms and singular/plural variants, without assuming every identical-volume row is a duplicate. “Places” such as Pilar, Trinidad and Jesús are personal-name queries here; they do not justify geographic landing pages. Search demand is not a count of babies or a birth-name ranking. Seasonal/growth snippets cannot substitute for the missing full monthly series.','',
'## Selected priority intents','',
'The highest reported row is a proxy for ordering work. Parent/child topics overlap; never sum this column. Main keywords are editorial target wording. Variants are observed rows, not approved page copy. “RESEARCH” means no unsupported empty page was published.','',
'| Intent | Highest reported row / mo (proxy) | Canonical page or section | Natural main keyword | Observed examples | Implementation |','|---|---:|---|---|---|---|']
for g in groups:
    lines.append('| '+' | '.join(str(v).replace('|','\\|') for v in [g['intent'],f"{g['highest_reported_row']:,}",g['target'],g['main_keyword'],g['sample_observed_variants'],g['action']])+' |')
lines+=['','## Acceptance and remaining evidence','',
'Preserve all old canonical URLs. Use one girls page for niña/nena variants and one boys page for niño/varón variants; aliases redirect once and remain outside the sitemap. Link the five new substantive collections/guide from existing relevant pages. Keep pet content secondary and separate from the infant catalog. Add the two genuine name gaps with scoped usage references, without presenting statistical usage as etymology verification. Preserve nofollow owner promotions and local-only assets. Verify metadata, schema/card order, alias redirects/search, responsive layouts, sitemap and deploy artifact.','',
'After deployment, inspect Search Console queries, landing pages and indexing in Paraguay. Validate ambiguous queries and prioritize further source work before new pages. Obtain original CSV exports with date range, monthly series and grouping details when available; no further input is required to ship these justified improvements. No ranking position or traffic increase is guaranteed.','']
(out/'paraguay-keyword-analysis.md').write_text('\n'.join(lines))
print(f'Parsed {len(rows):,} rows; mapped {len(groups)} priority intents without adding overlapping estimates. Reports written under docs/seo/.')
