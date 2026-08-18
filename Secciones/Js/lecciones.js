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

const THEMES = {

  saludos: {
    label: 'Saludos', icon: '👋', xp: 40,
    guide: {
      summary: 'Aprende a saludar, despedirte y presentarte de forma cortés en inglés.',
      rules: ['"Good morning" se usa en la mañana, "Good afternoon" después del mediodía y "Good evening" al anochecer.'],
      examples: ['Hello, how are you?', 'Good afternoon, nice to meet you.', 'See you later!'],
      mistakes: ['Confundir "Good evening" (saludo de noche) con "Good night" (despedida).'],
      tips: ['"Please" y "Thank you" son esenciales en inglés para no sonar grosero.'],
    },
    questions: [
      { type:'order', en:'Good morning!', es:['¡Buenos','días!'], distractors:['noches','tardes','hola','adiós'] },
      { type:'choice', prompt:"Traduce la palabra: 'Hello'", options:['Hola','Adiós','Gracias','Por favor'], answer:0 },
      { type:'blank', sentence:'Good ___, how are you? (Buenas tardes)', answer:'afternoon', options:['afternoon','thanks','sorry','later'] },
      { type:'boolean', statement:"'Goodbye' significa que estás saludando al llegar.", answer:false },
      { type:'order', en:'Good afternoon, nice to meet you.', es:['Buenas','tardes,','mucho','gusto.'], distractors:['noches','días','adiós','hola'] },
      { type:'choice', prompt:"¿Qué significa 'Thank you'?", options:['Gracias','Perdón','De nada','Por favor'], answer:0 },
      { type:'blank', sentence:'See you ___! (¡Hasta luego!)', answer:'later', options:['later','never','here','well'] },
      { type:'boolean', statement:"'Good morning' se utiliza durante la noche.", answer:false },
      { type:'order', en:'See you tomorrow, goodbye!', es:['¡Hasta','mañana,','adiós!'], distractors:['luego','hoy','ayer','bien'] },
      { type:'choice', prompt:"Traduce: 'How are you?'", options:['¿Cómo estás?','¿Qué tal?','¿Dónde estás?','¿Quién eres?'], answer:0 },
    ],
  },

  colores: {
    label: 'Colores', icon: '🎨', xp: 40,
    guide: {
      summary: 'Vocabulario esencial de colores para describir objetos y ropa en inglés.',
      rules: ['En inglés, los colores van ANTES del sustantivo: "red car", no "car red".'],
      examples: ['The sky is blue.', 'I like the color purple.', 'The grass is green.'],
      mistakes: ['Poner el color después del objeto: "car blue" (incorrecto).'],
      tips: ['Asocia cada color con un objeto real en tu casa para memorizarlo.'],
    },
    questions: [
      { type:'order', en:'The sky is blue.', es:['El','cielo','es','azul.'], distractors:['rojo','verde','amarillo','gris'] },
      { type:'choice', prompt:"¿Qué color es 'Red'?", options:['Rojo','Azul','Verde','Amarillo'], answer:0 },
      { type:'blank', sentence:'The grass is ___ (verde).', answer:'green', options:['green','red','blue','black'] },
      { type:'boolean', statement:"'Yellow' es el color típico del sol.", answer:true },
      { type:'order', en:'I like the color purple.', es:['Me','gusta','el','color','morado.'], distractors:['rosa','negro','blanco','gris'] },
      { type:'choice', prompt:"Traduce el color 'Black'", options:['Negro','Blanco','Gris','Café'], answer:0 },
      { type:'blank', sentence:'My favorite car is ___ (blanco).', answer:'white', options:['white','black','red','blue'] },
      { type:'boolean', statement:"La palabra 'Pink' significa rosado.", answer:true },
      { type:'order', en:'The orange fruit is orange.', es:['La','fruta','naranja','es','naranja.'], distractors:['roja','verde','morada','azul'] },
      { type:'choice', prompt:"¿Qué color es 'Gray'?", options:['Gris','Café','Beige','Plateado'], answer:0 },
    ],
  },

  numeros: {
    label: 'Números', icon: '🔢', xp: 45,
    guide: {
      summary: 'Cuenta del 1 al 100 y aprende a hablar de edades y cantidades.',
      rules: ['Para la edad usamos el verbo "to be" (ser/estar): "I am twenty", NO "I have twenty".'],
      examples: ['I have three apples.', 'There are ten students.', 'I am twenty years old.'],
      mistakes: ['Decir "I have 20 years" en lugar de usar el verbo to be.'],
      tips: ['Nota la diferencia entre "-teen" (13-19) y "-ty" (20, 30, 40...).'],
    },
    questions: [
      { type:'order', en:'I have three apples.', es:['Tengo','tres','manzanas.'], distractors:['dos','cuatro','cinco','peras'] },
      { type:'choice', prompt:"Traduce el número 'Seven'", options:['Siete','Ocho','Seis','Nueve'], answer:0 },
      { type:'blank', sentence:'I am ___ years old (veinte).', answer:'twenty', options:['twenty','ten','hundred','thousand'] },
      { type:'boolean', statement:"'Ten' equivale al número 10.", answer:true },
      { type:'order', en:'There are ten students.', es:['Hay','diez','estudiantes.'], distractors:['nueve','once','veinte','profesores'] },
      { type:'choice', prompt:"¿Qué significa 'Hundred'?", options:['Cien','Mil','Diez','Cincuenta'], answer:0 },
      { type:'blank', sentence:'Bus number ___ arrives at eight (cinco).', answer:'five', options:['five','six','seven','eight'] },
      { type:'boolean', statement:"'Thousand' es una cantidad mayor que 'Hundred'.", answer:true },
      { type:'order', en:'I am twenty-five years old.', es:['Tengo','veinticinco','años.'], distractors:['treinta','soy','cuarenta','diez'] },
      { type:'choice', prompt:"¿Qué significa 'First' en un conteo?", options:['Primero','Segundo','Tercero','Último'], answer:0 },
    ]
  },

  animales: {
    label: 'Animales', icon: '🐾', xp: 45,
    guide: {
      summary: 'Nombra animales comunes de granja, mascotas y fauna silvestre.',
      rules: ['En inglés los animales suelen tratarse como objetos a menos que sean tus mascotas.'],
      examples: ['The dog runs fast.', 'Fish live in the water.', 'The cow gives milk.'],
      mistakes: ['Confundir "chicken" (pollo/gallina) con "kitchen" (cocina).'],
      tips: ['Aprende los animales agrupándolos por su hábitat.'],
    },
    questions: [
      { type:'order', en:'The dog runs fast.', es:['El','perro','corre','rápido.'], distractors:['gato','lento','salta','camina'] },
      { type:'choice', prompt:"Traduce 'Cat'", options:['Gato','Perro','Pájaro','Pez'], answer:0 },
      { type:'blank', sentence:'The ___ flies very high (pájaro).', answer:'bird', options:['bird','fish','dog','cat'] },
      { type:'boolean', statement:"Los 'Fish' viven en el agua.", answer:true },
      { type:'order', en:'I have two small dogs.', es:['Tengo','dos','perros','pequeños.'], distractors:['grandes','gatos','tres','uno'] },
      { type:'choice', prompt:"¿Qué animal es 'Horse'?", options:['Caballo','Vaca','Cerdo','Oveja'], answer:0 },
      { type:'blank', sentence:'The ___ gives milk every day (vaca).', answer:'cow', options:['cow','chicken','sheep','goat'] },
      { type:'boolean', statement:"'Chicken' significa pez.", answer:false },
      { type:'order', en:'The bird sings in the morning.', es:['El','pájaro','canta','en','la','mañana.'], distractors:['tarde','noche','perro','ladra'] },
      { type:'choice', prompt:"Traduce 'Rabbit'", options:['Conejo','Ratón','Ardilla','Zorro'], answer:0 },
    ],
  },

  familia: {
    label: 'Familia', icon: '👨‍👩‍👧', xp: 45,
    guide: {
      summary: 'Habla sobre tu familia: padres, hermanos, abuelos y parientes.',
      rules: ['"Parents" significa padres (mamá y papá juntos), no parientes.'],
      examples: ['This is my mother.', 'I love my grandparents.', 'My family is big.'],
      mistakes: ['Usar "fathers" para referirse a ambos padres.'],
      tips: ['Dibuja tu árbol genealógico en inglés.'],
    },
    questions: [
      { type:'order', en:'This is my mother.', es:['Esta','es','mi','madre.'], distractors:['padre','hermana','abuela','tío'] },
      { type:'choice', prompt:"Traduce 'Brother'", options:['Hermano','Hermana','Primo','Tío'], answer:0 },
      { type:'blank', sentence:'My ___ is my father\'s dad (abuelo).', answer:'grandfather', options:['grandfather','uncle','cousin','brother'] },
      { type:'boolean', statement:"'Daughter' se refiere a una hija.", answer:true },
      { type:'order', en:'I love my grandparents.', es:['Amo','a','mis','abuelos.'], distractors:['padres','tíos','primos','hermanos'] },
      { type:'choice', prompt:"¿Qué significa 'Aunt'?", options:['Tía','Tío','Prima','Sobrina'], answer:0 },
      { type:'blank', sentence:'My ___ has three children (tía).', answer:'aunt', options:['aunt','uncle','grandmother','sister'] },
      { type:'boolean', statement:"'Cousin' sirve tanto para primo como para prima.", answer:true },
      { type:'order', en:'My family is big.', es:['Mi','familia','es','grande.'], distractors:['pequeña','feliz','unida','triste'] },
      { type:'choice', prompt:"Traduce 'Son'", options:['Hijo','Hija','Nieto','Sobrino'], answer:0 },
    ],
  },

  comida: {
    label: 'Comida', icon: '🍽️', xp: 45,
    guide: {
      summary: 'Frases útiles para pedir comida y bebida.',
      rules: ['"I would like" es la forma cortés de pedir algo, mejor que "I want".'],
      examples: ['I would like a coffee, please.', 'Can I have the bill?', 'The soup is hot.'],
      mistakes: ['Decir "Give me" al mesero, suena muy grosero.'],
      tips: ['Agrega siempre "please" en tus peticiones.'],
    },
    questions: [
      { type:'order', en:'I would like a coffee, please.', es:['Quisiera','un','café,','por','favor.'], distractors:['té','jugo','agua','dos'] },
      { type:'choice', prompt:"Traduce 'Bread'", options:['Pan','Arroz','Queso','Huevo'], answer:0 },
      { type:'blank', sentence:'I want a glass of cold ___ (agua).', answer:'water', options:['water','milk','juice','coffee'] },
      { type:'boolean', statement:"'The bill' es la cuenta del restaurante.", answer:true },
      { type:'order', en:'The soup is very hot.', es:['La','sopa','está','muy','caliente.'], distractors:['fría','sabrosa','salada','dulce'] },
      { type:'choice', prompt:"¿Qué significa 'Cheese'?", options:['Queso','Leche','Mantequilla','Huevo'], answer:0 },
      { type:'blank', sentence:'Do you have a vegetarian ___? (menú)', answer:'menu', options:['menu','table','plate','dessert'] },
      { type:'boolean', statement:"'Dessert' se come al principio de la comida.", answer:false },
      { type:'order', en:'Can I have the bill, please?', es:['¿Puede','traer','la','cuenta,','por','favor?'], distractors:['mesa','menú','agua','dos'] },
      { type:'choice', prompt:"Traduce 'Delicious'", options:['Delicioso','Feo','Frío','Caro'], answer:0 },
    ],
  },

  pronombres: {
    label: 'Pronombres', icon: '🙋', xp: 50,
    guide: {
      summary: 'Los pronombres personales reemplazan al sujeto.',
      rules: ['"You" sirve para tú, usted y ustedes.', 'En inglés nunca se omite el pronombre.'],
      examples: ['She is my friend.', 'We are students.', 'I love you.'],
      mistakes: ['Omitir el sujeto como en español.'],
      tips: ['Usa "It" obligatoriamente para cosas o clima.'],
    },
    questions: [
      { type:'order', en:'She is my friend.', es:['Ella','es','mi','amiga.'], distractors:['él','ellos','nosotros','tú'] },
      { type:'choice', prompt:"¿Qué pronombre es 'They'?", options:['Ellos / Ellas','Nosotros','Ustedes','Él'], answer:0 },
      { type:'blank', sentence:'___ are students. (Nosotros)', answer:'We', options:['We','They','She','You'] },
      { type:'boolean', statement:"'You' significa tú y ustedes.", answer:true },
      { type:'order', en:'We are happy today.', es:['Nosotros','estamos','felices','hoy.'], distractors:['ellos','tristes','ayer','ella'] },
      { type:'choice', prompt:"Traduce 'He'", options:['Él','Ella','Ellos','Yo'], answer:0 },
      { type:'blank', sentence:'___ has a new dog. (Ella)', answer:'She', options:['She','I','We','They'] },
      { type:'boolean', statement:"'I' se usa para hablar de otra persona.", answer:false },
      { type:'order', en:'I love you.', es:['Yo','te','amo.'], distractors:['mí','ella','él','nosotros'] },
      { type:'choice', prompt:"Pronombre para objetos o clima:", options:['It','He','She','They'], answer:0 },
    ],
  },

  serestar: {
    label: 'Verb To Be', icon: '🧩', xp: 50,
    guide: {
      summary: 'El verbo "To be" significa ser o estar.',
      rules: ['Formas en presente: am, is, are.', 'Se usa para la edad.'],
      examples: ['I am happy.', 'She is a doctor.', 'They are students.'],
      mistakes: ['Decir "You is" en vez de "You are".'],
      tips: ['Relaciona ser/estar con am, is, are inmediatamente.'],
    },
    questions: [
      { type:'order', en:'I am happy.', es:['Yo','estoy','feliz.'], distractors:['es','son','ser','triste'] },
      { type:'choice', prompt:"Selecciona la correcta: 'She ___ a teacher'", options:['is','are','am','be'], answer:0 },
      { type:'blank', sentence:'We ___ tired today. (estamos)', answer:'are', options:['are','am','is','be'] },
      { type:'boolean', statement:"Se usa 'To be' para decir la profesión.", answer:true },
      { type:'order', en:'They are students.', es:['Ellos','son','estudiantes.'], distractors:['es','somos','fue','fueron'] },
      { type:'choice', prompt:"Verbo para decir la edad:", options:['To be','To have','To make','To do'], answer:0 },
      { type:'blank', sentence:'The coffee ___ very hot. (está)', answer:'is', options:['is','are','am','be'] },
      { type:'boolean', statement:"'I am from Colombia' usa el verbo To be.", answer:true },
      { type:'order', en:'You are very kind.', es:['Tú','eres','muy','amable.'], distractors:['es','somos','ser','amables'] },
      { type:'choice', prompt:"Traducción de 'I am tired'", options:['Yo estoy cansado','Yo tengo cansancio','Yo soy cansado','Yo estoy cansada'], answer:0 },
    ],
  },

  presente: {
    label: 'Simple Present', icon: '🔁', xp: 50,
    guide: {
      summary: 'Describe hábitos y rutinas.',
      rules: ['Con he, she o it se agrega "s" al final del verbo.'],
      examples: ['I work every day.', 'She speaks English.', 'They play soccer.'],
      mistakes: ['Olvidar la "s" en tercera persona.'],
      tips: ['Palabras clave: every day, always, usually.'],
    },
    questions: [
      { type:'order', en:'I work every day.', es:['Yo','trabajo','todos','los','días.'], distractors:['trabaja','noches','semanas'] },
      { type:'choice', prompt:"Forma correcta para 'ella trabaja':", options:['She works','She work','She working','She worked'], answer:0 },
      { type:'blank', sentence:'He ___ English every day. (estudia)', answer:'studies', options:['studies','study','studied','studying'] },
      { type:'boolean', statement:"El presente simple describe rutinas.", answer:true },
      { type:'order', en:'They play soccer on weekends.', es:['Ellos','juegan','fútbol','los','fines','de','semana.'], distractors:['juega','baloncesto','lunes'] },
      { type:'choice', prompt:"Traduce 'I like coffee'", options:['Me gusta el café','Me gustaba el café','Gusto café','Quiero café'], answer:0 },
      { type:'blank', sentence:'We ___ in an office. (trabajamos)', answer:'work', options:['work','works','worked','working'] },
      { type:'boolean', statement:"'He eat bread' es gramaticalmente correcto.", answer:false },
      { type:'order', en:'She speaks English very well.', es:['Ella','habla','inglés','muy','bien.'], distractors:['hablo','mal','poco'] },
      { type:'choice', prompt:"Opción correcta con regla de la 's':", options:['He lives in Bogotá','He live in Bogotá','He living','He lived'], answer:0 },
    ],
  },

  rutina: {
    label: 'Rutina Diaria', icon: '⏰', xp: 50,
    guide: {
      summary: 'Actividades diarias desde despertar hasta dormir.',
      rules: ['Usa "at" para las horas.'],
      examples: ['I wake up at seven.', 'She exercises.', 'I go to bed.'],
      mistakes: ['Traducir literalmente verbos reflexivos como "I shower me".'],
      tips: ['Distingue entre wake up y get up.'],
    },
    questions: [
      { type:'order', en:'I wake up at seven.', es:['Me','despierto','a','las','siete.'], distractors:['ocho','duermo','seis'] },
      { type:'choice', prompt:"Traduce 'I have breakfast'", options:['Yo desayuno','Yo almuerzo','Yo como pan','Yo cocino'], answer:0 },
      { type:'blank', sentence:'After work, I ___ home. (camino)', answer:'walk', options:['walk','run','sleep','eat'] },
      { type:'boolean', statement:"'Dinner' es la comida de la mañana.", answer:false },
      { type:'order', en:'I go to bed at ten at night.', es:['Me','voy','a','dormir','a','las','diez','de','la','noche.'], distractors:['mañana','tarde','nueve'] },
      { type:'choice', prompt:"Significado de 'to take a shower'", options:['Ducharse','Dormir','Comer','Vestirse'], answer:0 },
      { type:'blank', sentence:'Every day I ___ the newspaper. (leo)', answer:'read', options:['read','write','cook','clean'] },
      { type:'boolean', statement:"'Get dressed' significa ponerse la ropa.", answer:true },
      { type:'order', en:'She exercises every morning.', es:['Ella','hace','ejercicio','cada','mañana.'], distractors:['tarde','noche','duerme'] },
      { type:'choice', prompt:"Traduce 'My schedule'", options:['Mi horario','Mi reunión','Mi trabajo','Mi casa'], answer:0 },
    ],
  },

  lugares: {
    label: 'Lugares', icon: '📍', xp: 55,
    guide: {
      summary: 'Lugares en la ciudad y direcciones.',
      rules: ['Usa "go to" para indicar desplazamiento a un lugar.'],
      examples: ['The hospital is big.', 'I am going to the pharmacy.', 'I need to go to the bank.'],
      mistakes: ['Decir "I go at the bank" en vez de "to the bank".'],
      tips: ['Aprende primero los lugares de tu entorno.'],
    },
    questions: [
      { type:'order', en:'The hospital is very big.', es:['El','hospital','es','muy','grande.'], distractors:['pequeño','escuela','banco'] },
      { type:'choice', prompt:"Traduce 'Library'", options:['Biblioteca','Farmacia','Banco','Escuela'], answer:0 },
      { type:'blank', sentence:'I am going to the ___ to buy medicine. (farmacia)', answer:'pharmacy', options:['pharmacy','bank','park','museum'] },
      { type:'boolean', statement:"Un parque es un lugar para caminar.", answer:true },
      { type:'order', en:'The museum opens at nine.', es:['El','museo','abre','a','las','nueve.'], distractors:['cierra','diez','ocho'] },
      { type:'choice', prompt:"Significado de 'Airport'", options:['Aeropuerto','Estación','Puerto','Aduana'], answer:0 },
      { type:'blank', sentence:'The train leaves the ___ at six. (estación)', answer:'station', options:['station','airport','plaza','street'] },
      { type:'boolean', statement:"Una library es una tienda para comprar libros.", answer:false },
      { type:'order', en:'I need to go to the bank.', es:['Necesito','ir','al','banco.'], distractors:['hospital','parque','museo'] },
      { type:'choice', prompt:"Traduce 'Church'", options:['Iglesia','Escuela','Oficina','Tienda'], answer:0 },
    ],
  },

  trabajos: {
    label: 'Trabajos', icon: '💼', xp: 55,
    guide: {
      summary: 'Nombra profesiones y ocupaciones.',
      rules: ['Es obligatorio usar "a" o "an" antes de la profesión: "I am a doctor".'],
      examples: ['She is a doctor.', 'He works as an engineer.'],
      mistakes: ['Omitir el artículo y decir "I am doctor".'],
      tips: ['Practica diciendo tu propia profesión u oficio.'],
    },
    questions: [
      { type:'order', en:'She is a doctor.', es:['Ella','es','doctora.'], distractors:['enfermera','maestra','abogada'] },
      { type:'choice', prompt:"Traduce 'Teacher'", options:['Maestro / Maestra','Doctor','Abogado','Ingeniero'], answer:0 },
      { type:'blank', sentence:'My brother is a ___, he works in a hospital. (enfermero)', answer:'nurse', options:['nurse','teacher','chef','pilot'] },
      { type:'boolean', statement:"Un chef cocina en un restaurante.", answer:true },
      { type:'order', en:'He works as an engineer.', es:['Él','trabaja','como','ingeniero.'], distractors:['doctor','maestro','abogado'] },
      { type:'choice', prompt:"Significado de 'Lawyer'", options:['Abogado','Ingeniero','Piloto','Policía'], answer:0 },
      { type:'blank', sentence:'The ___ flies airplanes. (piloto)', answer:'pilot', options:['pilot','chef','police','doctor'] },
      { type:'boolean', statement:"Un police officer se encarga de preparar comida.", answer:false },
      { type:'order', en:'I want to be an engineer.', es:['Quiero','ser','ingeniero.'], distractors:['doctor','maestro','chef'] },
      { type:'choice', prompt:"Traduce 'Nurse'", options:['Enfermera / Enfermero','Doctor','Profesor','Piloto'], answer:0 },
    ],
  },

};

