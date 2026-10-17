"""Browser acceptance checks. Requires Python Playwright and Chromium; no npm."""
import argparse,json,pathlib,urllib.parse
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:8080')
parser.add_argument('--screenshots',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[1]/'docs/screenshots')
args=parser.parse_args();args.screenshots.mkdir(parents=True,exist_ok=True)
errors=[];external=[];requests=[];checks=0
def check(value,message):
    global checks
    checks+=1
    assert value,message
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':360,'height':800},device_scale_factor=1)
    page=context.new_page()
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('request',lambda request: requests.append({'url':request.url,'method':request.method}))
    page.on('request',lambda request: external.append(request.url) if urllib.parse.urlparse(request.url).netloc!=urllib.parse.urlparse(args.base).netloc else None)
    def visit(path):
        page.goto(args.base+path,wait_until='networkidle')
        page.evaluate('document.fonts.ready')
        check(not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'No horizontal overflow: {path}')
    # Check layout with overflow clipping disabled too; do not hide a width bug.
    for width in [360,375,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for path in ['/','/nombre/arami/','/nombre/yvoty/','/nombre/maria-de-los-angeles/','/nombres-guaranies/','/elegir/','/mi-lista/','/nombres-para-gatos/']:
            visit(path)
            page.add_style_tag(content='body { overflow-x: visible !important; }')
            check(not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'Unclipped width {width}: {path}')
            if width in [360,1440] and path in ['/','/nombre/arami/','/nombres-guaranies/']:
                label={'/':'home','/nombre/arami/':'arami','/nombres-guaranies/':'guarani'}[path]
                page.screenshot(path=str(args.screenshots/f'{label}-{width}.png'),full_page=True)
    page.set_viewport_size({'width':360,'height':800})
    visit('/elegir/')
    page.locator('#q').fill('sofía')
    expect(page.locator('[data-tool-results] .card')).to_have_count(2)
    check(page.locator('[data-tool-results]').inner_text().find('Sofía')>=0,'accented search')
    page.locator('#q').fill('sofia')
    expect(page.locator('[data-tool-results] .card')).to_have_count(2)
    page.locator('#q').fill('ñasaindy')
    expect(page.locator('[data-tool-results] .card')).to_have_count(1)
    page.locator('#q').fill('not-a-real-name')
    expect(page.locator('[data-tool-results]')).to_contain_text('No encontramos')
    page.locator('button[type=reset]').click()
    expect(page.locator('[data-tool-results] .card')).to_have_count(48)
    page.locator('[data-more]').click()
    expect(page.locator('[data-tool-results] .card')).to_have_count(96)
    page.locator('#f-t').select_option('guarani')
    expect(page.locator('[data-tool-results] .card')).to_have_count(20)
    check(page.locator('[data-tool-count]').inner_text()=='20 nombres','Guaraní filter count')
    visit('/nombre/arami/')
    page.locator('.fav-lg').click()
    expect(page.locator('.fav-lg')).to_have_attribute('aria-pressed','true')
    visit('/nombre/mateo/')
    page.locator('.fav-lg').click()
    visit('/mi-lista/')
    expect(page.locator('[data-my-list] .card')).to_have_count(2)
    page.locator('#ap1').fill('Benítez');page.locator('#ap2').fill('Villalba')
    expect(page.locator('[data-fullnames]')).to_contain_text('Aramí Benítez Villalba')
    share=page.locator('[data-share-url]').input_value()
    check('#n=' in share and 'Ben' not in share and '?' not in share,'Fragment sharing excludes surnames and server query')
    page.reload();expect(page.locator('#ap1')).to_have_value('Benítez')
    expect(page.locator('[data-my-list] .card')).to_have_count(2)
    page.locator('[data-duel-start]').first.click()
    expect(page.locator('[data-duel-stage]')).to_be_visible()
    page.locator('[data-duel-a]').click()
    expect(page.locator('[data-duel-winner]')).to_contain_text('Ganó Aramí')
    page.screenshot(path=str(args.screenshots/'favorites-360.png'),full_page=True)
    fresh=browser.new_context(viewport={'width':360,'height':800})
    second=fresh.new_page();second.goto(share,wait_until='networkidle')
    expect(second.locator('[data-shared-list] .card')).to_have_count(2)
    expect(second.locator('[data-my-list] .card')).to_have_count(0)
    second.locator('[data-save-all]').click();expect(second.locator('[data-my-list] .card')).to_have_count(2)
    # Old sharing URLs remain usable.
    second.goto(args.base+'/mi-lista/?n=arami,mateo',wait_until='networkidle')
    expect(second.locator('[data-shared-list] .card')).to_have_count(2)
    page.locator('[data-clear]').click()
    expect(page.locator('[data-my-list] .card')).to_have_count(0)
    expect(page.locator('#ap1')).to_have_value('')
    # A malformed old localStorage payload should not execute script or break the page.
    page.evaluate("localStorage.setItem('nombres:favs',JSON.stringify([{s:'arami',n:'<img src=x onerror=alert(1)>'}]))")
    visit('/mi-lista/')
    check(page.locator('[data-my-list] img').count()==0,'Stored strings are escaped')
    # Denied storage still permits navigation and in-memory favorites.
    private=browser.new_context()
    private.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('denied')}})")
    priv=private.new_page();priv.goto(args.base+'/nombre/mateo/')
    priv.locator('.fav-lg').click();expect(priv.locator('.fav-lg')).to_have_attribute('aria-pressed','true')
    # Server-rendered filtering is functional with JavaScript disabled.
    nojs=browser.new_context(java_script_enabled=False)
    plain=nojs.new_page();plain.goto(args.base+'/elegir/?q=kuarahy')
    expect(plain.locator('[data-tool-results] .card')).to_have_count(1)
    expect(plain.locator('[data-tool-results]')).to_contain_text('Kuarahy')
    check(not context.cookies(),'No cookies created')
    check(not external,'No third-party requests: '+str(external))
    check(all(r['method']=='GET' for r in requests),'No data submission requests')
    check(not errors,'No uncaught browser errors: '+str(errors))
    report={'layout_and_privacy_checks':checks,'uncaught_errors':errors,'third_party_requests':external,'screenshots':sorted(p.name for p in args.screenshots.glob('*.png')),'browser':'Chromium','interactions':['search accents and ñ','empty results','pagination','Guaraní filter','save/remove/persist favorites','surname preview and persistence','duel','fragment and legacy query sharing','import shared list','clear local data','escaped storage','storage denied','no-JS server filtering']}
    (args.screenshots.parent/'browser-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print('PASS:',checks,'layout/privacy checks; search, favorites, surnames, duel, sharing, storage denial and no-JS flow')
    browser.close()
