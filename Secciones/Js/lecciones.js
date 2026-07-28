/* ================================================================
   EGGLISH — MOTOR DE LECCIONES (estilo Duolingo)
   Un solo tema por lección, máx. 10 preguntas, sistema de vidas,
   ejercicios variados, guía por tema, progreso y XP.
================================================================ */

/* ----------------------------------------------------------------
   DICCIONARIO DE PISTAS (hover-to-translate)
---------------------------------------------------------------- */
const wordTranslations = {
  good:'bueno/a', morning:'mañana', afternoon:'tarde', hello:'hola', how:'cómo', are:'estás/está',
  you:'tú / usted', please:'por favor', thank:'gracias', coffee:'café', tea:'té', milk:'leche',
  water:'agua', bill:'cuenta', see:'ver', tomorrow:'mañana', nice:'agradable', meet:'conocer',
  the:'el/la', sky:'cielo', is:'es/está', blue:'azul', like:'gustar', color:'color', purple:'morado',
  black:'negro', favorite:'favorito', car:'carro', fruit:'fruta', orange:'naranja', have:'tengo',
  three:'tres', apples:'manzanas', ten:'diez', students:'estudiantes', years:'años', old:'viejo/a',
  bus:'autobús', number:'número', dog:'perro', runs:'corre', fast:'rápido', two:'dos', small:'pequeños',
  dogs:'perros', bird:'pájaro', sings:'canta', in:'en', this:'esta/este', my:'mi/mis', mother:'madre',
  love:'amar', grandparents:'abuelos', family:'familia', big:'grande', son:'hijo', would:'quisiera',
  soup:'sopa', very:'muy', hot:'caliente', can:'puedo/puede', i:'yo', she:'ella', friend:'amiga',
  we:'nosotros', happy:'felices', today:'hoy', he:'él', works:'trabaja', engineer:'ingeniero',
  as:'como', want:'quiero', to:'a', be:'ser', am:'estoy/soy', every:'cada/todos', day:'día',
  days:'días', they:'ellos', play:'juegan', soccer:'fútbol', on:'en', weekends:'fines de semana',
  speaks:'habla', english:'inglés', well:'bien', wake:'despierto', up:'-', at:'a las', seven:'siete',
  go:'voy', bed:'dormir', night:'noche', exercises:'hace ejercicio', hospital:'hospital', museum:'museo',
  opens:'abre', nine:'nueve', need:'necesito', bank:'banco', doctor:'doctora', teacher:'maestro/a',
  he_is:'él es', engineer2:'ingeniero',
};