/* ================================================================
   PROGRESO (persistencia local)
================================================================ */
const STORAGE_KEY = 'egglish_lecciones_v3';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done: {}, xp: 0, streak: 0, lastDay: null }; }
  catch (e) { return { done: {}, xp: 0, streak: 0, lastDay: null }; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) {}
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
  ['a1', 'a2', 'b1'].forEach(lvl => {
    LEVELS[lvl].units.forEach(unit => unit.themes.forEach(t => order.push(t)));
  });
  return order;
}

/* ================================================================
   UTILIDADES
================================================================ */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Normaliza texto para comparaciones tolerantes a mayúsculas, espacios
 *  y puntuación, sin perdonar palabras o acentos incorrectos. */
function normalizeText(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[¡!¿?.,;:"']/g, '')
    .trim();
}

/* ================================================================
   REFERENCIAS AL DOM (elementos ya presentes en lecciones.html)
================================================================ */
const pathMain        = document.getElementById('path-main');
const toastEl          = document.getElementById('toast');

const guideModal        = document.getElementById('guide-modal');
const guideTabsEl       = document.getElementById('guide-tabs');
const guideContentEl    = document.getElementById('guide-content');

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
const loseModal        = document.getElementById('lose-modal');

const MAX_HEARTS = 3;

/* ================================================================
   ESTADÍSTICAS / PESTAÑAS DE NIVEL
================================================================ */
function updateStatsBar() {
  const order = flatThemeOrder();
  document.getElementById('stat-streak').textContent = progress.streak || 0;
  document.getElementById('stat-total-xp').textContent = progress.xp || 0;
  document.getElementById('stat-lessons-done').textContent = order.filter(t => progress.done[t]).length;
}

function setupLevelTabs() {
  document.querySelectorAll('.level-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.level-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.level-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${tab.dataset.level}`)?.classList.add('active');
    });
  });
}

