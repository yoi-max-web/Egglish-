// ============================================
//  EGGLISH – JUEGOS  |  juegos.js
//  Parte 3: 7 minijuegos nuevos en B1 + nuevo
//  nivel B2 con sus 7 minijuegos avanzados.
//  Total: 28 minijuegos (7 por nivel: A1, A2,
//  B1, B2), todos construidos sobre los mismos
//  5 "motores" reutilizables (mc, match, fill,
//  listen, order) que comparten la MISMA lógica
//  de puntuación y persistencia (score, totalQ,
//  showResults -> registrarProgreso).
// ============================================

// ══════════════════════════════════════════
//  DATA — PREGUNTAS POR NIVEL Y JUEGO
//  Cada nivel tiene una clave por CADA minijuego
//  (el id del juego en el catálogo GAMES).
// ══════════════════════════════════════════

const DATA = {
  A1: {
    // ── Juegos originales ──
    mc: [
      { q: "¿Cómo se dice 'Huevo' en inglés?",       opts: ["Chicken","Egg","Bird","Feather"],       ans: 1, expl: "'Egg' significa 'huevo' en inglés." },
      { q: "¿Cómo se dice 'Perro' en inglés?",       opts: ["Cat","Horse","Dog","Rabbit"],           ans: 2, expl: "'Dog' es la palabra en inglés para 'perro'." },
      { q: "¿Cómo se dice 'Casa' en inglés?",        opts: ["Car","House","Tree","Door"],            ans: 1, expl: "'House' significa 'casa' en inglés." },
      { q: "¿Cómo se dice 'Agua' en inglés?",        opts: ["Milk","Juice","Fire","Water"],          ans: 3, expl: "'Water' es la traducción de 'agua'." },
      { q: "¿Cómo se dice 'Manzana' en inglés?",     opts: ["Banana","Orange","Apple","Mango"],      ans: 2, expl: "'Apple' significa 'manzana' en inglés." },
    ],
    match: [
      { es:"Gato",   en:"Cat"   },
      { es:"Libro",  en:"Book"  },
      { es:"Rojo",   en:"Red"   },
      { es:"Niño",   en:"Child" },
      { es:"Luna",   en:"Moon"  },
    ],
    listen: [
      { word:"Apple",   opts:["Manzana","Naranja","Uva","Pera"],         ans:0, expl: "'Apple' significa 'manzana'." },
      { word:"Dog",     opts:["Gato","Perro","Pájaro","Pez"],            ans:1, expl: "'Dog' significa 'perro'." },
      { word:"House",   opts:["Carro","Árbol","Casa","Puerta"],          ans:2, expl: "'House' significa 'casa'." },
      { word:"Water",   opts:["Leche","Jugo","Fuego","Agua"],            ans:3, expl: "'Water' significa 'agua'." },
      { word:"Red",     opts:["Azul","Verde","Rojo","Amarillo"],         ans:2, expl: "'Red' significa 'rojo'." },
    ],

    // ── 7 minijuegos NUEVOS Nivel A1 ──

    // 1) Ordenar palabras básicas (motor: order)
    "order-basic": [
      { es:"Ordena: Yo tengo un gato.",        bank:["I","have","a","cat","has","you"],           ans:["I","have","a","cat"],        expl:"'I have a cat' sigue el orden sujeto + verbo + artículo + sustantivo." },
      { es:"Ordena: Ella es mi amiga.",        bank:["She","is","my","friend","are","his"],       ans:["She","is","my","friend"],    expl:"'She is my friend': sujeto + verbo 'to be' + posesivo + sustantivo." },
      { es:"Ordena: Nosotros comemos pan.",    bank:["We","eat","bread","eats","eating","a"],     ans:["We","eat","bread"],          expl:"Con 'we' se usa la forma base del verbo: 'eat'." },
      { es:"Ordena: El sol es amarillo.",      bank:["The","sun","is","yellow","are","blue"],     ans:["The","sun","is","yellow"],   expl:"'The sun is yellow': artículo + sustantivo + verbo + adjetivo." },
      { es:"Ordena: Yo bebo agua todos los días.", bank:["I","drink","water","every","day","drinks","days"], ans:["I","drink","water","every","day"], expl:"Con 'I' se usa 'drink' (forma base)." },
    ],

    // 2) Emparejar vocabulario (motor: match, con emojis)
    "vocab-match": [
      { es:"🍎", en:"Apple" },
      { es:"🐶", en:"Dog"   },
      { es:"📚", en:"Book"  },
      { es:"☀️", en:"Sun"   },
      { es:"🚗", en:"Car"   },
    ],

    // 3) Selección rápida de opuestos (motor: mc, con temporizador)
    opposites: [
      { q:"¿Cuál es el opuesto de 'Big'?",   opts:["Small","Tall","Fast","Happy"],  ans:0, expl:"'Small' (pequeño) es el opuesto de 'Big' (grande)." },
      { q:"¿Cuál es el opuesto de 'Hot'?",   opts:["Warm","Cold","Wet","Dry"],      ans:1, expl:"'Cold' (frío) es el opuesto de 'Hot' (caliente)." },
      { q:"¿Cuál es el opuesto de 'Happy'?", opts:["Sad","Angry","Tired","Excited"],ans:0, expl:"'Sad' (triste) es el opuesto de 'Happy' (feliz)." },
      { q:"¿Cuál es el opuesto de 'Fast'?",  opts:["Slow","Strong","Loud","Old"],   ans:0, expl:"'Slow' (lento) es el opuesto de 'Fast' (rápido)." },
      { q:"¿Cuál es el opuesto de 'Open'?",  opts:["Close","Closed","Empty","Full"],ans:1, expl:"'Closed' (cerrado) es el opuesto de 'Open' (abierto)." },
    ],

    // 4) Completar espacios en blanco simples (motor: fill)
    "fill-basic": [
      { sentence:"I ___ a student.",   bank:["is","am","are","be"],   ans:["am"],  full:"I am a student.",   expl:"Con 'I' se usa 'am'." },
      { sentence:"This is ___ book.",  bank:["a","an","the","some"],  ans:["a"],   full:"This is a book.",   expl:"Se usa 'a' antes de una consonante: 'a book'." },
      { sentence:"She has ___ dog.",   bank:["a","an","the","two"],   ans:["a"],   full:"She has a dog.",    expl:"'A dog' porque 'dog' empieza con consonante." },
      { sentence:"We ___ happy.",      bank:["is","am","are","be"],   ans:["are"], full:"We are happy.",     expl:"Con 'we' se usa 'are'." },
      { sentence:"It is ___ apple.",   bank:["a","an","the","some"],  ans:["an"],  full:"It is an apple.",   expl:"Se usa 'an' antes de una vocal: 'an apple'." },
    ],

    // 5) Identificador de imágenes/conceptos (motor: mc, con emoji grande)
    "image-id": [
      { emoji:"🍌", q:"¿Qué palabra representa este emoji?", opts:["Banana","Grape","Lemon","Melon"], ans:0, expl:"🍌 es 'Banana' en inglés." },
      { emoji:"🐱", q:"¿Qué palabra representa este emoji?", opts:["Dog","Cat","Bird","Fish"],         ans:1, expl:"🐱 es 'Cat' (gato)." },
      { emoji:"🏠", q:"¿Qué palabra representa este emoji?", opts:["Car","Tree","House","Door"],       ans:2, expl:"🏠 es 'House' (casa)." },
      { emoji:"☂️", q:"¿Qué palabra representa este emoji?", opts:["Umbrella","Hat","Coat","Shoe"],    ans:0, expl:"☂️ es 'Umbrella' (paraguas)." },
      { emoji:"🎂", q:"¿Qué palabra representa este emoji?", opts:["Bread","Cake","Pizza","Soup"],     ans:1, expl:"🎂 es 'Cake' (pastel)." },
    ],

    // 6) Escucha activa básica (motor: listen)
    "listen-basic": [
      { word:"Sun",   opts:["Luna","Sol","Estrella","Nube"],        ans:1, expl:"'Sun' significa 'sol'." },
      { word:"Book",  opts:["Mesa","Silla","Libro","Lápiz"],        ans:2, expl:"'Book' significa 'libro'." },
      { word:"Milk",  opts:["Agua","Jugo","Leche","Té"],            ans:2, expl:"'Milk' significa 'leche'." },
      { word:"Chair", opts:["Cama","Silla","Puerta","Ventana"],     ans:1, expl:"'Chair' significa 'silla'." },
      { word:"Shoe",  opts:["Camisa","Pantalón","Zapato","Sombrero"],ans:2, expl:"'Shoe' significa 'zapato'." },
    ],

    // 7) Detector de errores ortográficos sencillos (motor: mc)
    spellcheck: [
      { q:"Encuentra la palabra mal escrita:", opts:["Table","Chiar","Window","Door"],    ans:1, expl:"La forma correcta es 'Chair', no 'Chiar'." },
      { q:"Encuentra la palabra mal escrita:", opts:["Freind","School","Pencil","Garden"],ans:0, expl:"La forma correcta es 'Friend', no 'Freind'." },
      { q:"Encuentra la palabra mal escrita:", opts:["Yellow","Purple","Grean","Orange"], ans:2, expl:"La forma correcta es 'Green', no 'Grean'." },
      { q:"Encuentra la palabra mal escrita:", opts:["Wather","Fire","Earth","Air"],      ans:0, expl:"La forma correcta es 'Water', no 'Wather'." },
      { q:"Encuentra la palabra mal escrita:", opts:["Mother","Fahter","Sister","Brother"],ans:1, expl:"La forma correcta es 'Father', no 'Fahter'." },
    ],
  },

  A2: {
    // ── Juegos originales ──
    mc: [
      { q: "¿Qué significa 'I am hungry'?",           opts: ["Tengo sueño","Tengo frío","Tengo hambre","Estoy cansado"],  ans: 2, expl: "'Hungry' significa 'con hambre', por eso 'I am hungry' es 'Tengo hambre'." },
      { q: "¿Qué significa 'She likes music'?",       opts: ["Él toca música","A ella le gusta la música","Ella odia música","Ella escucha música"], ans: 1, expl: "'She' es 'ella' y 'likes' expresa que le gusta algo." },
      { q: "¿Cuál es el plural de 'child'?",          opts: ["Childs","Childes","Children","Child's"],                    ans: 2, expl: "'Child' tiene un plural irregular: 'children'." },
      { q: "¿Qué significa 'We are going to school'?",opts: ["Venimos de la escuela","Vamos a la escuela","Estamos en la escuela","Nos gusta la escuela"], ans: 1, expl: "'Going to' indica que se dirigen hacia un lugar: 'vamos a'." },
      { q: "¿Cuál es el pasado de 'go'?",             opts: ["Goed","Goes","Going","Went"],                               ans: 3, expl: "'Go' es un verbo irregular; su pasado es 'went'." },
    ],
    fill: [
      { sentence: "She ___ a doctor.", bank: ["am","is","are","be"],    ans: ["is"],   full: "She is a doctor.", expl: "Con 'she' (tercera persona singular) se usa 'is'." },
      { sentence: "They ___ soccer every day.", bank: ["plays","playing","play","played"], ans: ["play"], full: "They play soccer every day.", expl: "Con 'they' (plural) se usa la forma base del verbo: 'play'." },
      { sentence: "I ___ like coffee.", bank: ["doesn't","don't","not","no"],  ans: ["don't"], full: "I don't like coffee.", expl: "Con 'I' se usa 'don't' para negar en presente simple." },
      { sentence: "He ___ to school by bus.", bank: ["go","goes","going","went"], ans: ["goes"], full: "He goes to school by bus.", expl: "Con 'he' se agrega '-es' al verbo: 'goes'." },
      { sentence: "We ___ happy today.", bank: ["is","am","be","are"],   ans: ["are"],  full: "We are happy today.", expl: "Con 'we' (plural) se usa 'are'." },
    ],
    listen: [
      { word:"Breakfast", opts:["Almuerzo","Cena","Desayuno","Merienda"],          ans:2, expl: "'Breakfast' significa 'desayuno'." },
      { word:"Library",   opts:["Banco","Hospital","Parque","Biblioteca"],         ans:3, expl: "'Library' significa 'biblioteca'." },
      { word:"Cloudy",    opts:["Soleado","Nublado","Lluvioso","Nevado"],          ans:1, expl: "'Cloudy' significa 'nublado'." },
      { word:"Bicycle",   opts:["Carro","Moto","Bicicleta","Camión"],              ans:2, expl: "'Bicycle' significa 'bicicleta'." },
      { word:"Yesterday", opts:["Mañana","Hoy","Ayer","Ahora"],                   ans:2, expl: "'Yesterday' significa 'ayer'." },
    ],

    // ── 7 minijuegos NUEVOS Nivel A2 ──

    // 1) Conjugación de verbos en pasado simple (motor: fill)
    "past-simple": [
      { sentence:"Yesterday, I ___ to the park.",     bank:["go","goes","went","going"],           ans:["went"],     full:"Yesterday, I went to the park.",     expl:"'Went' es el pasado simple irregular de 'go'." },
      { sentence:"She ___ her homework last night.",  bank:["finish","finishes","finished","finishing"], ans:["finished"], full:"She finished her homework last night.", expl:"Los verbos regulares agregan '-ed' en pasado: 'finished'." },
      { sentence:"They ___ a movie on Saturday.",     bank:["watch","watches","watched","watching"],ans:["watched"],  full:"They watched a movie on Saturday.",  expl:"'Watched' es el pasado regular de 'watch'." },
      { sentence:"He ___ to the store two hours ago.",bank:["drive","drives","drove","driving"],    ans:["drove"],    full:"He drove to the store two hours ago.",expl:"'Drove' es el pasado irregular de 'drive'." },
      { sentence:"We ___ pizza for dinner last week.",bank:["eat","eats","ate","eating"],           ans:["ate"],      full:"We ate pizza for dinner last week.", expl:"'Ate' es el pasado irregular de 'eat'." },
    ],

    // 2) Organizador de oraciones compuestas (motor: order)
    "compound-order": [
      { es:"Ordena: Estudié mucho, pero reprobé el examen.",     bank:["I","studied","hard,","but","I","failed","the","exam"],           ans:["I","studied","hard,","but","I","failed","the","exam"],           expl:"Se usa 'but' para conectar dos ideas contrastantes." },
      { es:"Ordena: Ella estaba cansada, así que se durmió temprano.", bank:["She","was","tired,","so","she","went","to","bed","early"],   ans:["She","was","tired,","so","she","went","to","bed","early"],        expl:"'So' introduce una consecuencia." },
      { es:"Ordena: Quiero salir, pero está lloviendo.",         bank:["I","want","to","go","out,","but","it","is","raining"],           ans:["I","want","to","go","out,","but","it","is","raining"],           expl:"'But' conecta un deseo con un obstáculo." },
      { es:"Ordena: Él trabaja mucho porque quiere ahorrar dinero.", bank:["He","works","hard","because","he","wants","to","save","money"], ans:["He","works","hard","because","he","wants","to","save","money"], expl:"'Because' introduce una razón." },
      { es:"Ordena: Ella habla inglés y también habla francés.", bank:["She","speaks","English","and","she","also","speaks","French"],   ans:["She","speaks","English","and","she","also","speaks","French"],   expl:"'And' une dos ideas similares." },
    ],

    // 3) Selección de conectores cortos (motor: mc)
    connectors: [
      { q:"Choose the correct connector: 'I was tired, ___ I kept working.'",    opts:["so","but","because","and"],     ans:1, expl:"'But' indica contraste: aunque estaba cansado, siguió trabajando." },
      { q:"Choose the correct connector: 'She studied hard, ___ she passed the exam.'", opts:["although","so","but","or"], ans:1, expl:"'So' introduce una consecuencia lógica." },
      { q:"Choose the correct connector: 'He didn't call ___ he was busy.'",     opts:["because","but","so","and"],     ans:0, expl:"'Because' da la razón de la acción." },
      { q:"Choose the correct connector: 'I like tea ___ coffee.'",              opts:["but","and","so","because"],     ans:1, expl:"'And' une dos elementos similares." },
      { q:"Choose the correct connector: 'It was raining, ___ we stayed home.'", opts:["so","but","or","although"],     ans:0, expl:"'So' expresa la consecuencia de la lluvia." },
    ],

    // 4) Rellenar diálogos (motor: fill, con línea de contexto)
    "dialogue-fill": [
      { context:"A: How are you today?",       sentence:"B: I ___ fine, thank you.",       bank:["am","is","are","be"],         ans:["am"],       full:"B: I am fine, thank you.",       expl:"Con 'I' se usa 'am'." },
      { context:"A: What are you doing?",      sentence:"B: I ___ watching TV.",           bank:["am","is","are","was"],        ans:["am"],       full:"B: I am watching TV.",           expl:"Presente continuo con 'I': 'am watching'." },
      { context:"A: Where is Maria?",          sentence:"B: She ___ at work right now.",   bank:["is","am","are","were"],       ans:["is"],       full:"B: She is at work right now.",   expl:"Con 'she' se usa 'is'." },
      { context:"A: Did you finish the project?", sentence:"B: Yes, I ___ it yesterday.",  bank:["finish","finished","finishes","finishing"], ans:["finished"], full:"B: Yes, I finished it yesterday.", expl:"Pasado simple regular: 'finished'." },
      { context:"A: Do you like pizza?",       sentence:"B: Yes, I ___ it a lot.",         bank:["like","likes","liked","liking"], ans:["like"],    full:"B: Yes, I like it a lot.",        expl:"Con 'I' se usa la forma base: 'like'." },
    ],

    // 5) Categorización gramatical (motor: mc)
    categorize: [
      { q:"¿Qué tipo de palabra es 'quickly'?",   opts:["Sustantivo","Verbo","Adjetivo","Adverbio"], ans:3, expl:"'Quickly' es un adverbio; termina en '-ly' y describe cómo se hace algo." },
      { q:"¿Qué tipo de palabra es 'happiness'?", opts:["Sustantivo","Verbo","Adjetivo","Adverbio"], ans:0, expl:"'Happiness' es un sustantivo abstracto (felicidad)." },
      { q:"¿Qué tipo de palabra es 'run'?",       opts:["Sustantivo","Verbo","Adjetivo","Adverbio"], ans:1, expl:"'Run' funciona como verbo: acción de correr." },
      { q:"¿Qué tipo de palabra es 'beautiful'?", opts:["Sustantivo","Verbo","Adjetivo","Adverbio"], ans:2, expl:"'Beautiful' es un adjetivo: describe a un sustantivo." },
      { q:"¿Qué tipo de palabra es 'carefully'?", opts:["Sustantivo","Verbo","Adjetivo","Adverbio"], ans:3, expl:"'Carefully' es un adverbio de modo." },
    ],

    // 6) Traducción inversa de frases cortas (motor: order, inglés → español)
    "reverse-translate": [
      { es:"Translate to Spanish: 'I am very happy today.'", bank:["Estoy","muy","feliz","hoy","triste","ayer"],        ans:["Estoy","muy","feliz","hoy"],        expl:"'I am very happy today' se traduce como 'Estoy muy feliz hoy'." },
      { es:"Translate to Spanish: 'She works in a hospital.'", bank:["Ella","trabaja","en","un","hospital","escuela"], ans:["Ella","trabaja","en","un","hospital"], expl:"'She works in a hospital' es 'Ella trabaja en un hospital'." },
      { es:"Translate to Spanish: 'We need more time.'",      bank:["Necesitamos","más","tiempo","dinero","menos"],     ans:["Necesitamos","más","tiempo"],       expl:"'We need more time' es 'Necesitamos más tiempo'." },
      { es:"Translate to Spanish: 'He is my best friend.'",   bank:["Él","es","mi","mejor","amigo","hermano"],          ans:["Él","es","mi","mejor","amigo"],     expl:"'He is my best friend' es 'Él es mi mejor amigo'." },
      { es:"Translate to Spanish: 'They live near the beach.'", bank:["Ellos","viven","cerca","de","la","playa","montaña"], ans:["Ellos","viven","cerca","de","la","playa"], expl:"'They live near the beach' es 'Ellos viven cerca de la playa'." },
    ],

    // 7) Completado de frases preposicionales (motor: fill)
    prepositions: [
      { sentence:"The keys are ___ the table.",  bank:["on","in","at","under"], ans:["on"], full:"The keys are on the table.",  expl:"'On' se usa para superficies: 'on the table'." },
      { sentence:"She arrives ___ 8 o'clock.",    bank:["on","in","at","by"],    ans:["at"], full:"She arrives at 8 o'clock.",    expl:"'At' se usa con horas exactas: 'at 8 o'clock'." },
      { sentence:"We live ___ Bogotá.",           bank:["on","in","at","to"],    ans:["in"], full:"We live in Bogotá.",           expl:"'In' se usa con ciudades y países." },
      { sentence:"He is waiting ___ the bus stop.", bank:["at","on","in","for"], ans:["at"], full:"He is waiting at the bus stop.", expl:"'At' se usa para lugares específicos." },
      { sentence:"I will call you ___ Monday.",   bank:["at","in","on","by"],    ans:["on"], full:"I will call you on Monday.",   expl:"'On' se usa con días de la semana." },
    ],
  },

  B1: {
    mc: [
      { q: "Choose the correct sentence:",            opts: ["He don't know the answer","He doesn't knows the answer","He doesn't know the answer","He not know the answer"], ans: 2, expl: "Con 'he' (tercera persona) se usa 'doesn't' + verbo base: 'doesn't know'." },
      { q: "¿Cuál es el condicional de: 'If it rains...'?", opts: ["...I go home","...I will go home","...I went home","...I going home"],  ans: 1, expl: "El primer condicional usa 'will' en la consecuencia: 'if + presente, will + infinitivo'." },
      { q: "What does 'Although' mean?",              opts: ["Además","Por lo tanto","Aunque","Sin embargo"],            ans: 2, expl: "'Although' se traduce como 'aunque', indica contraste." },
      { q: "Choose the correct passive voice:",       opts: ["The cake was ate by him","The cake was eaten by him","The cake is ate by him","The cake were eaten by him"], ans: 1, expl: "La voz pasiva usa 'was/were + participio': 'was eaten', no 'ate'." },
      { q: "What does 'Nevertheless' mean?",         opts: ["Además","Sin embargo","Por eso","Al mismo tiempo"],        ans: 1, expl: "'Nevertheless' significa 'sin embargo'." },
    ],
    translate: [
      { es:"Ella ha vivido aquí por cinco años.",   bank:["She","has","lived","here","for","five","years","ago","since","live"], ans:["She","has","lived","here","for","five","years"], expl: "Se usa el presente perfecto 'has lived' con 'for' para expresar duración." },
      { es:"Ellos estaban comiendo cuando llegué.", bank:["They","were","eating","when","I","arrived","come","was","are","came"], ans:["They","were","eating","when","I","arrived"], expl: "El pasado continuo 'were eating' se interrumpe con el pasado simple 'arrived'." },
      { es:"Si estudias, aprobarás el examen.",     bank:["If","you","study","you","will","pass","the","exam","would","are"],    ans:["If","you","study","you","will","pass","the","exam"], expl: "El primer condicional usa 'if + presente, will + infinitivo'." },
      { es:"El libro fue escrito por ella.",        bank:["The","book","was","written","by","her","she","wrote","is","write"],   ans:["The","book","was","written","by","her"], expl: "Voz pasiva en pasado: 'was written' (fue escrito)." },
      { es:"Me gustaría tomar un café, por favor.", bank:["I","would","like","a","coffee","please","want","will","can","have"],  ans:["I","would","like","a","coffee","please"], expl: "'Would like' es una forma cortés de pedir algo." },
    ],
    fill: [
      { sentence: "By the time she arrived, we ___ already left.", bank:["had","have","has","was"],   ans:["had"],  full:"By the time she arrived, we had already left.", expl: "Se usa el pasado perfecto 'had' para una acción anterior a otra en el pasado." },
      { sentence: "She suggested ___ the movie together.",          bank:["watch","to watch","watching","watched"], ans:["watching"], full:"She suggested watching the movie together.", expl: "Después de 'suggest' se usa el gerundio: 'watching'." },
      { sentence: "He ___ in London for ten years now.",            bank:["lived","lives","has lived","is living"], ans:["has lived"], full:"He has lived in London for ten years now.", expl: "'Has lived' (presente perfecto) expresa una acción que continúa hasta ahora." },
      { sentence: "If I ___ you, I would apologize.",               bank:["am","was","were","had"],   ans:["were"], full:"If I were you, I would apologize.", expl: "En el segundo condicional se usa 'were' para todas las personas." },
      { sentence: "The report must ___ by Monday.",                 bank:["submit","to submit","submitting","be submitted"], ans:["be submitted"], full:"The report must be submitted by Monday.", expl: "Se usa la voz pasiva 'be submitted' después de un modal ('must')." },
    ],

    // ── 7 minijuegos NUEVOS Nivel B1 ──

    // 1) Phrasal verbs en contexto (motor: mc)
    "phrasal-verbs": [
      { q:"Choose the correct meaning: 'She had to give up smoking.'",          opts:["Regalar","Renunciar a algo","Subir algo","Repartir"],                 ans:1, expl:"'Give up' significa 'renunciar a algo'." },
      { q:"What does 'look after' mean in: 'Can you look after my dog?'",       opts:["Buscar","Cuidar de alguien/algo","Mirar hacia atrás","Investigar"],    ans:1, expl:"'Look after' significa 'cuidar de'." },
      { q:"Choose the meaning: 'They put off the meeting until Friday.'",       opts:["Cancelaron","Pospusieron","Empezaron","Terminaron"],                   ans:1, expl:"'Put off' significa 'posponer'." },
      { q:"What does 'run into' mean: 'I ran into an old friend yesterday.'",   opts:["Chocar con","Encontrarse por casualidad","Correr hacia","Escapar de"],ans:1, expl:"'Run into' significa 'encontrarse con alguien por casualidad'." },
      { q:"Choose the meaning: 'He finally figured out the answer.'",          opts:["Olvidó","Descubrió/entendió","Escribió","Preguntó"],                    ans:1, expl:"'Figure out' significa 'descubrir o entender algo'." },
    ],

    // 2) Transformación activa → pasiva (motor: order)
    "passive-transform": [
      { es:"Active: 'The chef cooks the meal.' → Pasiva:",        bank:["The","meal","is","cooked","by","the","chef","was","cook"],        ans:["The","meal","is","cooked","by","the","chef"],        expl:"Presente simple pasivo: 'is cooked'." },
      { es:"Active: 'They built this house in 1990.' → Pasiva:",  bank:["This","house","was","built","in","1990","by","them","is"],        ans:["This","house","was","built","in","1990"],            expl:"Pasado simple pasivo: 'was built'." },
      { es:"Active: 'She will finish the report.' → Pasiva:",     bank:["The","report","will","be","finished","by","her","was","is"],      ans:["The","report","will","be","finished","by","her"],   expl:"Futuro pasivo: 'will be finished'." },
      { es:"Active: 'People speak English worldwide.' → Pasiva:", bank:["English","is","spoken","worldwide","by","people","was","are"],    ans:["English","is","spoken","worldwide"],                 expl:"Presente simple pasivo sin necesidad de agente: 'is spoken'." },
      { es:"Active: 'She has written three books.' → Pasiva:",    bank:["Three","books","have","been","written","by","her","has","was"],   ans:["Three","books","have","been","written","by","her"], expl:"Presente perfecto pasivo: 'have been written'." },
    ],

    // 3) Identificación de condicionales 1 y 2 (motor: mc)
    "conditionals-id": [
      { q:"'If I win the lottery, I will travel the world.' — ¿Qué tipo de condicional es?",   opts:["Primer condicional","Segundo condicional","Cero condicional","Tercer condicional"], ans:0, expl:"Usa 'if + presente, will + infinitivo': primer condicional (posible/futuro real)." },
      { q:"'If I had more money, I would buy a new car.' — ¿Qué tipo de condicional es?",       opts:["Primer condicional","Segundo condicional","Cero condicional","Tercer condicional"], ans:1, expl:"Usa 'if + pasado, would + infinitivo': segundo condicional (hipotético/irreal)." },
      { q:"'If it rains, we cancel the picnic.' — ¿Qué tipo de condicional es?",                opts:["Cero condicional","Primer condicional","Segundo condicional","Tercer condicional"], ans:0, expl:"Cero condicional: verdad general, 'if + presente, presente'." },
      { q:"'If she studied more, she would pass the exam.' — ¿Qué tipo de condicional es?",     opts:["Primer condicional","Cero condicional","Segundo condicional","Tercer condicional"], ans:2, expl:"'If + pasado, would + infinitivo' es segundo condicional." },
      { q:"'If you call me, I will help you.' — ¿Qué tipo de condicional es?",                  opts:["Segundo condicional","Primer condicional","Tercer condicional","Cero condicional"], ans:1, expl:"'If + presente, will + infinitivo' es primer condicional." },
    ],

    // 4) Completado de párrafos (motor: fill, con línea de contexto)
    "paragraph-fill": [
      { context:"Read the paragraph:",           sentence:"Last summer, I ___ to Italy with my family.",         bank:["travel","traveled","traveling","travels"],     ans:["traveled"],   full:"Last summer, I traveled to Italy with my family.",        expl:"Pasado simple regular: 'traveled'." },
      { context:"Continuing the story:",         sentence:"We ___ many beautiful cities during our trip.",       bank:["visit","visited","visiting","visits"],         ans:["visited"],    full:"We visited many beautiful cities during our trip.",       expl:"Pasado simple: 'visited'." },
      { context:"About the food:",               sentence:"The pasta ___ delicious in every restaurant.",        bank:["was","were","is","are"],                       ans:["was"],        full:"The pasta was delicious in every restaurant.",            expl:"'Pasta' es singular, se usa 'was'." },
      { context:"At the end of the trip:",       sentence:"By the time we left, we ___ so many memories.",       bank:["make","made","had made","were making"],       ans:["had made"],   full:"By the time we left, we had made so many memories.",      expl:"Pasado perfecto para una acción completada antes de otra en el pasado." },
      { context:"Reflecting on the experience:", sentence:"I ___ to go back to Italy someday.",                  bank:["hope","hoping","hopes","hoped"],               ans:["hope"],       full:"I hope to go back to Italy someday.",                     expl:"Presente simple con 'I': 'hope'." },
    ],

    // 5) Sinonimia contextual (motor: mc)
    "synonyms-context": [
      { q:"Choose the synonym of 'enormous' in: 'They live in an enormous house.'", opts:["Tiny","Huge","Modern","Old"],          ans:1, expl:"'Enormous' y 'huge' significan 'enorme'." },
      { q:"Choose the synonym of 'assist' in: 'Can you assist me with this task?'", opts:["Help","Stop","Ignore","Watch"],        ans:0, expl:"'Assist' significa 'ayudar', igual que 'help'." },
      { q:"Choose the synonym of 'purchase' in: 'She wants to purchase a new laptop.'", opts:["Sell","Return","Buy","Borrow"],    ans:2, expl:"'Purchase' significa 'comprar', igual que 'buy'." },
      { q:"Choose the synonym of 'furious' in: 'He was furious about the delay.'",  opts:["Happy","Very angry","Confused","Tired"], ans:1, expl:"'Furious' significa 'muy enojado'." },
      { q:"Choose the synonym of 'obtain' in: 'You need to obtain a visa.'",        opts:["Lose","Get","Cancel","Send"],          ans:1, expl:"'Obtain' significa 'obtener/conseguir', igual que 'get'." },
    ],

    // 6) Tiempos perfectos vs simples (motor: fill)
    "perfect-vs-simple": [
      { sentence:"I ___ my homework already.",             bank:["did","have done","was doing","do"],       ans:["have done"], full:"I have done my homework already.",       expl:"'Already' se usa con presente perfecto: 'have done'." },
      { sentence:"She ___ to Paris last year.",             bank:["has gone","went","have gone","goes"],     ans:["went"],       full:"She went to Paris last year.",           expl:"'Last year' indica pasado simple: 'went'." },
      { sentence:"We ___ here since 2015.",                 bank:["lived","live","have lived","were living"], ans:["have lived"], full:"We have lived here since 2015.",          expl:"'Since' se usa con presente perfecto: 'have lived'." },
      { sentence:"He ___ the movie yesterday.",             bank:["has watched","watched","have watched","watches"], ans:["watched"], full:"He watched the movie yesterday.",       expl:"'Yesterday' requiere pasado simple: 'watched'." },
      { sentence:"They ___ never tried sushi before.",      bank:["did","have","was","do"],                  ans:["have"],       full:"They have never tried sushi before.",    expl:"'Never...before' se usa con presente perfecto: 'have never tried'." },
    ],

    // 7) Corrección de errores de coherencia (motor: mc)
    "coherence-errors": [
      { q:"¿Cuál oración NO encaja en el párrafo? 'I love cooking. I make pasta every week. My car is red. I also enjoy baking bread.'",              opts:["I love cooking.","I make pasta every week.","My car is red.","I also enjoy baking bread."],                ans:2, expl:"'My car is red' no tiene relación con el tema de cocinar." },
      { q:"¿Cuál oración rompe la coherencia? 'She studies every night. She wants to pass her exams. The weather is nice today. Her grades have improved.'", opts:["She studies every night.","She wants to pass her exams.","The weather is nice today.","Her grades have improved."], ans:2, expl:"'The weather is nice today' no se relaciona con el tema de estudiar." },
      { q:"¿Cuál oración es incoherente? 'He plays football on weekends. He trains every day. Bananas are yellow. He wants to join a professional team.'",  opts:["He plays football on weekends.","He trains every day.","Bananas are yellow.","He wants to join a professional team."], ans:2, expl:"'Bananas are yellow' no tiene relación con el fútbol." },
      { q:"¿Cuál oración no pertenece al párrafo? 'The company launched a new product. Sales increased quickly. The office has blue walls. Customers love the design.'", opts:["The company launched a new product.","Sales increased quickly.","The office has blue walls.","Customers love the design."], ans:2, expl:"'The office has blue walls' no se relaciona con el lanzamiento del producto." },
      { q:"¿Cuál oración rompe la coherencia del texto? 'I woke up early. I made breakfast. The moon is far from Earth. Then I went to work.'", opts:["I woke up early.","I made breakfast.","The moon is far from Earth.","Then I went to work."], ans:2, expl:"'The moon is far from Earth' no encaja en la rutina matutina." },
    ],
  },

  B2: {
    // ── 7 minijuegos Nivel B2 ──

    // 1) Oraciones subordinadas complejas (motor: order)
    "subordinate-clauses": [
      { es:"Ordena: Aunque estaba lloviendo, decidimos salir a caminar.",       bank:["Although","it","was","raining,","we","decided","to","go","for","a","walk"],     ans:["Although","it","was","raining,","we","decided","to","go","for","a","walk"],     expl:"'Although' introduce una cláusula subordinada de contraste." },
      { es:"Ordena: La persona que llamó ayer era mi jefe.",                    bank:["The","person","who","called","yesterday","was","my","boss"],                    ans:["The","person","who","called","yesterday","was","my","boss"],                    expl:"'Who called yesterday' es una cláusula relativa que modifica a 'person'." },
      { es:"Ordena: Ella se fue antes de que terminara la reunión.",            bank:["She","left","before","the","meeting","finished"],                               ans:["She","left","before","the","meeting","finished"],                               expl:"'Before' introduce una cláusula subordinada temporal." },
      { es:"Ordena: Como no tenía dinero, no pudo comprar el boleto.",          bank:["Since","he","didn't","have","money,","he","couldn't","buy","the","ticket"],     ans:["Since","he","didn't","have","money,","he","couldn't","buy","the","ticket"],     expl:"'Since' introduce una cláusula subordinada de causa." },
      { es:"Ordena: Aunque no lo dijo, sabíamos que estaba preocupado.",        bank:["Even","though","he","didn't","say","it,","we","knew","he","was","worried"],    ans:["Even","though","he","didn't","say","it,","we","knew","he","was","worried"],     expl:"'Even though' introduce una cláusula subordinada concesiva." },
    ],

    // 2) Modales de deducción pasada (motor: mc)
    "past-modals": [
      { q:"'The lights were off. She ___ home already.' Choose the correct modal of deduction:",  opts:["must have gone","must go","should go","can go"],      ans:0, expl:"'Must have gone' expresa una deducción lógica fuerte sobre el pasado." },
      { q:"'He looks tired. He ___ all night.' Choose the correct modal:",                          opts:["might work","must have worked","should work","can work"], ans:1, expl:"'Must have worked' indica una deducción fuerte sobre una acción pasada." },
      { q:"'She's not answering. She ___ her phone at home.' Choose the correct modal:",            opts:["might have left","must leave","should leave","can leave"], ans:0, expl:"'Might have left' expresa una posibilidad sobre el pasado." },
      { q:"'There's no way he passed; he ___ studied at all.' Choose the correct modal:",           opts:["can't have","mustn't have","shouldn't have","couldn't"],  ans:0, expl:"'Can't have studied' expresa certeza negativa sobre el pasado." },
      { q:"'The ground is wet. It ___ last night.' Choose the correct modal:",                      opts:["must rain","must have rained","should have rained","can rain"], ans:1, expl:"'Must have rained' es la deducción lógica más fuerte sobre un evento pasado." },
    ],

    // 3) Distinción de registro formal/informal (motor: mc)
    register: [
      { q:"¿Cuál expresión es más FORMAL para pedir ayuda?",                 opts:["Can you help me out?","Could you possibly assist me?","Help me, please!","Gimme a hand?"], ans:1, expl:"'Could you possibly assist me?' usa un registro formal y cortés." },
      { q:"¿Cuál expresión es más INFORMAL para saludar?",                    opts:["Good morning, how are you?","Hey, what's up?","Good day to you.","I hope you are well."], ans:1, expl:"'Hey, what's up?' es un saludo informal y coloquial." },
      { q:"¿Cuál oración pertenece a un registro FORMAL de correo electrónico?", opts:["Hey, quick question for ya.","I am writing to inquire about...","What's going on with the order?","Gimme an update."], ans:1, expl:"'I am writing to inquire about...' es una fórmula formal típica de correos." },
      { q:"¿Cuál expresión es INFORMAL para decir que algo es genial?",       opts:["That is quite excellent.","This is awesome!","That is remarkably impressive.","This is highly satisfactory."], ans:1, expl:"'This is awesome!' es una expresión informal y entusiasta." },
      { q:"¿Cuál es la forma más FORMAL de despedirse en una carta?",         opts:["See ya!","Later!","Yours sincerely,","Bye bye!"], ans:2, expl:"'Yours sincerely,' es una despedida formal usada en cartas y correos." },
    ],

    // 4) Expresiones idiomáticas (motor: mc)
    idioms: [
      { q:"What does 'it's raining cats and dogs' mean?",  opts:["Está lloviendo muy fuerte","Hay animales cayendo","Es un día soleado","Está nevando"], ans:0, expl:"Es una expresión idiomática que significa 'está lloviendo muchísimo'." },
      { q:"What does 'break the ice' mean?",                opts:["Romper algo frágil","Iniciar una conversación en un ambiente tenso","Enfriar una bebida","Terminar una relación"], ans:1, expl:"'Break the ice' significa aliviar la tensión iniciando una conversación." },
      { q:"What does 'once in a blue moon' mean?",          opts:["Muy frecuentemente","Rara vez, casi nunca","Durante la noche","Todos los meses"], ans:1, expl:"Significa que algo ocurre muy raramente." },
      { q:"What does 'hit the books' mean?",                opts:["Tirar los libros","Comprar libros","Estudiar intensamente","Escribir un libro"], ans:2, expl:"'Hit the books' significa 'ponerse a estudiar'." },
      { q:"What does 'under the weather' mean?",            opts:["Sentirse mal/enfermo","Estar bajo la lluvia","Estar muy feliz","Tener mucho trabajo"], ans:0, expl:"'Under the weather' significa sentirse un poco enfermo." },
    ],

    // 5) Conectores discursivos avanzados (motor: fill)
    "discourse-connectors": [
      { sentence:"The project was delayed. ___, the team managed to deliver on time.",  bank:["Furthermore","Nevertheless","Similarly","Meanwhile"],       ans:["Nevertheless"],   full:"The project was delayed. Nevertheless, the team managed to deliver on time.", expl:"'Nevertheless' introduce un contraste con la idea anterior." },
      { sentence:"She is very talented. ___, she lacks confidence.",                    bank:["Moreover","However","Therefore","In addition"],             ans:["However"],        full:"She is very talented. However, she lacks confidence.",                       expl:"'However' marca un contraste." },
      { sentence:"He studied hard. ___, he passed the exam with excellent marks.",      bank:["Consequently","Nonetheless","Whereas","Despite"],           ans:["Consequently"],   full:"He studied hard. Consequently, he passed the exam with excellent marks.",     expl:"'Consequently' introduce una consecuencia lógica." },
      { sentence:"The company cut costs. ___, it invested in new technology.",          bank:["Similarly","Simultaneously","On the other hand","Furthermore"], ans:["Simultaneously"], full:"The company cut costs. Simultaneously, it invested in new technology.",       expl:"'Simultaneously' indica que dos acciones ocurren al mismo tiempo." },
      { sentence:"Many people support the plan. ___, some experts have raised concerns.", bank:["Likewise","Nonetheless","Additionally","As a result"],    ans:["Nonetheless"],    full:"Many people support the plan. Nonetheless, some experts have raised concerns.", expl:"'Nonetheless' introduce una idea contrastante." },
    ],

    // 6) Condicionales mixtos (motor: fill)
    "mixed-conditionals": [
      { sentence:"If I had studied medicine, I ___ a doctor now.",                     bank:["would be","would have been","will be","was"],       ans:["would be"],           full:"If I had studied medicine, I would be a doctor now.",                   expl:"Condicional mixto: pasado hipotético + presente hipotético: 'would be'." },
      { sentence:"If she weren't so shy, she ___ the presentation yesterday.",         bank:["would have given","would give","will give","gives"], ans:["would have given"],   full:"If she weren't so shy, she would have given the presentation yesterday.", expl:"Condición presente + resultado pasado hipotético." },
      { sentence:"If he had taken the job, he ___ in New York now.",                   bank:["would live","would have lived","lives","will live"], ans:["would live"],         full:"If he had taken the job, he would live in New York now.",               expl:"Pasado hipotético (condición) + presente hipotético (resultado)." },
      { sentence:"If I weren't afraid of flying, I ___ to Japan last summer.",         bank:["would have traveled","would travel","will travel","traveled"], ans:["would have traveled"], full:"If I weren't afraid of flying, I would have traveled to Japan last summer.", expl:"Condición presente + resultado pasado hipotético." },
      { sentence:"If they hadn't missed the flight, they ___ here with us right now.", bank:["would be","would have been","will be","are"],       ans:["would be"],           full:"If they hadn't missed the flight, they would be here with us right now.", expl:"Pasado hipotético + presente hipotético: mezcla clásica de condicionales." },
    ],

    // 7) Análisis de matices en oraciones (motor: mc)
    nuance: [
      { q:"¿Cuál es la diferencia de matiz entre 'I think' y 'I'm certain'?",           opts:["Ambas expresan total seguridad","'I think' expresa duda; 'I'm certain' expresa seguridad total","No hay diferencia","'I'm certain' expresa duda"], ans:1, expl:"'I think' suaviza la afirmación; 'I'm certain' es una afirmación segura." },
      { q:"¿Qué matiz aporta 'just' en 'I just wanted to say thank you'?",              opts:["Urgencia","Suaviza la intención, la hace más humilde","Formalidad extrema","Enojo"], ans:1, expl:"'Just' aquí suaviza la afirmación, haciéndola más modesta." },
      { q:"¿Cuál es la diferencia entre 'I could go' y 'I will go'?",                   opts:["Ambas son promesas firmes","'Could' expresa posibilidad; 'will' expresa decisión firme","'Will' expresa duda","No hay diferencia"], ans:1, expl:"'Could' indica posibilidad; 'will' indica una decisión más firme." },
      { q:"¿Qué matiz tiene la palabra 'slightly' en 'The results were slightly better'?", opts:["Un cambio enorme","Un cambio muy pequeño","Ningún cambio","Un cambio negativo"], ans:1, expl:"'Slightly' indica un cambio mínimo o leve." },
      { q:"¿Cuál es el matiz entre 'I suppose so' y 'Absolutely!'?",                    opts:["Ambas expresan entusiasmo","'I suppose so' es tibio/dudoso; 'Absolutely!' es entusiasta y seguro","'Absolutely!' expresa duda","No hay diferencia de matiz"], ans:1, expl:"'I suppose so' muestra aceptación tibia; 'Absolutely!' muestra acuerdo entusiasta." },
    ],
  }
};

