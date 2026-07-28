// ============================================
//  EGGLISH – JUEGOS  |  juegos.js
// ============================================

// ══════════════════════════════════════════
//  DATA — PREGUNTAS POR NIVEL Y JUEGO
// ══════════════════════════════════════════

const DATA = {
  A1: {
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
  },
  A2: {
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
  }
};

// ══════════════════════════════════════════
//  GAME CATALOGUE
// ══════════════════════════════════════════

const GAMES = [
  { id:"mc",        levels:["A1","A2","B1"], icon:"🎯", title:"Opción Múltiple",  desc:"Lee la pregunta y elige la respuesta correcta entre 4 opciones.",    screen:"screen-mc" },
  { id:"match",     levels:["A1"],           icon:"🔗", title:"Conecta Palabras", desc:"Empareja cada palabra en español con su traducción en inglés.",        screen:"screen-match" },
  { id:"fill",      levels:["A2","B1"],      icon:"✏️", title:"Completa la Frase",desc:"Arrastra las palabras correctas para completar la oración.",           screen:"screen-fill" },
  { id:"listen",    levels:["A1","A2"],      icon:"🔊", title:"Escucha y Elige",  desc:"Escucha la palabra (texto a voz) y elige su significado en español.", screen:"screen-listen" },
  { id:"translate", levels:["B1"],           icon:"🌐", title:"Traduce la Frase", desc:"Ordena las palabras para traducir la oración correctamente al inglés.",screen:"screen-translate" },
];

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

// Fill / translate state
let fillData      = [];
let translateData = [];
let fillAnswers   = [];
let fillCurrent   = 0;

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById(id);
  s.classList.add('active');
  document.getElementById('main-footer').style.display = (id === 'screen-levels') ? '' : 'none';
  window.scrollTo(0,0);
}

function goBack() { showScreen('screen-levels'); }
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
//  START GAME
// ══════════════════════════════════════════

function startGame(gameId, level) {
  currentGame  = gameId;
  currentLevel = level;
  currentQ     = 0;
  score        = 0;

  if (gameId === 'mc')        startMC(level);
  else if (gameId === 'match')startMatch(level);
  else if (gameId === 'fill') startFill(level);
  else if (gameId === 'listen')startListen(level);
  else if (gameId === 'translate') startTranslate(level);
}

// ══════════════════════════════════════════
//  GAME 1: MULTIPLE CHOICE
// ══════════════════════════════════════════

function startMC(level) {
  const qs = shuffle([...DATA[level].mc]).slice(0,5);
  DATA._mcSession = qs;
  totalQ = qs.length;
  document.getElementById('mc-level-tag').textContent = level;
  document.getElementById('mc-score').textContent = 0;
  renderMC();
  showScreen('screen-mc');
}

function renderMC() {
  const qs = DATA._mcSession;
  const q  = qs[currentQ];
  document.getElementById('mc-q-label').textContent = `Pregunta ${currentQ+1}`;
  document.getElementById('mc-q-total').textContent = `de ${totalQ}`;
  document.getElementById('mc-progress').style.width = `${((currentQ)/totalQ)*100}%`;
  document.getElementById('mc-question').textContent = q.q;

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
}

function handleMC(btn, chosen, correct, grid) {
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
  } else {
    btn.classList.add('wrong','shake');
  }
  showExplain('mc', isCorrect, DATA._mcSession[currentQ]);
}

function nextMC() {
  document.getElementById('mc-explain').classList.remove('show');
  currentQ++;
  if (currentQ < totalQ) renderMC();
  else showResults('Opción Múltiple');
}

// ══════════════════════════════════════════
//  GAME 2: WORD MATCH
// ══════════════════════════════════════════

function startMatch(level) {
  matchPairs    = shuffle([...DATA[level].match]).slice(0,5);
  matchSelected = null;
  matchDone     = 0;
  score         = 0;
  totalQ        = matchPairs.length;
  document.getElementById('match-level-tag').textContent = level;
  document.getElementById('match-score').textContent = 0;
  document.getElementById('match-feedback').textContent = '';

  const esCol = document.getElementById('match-es');
  const enCol = document.getElementById('match-en');
  esCol.innerHTML = '';
  enCol.innerHTML = '';

  const shuffledEn = shuffle(matchPairs.map(p => p.en));

  matchPairs.forEach((pair, i) => {
    const eBtn = makeMatchBtn(pair.es, 'es', i);
    esCol.appendChild(eBtn);
  });
  shuffledEn.forEach((word, i) => {
    const enBtn = makeMatchBtn(word, 'en', i);
    enCol.appendChild(enBtn);
  });
  showScreen('screen-match');
}

function makeMatchBtn(word, lang, idx) {
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
    if (matchDone >= matchPairs.length) setTimeout(() => showResults('Conecta Palabras'), 800);
  } else {
    [a,b].forEach(x => { x.classList.remove('selected'); x.classList.add('wrong'); });
    document.getElementById('match-feedback').textContent = '❌ Inténtalo de nuevo';
    document.getElementById('match-feedback').style.color = '#ff4b4b';
    setTimeout(() => {
      [a,b].forEach(x => x.classList.remove('wrong'));
      document.getElementById('match-feedback').textContent = '';
    }, 700);
  }
  matchSelected = null;
}

// ══════════════════════════════════════════
//  GAME 3: FILL THE BLANK
// ══════════════════════════════════════════

