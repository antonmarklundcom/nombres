#!/usr/bin/env python3
"""One-time, reviewed catalog expansion. Emits JSON for the validated upsert CLI.
Usage: python tools/add_international_names.py --output /tmp/new-names.json
Never rerun over later edits without reviewing a diff. Catalog remains PHP.
"""
import argparse,csv,json,pathlib,subprocess,unicodedata
root=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--output',type=pathlib.Path,required=True);args=parser.parse_args()
# Brief editorial etymologies are qualified; usage sources do not certify them.
rows=[
('Charlotte','f','francés','Forma francesa femenina de Charles, relacionada con Carlos.','c',['Carlota','Carla']),
('Sophia','f','griego','Sabiduría; grafía internacional relacionada con Sofía.','c',['Sofía']),
('Evelyn','f','inglés','Nombre relacionado con el antiguo Aveline; su etimología es discutida.','m',[]),
('Ava','f','discutido','Nombre de distintas tradiciones; no tiene un único significado demostrado.','m',[]),
('Harper','f','inglés','De un apellido ocupacional inglés: quien toca el arpa.','m',[]),
('Eleanor','f','inglés','Forma inglesa relacionada con Leonor; origen último discutido.','c',['Leonor']),
('Violet','f','inglés','Violeta, la flor; forma inglesa relacionada con Violeta.','m',['Violeta']),
('Eliana','f','hebreo','Se interpreta tradicionalmente como «mi Dios ha respondido»; también tiene otras tradiciones.','m',[]),
('Hazel','f','inglés','Avellano, el árbol; nombre tomado de una palabra inglesa.','m',[]),
('Chloe','f','griego','Brote verde, verdor; forma relacionada con Chloé.','m',['Chloé']),
('Ellie','f','inglés','Forma breve de nombres como Eleanor o Ellen; el sentido depende del nombre de origen.','m',[]),
('Nora','f','discutido','Puede ser forma breve de Leonor o relacionarse con Honora, según la tradición.','m',[]),
('Lily','f','inglés','Lirio, la flor; nombre tomado de la palabra inglesa.','m',[]),
('Aria','f','italiano y persa','En italiano remite a un aria musical; tiene otras tradiciones con sentidos distintos.','m',[]),
('Scarlett','f','inglés','Relacionado con scarlet, escarlata; llegó como nombre a través de un apellido.','m',[]),
('Penelope','f','griego','Nombre de la tradición de la Odisea; su etimología es discutida.','c',['Penélope']),
('Ella','f','discutido','Nombre de distintas tradiciones y forma breve de otros nombres; no tiene un único origen.','m',[]),
('Mila','f','eslavo','Forma breve de nombres eslavos con el elemento mil, relacionado con lo querido o amable.','m',[]),
('Lucy','f','inglés','Forma inglesa de Lucía, vinculada al latín lux, luz.','c',['Lucía']),
('Isla','f','escocés','Nombre vinculado a la isla escocesa de Islay; no se explica sólo por la palabra castellana isla.','m',[]),
('Ivy','f','inglés','Hiedra, la planta; nombre tomado de la palabra inglesa.','m',[]),
('Layla','f','árabe','Noche; otra grafía relacionada con Leila.','m',['Leila']),
('Nova','f','latín','Nueva; también evoca el término astronómico nova.','m',[]),
('Grace','f','inglés','Gracia; nombre inglés relacionado con la palabra de origen latino.','c',[]),
('Willow','f','inglés','Sauce, el árbol; nombre tomado de la palabra inglesa.','m',[]),
('Naomi','f','hebreo','Forma relacionada con Noemí: mi dulzura, mi agrado.','c',['Noemí']),
('Stella','f','latín','Estrella; forma relacionada con Estela.','c',['Estela']),
('Delilah','f','hebreo','Forma inglesa de Dalila; la interpretación de su significado es discutida.','c',['Dalila']),
('Maya','f','discutido','Tiene tradiciones distintas; no se debe confundir automáticamente con Maia ni dar una única traducción.','m',['Maia']),
('Hannah','f','hebreo','Gracia, favor; forma relacionada con Ana.','c',['Ana']),
('Leah','f','hebreo','Nombre bíblico de significado discutido; forma relacionada con Lea.','c',['Lea']),
('Lillian','f','inglés','Forma vinculada a Lily o a Elizabeth según la tradición; etimología discutida.','c',[]),
('Genesis','f','griego','Origen, nacimiento; alude también al título del libro bíblico Génesis.','m',['Génesis']),
('Josephine','f','francés','Forma de Josefina, relacionada con José: Dios añadirá.','c',['Josefina','Joséphine']),
('Sadie','f','inglés','Forma familiar de Sarah, relacionada con Sara.','m',['Sara']),
('Adeline','f','francés','Forma relacionada con Adela y el elemento germánico adal, noble.','c',['Adela']),
('Zoey','f','griego','Grafía relacionada con Zoe: vida.','m',['Zoe']),
('Sophie','f','francés','Forma francesa relacionada con Sofía: sabiduría.','c',['Sofía']),
('Alice','f','francés','Forma relacionada con Alicia y Adelaida, de tradición germánica.','c',['Alicia']),
('Ruby','f','inglés','Rubí, la piedra preciosa; nombre tomado de la palabra inglesa.','m',[]),
('Claire','f','francés','Forma francesa de Clara: clara, luminosa.','c',['Clara']),
('Natalie','f','francés','Forma relacionada con Natalia y la tradición del nacimiento en Navidad.','c',['Natalia']),
('Maeve','f','irlandés','Forma de Medb, nombre de la tradición irlandesa; se interpreta como «la que embriaga».','m',[]),
('Daisy','f','inglés','Margarita, la flor; nombre tomado de la palabra inglesa.','m',[]),
('Audrey','f','inglés','Del antiguo Æðelþryð, relacionado con nobleza y fuerza.','c',[]),
('Millie','f','inglés','Forma breve de nombres como Mildred o Millicent; el origen depende de la forma completa.','m',[]),
('Madeline','f','francés','Forma relacionada con Magdalena, natural de Magdala.','c',['Magdalena']),
('Athena','f','griego','Nombre de la diosa Atenea; la etimología original es discutida.','c',['Atenea']),
('Melody','f','inglés','Melodía; nombre tomado de la palabra inglesa de origen griego.','m',[]),
('Anna','f','hebreo','Gracia, favor; otra forma de Ana.','c',['Ana']),
('Sarah','f','hebreo','Princesa; otra grafía relacionada con Sara.','c',['Sara']),
('Noah','m','hebreo','Forma relacionada con Noé, tradicionalmente vinculada con descanso o reposo.','c',['Noé']),
('Theodore','m','griego','Forma inglesa de Teodoro: regalo de Dios.','c',['Teodoro']),
('James','m','hebreo','Forma inglesa relacionada con Jacob; no es un nombre de origen germánico.','c',['Jacob','Jaime']),
('Henry','m','germánico','Forma inglesa de Enrique: señor de la casa.','c',['Enrique']),
('Elijah','m','hebreo','Forma inglesa de Elías: Yahvé es Dios.','c',['Elías']),
('William','m','germánico','Forma inglesa de Guillermo, relacionado con voluntad y protección.','c',['Guillermo']),
('Levi','m','hebreo','Nombre bíblico interpretado tradicionalmente como unido o vinculado.','c',[]),
('Ezra','m','hebreo','Ayuda; forma relacionada con Esdras.','c',['Esdras']),
('Jack','m','inglés','Forma familiar relacionada históricamente con John, Juan.','c',['John','Juan']),
('Michael','m','hebreo','Forma inglesa de Miguel: ¿quién como Dios?','c',['Miguel']),
('Ethan','m','hebreo','Se interpreta como firme, sólido o duradero.','c',[]),
('Asher','m','hebreo','Feliz, afortunado; nombre bíblico.','c',[]),
('John','m','hebreo','Forma inglesa de Juan: Dios es misericordioso.','c',['Juan']),
('Hudson','m','inglés','De un apellido patronímico: hijo de Hudde.','m',[]),
('Owen','m','galés','Forma de Owain; su relación con otros nombres y su etimología son discutidas.','c',[]),
('Alexander','m','griego','Forma relacionada con Alejandro: defensor de las personas.','c',['Alejandro']),
('Joseph','m','hebreo','Forma relacionada con José: Dios añadirá.','c',['José']),
('Matthew','m','hebreo','Forma inglesa de Mateo: don de Dios.','c',['Mateo']),
('Luke','m','griego','Forma inglesa de Lucas, vinculado con Lucania.','c',['Lucas']),
('Jackson','m','inglés','De un apellido patronímico: hijo de Jack.','m',['Jack']),
('Miles','m','discutido','Nombre relacionado con Milo; su etimología original es discutida.','c',['Milo']),
('Thomas','m','arameo','Forma relacionada con Tomás: gemelo.','c',['Tomás']),
('Mason','m','inglés','De un apellido ocupacional: trabajador de la piedra, albañil.','m',[]),
('Anthony','m','latín','Forma inglesa de Antonio, del antiguo nombre romano Antonius.','c',['Antonio']),
('Logan','m','escocés','De un apellido y topónimo escocés; se relaciona tradicionalmente con una pequeña hondonada.','m',[]),
('Aiden','m','irlandés','Forma de Aodhán, diminutivo de Aodh, vinculado con fuego.','m',[]),
('Caleb','m','hebreo','Nombre bíblico de significado discutido; se ha relacionado con la palabra hebrea para perro.','c',[]),
('Cooper','m','inglés','De un apellido ocupacional: fabricante de toneles.','m',[]),
('Charles','m','germánico','Forma francesa e inglesa relacionada con Carlos.','c',['Carlos']),
('Josiah','m','hebreo','Forma inglesa de Josías; se interpreta tradicionalmente como «Yahvé sostiene» o «sana».','c',['Josías']),
('Ezekiel','m','hebreo','Forma inglesa de Ezequiel: Dios fortalece.','c',['Ezequiel']),
('Isaiah','m','hebreo','Forma inglesa de Isaías: Dios es salvación.','c',['Isaías']),
('Joshua','m','hebreo','Forma inglesa de Josué: Dios salva.','c',['Josué']),
('Christopher','m','griego','Forma inglesa de Cristóbal: portador de Cristo.','c',['Cristóbal']),
('Nathan','m','hebreo','Forma relacionada con Natán: él dio.','c',['Natán']),
('Andrew','m','griego','Forma inglesa de Andrés, relacionado con lo varonil.','c',['Andrés']),
('Kai','u','varios orígenes','Nombre de distintas tradiciones; en hawaiano kai significa mar, pero no es su única explicación.','m',[]),
('Christian','m','griego','Forma relacionada con Cristian: seguidor de Cristo.','c',['Cristian']),
('Adam','m','hebreo','Forma relacionada con Adán y la tradición bíblica del ser humano y la tierra.','c',['Adán']),
('Silas','m','discutido','Nombre bíblico relacionado tradicionalmente con Silvano; su origen es discutido.','c',['Silvano']),
('Theo','m','griego','Forma breve de Theodore o Théodore, relacionada con Teodoro.','m',['Teo','Teodoro','Théo']),
('Louise','f','francés','Forma francesa de Luisa, relacionada con Luis.','c',['Luisa']),
('Ambre','f','francés','Ámbar; nombre francés tomado de la palabra para la resina.','m',['Ámbar']),
('Romy','f','alemán','Forma familiar relacionada con Rosemarie; no tiene una traducción literal única.','m',[]),
('Rose','f','francés e inglés','Rosa, la flor; forma relacionada con Rosa.','c',['Rosa']),
('Lou','u','francés','Forma breve de Louise o Louis; el sentido depende del nombre completo.','m',['Louise','Louis']),
('Inaya','f','árabe','Cuidado, atención o solicitud, según la tradición árabe.','m',[]),
('Adèle','f','francés','Forma francesa de Adela, relacionada con nobleza.','c',['Adela']),
('Agathe','f','griego','Forma francesa relacionada con Ágata: buena, bondadosa.','c',['Ágata']),
('Giulia','f','italiano','Forma italiana de Julia, del antiguo nombre romano Iulia.','c',['Julia']),
('Jeanne','f','francés','Forma francesa de Juana: Dios es misericordioso.','c',['Juana']),
('Nour','u','árabe','Luz; una grafía internacional de un nombre árabe.','m',[]),
('Victoire','f','francés','Victoria; forma francesa relacionada con Victoria.','c',['Victoria']),
('Juliette','f','francés','Forma francesa relacionada con Julieta y Julia.','c',['Julieta']),
('Léonie','f','francés','Forma relacionada con León y la imagen del león.','c',['León']),
('Lucie','f','francés','Forma francesa de Lucía, vinculada con luz.','c',['Lucía']),
('Gabrielle','f','francés','Forma francesa de Gabriela, relacionada con Gabriel.','c',['Gabriela']),
('Marie','f','francés','Forma francesa de María; su significado original es discutido.','c',['María']),
('Raphaël','m','francés','Forma francesa de Rafael: Dios sana.','c',['Rafael']),
('Louis','m','francés','Forma francesa de Luis, de tradición germánica.','c',['Luis']),
('Arthur','m','discutido','Forma relacionada con Arturo, de etimología discutida.','c',['Arturo']),
('Jules','m','francés','Forma francesa de Julio, del antiguo nombre romano Iulius.','c',['Julio']),
('Maël','m','bretón','Se relaciona con el término bretón para príncipe o jefe.','m',[]),
('Sacha','u','ruso','Forma familiar de Alexander o Alexandra, relacionada con Alejandro y Alejandra.','m',['Sasha','Alejandro','Alejandra']),
('Marceau','m','francés','Forma francesa relacionada con Marcel y Marcelo.','c',['Marcelo']),
('Gabin','m','francés','Forma francesa de Gabinus, antiguo nombre relacionado con la ciudad de Gabii.','c',[]),
('Mohamed','m','árabe','Una grafía de Muhammad, tradicionalmente interpretado como digno de alabanza.','c',['Muhammad']),
('Paul','m','francés e inglés','Forma relacionada con Pablo, del latín Paulus.','c',['Pablo']),
('Elio','m','griego o latín','Puede relacionarse con Helios, sol, o con el antiguo nombre romano Aelius, según la tradición.','m',[]),
('Gaspard','m','francés','Forma francesa de Gaspar, de origen discutido.','c',['Gaspar']),
('Tiago','m','portugués','Forma portuguesa relacionada con Santiago y Jacob.','m',['Thiago','Santiago']),
('Milo','m','discutido','Nombre antiguo de distintas tradiciones; no tiene una única etimología aceptada.','m',[]),
('Antoine','m','francés','Forma francesa de Antonio, relacionada con el antiguo nombre Antonius.','c',['Antonio']),
('Alessio','m','italiano','Forma italiana de Alejo, relacionada con defensa o protección.','c',['Alejo']),
('Alexandre','m','francés y portugués','Forma relacionada con Alejandro: defensor de las personas.','c',['Alejandro']),
]
def fold(s):return ''.join(c for c in unicodedata.normalize('NFD',s) if not unicodedata.combining(c)).casefold()
def slug(s):
    import re
    return re.sub(r'[^a-z0-9]+','-',fold(s)).strip('-')