// ══════════════════════════════════════════
//  GAME CATALOGUE
//  "engine" indica qué motor genérico renderiza el juego:
//  mc | match | fill | listen | order
// ══════════════════════════════════════════

const GAMES = [
  // ── Juegos originales ──
  { id:"mc",        engine:"mc",     levels:["A1","A2","B1"], icon:"🎯", title:"Opción Múltiple",   desc:"Lee la pregunta y elige la respuesta correcta entre 4 opciones.",              screen:"screen-mc" },
  { id:"match",     engine:"match",  levels:["A1"],           icon:"🔗", title:"Conecta Palabras",  desc:"Empareja cada palabra en español con su traducción en inglés.",                screen:"screen-match", instruction:"Toca una palabra en español y luego su traducción en inglés" },
  { id:"fill",      engine:"fill",   levels:["A2","B1"],      icon:"✏️", title:"Completa la Frase", desc:"Arrastra las palabras correctas para completar la oración.",                   screen:"screen-fill" },
  { id:"listen",    engine:"listen", levels:["A1","A2"],      icon:"🔊", title:"Escucha y Elige",   desc:"Escucha la palabra (texto a voz) y elige su significado en español.",          screen:"screen-listen" },
  { id:"translate", engine:"order",  levels:["B1"],           icon:"🌐", title:"Traduce la Frase",  desc:"Ordena las palabras para traducir la oración correctamente al inglés.",        screen:"screen-order", label:"Traduce al inglés:" },

  // ── 7 minijuegos NUEVOS Nivel A1 ──
  { id:"order-basic",  engine:"order", levels:["A1"], icon:"🧩", title:"Ordena la Frase",         desc:"Arrastra las palabras en el orden correcto para formar una oración básica.", screen:"screen-order", label:"Ordena la frase:" },
  { id:"vocab-match",  engine:"match", levels:["A1"], icon:"🖼️", title:"Emparejar Vocabulario",   desc:"Relaciona cada imagen con la palabra correcta en inglés.",                   screen:"screen-match", instruction:"Toca un emoji y luego su palabra en inglés" },
  { id:"opposites",    engine:"mc",    levels:["A1"], icon:"⚡", title:"Opuestos Rápidos",        desc:"Elige el opuesto correcto antes de que se acabe el tiempo.",                 screen:"screen-mc", timerSec:8 },
  { id:"fill-basic",   engine:"fill",  levels:["A1"], icon:"📝", title:"Completa el Espacio",     desc:"Elige la palabra correcta para llenar el espacio en blanco.",                screen:"screen-fill" },
  { id:"image-id",     engine:"mc",    levels:["A1"], icon:"🔍", title:"Identifica el Concepto",  desc:"Observa el emoji y elige qué palabra en inglés lo representa.",              screen:"screen-mc" },
  { id:"listen-basic", engine:"listen",levels:["A1"], icon:"👂", title:"Escucha Activa",          desc:"Escucha la palabra y elige su significado en español.",                      screen:"screen-listen" },
  { id:"spellcheck",   engine:"mc",    levels:["A1"], icon:"🕵️", title:"Detective Ortográfico",   desc:"Encuentra la palabra que está mal escrita entre las opciones.",              screen:"screen-mc" },

  // ── 7 minijuegos NUEVOS Nivel A2 ──
  { id:"past-simple",       engine:"fill",  levels:["A2"], icon:"⏳", title:"Conjuga en Pasado",       desc:"Completa la oración con la forma correcta del verbo en pasado simple.", screen:"screen-fill" },
  { id:"compound-order",    engine:"order", levels:["A2"], icon:"🔀", title:"Organiza la Oración",     desc:"Ordena las palabras para formar una oración compuesta correcta.",       screen:"screen-order", label:"Ordena la oración:" },
  { id:"connectors",        engine:"mc",    levels:["A2"], icon:"🔗", title:"Elige el Conector",       desc:"Selecciona el conector correcto para unir las ideas.",                  screen:"screen-mc" },
  { id:"dialogue-fill",     engine:"fill",  levels:["A2"], icon:"💬", title:"Completa el Diálogo",     desc:"Lee el diálogo y completa la respuesta que falta.",                     screen:"screen-fill" },
  { id:"categorize",        engine:"mc",    levels:["A2"], icon:"🏷️", title:"Categoriza la Palabra",   desc:"Identifica si la palabra es sustantivo, verbo, adjetivo o adverbio.",   screen:"screen-mc" },
  { id:"reverse-translate", engine:"order", levels:["A2"], icon:"🔄", title:"Traducción Inversa",      desc:"Ordena las palabras en español para traducir la frase al español.",     screen:"screen-order", label:"Traduce al español:" },
  { id:"prepositions",      engine:"fill",  levels:["A2"], icon:"📍", title:"Frases Preposicionales",  desc:"Elige la preposición correcta para completar la frase.",                screen:"screen-fill" },

  // ── 7 minijuegos NUEVOS Nivel B1 ──
  { id:"phrasal-verbs",     engine:"mc",    levels:["B1"], icon:"🧲", title:"Phrasal Verbs en Contexto", desc:"Elige el significado correcto del phrasal verb según el contexto.",        screen:"screen-mc" },
  { id:"passive-transform", engine:"order", levels:["B1"], icon:"🔄", title:"Transforma la Voz",         desc:"Ordena las palabras para transformar la oración activa en voz pasiva.",    screen:"screen-order", label:"Transforma a voz pasiva:" },
  { id:"conditionals-id",   engine:"mc",    levels:["B1"], icon:"🔀", title:"Identifica el Condicional", desc:"Identifica si la oración es primer o segundo condicional.",                screen:"screen-mc" },
  { id:"paragraph-fill",    engine:"fill",  levels:["B1"], icon:"📄", title:"Completa el Párrafo",       desc:"Completa cada oración del párrafo con la palabra o tiempo verbal correcto.", screen:"screen-fill" },
  { id:"synonyms-context",  engine:"mc",    levels:["B1"], icon:"📖", title:"Sinónimos en Contexto",     desc:"Elige el sinónimo correcto de la palabra resaltada según el contexto.",    screen:"screen-mc" },
  { id:"perfect-vs-simple", engine:"fill",  levels:["B1"], icon:"⏱️", title:"Perfecto vs Simple",        desc:"Elige entre tiempos perfectos y simples según las pistas de la oración.",  screen:"screen-fill" },
  { id:"coherence-errors",  engine:"mc",    levels:["B1"], icon:"🧭", title:"Corrige la Coherencia",     desc:"Encuentra la oración que no encaja con la idea general del párrafo.",      screen:"screen-mc" },

  // ── 7 minijuegos Nivel B2 (nuevo nivel avanzado) ──
  { id:"subordinate-clauses", engine:"order", levels:["B2"], icon:"🧩", title:"Oraciones Subordinadas",      desc:"Ordena las palabras para formar oraciones con cláusulas subordinadas complejas.", screen:"screen-order", label:"Ordena la oración subordinada:" },
  { id:"past-modals",         engine:"mc",    levels:["B2"], icon:"🕵️", title:"Modales de Deducción Pasada", desc:"Elige el modal correcto para expresar deducción sobre el pasado.",               screen:"screen-mc" },
  { id:"register",            engine:"mc",    levels:["B2"], icon:"🎩", title:"Registro Formal/Informal",    desc:"Distingue entre expresiones formales e informales en distintos contextos.",       screen:"screen-mc" },
  { id:"idioms",               engine:"mc",    levels:["B2"], icon:"🗝️", title:"Expresiones Idiomáticas",     desc:"Elige el significado correcto de expresiones idiomáticas en inglés.",             screen:"screen-mc" },
  { id:"discourse-connectors", engine:"fill",  levels:["B2"], icon:"🔗", title:"Conectores Discursivos",      desc:"Completa la oración con el conector discursivo avanzado más adecuado.",           screen:"screen-fill" },
  { id:"mixed-conditionals",   engine:"fill",  levels:["B2"], icon:"🌗", title:"Condicionales Mixtos",        desc:"Completa la oración combinando dos tiempos de condicionales distintos.",          screen:"screen-fill" },
  { id:"nuance",               engine:"mc",    levels:["B2"], icon:"🎭", title:"Matices de Significado",      desc:"Identifica la diferencia sutil de significado entre dos expresiones.",            screen:"screen-mc" },
];

