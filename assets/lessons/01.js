// Lesson 01 content. The player (assets/leccion.js) renders it.
window.CLASE = {
 "id": "01",
 "titulo": "Driver Profile",
 "nivel": "A1–A2",
 "color": "#2346d0",
 "icono": "helmet",
 "objetivos": [
  "Say your name, age and where you’re from correctly",
  "Talk about things you like with like, be into and be good at",
  "Answer questions about yourself in a short interview"
 ],
 "flash": [
  {
   "img": "🎂",
   "en": "I'm 15",
   "def": "Your age. We use “be”, not “have”.",
   "ex": "I'm 15 years old. (Not: I have 15.)",
   "tag": "basics"
  },
  {
   "img": "🌎",
   "en": "I'm from…",
   "def": "The country or city where you were born.",
   "ex": "I'm from Monterrey, Mexico.",
   "tag": "basics"
  },
  {
   "img": "🏠",
   "en": "I live in…",
   "def": "The place where your home is now.",
   "ex": "I live in Monterrey with my family.",
   "tag": "basics"
  },
  {
   "img": "🏷️",
   "en": "nickname",
   "def": "A short or funny name your friends call you.",
   "ex": "My name is Diego, but my nickname is Dee.",
   "tag": "word"
  },
  {
   "img": "⭐",
   "en": "favorite",
   "def": "The one you like the most.",
   "ex": "My favorite team is Ferrari.",
   "tag": "word"
  },
  {
   "img": "🎯",
   "en": "hobby",
   "def": "Something you do for fun in your free time.",
   "ex": "My hobbies are gaming and football.",
   "tag": "word"
  },
  {
   "img": "😍",
   "en": "be into",
   "def": "To like something a lot right now.",
   "ex": "I'm really into anime right now.",
   "tag": "phrase"
  },
  {
   "img": "🙌",
   "en": "be a big fan of",
   "def": "To love a team, a show or an artist.",
   "ex": "I'm a big fan of Attack on Titan.",
   "tag": "phrase"
  },
  {
   "img": "💪",
   "en": "be good at",
   "def": "To do something very well.",
   "ex": "I'm good at racing games.",
   "tag": "phrase"
  },
  {
   "img": "😤",
   "en": "I can't stand…",
   "def": "I really don't like it. I hate it.",
   "ex": "I can't stand traffic.",
   "tag": "phrase"
  },
  {
   "img": "🏎️",
   "en": "driver",
   "def": "A person who drives a race car.",
   "ex": "Checo Pérez is a Mexican driver. A pilot flies planes!",
   "tag": "F1"
  },
  {
   "img": "🤝",
   "en": "teammate",
   "def": "A person on the same team as you.",
   "ex": "In F1, your teammate is your first rival.",
   "tag": "F1"
  },
  {
   "img": "🚗",
   "en": "sports car",
   "def": "A small, fast car that is fun to drive.",
   "ex": "The Supra is a Japanese sports car.",
   "tag": "cars"
  },
  {
   "img": "💭",
   "en": "dream car",
   "def": "The car you want to have one day.",
   "ex": "My dream car is a Nissan Skyline R34.",
   "tag": "cars"
  },
  {
   "img": "📅",
   "en": "on weekends",
   "def": "On Saturdays and Sundays.",
   "ex": "On weekends, I play football with my friends.",
   "tag": "routine"
  },
  {
   "img": "🏁",
   "en": "track",
   "def": "The road where a race happens.",
   "ex": "Suzuka is my favorite track.",
   "tag": "F1"
  }
 ],
 "frases": [
  {
   "p": "How old are you?",
   "a": "I'm 15.",
   "w": [
    "I have 15.",
    "I have 15 years.",
    "Me 15 years."
   ],
   "why": "For age, use “be”: I'm 15 (years old)."
  },
  {
   "p": "Where are you from?",
   "a": "I'm from Monterrey.",
   "w": [
    "I am of Monterrey.",
    "I from Monterrey.",
    "I'm since Monterrey."
   ],
   "why": "Use “be from” for your city or country."
  },
  {
   "p": "Tell me about your hobbies.",
   "a": "I like playing football.",
   "w": [
    "I like play football.",
    "I'm like football.",
    "I like the football."
   ],
   "why": "Like + -ing. Sports don't use “the”."
  },
  {
   "p": "What are you into right now?",
   "a": "I'm really into anime.",
   "w": [
    "I'm really into the anime.",
    "I really into anime.",
    "I am into anime very much."
   ],
   "why": "When you talk in general, don't use “the”: into anime, into cars."
  },
  {
   "p": "Do you have brothers or sisters?",
   "a": "Yes, I have a little sister.",
   "w": [
    "Yes, I am a little sister.",
    "Yes, have a little sister.",
    "Yes, I have one sister little."
   ],
   "why": "Always use a subject (I), and the adjective goes first: a little sister."
  },
  {
   "p": "What's your favorite car?",
   "a": "My favorite car is the Supra.",
   "w": [
    "My car favorite is the Supra.",
    "The Supra is my car favorite.",
    "Mine favorite car is the Supra."
   ],
   "why": "The adjective goes before the noun: favorite car."
  },
  {
   "p": "Are you good at video games?",
   "a": "Yes, I'm pretty good at them.",
   "w": [
    "Yes, I'm good in them.",
    "Yes, I'm good for them.",
    "Yes, I good at them."
   ],
   "why": "Use “good at” for skills. “Good for” means healthy or useful."
  },
  {
   "p": "What do you do on weekends?",
   "a": "I usually play football with my friends.",
   "w": [
    "I play usually football with my friends.",
    "I usually am play football with my friends.",
    "Usually I play football with my friends of school."
   ],
   "why": "“Usually” goes before the main verb: I usually play."
  }
 ],
 "gaps": {
  "title": "My driver profile",
  "text": "Complete the profile with a word from the word bank. Press Enter to check each one.",
  "bank": [
   "am",
   "is",
   "are",
   "from",
   "into",
   "at",
   "favorite",
   "can't",
   "don't",
   "have"
  ],
  "items": [
   {
    "s": "My name ___ Diego.",
    "a": [
     "is"
    ],
    "note": "My name → is."
   },
   {
    "s": "I ___ 14 years old.",
    "a": [
     "am",
     "'m"
    ],
    "note": "I → am. Age uses “be”."
   },
   {
    "s": "I'm ___ Monterrey, Mexico.",
    "a": [
     "from"
    ],
    "note": "Use “be from” for your city."
   },
   {
    "s": "I ___ two brothers.",
    "a": [
     "have"
    ],
    "note": "Family members → have."
   },
   {
    "s": "My ___ team is McLaren.",
    "a": [
     "favorite",
     "favourite"
    ],
    "note": "Favorite + noun."
   },
   {
    "s": "I'm really ___ Japanese cars.",
    "a": [
     "into"
    ],
    "note": "Be into = like something a lot."
   },
   {
    "s": "I'm good ___ racing games.",
    "a": [
     "at"
    ],
    "note": "Good at, not good in or good for."
   },
   {
    "s": "I ___ play the guitar, but I want to learn.",
    "a": [
     "can't",
     "cannot",
     "can not"
    ],
    "note": "Can't = I don't know how to do it."
   },
   {
    "s": "My friends ___ big fans of Attack on Titan.",
    "a": [
     "are"
    ],
    "note": "They → are."
   },
   {
    "s": "I ___ like traffic. It's so boring!",
    "a": [
     "don't",
     "do not"
    ],
    "note": "Negative with I → don't."
   }
  ]
 },
 "roleplay": {
  "title": "Rookie press conference",
  "setup": "You are the new driver on the team, and the reporters have questions for you. Answer out loud with your real information. If you get stuck, look at the example.",
  "lines": [
   {
    "who": "Reporter",
    "t": "Welcome to the team! What's your name?"
   },
   {
    "you": true,
    "cue": "Say your name and your nickname, if you have one.",
    "model": "Thanks! My name is Diego, but my friends call me Dee."
   },
   {
    "who": "Reporter",
    "t": "How old are you, and where are you from?"
   },
   {
    "you": true,
    "cue": "Say your age and where you're from.",
    "model": "I'm 15, and I'm from Monterrey, Mexico."
   },
   {
    "who": "Reporter",
    "t": "Who is your favorite driver?"
   },
   {
    "you": true,
    "cue": "Your favorite driver and why (because…).",
    "model": "My favorite driver is Fernando Alonso, because he never gives up."
   },
   {
    "who": "Reporter",
    "t": "What do you do when you're not racing?"
   },
   {
    "you": true,
    "cue": "Talk about your hobbies.",
    "model": "I play video games, I watch anime and I play football with my friends."
   },
   {
    "who": "Reporter",
    "t": "Cool! What anime are you into?"
   },
   {
    "you": true,
    "cue": "Your favorite anime and one reason.",
    "model": "I'm really into Attack on Titan. The story is amazing."
   },
   {
    "who": "Reporter",
    "t": "Last question: what's your dream car?"
   },
   {
    "you": true,
    "cue": "Your dream car.",
    "model": "My dream car is a Nissan Skyline R34. It's a legend."
   },
   {
    "who": "Reporter",
    "t": "Thank you! Good luck this weekend."
   },
   {
    "you": true,
    "cue": "Say goodbye.",
    "model": "Thank you! See you on the track."
   }
  ],
  "extra": "Now you are the reporter. Ask your teacher three questions: about his car, his favorite music and what he does on weekends."
 },
 "final": [
  {
   "p": "I ___ 15 years old.",
   "a": "am",
   "w": [
    "have",
    "is",
    "are"
   ],
   "why": "Age uses “be”: I am 15."
  },
  {
   "p": "She ___ from Japan.",
   "a": "is",
   "w": [
    "are",
    "am",
    "be"
   ],
   "why": "She → is."
  },
  {
   "p": "My favorite ___ is Red Bull.",
   "a": "team",
   "w": [
    "teammate",
    "track",
    "driver"
   ],
   "why": "Red Bull is a team."
  },
  {
   "p": "I'm really ___ anime.",
   "a": "into",
   "w": [
    "in",
    "on",
    "at"
   ],
   "why": "Be into = like something a lot."
  },
  {
   "p": "He's good ___ football.",
   "a": "at",
   "w": [
    "in",
    "for",
    "on"
   ],
   "why": "Good at."
  },
  {
   "p": "I like ___ racing games.",
   "a": "playing",
   "w": [
    "play",
    "plays",
    "to playing"
   ],
   "why": "Like + -ing."
  },
  {
   "p": "___ you have a PlayStation?",
   "a": "Do",
   "w": [
    "Are",
    "Does",
    "Have"
   ],
   "why": "Questions with have: Do you have…?"
  },
  {
   "p": "My brother ___ drive. He's only 12!",
   "a": "can't",
   "w": [
    "don't",
    "isn't",
    "not can"
   ],
   "why": "He isn't able to → can't."
  },
  {
   "p": "Lando and Oscar drive for the same team. They're ___.",
   "a": "teammates",
   "w": [
    "classmates",
    "neighbors",
    "cousins"
   ],
   "why": "Same team → teammates."
  },
  {
   "p": "People call me Dee. It's my ___.",
   "a": "nickname",
   "w": [
    "last name",
    "surname",
    "full name"
   ],
   "why": "A short name your friends use → nickname."
  },
  {
   "p": "I can't ___ traffic. It's terrible.",
   "a": "stand",
   "w": [
    "like to",
    "support",
    "suffer"
   ],
   "why": "I can't stand = I really don't like. “Support” means to help or to cheer for."
  },
  {
   "p": "___ weekends, I sleep until 11.",
   "a": "On",
   "w": [
    "In",
    "At",
    "For"
   ],
   "why": "On weekends."
  },
  {
   "p": "Where are you from? I'm ___ Mexico.",
   "a": "from",
   "w": [
    "of",
    "in",
    "since"
   ],
   "why": "Be from."
  },
  {
   "p": "___ is your favorite anime?",
   "a": "What",
   "w": [
    "Who",
    "Where",
    "How"
   ],
   "why": "For a thing, ask with What."
  },
  {
   "p": "Checo Pérez is a Mexican ___.",
   "a": "driver",
   "w": [
    "pilot",
    "conductor",
    "chauffeur"
   ],
   "why": "Race cars → driver. Planes → pilot."
  },
  {
   "p": "A Supra is a Japanese ___ car.",
   "a": "sports",
   "w": [
    "sport's",
    "sporting",
    "sport"
   ],
   "why": "We say “sports car”, with an s."
  },
  {
   "p": "My sister and I ___ big fans of Bad Bunny.",
   "a": "are",
   "w": [
    "is",
    "am",
    "be"
   ],
   "why": "My sister and I = we → are."
  },
  {
   "p": "He ___ anime every night.",
   "a": "watches",
   "w": [
    "watch",
    "watching",
    "is watch"
   ],
   "why": "He → watches (add -es)."
  },
  {
   "p": "How old is your cousin?",
   "a": "He's 18.",
   "w": [
    "He has 18.",
    "He have 18 years.",
    "Is 18."
   ],
   "why": "He is 18. Always use a subject and “be”."
  },
  {
   "p": "Thank you! See you on the ___!",
   "a": "track",
   "w": [
    "pist",
    "runway",
    "road race"
   ],
   "why": "A race happens on a track. A runway is for planes."
  }
 ],
 "read": {
  "short": "Meet the new driver",
  "kicker": "Racing · Team page",
  "title": "Meet our new driver: Leo Vargas",
  "before": "Look at the title. What do you want to know about a new driver? Ask your teacher three questions.",
  "text": [
   "Hi! My name is Leo Vargas, but my friends call me \"Turbo\". It's my [[nickname]] because I talk very fast. I'm 16 and I'm from Guadalajara, in Mexico. I live in Monterrey with my mom and my little sister.",
   "I'm a karting [[driver]]. I drive for Team Norte, and my [[teammate]] is Sofía. She's 17 and she's very good at qualifying. I'm good at the start of the race.",
   "My [[favorite]] [[track]] is in Querétaro. It has a long straight and three fast corners. [[On weekends]], I practice there with my dad.",
   "I'm really [[into]] Formula 1, and I'm a big fan of Ferrari. My [[dream car]] is a red Ferrari 296. I can't stand rain on race day — the track is very slippery!"
  ],
  "gloss": {
   "into": "be into = to like something a lot right now."
  },
  "questions": [
   {
    "q": "Why do his friends call him \"Turbo\"?",
    "a": "Because he talks very fast.",
    "w": [
     "Because he drives a turbo car.",
     "Because he is very tall."
    ],
    "ev": "because I talk very fast"
   },
   {
    "q": "Where is Leo from?",
    "a": "Guadalajara",
    "w": [
     "Monterrey",
     "Querétaro"
    ],
    "ev": "I'm from Guadalajara, in Mexico"
   },
   {
    "q": "What is Sofía good at?",
    "a": "Qualifying",
    "w": [
     "The start of the race",
     "Driving in the rain"
    ],
    "ev": "she's very good at qualifying"
   },
   {
    "q": "True or false: Leo likes racing in the rain.",
    "a": "False",
    "w": [
     "True"
    ],
    "ev": "I can't stand rain on race day"
   },
   {
    "q": "What is his dream car?",
    "a": "A red Ferrari 296",
    "w": [
     "A white Supra",
     "A blue kart"
    ],
    "ev": "My dream car is a red Ferrari 296."
   }
  ],
  "after": "Now you! Make your own team page: your <b>nickname</b>, where you're <b>from</b>, what you're <b>good at</b> and your <b>dream car</b>."
 },
 "grammar": {
  "kind": "rule",
  "title": "be for age and where you're from",
  "intro": "In Spanish you \"have\" years. In English you \"are\" your age. The same verb tells people where you're from.",
  "pattern": [
   "I'm",
   "+15 / from Mexico",
   "=."
  ],
  "note": "Use <b>be</b> (I'm, he's, she's) for age, origin and how you are. Never <b>have</b> for age.",
  "examples": [
   "**I'm** 15.",
   "**I'm from** Monterrey.",
   "My teammate **is** 17.",
   "**She's from** Spain."
  ],
  "wrong": "I ~~have 15 years~~.",
  "right": "**I'm 15** (years old).",
  "task": "Your turn · choose the correct sentence",
  "drill": [
   {
    "p": "Your age is 15.",
    "a": "I'm 15.",
    "w": [
     "I have 15.",
     "I have 15 years."
    ]
   },
   {
    "p": "Sofía · 17 years old",
    "a": "She's 17 years old.",
    "w": [
     "She has 17 years old.",
     "She 17 years."
    ]
   },
   {
    "p": "You were born in Monterrey.",
    "a": "I'm from Monterrey.",
    "w": [
     "I from Monterrey.",
     "I'm of Monterrey."
    ]
   },
   {
    "p": "Ask a new friend about his age.",
    "a": "How old are you?",
    "w": [
     "How many years do you have?",
     "How old you are?"
    ]
   }
  ],
  "say": "Now say three sentences about you: your age, where you're from and where you live."
 }
};
