// Textos del sitio nombres.com.py (español de Paraguay, voseo).
// Regla editorial: sin afirmaciones de popularidad, sin rankings, sin datos de nacimientos.

export const SITE = {
  name: 'nombres.com.py',
  origin: 'https://nombres.com.py',
  lang: 'es-PY',
  locale: 'es_PY',
  tagline: 'Nombres de bebé con significado, origen y herramientas para elegir en pareja.',
};

export const BABYSHOWER = {
  home: 'https://babyshower.com.py/',
  reveal: 'https://babyshower.com.py/revelacion-de-genero/',
};

export const APELLIDOS = ['González', 'Benítez', 'Martínez', 'Giménez', 'Ramírez', 'Ortiz', 'Duarte', 'Villalba', 'López', 'Fernández', 'Rodríguez', 'Báez', 'Acosta', 'Cáceres', 'Rojas', 'Sosa'];

export const GENDER_LABEL = { f: 'niña', m: 'varón', u: 'unisex' };

export const TAG_LABEL = {
  clasico: 'Clásico', moderno: 'Moderno', corto: 'Corto', compuesto: 'Compuesto',
  biblico: 'Bíblico', guarani: 'Guaraní', santo: 'Con santo', unisex: 'Unisex',
};

export const HOME = {
  title: 'Nombres de bebé para Paraguay: significado y origen',
  description: 'Nombres de bebé para Paraguay con significado y origen: niñas, varones, guaraníes, cortos y compuestos. Guardá tus favoritos y probalos con tu apellido.',
  h1: 'Nombres de bebé para Paraguay: significado, origen y cómo elegir',
  lead: 'Buscá entre más de 500 nombres de niña, de varón y unisex, con su significado, su origen y, cuando corresponde, el día de su santo. Guardá los que te gustan, probalos con tu apellido y decidí en pareja con el duelo de nombres.',
  guide: [
    { h: 'Probalo con el apellido', p: 'Decí el nombre completo en voz alta, con los dos apellidos. Si el nombre termina con la misma sílaba con la que empieza el apellido, se pueden pegar los sonidos. Un nombre largo suele equilibrar un apellido corto, y al revés.' },
    { h: 'Mirá el santo del día', p: 'En muchas familias paraguayas el santoral sigue presente. Si tu bebé nace cerca de San Blas, San Juan o la Virgen de Caacupé, puede ser una linda pista. En cada ficha te mostramos la fecha del santo cuando la conocemos con certeza.' },
    { h: 'Considerá un nombre guaraní', p: 'Nombres como Aramí, Jasy, Yvoty o Kuarahy tienen significados bellos y literales: pedacito de cielo, luna, flor, sol. Revisá la pronunciación y cómo se escribe, porque algunos tienen letras propias del guaraní.' },
    { h: 'Pensá en lo corto y lo largo', p: 'Los nombres cortos como Ana, Luz, Teo o Blas son fáciles de escribir y combinan bien con apellidos largos. Los compuestos como María José o Juan Pablo son una tradición fuerte y permiten honrar a dos personas.' },
  ],
  faq: [
    { q: '¿De dónde sacan el significado de cada nombre?', a: 'Usamos la etimología estándar y más difundida de cada nombre. Cuando los especialistas no se ponen de acuerdo, lo decimos en la ficha en lugar de inventar un significado bonito.' },
    { q: '¿Tienen datos de cuántos bebés llevan cada nombre?', a: 'No. No existen datos públicos oficiales del Registro Civil paraguayo por nombre, así que no publicamos listas ordenadas por cantidad de bebés. Incluimos nombres que se escuchan en Paraguay y otros que las familias suelen considerar.' },
    { q: '¿Dónde se guardan mis favoritos?', a: 'Sólo en tu navegador, con el almacenamiento local del dispositivo. No tenemos cuentas ni base de datos de usuarios. Si querés compartir tu lista, el sitio arma un enlace con los nombres para que se lo mandes a quien quieras.' },
    { q: '¿Cómo decidimos en pareja?', a: 'Guardá cada uno sus favoritos, compartí tu lista por WhatsApp y usá el duelo de nombres: elegís entre dos por vez hasta que queda uno solo. Es una forma simple de ver qué nombre sobrevive a todas las comparaciones.' },
    { q: '¿Qué nombres guaraníes se pueden poner?', a: 'Incluimos nombres guaraníes que se usan como nombre de pila o que son palabras claras usadas así, como Aramí, Jasy, Yvoty, Mainumby o Kuarahy. Para la inscripción, consultá con el Registro Civil cualquier duda sobre la escritura.' },
  ],
};