function getGameDef(id) {
  return GAMES.find(g => g.id === id);
}

// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════

let currentLevel = "A1";
let currentGame  = null;
let currentQ     = 0;
let score        = 0;
let totalQ       = 0;
let lastScreen   = "screen-levels";

// Match game state
let matchSelected = null;
let matchPairs    = [];
let matchDone     = 0;
let matchGameId   = null;

// Fill state
let fillData      = [];
let fillAnswers   = [];
let fillCurrent   = 0;
let fillGameId    = null;

// Order state (antes "translate")
let orderSession  = [];
let orderAnswers  = [];
let orderCurrent  = 0;
let orderGameId   = null;

// Listen state
let listenSession = [];
let listenGameId  = null;
let isSpeaking    = false;

// MC state
let mcSession        = [];
let mcTimerInterval   = null;
let mcTimerRemaining  = 0;

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById(id);
  if (!s) { console.warn(`showScreen: no existe #${id}`); return; }
  s.classList.add('active');
  // 🩹 Defensivo: si el footer no existe (o cambia de id en el futuro),
  // ya no rompe toda la función a mitad de camino — antes esto detenía
  // en seco showResults() y por eso el progreso nunca llegaba a guardarse.
  const footer = document.getElementById('main-footer');
  if (footer) footer.style.display = (id === 'screen-levels') ? '' : 'none';
  window.scrollTo(0,0);
}

