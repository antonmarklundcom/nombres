<?php
declare(strict_types=1);
// Distinct search intents from the owner's Paraguay export. No search volumes
// or rarity/popularity claims belong in the public copy.
return [
    [
        'route'=>'/nombres-biblicos-para-ninas/', 'parent'=>'/nombres-biblicos/',
        'filter'=>['gender'=>'f','tag'=>'biblico'], 'short'=>'Bíblicos para niñas',
        'title'=>'Nombres bíblicos para niñas: significado y origen',
        'description'=>'Nombres bíblicos para niñas y nenas: Sara, Abigail, Rebeca y otras ideas con significado y origen. Compará formas y guardá tus favoritos para tu bebé.',
        'h1'=>'Nombres bíblicos para niñas',
        'intro'=>[
            'Sara, Rebeca, Rut o Abigail pueden entrar en una lista por su historia, por una tradición familiar o porque te gusta cómo suenan. Acá podés explorar nombres de niña relacionados con la Biblia y abrir cada ficha para leer su significado orientativo y sus notas.',
            'La lista reúne nombres de personas, formas relacionadas y referencias a lugares bíblicos. No todos tienen la misma lengua de origen ni aparecen escritos igual en cada traducción. Belén, por ejemplo, es una referencia a un lugar; no es el nombre de una mujer de un relato.',
            'Si el vínculo con un personaje es lo que más te importa, revisá el pasaje y la traducción que usa tu familia. Una fecha del santoral es otra referencia: no demuestra por sí sola la etimología ni el papel de una persona en el texto bíblico.',
        ],
        'discovery'=>[
            ['id'=>'escritura','h'=>'Sara y Sarah: elegí la escritura que querés usar',
                'p'=>['Las formas relacionadas pueden ayudarte a comparar opciones. Antes de elegir una grafía, probá decir el nombre con los dos apellidos y pedir que lo escriban. La semejanza entre dos nombres no los vuelve intercambiables en los documentos.'],
                'names'=>['sara','sarah','ana','hannah','abigail','rebeca'],
                'links'=>[['route'=>'/nombres-biblicos-para-ninos/','label'=>'Nombres bíblicos para niños'],['route'=>'/nombres-de-nina/','label'=>'Todos los nombres para niñas']]],
        ],
        'faq'=>[
            ['q'=>'¿Qué nombres bíblicos para nenas puedo comparar?','a'=>'Sara, Rebeca, Abigail, Rut, Raquel y Eva son algunas opciones del catálogo. Abrí sus fichas para comparar la escritura, el origen y las notas.'],
            ['q'=>'¿Belén es un personaje bíblico?','a'=>'En esta selección se incluye como referencia a un lugar. La lista distingue entre nombres personales, formas relacionadas y otras referencias bíblicas.'],
            ['q'=>'¿Todos tienen la misma fecha de santo?','a'=>'No. El santoral y el origen del nombre son cuestiones distintas. Puede haber varias celebraciones; confirmá la que sigue tu familia con tu parroquia.'],
        ],
    ],
    [
        'route'=>'/nombres-biblicos-para-ninos/', 'parent'=>'/nombres-biblicos/',
        'filter'=>['gender'=>'m','tag'=>'biblico'], 'short'=>'Bíblicos para niños',
        'title'=>'Nombres bíblicos para niños: significado y origen',
        'description'=>'Nombres bíblicos para niños y bebés varones: Mateo, Daniel, Samuel y otras ideas. Leé significados, compará escrituras y guardá favoritos con tu apellido.',
        'h1'=>'Nombres bíblicos para niños y bebés varones',
        'intro'=>[
            'Mateo, Daniel, Samuel o Elías pueden unir una historia familiar con una escritura que te gusta. Esta lista reúne nombres para niños vinculados a la Biblia, con sus fichas de significado y origen para que puedas comparar con calma.',
            'Que un nombre tenga tradición bíblica no significa que todos vengan del hebreo. Hay formas transmitidas por el griego, el latín y otras lenguas. Además, una forma castellana y otra internacional pueden referirse a la misma tradición sin pronunciarse igual.',
            'Pensá qué te atrae del nombre: un personaje, un recuerdo, el sonido o la combinación con el apellido. Si lo elegís por un relato, leelo en la traducción que usa tu familia. El catálogo no reemplaza esa lectura ni convierte el santoral en una prueba del significado.',
        ],
        'discovery'=>[
            ['id'=>'formas-relacionadas','h'=>'Noé y Noah, Elías y Elijah: compará las formas',
                'p'=>['Mirar las grafías juntas ayuda a decidir cuál querés escribir y explicar en el día a día. Guardá tus favoritas y probá el nombre completo: la versión más conocida en otro país no tiene por qué ser tu elección.'],
                'names'=>['noe','noah','elias','elijah','mateo','daniel'],
                'links'=>[['route'=>'/nombres-biblicos-para-ninas/','label'=>'Nombres bíblicos para niñas'],['route'=>'/nombres-de-varon/','label'=>'Todos los nombres para niños y varones']]],
        ],
        'faq'=>[
            ['q'=>'¿Qué nombres bíblicos para varones hay?','a'=>'Podés comparar Mateo, Daniel, Samuel, Benjamín, Elías, Noé y muchas otras opciones de esta lista. Cada ficha indica su origen y las notas disponibles.'],
            ['q'=>'¿Son lo mismo un nombre bíblico y un nombre de santo?','a'=>'Son referencias diferentes. Un nombre puede estar relacionado con la Biblia y tener también una celebración tradicional, pero una cosa no demuestra la otra.'],
            ['q'=>'¿Cómo elijo entre una forma castellana y otra internacional?','a'=>'Decilas con los apellidos y comprobá qué escritura querés usar siempre. Las formas relacionadas no tienen por qué pronunciarse igual.'],
        ],
    ],
    [
        'route'=>'/nombres-italianos/', 'short'=>'Italianos', 'splitGender'=>true,
        'filter'=>['slugs'=>['isabella','antonella','bianca','allegra','fiorella','francesca','giuliana','chiara','gianna','giovanna','alessia','giulia','dante','enzo','luca','valentino','santino','renzo','alessio']],
        'title'=>'Nombres italianos para niñas y niños: ideas y significado',
        'description'=>'Explorá nombres italianos para niñas y niños: Giulia, Chiara, Luca, Enzo y otras formas del catálogo. Compará escrituras y significados con tus apellidos.',
        'h1'=>'Nombres italianos para niñas y niños',
        'intro'=>[
            'Giulia, Chiara, Luca o Enzo ofrecen escrituras distintas para seguir armando tu lista. Esta es una selección editorial de formas italianas y nombres vinculados a esa tradición; no es un ranking de nacimientos de Italia ni de Paraguay.',
            'La lengua en la que se usa una forma y su origen más antiguo pueden ser diferentes. Giulia se relaciona con Julia; Alessio, con Alejo. Que una ficha diga italiano no significa que la historia del nombre empiece y termine en ese idioma.',
            'No apliques automáticamente las reglas de lectura del castellano a todas las grafías. Si querés conservar la pronunciación italiana, contrastala con una persona hablante. Después probá el nombre con los apellidos y decidí qué escritura querés usar en documentos.',
        ],
        'discovery'=>[
            ['id'=>'comparar-formas','h'=>'Una forma italiana y otra que ya conocés',
                'p'=>['Comparar nombres relacionados puede aclarar qué te gusta: la terminación, una letra o el vínculo familiar. No cambia automáticamente cómo se pronuncian ni convierte las dos escrituras en un único nombre para los trámites.'],
                'names'=>['giulia','julia','alessio','alejo','bianca','blanca'],
                'links'=>[['route'=>'/nombres-de-nina/','label'=>'Nombres para niñas'],['route'=>'/nombres-de-varon/','label'=>'Nombres para niños'],['route'=>'/nombres-para-gemelos/','label'=>'Ideas para gemelos y mellizos']]],
        ],
        'faq'=>[
            ['q'=>'¿Qué nombres italianos para niñas hay?','a'=>'En esta selección podés explorar Giulia, Chiara, Bianca, Alessia, Francesca o Isabella y abrir sus fichas para comparar formas y notas.'],
            ['q'=>'¿Qué nombres italianos para niños puedo comparar?','a'=>'Luca, Enzo, Dante, Renzo, Alessio, Santino y Valentino son opciones de esta lista. No se presentan como los más usados en Paraguay.'],
            ['q'=>'¿Esta lista muestra los más registrados en Italia?','a'=>'No. Es una selección editorial del catálogo, sin posiciones de popularidad ni cifras de nacimientos.'],
        ],
    ],
    [
        'route'=>'/nombres-arabes/', 'short'=>'Árabes', 'splitGender'=>true,
        'filter'=>['slugs'=>['fatima','leila','yamila','amira','emir','omar','layla','inaya','nour','mohamed']],
        'title'=>'Nombres árabes para niñas y niños: ideas y significado',
        'description'=>'Nombres árabes para niñas y niños: Fátima, Amira, Omar, Nour y otras opciones. Compará grafías, significados orientativos y cómo combinan con tus apellidos.',
        'h1'=>'Nombres árabes para niñas y niños',
        'intro'=>[
            'Fátima, Amira, Omar o Nour pueden inspirar una lista por su sonido, su tradición o un vínculo familiar. Reunimos opciones del catálogo relacionadas con el árabe, con notas en sus fichas y sin presentarlas como una estadística de uso en Paraguay.',
            'Las grafías en alfabeto latino pueden variar entre lenguas y sistemas de transcripción. Leila y Layla, por ejemplo, permiten comparar escrituras relacionadas. No hay que asumir que cada cambio de letra conserva exactamente la misma pronunciación.',
            'Si la escritura y el sentido en árabe son importantes para tu elección, confirmalos con una persona hablante y una referencia adecuada. La explicación breve del catálogo es orientativa; no certifica una transcripción, una tradición religiosa ni la inscripción legal.',
        ],
        'discovery'=>[
            ['id'=>'grafias','h'=>'Qué escritura querés usar todos los días',
                'p'=>['Probá presentarlo en voz alta, pedir que lo escriban y leerlo junto a los dos apellidos. En nombres que circulan por varias lenguas, esa pequeña prueba puede ayudarte más que elegir una traducción linda sin comprobarla.'],
                'names'=>['leila','layla','amira','omar','nour','fatima'],
                'links'=>[['route'=>'/nombres-unisex/','label'=>'Más opciones unisex'],['route'=>'/nombres-de-nina/','label'=>'Nombres para niñas'],['route'=>'/nombres-de-varon/','label'=>'Nombres para niños']]],
        ],
        'faq'=>[
            ['q'=>'¿Qué nombres árabes para niñas puedo explorar?','a'=>'Fátima, Amira, Leila, Layla, Yamila e Inaya aparecen en esta selección editorial. Revisá las notas de cada ficha antes de elegir por su significado.'],
            ['q'=>'¿Por qué hay varias grafías de un nombre?','a'=>'La transcripción a otro alfabeto y el paso entre idiomas pueden dar escrituras diferentes. No todas las variantes se pronuncian igual.'],
            ['q'=>'¿Nour es una opción unisex?','a'=>'El catálogo lo ofrece en esa categoría para explorar. Esa clasificación editorial no es una regla gramatical ni una estadística de inscripción en Paraguay.'],
        ],
    ],
];
