"""Keep published country/history tables consistent with checked CSV excerpts."""
import csv,json,pathlib,subprocess
root=pathlib.Path(__file__).resolve().parents[1]
data=json.loads(subprocess.check_output(['php','-r','echo json_encode(require $argv[1],JSON_UNESCAPED_UNICODE);',str(root/'content/rankings.php')],text=True))
snap=list(csv.DictReader((root/'docs/data/rankings-snapshot.csv').open()))
checks=0
for country,c in data.items():
    assert c['year']==2024 and c['official_url'].startswith('https://') and 'Paraguay' in c['scope'];checks+=1
    for year,history in c['history'].items():
        for sex,rows in history.items():
            expected=[{'rank':int(r['rank']),'name':r['name'],'count':int(r['published_count'])} for r in snap if r['country']==country and r['year']==year and r['sex']==sex]
            assert rows==expected,(country,year,sex);checks+=1
            assert all(r['count']>=5 for r in rows);checks+=1
    assert c['top']==c['history']['2024'];checks+=1
assert data['us']['top']['f'][0]=={'rank':1,'name':'Olivia','count':14718}
assert data['us']['top']['m'][0]=={'rank':1,'name':'Liam','count':22164}
assert data['fr']['top']['f'][0]['name']=='Louise' and data['fr']['top']['m'][0]['name']=='Gabriel'
assert {'Sophia','Sofia'}<={r['name'] for r in data['us']['top']['f']},'Spellings must not be merged'
print('PASS:',checks+4,'country/year/sex snapshot checks; documented scope, expected leaders and distinct spellings')