function goBack() {
  clearInterval(mcTimerInterval);
  showScreen('screen-levels');
}
function goLevels(){ showScreen('screen-levels'); }

// ══════════════════════════════════════════
//  BUILD GAME SELECTOR
// ══════════════════════════════════════════

function buildGrid(level) {
  const grid = document.getElementById('games-grid');
  grid.innerHTML = '';
  const available = GAMES.filter(g => g.levels.includes(level));
  available.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card-sel';
    card.innerHTML = `
      <div class="game-card-icon">${g.icon}</div>
      <div>
        <div class="game-card-title">${g.title}</div>
        <span class="game-card-badge badge-${level}">${level}</span>
      </div>
      <div class="game-card-desc">${g.desc}</div>
      <button class="btn-play btn-${level}" onclick="startGame('${g.id}','${level}')">▶ Jugar</button>
    `;
    grid.appendChild(card);
  });
}

// Level tabs
document.querySelectorAll('.level-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.level-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    buildGrid(currentLevel);
  });
});

// ══════════════════════════════════════════
//  START GAME  (despachador genérico)
// ══════════════════════════════════════════

function startGame(gameId, level) {
  const def = getGameDef(gameId);
  if (!def) { console.warn(`startGame: juego desconocido "${gameId}"`); return; }
  if (!DATA[level] || !DATA[level][gameId]) { console.warn(`startGame: sin datos para "${gameId}" en nivel "${level}"`); return; }

  currentGame  = gameId;
  currentLevel = level;
  currentQ     = 0;
  score        = 0;

  switch (def.engine) {
    case 'mc':     startMC(gameId, level);     break;
    case 'match':  startMatch(gameId, level);  break;
    case 'fill':   startFill(gameId, level);   break;
    case 'listen': startListen(gameId, level); break;
    case 'order':  startOrder(gameId, level);  break;
    default: console.warn(`startGame: motor desconocido "${def.engine}"`);
  }
}