function buildHintPhrase(phrase) {
  return phrase.replace(/([a-zA-Z']+)/g, (match) => {
    const key = match.toLowerCase().replace(/'/g, '');
    const translation = wordTranslations[key];
    if (translation) {
      return `<span class="word-hint" data-translate="${translation}">${match}</span>`;
    }
    return match;
  });
}

/* ----------------------------------------------------------------
   ESTRUCTURA DEL MAPA: niveles → secciones → temas (2 por sección)
---------------------------------------------------------------- */
const LEVELS = {
  a1: { label: 'A1', units: [
    { title: 'Vida cotidiana básica', grad: ['#58cc02', '#46a302'], themes: ['saludos', 'colores'] },
    { title: 'Contando mi mundo',     grad: ['#ffc800', '#d4a700'], themes: ['numeros', 'animales'] },
    { title: 'Mi mundo cercano',      grad: ['#1cb0f6', '#0090d9'], themes: ['familia', 'comida'] },
  ]},
  a2: { label: 'A2', units: [
    { title: 'Hablando de mí',   grad: ['#ce82ff', '#a855f7'], themes: ['pronombres', 'serestar'] },
    { title: 'Mi día a día',     grad: ['#f59e0b', '#d97706'], themes: ['presente', 'rutina'] },
  ]},
  b1: { label: 'B1', units: [
    { title: 'En el mundo real', grad: ['#ef4444', '#dc2626'], themes: ['lugares', 'trabajos'] },
  ]},
};

/* ----------------------------------------------------------------
   CONTENIDO POR TEMA: icono, xp, guía y 10 preguntas (un solo tema c/u)
   tipos: order (ordenar palabras) | choice (opción múltiple)
          blank (completar espacio) | boolean (verdadero/falso)
---------------------------------------------------------------- */
const THEMES = {

  saludos: {
    label: 'Saludos', icon: '👋', xp: 40,
    guide: {
      summary: 'Aprende a saludar, despedirte y presentarte de forma cortés en español.',
      rules: ['"Buenos días" se usa en la mañana, "Buenas tardes" después del mediodía y "Buenas noches" al anochecer.', '"Hola" es informal y sirve a cualquier hora.', 'Para despedirte puedes usar "Adiós", "Hasta luego" o "Hasta mañana".'],
      examples: ['Hola, ¿cómo estás?', 'Buenas tardes, mucho gusto.', '¡Hasta luego!'],
      mistakes: ['Confundir "Adiós" (despedida) con un saludo.', 'Usar "Buenos días" de noche.'],
      tips: ['"Por favor" y "Gracias" siempre suman puntos de cortesía.', 'Practica en voz alta con el botón de audio 🔊.'],
    },
    questions: [
      { type:'order', en:'Good morning!', es:['¡Buenos','días!'], distractors:['noches','tardes','hola','adiós'] },
      { type:'choice', prompt:"¿Cómo se dice 'Hello' en español?", options:['Hola','Adiós','Gracias','Por favor'], answer:0 },
      { type:'blank', sentence:'Buenas ___, ¿cómo estás?', answer:'tardes', options:['tardes','gracias','perdón','luego'] },
      { type:'boolean', statement:"'Adiós' se usa para saludar cuando llegas.", answer:false },
      { type:'order', en:'Good afternoon, nice to meet you.', es:['Buenas','tardes,','mucho','gusto.'], distractors:['noches','día','adiós','hola'] },
      { type:'choice', prompt:"¿Qué significa 'Thank you'?", options:['Gracias','Perdón','De nada','Por favor'], answer:0 },
      { type:'blank', sentence:'¡Hasta ___! Nos vemos mañana.', answer:'luego', options:['luego','nunca','aquí','bien'] },
      { type:'boolean', statement:"'Buenos días' se usa por la noche.", answer:false },
      { type:'order', en:'See you tomorrow, goodbye!', es:['¡Hasta','mañana,','adiós!'], distractors:['luego','hoy','ayer','bien'] },
      { type:'choice', prompt:"¿Cómo respondes educadamente a '¿Cómo estás?'?", options:['Bien, gracias','Sí','No','Adiós'], answer:0 },
    ],
  },

  colores: {
    label: 'Colores', icon: '🎨', xp: 40,
    guide: {
      summary: 'Vocabulario esencial de colores para describir objetos, ropa y el mundo que te rodea.',
      rules: ['Los colores concuerdan en género y número con el sustantivo: "carro rojo", "casa roja", "carros rojos".', 'Colores terminados en "-o" cambian a "-a" en femenino (rojo/roja); los que terminan en otra letra no cambian (verde/verde).'],
      examples: ['El cielo es azul.', 'Me gusta el color morado.', 'La hierba es verde.'],
      mistakes: ['Olvidar la concordancia de género: "camisa rojo" (incorrecto) en vez de "camisa roja".'],
      tips: ['Asocia cada color con un objeto real para memorizarlo mejor.', 'Repite los colores primarios primero: rojo, azul, amarillo.'],
    },
    questions: [
      { type:'order', en:'The sky is blue.', es:['El','cielo','es','azul.'], distractors:['rojo','verde','amarillo','gris'] },
      { type:'choice', prompt:"¿Cómo se dice 'red' en español?", options:['Rojo','Azul','Verde','Amarillo'], answer:0 },
      { type:'blank', sentence:'La hierba es de color ___.', answer:'verde', options:['verde','rojo','azul','negro'] },
      { type:'boolean', statement:"'Amarillo' es el color del sol.", answer:true },
      { type:'order', en:'I like the color purple.', es:['Me','gusta','el','color','morado.'], distractors:['rosado','negro','blanco','gris'] },
      { type:'choice', prompt:"¿Qué color es 'black'?", options:['Negro','Blanco','Gris','Café'], answer:0 },
      { type:'blank', sentence:'Mi carro favorito es de color ___.', answer:'blanco', options:['blanco','negro','rojo','azul'] },
      { type:'boolean', statement:"'Rosado' y 'rosa' pueden significar lo mismo.", answer:true },
      { type:'order', en:'The orange fruit is orange.', es:['La','fruta','naranja','es','naranja.'], distractors:['roja','verde','morada','azul'] },
      { type:'choice', prompt:"¿Cómo se dice 'gray' en español?", options:['Gris','Café','Beige','Plata'], answer:0 },
    ],
  },

  numeros: {
    label: 'Números', icon: '🔢', xp: 45,
    guide: {
      summary: 'Cuenta del 1 al 100 y aprende a usar los números para hablar de edad y cantidades.',
      rules: ['Los números del 16 al 29 suelen escribirse en una sola palabra: dieciséis, veintidós.', 'A partir de 31 se separan con "y": treinta y uno.', 'Para la edad usamos el verbo "tener": "Tengo veinte años", no "soy veinte".'],
      examples: ['Tengo tres manzanas.', 'Hay diez estudiantes.', 'Tengo veinte años.'],
      mistakes: ['Decir "Soy veinte años" en vez de "Tengo veinte años".'],
      tips: ['Practica contando objetos reales a tu alrededor.', 'Aprende primero del 1 al 10, luego del 11 al 20.'],
    },
    questions: [
      { type:'order', en:'I have three apples.', es:['Tengo','tres','manzanas.'], distractors:['dos','cuatro','cinco','peras'] },
      { type:'choice', prompt:"¿Cómo se dice 'seven' en español?", options:['Siete','Ocho','Seis','Nueve'], answer:0 },
      { type:'blank', sentence:'Tengo ___ años.', answer:'veinte', options:['veinte','diez','cien','mil'] },
      { type:'boolean', statement:"'Diez' es el número 10.", answer:true },
      { type:'order', en:'There are ten students.', es:['Hay','diez','estudiantes.'], distractors:['nueve','once','veinte','profesores'] },
      { type:'choice', prompt:"¿Qué número es 'hundred'?", options:['Cien','Mil','Diez','Cincuenta'], answer:0 },
      { type:'blank', sentence:'El autobús número ___ pasa a las ocho.', answer:'cinco', options:['cinco','seis','siete','ocho'] },
      { type:'boolean', statement:"'Mil' es más grande que 'cien'.", answer:true },
      { type:'order', en:'I am twenty-five years old.', es:['Tengo','veinticinco','años.'], distractors:['treinta','quince','cuarenta','diez'] },
      { type:'choice', prompt:"¿Cómo se dice 'first' en un conteo?", options:['Primero','Segundo','Tercero','Último'], answer:0 },
    ],
  },

  animales: {
    label: 'Animales', icon: '🐾', xp: 45,
    guide: {
      summary: 'Nombra animales comunes de granja, mascotas y fauna silvestre.',
      rules: ['Muchos nombres de animales cambian de género: gato/gata, perro/perra.', 'El verbo "ladrar" es solo para perros; "maullar" para gatos.'],
      examples: ['El perro corre rápido.', 'Los peces viven en el agua.', 'La vaca da leche todos los días.'],
      mistakes: ['Confundir "gallina" (ave) con un tipo de pez.'],
      tips: ['Relaciona cada animal con el sonido que hace para recordarlo.'],
    },
    questions: [
      { type:'order', en:'The dog runs fast.', es:['El','perro','corre','rápido.'], distractors:['gato','lento','salta','camina'] },
      { type:'choice', prompt:"¿Cómo se dice 'cat' en español?", options:['Gato','Perro','Pájaro','Pez'], answer:0 },
      { type:'blank', sentence:'El ___ vuela muy alto.', answer:'pájaro', options:['pájaro','pez','perro','gato'] },
      { type:'boolean', statement:'Los peces viven en el agua.', answer:true },
      { type:'order', en:'I have two small dogs.', es:['Tengo','dos','perros','pequeños.'], distractors:['grandes','gatos','tres','uno'] },
      { type:'choice', prompt:"¿Qué animal es 'horse'?", options:['Caballo','Vaca','Cerdo','Oveja'], answer:0 },
      { type:'blank', sentence:'La ___ da leche todos los días.', answer:'vaca', options:['vaca','gallina','oveja','cabra'] },
      { type:'boolean', statement:"'Gallina' es un tipo de pez.", answer:false },
      { type:'order', en:'The bird sings in the morning.', es:['El','pájaro','canta','en','la','mañana.'], distractors:['tarde','noche','perro','ladra'] },
      { type:'choice', prompt:"¿Cómo se dice 'rabbit' en español?", options:['Conejo','Ratón','Ardilla','Zorro'], answer:0 },
    ],
  },

  familia: {
    label: 'Familia', icon: '👨‍👩‍👧', xp: 45,
    guide: {
      summary: 'Habla sobre tu familia: padres, hermanos, abuelos y otros parientes.',
      rules: ['Los sustantivos de parentesco cambian de género: hijo/hija, tío/tía, primo/prima.', 'El masculino plural puede incluir a ambos géneros: "mis hermanos" puede referirse a hermanos y hermanas juntos.'],
      examples: ['Esta es mi madre.', 'Amo a mis abuelos.', 'Mi familia es grande.'],
      mistakes: ['Pensar que "hija" se refiere a un hombre.'],
      tips: ['Dibuja tu árbol genealógico en español para practicar.'],
    },
    questions: [
      { type:'order', en:'This is my mother.', es:['Esta','es','mi','madre.'], distractors:['padre','hermana','abuela','tío'] },
      { type:'choice', prompt:"¿Cómo se dice 'brother' en español?", options:['Hermano','Hermana','Primo','Tío'], answer:0 },
      { type:'blank', sentence:'Mi ___ es el papá de mi papá.', answer:'abuelo', options:['abuelo','tío','primo','hermano'] },
      { type:'boolean', statement:"'Hija' se refiere a un hombre.", answer:false },
      { type:'order', en:'I love my grandparents.', es:['Amo','a','mis','abuelos.'], distractors:['padres','tíos','primos','hermanos'] },
      { type:'choice', prompt:"¿Qué significa 'aunt'?", options:['Tía','Tío','Prima','Nuera'], answer:0 },
      { type:'blank', sentence:'Mi ___ tiene tres hijos.', answer:'tía', options:['tía','tío','abuela','hermana'] },
      { type:'boolean', statement:"'Primo' y 'prima' son la misma persona pero de distinto género.", answer:true },
      { type:'order', en:'My family is big.', es:['Mi','familia','es','grande.'], distractors:['pequeña','feliz','unida','triste'] },
      { type:'choice', prompt:"¿Cómo se dice 'son' en español?", options:['Hijo','Hija','Nieto','Sobrino'], answer:0 },
    ],
  },

  comida: {
    label: 'Comida', icon: '🍽️', xp: 45,
    guide: {
      summary: 'Frases útiles para pedir comida y bebida en un restaurante o café.',
      rules: ['"Quisiera" es una forma cortés de pedir algo, más formal que "quiero".', '"La cuenta" es la palabra para "the bill" en un restaurante.'],
      examples: ['Quisiera un café, por favor.', '¿Puede traer la cuenta, por favor?', 'La sopa está muy caliente.'],
      mistakes: ['Pensar que "postre" se come al inicio de la comida (se come al final).'],
      tips: ['Practica pidiendo tu comida favorita en español antes de viajar.'],
    },
    questions: [
      { type:'order', en:'I would like a coffee, please.', es:['Quisiera','un','café,','por','favor.'], distractors:['té','jugo','agua','dos'] },
      { type:'choice', prompt:"¿Cómo se dice 'bread' en español?", options:['Pan','Arroz','Queso','Huevo'], answer:0 },
      { type:'blank', sentence:'Quiero un vaso de ___ fría.', answer:'agua', options:['agua','leche','jugo','café'] },
      { type:'boolean', statement:"'La cuenta' significa 'the bill'.", answer:true },
      { type:'order', en:'The soup is very hot.', es:['La','sopa','está','muy','caliente.'], distractors:['fría','rica','salada','dulce'] },
      { type:'choice', prompt:"¿Qué significa 'cheese'?", options:['Queso','Leche','Mantequilla','Huevo'], answer:0 },
      { type:'blank', sentence:'¿Tiene usted ___ vegetariano?', answer:'menú', options:['menú','mesa','plato','postre'] },
      { type:'boolean', statement:"'Postre' se come al inicio de la comida.", answer:false },
      { type:'order', en:'Can I have the bill, please?', es:['¿Puede','traer','la','cuenta,','por','favor?'], distractors:['mesa','menú','agua','dos'] },
      { type:'choice', prompt:"¿Cómo se dice 'delicious' en español?", options:['Delicioso','Feo','Frío','Caro'], answer:0 },
    ],
  },

  pronombres: {
    label: 'Pronombres', icon: '🙋', xp: 50,
    guide: {
      summary: 'Los pronombres personales reemplazan al sujeto: yo, tú, él, ella, nosotros, ellos.',
      rules: ['"Tú" es informal y "usted" es formal; ambos significan "you".', '"Nosotros/nosotras" y "ellos/ellas" cambian según el género del grupo.'],
      examples: ['Ella es mi amiga.', 'Nosotros somos estudiantes.', 'Yo te amo.'],
      mistakes: ['Usar "yo" para hablar de otra persona.'],
      tips: ['En español el pronombre a veces se omite porque el verbo ya indica quién habla.'],
    },
    questions: [
      { type:'order', en:'She is my friend.', es:['Ella','es','mi','amiga.'], distractors:['él','ellos','nosotros','tú'] },
      { type:'choice', prompt:"¿Qué pronombre corresponde a 'they'?", options:['Ellos/Ellas','Nosotros','Usted','Vosotros'], answer:0 },
      { type:'blank', sentence:'___ somos estudiantes.', answer:'Nosotros', options:['Nosotros','Ellos','Ella','Usted'] },
      { type:'boolean', statement:"'Tú' y 'usted' son formas de decir 'you'.", answer:true },
      { type:'order', en:'We are happy today.', es:['Nosotros','estamos','felices','hoy.'], distractors:['ellos','tristes','ayer','ella'] },
      { type:'choice', prompt:"¿Cómo se dice 'he' en español?", options:['Él','Ella','Ellos','Yo'], answer:0 },
      { type:'blank', sentence:'___ tiene un perro nuevo.', answer:'Ella', options:['Ella','Yo','Nosotros','Ellos'] },
      { type:'boolean', statement:"'Yo' se usa para hablar de otra persona.", answer:false },
      { type:'order', en:'I love you.', es:['Yo','te','amo.'], distractors:['tú','me','ella','él'] },
      { type:'choice', prompt:"¿Qué pronombre usarías con tu jefe formalmente?", options:['Usted','Tú','Vos','Ustedes'], answer:0 },
    ],
  },

  serestar: {
    label: 'Verb To Be', icon: '🧩', xp: 50,
    guide: {
      summary: '"Ser" y "estar" traducen "to be", pero se usan en contextos distintos.',
      rules: ['Usa "ser" para características permanentes: profesión, nacionalidad, personalidad.', 'Usa "estar" para estados temporales: emociones, ubicación, condición.'],
      examples: ['Ella es doctora. (permanente)', 'Estoy cansado hoy. (temporal)', 'El café está caliente.'],
      mistakes: ['Decir "Soy cansado" en vez de "Estoy cansado".'],
      tips: ['Piensa: ¿es algo que siempre es así, o algo que cambia? Eso te dice si usar "ser" o "estar".'],
    },
    questions: [
      { type:'order', en:'I am happy.', es:['Yo','estoy','feliz.'], distractors:['soy','eres','están','triste'] },
      { type:'choice', prompt:"¿Cuál es correcta: 'She ___ a teacher'?", options:['es','está','son','están'], answer:0 },
      { type:'blank', sentence:'Nosotros ___ cansados hoy.', answer:'estamos', options:['estamos','somos','es','son'] },
      { type:'boolean', statement:'Usamos "ser" para describir profesiones.', answer:true },
      { type:'order', en:'They are students.', es:['Ellos','son','estudiantes.'], distractors:['están','es','era','fueron'] },
      { type:'choice', prompt:"¿Qué verbo usarías para el clima: 'ser' o 'estar'?", options:['Estar','Ser','Ambos','Ninguno'], answer:0 },
      { type:'blank', sentence:'El café ___ muy caliente.', answer:'está', options:['está','es','son','somos'] },
      { type:'boolean', statement:"'Soy de Colombia' usa el verbo 'estar'.", answer:false },
      { type:'order', en:'You are very kind.', es:['Tú','eres','muy','amable.'], distractors:['estás','soy','es','amables'] },
      { type:'choice', prompt:"¿Cuál es correcta: 'I ___ tired'?", options:['am','is','are','be'], answer:0 },
    ],
  },

  presente: {
    label: 'Simple Present', icon: '🔁', xp: 50,
    guide: {
      summary: 'El presente simple describe hábitos, rutinas y hechos generales.',
      rules: ['En español, el verbo cambia según la persona: yo trabajo, ella trabaja, ellos trabajan.', 'No necesitas un auxiliar como "do/does" en español.'],
      examples: ['Yo trabajo todos los días.', 'Ella habla inglés muy bien.', 'Nosotros trabajamos en una oficina.'],
      mistakes: ['Usar el pasado o futuro cuando se habla de una rutina habitual.'],
      tips: ['Palabras como "todos los días", "siempre" y "cada" son pistas de presente simple.'],
    },
    questions: [
      { type:'order', en:'I work every day.', es:['Yo','trabajo','todos','los','días.'], distractors:['trabajé','trabajaré','noches','semanas'] },
      { type:'choice', prompt:"¿Cuál es la forma correcta para 'she'?", options:['Ella trabaja','Ella trabajar','Ella trabajando','Ella trabajó'], answer:0 },
      { type:'blank', sentence:'Él ___ inglés todos los días.', answer:'estudia', options:['estudia','estudió','estudiará','estudiando'] },
      { type:'boolean', statement:'El presente simple describe hábitos y rutinas.', answer:true },
      { type:'order', en:'They play soccer on weekends.', es:['Ellos','juegan','fútbol','los','fines','de','semana.'], distractors:['jugaron','jugarán','básquetbol','lunes'] },
      { type:'choice', prompt:"¿Cómo se dice 'I like coffee'?", options:['Me gusta el café','Me gustó el café','Me gustará el café','Me gustaba el café'], answer:0 },
      { type:'blank', sentence:'Nosotros ___ en una oficina.', answer:'trabajamos', options:['trabajamos','trabajaremos','trabajábamos','trabajaron'] },
      { type:'boolean', statement:"'Como pan todos los días' está en presente.", answer:true },
      { type:'order', en:'She speaks English very well.', es:['Ella','habla','inglés','muy','bien.'], distractors:['habló','hablará','mal','poco'] },
      { type:'choice', prompt:"¿Qué opción usa correctamente el presente simple?", options:['Yo vivo en Bogotá','Yo viví en Bogotá','Yo viviré en Bogotá','Yo viviendo en Bogotá'], answer:0 },
    ],
  },

  rutina: {
    label: 'Rutina Diaria', icon: '⏰', xp: 50,
    guide: {
      summary: 'Describe las actividades que haces cada día, desde despertarte hasta dormir.',
      rules: ['Muchos verbos de rutina son reflexivos: despertarse, vestirse, ducharse.', 'Usa "a las" + hora para decir cuándo haces algo: "a las siete".'],
      examples: ['Me despierto a las siete.', 'Ella hace ejercicio cada mañana.', 'Me voy a dormir a las diez de la noche.'],
      mistakes: ['Confundir "cenar" (comer de noche) con desayunar.'],
      tips: ['Escribe tu rutina diaria en español para practicar el vocabulario.'],
    },
    questions: [
      { type:'order', en:'I wake up at seven.', es:['Me','despierto','a','las','siete.'], distractors:['ocho','duermo','como','seis'] },
      { type:'choice', prompt:"¿Cómo se dice 'I have breakfast'?", options:['Desayuno','Almuerzo','Ceno','Duermo'], answer:0 },
      { type:'blank', sentence:'Después del trabajo, yo ___ a casa.', answer:'camino', options:['camino','corro','duermo','como'] },
      { type:'boolean', statement:'"Cenar" significa comer por la mañana.', answer:false },
      { type:'order', en:'I go to bed at ten at night.', es:['Me','voy','a','dormir','a','las','diez','de','la','noche.'], distractors:['mañana','tarde','nueve','once'] },
      { type:'choice', prompt:"¿Qué significa 'to take a shower'?", options:['Ducharse','Dormir','Comer','Vestirse'], answer:0 },
      { type:'blank', sentence:'Todos los días yo ___ el periódico.', answer:'leo', options:['leo','escribo','cocino','limpio'] },
      { type:'boolean', statement:'"Vestirse" es ponerse la ropa.', answer:true },
      { type:'order', en:'She exercises every morning.', es:['Ella','hace','ejercicio','cada','mañana.'], distractors:['tarde','noche','duerme','come'] },
      { type:'choice', prompt:"¿Cómo se dice 'my schedule' en español?", options:['Mi horario','Mi reunión','Mi trabajo','Mi casa'], answer:0 },
    ],
  },

  lugares: {
    label: 'Lugares', icon: '📍', xp: 55,
    guide: {
      summary: 'Vocabulario para hablar de lugares comunes en la ciudad y dar direcciones.',
      rules: ['Usa "ir a" + el lugar: "voy al banco", "voy a la farmacia".', 'Recuerda la contracción "a + el = al".'],
      examples: ['El hospital es muy grande.', 'Voy al farmacia a comprar medicinas.', 'Necesito ir al banco.'],
      mistakes: ['Pensar que "la plaza" es un lugar dentro de una casa.'],
      tips: ['Aprende los lugares que más usas: banco, farmacia, escuela, parque.'],
    },
    questions: [
      { type:'order', en:'The hospital is very big.', es:['El','hospital','es','muy','grande.'], distractors:['pequeño','escuela','banco','viejo'] },
      { type:'choice', prompt:"¿Cómo se dice 'library' en español?", options:['Biblioteca','Farmacia','Banco','Escuela'], answer:0 },
      { type:'blank', sentence:'Voy a la ___ a comprar medicinas.', answer:'farmacia', options:['farmacia','banco','parque','museo'] },
      { type:'boolean', statement:'"El parque" es un buen lugar para caminar.', answer:true },
      { type:'order', en:'The museum opens at nine.', es:['El','museo','abre','a','las','nueve.'], distractors:['cierra','diez','ocho','tarde'] },
      { type:'choice', prompt:"¿Qué significa 'airport'?", options:['Aeropuerto','Estación','Puerto','Aduana'], answer:0 },
      { type:'blank', sentence:'El tren sale de la ___ a las seis.', answer:'estación', options:['estación','aeropuerto','plaza','calle'] },
      { type:'boolean', statement:'"La plaza" es un lugar dentro de una casa.', answer:false },
      { type:'order', en:'I need to go to the bank.', es:['Necesito','ir','al','banco.'], distractors:['hospital','parque','museo','aeropuerto'] },
      { type:'choice', prompt:"¿Cómo se dice 'church' en español?", options:['Iglesia','Escuela','Oficina','Tienda'], answer:0 },
    ],
  },

  trabajos: {
    label: 'Trabajos', icon: '💼', xp: 55,
    guide: {
      summary: 'Nombra profesiones comunes y aprende a decir a qué te dedicas.',
      rules: ['Muchas profesiones cambian de género: doctor/doctora, maestro/maestra.', 'Usa "trabajar como" + profesión: "trabajo como ingeniero".'],
      examples: ['Ella es doctora.', 'Él trabaja como ingeniero.', 'Quiero ser ingeniero.'],
      mistakes: ['Pensar que un "policía" trabaja preparando comida.'],
      tips: ['Practica presentándote y diciendo tu profesión en español.'],
    },
    questions: [
      { type:'order', en:'She is a doctor.', es:['Ella','es','doctora.'], distractors:['enfermera','maestra','abogada','ingeniera'] },
      { type:'choice', prompt:"¿Cómo se dice 'teacher' en español?", options:['Maestro/a','Doctor/a','Abogado/a','Ingeniero/a'], answer:0 },
      { type:'blank', sentence:'Mi hermano es ___, trabaja en un hospital.', answer:'enfermero', options:['enfermero','maestro','chef','piloto'] },
      { type:'boolean', statement:'Un "chef" trabaja cocinando en un restaurante.', answer:true },
      { type:'order', en:'He works as an engineer.', es:['Él','trabaja','como','ingeniero.'], distractors:['doctor','maestro','abogado','chef'] },
      { type:'choice', prompt:"¿Qué significa 'lawyer'?", options:['Abogado/a','Ingeniero/a','Piloto','Policía'], answer:0 },
      { type:'blank', sentence:'El ___ vuela los aviones.', answer:'piloto', options:['piloto','chef','policía','doctor'] },
      { type:'boolean', statement:'Un "policía" trabaja preparando comida.', answer:false },
      { type:'order', en:'I want to be an engineer.', es:['Quiero','ser','ingeniero.'], distractors:['doctor','maestro','chef','abogado'] },
      { type:'choice', prompt:"¿Cómo se dice 'nurse' en español?", options:['Enfermero/a','Doctor/a','Maestro/a','Piloto'], answer:0 },
    ],
  },

};

/* ----------------------------------------------------------------
   PROGRESO / ESTADÍSTICAS (localStorage)
---------------------------------------------------------------- */
const STORAGE_KEY = 'egglish_lecciones_v3';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done:{}, xp:0, streak:0, lastDay:null }; }
  catch(e) { return { done:{}, xp:0, streak:0, lastDay:null }; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch(e) {}
}
const progress = loadProgress();

