"""Standard-library crawl of every declared page; runs against PHP or Apache."""
import argparse, concurrent.futures, html.parser, json, pathlib, re, struct
import urllib.request, urllib.error, urllib.parse, xml.etree.ElementTree as ET

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:8080')
parser.add_argument('--root',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1])
parser.add_argument('--report',type=pathlib.Path)
args=parser.parse_args()
origin='https://nombres.com.py'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,*args): return None
opener=urllib.request.build_opener(NoRedirect)
def get(path):
    try:
        r=opener.open(args.base+path,timeout=15)
    except urllib.error.HTTPError as err: r=err
    return r.status,r.headers,r.read()
class Page(html.parser.HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True)
        self.tags=[];self.links=[];self.images=[];self.meta={};self.title='';self.h1=[];self.schema=[];self.capture=None;self.buffer='';self.canon=[];self.ids=set();self.forms=[]
        self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs);self.tags.append(tag)
        if 'id' in a:self.ids.add(a['id'])
        if tag in ['title','h1'] or (tag=='script' and a.get('type')=='application/ld+json'):
            self.capture=tag;self.buffer=''
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canon.append(a.get('href'))
        if tag=='form':self.forms.append(a)
        if tag in ['a','link','script','img']:
            target=a.get('href',a.get('src'))
            if target:self.links.append((tag,target,a))
        if tag=='img':self.images.append(a)
    def handle_data(self,data):
        if self.capture:self.buffer+=data
    def handle_endtag(self,tag):
        if tag==self.capture:
            if tag=='title':self.title=self.buffer
            if tag=='h1':self.h1.append(self.buffer)
            if tag=='script':self.schema.append(json.loads(self.buffer))
            self.capture=None

checks=0
def check(cond,msg):
    global checks
    checks+=1
    if not cond:raise AssertionError(msg)
status,headers,xml=get('/sitemap.xml')
check(status==200,'sitemap 200')
urls=[x.text for x in ET.fromstring(xml).findall('{*}url/{*}loc')]
paths=[u.removeprefix(origin) for u in urls]
check(len(paths)==len(set(paths)),'sitemap has unique URLs')
check(all(u.startswith(origin+'/') for u in urls),'sitemap uses production HTTPS apex')
check('/mi-lista/' not in paths,'favorites excluded from sitemap')
legacy=json.loads((args.root/'docs/legacy-routes.json').read_text())
check(set(legacy['indexable'])<=set(paths),'all legacy indexable URLs preserved')
results=[];assets=set();titles=set();descriptions=set();raw_bytes=0
for path in paths+['/mi-lista/']:
    status,headers,raw=get(path);text=raw.decode();page=Page(text);raw_bytes+=len(raw)
    check(status==200,f'{path}: 200')
    check(not re.search(r'<b>(?:Warning|Notice|Fatal error)|Stack trace:|<br\s*/?>\s*(?:Warning|Fatal error)',text),f'{path}: no PHP errors')
    check(text.startswith('<!doctype html>') and '<html lang="es-PY">' in text,f'{path}: document language')
    check(len(page.h1)==1 and bool(page.h1[0].strip()),f'{path}: exactly one h1')
    check(0<len(page.title)<=60,f'{path}: title length {len(page.title)}')
    check(page.title not in titles,f'{path}: unique title');titles.add(page.title)
    desc=page.meta.get('description','');check(120<=len(desc)<=160,f'{path}: description length {len(desc)}')
    check(desc not in descriptions,f'{path}: unique description');descriptions.add(desc)
    check(page.canon==[origin+path],f'{path}: canonical')
    check(page.meta.get('og:url')==origin+path,f'{path}: OG URL')
    for key in ['og:title','og:description','og:locale','og:type','og:site_name','og:image','og:image:alt']:
        check(bool(page.meta.get(key)),f'{path}: {key}')
    check(page.meta['og:title']==page.title,f'{path}: OG title matches')
    check(page.meta.get('og:image:width')=='1200' and page.meta.get('og:image:height')=='630',f'{path}: OG dimensions')
    if path=='/mi-lista/':check(page.meta.get('robots')=='noindex, follow',f'{path}: noindex')
    else:check('noindex' not in page.meta.get('robots',''),f'{path}: indexable')
    check(len(page.schema)==1,f'{path}: one JSON-LD block')
    graph=page.schema[0]['@graph'];types={s['@type'] for s in graph}
    check({'WebSite','BreadcrumbList'}<=types,f'{path}: WebSite and breadcrumbs')
    crumb=next(s for s in graph if s['@type']=='BreadcrumbList')
    check(crumb['itemListElement'][-1]['item']==origin+path,f'{path}: current breadcrumb')
    if path.startswith('/letra/') or path in ['/elegir/']+['/nombres-'+x+'/' for x in ['de-nina','de-varon','guaranies','biblicos','clasicos','modernos','cortos','compuestos','unisex']]:
        check('ItemList' in types,f'{path}: ItemList')
        items=next(s for s in graph if s['@type']=='ItemList')
        check(items['numberOfItems']==len(items['itemListElement']),f'{path}: ItemList count')
        check(all(item['url'].removeprefix(origin) in paths for item in items['itemListElement']),f'{path}: ItemList targets')
    check('Set-Cookie' not in headers,f'{path}: no cookies')
    check('app.embarazo.com.py/' in text,f'{path}: Mi Bebé footer')
    check('babyshower.com.py' not in text and 'wa.me' not in text,f'{path}: no old sales or WhatsApp links')
    if path.startswith('/nombre/') or path.startswith('/letra/'):
        check('class="app-promo"' in text,f'{path}: app promotion')
    for tag,target,a in page.links:
        if target.startswith('#'):
            check(target[1:] in page.ids,f'{path}: valid anchor {target}');continue
        split=urllib.parse.urlsplit(target)
        if split.scheme or split.netloc:
            check(tag not in ['script','img'] and not (tag=='link' and a.get('rel') in ['stylesheet','preload']),f'{path}: all loaded resources local')
            check(not re.search(r'[?&](utm_|gclid|fbclid)',target),f'{path}: no tracking params')
            continue
        check(target.startswith('/'),f'{path}: absolute internal path {target}')
        dest=split.path
        if dest.startswith('/assets/'):assets.add(dest)
        else:check(dest in paths or dest=='/mi-lista/',f'{path}: declared internal link {target}')
    for image in page.images:check('alt' in image and 'width' in image and 'height' in image,f'{path}: image dimensions and alt')
    results.append({'path':path,'status':status,'bytes':len(raw)})
