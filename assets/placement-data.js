// Placement test question bank — shared by the test (examen.html) and the report (reporte.html)
window.SEGMENTS = [
  { code: "Q1", lvl: "A1", name: "Beginner", intro: "The basics: to be, do / does, likes and routines.",
    qs: [
      { ar: "be", p: "I ___ 15 years old.", a: "am", w: ["have", "is", "are"], why: "Age uses “be”: I'm 15. Never “I have 15”." },
      { ar: "be", p: "Max Verstappen ___ a Formula 1 driver.", a: "is", w: ["are", "am", "be"], why: "He / she / it → is." },
      { ar: "be", p: "Eren and Mikasa ___ friends.", a: "are", w: ["is", "am", "be"], why: "Two people (they) → are." },
      { ar: "aux", p: "___ you like football?", a: "Do", w: ["Are", "Does", "Is"], why: "Questions with like use Do (you) / Does (he, she)." },
      { ar: "pres", p: "She ___ anime every weekend.", a: "watches", w: ["watch", "watching", "is watch"], why: "Present simple with he / she / it adds -s: she watches." },
      { ar: "vp", p: "I like ___ video games.", a: "playing", w: ["play", "plays", "played"], why: "Like + verb with -ing: I like playing." },
      { ar: "modal", p: "My cousin ___ play the guitar. He's really good!", a: "can", w: ["cans", "can to", "is can"], why: "Can never changes and never takes “to”: he can play." },
      { ar: "vocab", p: "The opposite of “fast” is ___.", a: "slow", w: ["big", "new", "loud"], why: "Fast ↔ slow." }
    ] },
  { code: "Q2", lvl: "A2", name: "Elementary", intro: "The past, plans, comparisons and prepositions.",
    qs: [
      { ar: "past", p: "Yesterday I ___ the Japanese Grand Prix on TV.", a: "watched", w: ["watch", "have watched", "am watching"], why: "Yesterday → past simple: watched." },
      { ar: "comp", p: "Hamilton is ___ than me at driving.", a: "better", w: ["more good", "best", "gooder"], why: "Good → better → the best (irregular)." },
      { ar: "quant", p: "There ___ any good games on my phone.", a: "aren't", w: ["isn't", "don't", "no"], why: "Plural (games) → there aren't." },
      { ar: "fut", p: "We ___ to the stadium next Saturday. We have tickets!", a: "are going", w: ["go", "went", "goes"], why: "Plans you already made: be going to / present continuous." },
      { ar: "aux", p: "Did you ___ the new episode?", a: "see", w: ["saw", "seen", "seeing"], why: "After did, use the base verb: did you see." },
      { ar: "prep", p: "I'm not interested ___ basketball.", a: "in", w: ["on", "at", "of"], why: "Interested in, never “interested on”." },
      { ar: "quant", p: "How ___ money do you need for the new console?", a: "much", w: ["many", "long", "often"], why: "You can't count money → how much." },
      { ar: "comp", p: "This is the ___ race of the season!", a: "most exciting", w: ["more exciting", "excitingest", "exciting most"], why: "Long adjectives: the most + adjective." }
    ] },
  { code: "Q3", lvl: "B1", name: "Intermediate", intro: "Present perfect, conditionals and phrasal verbs.",
    qs: [
      { ar: "perf", p: "I ___ anime since I was ten.", a: "have watched", w: ["watch", "am watching", "watched"], why: "Since + something that continues today → present perfect." },
      { ar: "cond", p: "If I ___ a lot of money, I would buy an R34 Skyline.", a: "had", w: ["have", "would have", "will have"], why: "Second conditional: If + past, would + verb." },
      { ar: "clause", p: "The driver ___ won the race is from Mexico.", a: "who", w: ["which", "what", "whose"], why: "For people: who." },
      { ar: "modal", p: "You ___ wear a seatbelt. It's the law.", a: "must", w: ["might", "could", "would rather"], why: "A strong rule (a law) → must / have to." },
      { ar: "perf", p: "When I arrived, the match ___.", a: "had already started", w: ["has already started", "already starts", "was already start"], why: "Something that happened before another past moment → past perfect." },
      { ar: "vocab", p: "My phone ran ___ of battery in the middle of the game.", a: "out", w: ["off", "away", "down"], why: "Run out of = have no more of something." },
      { ar: "clause", p: "The game was ___ boring that I stopped playing.", a: "so", w: ["such", "too", "very"], why: "So + adjective + that…; such goes with a noun (such a boring game)." },
      { ar: "vp", p: "I'm used to ___ up early for races in Asia.", a: "waking", w: ["wake", "woke", "be waking"], why: "Be used to + -ing = something is normal for you." }
    ] },
  { code: "POLE", lvl: "B2", name: "Upper intermediate", intro: "Advanced structures. Getting here is already a great result.",
    qs: [
      { ar: "perf", p: "By the end of the season, he ___ more than 20 races.", a: "will have won", w: ["will win", "has won", "wins"], why: "By + a future moment → future perfect." },
      { ar: "cond", p: "I wish I ___ to the concert last night.", a: "had gone", w: ["went", "have gone", "would go"], why: "Regret about the past: wish + past perfect." },
      { ar: "adv", p: "The new GT‑R is said ___ over 600 horsepower.", a: "to have", w: ["having", "that has", "it has"], why: "Is said + to + verb." },
      { ar: "adv", p: "Hardly ___ the race started when it began to rain.", a: "had", w: ["did", "was", "has"], why: "Hardly … when, with inversion: Hardly had it started…" },
      { ar: "vp", p: "She suggested ___ the anime in Japanese with subtitles.", a: "watching", w: ["to watch", "us to watch", "that watching"], why: "Suggest + -ing (or suggest that we watch)." },
      { ar: "cond", p: "If he hadn't crashed, he ___ the championship now.", a: "would be leading", w: ["will be leading", "had been leading", "would lead have"], why: "Mixed conditional: past action → result in the present." },
      { ar: "vocab", p: "The team decided to ___ his contract for two more years.", a: "extend", w: ["enlarge", "widen", "lengthen"], why: "Collocation: extend a contract." },
      { ar: "adv", p: "Not only ___ the race, but he also set the fastest lap.", a: "did he win", w: ["he won", "he did win", "won he"], why: "Not only at the start → inversion: did he win." }
    ] }
];
window.RADIO = [
  { lvl: "A1", en: "Introduce yourself: name, age, where you live, what you like.", es: "Preséntate: nombre, edad, dónde vives, qué te gusta." },
  { lvl: "A2", en: "Tell me about the last race, match or episode you watched.", es: "Cuéntame la última carrera, partido o episodio que viste." },
  { lvl: "B1", en: "If you could have any car in the world, which one and why?", es: "Si pudieras tener cualquier coche, ¿cuál y por qué?" },
  { lvl: "B2", en: "Is it fair that the richest F1 teams win the most? Give your opinion.", es: "¿Es justo que los equipos más ricos ganen más? Da tu opinión." }
];
window.PASS = 5;
window.NAMES = ["Beginner", "Elementary", "Intermediate", "Upper intermediate"];

