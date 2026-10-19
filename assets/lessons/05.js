// Lesson 05 content. The player (assets/leccion.js) renders it.
window.CLASE = {
  id: "05",
  titulo: "Matchday",
  nivel: "A2",
  color: "#15803d",
  icono: "ball",
  objetivos: [
    "Tell the story of a match with the past simple",
    "Use regular (-ed) and irregular verbs: won, lost, went, saw…",
    "Ask about the past with Did…? and answer with didn’t"
  ],

  flash: [
    { img: "⚽", en: "score a goal", def: "Put the ball in the net.", ex: "He scored a goal in the last minute.", tag: "football" },
    { img: "🏆", en: "win → won", def: "Get more goals than the other team.", ex: "We won 2–1! (Not: we winned)", tag: "past" },
    { img: "😞", en: "lose → lost", def: "The other team gets more goals.", ex: "They lost the final.", tag: "past" },
    { img: "🥊", en: "beat → beat", def: "Win against a team. The past is the same.", ex: "We beat them 3–0.", tag: "past" },
    { img: "🤝", en: "draw", def: "The same score for both teams. In the US: a tie.", ex: "It was a draw: 1–1.", tag: "football" },
    { img: "⏸️", en: "half-time", def: "The break in the middle of the match.", ex: "At half-time, the score was 0–0.", tag: "football" },
    { img: "🟨", en: "referee", def: "The person who controls the match.", ex: "The referee gave a red card.", tag: "football" },
    { img: "🎯", en: "penalty", def: "A free shot from the penalty spot.", ex: "He missed the penalty!", tag: "football" },
    { img: "🧤", en: "goalkeeper", def: "The player who stops the ball in the goal.", ex: "The goalkeeper saved the penalty.", tag: "football" },
    { img: "📣", en: "fans", def: "People who support a team.", ex: "The fans sang for the whole match.", tag: "football" },
    { img: "⏪", en: "was / were", def: "The past of am, is and are.", ex: "I was tired. The fans were happy.", tag: "past" },
    { img: "🚶", en: "go → went", def: "The past of go.", ex: "We went to the stadium last Saturday.", tag: "past" },
    { img: "👀", en: "see → saw", def: "The past of see.", ex: "I saw the match on TV.", tag: "past" },
    { img: "❌", en: "didn't + verb", def: "The negative in the past. Use the base verb.", ex: "We didn't win. (Not: didn't won)", tag: "past" },
    { img: "📅", en: "last weekend", def: "The weekend before this one.", ex: "Last weekend, I played football with my cousins.", tag: "time" },
    { img: "⏳", en: "ago", def: "Before now. Time + ago.", ex: "The match started ten minutes ago.", tag: "time" }
  ],

  frases: [
    { p: "What did you do last weekend?", a: "I went to the stadium with my dad.", w: ["I go to the stadium with my dad.", "I goed to the stadium with my dad.", "I did went to the stadium with my dad."], why: "Go → went (irregular). Don't use “did” in a positive sentence." },
    { p: "Did your team win?", a: "No, we didn't. We lost 2–0.", w: ["No, we didn't. We losed 2–0.", "No, we don't. We lost 2–0.", "No, we didn't won. We lost 2–0."], why: "Did → didn't. Lose → lost." },
    { p: "Who scored the goal?", a: "Our striker scored it.", w: ["Our striker score it.", "Our striker was score it.", "Our striker scoreds it."], why: "Regular verbs add -ed: score → scored." },
    { p: "Did you watch the match?", a: "Yes, I did. I watched it on TV.", w: ["Yes, I watched. I watched it on TV.", "Yes, I did. I watch it on TV.", "Yes, I do. I watched it on TV."], why: "Short answer: Yes, I did / No, I didn't." },
    { p: "How was the match?", a: "It was amazing!", w: ["It were amazing!", "Was amazing!", "It is was amazing!"], why: "It → was. Always use a subject." },
    { p: "What was the score?", a: "It was a draw, 1–1.", w: ["It was a tie of 1–1.", "It were a draw, 1–1.", "It was draw, 1–1."], why: "Same score = a draw (or a tie in the US)." },
    { p: "Did the referee see the foul?", a: "No, he didn't see it.", w: ["No, he didn't saw it.", "No, he not saw it.", "No, he don't see it."], why: "After didn't, use the base verb: see." },
    { p: "When did the match start?", a: "It started an hour ago.", w: ["It started ago an hour.", "It started before one hour.", "It starts an hour ago."], why: "Time + ago: an hour ago." }
  ],

  gaps: {
    title: "The derby",
    text: "Complete the story of the match with a word from the word bank. Press Enter to check each one.",
    bank: ["went", "was", "were", "scored", "won", "didn't", "saw", "ago", "last", "beat"],
    items: [
      { s: "___ Saturday, I watched the derby with my cousins.", a: ["last"], note: "Last Saturday = the Saturday before now." },
      { s: "We ___ to the stadium at five o'clock.", a: ["went"], note: "Go → went." },
      { s: "The stadium ___ full of fans.", a: ["was"], note: "It → was." },
      { s: "The fans ___ so loud!", a: ["were"], note: "They → were." },
      { s: "Our striker ___ a goal in the 20th minute.", a: ["scored"], note: "Score → scored." },
      { s: "The other team ___ score in the first half.", a: ["didn't", "did not"], note: "Negative past: didn't + base verb." },
      { s: "I ___ a red card in the second half.", a: ["saw"], note: "See → saw." },
      { s: "In the end, we ___ them 2–1.", a: ["beat"], note: "Beat → beat (the same in the past)." },
      { s: "We ___ the derby! Everyone was happy.", a: ["won"], note: "Win → won." },
      { s: "That was two days ___, and I still talk about it.", a: ["ago"], note: "Two days ago = two days before now." }
    ]
  },

  roleplay: {
    title: "Post-match interview",
    setup: "You are a player. Your team just played a big match, and a TV reporter wants to talk to you. Answer out loud in the past simple. If you get stuck, look at the example.",
    lines: [
      { who: "Reporter", t: "Congratulations! How do you feel?" },
      { you: true, cue: "Say how you feel and the result.", model: "I feel great! We won 3–1." },
      { who: "Reporter", t: "Tell us about your goal. What happened?" },
      { you: true, cue: "Describe your goal in the past.", model: "I got the ball, I ran fast and I kicked it into the corner." },
      { who: "Reporter", t: "The first half was difficult. What happened?" },
      { you: true, cue: "Talk about the first half.", model: "Yes, they scored first, and we didn't play well." },
      { who: "Reporter", t: "What did the coach say at half-time?" },
      { you: true, cue: "Say what the coach said.", model: "He said: “Be calm and pass the ball.”" },
      { who: "Reporter", t: "Did you see the red card?" },
      { you: true, cue: "Answer with Yes, I did / No, I didn't.", model: "Yes, I did. It was a hard foul." },
      { who: "Reporter", t: "Who do you want to thank?" },
      { you: true, cue: "Thank the fans or your family.", model: "I want to thank the fans. They were amazing tonight." },
      { who: "Reporter", t: "Thank you, and congratulations again!" },
      { you: true, cue: "Say goodbye.", model: "Thanks! See you at the next match." }
    ],
    extra: "Now you are the reporter. Ask your teacher about the last match or race he watched: What did you watch? Who won? Was it exciting?"
  },

  final: [
    { p: "We ___ the match 3–0!", a: "won", w: ["winned", "win", "wins"], why: "Win → won." },
    { p: "They ___ the final.", a: "lost", w: ["losed", "lose", "loosed"], why: "Lose → lost." },
    { p: "Yesterday I ___ to the stadium.", a: "went", w: ["go", "goed", "gone"], why: "Go → went." },
    { p: "The fans ___ very happy.", a: "were", w: ["was", "are been", "be"], why: "They → were." },
    { p: "The match ___ boring.", a: "was", w: ["were", "is was", "been"], why: "It → was." },
    { p: "___ you watch the match last night?", a: "Did", w: ["Do", "Were", "Was"], why: "Questions in the past: Did + you + base verb." },
    { p: "We didn't ___ the penalty.", a: "score", w: ["scored", "scores", "scoring"], why: "After didn't → base verb." },
    { p: "He ___ a great goal with his head.", a: "scored", w: ["score", "scoring", "did scored"], why: "Score → scored." },
    { p: "I ___ the match on TV.", a: "saw", w: ["seed", "see", "seen"], why: "See → saw." },
    { p: "The same score for both teams = a ___.", a: "draw", w: ["win", "penalty", "foul"], why: "Draw = the same score." },
    { p: "The person who controls the match is the ___.", a: "referee", w: ["coach", "goalkeeper", "captain"], why: "The referee controls the match." },
    { p: "The ___ saved the penalty.", a: "goalkeeper", w: ["referee", "striker", "fan"], why: "The goalkeeper stops the ball." },
    { p: "The break in the middle of the match is ___.", a: "half-time", w: ["extra time", "kick-off", "full-time"], why: "Half-time = the break in the middle." },
    { p: "The match started ten minutes ___.", a: "ago", w: ["before", "past", "after"], why: "Time + ago." },
    { p: "___ weekend, I played video games with my friends.", a: "Last", w: ["Past", "Before", "Ago"], why: "Last weekend = the weekend before now." },
    { p: "Did your team win? — No, it ___.", a: "didn't", w: ["doesn't", "wasn't", "not won"], why: "Short answer in the past: No, it didn't." },
    { p: "Our team ___ very well in the second half.", a: "played", w: ["plaid", "play", "playing"], why: "Play → played." },
    { p: "We ___ them 2–1 in the final!", a: "beat", w: ["beated", "won", "winned"], why: "You beat a team. You win a match." },
    { p: "The ___ sang for 90 minutes.", a: "fans", w: ["referees", "goals", "penalties"], why: "Fans = people who support a team." },
    { p: "He didn't ___ the ball. He missed it!", a: "kick", w: ["kicked", "kicks", "kicking"], why: "After didn't → base verb." }
  ]
};
