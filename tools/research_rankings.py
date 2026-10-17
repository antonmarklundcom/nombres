#!/usr/bin/env python3
"""Research-time extraction only. Not used by PHP or Hostinger.

Requires duckdb for the INSEE Parquet input. Usage:
python tools/research_rankings.py --usa /path/babynames --france /path/prenoms-2024.parquet --output /tmp/rankings.json
Use source archives listed in docs/data-sources.md. Do not group spellings.
"""
import argparse,csv,hashlib,json,pathlib
parser=argparse.ArgumentParser();parser.add_argument('--usa',type=pathlib.Path,required=True);parser.add_argument('--france',type=pathlib.Path,required=True);parser.add_argument('--output',type=pathlib.Path,required=True)
args=parser.parse_args()
import duckdb
con=duckdb.connect(config={'threads':2,'memory_limit':'256MB'})
years=[1900,1950,1980,2000,2024]
def ranked(rows,share_ties=False):
    result=[];last=None;rank=0
    for i,(name,count) in enumerate(sorted(rows,key=lambda r:(-r[1],r[0])),1):
        if not share_ties or count!=last:rank=i
        result.append({'rank':rank,'name':name,'count':count});last=count
    return result
data={
 'us':{'label':'Estados Unidos','year':2024,'publisher':'Social Security Administration (SSA)','official_url':'https://www.ssa.gov/oact/babynames/','mirror_url':'https://github.com/seattletravis/babynames/tree/81facbe5ad6acb40a3cdeb08f6d3c4534f4da863/babynames','checked':'2026-10-17','scope':'Nacimientos de Estados Unidos presentes en los registros de la Seguridad Social; no es un ranking de Paraguay.','method':'La edición consultada fue tabulada al 2 de marzo de 2025. El archivo publica nombres con al menos cinco apariciones y separa F/M. Conservamos cada grafía; no sumamos Sophia y Sofia.','history':{},'source_sha256':{}},
 'fr':{'label':'Francia','year':2024,'publisher':'Institut national de la statistique et des études économiques (INSEE)','official_url':'https://www.insee.fr/fr/statistiques/8595130','mirror_url':'https://github.com/mthiboust/prenomscope/blob/9a07102934727c307701b8fbb4d9988cc09f6840/preprocessing/prenoms-2024.parquet','checked':'2026-10-17','scope':'Nivel nacional FRANCE, geografía F, del archivo INSEE 1900–2024; no es un ranking de Paraguay.','method':'Usamos las filas nacionales originales, sin agrupar variantes ni usar la normalización fonética del proyecto que aloja la copia. Las cantidades son los valores publicados, con la precisión del archivo; no se presentan como recuentos exactos sin redondeo. Los empates conservan el mismo puesto.','history':{},'source_sha256':{'parquet':hashlib.sha256(args.france.read_bytes()).hexdigest()}},
}
snapshot=[];usage=[]
for year in years:
    path=args.usa/f'yob{year}.txt'
    if not path.exists():path=args.usa/'set_aside'/f'yob{year}.txt'
    rows=list(csv.reader(path.open()))
    data['us']['source_sha256'][str(year)]=hashlib.sha256(path.read_bytes()).hexdigest()
    data['us']['history'][str(year)]={}
    data['fr']['history'][str(year)]={}
    for sex in ['f','m']:
        us=ranked([(n,int(count)) for n,s,count in rows if s.lower()==sex])
        fr_rows=con.execute("SELECT prenom,valeur FROM read_parquet(?) WHERE niveau_geographique='FRANCE' AND geographie='F' AND periode=? AND sexe=? AND NOT starts_with(prenom,'_')",[str(args.france),str(year),'2' if sex=='f' else '1']).fetchall()
        fr=ranked([(n.title(),count) for n,count in fr_rows],share_ties=True)
        assert us and fr,(year,sex)
        for country,ranking in [('us',us),('fr',fr)]:
            data[country]['history'][str(year)][sex]=ranking[:10]
            for r in ranking[:10]:snapshot.append([country,year,sex,r['rank'],r['name'],r['count']])
            if year==2024:
                data[country].setdefault('top',{})[sex]=ranking[:10]
                for r in ranking[:100]:usage.append([country,year,sex,r['rank'],r['name'],r['count']])
assert data['us']['top']['f'][0]=={'rank':1,'name':'Olivia','count':14718}
assert data['us']['top']['m'][0]=={'rank':1,'name':'Liam','count':22164}
assert data['fr']['top']['f'][0]['name']=='Louise'
assert data['fr']['top']['m'][0]['name']=='Gabriel'
out=pathlib.Path(__file__).resolve().parents[1]/'docs/data';out.mkdir(parents=True,exist_ok=True)
for filename,records in [('rankings-snapshot.csv',snapshot),('name-usage-2024.csv',usage)]:
    with (out/filename).open('w',newline='') as f:
        w=csv.writer(f,lineterminator='\n');w.writerow(['country','year','sex','rank','name','published_count']);w.writerows(records)
args.output.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Extracted two countries, five historical years, ungrouped spellings; snapshot assertions passed')