/* ================================================================
   MAPA DE LECCIONES (camino tipo Duolingo, con identidad Egglish)
================================================================ */
function buildPath() {
  pathMain.innerHTML = '';
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
        <button type="button" class="unit-header-btn" data-unit-themes="${unit.themes.join(',')}">📖 GUÍA</button>
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
          connector.className = 'node-connector' + (progress.done[unit.themes[i - 1]] ? ' done' : '');
          track.appendChild(connector);
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lesson-node';
        btn.dataset.themeKey = themeKey;

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

        const themeLabel = document.createElement('span');
        themeLabel.className = 'node-theme-label';
        themeLabel.textContent = theme.label;
        btn.appendChild(themeLabel);

        slot.appendChild(btn);
        track.appendChild(slot);
      });

      panel.appendChild(track);
    });

    pathMain.appendChild(panel);
  });

  const activeLevel = document.querySelector('.level-tab.active')?.dataset.level || 'a1';
  document.getElementById(`panel-${activeLevel}`)?.classList.add('active');

  pathMain.querySelectorAll('.lesson-node').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('state-locked')) { showToast('🔒 Completa la lección anterior primero.'); return; }
      openLesson(btn.dataset.themeKey);
    });
  });

  pathMain.querySelectorAll('.unit-header-btn').forEach(btn => {
    btn.addEventListener('click', () => openGuide(btn.dataset.unitThemes.split(',')));
  });

  updateStatsBar();
}