function registerDayStreak() {
  const today = new Date().toDateString();
  if (progress.lastDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  progress.streak = (progress.lastDay === yesterday) ? progress.streak + 1 : 1;
  progress.lastDay = today;
  saveProgress();
}

function flatThemeOrder() {
  const order = [];
  ['a1','a2','b1'].forEach(lvl => {
    LEVELS[lvl].units.forEach(unit => unit.themes.forEach(t => order.push(t)));
  });
  return order;
}

function updateStatsBar() {
  const order = flatThemeOrder();
  document.getElementById('stat-streak').textContent = progress.streak || 0;
  document.getElementById('stat-total-xp').textContent = progress.xp || 0;
  document.getElementById('stat-lessons-done').textContent = order.filter(t => progress.done[t]).length;
}

/* ----------------------------------------------------------------
   RENDER DEL MAPA (nodos dinámicos por nivel)
---------------------------------------------------------------- */
function buildPath() {
  const main = document.getElementById('path-main');
  main.innerHTML = '';
  const order = flatThemeOrder();

  Object.keys(LEVELS).forEach(lvl => {
    const panel = document.createElement('div');
    panel.className = 'level-panel';
    panel.id = `panel-${lvl}`;

    LEVELS[lvl].units.forEach((unit, unitIdx) => {
      const header = document.createElement('div');
      header.className = 'unit-header';
      header.style.background = `linear-gradient(135deg, ${unit.grad[0]}, ${unit.grad[1]})`;
      header.innerHTML = `
        <div class="unit-header-left">
          <div class="unit-label">Sección ${unitIdx + 1}</div>
          <div class="unit-title">${unit.title}</div>
        </div>
        <button class="unit-header-btn" data-unit-themes="${unit.themes.join(',')}">📖 GUÍA</button>
      `;
      panel.appendChild(header);

      const track = document.createElement('div');
      track.className = 'path-track';

      unit.themes.forEach((themeKey, i) => {
        const theme = THEMES[themeKey];
        const globalIdx = order.indexOf(themeKey);
        const slot = document.createElement('div');
        slot.className = 'node-slot';
        slot.dataset.pos = i % 8;

        if (i > 0) {
          const connector = document.createElement('div');
          connector.className = 'node-connector' + (progress.done[unit.themes[i-1]] ? ' done' : '');
          track.appendChild(connector);
        }

        const btn = document.createElement('button');
        btn.className = 'lesson-node';
        btn.dataset.themeKey = themeKey;
        btn.dataset.globalIdx = globalIdx;

        const isDone = !!progress.done[themeKey];
        const isFirst = globalIdx === 0;
        const prevDone = isFirst || !!progress.done[order[globalIdx - 1]];

        if (isDone) {
          btn.classList.add('state-done');
          btn.innerHTML = `<span class="node-icon">${theme.icon}</span><span class="node-crown">👑</span>`;
        } else if (prevDone) {
          btn.classList.add('state-current');
          btn.innerHTML = `<span class="node-empezar">EMPEZAR</span><span class="node-icon">${theme.icon}</span>`;
        } else {
          btn.classList.add('state-locked');
          btn.innerHTML = `<span class="node-icon">🔒</span>`;
        }
        const tooltip = document.createElement('span');
        tooltip.className = 'node-tooltip';
        tooltip.textContent = theme.label;
        btn.appendChild(tooltip);

        const themeLabel = document.createElement('span');
        themeLabel.className = 'node-theme-label';
        themeLabel.textContent = theme.label;
        btn.appendChild(themeLabel);

        slot.appendChild(btn);
        track.appendChild(slot);
      });

      panel.appendChild(track);
    });

    main.appendChild(panel);
  });

  document.getElementById(`panel-${document.querySelector('.level-tab.active')?.dataset.level || 'a1'}`)?.classList.add('active');

  main.querySelectorAll('.lesson-node').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('state-locked')) { showToast('🔒 Completa la lección anterior primero.'); return; }
      openLesson(btn.dataset.themeKey);
    });
  });

  main.querySelectorAll('.unit-header-btn').forEach(btn => {
    btn.addEventListener('click', () => openGuide(btn.dataset.unitThemes.split(',')));
  });

  updateStatsBar();
}