function startFill(level) {
  fillData    = shuffle([...DATA[level].fill]).slice(0,5);
  fillCurrent = 0;
  score       = 0;
  totalQ      = fillData.length;
  document.getElementById('fill-level-tag').textContent = level;
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
  document.getElementById('fill-sentence').textContent = q.sentence;
  document.getElementById('fill-score').textContent = score;

  const bank = document.getElementById('fill-bank');
  bank.innerHTML = '';
  shuffle([...q.bank]).forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = w;
    chip.dataset.word = w;
    chip.onclick = () => addToFillAnswer(chip, q);
    bank.appendChild(chip);
  });

  document.getElementById('fill-answer-row').innerHTML = '';
  document.getElementById('fill-check-btn').disabled = false;
}

function addToFillAnswer(chip, q) {
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
  } else {
    row.style.border = '2.5px solid #ff4b4b';
    row.style.animation = 'none';
    // Show correct answer momentarily
    row.innerHTML = `<span style="color:#ff4b4b;font-weight:800">✗ Respuesta: ${q.ans.join(' ')}</span>`;
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
  else showResults('Completa la Frase');
}

// ══════════════════════════════════════════
//  GAME 4: LISTEN & CHOOSE
// ══════════════════════════════════════════

let listenSession = [];
let isSpeaking    = false;

function startListen(level) {
  listenSession = shuffle([...DATA[level].listen]).slice(0,5);
  currentQ  = 0;
  score     = 0;
  totalQ    = listenSession.length;
  document.getElementById('listen-level-tag').textContent = level;
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
  } else {
    btn.classList.add('shake');
  }
  showExplain('listen', isCorrect, listenSession[currentQ]);
}

function nextListen() {
  document.getElementById('listen-explain').classList.remove('show');
  currentQ++;
  if (currentQ < totalQ) renderListen();
  else showResults('Escucha y Elige');
}

// ══════════════════════════════════════════
//  GAME 5: TRANSLATE
// ══════════════════════════════════════════

let transSession = [];
let transAnswers  = [];
let transCurrent  = 0;

function startTranslate(level) {
  transSession = shuffle([...DATA[level].translate]).slice(0,5);
  transCurrent = 0;
  transAnswers = [];
  score        = 0;
  totalQ       = transSession.length;
  document.getElementById('translate-level-tag').textContent = level;
  document.getElementById('translate-score').textContent = 0;
  renderTranslate();
  showScreen('screen-translate');
}

function renderTranslate() {
  const q = transSession[transCurrent];
  transAnswers = [];
  document.getElementById('translate-q-label').textContent = `Pregunta ${transCurrent+1}`;
  document.getElementById('translate-q-total').textContent = `de ${totalQ}`;
  document.getElementById('translate-progress').style.width = `${(transCurrent/totalQ)*100}%`;
  document.getElementById('translate-sentence').textContent = q.es;
  document.getElementById('translate-score').textContent = score;

  const bank = document.getElementById('translate-bank');
  bank.innerHTML = '';
  shuffle([...q.bank]).forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = w;
    chip.dataset.word = w;
    chip.onclick = () => addToTransAnswer(chip);
    bank.appendChild(chip);
  });

  document.getElementById('translate-answer-row').innerHTML = '';
  document.getElementById('translate-check-btn').disabled = false;
}

function addToTransAnswer(chip) {
  if (chip.classList.contains('used')) return;
  chip.classList.add('used');
  transAnswers.push(chip.dataset.word);

  const row = document.getElementById('translate-answer-row');
  const ac = document.createElement('button');
  ac.className = 'answer-chip';
  ac.textContent = chip.dataset.word;
  ac.onclick = () => {
    transAnswers.splice(transAnswers.indexOf(chip.dataset.word),1);
    ac.remove();
    chip.classList.remove('used');
  };
  row.appendChild(ac);
}

function checkTranslate() {
  const q = transSession[transCurrent];
  const correct = transAnswers.join(' ') === q.ans.join(' ');
  const row = document.getElementById('translate-answer-row');

  if (correct) {
    row.style.border = '2.5px solid #58cc02';
    score += 10;
    document.getElementById('translate-score').textContent = score;
  } else {
    row.style.border = '2.5px solid #ff4b4b';
    row.innerHTML = `<span style="color:#ff4b4b;font-weight:800">✗ Respuesta: ${q.ans.join(' ')}</span>`;
  }
  document.getElementById('translate-check-btn').disabled = true;
  showExplain('translate', correct, q);
}

function nextTranslate() {
  document.getElementById('translate-explain').classList.remove('show');
  const row = document.getElementById('translate-answer-row');
  row.style.border = '2.5px dashed #e5e7eb';
  transCurrent++;
  if (transCurrent < totalQ) renderTranslate();
  else showResults('Traduce la Frase');
}

// ══════════════════════════════════════════
//  RESULTS SCREEN
// ══════════════════════════════════════════

let lastGameName = '';

function showResults(gameName) {
  lastGameName = gameName;
  const maxScore = totalQ * 10;
  const pct = score / maxScore;

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
  if (gameName === 'Escucha y Elige') badges.push({ label:'🔊 Oído fino', color:'#1cb0f6' });
  if (currentLevel === 'B1')          badges.push({ label:'🦅 Nivel B1', color:'#8549ba' });
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

function showExplain(prefix, isCorrect, q) {
  const box    = document.getElementById(prefix + '-explain');
  const result = document.getElementById(prefix + '-explain-result');
  const text   = document.getElementById(prefix + '-explain-text');
  if (!box || !result || !text) return;

  if (isCorrect) {
    result.textContent = '✅ ¡Correcto!';
    result.style.color = '#58cc02';
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

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('nav-menu');

    if (btn && menu) {
        btn.onclick = (e) => {
            e.preventDefault(); // Evita cualquier salto
            e.stopPropagation();
            menu.classList.toggle('active');
            
            // Opcional: Cambia el icono de la hamburguesa a una X
            btn.classList.toggle('is-active');
        };
    }
});