/* ================================================================
   MODAL DE GUÍA
================================================================ */
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
    tab.type = 'button';
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

guideModal.querySelector('#guide-close').addEventListener('click', () => guideModal.classList.remove('open'));
guideModal.addEventListener('click', (e) => { if (e.target === guideModal) guideModal.classList.remove('open'); });

/* ================================================================
   MOTOR DE LECCIÓN — ESTADO CENTRALIZADO
================================================================ */
const lessonState = {
  themeKey: '',
  questions: [],
  qIndex: 0,
  hearts: MAX_HEARTS,
  phase: 'input',          // 'input' | 'correct' | 'wrong'
  selectedChoice: null,
  selectedBool: null,
  filledBlank: null,
  order: { tiles: [], answerOrder: [] }, // solo para preguntas type:'order'
  correctCount: 0,
  totalXp: 0,
  startTime: 0,
};

function openLesson(themeKey) {
  const theme = THEMES[themeKey];
  if (!theme) { showToast('⚠️ Lección no disponible aún.'); return; }

  lessonState.themeKey = themeKey;
  lessonState.questions = shuffleArray(theme.questions).slice(0, 10); // máximo 10 preguntas
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

/* ---- Dispatcher de renderizado por pregunta ---- */
function renderQuestion() {
  const q = lessonState.questions[lessonState.qIndex];
  lessonState.phase = 'input';
  lessonState.selectedChoice = null;
  lessonState.selectedBool = null;
  lessonState.filledBlank = null;
  lessonState.order = { tiles: [], answerOrder: [] };
  feedbackEl.className = 'lesson-feedback';

  const total = lessonState.questions.length;
  progressFill.style.width = (lessonState.qIndex / total * 100) + '%';
  progressLabel.textContent = `${lessonState.qIndex + 1} / ${total}`;

  exerciseArea.innerHTML = '';

  if (q.type === 'order') {
    instructionEl.textContent = 'Ordena las palabras en español';
    charRow.style.display = 'flex';
    hintLabelEl.classList.remove('hidden-el');
    phraseEl.innerHTML = buildHintPhrase(q.en);
    renderOrderExercise(q);
  } else if (q.type === 'choice') {
    instructionEl.textContent = q.prompt;
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

/* ================================================================
   EJERCICIO: ORDENAR PALABRAS
   Arquitectura: cada palabra (incluyendo repetidas) es una "tile" con
   un id único. El banco tiene orden fijo; el área de respuesta guarda
   una lista de ids. Nunca se identifica una tile por su texto, así
   que las palabras repetidas nunca se confunden entre sí.
================================================================ */
function renderOrderExercise(q) {
  const words = shuffleArray([...q.es, ...q.distractors.slice(0, 4)]);
  lessonState.order = {
    tiles: words.map((text, i) => ({ id: `tile-${i}`, text, placed: false })),
    answerOrder: [],
  };

  exerciseArea.innerHTML = `
    <div class="lesson-answer-zone" id="answer-zone"></div>
    <div class="drag-hint">✋ Toca o arrastra las palabras para ordenarlas</div>
    <div class="lesson-wordbank" id="wordbank"></div>
  `;
  renderOrderZones();
}

function tileById(id) {
  return lessonState.order.tiles.find(t => t.id === id);
}

function renderOrderZones() {
  const answerZone = document.getElementById('answer-zone');
  const wordbank = document.getElementById('wordbank');
  if (!answerZone || !wordbank) return;

  answerZone.innerHTML = '';
  lessonState.order.answerOrder.forEach(id => {
    const tile = tileById(id);
    if (tile) answerZone.appendChild(createWordTile(tile, 'answer'));
  });

  wordbank.innerHTML = '';
  lessonState.order.tiles.forEach(tile => {
    wordbank.appendChild(createWordTile(tile, 'bank'));
  });

  updateCheckBtn();
}

function createWordTile(tile, origin) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = origin === 'bank' ? 'bank-word' : 'answer-word';
  btn.textContent = tile.text;
  btn.dataset.tileId = tile.id;
  if (origin === 'bank' && tile.placed) btn.classList.add('placed');
  attachTileDrag(btn, tile.id, origin);
  return btn;
}

/* ---- Drag & drop robusto (Pointer Events = mouse + táctil) ---- */
let dragCtx = null;

function attachTileDrag(el, id, origin) {
  el.addEventListener('pointerdown', (e) => {
    if (lessonState.phase !== 'input') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragCtx = { id, origin, sourceEl: el, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, moved: false, ghost: null };
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  });

  el.addEventListener('pointermove', (e) => {
    if (!dragCtx || dragCtx.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragCtx.startX;
    const dy = e.clientY - dragCtx.startY;
    if (!dragCtx.moved && Math.hypot(dx, dy) > 6) startTileDrag(e);
    if (dragCtx.moved) moveTileDrag(e);
  });

  el.addEventListener('pointerup', (e) => {
    if (!dragCtx || dragCtx.pointerId !== e.pointerId) return;
    endTileDrag(e);
  });

  el.addEventListener('pointercancel', (e) => {
    if (!dragCtx || dragCtx.pointerId !== e.pointerId) return;
    cancelTileDrag();
  });
}

function startTileDrag(e) {
  dragCtx.moved = true;
  const el = dragCtx.sourceEl;
  const rect = el.getBoundingClientRect();
  dragCtx.offsetX = dragCtx.startX - rect.left;
  dragCtx.offsetY = dragCtx.startY - rect.top;

  const ghost = el.cloneNode(true);
  ghost.classList.add('word-tile-ghost');
  ghost.style.width = rect.width + 'px';
  ghost.style.left = rect.left + 'px';
  ghost.style.top = rect.top + 'px';
  document.body.appendChild(ghost);
  dragCtx.ghost = ghost;

  el.style.opacity = '0.25';
  el.style.pointerEvents = 'none';
}

function moveTileDrag(e) {
  if (!dragCtx.ghost) return;
  dragCtx.ghost.style.left = (e.clientX - dragCtx.offsetX) + 'px';
  dragCtx.ghost.style.top = (e.clientY - dragCtx.offsetY) + 'px';

  const answerZone = document.getElementById('answer-zone');
  if (answerZone) {
    const rect = answerZone.getBoundingClientRect();
    const pad = 24;
    const inside = e.clientX >= rect.left - pad && e.clientX <= rect.right + pad &&
                   e.clientY >= rect.top - pad && e.clientY <= rect.bottom + pad;
    answerZone.classList.toggle('drag-over', inside);
  }
}

function endTileDrag(e) {
  if (!dragCtx) return;
  const { id, origin, sourceEl, ghost, moved } = dragCtx;

  if (moved) {
    if (ghost) ghost.remove();
    sourceEl.style.opacity = '';
    sourceEl.style.pointerEvents = '';
    document.getElementById('answer-zone')?.classList.remove('drag-over');
    commitTileDrop(id, e.clientX, e.clientY);
  } else {
    toggleTile(id, origin);
  }
  dragCtx = null;
}

function cancelTileDrag() {
  if (!dragCtx) return;
  if (dragCtx.ghost) dragCtx.ghost.remove();
  if (dragCtx.sourceEl) { dragCtx.sourceEl.style.opacity = ''; dragCtx.sourceEl.style.pointerEvents = ''; }
  document.getElementById('answer-zone')?.classList.remove('drag-over');
  dragCtx = null;
}

function commitTileDrop(id, x, y) {
  if (lessonState.phase !== 'input') { renderOrderZones(); return; }
  const order = lessonState.order;
  const overEl = document.elementFromPoint(x, y);
  const overAnswerZone = overEl && overEl.closest('#answer-zone');
  const overTile = overEl && overEl.closest('.answer-word');

  order.answerOrder = order.answerOrder.filter(tid => tid !== id);

  if (overAnswerZone) {
    let insertIndex = order.answerOrder.length;
    if (overTile && overTile.dataset.tileId !== id) {
      const idx = order.answerOrder.indexOf(overTile.dataset.tileId);
      if (idx !== -1) {
        const rect = overTile.getBoundingClientRect();
        insertIndex = x < rect.left + rect.width / 2 ? idx : idx + 1;
      }
    }
    order.answerOrder.splice(insertIndex, 0, id);
    tileById(id).placed = true;
  } else {
    tileById(id).placed = false;
  }

  renderOrderZones();
}

function toggleTile(id, origin) {
  if (lessonState.phase !== 'input') return;
  const order = lessonState.order;
  const tile = tileById(id);
  if (origin === 'bank') {
    if (tile.placed) return;
    tile.placed = true;
    order.answerOrder.push(id);
  } else {
    tile.placed = false;
    order.answerOrder = order.answerOrder.filter(tid => tid !== id);
  }
  renderOrderZones();
}

/* ================================================================
   EJERCICIO: OPCIÓN MÚLTIPLE
================================================================ */
function renderChoiceExercise(q) {
  const list = document.createElement('div');
  list.className = 'choice-list';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
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

/* ================================================================
   EJERCICIO: COMPLETAR ESPACIO
================================================================ */
function renderBlankExercise(q) {
  const sentenceWrap = document.createElement('div');
  const parts = q.sentence.split('___');
  sentenceWrap.className = 'blank-sentence';
  sentenceWrap.innerHTML = `${parts[0]}<span class="blank-slot" id="blank-slot">?</span>${parts[1] || ''}`;
  exerciseArea.appendChild(sentenceWrap);

  const slot = sentenceWrap.querySelector('#blank-slot');
  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'blank-options';

  shuffleArray(q.options).forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bank-word';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (lessonState.phase !== 'input') return;
      optionsWrap.querySelectorAll('.bank-word').forEach(o => o.classList.remove('placed', 'selected'));
      btn.classList.add('selected');
      lessonState.filledBlank = opt;
      slot.textContent = opt;
      slot.classList.add('filled');
      updateCheckBtn();
    });
    optionsWrap.appendChild(btn);
  });
  exerciseArea.appendChild(optionsWrap);
}