/* ----------------------------------------------------------------
   GUÍA MODAL
---------------------------------------------------------------- */
const guideModal   = document.getElementById('guide-modal');
const guideTabsEl   = document.getElementById('guide-tabs');
const guideContentEl = document.getElementById('guide-content');

function renderGuideContent(themeKey) {
  const theme = THEMES[themeKey];
  const g = theme.guide;
  guideContentEl.innerHTML = `
    <div class="guide-topic-title">${theme.icon} ${theme.label}</div>
    <div class="guide-summary">${g.summary}</div>
    <div class="guide-section-title">📌 Reglas principales</div>
    <ul class="guide-list">${g.rules.map(r => `<li>${r}</li>`).join('')}</ul>
    <div class="guide-section-title">✅ Ejemplos</div>
    <ul class="guide-list examples">${g.examples.map(r => `<li>${r}</li>`).join('')}</ul>
    <div class="guide-section-title">⚠️ Errores comunes</div>
    <ul class="guide-list mistakes">${g.mistakes.map(r => `<li>${r}</li>`).join('')}</ul>
    <div class="guide-section-title">💡 Consejos rápidos</div>
    <ul class="guide-list tips">${g.tips.map(r => `<li>${r}</li>`).join('')}</ul>
  `;
}

function openGuide(themeKeys) {
  guideTabsEl.innerHTML = '';
  themeKeys.forEach((key, i) => {
    const t = THEMES[key];
    const tab = document.createElement('button');
    tab.className = 'guide-tab-btn' + (i === 0 ? ' active' : '');
    tab.textContent = `${t.icon} ${t.label}`;
    tab.addEventListener('click', () => {
      guideTabsEl.querySelectorAll('.guide-tab-btn').forEach(b => b.classList.remove('active'));
      tab.classList.add('active');
      renderGuideContent(key);
    });
    guideTabsEl.appendChild(tab);
  });
  renderGuideContent(themeKeys[0]);
  guideModal.classList.add('open');
}
document.getElementById('guide-close').addEventListener('click', () => guideModal.classList.remove('open'));
guideModal.addEventListener('click', (e) => { if (e.target === guideModal) guideModal.classList.remove('open'); });