// ══════════════════════════════════════════
//  MOTOR 1: MULTIPLE CHOICE (mc)
//  Usado por: mc, opposites, fill-basic*, image-id,
//  spellcheck, connectors, categorize
//  (*fill-basic usa el motor "fill", no este)
// ══════════════════════════════════════════

function startMC(gameId, level) {
  const def = getGameDef(gameId);
  const qs  = shuffle([...DATA[level][gameId]]).slice(0,5);
  mcSession = qs;
  currentQ  = 0;
  totalQ    = qs.length;
  document.getElementById('mc-level-tag').textContent = level;
  document.getElementById('mc-game-name').textContent = `${def.icon} ${def.title}`;
  document.getElementById('mc-score').textContent = 0;
  renderMC();
  showScreen('screen-mc');
}

function renderMC() {
  const def = getGameDef(currentGame);
  const q   = mcSession[currentQ];
  document.getElementById('mc-q-label').textContent = `Pregunta ${currentQ+1}`;
  document.getElementById('mc-q-total').textContent = `de ${totalQ}`;
  document.getElementById('mc-progress').style.width = `${(currentQ/totalQ)*100}%`;
  document.getElementById('mc-question').textContent = q.q;

  // Soporte de emoji grande en lugar de la mascota (para "image-id")
  const mascotImg = document.getElementById('mc-mascot-img');
  const emojiSpan = document.getElementById('mc-emoji');
  if (q.emoji) {
    mascotImg.style.display = 'none';
    emojiSpan.style.display = '';
    emojiSpan.textContent   = q.emoji;
  } else {
    mascotImg.style.display = '';
    emojiSpan.style.display = 'none';
  }

  const grid = document.getElementById('mc-options');
  grid.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => handleMC(btn, i, q.ans, grid);
    grid.appendChild(btn);
  });
  document.getElementById('mc-score').textContent = score;

  // Temporizador opcional (p.ej. "Opuestos Rápidos")
  const timerEl = document.getElementById('mc-timer');
  clearInterval(mcTimerInterval);
  if (def && def.timerSec) {
    timerEl.style.display = '';
    timerEl.classList.remove('urgent');
    mcTimerRemaining = def.timerSec;
    timerEl.textContent = `⏱ ${mcTimerRemaining}`;
    mcTimerInterval = setInterval(() => {
      mcTimerRemaining--;
      timerEl.textContent = `⏱ ${mcTimerRemaining}`;
      if (mcTimerRemaining <= 3) timerEl.classList.add('urgent');
      if (mcTimerRemaining <= 0) {
        clearInterval(mcTimerInterval);
        handleMCTimeout(grid, q);
      }
    }, 1000);
  } else {
    timerEl.style.display = 'none';
  }
}