for asset in assets:
    status,headers,raw=get(asset);check(status==200 and len(raw)>0,'asset '+asset)
status,headers,raw=get('/assets/og.png');check(struct.unpack('>II',raw[16:24])==(1200,630),'OG binary dimensions')
status,headers,raw=get('/assets/names.json');data=json.loads(raw)
check(status==200 and len(data['n'])==len([p for p in paths if p.startswith('/nombre/')]),'JSON catalog matches name routes')
for path in paths[1:]+['/mi-lista/']:
    status,headers,_=get(path.rstrip('/'));check(status==301 and headers.get('Location')==path,'trailing slash '+path)
    status,headers,_=get(path+'index.html');check(status==301 and headers.get('Location')==path,'legacy HTML '+path)
for path,target in [('/index.html','/'),('/index.php','/'),('/sitemap.php','/sitemap.xml'),('/robots.php','/robots.txt'),('/nombre/arami?x=1','/nombre/arami/?x=1')]:
    status,headers,_=get(path);check(status==301 and headers.get('Location')==target,'explicit redirect '+path)
for path in ['/missing-page/','/404.html','/.git/config','/content/names.php','/lib/bootstrap.php','/partials/head.php','/templates/name.php','/tools/names.php','/tests/browser.py','/deploy/make-zip.py','/docs/legacy-routes.json','/router.php','/tools/legacy/names.mjs','/assets/../content/names.php','/assets/%2e%2e/content/names.php']:
    status,headers,raw=get(path);check(status in [403,404],f'{path}: source denied (got {status})')
    check(b'<?php' not in raw and b'Canonical name catalog' not in raw,f'{path}: no source disclosure')
status,headers,raw=get('/elegir/?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E')
check(status==200 and b'<script>alert(1)</script>' not in raw,'search escapes untrusted input')
check(Page(raw.decode()).meta.get('robots')=='noindex, follow','search combinations noindex')
status,headers,raw=get('/elegir/?q[]=bad&g[]=bad');check(status==200 and b'Warning' not in raw,'array query input handled')
status,headers,raw=get('/robots.txt');check(status==200 and (origin+'/sitemap.xml').encode() in raw,'robots sitemap declaration')
report={'checks':checks,'pages':len(results),'sitemap_urls':len(paths),'assets':len(assets),'total_html_bytes':raw_bytes,'results':results}
if args.report:args.report.write_text(json.dumps(report,indent=2)+'\n')
print(f'PASS: {checks} crawl checks, {len(results)} pages, {len(paths)} sitemap URLs, {len(assets)} local assets')
