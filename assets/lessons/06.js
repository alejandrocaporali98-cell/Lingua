// Lesson 06 content. The player (assets/leccion.js) renders it.
window.CLASE = {
  id: "06",
  titulo: "Level Up",
  nivel: "A2–B1",
  color: "#be123c",
  icono: "pad",
  objetivos: [
    "Compare two things with -er / more … than",
    "Say which one is number one with the -est / the most",
    "Use the irregular ones: better, the best, worse, the worst"
  ],

  flash: [
    { img: "🚀", en: "fast → faster → the fastest", def: "Short adjectives add -er and -est.", ex: "An F1 car is faster than a Supra.", tag: "grammar" },
    { img: "↔️", en: "than", def: "Use it after a comparative.", ex: "Gran Turismo is more realistic than Mario Kart.", tag: "grammar" },
    { img: "➕", en: "more … / the most …", def: "Long adjectives use more and the most.", ex: "This is the most expensive car in the game.", tag: "grammar" },
    { img: "🥇", en: "good → better → the best", def: "Irregular. Never “gooder” or “more good”.", ex: "Your lap time is better than mine.", tag: "grammar" },
    { img: "👎", en: "bad → worse → the worst", def: "Irregular. Never “badder”.", ex: "This is the worst level in the game!", tag: "grammar" },
    { img: "🟢", en: "easy → easier → the easiest", def: "Adjectives that end in -y change to -ier and -iest.", ex: "Mario Kart is easier than Gran Turismo.", tag: "grammar" },
    { img: "🐘", en: "big → bigger → the biggest", def: "One vowel + one consonant at the end: double the last letter.", ex: "The new map is bigger.", tag: "grammar" },
    { img: "⚖️", en: "as … as", def: "The same.", ex: "My console is as fast as yours.", tag: "grammar" },
    { img: "🖼️", en: "graphics", def: "How the game looks.", ex: "The graphics in this game are incredible.", tag: "games" },
    { img: "🎮", en: "gameplay", def: "How the game feels when you play it.", ex: "The graphics are OK, but the gameplay is great.", tag: "games" },
    { img: "⬆️", en: "level up", def: "Go to the next level.", ex: "I need 200 points to level up.", tag: "games" },
    { img: "📸", en: "realistic", def: "Very similar to real life.", ex: "Gran Turismo is a realistic racing game.", tag: "games" },
    { img: "👥", en: "co-op", def: "Playing together on the same team.", ex: "Co-op games are more fun than solo games.", tag: "games" },
    { img: "⏱️", en: "lap time", def: "The time for one full lap of the track.", ex: "My best lap time at Suzuka is 1:35.", tag: "racing" },
    { img: "🪶", en: "heavy / light", def: "Weighs a lot / weighs a little.", ex: "A lighter car is faster in the corners.", tag: "cars" },
    { img: "🐢", en: "the slowest / the fastest", def: "Number one in speed: last place or first place.", ex: "Monaco is the slowest track in F1, and Monza is one of the fastest.", tag: "F1" }
  ],

  frases: [
    { p: "Which is faster, a Supra or an F1 car?", a: "An F1 car is much faster than a Supra.", w: ["An F1 car is more fast than a Supra.", "An F1 car is faster that a Supra.", "An F1 car is more faster than a Supra."], why: "Short adjectives: fast → faster. After it, use “than”, not “that”." },
    { p: "Which game is better?", a: "I think Gran Turismo is better.", w: ["I think Gran Turismo is more good.", "I think Gran Turismo is gooder.", "I think Gran Turismo is more better."], why: "Good → better (irregular)." },
    { p: "What's the best racing game?", a: "For me, the best is Forza Horizon.", w: ["For me, the better is Forza Horizon.", "For me, the most good is Forza Horizon.", "For me, the goodest is Forza Horizon."], why: "The best = number one." },
    { p: "Is the new game expensive?", a: "Yes, it's more expensive than the old one.", w: ["Yes, it's expensiver than the old one.", "Yes, it's more expensive that the old one.", "Yes, it's most expensive than the old one."], why: "Long adjectives: more + adjective + than." },
    { p: "Is Mario Kart difficult?", a: "No, it's easier than other racing games.", w: ["No, it's more easy than other racing games.", "No, it's easyer than other racing games.", "No, it's easier that other racing games."], why: "Easy → easier (y → ier)." },
    { p: "Is your lap time good today?", a: "No, it's worse than yesterday.", w: ["No, it's badder than yesterday.", "No, it's more bad than yesterday.", "No, it's worst than yesterday."], why: "Bad → worse → the worst." },
    { p: "Is your console as fast as mine?", a: "Yes, it's as fast as yours.", w: ["Yes, it's as fast than yours.", "Yes, it's so fast as yours.", "Yes, it's as faster as yours."], why: "The same: as + adjective + as." },
    { p: "Which is the hardest boss in the game?", a: "The final boss is the hardest of all.", w: ["The final boss is the most hard of all.", "The final boss is the harder of all.", "The final boss is hardest that all."], why: "Hard → the hardest." }
  ],

  gaps: {
    title: "Game review: Racer X vs. Drift King",
    text: "Complete the comparison of two racing games with a word from the word bank. Press Enter to check each one.",
    bank: ["faster", "than", "more", "the", "best", "worse", "bigger", "easier", "as", "most"],
    items: [
      { s: "Racer X is ___ than Drift King. The cars are super quick.", a: ["faster"], note: "Fast → faster." },
      { s: "But Drift King is more realistic ___ Racer X.", a: ["than"], note: "Comparative + than." },
      { s: "The graphics in Drift King are ___ beautiful.", a: ["more"], note: "Long adjective → more beautiful." },
      { s: "The map in Racer X is ___. It has 50 tracks!", a: ["bigger"], note: "Big → bigger (double the g)." },
      { s: "Racer X is ___ for beginners. The controls are simple.", a: ["easier"], note: "Easy → easier." },
      { s: "The music in Drift King is ___ than in Racer X. It's terrible!", a: ["worse"], note: "Bad → worse." },
      { s: "The online mode is ___ good as the story mode.", a: ["as"], note: "As + adjective + as = the same." },
      { s: "Tokyo is ___ coolest track in the game.", a: ["the"], note: "Superlatives use “the”." },
      { s: "It's the ___ difficult track, too. I always crash!", a: ["most"], note: "Long adjective → the most difficult." },
      { s: "In my opinion, Drift King is the ___ game of the year.", a: ["best"], note: "Good → better → the best." }
    ]
  },

  roleplay: {
    title: "Garage battle: which is better?",
    setup: "You and a friend are building a team in a racing game. You compare cars, tracks and games. Answer out loud with comparatives and superlatives. If you get stuck, look at the example.",
    lines: [
      { who: "Friend", t: "OK, we need a car. Supra or Skyline? Which one is better?" },
      { you: true, cue: "Choose one and compare (… is better than …).", model: "I think the Skyline is better than the Supra. It has all-wheel drive." },
      { who: "Friend", t: "Really? I think the Supra is faster on the straights." },
      { you: true, cue: "Answer with a comparative (more stable, lighter, cheaper…).", model: "Maybe, but the Skyline is more stable in the corners." },
      { who: "Friend", t: "Fine. Which track do we race on first?" },
      { you: true, cue: "Choose a track: the best / the most fun…", model: "Suzuka. It's the most fun track in the game." },
      { who: "Friend", t: "What's the hardest track for you?" },
      { you: true, cue: "Use the hardest / the most difficult.", model: "Monaco is the hardest. The streets are so narrow." },
      { who: "Friend", t: "And which console is the best for racing games?" },
      { you: true, cue: "Give your opinion and a reason.", model: "PlayStation is the best for me, because I love Gran Turismo." },
      { who: "Friend", t: "OK, last one: who is the best F1 driver of all time?" },
      { you: true, cue: "Choose one and compare with another driver.", model: "I think Senna is the best. He was better than everyone in the rain." }
    ],
    extra: "Now ask your teacher to compare two cars, two games and two teams. Ask: Which is better? Which is the fastest? What's the best … of all time?"
  },

  final: [
    { p: "An F1 car is ___ than a sports car.", a: "faster", w: ["more fast", "fastest", "more faster"], why: "Fast → faster." },
    { p: "This game is ___ than the old one.", a: "better", w: ["gooder", "more good", "best"], why: "Good → better." },
    { p: "It's the ___ game I have.", a: "best", w: ["better", "goodest", "most good"], why: "Good → the best." },
    { p: "Gran Turismo is more realistic ___ Mario Kart.", a: "than", w: ["that", "as", "of"], why: "Comparative + than." },
    { p: "This level is ___ than the last one.", a: "easier", w: ["more easy", "easyer", "easiest"], why: "Easy → easier." },
    { p: "My lap time today is ___ than yesterday. I crashed two times!", a: "worse", w: ["badder", "worst", "more bad"], why: "Bad → worse." },
    { p: "It's the ___ track of the season.", a: "most difficult", w: ["more difficult", "difficultest", "most difficultest"], why: "Long adjective → the most difficult." },
    { p: "The new map is ___ than the old one.", a: "bigger", w: ["biger", "more big", "biggest"], why: "Big → bigger (double the g)." },
    { p: "My console is as fast ___ yours.", a: "as", w: ["than", "like", "that"], why: "As + adjective + as." },
    { p: "This is the ___ car in the game. It costs 3 million credits.", a: "most expensive", w: ["expensivest", "more expensive", "most expensivest"], why: "Long adjective → the most expensive." },
    { p: "Monaco is the ___ track in F1.", a: "slowest", w: ["slower", "most slow", "slowerest"], why: "Slow → the slowest." },
    { p: "How the game looks = the ___", a: "graphics", w: ["gameplay", "controller", "level"], why: "Graphics = how the game looks." },
    { p: "How the game feels when you play = the ___", a: "gameplay", w: ["graphics", "soundtrack", "map"], why: "Gameplay = how it feels to play." },
    { p: "Go to the next level = ___", a: "level up", w: ["level down", "go out", "give up"], why: "Level up = go to the next level." },
    { p: "A ___ car is usually faster in the corners.", a: "lighter", w: ["heavier", "lightest", "more light"], why: "Light → lighter. Less weight helps in the corners." },
    { p: "Which is ___, the Supra or the Civic?", a: "faster", w: ["the fastest", "more fast", "fast"], why: "Two things → comparative (faster)." },
    { p: "Of all my friends, Diego is the ___ at racing games.", a: "best", w: ["better", "good", "most good"], why: "Number one in a group → the best." },
    { p: "Today is ___ than yesterday.", a: "hotter", w: ["hoter", "more hot", "hottest"], why: "Hot → hotter (double the t)." },
    { p: "This boss is ___ than the last one.", a: "harder", w: ["more hard", "hardest", "more harder"], why: "Hard → harder." },
    { p: "That was the ___ race of my life!", a: "worst", w: ["worse", "baddest", "most bad"], why: "Bad → the worst." }
  ]
};