/* ----------------------------------------------------------------
   MOTOR DE LECCIÓN
---------------------------------------------------------------- */
const lessonModal    = document.getElementById('lesson-modal');
const lessonClose    = document.getElementById('lesson-close');
const progressFill   = document.getElementById('lesson-progress-fill');
const progressLabel  = document.getElementById('lesson-progress-label');
const heartsWrap     = document.getElementById('lesson-hearts');
const instructionEl  = document.getElementById('lesson-instruction');
const charRow        = document.getElementById('lesson-character-row');
const phraseEl       = document.getElementById('lesson-phrase');
const hintLabelEl    = document.getElementById('phrase-hint-label');
const exerciseArea   = document.getElementById('exercise-area');
const feedbackEl     = document.getElementById('lesson-feedback');
const feedbackIcon   = document.getElementById('feedback-icon');
const feedbackTitle  = document.getElementById('feedback-title');
const feedbackAns    = document.getElementById('feedback-answer');
const btnCheck       = document.getElementById('btn-check');
const btnSkip        = document.getElementById('btn-skip');
const audioBtnEl     = document.getElementById('lesson-audio-btn');
const completionModal = document.getElementById('completion-modal');
const loseModal      = document.getElementById('lose-modal');

const MAX_HEARTS = 3;

const lessonState = {
  themeKey: '', questions: [], qIndex: 0, hearts: MAX_HEARTS,
  phase: 'input', // input | correct | wrong
  selectedWords: [], selectedChoice: null, selectedBool: null, filledBlank: null,
  correctCount: 0, totalXp: 0, startTime: 0,
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function openLesson(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) { showToast('⚠️ Lección no disponible aún.'); return; }

  lessonState.themeKey = themeKey;
  lessonState.questions = shuffleArray(theme.questions);
  lessonState.qIndex = 0;
  lessonState.hearts = MAX_HEARTS;
  lessonState.phase = 'input';
  lessonState.correctCount = 0;
  lessonState.totalXp = 0;
  lessonState.startTime = Date.now();

  updateHeartsUI();
  lessonModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderQuestion();
}