existing=json.loads(subprocess.check_output(['php',str(root/'tools/names.php'),'export'],text=True))
known={fold(n['name']) for n in existing}
usage=list(csv.DictReader((root/'docs/data/name-usage-2024.csv').open()))
new=[]
biblical={'Naomi','Delilah','Hannah','Leah','Sarah','Noah','James','Elijah','Levi','Ezra','Michael','Ethan','Asher','John','Joseph','Matthew','Luke','Thomas','Caleb','Josiah','Ezekiel','Isaiah','Joshua','Nathan','Andrew','Adam','Silas'}
for name,gender,origin,meaning,style,variants in rows:
    if fold(name) in known:continue
    matches=[r for r in usage if fold(r['name'])==fold(name)]
    if not matches:raise SystemExit('No checked usage row for '+name)
    tags=['clasico'] if style=='c' else ['moderno']
    if sum(c.isalpha() for c in name)<=4:tags.append('corto')
    if gender=='u':tags.append('unisex')
    if name in biblical:tags.append('biblico')
    sources=[]
    for r in matches:
        us=r['country']=='us'
        sources.append({'title':('SSA' if us else 'INSEE')+': '+r['name']+', 2024',
          'url':'https://github.com/seattletravis/babynames/blob/81facbe5ad6acb40a3cdeb08f6d3c4534f4da863/babynames/yob2024.txt' if us else 'https://github.com/mthiboust/prenomscope/blob/9a07102934727c307701b8fbb4d9988cc09f6840/preprocessing/prenoms-2024.parquet',
          'checked':'2026-10-17','scope':f"La grafía {r['name']} figura en {('Estados Unidos' if us else 'Francia')} en 2024, categoría {r['sex'].upper()}, puesto {r['rank']} de la copia consultada. Evidencia de uso; no verifica esta etimología ni la frecuencia en Paraguay."})
    n={'slug':slug(name),'name':name,'gender':gender,'origin':origin,'meaning':meaning,'tags':tags,
       'review':{'status':'qualified','sources':sources,'note':'Uso contrastado en datos estadísticos; explicación etimológica editorial pendiente de revisión documental independiente.'}}
    if variants:n['variants']=variants
    new.append(n);known.add(fold(name))
args.output.write_text(json.dumps(new,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(new),'additional records with scoped country-usage evidence')