export const ELEGIR = {
  title: 'Elegí el nombre de tu bebé: buscador y filtros',
  description: 'Buscador de nombres de bebé con filtros por género, origen, letra inicial, largo y estilo. Guardá favoritos, probalos con tu apellido y compartí tu lista.',
  h1: 'Elegí el nombre de tu bebé',
  lead: 'Filtrá por género, origen, estilo, letra inicial y largo. Tocá el corazón para guardar un nombre en tu lista; después podés probarlo con tu apellido y hacer el duelo de nombres.',
};

export const MI_LISTA = {
  title: 'Mi lista de nombres de bebé',
  description: 'Tu lista de nombres favoritos guardada en este navegador: probala con tu apellido, compartila por WhatsApp y decidí con el duelo de nombres entre dos.',
  h1: 'Mi lista de nombres',
};

const BS = '¿Organizando el baby shower?';
export const BS_TEXT = BS;

// Páginas de listas. `filter` se interpreta en build.mjs.
export const LISTS = [
  {
    route: '/nombres-de-nina/', filter: { gender: 'f' }, short: 'Niña',
    title: 'Nombres de niñas: significado y origen',
    description: 'Nombres de niñas con significado y origen: clásicos, modernos, bíblicos, guaraníes y compuestos que se escuchan en Paraguay. Guardá tus favoritos.',
    h1: 'Nombres de niñas con significado',
    intro: [
      'Elegir el nombre de una niña es una de las primeras decisiones grandes de la familia, y en Paraguay suele venir con historia: la abuela que se llamaba Ramona, la promesa a la Virgen de Caacupé, la santa del día en que nació. En esta lista reunimos nombres de niña que se escuchan en Paraguay y en toda la región, junto con opciones que muchas familias consideran hoy.',
      'Vas a encontrar nombres clásicos como María, Ana, Lucía o Rosa, nombres de advocaciones marianas como Guadalupe, Pilar, Rosario o Asunción, nombres modernos y breves como Mía, Zoe o Luna, y nombres guaraníes como Aramí, Jasy o Yvoty. Cada tarjeta muestra el significado según la etimología más difundida y el origen del nombre.',
      'Un consejo práctico: antes de decidir, decí el nombre completo con los dos apellidos, imaginá cómo suena cuando la llamen en la escuela y pensá si te gusta también el diminutivo que seguramente le van a poner. Guardá los que te gusten con el corazón y después usá el duelo de nombres para decidir en pareja.',
    ],
    faq: [
      { q: '¿Qué nombres de niña son clásicos en Paraguay?', a: 'Nombres como María, Ana, Rosa, Carmen, Lucía o los de advocaciones marianas, como Guadalupe, Asunción, Pilar o Rosario, tienen una larga tradición en el país. También hay muchos compuestos con María.' },
      { q: '¿Qué nombres de niña cortos hay?', a: 'Ana, Luz, Sol, Mía, Zoe, Paz, Pía, Eva, Noa o Luna son opciones breves y fáciles de escribir. Tenés la lista completa en la página de nombres cortos.' },
      { q: '¿Hay nombres de niña en guaraní?', a: 'Sí. Aramí (pedacito de cielo), Jasy (luna), Yvoty (flor), Yerutí (paloma), Arasy (madre del cielo) o Irupé son algunos. Revisá en cada ficha la pronunciación.' },
      { q: '¿Cómo elijo entre dos nombres que nos gustan?', a: 'Guardalos en tu lista y hacé el duelo de nombres: elegís entre dos por vez hasta que queda un ganador. También ayuda probarlos con el apellido en voz alta.' },
    ],
  },
  {
    route: '/nombres-de-varon/', filter: { gender: 'm' }, short: 'Varón',
    title: 'Nombres para bebés varones: significado y origen',
    description: 'Nombres para bebés varones con significado y origen: clásicos, bíblicos, modernos, compuestos y guaraníes que se escuchan en Paraguay. Guardá tus favoritos.',
    h1: 'Nombres para bebés varones',
    intro: [
      'Buscar nombres para un bebé varón suele empezar con una lista corta y terminar con muchas dudas: ¿seguimos la tradición familiar o elegimos algo nuevo?, ¿un nombre bíblico o uno moderno?, ¿simple o compuesto? En esta página juntamos nombres de varón que se escuchan en Paraguay y en toda la región, con su significado y su origen.',
      'Encontrás clásicos que atraviesan generaciones, como José, Juan, Pedro o Francisco; nombres bíblicos como Mateo, Tomás, Benjamín o Elías; opciones modernas y cortas como Teo, Liam o Gael; compuestos de tradición fuerte como Juan Pablo o José María, y nombres guaraníes como Kuarahy (sol) o Arandú (sabio). Cuando conocemos con certeza el día del santo, lo indicamos en la ficha, como San Blas, patrono del Paraguay, el 3 de febrero.',
      'Probá cada opción con los dos apellidos, pensá cómo se va a abreviar y fijate que las iniciales no formen algo raro. Tocá el corazón para guardar los que más te gusten y compartí la lista por WhatsApp con tu pareja o la familia.',
    ],
    faq: [
      { q: '¿Qué nombres de varón son tradicionales en Paraguay?', a: 'José, Juan, Pedro, Francisco, Carlos, Luis, Miguel o Ramón tienen una larga presencia en el país, igual que compuestos como Juan Carlos, José Luis o Juan José.' },
      { q: '¿Hay nombres de varón en guaraní?', a: 'Sí, aunque son menos que los de niña. Kuarahy (sol) y Arandú (sabio) se usan como nombre de varón; Ara (cielo) y Mainumby (picaflor) se usan para ambos.' },
      { q: '¿Qué nombres bíblicos de varón hay?', a: 'Mateo, Tomás, Santiago, Benjamín, Elías, Samuel, Josué, Gabriel o Daniel son algunos. Tenés la lista completa en la página de nombres bíblicos.' },
      { q: '¿Conviene un nombre compuesto?', a: 'Depende del apellido y del gusto de la familia. Los compuestos permiten homenajear a dos personas, pero con doble apellido el nombre completo puede quedar largo; probalo en voz alta antes de decidir.' },
    ],
  },
  {
    route: '/nombres-unisex/', filter: { gender: 'u' }, short: 'Unisex',
    title: 'Nombres unisex para bebés: significado y origen',
    description: 'Nombres unisex para bebés, para niña o varón, con significado y origen: opciones en español, guaraní y otras lenguas. Guardá tus favoritos y compartilos.',
    h1: 'Nombres unisex para bebés',
    intro: [
      'Los nombres unisex son los que se usan tanto para niñas como para varones. Algunas familias los buscan porque todavía no saben si esperan una nena o un nene, otras porque les gusta un nombre que no marque el género, y otras simplemente porque les suena bien. En esta lista reunimos nombres que en la región se usan para ambos, con su significado y su origen.',
      'Hay opciones de raíz religiosa y tradición hispana, como Trinidad, Cruz, Reyes o Noel; nombres guaraníes como Ara (cielo), Mainumby (picaflor) o Porã (lindo, bello); y formas breves de origen griego como Alex o Alexis. Tené en cuenta que algunos nombres son unisex en un país y no en otro, y que ciertos nombres se asocian más a un género que al otro según la zona.',
      'Si elegís un nombre unisex, puede ayudar combinarlo con un segundo nombre o pensar cómo se va a presentar tu hijo o hija en la escuela y en los trámites. Para la inscripción, cualquier consulta sobre el nombre la resuelve el Registro Civil.',
    ],
    faq: [
      { q: '¿Qué es un nombre unisex?', a: 'Es un nombre que se usa tanto para niñas como para varones. En esta lista marcamos los que en la región se usan para ambos, aunque en algunos lugares uno de los dos usos sea más frecuente.' },
      { q: '¿Hay nombres guaraníes unisex?', a: 'Sí. Ara (cielo), Mainumby (picaflor) y Porã (lindo, bello) se usan para niñas y varones.' },
      { q: '¿Se puede inscribir un nombre unisex en Paraguay?', a: 'En general, sí. Si tenés dudas sobre algún nombre en particular, consultá directamente con el Registro Civil antes de la inscripción.' },
    ],
  },
  {
    route: '/nombres-guaranies/', filter: { tag: 'guarani' }, short: 'Guaraníes',
    title: 'Nombres guaraníes para bebés y su significado',
    description: 'Nombres guaraníes para bebés con su significado literal y pronunciación: Aramí, Jasy, Yvoty, Kuarahy, Mainumby y más, para niñas, varones y unisex.',
    h1: 'Nombres guaraníes para bebés',
    intro: [
      'El guaraní es lengua oficial del Paraguay junto con el castellano, y muchas familias eligen un nombre guaraní para su bebé como forma de honrar esa identidad. Los nombres guaraníes suelen ser palabras con significado literal y concreto: el cielo, la luna, una flor, un pájaro, el rocío. Por eso suenan poéticos y, a la vez, muy cercanos.',
      'En esta lista incluimos sólo nombres que se usan como nombre de pila o palabras guaraníes claras que las familias usan así. Preferimos una lista más corta y confiable antes que sumar nombres de significado dudoso. Cada ficha explica el significado literal y, cuando ayuda, una nota de pronunciación: en guaraní el acento suele caer en la última sílaba y la letra y es una vocal propia.',
      'Antes de decidir, pensá en la escritura. Algunos nombres llevan letras como ñ, ã o la y vocal, y pueden tener variantes, como Jasy o Yasy. Elegí la forma que te guste y usala siempre igual. Si tenés dudas sobre cómo inscribirlo, consultá con el Registro Civil.',
    ],
    faq: [
      { q: '¿Qué significa Aramí?', a: 'Aramí se traduce como pedacito de cielo: ara es cielo y -mí es un diminutivo. Se pronuncia con acento en la última sílaba.' },
      { q: '¿Qué nombres guaraníes de varón hay?', a: 'Kuarahy (sol) y Arandú (sabio) se usan para varones. Ara (cielo), Mainumby (picaflor) y Porã (lindo) se usan para ambos géneros.' },
      { q: '¿Cómo se pronuncia la y en guaraní?', a: 'En guaraní la y es una vocal, la sexta, que suena parecida a una i pronunciada con la lengua más atrás. En nombres como Jasy o Yvoty la clave es acentuar la última sílaba.' },
      { q: '¿Jazmín es un nombre guaraní?', a: 'No. Jazmín viene del persa, a través del árabe. En Paraguay la flor del jazmín es muy querida, pero el nombre no es guaraní.' },
    ],
  },
  {
    route: '/nombres-cortos/', filter: { tag: 'corto' }, short: 'Cortos',
    title: 'Nombres cortos para bebés: niñas y varones',
    description: 'Nombres cortos para bebés, de hasta cuatro letras o dos sílabas: Ana, Luz, Teo, Blas, Jasy y más, con significado y origen. Ideales con apellidos largos.',
    h1: 'Nombres cortos para bebés',
    intro: [
      'Los nombres cortos tienen muchas ventajas: son fáciles de escribir, difíciles de deformar y no necesitan diminutivo. En Paraguay, donde casi todos llevamos doble apellido, un nombre breve ayuda a que el nombre completo no quede interminable en los papeles, en la lista de la escuela o en el documento.',
      'En esta página reunimos nombres de hasta cuatro letras o de dos sílabas, tanto de niña como de varón y unisex. Hay clásicos de siempre como Ana, Luz, Rosa, Juan o Blas; nombres modernos y breves como Mía, Zoe, Teo o Liam; y palabras guaraníes cortas como Ara (cielo), Jasy (luna) o Poty (flor).',
      'Un nombre corto también combina muy bien como segundo nombre: Juan Blas, María Luz o Ana Paz suenan equilibrados. Si tu apellido también es corto, probá el nombre completo en voz alta para ver si el ritmo te convence, o sumá un segundo nombre un poco más largo. Tocá el corazón para guardar tus favoritos.',
    ],
    faq: [
      { q: '¿Qué cuenta como nombre corto?', a: 'En esta lista incluimos nombres de hasta cuatro letras y nombres de dos sílabas de hasta seis letras, sin contar los compuestos.' },
      { q: '¿Un nombre corto queda bien con doble apellido?', a: 'Sí, suele equilibrar muy bien un doble apellido largo. Si los apellidos también son cortos, probá el nombre completo en voz alta.' },
      { q: '¿Hay nombres cortos en guaraní?', a: 'Sí: Ara (cielo), Jasy (luna), Poty (flor), Araí (nube) o Porã (lindo) son breves y fáciles de recordar.' },
    ],
  },
  {
    route: '/nombres-compuestos/', filter: { tag: 'compuesto' }, short: 'Compuestos',
    title: 'Nombres compuestos para bebés: ideas y significado',
    description: 'Nombres compuestos para bebés con su significado: María José, María Paz, Ana Belén, Juan Pablo, José María y más ideas clásicas en Paraguay y la región.',
    h1: 'Nombres compuestos para bebés',
    intro: [
      'Los nombres compuestos tienen una tradición muy fuerte en Paraguay y en toda Latinoamérica. María José, María Belén, Juan Pablo o José María son ejemplos que casi todos conocemos de la escuela, del barrio o de la familia. Un nombre compuesto permite honrar a dos personas a la vez, unir un nombre religioso con uno moderno o suavizar un nombre que solo parecería demasiado corto.',
      'En esta lista reunimos combinaciones que se escuchan en la región, con el significado de cada parte. Vas a ver compuestos con María y con Ana para niñas, y con Juan, José o Luis para varones. También hay algunos que cruzan géneros, como José María para varón o María José para niña, una costumbre de raíz católica.',
      'Antes de decidir, pensá en el largo total: nombre compuesto más doble apellido puede sumar cuatro o cinco palabras. Probalo en voz alta, imaginá cómo lo vas a escribir en formularios y pensá qué parte se va a usar en el día a día. Muchas familias terminan usando un apodo, como Majo o Juanpa, y está bien elegirlo pensando también en eso.',
    ],
    faq: [
      { q: '¿Qué nombres compuestos de niña hay?', a: 'María José, María Paz, María Belén, María Victoria, Ana Belén, Ana Paula o Luz María son algunas combinaciones que se escuchan en la región.' },
      { q: '¿Y de varón?', a: 'Juan Pablo, Juan José, Juan Manuel, José Luis, José María, Miguel Ángel o Juan Cruz son compuestos de varón con larga tradición.' },
      { q: '¿José María es nombre de varón y María José de niña?', a: 'Sí. Por costumbre, el primer nombre marca el género: José María se usa para varones y María José para niñas.' },
      { q: '¿Cómo armo un compuesto que suene bien?', a: 'Combiná un nombre largo con uno corto, evitá que el primero termine con la misma sílaba con la que empieza el segundo y probalo con los apellidos en voz alta.' },
    ],
  },
  {
    route: '/nombres-biblicos/', filter: { tag: 'biblico' }, short: 'Bíblicos',
    title: 'Nombres bíblicos para bebés y su significado',
    description: 'Nombres bíblicos para bebés con su significado y origen: Mateo, Tomás, Santiago, Sara, Ana, Belén, Abigail y más, para niñas y varones, con su santo.',
    h1: 'Nombres bíblicos para bebés',
    intro: [
      'Los nombres bíblicos atraviesan siglos y culturas, y en Paraguay tienen un peso especial por la tradición católica y la creciente presencia de otras iglesias cristianas. Muchos siguen sonando actuales: Mateo, Tomás, Benjamín, Sara o Abigail conviven con clásicos de siempre como José, María, Juan o Ana.',
      'En esta lista incluimos nombres que aparecen en el Antiguo o el Nuevo Testamento, o que se refieren directamente a personajes y lugares bíblicos, como Belén o Magdalena. La mayoría vienen del hebreo, pero también hay nombres de origen griego, latino o arameo, como Tomás (gemelo), Andrés (valiente) o Pablo (pequeño). Cuando conocemos con certeza la fecha del santo, la indicamos.',
      'Si te gusta un nombre bíblico pero querés algo menos frecuente, mirá opciones como Noa, Rebeca, Tobías, Jonás, Eliseo o Bernabé. También podés combinarlo con un segundo nombre moderno o guaraní. Guardá tus favoritos con el corazón y probalos con tu apellido.',
    ],
    faq: [
      { q: '¿Qué significa Mateo?', a: 'Mateo viene del hebreo y significa don de Dios o regalo de Dios. San Mateo se celebra el 21 de septiembre.' },
      { q: '¿Qué nombres bíblicos de niña hay?', a: 'Sara, Ana, Rebeca, Raquel, Abigail, Eva, Débora, Rut, Noemí, Susana, Magdalena o Belén son algunos.' },
      { q: '¿Todos los nombres bíblicos son hebreos?', a: 'No. Muchos lo son, pero Tomás es arameo, Andrés y Felipe son griegos, y Pablo y Marcos son latinos.' },
    ],
  },
  {
    route: '/nombres-clasicos/', filter: { tag: 'clasico' }, short: 'Clásicos',
    title: 'Nombres clásicos para bebés: niñas y varones',
    description: 'Nombres clásicos para bebés con significado y origen: los de siempre en Paraguay y la región, con su santo cuando corresponde. Para niñas, varones y unisex.',
    h1: 'Nombres clásicos para bebés',
    intro: [
      'Los nombres clásicos son los que pasan de generación en generación sin pasar de moda del todo. En Paraguay muchos llegan con la tradición católica y el santoral, o con las advocaciones de la Virgen que se celebran en todo el país: Asunción, Rosario, Pilar, Guadalupe, Concepción. Otros vienen de abuelos y bisabuelos y vuelven a aparecer cada tanto con aire renovado.',
      'En esta lista vas a encontrar nombres de niña como María, Ana, Carmen, Rosa, Lucía o Teresa, y nombres de varón como José, Juan, Pedro, Francisco, Ramón o Blas. También hay compuestos tradicionales. Cada ficha muestra el significado, el origen y, cuando la conocemos con certeza, la fecha del santo.',
      'Un nombre clásico tiene una ventaja práctica: todo el mundo lo sabe escribir y pronunciar. Si te preocupa que suene antiguo, probá combinarlo con un segundo nombre más actual o con un nombre guaraní. También podés revisar la lista de nombres modernos para comparar estilos antes de decidir.',
    ],
    faq: [
      { q: '¿Qué hace que un nombre sea clásico?', a: 'En esta lista marcamos como clásicos los nombres de larga tradición en el mundo hispano, que se usan desde hace varias generaciones.' },
      { q: '¿Los nombres clásicos vuelven?', a: 'Muchas veces sí. Nombres de abuelos, como Josefina, Emilia, Pedro o Benjamín, vuelven a aparecer en nuevas generaciones.' },
      { q: '¿Cómo sé la fecha del santo?', a: 'En cada ficha mostramos la fecha del santo cuando la conocemos con certeza. Si un nombre tiene varios santos, lo aclaramos o no indicamos fecha.' },
    ],
  },
  {
    route: '/nombres-modernos/', filter: { tag: 'moderno' }, short: 'Modernos',
    title: 'Nombres modernos para bebés: niñas y varones',
    description: 'Nombres modernos para bebés con significado y origen: Mía, Zoe, Luna, Emma, Thiago, Liam, Gael y más opciones actuales para niñas, varones y unisex.',
    h1: 'Nombres modernos para bebés',
    intro: [
      'Los nombres modernos son los que se sienten actuales: muchos son breves, se pronuncian igual en varios idiomas y suenan frescos junto a apellidos tradicionales. Algunos son nombres antiguos que volvieron, como Emma, Olivia o León; otros son formas de otros idiomas, como Thiago, Liam o Gael; y otros son palabras que se volvieron nombre, como Luna, Azul o Brisa.',
      'En esta lista reunimos opciones que se escuchan hoy en Paraguay y en la región, con su significado y su origen. Moderno no quiere decir inventado: la mayoría tiene una etimología clara que te explicamos en cada ficha. Cuando el origen de un nombre es discutido, también lo decimos.',
      'Si te gusta un nombre moderno, fijate cómo se escribe en castellano y si tiene variantes, porque algunos admiten varias grafías, como Thiago y Tiago o Mía y Mia. Elegí una y usala siempre igual en todos los documentos. Tocá el corazón para guardar los que te gustan y compará después con la lista de nombres clásicos.',
    ],
    faq: [
      { q: '¿Qué nombres modernos de niña hay?', a: 'Mía, Zoe, Luna, Emma, Olivia, Martina, Renata, Alma o Abril son algunos nombres de niña que se sienten actuales.' },
      { q: '¿Y de varón?', a: 'Thiago, Liam, Gael, Teo, León, Enzo, Santino o Benjamín se sienten actuales para varones.' },
      { q: '¿Thiago o Tiago?', a: 'Las dos grafías se usan. Thiago con h es la forma que se hizo frecuente en la región; Tiago es la forma portuguesa original. Elegí una y mantenela en todos los documentos.' },
    ],
  },
];