function updateHeartsUI() {
  heartsWrap.querySelectorAll('.heart').forEach((h, i) => {
    h.classList.toggle('lost', i >= lessonState.hearts);
    h.textContent = i < lessonState.hearts ? '❤️' : '🤍';
  });
}

function renderQuestion() {
  const q = lessonState.questions[lessonState.qIndex];
  lessonState.phase = 'input';
  lessonState.selectedWords = [];
  lessonState.selectedChoice = null;
  lessonState.selectedBool = null;
  lessonState.filledBlank = null;
  feedbackEl.className = 'lesson-feedback';

  const total = lessonState.questions.length;
  progressFill.style.width = ((lessonState.qIndex) / total * 100) + '%';
  progressLabel.textContent = `${lessonState.qIndex + 1} / ${total}`;

  exerciseArea.innerHTML = '';

  if (q.type === 'order') {
    instructionEl.textContent = 'Ordena las palabras en español';
    charRow.style.display = 'flex';
    hintLabelEl.classList.remove('hidden-el');
    phraseEl.innerHTML = buildHintPhrase(q.en);
    renderOrderExercise(q);
  } else if (q.type === 'choice') {
    instructionEl.textContent = 'Selecciona la respuesta correcta';
    charRow.style.display = 'none';
    hintLabelEl.classList.add('hidden-el');
    renderChoiceExercise(q);
  } else if (q.type === 'blank') {
    instructionEl.textContent = 'Completa el espacio en blanco';
    charRow.style.display = 'none';
    hintLabelEl.classList.add('hidden-el');
    renderBlankExercise(q);
  } else if (q.type === 'boolean') {
    instructionEl.textContent = 'Verdadero o falso';
    charRow.style.display = 'none';
    hintLabelEl.classList.add('hidden-el');
    renderBooleanExercise(q);
  }

  updateCheckBtn();
}

