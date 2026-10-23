// Lesson 03 content. The player (assets/leccion.js) renders it.
window.CLASE = {
 "id": "03",
 "titulo": "Race Day",
 "nivel": "A2",
 "color": "#b45309",
 "icono": "clock",
 "objetivos": [
  "Talk about your daily routine with the present simple",
  "Tell the time: o’clock, half past, quarter to",
  "Say how often you do things: always, usually, sometimes, never"
 ],
 "flash": [
  {
   "img": "⏰",
   "en": "wake up",
   "def": "Open your eyes after sleeping.",
   "ex": "I wake up at 6:30 on school days.",
   "tag": "routine"
  },
  {
   "img": "🛏️",
   "en": "get up",
   "def": "Get out of bed.",
   "ex": "I wake up at 6:30, but I get up at 6:45!",
   "tag": "routine"
  },
  {
   "img": "🥣",
   "en": "have breakfast",
   "def": "Eat the first meal of the day.",
   "ex": "I have breakfast at seven. (Not: I take breakfast)",
   "tag": "routine"
  },
  {
   "img": "🚿",
   "en": "take a shower",
   "def": "Wash your body with water.",
   "ex": "I take a shower before school.",
   "tag": "routine"
  },
  {
   "img": "👕",
   "en": "get dressed",
   "def": "Put on your clothes.",
   "ex": "I get dressed in five minutes.",
   "tag": "routine"
  },
  {
   "img": "📚",
   "en": "do homework",
   "def": "Do the work from school at home.",
   "ex": "I do my homework after lunch. (Not: make homework)",
   "tag": "routine"
  },
  {
   "img": "🌙",
   "en": "go to bed",
   "def": "Lie down to sleep at night.",
   "ex": "I go to bed at 11 on weekends.",
   "tag": "routine"
  },
  {
   "img": "🕖",
   "en": "o'clock",
   "def": "Exactly on the hour.",
   "ex": "It's seven o'clock. (7:00)",
   "tag": "time"
  },
  {
   "img": "🕣",
   "en": "half past",
   "def": "30 minutes after the hour.",
   "ex": "It's half past eight. (8:30)",
   "tag": "time"
  },
  {
   "img": "🕘",
   "en": "quarter past / quarter to",
   "def": "15 minutes after / 15 minutes before the hour.",
   "ex": "Quarter past nine (9:15). Quarter to ten (9:45).",
   "tag": "time"
  },
  {
   "img": "✅",
   "en": "always",
   "def": "100% of the time.",
   "ex": "I always brush my teeth before bed.",
   "tag": "how often"
  },
  {
   "img": "👍",
   "en": "usually",
   "def": "Most of the time.",
   "ex": "I usually take the bus to school.",
   "tag": "how often"
  },
  {
   "img": "🤷",
   "en": "sometimes",
   "def": "Some days, not every day.",
   "ex": "I sometimes play video games after school.",
   "tag": "how often"
  },
  {
   "img": "🚫",
   "en": "never",
   "def": "0% of the time.",
   "ex": "I never wake up before six on Sunday.",
   "tag": "how often"
  },
  {
   "img": "🔁",
   "en": "practice",
   "def": "Do something many times to get better.",
   "ex": "F1 drivers practice on Friday, and the race is on Sunday.",
   "tag": "F1"
  },
  {
   "img": "⏱️",
   "en": "qualifying",
   "def": "The session that decides who starts at the front.",
   "ex": "Qualifying is on Saturday.",
   "tag": "F1"
  }
 ],
 "frases": [
  {
   "p": "What time do you wake up?",
   "a": "I wake up at half past six.",
   "w": [
    "I wake up in half past six.",
    "I wake up at six and half.",
    "I wake me up at half past six."
   ],
   "why": "Use “at” with times. 6:30 = half past six (or six thirty)."
  },
  {
   "p": "What does your dad do in the morning?",
   "a": "He drinks coffee and goes to work.",
   "w": [
    "He drink coffee and go to work.",
    "He drinks coffee and go to work.",
    "He is drink coffee and goes to work."
   ],
   "why": "He, she, it → add -s to every verb: drinks, goes."
  },
  {
   "p": "Do you have breakfast every day?",
   "a": "Yes, I usually have cereal.",
   "w": [
    "Yes, I usually take cereal.",
    "Yes, usually I have cereal always.",
    "Yes, I have usually cereal."
   ],
   "why": "We “have” breakfast (not take). “Usually” goes before the verb."
  },
  {
   "p": "What time is it?",
   "a": "It's quarter to eight.",
   "w": [
    "Is quarter to eight.",
    "They are quarter to eight.",
    "It's eight less quarter."
   ],
   "why": "Always start with “It's”. 7:45 = quarter to eight."
  },
  {
   "p": "Does your sister play video games?",
   "a": "No, she doesn't. She prefers music.",
   "w": [
    "No, she don't. She prefers music.",
    "No, she doesn't. She prefer music.",
    "No, she isn't. She prefers music."
   ],
   "why": "She → doesn't, prefers."
  },
  {
   "p": "When do you do your homework?",
   "a": "I do it after lunch.",
   "w": [
    "I make it after lunch.",
    "I do it after of lunch.",
    "I do it in after lunch."
   ],
   "why": "Do homework, not make homework. “After lunch” has no “of”."
  },
  {
   "p": "Are you late for school?",
   "a": "I'm never late for school.",
   "w": [
    "I never am late for school.",
    "I'm late never for school.",
    "I don't never late for school."
   ],
   "why": "With “be”, the frequency word goes after it: I'm never late."
  },
  {
   "p": "What do F1 drivers do on Friday?",
   "a": "They practice on the track.",
   "w": [
    "They practices on the track.",
    "They practice in the track.",
    "They are practice on the track."
   ],
   "why": "They → practice (no -s). We say “on the track”."
  }
 ],
 "gaps": {
  "title": "A driver's race day",
  "text": "Complete the routine of Leo, a young driver, with a word from the word bank. Press Enter to check each one.",
  "bank": [
   "wakes",
   "has",
   "at",
   "on",
   "past",
   "to",
   "usually",
   "never",
   "doesn't",
   "goes"
  ],
  "items": [
   {
    "s": "On race day, Leo ___ up at six o'clock.",
    "a": [
     "wakes"
    ],
    "note": "He → wakes (add -s)."
   },
   {
    "s": "He ___ a big breakfast with eggs and fruit.",
    "a": [
     "has"
    ],
    "note": "We say “have breakfast”. He → has."
   },
   {
    "s": "He arrives at the track ___ half past eight.",
    "a": [
     "at"
    ],
    "note": "At + time."
   },
   {
    "s": "The race is ___ Sunday.",
    "a": [
     "on"
    ],
    "note": "On + day."
   },
   {
    "s": "At quarter ___ ten (10:15), he talks to his engineer.",
    "a": [
     "past"
    ],
    "note": "10:15 = quarter past ten."
   },
   {
    "s": "At quarter ___ two (1:45), he gets in the car.",
    "a": [
     "to"
    ],
    "note": "1:45 = quarter to two."
   },
   {
    "s": "He ___ feels nervous before the start. It happens almost every race.",
    "a": [
     "usually"
    ],
    "note": "Usually = most of the time. It goes before the verb."
   },
   {
    "s": "He ___ eats fast food before a race. Not one time!",
    "a": [
     "never"
    ],
    "note": "Never = 0% of the time."
   },
   {
    "s": "His teammate ___ like the hot weather.",
    "a": [
     "doesn't",
     "does not"
    ],
    "note": "He → doesn't + verb."
   },
   {
    "s": "After the race, he ___ to bed early.",
    "a": [
     "goes"
    ],
    "note": "He → goes (go + es)."
   }
  ]
 },
 "roleplay": {
  "title": "Interview: a day in your life",
  "setup": "A sports journalist is writing about young people and their routines. Answer out loud with your real routine. If you get stuck, look at the example.",
  "lines": [
   {
    "who": "Journalist",
    "t": "Hi! Thanks for your time. What time do you wake up on school days?"
   },
   {
    "you": true,
    "cue": "Say the time. Use “at”.",
    "model": "I usually wake up at quarter past six."
   },
   {
    "who": "Journalist",
    "t": "That's early! What do you have for breakfast?"
   },
   {
    "you": true,
    "cue": "Say what you eat and drink.",
    "model": "I have cereal and orange juice. Sometimes I have eggs."
   },
   {
    "who": "Journalist",
    "t": "How do you go to school?"
   },
   {
    "you": true,
    "cue": "By car, by bus or on foot? How long does it take?",
    "model": "My mom takes me by car. It takes 20 minutes."
   },
   {
    "who": "Journalist",
    "t": "What do you do after school?"
   },
   {
    "you": true,
    "cue": "Talk about two or three activities.",
    "model": "I have lunch, I do my homework and then I play video games."
   },
   {
    "who": "Journalist",
    "t": "How often do you watch F1?"
   },
   {
    "you": true,
    "cue": "Use always, usually, sometimes or never.",
    "model": "I always watch the race on Sunday, and I sometimes watch qualifying."
   },
   {
    "who": "Journalist",
    "t": "And what time do you go to bed?"
   },
   {
    "you": true,
    "cue": "Say the time. Is it different on weekends?",
    "model": "I go to bed at ten, but on weekends I go to bed at midnight."
   },
   {
    "who": "Journalist",
    "t": "Great, thank you!"
   },
   {
    "you": true,
    "cue": "Say goodbye.",
    "model": "You're welcome. Have a good day!"
   }
  ],
  "extra": "Now you are the journalist. Ask your teacher about his routine: what time he wakes up, what he does at work and what he does on weekends. Use “What time do you…?” and “How often do you…?”"
 },
 "final": [
  {
   "p": "She ___ up at seven every day.",
   "a": "gets",
   "w": [
    "get",
    "getting",
    "is get"
   ],
   "why": "She → gets."
  },
  {
   "p": "I ___ breakfast at home.",
   "a": "have",
   "w": [
    "take",
    "make",
    "drink"
   ],
   "why": "We say “have breakfast”."
  },
  {
   "p": "He ___ his homework after lunch.",
   "a": "does",
   "w": [
    "makes",
    "do",
    "done"
   ],
   "why": "Do homework. He → does."
  },
  {
   "p": "8:30 = half ___ eight",
   "a": "past",
   "w": [
    "to",
    "after",
    "and"
   ],
   "why": "Half past = 30 minutes after the hour."
  },
  {
   "p": "9:45 = quarter ___ ten",
   "a": "to",
   "w": [
    "past",
    "for",
    "from"
   ],
   "why": "Quarter to = 15 minutes before the hour."
  },
  {
   "p": "The class starts ___ four o'clock.",
   "a": "at",
   "w": [
    "in",
    "on",
    "to"
   ],
   "why": "At + time."
  },
  {
   "p": "We play football ___ Saturdays.",
   "a": "on",
   "w": [
    "in",
    "at",
    "the"
   ],
   "why": "On + days."
  },
  {
   "p": "I ___ eat vegetables. I hate them!",
   "a": "never",
   "w": [
    "always",
    "usually",
    "often"
   ],
   "why": "Never = 0% of the time."
  },
  {
   "p": "I ___ late for class.",
   "a": "am never",
   "w": [
    "never am",
    "never",
    "am not never"
   ],
   "why": "With “be”, never goes after it: I am never late."
  },
  {
   "p": "___ your brother play football?",
   "a": "Does",
   "w": [
    "Do",
    "Is",
    "Are"
   ],
   "why": "Your brother = he → Does…?"
  },
  {
   "p": "My dad ___ coffee every morning.",
   "a": "drinks",
   "w": [
    "drink",
    "drinking",
    "drinkes"
   ],
   "why": "He → drinks."
  },
  {
   "p": "My friends ___ to school by bus.",
   "a": "go",
   "w": [
    "goes",
    "going",
    "gos"
   ],
   "why": "They → go (no -s)."
  },
  {
   "p": "She ___ like mornings.",
   "a": "doesn't",
   "w": [
    "don't",
    "isn't",
    "not"
   ],
   "why": "She → doesn't + verb."
  },
  {
   "p": "What time ___ it? It's noon.",
   "a": "is",
   "w": [
    "are",
    "does",
    "be"
   ],
   "why": "We ask: What time is it?"
  },
  {
   "p": "The session on Saturday that decides who starts at the front is ___.",
   "a": "qualifying",
   "w": [
    "practice",
    "the podium",
    "the pit stop"
   ],
   "why": "Qualifying decides the order at the start."
  },
  {
   "p": "Drivers ___ on Friday to get ready for the race.",
   "a": "practice",
   "w": [
    "practices",
    "practicing",
    "are practice"
   ],
   "why": "They → practice (no -s)."
  },
  {
   "p": "I ___ a shower in the morning.",
   "a": "take",
   "w": [
    "do",
    "make",
    "get"
   ],
   "why": "We say “take a shower”."
  },
  {
   "p": "Put on your clothes = get ___",
   "a": "dressed",
   "w": [
    "dress",
    "dressing",
    "clothes"
   ],
   "why": "Get dressed."
  },
  {
   "p": "12:00 at night is ___.",
   "a": "midnight",
   "w": [
    "noon",
    "midday",
    "morning"
   ],
   "why": "12:00 at night = midnight. 12:00 in the day = noon."
  },
  {
   "p": "I ___ go to the gym. Maybe two times a week.",
   "a": "sometimes",
   "w": [
    "never",
    "always",
    "sometime"
   ],
   "why": "Sometimes = some days, not every day."
  }
 ],
 "read": {
  "short": "A driver's race day",
  "kicker": "Racing · Behind the scenes",
  "title": "Race day: one day with a young driver",
  "before": "What time do you think a driver wakes up on race day? Guess before you read.",
  "text": [
   "On race day, Carla always [[wakes up]] early, at [[half past]] five. She doesn't drink coffee. She [[has breakfast]] with her team: eggs, bread and fruit.",
   "At seven [[o'clock]], she walks around the [[track]] with her engineer. They look at every corner. At [[quarter past]] eight, she gets in the car for [[practice]].",
   "[[Qualifying]] starts at eleven. Carla is usually nervous before it, but she never listens to music. She likes silence. After qualifying, she eats lunch and sleeps for twenty minutes.",
   "The race starts at three. After the race, she [[sometimes]] talks to journalists. At night, she watches the race again on her laptop. She [[goes to bed]] at ten. \"Tomorrow,\" she says, \"I start again.\""
  ],
  "gloss": {
   "track": "The road where a race happens.",
   "quarter past": "15 minutes after the hour.",
   "wakes up": "wake up = open your eyes after sleeping.",
   "has breakfast": "have breakfast = eat the first meal of the day.",
   "goes to bed": "go to bed = lie down to sleep at night."
  },
  "questions": [
   {
    "q": "What time does Carla wake up?",
    "a": "At 5:30",
    "w": [
     "At 5:15",
     "At 7:00"
    ],
    "ev": "at half past five"
   },
   {
    "q": "What does she do at seven o'clock?",
    "a": "She walks around the track.",
    "w": [
     "She has breakfast.",
     "She sleeps for twenty minutes."
    ],
    "ev": "she walks around the track with her engineer"
   },
   {
    "q": "True or false: Carla listens to music before qualifying.",
    "a": "False",
    "w": [
     "True"
    ],
    "ev": "she never listens to music"
   },
   {
    "q": "What does she do after lunch?",
    "a": "She sleeps for twenty minutes.",
    "w": [
     "She talks to journalists.",
     "She drinks coffee."
    ],
    "ev": "she eats lunch and sleeps for twenty minutes"
   },
   {
    "q": "What time does she go to bed?",
    "a": "At ten",
    "w": [
     "At eleven",
     "At three"
    ],
    "ev": "goes to bed at ten"
   }
  ],
  "after": "Tell your teacher about your Saturday. What time do you <b>wake up</b>? What do you <b>usually</b> do?"
 },
 "grammar": {
  "kind": "rule",
  "title": "he / she + verb-s",
  "intro": "In the present simple, he, she and it need an extra -s on the verb. It's small, but everyone hears it.",
  "pattern": [
   "He / she / it",
   "+verb + s",
   "=at seven"
  ],
  "note": "wake → wake<b>s</b>, go → go<b>es</b>, watch → watch<b>es</b>, have → <b>has</b>. Negative: she <b>doesn't</b> + verb (no -s).",
  "examples": [
   "She **wakes up** at half past five.",
   "He **goes** to bed at ten.",
   "She **watches** the race again.",
   "She **doesn't drink** coffee."
  ],
  "wrong": "She ~~wake up~~ at five.",
  "right": "She **wakes up** at five.",
  "task": "Your turn · choose the correct sentence",
  "drill": [
   {
    "p": "Carla · have breakfast · at six",
    "a": "Carla has breakfast at six.",
    "w": [
     "Carla have breakfast at six.",
     "Carla haves breakfast at six."
    ]
   },
   {
    "p": "My brother · go to school · at seven",
    "a": "My brother goes to school at seven.",
    "w": [
     "My brother go to school at seven.",
     "My brother gos to school at seven."
    ]
   },
   {
    "p": "She · not · drink coffee",
    "a": "She doesn't drink coffee.",
    "w": [
     "She doesn't drinks coffee.",
     "She don't drink coffee."
    ]
   },
   {
    "p": "Ask about your teammate's day.",
    "a": "What time does he get up?",
    "w": [
     "What time does he gets up?",
     "What time he gets up?"
    ]
   }
  ],
  "say": "Now describe the day of someone in your family with five verbs."
 }
};