function handleMCTimeout(grid, q) {
  grid.querySelectorAll('.option-btn').forEach((b,i) => {
    b.disabled = true;
    if (i === q.ans) b.classList.add('correct');
  });
  if (window.SoundManager) SoundManager.playWrong();
  showExplain('mc', false, q, true);
}

function handleMC(btn, chosen, correct, grid) {
  clearInterval(mcTimerInterval);
  grid.querySelectorAll('.option-btn').forEach((b,i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
  });
  const isCorrect = chosen === correct;
  if (isCorrect) {
    score += 10;
    document.getElementById('mc-score').textContent = score;
    btn.classList.add('correct');
    if (window.SoundManager) SoundManager.playCorrect();
  } else {
    btn.classList.add('wrong','shake');
    if (window.SoundManager) SoundManager.playWrong();
  }
  showExplain('mc', isCorrect, mcSession[currentQ]);
}

function nextMC() {
  clearInterval(mcTimerInterval);
  document.getElementById('mc-explain').classList.remove('show');
  currentQ++;
  if (currentQ < totalQ) renderMC();
  else showResults(getGameDef(currentGame).title);
}

// ══════════════════════════════════════════
//  MOTOR 2: WORD MATCH (match)
//  Usado por: match, vocab-match
// ══════════════════════════════════════════