/* ---- ORDENAR PALABRAS (drag & drop + click) ---- */
function renderOrderExercise(q) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="lesson-answer-zone" id="answer-zone"></div>
    <div class="drag-hint">✋ Toca o arrastra las palabras para ordenarlas</div>
    <div class="lesson-wordbank" id="wordbank"></div>
  `;
  exerciseArea.appendChild(wrap);

  const answerZone = wrap.querySelector('#answer-zone');
  const wordbank = wrap.querySelector('#wordbank');

  const allWords = shuffleArray([...q.es, ...q.distractors.slice(0, 4)]);
  allWords.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'bank-word';
    btn.textContent = word;
    btn.addEventListener('click', () => {
      if (lessonState.phase !== 'input' || btn.classList.contains('used')) return;
      btn.classList.add('used');
      lessonState.selectedWords.push({ word, bankBtn: btn });
      renderAnswerTiles(answerZone);
      updateCheckBtn();
    });
    wordbank.appendChild(btn);
  });

  answerZone._dragOver = null;
  answerZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = answerZone.querySelector('.dragging');
    if (!dragging) return;
    const after = [...answerZone.querySelectorAll('.answer-word:not(.dragging)')].find(el => {
      const box = el.getBoundingClientRect();
      return e.clientX < box.left + box.width / 2;
    });
    if (after) answerZone.insertBefore(dragging, after);
    else answerZone.appendChild(dragging);
  });
}

function renderAnswerTiles(answerZone) {
  answerZone.innerHTML = '';
  lessonState.selectedWords.forEach((sel, idx) => {
    const tag = document.createElement('button');
    tag.className = 'answer-word';
    tag.textContent = sel.word;
    tag.draggable = true;
    tag.addEventListener('click', () => {
      if (lessonState.phase !== 'input') return;
      sel.bankBtn.classList.remove('used');
      lessonState.selectedWords.splice(idx, 1);
      renderAnswerTiles(answerZone);
      updateCheckBtn();
    });
    tag.addEventListener('dragstart', () => tag.classList.add('dragging'));
    tag.addEventListener('dragend', () => {
      tag.classList.remove('dragging');
      lessonState.selectedWords = [...answerZone.querySelectorAll('.answer-word')].map(el => {
        return lessonState.selectedWords.find(s => s.word === el.textContent && s.bankBtn) || { word: el.textContent };
      });
      syncOrderFromDom(answerZone);
    });
    answerZone.appendChild(tag);
  });
}

function syncOrderFromDom(answerZone) {
  const domWords = [...answerZone.querySelectorAll('.answer-word')].map(el => el.textContent);
  const newOrder = [];
  const pool = [...lessonState.selectedWords];
  domWords.forEach(w => {
    const idx = pool.findIndex(p => p.word === w);
    if (idx !== -1) { newOrder.push(pool[idx]); pool.splice(idx, 1); }
  });
  lessonState.selectedWords = newOrder;
}

/* ---- OPCIÓN MÚLTIPLE ---- */
function renderChoiceExercise(q) {
  instructionEl.textContent = q.prompt;
  const list = document.createElement('div');
  list.className = 'choice-list';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (lessonState.phase !== 'input') return;
      list.querySelectorAll('.choice-option').forEach(o => o.classList.remove('selected'));
      btn.classList.add('selected');
      lessonState.selectedChoice = i;
      updateCheckBtn();
    });
    list.appendChild(btn);
  });
  exerciseArea.appendChild(list);
}

/* ---- COMPLETAR ESPACIO ---- */
function renderBlankExercise(q) {
  const sentenceWrap = document.createElement('div');
  const parts = q.sentence.split('___');
  sentenceWrap.className = 'blank-sentence';
  sentenceWrap.innerHTML = `${parts[0]}<span class="blank-slot" id="blank-slot">?</span>${parts[1] || ''}`;
  exerciseArea.appendChild(sentenceWrap);

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'blank-options';
  const slot = sentenceWrap.querySelector('#blank-slot');

  shuffleArray(q.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'bank-word';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (lessonState.phase !== 'input') return;
      lessonState.filledBlank = opt;
      slot.textContent = opt;
      slot.classList.add('filled');
      updateCheckBtn();
    });
    optionsWrap.appendChild(btn);
  });
  exerciseArea.appendChild(optionsWrap);
}

/* ---- VERDADERO / FALSO ---- */
function renderBooleanExercise(q) {
  const statement = document.createElement('div');
  statement.className = 'boolean-statement';
  statement.textContent = q.statement;
  exerciseArea.appendChild(statement);

  const btnWrap = document.createElement('div');
  btnWrap.className = 'boolean-buttons';
  const trueBtn = document.createElement('button');
  trueBtn.className = 'boolean-btn true-opt';
  trueBtn.textContent = '✅ Verdadero';
  const falseBtn = document.createElement('button');
  falseBtn.className = 'boolean-btn false-opt';
  falseBtn.textContent = '❌ Falso';

  [ [trueBtn, true], [falseBtn, false] ].forEach(([btn, val]) => {
    btn.addEventListener('click', () => {
      if (lessonState.phase !== 'input') return;
      trueBtn.classList.remove('selected');
      falseBtn.classList.remove('selected');
      btn.classList.add('selected');
      lessonState.selectedBool = val;
      updateCheckBtn();
    });
  });
  btnWrap.appendChild(trueBtn);
  btnWrap.appendChild(falseBtn);
  exerciseArea.appendChild(btnWrap);
}

/* ---- VALIDACIÓN ---- */
function hasAnswerReady() {
  const q = lessonState.questions[lessonState.qIndex];
  if (q.type === 'order') return lessonState.selectedWords.length > 0;
  if (q.type === 'choice') return lessonState.selectedChoice !== null;
  if (q.type === 'blank') return lessonState.filledBlank !== null;
  if (q.type === 'boolean') return lessonState.selectedBool !== null;
  return false;
}

function updateCheckBtn() {
  if (lessonState.phase === 'correct') {
    btnCheck.className = 'btn-check correct-continue';
    btnCheck.textContent = 'CONTINUAR';
  } else if (lessonState.phase === 'wrong') {
    btnCheck.className = 'btn-check wrong';
    btnCheck.textContent = 'CONTINUAR';
  } else {
    const ready = hasAnswerReady();
    btnCheck.className = ready ? 'btn-check ready' : 'btn-check';
    btnCheck.textContent = 'COMPROBAR';
  }
}

function isAnswerCorrect(q) {
  if (q.type === 'order') {
    const userAnswer = lessonState.selectedWords.map(s => s.word).join(' ');
    return userAnswer === q.es.join(' ');
  }
  if (q.type === 'choice') return lessonState.selectedChoice === q.answer;
  if (q.type === 'blank') return lessonState.filledBlank === q.answer;
  if (q.type === 'boolean') return lessonState.selectedBool === q.answer;
  return false;
}

function correctAnswerText(q) {
  if (q.type === 'order') return q.es.join(' ');
  if (q.type === 'choice') return q.options[q.answer];
  if (q.type === 'blank') return q.answer;
  if (q.type === 'boolean') return q.answer ? 'Verdadero' : 'Falso';
  return '';
}

function checkAnswer() {
  if (lessonState.phase === 'correct' || lessonState.phase === 'wrong') { advanceQuestion(); return; }

  const q = lessonState.questions[lessonState.qIndex];
  const correct = isAnswerCorrect(q);
  const xpPerQ = Math.ceil(THEMES[lessonState.themeKey].xp / lessonState.questions.length);

  if (correct) {
    lessonState.phase = 'correct';
    lessonState.correctCount++;
    lessonState.totalXp += xpPerQ;
    feedbackIcon.textContent = '🎉';
    feedbackTitle.className = 'feedback-title correct';
    feedbackTitle.textContent = '¡Correcto!';
    feedbackAns.textContent = correctAnswerText(q);
    feedbackEl.className = 'lesson-feedback correct';
  } else {
    lessonState.hearts = Math.max(0, lessonState.hearts - 1);
    lessonState.phase = 'wrong';
    updateHeartsUI();
    feedbackIcon.textContent = '💔';
    feedbackTitle.className = 'feedback-title wrong';
    feedbackTitle.textContent = '¡Incorrecto!';
    feedbackAns.textContent = 'Respuesta correcta: ' + correctAnswerText(q);
    feedbackEl.className = 'lesson-feedback wrong';
  }
  updateCheckBtn();

  if (lessonState.hearts <= 0) {
    setTimeout(() => { showLoseModal(); }, 1100);
  }
}

function advanceQuestion() {
  lessonState.qIndex++;
  if (lessonState.qIndex >= lessonState.questions.length) {
    finishLesson();
  } else {
    renderQuestion();
  }
}

function skipQuestion() {
  if (lessonState.phase !== 'input') { advanceQuestion(); return; }
  const q = lessonState.questions[lessonState.qIndex];
  lessonState.hearts = Math.max(0, lessonState.hearts - 1);
  updateHeartsUI();
  lessonState.phase = 'wrong';
  feedbackIcon.textContent = '🙈';
  feedbackTitle.className = 'feedback-title wrong';
  feedbackTitle.textContent = 'Omitido';
  feedbackAns.textContent = 'Respuesta: ' + correctAnswerText(q);
  feedbackEl.className = 'lesson-feedback wrong';
  updateCheckBtn();
  if (lessonState.hearts <= 0) setTimeout(() => showLoseModal(), 1100);
}

function finishLesson() {
  closeLesson(false);
  const elapsedSec = Math.round((Date.now() - lessonState.startTime) / 1000);
  const mm = Math.floor(elapsedSec / 60), ss = elapsedSec % 60;
  document.getElementById('stat-xp').textContent = '+' + lessonState.totalXp;
  document.getElementById('stat-correct').textContent = `${lessonState.correctCount}/${lessonState.questions.length}`;
  document.getElementById('stat-time').textContent = `${mm}:${ss.toString().padStart(2,'0')}`;
  document.getElementById('stat-hearts').textContent = '❤️'.repeat(lessonState.hearts) + '🤍'.repeat(MAX_HEARTS - lessonState.hearts);
  const pct = Math.round((lessonState.correctCount / lessonState.questions.length) * 100);
  document.getElementById('completion-sub').textContent = `Dominaste el ${pct}% de esta lección. ¡Increíble trabajo!`;
  completionModal.classList.add('open');
}

function closeLesson(resetState = true) {
  lessonModal.classList.remove('open');
  document.body.style.overflow = '';
  feedbackEl.className = 'lesson-feedback';
  if (resetState) { lessonState.phase = 'input'; }
}

function showLoseModal() {
  closeLesson(false);
  loseModal.classList.add('open');
}

document.getElementById('lose-retry').addEventListener('click', () => {
  loseModal.classList.remove('open');
  openLesson(lessonState.themeKey);
});
document.getElementById('lose-exit').addEventListener('click', () => {
  loseModal.classList.remove('open');
});

document.getElementById('completion-continue').addEventListener('click', () => {
  completionModal.classList.remove('open');
  progress.done[lessonState.themeKey] = true;
  progress.xp = (progress.xp || 0) + lessonState.totalXp;
  registerDayStreak();
  saveProgress();
  floatXP(lessonState.totalXp);
  buildPath();
});

audioBtnEl.addEventListener('click', () => {
  const text = phraseEl.textContent;
  if (!text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US'; utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
});

btnCheck.addEventListener('click', () => {
  if (lessonState.phase === 'input' && !hasAnswerReady()) return;
  checkAnswer();
});
btnSkip.addEventListener('click', skipQuestion);
lessonClose.addEventListener('click', () => closeLesson());

/* ----------------------------------------------------------------
   PESTAÑAS DE NIVEL
---------------------------------------------------------------- */
document.querySelectorAll('.level-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.level-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.level-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tab.dataset.level}`)?.classList.add('active');
  });
});

/* ----------------------------------------------------------------
   TOAST
---------------------------------------------------------------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg, type = '', ms = 2400) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className = 'toast' + (type ? ` ${type}` : '') + ' show';
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

/* ----------------------------------------------------------------
   XP FLOAT
---------------------------------------------------------------- */
function floatXP(xp) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${xp} XP 🌟`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ----------------------------------------------------------------
   BOOT
---------------------------------------------------------------- */
buildPath();

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('nav-menu');
  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
      }
    });
  }
});