/* ================================================================
   EJERCICIO: VERDADERO / FALSO
================================================================ */
function renderBooleanExercise(q) {
  const statement = document.createElement('div');
  statement.className = 'boolean-statement';
  statement.textContent = q.statement;
  exerciseArea.appendChild(statement);

  const btnWrap = document.createElement('div');
  btnWrap.className = 'boolean-buttons';
  const trueBtn = document.createElement('button');
  trueBtn.type = 'button'; trueBtn.className = 'boolean-btn'; trueBtn.textContent = '✅ Verdadero';
  const falseBtn = document.createElement('button');
  falseBtn.type = 'button'; falseBtn.className = 'boolean-btn'; falseBtn.textContent = '❌ Falso';

  [[trueBtn, true], [falseBtn, false]].forEach(([btn, val]) => {
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

/* ================================================================
   VALIDACIÓN DE RESPUESTAS
================================================================ */
function hasAnswerReady() {
  const q = lessonState.questions[lessonState.qIndex];
  if (q.type === 'order') return lessonState.order.answerOrder.length > 0;
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
    const userAnswer = lessonState.order.answerOrder.map(id => tileById(id).text).join(' ');
    return normalizeText(userAnswer) === normalizeText(q.es.join(' '));
  }
  if (q.type === 'choice') return lessonState.selectedChoice === q.answer;
  if (q.type === 'blank') return normalizeText(lessonState.filledBlank || '') === normalizeText(q.answer);
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

/* ================================================================
   FLUJO: COMPROBAR / AVANZAR / OMITIR / TERMINAR
================================================================ */
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
    setTimeout(() => showLoseModal(), 1100);
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
  document.getElementById('stat-time').textContent = `${mm}:${ss.toString().padStart(2, '0')}`;
  document.getElementById('stat-hearts').textContent = '❤️'.repeat(lessonState.hearts) + '🤍'.repeat(MAX_HEARTS - lessonState.hearts);
  const pct = Math.round((lessonState.correctCount / lessonState.questions.length) * 100);
  document.getElementById('completion-sub').textContent = `Dominaste el ${pct}% de esta lección. ¡Increíble trabajo!`;
  completionModal.classList.add('open');
}

function closeLesson(resetState = true) {
  cancelTileDrag();
  lessonModal.classList.remove('open');
  document.body.style.overflow = '';
  feedbackEl.className = 'lesson-feedback';
  if (resetState) lessonState.phase = 'input';
}

function showLoseModal() {
  closeLesson(false);
  loseModal.classList.add('open');
}

/* ================================================================
   EVENTOS DE LA LECCIÓN (un único listener por control, sin duplicados)
================================================================ */
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
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
});

btnCheck.addEventListener('click', () => {
  if (lessonState.phase === 'input' && !hasAnswerReady()) return;
  checkAnswer();
});
btnSkip.addEventListener('click', skipQuestion);
lessonClose.addEventListener('click', () => closeLesson());
lessonModal.addEventListener('click', (e) => { if (e.target === lessonModal) closeLesson(); });

/* ================================================================
   TOAST Y XP FLOTANTE
================================================================ */
let toastTimer;
function showToast(msg, type = '', ms = 2400) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.className = 'toast' + (type ? ` ${type}` : '') + ' show';
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

function floatXP(xp) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = `+${xp} XP 🌟`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ================================================================
   ARRANQUE
================================================================ */
setupLevelTabs();
buildPath();