function startMatch(gameId, level) {
  const def     = getGameDef(gameId);
  matchGameId   = gameId;
  matchPairs    = shuffle([...DATA[level][gameId]]).slice(0,5);
  matchSelected = null;
  matchDone     = 0;
  score         = 0;
  totalQ        = matchPairs.length;
  document.getElementById('match-level-tag').textContent = level;
  document.getElementById('match-game-name').textContent = `${def.icon} ${def.title}`;
  document.getElementById('match-instruction-text').textContent = def.instruction || 'Toca un elemento y luego su pareja correcta';
  document.getElementById('match-score').textContent = 0;
  document.getElementById('match-feedback').textContent = '';

  const esCol = document.getElementById('match-es');
  const enCol = document.getElementById('match-en');
  esCol.innerHTML = '';
  enCol.innerHTML = '';

  const shuffledEn = shuffle(matchPairs.map(p => p.en));

  matchPairs.forEach((pair) => {
    const eBtn = makeMatchBtn(pair.es, 'es');
    esCol.appendChild(eBtn);
  });
  shuffledEn.forEach((word) => {
    const enBtn = makeMatchBtn(word, 'en');
    enCol.appendChild(enBtn);
  });
  showScreen('screen-match');
}

function makeMatchBtn(word, lang) {
  const btn = document.createElement('button');
  btn.className = 'match-btn';
  btn.textContent = word;
  btn.dataset.lang = lang;
  btn.dataset.word = word;
  btn.onclick = () => handleMatch(btn);
  return btn;
}

function handleMatch(btn) {
  if (btn.classList.contains('correct')) return;

  if (!matchSelected) {
    document.querySelectorAll('.match-btn.selected').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    matchSelected = btn;
    return;
  }
  if (matchSelected === btn) {
    btn.classList.remove('selected');
    matchSelected = null;
    return;
  }

  // Need one from each column
  const a = matchSelected, b = btn;
  if (a.dataset.lang === b.dataset.lang) {
    a.classList.remove('selected');
    b.classList.add('selected');
    matchSelected = b;
    return;
  }

  const esWord = a.dataset.lang === 'es' ? a.dataset.word : b.dataset.word;
  const enWord = a.dataset.lang === 'en' ? a.dataset.word : b.dataset.word;
  const correct = matchPairs.find(p => p.es === esWord && p.en === enWord);

  if (correct) {
    [a,b].forEach(x => { x.classList.remove('selected'); x.classList.add('correct'); });
    score += 10;
    matchDone++;
    document.getElementById('match-score').textContent = score;
    document.getElementById('match-feedback').textContent = '✅ ¡Correcto!';
    document.getElementById('match-feedback').style.color = '#58cc02';
    if (window.SoundManager) SoundManager.playCorrect();
    if (matchDone >= matchPairs.length) setTimeout(() => showResults(getGameDef(matchGameId).title), 800);
  } else {
    [a,b].forEach(x => { x.classList.remove('selected'); x.classList.add('wrong'); });
    document.getElementById('match-feedback').textContent = '❌ Inténtalo de nuevo';
    document.getElementById('match-feedback').style.color = '#ff4b4b';
    if (window.SoundManager) SoundManager.playWrong();
    setTimeout(() => {
      [a,b].forEach(x => x.classList.remove('wrong'));
      document.getElementById('match-feedback').textContent = '';
    }, 700);
  }
  matchSelected = null;
}

// ══════════════════════════════════════════
//  MOTOR 3: FILL THE BLANK (fill)
//  Usado por: fill, fill-basic, past-simple,
//  dialogue-fill, prepositions
// ══════════════════════════════════════════

function startFill(gameId, level) {
  const def   = getGameDef(gameId);
  fillGameId  = gameId;
  fillData    = shuffle([...DATA[level][gameId]]).slice(0,5);
  fillCurrent = 0;
  score       = 0;
  totalQ      = fillData.length;
  document.getElementById('fill-level-tag').textContent = level;
  document.getElementById('fill-game-name').textContent = `${def.icon} ${def.title}`;
  document.getElementById('fill-score').textContent = 0;
  renderFill();
  showScreen('screen-fill');
}

function renderFill() {
  const q = fillData[fillCurrent];
  fillAnswers = [];
  document.getElementById('fill-q-label').textContent = `Pregunta ${fillCurrent+1}`;
  document.getElementById('fill-q-total').textContent = `de ${totalQ}`;
  document.getElementById('fill-progress').style.width = `${(fillCurrent/totalQ)*100}%`;

  // Línea de contexto opcional (p.ej. diálogos: "A: How are you today?")
  const ctxEl = document.getElementById('fill-context');
  if (q.context) {
    ctxEl.style.display = '';
    ctxEl.textContent = q.context;
  } else {
    ctxEl.style.display = 'none';
    ctxEl.textContent = '';
  }

  document.getElementById('fill-sentence').textContent = q.sentence;
  document.getElementById('fill-score').textContent = score;

  const bank = document.getElementById('fill-bank');
  bank.innerHTML = '';
  shuffle([...q.bank]).forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = w;
    chip.dataset.word = w;
    chip.onclick = () => addToFillAnswer(chip);
    bank.appendChild(chip);
  });

  document.getElementById('fill-answer-row').innerHTML = '';
  document.getElementById('fill-check-btn').disabled = false;
}

function addToFillAnswer(chip) {
  if (chip.classList.contains('used')) return;
  chip.classList.add('used');
  fillAnswers.push(chip.dataset.word);

  const row = document.getElementById('fill-answer-row');
  const ac = document.createElement('button');
  ac.className = 'answer-chip';
  ac.textContent = chip.dataset.word;
  ac.onclick = () => {
    fillAnswers.splice(fillAnswers.indexOf(chip.dataset.word),1);
    ac.remove();
    chip.classList.remove('used');
  };
  row.appendChild(ac);
}

function checkFill() {
  const q = fillData[fillCurrent];
  const correct = fillAnswers.join(' ') === q.ans.join(' ');
  const row = document.getElementById('fill-answer-row');

  if (correct) {
    row.style.border = '2.5px solid #58cc02';
    score += 10;
    document.getElementById('fill-score').textContent = score;
    if (window.SoundManager) SoundManager.playCorrect();
  } else {
    row.style.border = '2.5px solid #ff4b4b';
    row.style.animation = 'none';
    // Show correct answer momentarily
    row.innerHTML = `<span style="color:#ff4b4b;font-weight:800">✗ Respuesta: ${q.ans.join(' ')}</span>`;
    if (window.SoundManager) SoundManager.playWrong();
  }
  document.getElementById('fill-check-btn').disabled = true;
  showExplain('fill', correct, q);
}

function nextFill() {
  document.getElementById('fill-explain').classList.remove('show');
  const row = document.getElementById('fill-answer-row');
  row.style.border = '2.5px dashed #e5e7eb';
  fillCurrent++;
  if (fillCurrent < totalQ) renderFill();
  else showResults(getGameDef(fillGameId).title);
}

// ══════════════════════════════════════════
//  MOTOR 4: LISTEN & CHOOSE (listen)
//  Usado por: listen, listen-basic
// ══════════════════════════════════════════

function startListen(gameId, level) {
  const def     = getGameDef(gameId);
  listenGameId  = gameId;
  listenSession = shuffle([...DATA[level][gameId]]).slice(0,5);
  currentQ  = 0;
  score     = 0;
  totalQ    = listenSession.length;
  document.getElementById('listen-level-tag').textContent = level;
  document.getElementById('listen-game-name').textContent = `${def.icon} ${def.title}`;
  document.getElementById('listen-score').textContent = 0;
  renderListen();
  showScreen('screen-listen');
}