// Skill areas: names, what to work on, and where we cover it
window.AREAS = {
  be:     { en: "Verb “to be”", es: "Verbo to be (am, is, are)", tipEn: "Practice am / is / are with ages, places and descriptions.", tipEs: "Practicar am / is / are con edades, lugares y descripciones.", lesson: "01" },
  aux:    { en: "Questions (do, does, did)", es: "Preguntas con do, does, did", tipEn: "Build questions with do / does / did and the base verb.", tipEs: "Formar preguntas con do / does / did y el verbo en forma base.", lesson: "03" },
  pres:   { en: "Present simple", es: "Presente simple", tipEn: "Routines and the -s with he / she / it.", tipEs: "Rutinas y la -s con he / she / it.", lesson: "03" },
  past:   { en: "Past simple", es: "Pasado simple", tipEn: "Tell stories in the past: regular and irregular verbs.", tipEs: "Contar historias en pasado: verbos regulares e irregulares.", lesson: "05" },
  fut:    { en: "Future forms", es: "Futuro (going to, will)", tipEn: "Talk about plans with going to and the present continuous.", tipEs: "Hablar de planes con going to y presente continuo.", lesson: "Conversation" },
  perf:   { en: "Perfect tenses", es: "Tiempos perfectos (have / had done)", tipEn: "Present perfect with since / for, then past and future perfect.", tipEs: "Presente perfecto con since / for; después pasado y futuro perfecto.", lesson: "B1 grammar" },
  cond:   { en: "Conditionals & wishes", es: "Condicionales y wish", tipEn: "If + past, would + verb; then wishes and mixed conditionals.", tipEs: "If + pasado, would + verbo; después wish y condicionales mixtos.", lesson: "B1 grammar" },
  modal:  { en: "Modal verbs", es: "Verbos modales (can, must)", tipEn: "Ability and obligation: can, can’t, must, have to.", tipEs: "Habilidad y obligación: can, can’t, must, have to.", lesson: "01" },
  vp:     { en: "Verb patterns (-ing / to)", es: "Patrones verbales (-ing / to)", tipEn: "Which verbs take -ing (like, enjoy, suggest) and which take to.", tipEs: "Qué verbos llevan -ing (like, enjoy, suggest) y cuáles to.", lesson: "01" },
  comp:   { en: "Comparatives & superlatives", es: "Comparativos y superlativos", tipEn: "Faster, better, the most exciting.", tipEs: "Faster, better, the most exciting.", lesson: "06" },
  quant:  { en: "There is / are & quantities", es: "There is / are y cantidades", tipEn: "There is / are, much / many, some / any.", tipEs: "There is / are, much / many, some / any.", lesson: "02" },
  prep:   { en: "Prepositions", es: "Preposiciones", tipEn: "Fixed pairs like interested in, good at, on weekends.", tipEs: "Combinaciones fijas como interested in, good at, on weekends.", lesson: "01" },
  clause: { en: "Linking & relative clauses", es: "Conectores y oraciones relativas", tipEn: "Who / which / that, and so / such … that.", tipEs: "Who / which / that, y so / such … that.", lesson: "B1 grammar" },
  vocab:  { en: "Vocabulary & phrasal verbs", es: "Vocabulario y phrasal verbs", tipEn: "Opposites, collocations and phrasal verbs like run out of.", tipEs: "Opuestos, colocaciones y phrasal verbs como run out of.", lesson: "Every lesson" },
  adv:    { en: "Advanced structures", es: "Estructuras avanzadas", tipEn: "Inversion (Not only did…), passive reporting (is said to).", tipEs: "Inversión (Not only did…), voz pasiva para reportar (is said to).", lesson: "Conversation" }
};
window.LEVELS = [
  { lvl: "A1", name: "Beginner", es: "Principiante", txt: "We’ll build the basics: introducing yourself, likes, routines and simple questions.", start: "Lesson 01 · Driver Profile" },
  { lvl: "A2", name: "Elementary", es: "Elemental", txt: "You know the basics. Now it’s time to talk more: the past, plans and comparisons.", start: "Lessons 01 to 06, at a good pace" },
  { lvl: "B1", name: "Intermediate", es: "Intermedio", txt: "You can communicate. Now we build fluency: opinions, stories and conditionals.", start: "Conversation classes + B1 grammar" },
  { lvl: "B2", name: "Upper intermediate", es: "Intermedio alto", txt: "A strong level. The goal is to sound natural: expressions, phrasal verbs and debates.", start: "In-depth conversation topics" },
  { lvl: "B2+", name: "Upper intermediate +", es: "Intermedio alto +", txt: "A very high level for your age. Advanced conversation and specific vocabulary.", start: "Advanced conversation" }
];
// Build options: the correct answer rotates A, B, C, D across the whole test
(function () { let g = 0; window.SEGMENTS.forEach(s => s.qs.forEach(q => { const p = g % 4, o = [...q.w]; o.splice(p, 0, q.a); q.opts = o; q.correct = p; q.g = g++; })); })();
window.ALLQ = window.SEGMENTS.flatMap(s => s.qs);
