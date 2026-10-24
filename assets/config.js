// ─────────────────────────────────────────────
//  CONFIGURACIÓN DEL CURSO — edita solo esto
// ─────────────────────────────────────────────
window.LINGUA = {
  curso: "English with the things you love",
  maestro: "Alejandro",
  maestroNombre: "Alejandro Caporali",   // nombre que firma los diplomas

  // Cada lección nueva se agrega aquí. estado: "lista" o "pronto"
  modulos: [
    { titulo: "Module 1 · The basics", owner: "Emiliano", lecciones: [
      { id: "01", archivo: "clases/leccion-01.html", titulo: "Driver Profile", tema: "Introduce yourself: your name, age, where you’re from and what you like.", nivel: "A1–A2", min: 60, icono: "helmet", color: "#2346d0", estado: "lista", secs: 7 },
      { id: "02", archivo: "clases/leccion-02.html", titulo: "My Garage", tema: "Describe things with have / has, colors and big numbers.", nivel: "A1–A2", min: 60, icono: "car", color: "#0f766e", estado: "lista", secs: 7 },
      { id: "03", archivo: "clases/leccion-03.html", titulo: "Race Day", tema: "Your daily routine and telling the time with the present simple.", nivel: "A2", min: 60, icono: "clock", color: "#b45309", estado: "lista", secs: 7 }
    ]},
    { titulo: "Module 2 · Tell and compare", owner: "Emiliano", lecciones: [
      { id: "04", archivo: "clases/leccion-04.html", titulo: "Anime Night", tema: "Give your opinion: I love, I can't stand, because…", nivel: "A2", min: 60, icono: "chat", color: "#6d3fd6", estado: "lista", secs: 7 },
      { id: "05", archivo: "clases/leccion-05.html", titulo: "Matchday", tema: "Tell the story of a match with the past simple.", nivel: "A2", min: 60, icono: "ball", color: "#15803d", estado: "lista", secs: 7 },
      { id: "06", archivo: "clases/leccion-06.html", titulo: "Level Up", tema: "Compare games and cars: faster, better, the best.", nivel: "A2–B1", min: 60, icono: "pad", color: "#be123c", estado: "lista", secs: 7 }
    ]},
    // ── Ada (moved from her own platform) ──
    { titulo: "Conversation", owner: "Ada", lecciones: [
      {"id": "101", "archivo": "clases/leccion-101.html", "titulo": "Talking About Music", "tema": "Talking about music is one of the easiest ways to get fluent — you already have opinions.", "nivel": "B1", "min": 60, "icono": "music", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "102", "archivo": "clases/leccion-102.html", "titulo": "Anime & Series", "tema": "Summarising a plot, praising a character, recommending without spoilers — these are the phrases that make talking about anime and series feel effortless.", "nivel": "B1", "min": 60, "icono": "film", "color": "#0f766e", "estado": "lista", "secs": 7},
      {"id": "105", "archivo": "clases/leccion-105.html", "titulo": "Everyday Fluency", "tema": "Fluency isn't speaking fast — it's never freezing.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#15803d", "estado": "lista", "secs": 7},
      {"id": "106", "archivo": "clases/leccion-106.html", "titulo": "Eating Out & Food", "tema": "Food comes up in almost every conversation — what you ate, what you hate, where you want to go.", "nivel": "B1", "min": 60, "icono": "food", "color": "#be123c", "estado": "lista", "secs": 7},
      {"id": "107", "archivo": "clases/leccion-107.html", "titulo": "Gaming & Playing Online", "tema": "Gaming has its own English — half of it is slang you already hear in voice chat.", "nivel": "B1", "min": 60, "icono": "pad", "color": "#0369a1", "estado": "lista", "secs": 7},
      {"id": "108", "archivo": "clases/leccion-108.html", "titulo": "Social Media & Being Online", "tema": "Social media English changes fast, but the core phrases stay the same.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#a16207", "estado": "lista", "secs": 7},
      {"id": "109", "archivo": "clases/leccion-109.html", "titulo": "Travel & the Airport", "tema": "Airports and hotels run on a small set of fixed phrases.", "nivel": "B1", "min": 60, "icono": "plane", "color": "#7c3aed", "estado": "lista", "secs": 7},
      {"id": "110", "archivo": "clases/leccion-110.html", "titulo": "Friends & Family", "tema": "Describing people is the question you get asked most in English — in class, in exams, meeting anyone new.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0e7490", "estado": "lista", "secs": 7},
      {"id": "111", "archivo": "clases/leccion-111.html", "titulo": "Shopping & Clothes", "tema": "Shops run on a handful of fixed phrases, and describing clothes has its own word order.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "112", "archivo": "clases/leccion-112.html", "titulo": "Trends & Opinions", "tema": "Trends come and go, but the language for talking about them stays the same.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0f766e", "estado": "lista", "secs": 7},
      {"id": "113", "archivo": "clases/leccion-113.html", "titulo": "Sports & Staying Healthy", "tema": "Sport in English runs on three verbs — play, do and go — and getting them wrong is the giveaway.", "nivel": "B1", "min": 60, "icono": "ball", "color": "#b45309", "estado": "lista", "secs": 7},
      {"id": "115", "archivo": "clases/leccion-115.html", "titulo": "Internet English & Slang", "tema": "You already see these online every day.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#15803d", "estado": "lista", "secs": 7},
      {"id": "116", "archivo": "clases/leccion-116.html", "titulo": "AI & Technology", "tema": "AI comes up constantly — in class, online, at home.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#be123c", "estado": "lista", "secs": 7},
      {"id": "117", "archivo": "clases/leccion-117.html", "titulo": "School Life", "tema": "School is what you spend most of your week doing, so it comes up constantly — and it is full of words that do not translate.", "nivel": "B1", "min": 60, "icono": "book", "color": "#0369a1", "estado": "lista", "secs": 7},
      {"id": "118", "archivo": "clases/leccion-118.html", "titulo": "Telling a Story", "tema": "A good story in English is not about long words — it is about a few connecting phrases and knowing where to pause.", "nivel": "B1", "min": 60, "icono": "book", "color": "#a16207", "estado": "lista", "secs": 7},
      {"id": "119", "archivo": "clases/leccion-119.html", "titulo": "Where I Am From", "tema": "Everyone you meet in English will ask where you are from, and the good answer is never just the name of a city.", "nivel": "B1", "min": 60, "icono": "plane", "color": "#7c3aed", "estado": "lista", "secs": 7},
      {"id": "120", "archivo": "clases/leccion-120.html", "titulo": "How Are You Really", "tema": "English has a whole layer of phrases between \"fine\" and \"terrible\", and most learners never reach it.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0e7490", "estado": "lista", "secs": 7},
      {"id": "121", "archivo": "clases/leccion-121.html", "titulo": "Aesthetics & What Is In", "tema": "Every aesthetic online has an English name and a set of words that go with it.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "122", "archivo": "clases/leccion-122.html", "titulo": "Life at the Stables", "tema": "Riding has its own English — and most of it is about the horse, not the rider.", "nivel": "B1", "min": 60, "icono": "horse", "color": "#a16207", "estado": "lista", "secs": 10}
    ]},
    { titulo: "Foundations", owner: "Ada", lecciones: [
      {"id": "103", "archivo": "clases/leccion-103.html", "titulo": "Grammar That Actually Matters", "tema": "Forget the endless rules.", "nivel": "B1", "min": 60, "icono": "book", "color": "#b45309", "estado": "lista", "secs": 7},
      {"id": "104", "archivo": "clases/leccion-104.html", "titulo": "Writing Clearly", "tema": "Good writing for school isn't fancy — it's structured.", "nivel": "B1", "min": 60, "icono": "book", "color": "#6d3fd6", "estado": "lista", "secs": 7}
    ]},
    { titulo: "Grammar", owner: "Ada", lecciones: [
      {"id": "114", "archivo": "clases/leccion-114.html", "titulo": "Plans & the Future", "tema": "English has three ways of talking about the future and they are not interchangeable.", "nivel": "B1", "min": 60, "icono": "clock", "color": "#6d3fd6", "estado": "lista", "secs": 7}
    ]},
    // ── Domeniko (moved from his own platform) ──
    { titulo: "Conversation", owner: "Domeniko", lecciones: [
      {"id": "201", "archivo": "clases/leccion-201.html", "titulo": "Everyday Conversation", "tema": "The difference between textbook English and real conversation is usually a handful of small phrases.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "202", "archivo": "clases/leccion-202.html", "titulo": "Telling Stories", "tema": "Good storytellers reuse the same handful of expressions to hook you, build tension and land the ending.", "nivel": "B1", "min": 60, "icono": "book", "color": "#0f766e", "estado": "lista", "secs": 7},
      {"id": "204", "archivo": "clases/leccion-204.html", "titulo": "Small Talk & Networking", "tema": "Small talk isn't about saying something clever — it's about giving the other person something easy to answer.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#6d3fd6", "estado": "lista", "secs": 7},
      {"id": "211", "archivo": "clases/leccion-211.html", "titulo": "Food & Eating Out", "tema": "A meal out is a script: arriving, ordering, asking, paying.", "nivel": "B1", "min": 60, "icono": "food", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "229", "archivo": "clases/leccion-229.html", "titulo": "Storytelling with Detail", "tema": "“It was bad” reports.", "nivel": "B1", "min": 90, "icono": "book", "color": "#7c3aed", "estado": "lista", "secs": 10}
    ]},
    { titulo: "Fluency", owner: "Domeniko", lecciones: [
      {"id": "203", "archivo": "clases/leccion-203.html", "titulo": "Speaking Naturally", "tema": "Fluent speakers rarely disagree bluntly — they soften, acknowledge, and buy themselves time.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#b45309", "estado": "lista", "secs": 7},
      {"id": "213", "archivo": "clases/leccion-213.html", "titulo": "Phrasal Verbs That Matter", "tema": "Native speakers say “put off” far more often than “postpone”.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#b45309", "estado": "lista", "secs": 7},
      {"id": "216", "archivo": "clases/leccion-216.html", "titulo": "Idioms & Sounding Fluent", "tema": "Forget “it’s raining cats and dogs” — nobody says it.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#be123c", "estado": "lista", "secs": 7},
      {"id": "220", "archivo": "clases/leccion-220.html", "titulo": "Formal vs Casual", "tema": "English shifts register constantly: same meaning, different words, depending on who's listening.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0e7490", "estado": "lista", "secs": 7},
      {"id": "225", "archivo": "clases/leccion-225.html", "titulo": "Filler Words & Buying Time", "tema": "Fluency isn't speed — it's never leaving a hole.", "nivel": "B1", "min": 90, "icono": "chat", "color": "#15803d", "estado": "lista", "secs": 10},
      {"id": "228", "archivo": "clases/leccion-228.html", "titulo": "Apologising & Fixing Mistakes", "tema": "English has a whole ladder of sorry, from a bumped elbow to a serious failure.", "nivel": "B1", "min": 90, "icono": "chat", "color": "#a16207", "estado": "lista", "secs": 10},
      {"id": "230", "archivo": "clases/leccion-230.html", "titulo": "Sarcasm & Humour in English", "tema": "English speakers, especially British ones, say the opposite of what they mean constantly — and understate everything else.", "nivel": "B1", "min": 90, "icono": "chat", "color": "#0e7490", "estado": "lista", "secs": 10}
    ]},
    { titulo: "Practical English", owner: "Domeniko", lecciones: [
      {"id": "205", "archivo": "clases/leccion-205.html", "titulo": "Travel & Getting Around", "tema": "Travelling in English is mostly the same twenty sentences on repeat.", "nivel": "B1", "min": 60, "icono": "plane", "color": "#15803d", "estado": "lista", "secs": 7},
      {"id": "207", "archivo": "clases/leccion-207.html", "titulo": "On the Phone", "tema": "On the phone you lose gestures, lips and expressions — so the phrases have to do all the work.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0369a1", "estado": "lista", "secs": 7},
      {"id": "210", "archivo": "clases/leccion-210.html", "titulo": "Numbers, Money & Dates", "tema": "Numbers, prices and dates are where most misunderstandings happen — and where confirming out loud saves you.", "nivel": "B1", "min": 60, "icono": "clock", "color": "#0e7490", "estado": "lista", "secs": 7},
      {"id": "212", "archivo": "clases/leccion-212.html", "titulo": "Health & Emergencies", "tema": "This is the vocabulary you hope not to need and can't afford to search for in the moment.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#0f766e", "estado": "lista", "secs": 7},
      {"id": "215", "archivo": "clases/leccion-215.html", "titulo": "Technology & Everyday Problems", "tema": "Broken wifi, a frozen laptop, an app that won't load.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#15803d", "estado": "lista", "secs": 7}
    ]},
    { titulo: "Professional", owner: "Domeniko", lecciones: [
      {"id": "206", "archivo": "clases/leccion-206.html", "titulo": "English at Work", "tema": "Work English is a small set of phrases used constantly: interrupting, clarifying, buying time, closing.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#be123c", "estado": "lista", "secs": 7},
      {"id": "214", "archivo": "clases/leccion-214.html", "titulo": "Job Interviews", "tema": "Interviews in English are unusually predictable.", "nivel": "B1", "min": 60, "icono": "chat", "color": "#6d3fd6", "estado": "lista", "secs": 7},
      {"id": "226", "archivo": "clases/leccion-226.html", "titulo": "Negotiating", "tema": "English negotiates sideways: conditionals, softeners and questions instead of demands.", "nivel": "B1", "min": 90, "icono": "chat", "color": "#be123c", "estado": "lista", "secs": 10},
      {"id": "227", "archivo": "clases/leccion-227.html", "titulo": "Explaining a Process", "tema": "Explaining how something works is mostly connectors: first, then, once, until, so that.", "nivel": "B1", "min": 90, "icono": "clock", "color": "#0369a1", "estado": "lista", "secs": 10}
    ]},
    { titulo: "Grammar in Use", owner: "Domeniko", lecciones: [
      {"id": "208", "archivo": "clases/leccion-208.html", "titulo": "Talking About the Past", "tema": "English splits the past into three jobs: finished moments, life experience, and old habits.", "nivel": "B1", "min": 60, "icono": "clock", "color": "#a16207", "estado": "lista", "secs": 7},
      {"id": "209", "archivo": "clases/leccion-209.html", "titulo": "Future Plans & Hypotheticals", "tema": "English chooses between will, going to and the present continuous depending on how decided the thing is.", "nivel": "B1", "min": 60, "icono": "clock", "color": "#7c3aed", "estado": "lista", "secs": 7},
      {"id": "217", "archivo": "clases/leccion-217.html", "titulo": "Countable vs Uncountable", "tema": "Advice, information, furniture, news, luggage.", "nivel": "B1", "min": 60, "icono": "book", "color": "#0369a1", "estado": "lista", "secs": 7},
      {"id": "218", "archivo": "clases/leccion-218.html", "titulo": "Articles: a, an, the… or nothing", "tema": "English has a, an, the — and nothing at all.", "nivel": "B1", "min": 60, "icono": "book", "color": "#a16207", "estado": "lista", "secs": 7},
      {"id": "221", "archivo": "clases/leccion-221.html", "titulo": "In, On, At", "tema": "Spanish uses en for almost everything.", "nivel": "B1", "min": 60, "icono": "book", "color": "#2346d0", "estado": "lista", "secs": 7},
      {"id": "223", "archivo": "clases/leccion-223.html", "titulo": "Gerund or Infinitive", "tema": "When one verb follows another, English needs either -ing or to.", "nivel": "B1", "min": 60, "icono": "book", "color": "#b45309", "estado": "lista", "secs": 7}
    ]},
    { titulo: "Pronunciation", owner: "Domeniko", lecciones: [
      {"id": "219", "archivo": "clases/leccion-219.html", "titulo": "Word Stress", "tema": "English hits one syllable harder and swallows the rest.", "nivel": "B1", "min": 60, "icono": "music", "color": "#7c3aed", "estado": "lista", "secs": 7}
    ]},
    { titulo: "Vocabulary", owner: "Domeniko", lecciones: [
      {"id": "222", "archivo": "clases/leccion-222.html", "titulo": "Make vs Do · Say vs Tell", "tema": "Hacer splits into make and do.", "nivel": "B1", "min": 60, "icono": "book", "color": "#0f766e", "estado": "lista", "secs": 7},
      {"id": "231", "archivo": "clases/leccion-231.html", "titulo": "British vs American English", "tema": "Vocabulary, spelling and a few grammar habits differ.", "nivel": "B1", "min": 90, "icono": "chat", "color": "#2346d0", "estado": "lista", "secs": 10}
    ]},
    { titulo: "Listening", owner: "Domeniko", lecciones: [
      {"id": "224", "archivo": "clases/leccion-224.html", "titulo": "Understanding Native Speed", "tema": "Natives don't say words one by one — they run them together and swallow the weak ones.", "nivel": "B1", "min": 90, "icono": "music", "color": "#6d3fd6", "estado": "lista", "secs": 10}
    ]},
    // ── Derek and Erick (C1) ──
    { titulo: "C1 · Film", owner: "Derek", lecciones: [
      {"id": "301", "archivo": "clases/leccion-301.html", "titulo": "Talking Like a Filmmaker", "tema": "Directors don't say a scene was \"good\" — they talk about pacing, framing and what lands.", "nivel": "C1", "min": 90, "icono": "film", "color": "#be123c", "estado": "lista", "secs": 10}
    ]},
    { titulo: "C1 · Music", owner: "Erick", lecciones: [
      {"id": "311", "archivo": "clases/leccion-311.html", "titulo": "Talking Shop: Sound, Gear & Playing", "tema": "Musicians don't say a song is \"nice\" — they talk about tone, groove and what makes it hit.", "nivel": "C1", "min": 90, "icono": "guitar", "color": "#0f766e", "estado": "lista", "secs": 10},
      {"id": "312", "archivo": "clases/leccion-312.html", "titulo": "Breaking Down a Song", "tema": "Saying a song is \"fire\" is easy. Explaining why it works — the writing, the production, the feel — is the C1 skill.", "nivel": "C1", "min": 120, "icono": "music", "color": "#6d28d9", "estado": "lista", "secs": 10}
    ]}
  ],

  // ── Cuentas (Supabase) ──
  // Pega aquí el Project URL y la Publishable key (Settings → API Keys).
  // Si se dejan vacíos, la plataforma funciona sin cuentas y guarda solo en el navegador.
  cloud: {
    url: "https://vtvfltiadubdphkunshr.supabase.co",
    key: "sb_publishable_5O3MsX0-tvWFq2M65wTUEQ_veRijaYN",
    // Si el alumno escribe un usuario sin "@", se convierte en usuario@este-dominio
    usernameDomain: "student.lingua.app"
  }
};

// ── Helpers compartidos (no hace falta tocarlos) ──
// Cada valor guardado lleva su hora de cambio en "lingua.__meta" para sincronizar sin perder avances.
window.LINGUA.store = {
  get(k, d) { try { const v = localStorage.getItem("lingua." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) {
    try {
      localStorage.setItem("lingua." + k, JSON.stringify(v));
      if (k.indexOf("__") !== 0) {
        const m = JSON.parse(localStorage.getItem("lingua.__meta") || "{}"); m[k] = Date.now();
        localStorage.setItem("lingua.__meta", JSON.stringify(m));
      }
    } catch (e) {}
    if (window.LINGUA.onSet) window.LINGUA.onSet(k);
  }
};
// Pages opened inside the trial class (?embed=1) keep everything in memory: nothing is saved to anyone's account
if (/[?&]embed=1(&|$)/.test(location.search)) {
  const real = window.LINGUA.store, mem = {}, keep = ["textSize", "theme", "sounds", "voice", "voiceRate"];
  window.LINGUA.store = { get(k, d) { return k in mem ? mem[k] : (keep.indexOf(k) >= 0 || k.indexOf("__") === 0 ? real.get(k, d) : d); }, set(k, v) { mem[k] = v; } };
  window.LINGUA.embedded = true;
  document.documentElement.classList.add("embed");
}
window.LINGUA.icons = {
  helmet: '<path d="M8 34c0-12 9-22 21-22 9 0 17 6 19 15l2 9H30a4 4 0 0 0-4 4v4H12a4 4 0 0 1-4-4z"/><path d="M30 27h18"/>',
  car: '<path d="M8 34l4-11c1-3 3-5 7-5h18c4 0 6 2 7 5l4 11"/><rect x="6" y="34" width="44" height="9" rx="3"/><circle cx="16" cy="45" r="3"/><circle cx="40" cy="45" r="3"/>',
  clock: '<circle cx="28" cy="30" r="16"/><path d="M28 21v9l6 4"/><path d="M23 9h10M28 9v5"/>',
  chat: '<path d="M10 14h36a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H24l-9 7v-7h-5a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z"/><path d="M18 24h20M18 30h12"/>',
  ball: '<circle cx="28" cy="28" r="17"/><path d="M28 19l8 6-3 9h-10l-3-9z"/><path d="M28 11v8M44 23l-8 2M39 42l-6-8M17 42l6-8M12 23l8 2"/>',
  pad: '<path d="M14 20h28c5 0 8 4 9 9l1 7c1 5-4 8-8 4l-5-5H17l-5 5c-4 4-9 1-8-4l1-7c1-5 4-9 9-9z"/><path d="M17 26v6M14 29h6"/><circle cx="38" cy="27" r="1.5"/><circle cx="42" cy="31" r="1.5"/>',
  film: '<rect x="8" y="22" width="40" height="24" rx="3"/><path d="M8 22l38-9 2 7"/><path d="M17 20l5-8M28 17l5-8M39 14l4-7"/><path d="M8 30h40"/>',
  music: '<path d="M22 40V14l22-5v26"/><circle cx="16" cy="40" r="6"/><circle cx="38" cy="35" r="6"/><path d="M22 21l22-5"/>',
  guitar: '<path d="M33 23l11-11M40 8l8 8"/><path d="M30 26c-3-3-9-2-11 2-1 2-1 4-3 5-5 1-8 5-6 10 2 4 6 6 10 6 5 0 8-3 9-8 1-2 3-2 5-3 4-2 5-8 2-11z"/><circle cx="24" cy="38" r="3"/>',
  book: '<path d="M10 12h14a4 4 0 0 1 4 4v28a3 3 0 0 0-3-3H10z"/><path d="M46 12H32a4 4 0 0 0-4 4v28a3 3 0 0 1 3-3h15z"/>',
  plane: '<path d="M8 32l40-18-12 32-8-12z"/><path d="M28 34l20-20"/>',
  horse: '<path d="M15 46c-5-8-6-19-1-27 3-5 8-8 14-8s11 3 14 8c5 8 4 19-1 27"/><path d="M23 44c-3-6-3-14 0-19 1-2 3-3 5-3s4 1 5 3c3 5 3 13 0 19"/><path d="M15 46h8M33 44h8"/><circle cx="17" cy="30" r="1.3"/><circle cx="39" cy="30" r="1.3"/><circle cx="20" cy="20" r="1.3"/><circle cx="36" cy="20" r="1.3"/>',
  food: '<path d="M10 30h36a18 18 0 0 1-36 0z"/><path d="M22 22c0-4 3-4 3-8M30 22c0-4 3-4 3-8"/><path d="M14 48h28"/>'
};
// Portada de lección: misma serie para todas (color, textura, título, ícono recortado)
window.LINGUA.thumb = function (l, label) {
  return `<div class="thumb" style="--c:${l.color}">` +
    `<svg class="ico-bg" viewBox="0 0 56 56" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${window.LINGUA.icons[l.icono] || ""}</svg>` +
    `<span class="lno">${label || "LESSON"} ${l.id}</span><span class="tt">${l.titulo}</span><span class="lv">${l.nivel}</span></div>`;
};
window.LINGUA.mark = function (s) {
  s = s || 30;
  return `<svg class="mark" width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#2346d0"/><path d="M8.5 9h15a2.5 2.5 0 0 1 2.5 2.5v7.5a2.5 2.5 0 0 1-2.5 2.5H16l-4.5 4v-4h-3A2.5 2.5 0 0 1 6 19v-7.5A2.5 2.5 0 0 1 8.5 9z" fill="#fff"/><circle cx="20.5" cy="15.25" r="2.4" fill="#f5c518"/></svg>`;
};
window.LINGUA.logo = window.LINGUA.mark(30) + '<span class="wordmark">Lingua</span>';
document.documentElement.style.setProperty("--scale", window.LINGUA.store.get("textSize", 1));

// Lessons made in the lesson builder (saved in Supabase, cached here) join the course as a new module
(function () {
  const L = window.LINGUA, rows = (L.store.get("__lessons", []) || []).filter(r => r.published && r.data);
  if (!rows.length) return;
  const known = new Set(L.modulos.flatMap(m => m.lecciones).map(l => l.id));
  const extra = rows.filter(r => !known.has(r.id)).sort((a, b) => a.id.localeCompare(b.id)).map(r => ({
    id: r.id, archivo: "clases/custom.html?id=" + r.id, titulo: r.data.titulo || "Lesson " + r.id, tema: r.data.tema || "",
    nivel: r.data.nivel || "A2", min: 60, icono: r.data.icono || "chat", color: r.data.color || "#2346d0", estado: "lista", custom: true
  }));
  if (!extra.length) return;
  // Group by the module name set in the builder, in the order they first appear
  const byMod = {};
  extra.forEach(l => { const r = rows.find(x => x.id === l.id), m = (r.data.modulo || "").trim() || "Module 3 · More lessons"; (byMod[m] = byMod[m] || []).push(l); });
  Object.keys(byMod).forEach(m => L.modulos.push({ titulo: m, lecciones: byMod[m] }));
})();

// Each student sees only the lessons the teacher assigned (lessons: null = every lesson)
(function () {
  const L = window.LINGUA, st = L.store.get("__settings", null);
  L.settings = st || { lessons: null, theme: "racing" };
  if (!st || !Array.isArray(st.lessons) || (L.store.get("__teacher", false) && !L.store.get("__actas", null))) return;
  const ok = new Set(st.lessons);
  L.modulos = L.modulos.map(m => ({ ...m, lecciones: m.lecciones.filter(l => ok.has(l.id)) })).filter(m => m.lecciones.length);
})();

// ── Theme: "system" (follows the device), "light" or "dark". Saved per device. ──
(function () {
  const L = window.LINGUA, root = document.documentElement;
  const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const T = L.theme = {
    get: () => L.store.get("theme", "system"),
    isDark: () => { const v = T.get(); return v === "dark" || (v === "system" && !!(mq && mq.matches)); },
    set: (v) => { L.store.set("theme", v); apply(); },
    toggle: () => T.set(T.isDark() ? "light" : "dark")
  };
  function apply() {
    const v = T.get();
    if (v === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", v);
    document.querySelectorAll(".theme-btn").forEach(b => {
      const d = T.isDark();
      b.innerHTML = d ? SUN : MOON;
      b.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
      b.title = d ? "Light mode" : "Dark mode";
    });
    document.dispatchEvent(new CustomEvent("lingua:theme"));
  }
  apply();
  if (mq && mq.addEventListener) mq.addEventListener("change", () => { if (T.get() === "system") apply(); });
  // Add the sun / moon button next to the profile avatar in every top bar
  T.mount = () => {
    document.querySelectorAll(".nav-in, .pbar .tools").forEach(bar => {
      if (bar.querySelector(".theme-btn")) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "theme-btn";
      b.onclick = T.toggle;
      let ref = bar.querySelector("[data-avatar]");
      while (ref && ref.parentElement !== bar) ref = ref.parentElement;
      if (ref) bar.insertBefore(b, ref); else bar.appendChild(b);
    });
    apply();
  };
  document.addEventListener("DOMContentLoaded", T.mount);
})();

// ── Student styles: each student gets an avatar, level names and wording that match what they love ──
(function () {
  const L = window.LINGUA;
  L.THEMES = {
    racing: { label: "Racing (F1)", avatar: "helmet", part: "helmet", number: "Racing number", visor: "Visor",
      titles: ["Rookie", "Karting", "Formula 4", "Formula 3", "Formula 2", "F1 Driver", "Podium", "Race Winner", "World Champion", "Legend"],
      editor: "Design your own racing helmet, or use your initial. Level up to unlock more designs.",
      season: { title: "Your season", aria: "the course as a race track", move: "Pass a lesson (80%+) to move your helmet forward.", done: "Season complete!", unit: "checkpoints" },
      lap: { first: "Your first lap time!", again: "Race again" },
      badges: { first: "First lap", perfect: "Perfect lap", podium: "Podium", champion: "World champion", pole: "Pole position", mechanic: "Mechanic", level5: "Formula 2" } },
    music: { label: "Music (guitar)", avatar: "guitar", part: "guitar", number: null, visor: "Pickguard",
      titles: ["Bedroom Player", "Busker", "Open Mic", "Garage Band", "Opening Act", "Club Gig", "Studio Session", "Headliner", "Arena Tour", "Legend"],
      editor: "Design your own guitar, or use your initial. Level up to unlock more designs.",
      season: { title: "Your tour", aria: "the course as a concert tour", move: "Pass a lesson (80%+) to play the next show.", done: "Tour complete!", unit: "shows" },
      lap: { first: "Your first record!", again: "Play again" },
      badges: { first: "Sound check", perfect: "Perfect pitch", podium: "Top 3 hits", champion: "Platinum album", pole: "Fast fingers", mechanic: "Tuned up", level5: "Opening act" } },
    cinema: { label: "Cinema (film)", avatar: "clapper", part: "clapperboard", number: "Take number", visor: null,
      titles: ["Film Buff", "Extra", "Script Reader", "Camera Assistant", "Editor", "Screenwriter", "Cinematographer", "Director", "Festival Winner", "Auteur"],
      editor: "Design your own clapperboard, or use your initial. Level up to unlock more designs.",
      season: { title: "Your filmography", aria: "the course as a film shoot", move: "Pass a lesson (80%+) to wrap the next scene.", done: "That’s a wrap!", unit: "scenes" },
      lap: { first: "Your first take!", again: "Another take" },
      badges: { first: "Action!", perfect: "Perfect take", podium: "Trilogy", champion: "Best picture", pole: "Quick cut", mechanic: "Final cut", level5: "In the editing room" } },
    riding: { label: "Horse riding", avatar: "riding", part: "riding helmet", number: "Competitor number", visor: null,
      titles: ["Groom", "Walk", "Trot", "Canter", "Gallop", "Cross-country", "Show Jumper", "Dressage Rider", "Grand Prix", "Champion"],
      editor: "Design your own riding helmet, or use your initial. Level up to unlock more designs.",
      season: { title: "Your course", aria: "the course as a show-jumping course", move: "Pass a lesson (80%+) to clear the next jump.", done: "Clear round!", unit: "jumps" },
      lap: { first: "Your first round!", again: "Ride again" },
      badges: { first: "First ride", perfect: "Clear round", podium: "Three ribbons", champion: "Grand Prix", pole: "Fastest round", mechanic: "Well groomed", level5: "Gallop" } },
    career: { label: "Social & career", avatar: "briefcase", part: "briefcase", number: null, visor: "Clasp",
      titles: ["Newcomer", "Intern", "Junior", "Associate", "Analyst", "Specialist", "Senior", "Team Lead", "Manager", "Director"],
      editor: "Design your own briefcase, or use your initial. Level up to unlock more designs.",
      season: { title: "Your career path", aria: "the course as a career path", move: "Pass a lesson (80%+) to reach the next milestone.", done: "Path complete!", unit: "milestones" },
      lap: { first: "Your first time!", again: "Try again" },
      badges: { first: "First day", perfect: "Flawless", podium: "Three wins", champion: "Promotion", pole: "Fast learner", mechanic: "Problem solver", level5: "Analyst" } }
  };
  L.themeOf = key => L.THEMES[key] || L.THEMES.racing;
  L.style = L.themeOf(L.settings && L.settings.theme);
})();