export const GUIDE = {
  route: '/como-elegir-nombre-de-bebe/',
  title: 'Cómo elegir el nombre de tu bebé en Paraguay',
  description: 'Guía para elegir el nombre de tu bebé en Paraguay: cómo suena con el doble apellido, iniciales, santos, nombres guaraníes y la inscripción en el Registro Civil.',
  h1: 'Cómo elegir el nombre de tu bebé en Paraguay',
  sections: [
    { h: null, p: [
      'Elegir el nombre de un hijo o una hija es una decisión que se toma una sola vez y se usa toda la vida. No hay una fórmula perfecta, pero sí algunas preguntas que ayudan a llegar a un nombre que les guste a los dos, que suene bien con los apellidos y que tu hijo o hija pueda llevar con comodidad. Esta guía reúne esas preguntas pensando en cómo se eligen los nombres en Paraguay.',
    ] },
    { h: 'Empezá con una lista larga, sin culpa', p: [
      'Al principio conviene no descartar nada. Anotá todos los nombres que te gusten, aunque parezcan raros, y pedile a tu pareja que haga lo mismo por separado. Después comparen: los nombres que aparecen en las dos listas son un gran punto de partida. En nombres.com.py podés guardar favoritos con el corazón y compartir tu lista con un enlace, así cada uno arma la suya desde su celular.',
      'También sirve mirar nombres por estilo: clásicos, modernos, bíblicos, guaraníes, cortos o compuestos. A veces descubrís que no te gusta un nombre en particular, sino un tipo de nombre, y eso ordena mucho la búsqueda.',
    ] },
    { h: 'Probalo con el doble apellido', p: [
      'En Paraguay casi todos llevamos dos apellidos, así que el nombre nunca va solo. Decí el nombre completo en voz alta, varias veces, como si lo leyeran en un acto de la escuela. Fijate en el ritmo: un nombre largo suele equilibrar apellidos cortos, y un nombre corto ayuda cuando los apellidos son largos. Sofía Benítez Villalba suena distinto que Ana Benítez Villalba, y las dos opciones pueden estar bien.',
      'Prestá atención a los encuentros de sonidos. Si el nombre termina con la misma sílaba con la que empieza el apellido, los sonidos se pegan: pensá en cómo suena en la lista de clase. También conviene evitar rimas involuntarias entre el nombre y el apellido, salvo que te gusten a propósito.',
      'Nuestra herramienta Probá con tu apellido te muestra cada favorito con uno o dos apellidos, para que lo veas escrito y no sólo en tu cabeza.',
    ] },
    { h: 'Mirá las iniciales y los apodos', p: [
      'Escribí las iniciales del nombre y los apellidos. A veces forman siglas o palabras que no esperabas. No es un motivo para descartar un nombre que te encanta, pero es mejor saberlo antes.',
      'Pensá también en el apodo. Casi todos los nombres terminan acortados o transformados: Francisco pasa a ser Pancho o Fran, María José pasa a ser Majo, Juan Pablo puede terminar en Juanpa. Si hay un apodo que no te gusta, tenelo en cuenta. Y si te encanta un apodo, elegir el nombre pensando en él es perfectamente válido.',
    ] },
    { h: 'El santo del día y las advocaciones', p: [
      'En muchas familias paraguayas el santoral sigue siendo una fuente de ideas. Algunos padres miran qué santo se celebra el día del nacimiento o eligen el nombre por una devoción familiar. San Blas, patrono del Paraguay, se celebra el 3 de febrero, y la Virgen de Caacupé el 8 de diciembre, fecha de la Inmaculada Concepción. Nombres como Asunción, Concepción, Rosario, Pilar o Guadalupe vienen de advocaciones de la Virgen.',
      'En cada ficha de nombre te mostramos la fecha del santo sólo cuando la conocemos con certeza. Muchos nombres tienen varios santos con fechas distintas; en esos casos preferimos no indicar una fecha antes que equivocarnos. Si la fecha es importante para tu familia, consultá también con tu parroquia.',
    ] },
    { h: 'Nombres guaraníes', p: [
      'El guaraní es lengua oficial del Paraguay y cada vez más familias eligen un nombre en guaraní. Estos nombres suelen ser palabras con significado literal: Aramí es pedacito de cielo, Jasy es luna, Yvoty es flor, Kuarahy es sol y Mainumby es picaflor. Tienen una belleza especial porque conectan al bebé con la tierra y la lengua de su familia.',
      'Si elegís un nombre guaraní, prestá atención a la escritura. Algunos llevan letras propias como ã o la y vocal, y suelen tener variantes, como Jasy y Yasy. Elegí una forma y usala siempre igual. Pensá también en la pronunciación: en guaraní el acento suele caer en la última sílaba, y conviene que la familia lo pronuncie igual desde el principio.',
    ] },
    { h: 'Evitá lo difícil de escribir, salvo que lo quieras de verdad', p: [
      'Un nombre con una grafía poco habitual, con letras dobles o con una h que no suena va a obligar a tu hijo o hija a deletrearlo muchas veces en su vida. Eso no significa que tengas que evitarlo, pero sí que vale la pena elegirlo sabiendo lo que implica. Una prueba simple: decile el nombre a alguien por teléfono y pedile que lo escriba. Si lo escribe distinto, ya sabés lo que va a pasar en la escuela, en el banco y en cada trámite.',
      'Lo mismo pasa con nombres de otros idiomas. Thiago, Liam o Emily se escuchan cada vez más, pero conviene decidir la grafía antes de la inscripción y mantenerla igual en todos los documentos.',
    ] },
    { h: 'Decidir en pareja', p: [
      'Cuando la lista se achica y quedan dos o tres nombres, las discusiones pueden estirarse. Un método que funciona es el duelo de nombres: comparan dos nombres por vez y eligen uno; el ganador se enfrenta al siguiente hasta que queda uno solo. En nuestra página Mi lista podés hacer el duelo con tus favoritos y compartir el resultado por WhatsApp.',
      'Otro consejo: dejá reposar la decisión unos días. Llamá a la panza por el nombre elegido y fijate cómo te sentís. Si después de una semana te sigue gustando, probablemente sea el nombre.',
    ] },
    { h: 'La inscripción en el Registro Civil', p: [
      'Después del nacimiento, el bebé se inscribe en el Registro Civil, donde queda asentado su nombre. Los requisitos, los plazos y el procedimiento pueden cambiar, así que te recomendamos consultar directamente con el Registro Civil o con la oficina más cercana antes del nacimiento para saber qué documentos llevar y cómo se hace el trámite.',
      'Si elegiste un nombre poco frecuente, extranjero o guaraní con letras especiales, también conviene preguntar en el Registro Civil cómo se asienta, para evitar sorpresas el día de la inscripción. En nombres.com.py no damos asesoramiento legal: nuestra idea es ayudarte a elegir, y el trámite lo confirma siempre la oficina correspondiente.',
    ] },
    { h: 'Una lista corta para empezar', p: [
      'Si no sabés por dónde empezar, recorré las listas de nombres de niña, nombres de varón o nombres guaraníes, guardá diez favoritos y hacé el duelo. En pocos minutos vas a tener una idea más clara de qué estilo te gusta, y ese es el primer paso para encontrar el nombre de tu bebé.',
    ] },
  ],
  faq: [
    { q: '¿Cuántos nombres puede tener un bebé en Paraguay?', a: 'Es frecuente usar uno o dos nombres de pila. Para saber si hay algún límite o requisito particular, consultá directamente con el Registro Civil.' },
    { q: '¿Se puede poner un nombre en guaraní?', a: 'Muchas familias paraguayas eligen nombres guaraníes. Si tenés dudas sobre la escritura con letras especiales, consultá con el Registro Civil antes de la inscripción.' },
    { q: '¿Qué hacemos si no nos ponemos de acuerdo?', a: 'Armá una lista cada uno por separado, quedate con los nombres que coinciden y hacé el duelo de nombres entre esos. Dejar reposar la decisión unos días también ayuda.' },
  ],
};

