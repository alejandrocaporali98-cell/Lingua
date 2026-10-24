// Lingua · trial class (clase muestra) data: interests, which lesson to use for each one,
// the three phrases each lesson unlocks, and the text the report suggests.
(function () {
  // Interests the person can pick on the form. es = form label · en = what the class screen says
  const INTERESTS = [
    { k: "cars", es: "Autos y F1", en: "Cars & F1", kid: "06", adult: "06" },
    { k: "games", es: "Videojuegos", en: "Video games", kid: "107", adult: "107" },
    { k: "music", es: "Música", en: "Music", kid: "101", adult: "101" },
    { k: "film", es: "Cine y series", en: "Films & series", kid: "102", adult: "102" },
    { k: "anime", es: "Anime", en: "Anime", kid: "04", adult: "102" },
    { k: "football", es: "Fútbol", en: "Football", kid: "05", adult: "05" },
    { k: "sports", es: "Otros deportes", en: "Sports", kid: "113", adult: "113" },
    { k: "horses", es: "Caballos", en: "Horses & riding", kid: "122", adult: "122" },
    { k: "gym", es: "Gym", en: "Fitness", kid: "113", adult: "113" },
    { k: "travel", es: "Viajes", en: "Travel", kid: "109", adult: "109" },
    { k: "tech", es: "Tecnología", en: "Technology", kid: "116", adult: "116" },
    { k: "social", es: "Redes sociales", en: "Social media", kid: "108", adult: "108" },
    { k: "fashion", es: "Moda", en: "Fashion", kid: "121", adult: "121" },
    { k: "food", es: "Cocina", en: "Food", kid: "106", adult: "106" },
    { k: "books", es: "Libros", en: "Books & stories", kid: "118", adult: "118" },
    { k: "science", es: "Ciencia", en: "Science", kid: "116", adult: "116" },
    { k: "art", es: "Arte y diseño", en: "Art & design", kid: "121", adult: "121" },
    { k: "animals", es: "Animales", en: "Animals", kid: "108", adult: "108" },
    { k: "work", es: "Trabajo", en: "Work", kid: "117", adult: "214" },
    { k: "business", es: "Negocios", en: "Business", kid: "226", adult: "226" }
  ];
  const GOALS = [
    { k: "fun", es: "Entender series, juegos y música", sub: "Sin subtítulos, sin traductor", rep: "entender series, juegos y música sin subtítulos" },
    { k: "school", es: "La escuela o un examen", sub: "TOEFL, Cambridge, calificaciones", rep: "la escuela y los exámenes" },
    { k: "work", es: "Trabajo o entrevistas", sub: "Juntas, correos, conseguir el puesto", rep: "el trabajo y las entrevistas" },
    { k: "travel", es: "Viajar o vivir fuera", sub: "Moverte solo, hacer amigos", rep: "viajar y moverse solo en otro país" }
  ];
  // Three phrases per lesson: [Spanish, English]. They all come up in that lesson's reading or grammar.
  const PHRASES = {
    "04": [["Creo que está un poco sobrevalorado.", "I think it's a bit overrated."], ["No soporto al personaje principal.", "I can't stand the main character."], ["Las peleas son muy emocionantes.", "The fights are really exciting."]],
    "05": [["Fui al estadio con mi papá.", "I went to the stadium with my dad."], ["Ganamos dos a uno.", "We won two–one."], ["No ganamos, pero fue un gran partido.", "We didn't win, but it was a great match."]],
    "06": [["Gran Turismo es más realista que Forza.", "Gran Turismo is more realistic than Forza."], ["Un F1 es mucho más rápido que un Supra.", "An F1 car is much faster than a Supra."], ["Para mí, es el mejor juego de carreras.", "For me, it's the best racing game."]],
    "101": [["Me late muchísimo esa banda.", "I'm really into that band."], ["Esa canción la traigo en repeat.", "That song has been on repeat."], ["Deberías escucharlos.", "You should give them a listen."]],
    "102": [["Se trata de una elfa que vive mil años.", "It's about an elf who lives for a thousand years."], ["Al principio no me gustó, pero me fue ganando.", "It really grew on me."], ["Sin hacer spoiler, el final está increíble.", "Without spoiling anything, the ending is amazing."]],
    "106": [["Me muero de hambre.", "I'm starving."], ["¿Me da el ramen shoyu, por favor?", "Could I get the shoyu ramen, please?"], ["Esto está buenísimo.", "This is so good."]],
    "107": [["Estoy enganchadísimo con este juego.", "I'm hooked on this game."], ["Soy malísimo para pescar.", "I'm so bad at fishing."], ["¿Te conectas?", "Want to hop on?"]],
    "108": [["Mi video se hizo viral.", "My video blew up."], ["Me dejó en visto.", "She left me on read."], ["Me estoy tomando un descanso de la app.", "I'm taking a break from the app."]],
    "109": [["Quisiera documentar, por favor.", "I'd like to check in, please."], ["¿Me lo puede repetir, por favor?", "Could you say that again, please?"], ["Vengo por una semana.", "I'm here for a week."]],
    "113": [["Estoy tratando de mantenerme en forma.", "I'm trying to keep fit."], ["Juego voleibol y voy a nadar.", "I play volleyball and I go swimming."], ["Estoy molido.", "I'm shattered."]],
    "116": [["Le pedí que me lo explicara fácil.", "I asked it to explain it simply."], ["Me ahorra mucho tiempo.", "It saves me a lot of time."], ["Depende de cómo lo uses.", "It depends on how you use it."]],
    "117": [["Estoy en tercero de secundaria.", "I'm in Year 10."], ["Tengo muchísima tarea.", "I've got loads of homework."], ["¿Me prestas una pluma?", "Can I borrow a pen?"]],
    "118": [["Iba caminando a casa cuando empezó a llover.", "I was walking home when it started to rain."], ["En resumen, regresamos un día antes.", "Long story short, we went home a day early."], ["Nunca lo había hecho.", "I'd never done it before."]],
    "121": [["Te queda increíble ese look.", "You really pull that off."], ["Lo compré de segunda mano.", "I got it second-hand."], ["Ese color no combina con mis tenis.", "That colour doesn't go with my shoes."]],
    "122": [["Monto desde que tenía nueve años.", "I've been riding since I was nine."], ["Me caí, pero me volví a subir.", "I fell off, but I got back on."], ["No debes caminar detrás del caballo.", "You mustn't walk behind the horse."]],
    "201": [["¿Qué haces para divertirte?", "What do you do for fun?"], ["No soy muy de cocinar.", "I'm not much of a cook."], ["¿Y tú?", "How about you?"]],
    "214": [["Llevo seis años trabajando aquí.", "I've been working here for six years."], ["Soy responsable de un equipo de cinco personas.", "I'm responsible for a team of five."], ["Algo en lo que estoy trabajando es delegar.", "One thing I'm working on is delegating."]],
    "226": [["Eso se sale un poco de nuestro presupuesto.", "That's a bit outside our budget."], ["Si firmamos por dos años, ¿lo dejaría en 6%?", "If we sign for two years, would you consider 6%?"], ["Me parece bien.", "That works for me."]]
  };
  const DEFAULT_LESSON = "201";

  // Which lesson fits this person: work goal (adults) first, then their first interest
  function suggest(t) {
    const adult = !!(t && t.adult), ints = (t && t.interests) || [];
    if (adult && t.goal === "work") return "214";
    for (const k of ints) { const i = INTERESTS.find(x => x.k === k); if (i) return adult ? i.adult : i.kid; }
    return DEFAULT_LESSON;
  }
  const topic = t => { const i = INTERESTS.find(x => x.k === ((t && t.interests) || [])[0]); return i ? i.en : (t && t.other) || "English for you"; };

  // The short placement test: 15 questions, easy to hard, taken from the placement test bank
  const PICK = [[0, 3, 4, 5], [0, 1, 4, 5], [0, 1, 3, 7], [0, 4, 6]];
  function miniTest() {
    const S = window.SEGMENTS || [];
    return PICK.flatMap((idx, s) => (S[s] ? idx.map(i => ({ ...S[s].qs[i], seg: s })) : []));
  }
  // Level from the mini test: each block passes with 3 of 4 (2 of 3 for the last one), in order
  function levelOf(answers, qs) {
    const per = PICK.map(() => ({ ok: 0, n: 0 }));
    qs.forEach((q, i) => { per[q.seg].n++; if (answers[i] === q.a) per[q.seg].ok++; });
    let p = 0; for (const b of per) { if (b.n && b.ok >= Math.ceil(b.n * .7)) p++; else break; }
    const L = (window.LEVELS || [])[p] || { lvl: "A1", name: "Beginner", es: "Principiante" };
    return { idx: p, lvl: L.lvl, name: L.name, es: L.es, per };
  }

  // Report suggestions (the teacher can edit everything before sending)
  const NEXT = ["A2", "B1", "B2", "C1", "C1"];
  const MONTHS = {
    0: [["Las bases", "presentarse, gustos y rutina con <i>to be</i> y presente simple; lecciones sobre sus temas favoritos"], ["Preguntas y respuestas", "hacer y contestar preguntas, números, horas y fechas; primeras conversaciones cortas"], ["Contar lo que hizo", "el pasado simple con historias de su semana; meta: 3 minutos de conversación seguida"]],
    1: [["Hablar de sí mismo y de lo que le gusta", "rutina, gustos y opiniones; <i>to be</i> y presente simple sin errores"], ["Contar historias", "el pasado con historias reales; preposiciones de tiempo; videos cortos sin subtítulos"], ["Opinar y comparar", "comparativos y superlativos, dar y defender una opinión; meta: 5 minutos de conversación seguida"]],
    2: [["Fluidez en conversación", "frases para ganar tiempo y no congelarse; <i>present perfect</i> con <i>since</i> y <i>for</i>"], ["Historias con detalle", "pasado continuo y pasado perfecto; contar algo de forma interesante"], ["Opinar y debatir", "condicionales, estar de acuerdo y en desacuerdo con naturalidad; series sin subtítulos"]],
    3: [["Sonar natural", "phrasal verbs, expresiones y registro (formal y casual)"], ["Precisión", "estructuras avanzadas: inversión, condicionales mixtos, voz pasiva"], ["Debates y temas a fondo", "argumentar, matizar opiniones y entender a nativos a velocidad normal"]],
    4: [["Sonar natural", "expresiones, matices y registro"], ["Temas a fondo", "debates, noticias y contenido real"], ["Proyecto propio", "presentación o podcast en inglés sobre su tema favorito"]]
  };
  const WORK_PLAN = [["Sem. 1–4", "Tu historia profesional", "<i>Tell me about yourself</i> en 60 segundos, experiencia y logros con números"], ["Sem. 5–8", "Las preguntas difíciles", "debilidades, conflictos, por qué cambias de trabajo y salario"], ["Sem. 9–12", "Simulacros completos", "entrevistas de 30 minutos como si fueran de verdad, con retroalimentación"]];
  const HOME = {
    cars: "Ver el resumen de cada carrera de F1 en inglés.", games: "Poner sus videojuegos en inglés.", music: "Leer la letra de sus canciones favoritas mientras las escucha.",
    film: "Ver sus series con audio en inglés y subtítulos en inglés.", anime: "Ver anime con subtítulos en inglés en lugar de español.", football: "Ver los resúmenes de los partidos con narración en inglés.",
    sports: "Seguir a sus atletas favoritos en redes, en inglés.", horses: "Ver videos de equitación en inglés y anotar 3 palabras nuevas.", gym: "Seguir rutinas de ejercicio en YouTube en inglés.",
    travel: "Planear un viaje imaginario con páginas en inglés.", tech: "Ver reseñas de tecnología en inglés.", social: "Cambiar el idioma del celular y de sus apps a inglés.",
    fashion: "Ver videos de moda y estilo en inglés.", food: "Cocinar algo siguiendo una receta en inglés.", books: "Leer un libro corto o un cómic en inglés.",
    science: "Ver videos de divulgación científica en inglés.", art: "Ver tutoriales de arte o diseño en inglés.", animals: "Ver documentales de animales en inglés.",
    work: "Leer en inglés las vacantes que le interesan.", business: "Escuchar un podcast de negocios de 10 minutos al día."
  };

  window.MUESTRA = { INTERESTS, GOALS, PHRASES, DEFAULT_LESSON, suggest, topic, miniTest, levelOf, NEXT, MONTHS, WORK_PLAN, HOME,
    interest: k => INTERESTS.find(x => x.k === k), goal: k => GOALS.find(x => x.k === k) };
})();