function renderListen() {
  const q = listenSession[currentQ];
  document.getElementById('listen-q-label').textContent = `Pregunta ${currentQ+1}`;
  document.getElementById('listen-q-total').textContent = `de ${totalQ}`;
  document.getElementById('listen-progress').style.width = `${(currentQ/totalQ)*100}%`;
  document.getElementById('listen-score').textContent = score;

  // Speak automatically
  setTimeout(() => speakWord(), 400);

  const grid = document.getElementById('listen-options');
  grid.innerHTML = '';
  q.opts.forEach((opt,i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => handleListen(btn, i, q.ans, grid);
    grid.appendChild(btn);
  });
}

function speakWord() {
  if (!('speechSynthesis' in window)) return;
  const q = listenSession[currentQ];
  const utt = new SpeechSynthesisUtterance(q.word);
  utt.lang = 'en-US'; utt.rate = 0.85;
  const speakBtn = document.getElementById('btn-speak');
  speakBtn.classList.add('playing');
  utt.onend = () => speakBtn.classList.remove('playing');
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}

function handleListen(btn, chosen, correct, grid) {
  grid.querySelectorAll('.option-btn').forEach((b,i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
  });
  const isCorrect = chosen === correct;
  if (isCorrect) {
    score += 10;
    document.getElementById('listen-score').textContent = score;
    if (window.SoundManager) SoundManager.playCorrect();
  } else {
    btn.classList.add('shake');
    if (window.SoundManager) SoundManager.playWrong();
  }
  showExplain('listen', isCorrect, listenSession[currentQ]);
}

function nextListen() {
  document.getElementById('listen-explain').classList.remove('show');
  currentQ++;
  if (currentQ < totalQ) renderListen();
  else showResults(getGameDef(listenGameId).title);
}

// ══════════════════════════════════════════
//  MOTOR 5: ORDER (antes "translate")
//  Usado por: translate, order-basic,
//  compound-order, reverse-translate
// ══════════════════════════════════════════

function startOrder(gameId, level) {
  const def    = getGameDef(gameId);
  orderGameId  = gameId;
  orderSession = shuffle([...DATA[level][gameId]]).slice(0,5);
  orderCurrent = 0;
  orderAnswers = [];
  score        = 0;
  totalQ       = orderSession.length;
  document.getElementById('order-level-tag').textContent = level;
  document.getElementById('order-game-name').textContent = `${def.icon} ${def.title}`;
  document.getElementById('order-label').textContent = def.label || 'Ordena la frase:';
  document.getElementById('order-score').textContent = 0;
  renderOrder();
  showScreen('screen-order');
}

function renderOrder() {
  const q = orderSession[orderCurrent];
  orderAnswers = [];
  document.getElementById('order-q-label').textContent = `Pregunta ${orderCurrent+1}`;
  document.getElementById('order-q-total').textContent = `de ${totalQ}`;
  document.getElementById('order-progress').style.width = `${(orderCurrent/totalQ)*100}%`;
  document.getElementById('order-sentence').textContent = q.es;
  document.getElementById('order-score').textContent = score;

  const bank = document.getElementById('order-bank');
  bank.innerHTML = '';
  shuffle([...q.bank]).forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = w;
    chip.dataset.word = w;
    chip.onclick = () => addToOrderAnswer(chip);
    bank.appendChild(chip);
  });

  document.getElementById('order-answer-row').innerHTML = '';
  document.getElementById('order-check-btn').disabled = false;
}

function addToOrderAnswer(chip) {
  if (chip.classList.contains('used')) return;
  chip.classList.add('used');
  orderAnswers.push(chip.dataset.word);

  const row = document.getElementById('order-answer-row');
  const ac = document.createElement('button');
  ac.className = 'answer-chip';
  ac.textContent = chip.dataset.word;
  ac.onclick = () => {
    orderAnswers.splice(orderAnswers.indexOf(chip.dataset.word),1);
    ac.remove();
    chip.classList.remove('used');
  };
  row.appendChild(ac);
}

function checkOrder() {
  const q = orderSession[orderCurrent];
  const correct = orderAnswers.join(' ') === q.ans.join(' ');
  const row = document.getElementById('order-answer-row');

  if (correct) {
    row.style.border = '2.5px solid #58cc02';
    score += 10;
    document.getElementById('order-score').textContent = score;
    if (window.SoundManager) SoundManager.playCorrect();
  } else {
    row.style.border = '2.5px solid #ff4b4b';
    row.innerHTML = `<span style="color:#ff4b4b;font-weight:800">✗ Respuesta: ${q.ans.join(' ')}</span>`;
    if (window.SoundManager) SoundManager.playWrong();
  }
  document.getElementById('order-check-btn').disabled = true;
  showExplain('order', correct, q);
}

function nextOrder() {
  document.getElementById('order-explain').classList.remove('show');
  const row = document.getElementById('order-answer-row');
  row.style.border = '2.5px dashed #e5e7eb';
  orderCurrent++;
  if (orderCurrent < totalQ) renderOrder();
  else showResults(getGameDef(orderGameId).title);
}

// ══════════════════════════════════════════
//  RESULTS SCREEN
//  (misma lógica de siempre: NO se altera la
//  persistencia — solo cambia qué "gameName"
//  y qué "def" se usan para armar la pantalla)
// ══════════════════════════════════════════

let lastGameName = '';

function showResults(gameName) {
  lastGameName = gameName;
  const maxScore = totalQ * 10;
  const pct = maxScore > 0 ? score / maxScore : 0;
  const def = getGameDef(currentGame);

  if (window.SoundManager) {
    SoundManager.playVictory();
  }

  let title, sub;
  if (pct === 1)       { title = '🎉 ¡Perfecto!';       sub = '¡Respuestas perfectas! Eres increíble.'; }
  else if (pct >= .7)  { title = '🌟 ¡Muy bien!';       sub = 'Casi perfecto, ¡sigue así!'; }
  else if (pct >= .4)  { title = '👍 ¡Buen intento!';   sub = 'Puedes mejorar. ¡Inténtalo de nuevo!'; }
  else                 { title = '💪 ¡Sigue practicando!'; sub = 'La práctica hace al maestro.'; }

  document.getElementById('results-title').textContent    = title;
  document.getElementById('results-subtitle').textContent = sub;
  document.getElementById('results-score-val').textContent = score;

  // Badges
  const badgeContainer = document.getElementById('results-badges');
  badgeContainer.innerHTML = '';
  const badges = [];
  if (score >= 50)         badges.push({ label:'⭐ Estrella',    color:'#f5a623' });
  if (pct === 1)           badges.push({ label:'💯 Perfecto',    color:'#58cc02' });
  if (def && def.engine === 'listen') badges.push({ label:'🔊 Oído fino', color:'#1cb0f6' });
  if (def && def.timerSec && pct === 1) badges.push({ label:'⚡ Reflejos rápidos', color:'#ff9600' });
  if (currentLevel === 'B1')          badges.push({ label:'🦅 Nivel B1', color:'#8549ba' });
  if (currentLevel === 'B2')          badges.push({ label:'🦉 Nivel B2', color:'#e64980' });
  badges.forEach(b => {
    const el = document.createElement('span');
    el.className = 'result-badge';
    el.style.background = b.color;
    el.textContent = b.label;
    badgeContainer.appendChild(el);
  });

  // Confetti
  spawnConfetti();
  showScreen('screen-results');

  // Sincroniza el progreso REAL (puntos y juegos ganados) con Firebase para
  // que el Perfil lo muestre. Solo cuenta lo ganado en esta partida.
  // 🩹 Esta lógica de persistencia NO se modificó: sigue llamando a
  // registrarProgreso() exactamente igual, sin importar cuál de los 19
  // minijuegos (5 originales + 14 nuevos) haya sido jugado.
  const gano = pct >= 0.5;
  // 🩹 Guardamos la promesa en window para que la navbar (link "Perfil")
  // pueda esperarla antes de navegar; si no se espera, perfil.html puede
  // leer Firestore ANTES de que esta escritura termine y mostrar 0.
  window._egglishProgresoPendiente = import('/Secciones/Js/egglish-progreso.js')
    .then(({ registrarProgreso }) => registrarProgreso({
      exp: score,
      campo: gano ? 'juegosGanados' : null,
      incremento: gano ? 1 : 0,
    }))
    .catch((e) => console.warn('No se pudo sincronizar el progreso con Firebase:', e));
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#f5a623','#1cb0f6','#58cc02','#ff4b4b','#8549ba','#ff9600'];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random()*100}%;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      animation-delay: ${Math.random()*1.5}s;
      animation-duration: ${1.5+Math.random()}s;
      width: ${6+Math.random()*8}px;
      height: ${6+Math.random()*8}px;
      border-radius: ${Math.random()>.5?'50%':'3px'};
    `;
    container.appendChild(piece);
  }
}

function playAgain() { startGame(currentGame, currentLevel); }

// ══════════════════════════════════════════
//  EXPLANATION BOX (shown after answering, before advancing)
// ══════════════════════════════════════════

function showExplain(prefix, isCorrect, q, timedOut) {
  const box    = document.getElementById(prefix + '-explain');
  const result = document.getElementById(prefix + '-explain-result');
  const text   = document.getElementById(prefix + '-explain-text');
  if (!box || !result || !text) return;

  if (isCorrect) {
    result.textContent = '✅ ¡Correcto!';
    result.style.color = '#58cc02';
  } else if (timedOut) {
    result.textContent = '⏰ ¡Se acabó el tiempo!';
    result.style.color = '#ff4b4b';
  } else {
    result.textContent = '❌ Respuesta incorrecta.';
    result.style.color = '#ff4b4b';
  }
  text.textContent = q && q.expl ? q.expl : '';
  box.classList.add('show');
}

// ══════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════

function shuffle(arr) {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════

buildGrid('A1');

/*
  El listener del menú hamburguesa (#hamburger-btn / #nav-menu) fue
  eliminado de aquí: el nuevo menú off-canvas (#egg-menu-btn /
  #egg-offcanvas) y el botón de tema se inicializan en un <script>
  propio dentro de juegos.html, justo antes de este archivo.
*/