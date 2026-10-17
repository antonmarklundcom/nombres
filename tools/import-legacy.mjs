// One-time migration, not a runtime dependency. Writes to stdout by default.
// node tools/import-legacy.mjs > /tmp/names.php
// Never re-import over an edited catalog without reviewing a diff.
import { NAMES } from './legacy/names.mjs';
const corrections = {
  arami: ['Nombre interpretado tradicionalmente como «cielito» o «pedacito de cielo».', 'Es una interpretación tradicional del nombre; su escritura y uso personal necesitan revisión independiente.'],
  catalina: ['Origen griego de interpretación discutida; se asocia tradicionalmente con «pura».', 'La asociación con la pureza es tradicional, no una traducción segura del nombre original.'],
  karen: ['Forma danesa de Catalina, de etimología discutida.', 'La interpretación «pura» viene de una asociación tradicional de Catalina.'],
  elena: ['Nombre griego relacionado tradicionalmente con la luz; etimología discutida.', 'La traducción «antorcha» es una propuesta, no una certeza.'],
  maria: ['Forma de Miriam; su significado original es discutido.', '«Amada», «señora» y otras explicaciones son interpretaciones propuestas, no traducciones demostradas.'],
  miriam: ['Nombre hebreo relacionado con María; significado original discutido.', 'No hay una única etimología aceptada para Miriam.'],
  monica: ['Nombre antiguo de etimología incierta.', 'La relación con el griego monos, «solo», es una interpretación posterior.'],
  arturo: ['Nombre de etimología discutida, relacionado con la tradición artúrica.', 'La asociación con «oso» es una propuesta etimológica, no un significado seguro.'],
  veronica: ['Forma vinculada a Berenice, «portadora de victoria».', '«Verdadera imagen», del latín vera icon, es una interpretación cristiana posterior.'],
  nerea: ['Forma vinculada a Nereo en la tradición griega; también tiene uso vasco.', 'No debe confundirse sin explicación con nereida. El origen atribuido depende de la tradición.'],
  alessia: ['Forma italiana femenina de Alessio: defensora, protectora.', 'No es la forma italiana de Alejandra, que es Alessandra.'],
  oliver: ['Nombre de etimología discutida; asociado tradicionalmente al olivo.', 'La asociación con el latín oliva no es la única explicación propuesta.'],
  ignacio: ['De Egnatius, nombre romano de etimología incierta.', 'La asociación con ignis, «fuego», es tradicional y no demuestra el origen.'],
  ignacia: ['Femenino de Ignacio, de etimología incierta.', 'La asociación con «fuego» es tradicional.'],
  luana: ['Nombre de distintas tradiciones y etimología discutida.', 'No damos por demostrada una traducción como «luna» o «luz».'],
  samuel: ['Nombre hebreo interpretado tradicionalmente como «nombre de Dios» o «Dios ha escuchado».', 'Existen distintas propuestas de interpretación.'],
  ara: ['Día, tiempo; también cielo, según el contexto guaraní.', 'La inclusión como idea de nombre no acredita frecuencia de uso ni un género gramatical.'],
  arasy: ['Nombre de tradición mitológica, interpretado como «madre del cielo».', 'La explicación es cultural; no presentamos la figura como parte de una tradición única compartida por todos los pueblos guaraníes.'],
  jasy: ['Luna; también mes, según el contexto guaraní.', 'La y guaraní es una vocal distinta de la i y de la y castellana. Consultá la pronunciación con una persona hablante.'],
  yvoty: ['Flor, en guaraní.', 'Conservá la y de la escritura guaraní; reemplazarla por i no es una equivalencia ortográfica automática.'],
  yeruti: ['Nombre tradicional vinculado a jeruti, una paloma.', 'Yerutí es una adaptación como nombre propio. La palabra guaraní se escribe jeruti.'],
  pora: ['Bello, bueno, según el contexto guaraní.', 'La ã es nasal: Porã y Porá no son la misma escritura ni tienen la misma pronunciación.'],
  irupe: ['Nombre de la planta acuática conocida como irupé.', 'La grafía guaraní yrupe y la adaptación castellana irupé deben distinguirse. Omitimos una descomposición literal no comprobada.'],
  arandu: ['Sabiduría, conocimiento; sabio, según el contexto guaraní.', 'Arandú es una adaptación con tilde castellana. La palabra guaraní arandu no necesita tilde al tener acento final.'],
  nasaindy: ['Luz de luna, claridad lunar.', 'Conservá la ñ y la y. La ficha necesita una revisión lingüística independiente de su uso como nombre.'],
  mburucuya: ['Nombre tradicional vinculado a la pasionaria.', 'Mburucuyá es una adaptación castellana; la forma guaraní es mburukuja.'],
  poty: ['Flor, floración, según el contexto guaraní.', 'No la presentamos como un simple apodo de Yvoty. Confirmá el sentido en el uso que te interesa.'],
  itati: ['Nombre vinculado a la advocación de la Virgen de Itatí.', 'No afirmamos una traducción literal: las explicaciones del topónimo difieren.'],
  arai: ['Nombre tradicional relacionado con arai, «nube».', 'La tilde de Araí pertenece a la adaptación como nombre propio; la palabra guaraní es arai.'],
};
const native = {arami:'arami', arasy:'Arasy', ara:'ára', jasy:'jasy', yvoty:'yvoty', yeruti:'jeruti', mainumby:'mainumby', pora:'porã', kuarahy:'kuarahy', irupe:'yrupe', arandu:'arandu', nasaindy:'ñasaindy', mbyja:'mbyja', mburucuya:'mburukuja', ysapy:'ysapy', arapoty:'arapoty', poty:'poty', arai:'arai'};
const evidence = {"jasy": {"term": "jasy", "line": 756}, "yvoty": {"term": "yvoty", "line": 3614}, "kuarahy": {"term": "kuarahy", "line": 1237}, "mainumby": {"term": "mainumby", "line": 1368}, "arandu": {"term": "arandu", "line": 233}, "nasaindy": {"term": "ñasaindy", "line": 2112}, "mbyja": {"term": "mbyja", "line": 1723}, "mburucuya": {"term": "mburukuja", "line": 1711}, "ysapy": {"term": "ysapy", "line": 3578}, "arapoty": {"term": "arapoty", "line": 238}, "poty": {"term": "poty", "line": 2701}, "arai": {"term": "arai", "line": 220}, "yeruti": {"term": "jeruti", "line": 917}};
const output = NAMES.map(original => {
  const n = structuredClone(original);
  const uncertainOrigins = {monica:'incierto', luana:'discutido', arturo:'discutido', oliver:'europeo (discutido)', nerea:'griego o vasco'};
  if (uncertainOrigins[n.slug]) n.origin=uncertainOrigins[n.slug];
  // An unsupported literal claim about María propagated into compound names.
  n.meaning = n.meaning.replaceAll('María (amada)', 'María (de significado discutido)').replaceAll('Francisco (libre)', 'Francisco (francés)');
  if (corrections[n.slug]) [n.meaning, n.note] = corrections[n.slug];
  if (n.slug === 'francisco') n.meaning = 'Francés; nombre difundido por la tradición de san Francisco de Asís.';
  if (n.slug === 'francesca') n.meaning = 'Forma italiana de Francisca: francesa.';
  if (n.origin === 'guaraní') {
    n.note = corrections[n.slug]?.[1] || (n.slug === 'anahi' ? 'La asociación proviene de la leyenda del ceibo; no se afirma una traducción literal.' : 'Palabra o nombre vinculado al guaraní. Consultá la escritura y pronunciación con una persona hablante; el uso como nombre requiere revisión independiente.');
    if (native[n.slug]) n.native_form = native[n.slug];
    if (['arami','yeruti','pora','arandu','arasy','yvoty','kuarahy','jasy'].includes(n.slug)) delete n.variants;
  }
  n.review = {status: corrections[n.slug] || /discutid|inciert|interpret|tradicionalmente/.test(n.meaning) || n.origin === 'guaraní' ? 'qualified' : 'legacy', sources: [], note: 'Catálogo heredado con revisión editorial; pendiente de contraste documental independiente.'};
  if (evidence[n.slug]) {
    const ref=evidence[n.slug];
    n.review.status='qualified';
    n.review.sources=[{title:'Diccionario Guaraní-Castellano, Sugar Labs: '+ref.term, url:'https://github.com/sugarlabs/diccionario-guarani-castellano-activity/blob/f0001d16948e07227880cebc9be208473c652990/lang/guarani/dic.txt#L'+ref.line, checked:'2026-10-17', scope:'Sentido léxico; no acredita frecuencia, género ni uso como nombre personal.'}];
    n.review.note='Sentido léxico contrastado con una fuente educativa; uso como nombre propio y ortografía pendientes de revisión especializada.';
  }
  return n;
});
const quote = s => "'" + s.replaceAll('\\', '\\\\').replaceAll("'", "\\'") + "'";
const php = x => x === null ? 'null' : typeof x === 'string' ? quote(x) : typeof x === 'number' || typeof x === 'boolean' ? String(x) : Array.isArray(x) ? '[' + x.map(php).join(', ') + ']' : '[' + Object.entries(x).map(([k,v])=>quote(k)+' => '+php(v)).join(', ') + ']';
console.log("<?php\ndeclare(strict_types=1);\n// Canonical name catalog. See docs/content-model.md before editing.\n// One record per line; the slug is a permanent URL identity.\nreturn [\n" + output.map(n=>'    '+php(n)+',').join('\n') + '\n];');