export const PRIVACY = {
  title: 'Privacidad en nombres.com.py',
  description: 'Privacidad en nombres.com.py: no usamos analítica ni cookies de seguimiento. Tus nombres favoritos se guardan sólo en tu navegador, con almacenamiento local.',
  h1: 'Privacidad',
  p: [
    'nombres.com.py es un sitio informativo sobre nombres de bebé. No tiene cuentas de usuario, no tiene formularios de contacto y no usa herramientas de analítica ni cookies de seguimiento.',
    'Cuando guardás un nombre como favorito, o escribís tus apellidos en la herramienta Probá con tu apellido, esos datos se guardan sólo en tu navegador, con el almacenamiento local del dispositivo (localStorage). No se envían a ningún servidor nuestro. Si borrás los datos del navegador o usás el modo incógnito, la lista desaparece.',
    'Si usás el botón para compartir tu lista, el sitio arma un enlace que contiene los nombres elegidos. Ese enlace lo compartís vos, por WhatsApp o por donde quieras; quien lo abra verá esos nombres. Los apellidos no se incluyen en el enlace.',
    'Como cualquier sitio web, el servidor de alojamiento puede registrar datos técnicos básicos de las visitas, como la dirección IP y el navegador, con fines de seguridad y funcionamiento.',
  ],
};

export const NOT_FOUND = {
  title: 'Página no encontrada | nombres.com.py',
  description: 'La página que buscás no existe o cambió de dirección. Buscá nombres de bebé por género, origen o letra en nombres.com.py y guardá tus favoritos.',
  h1: 'No encontramos esa página',
};
