// Lesson 316 · Platinum (Erick · C1 · Music) · an album production game
window.CLASE = {
 "id": "316",
 "titulo": "Platinum",
 "nivel": "C1",
 "color": "#0f766e",
 "icono": "music",
 "tema": "Three million dollars and a blank tracklist. Choose the sound, the producer, the features and the studio, survive the label and release your album.",
 "objetivos": [
  "Make creative and business decisions and defend them out loud",
  "Talk about sound and production precisely: warm, polished, raw, layered, punchy",
  "Negotiate and handle setbacks: If we sign…, we’ll… / We should have…"
 ],
 "studio": {
  "budget": 3,
  "name": "An album production game",
  "cardsText": "Choose the sound, songwriting, producer, features, musicians, studio and release",
  "labels": {
   "craft": "Sound",
   "hype": "Buzz",
   "risk": "Risk",
   "fit": "Fits your sound ✓",
   "fitKey": "genre"
  },
  "how": [
   "You’re the artist. You have $3 million to make one album.",
   "Every card costs money. A record deal pays you money, but it comes with strings attached.",
   "Cards add Sound (quality), Buzz (hype) or Risk. Cards that fit your genre get a bonus.",
   "At every stage, defend your choices out loud: your teacher is your manager, your label and the press.",
   "On release day, the critics, the fans and the charts decide what you made."
  ],
  "kit": [
   {
    "t": "Making the call",
    "p": [
     "I’d rather go with… because…",
     "If we bring in…, we’ll be able to…",
     "That’s a risk worth taking.",
     "It’s worth every penny."
    ]
   },
   {
    "t": "Talking about sound",
    "p": [
     "It’s got a warm, analogue feel.",
     "The production is a bit too polished.",
     "The hook gets stuck in your head.",
     "It needs more space in the mix."
    ]
   },
   {
    "t": "The business side",
    "p": [
     "We’d lose creative control.",
     "The advance isn’t worth it if…",
     "Let’s not sign anything until…",
     "Let’s meet halfway."
    ]
   }
  ],
  "stages": [
   {
    "id": "brief",
    "kind": "brief",
    "t": "The brief",
    "min": 8,
    "blurb": "The budget, the rules and the phrasebook",
    "intro": "You’re the artist. You have three million dollars, a notebook full of ideas and one goal: an album people will still play in ten years.",
    "task": "Warm up",
    "talk": [
     "Which album would you call perfect from start to finish? Why?",
     "If you had three million dollars to make music, what would you spend most of it on?"
    ],
    "push": [
     "Keep it short. The game starts on the next screen."
    ]
   },
   {
    "id": "concept",
    "kind": "pick",
    "t": "The concept",
    "min": 15,
    "blurb": "Genre, concept, title and the album in one sentence",
    "intro": "Every great album has a sound and a reason to exist. Choose both, then give it a title.",
    "inputs": [
     {
      "key": "title",
      "label": "Album title",
      "ph": "e.g. Midnight Receipts"
     },
     {
      "key": "logline",
      "label": "The album in one sentence",
      "long": true,
      "ph": "An album about…, that sounds like…"
     }
    ],
    "slots": [
     {
      "key": "genre",
      "label": "Sound",
      "hint": "This decides which cards fit later.",
      "options": [
       {
        "id": "rnb",
        "name": "R&B",
        "role": "Smooth and emotional",
        "cost": 0,
        "desc": "Silky vocals, lush chords and late-night moods. Hugely popular and very crowded.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": []
       },
       {
        "id": "neosoul",
        "name": "Neo-soul",
        "role": "Warm and organic",
        "cost": 0,
        "desc": "Live drums, jazz chords and a lot of feeling. Critics love it; it rarely tops the charts.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "altpop",
        "name": "Alternative pop",
        "role": "Hooks with an edge",
        "cost": 0,
        "desc": "Big choruses with strange production. Easy to love, hard to make original.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "indie",
        "name": "Indie rock",
        "role": "Guitars and honesty",
        "cost": 0,
        "desc": "Loud guitars, raw vocals and songs about real life. A loyal but small audience.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "hiphop",
        "name": "Hip-hop",
        "role": "Beats and bars",
        "cost": 0,
        "desc": "The biggest genre in the world. Lyrics matter, and so does the beat.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": []
       },
       {
        "id": "folk",
        "name": "Acoustic folk",
        "role": "Stripped back",
        "cost": 0,
        "desc": "Voice, guitar and a story. Cheap to make, and it has to be perfect.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": []
       }
      ]
     },
     {
      "key": "concept",
      "label": "Concept",
      "options": [
       {
        "id": "breakup",
        "name": "A breakup album",
        "role": "Heartbreak",
        "cost": 0,
        "desc": "From the first fight to finally moving on. Everyone has lived it.",
        "craft": 0,
        "hype": 1,
        "risk": 0,
        "fit": [
         "rnb",
         "altpop",
         "folk"
        ]
       },
       {
        "id": "coming",
        "name": "Coming of age",
        "role": "Growing up",
        "cost": 0,
        "desc": "Leaving home, first jobs and figuring out who you are.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "indie",
         "folk",
         "hiphop"
        ]
       },
       {
        "id": "night",
        "name": "Late-night city",
        "role": "After midnight",
        "cost": 0,
        "desc": "Neon, taxis, empty streets and 3 a.m. thoughts.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "rnb",
         "neosoul",
         "hiphop"
        ]
       },
       {
        "id": "nineties",
        "name": "A love letter to the 90s",
        "role": "Throwback",
        "cost": 0,
        "desc": "Samples, textures and attitude from the decade that shaped R&B.",
        "craft": 0,
        "hype": 1,
        "risk": 0,
        "fit": [
         "rnb",
         "neosoul",
         "hiphop"
        ]
       },
       {
        "id": "story",
        "name": "One story, start to finish",
        "role": "Concept album",
        "cost": 0,
        "desc": "Every track is a chapter. Ambitious, risky and unforgettable when it works.",
        "craft": 2,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "task": "Pitch the album",
    "talk": [
     "Read your album title and your one-sentence description. Then pitch the album in sixty seconds.",
     "Why this sound? What can it say that other genres can’t?",
     "Name two albums that influenced yours, and say what you’re taking from each one."
    ],
    "push": [
     "Ask: “Who is this album for?” and “Why should anyone listen to it now?”",
     "If the description is vague, make him rewrite it out loud: what does it sound like, and what is it about?"
    ]
   },
   {
    "id": "writing",
    "kind": "pick",
    "t": "The songs",
    "min": 12,
    "blurb": "Who writes the songs",
    "intro": "The songs are everything. Do you write them alone, or bring in help?",
    "slots": [
     {
      "key": "write",
      "label": "Songwriting",
      "options": [
       {
        "id": "self",
        "name": "Write everything yourself",
        "role": "Total control",
        "cost": 0,
        "desc": "Every word is yours. It takes longer, and nobody tells you when a song isn’t good enough.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "indie",
         "folk",
         "neosoul"
        ]
       },
       {
        "id": "hitmaker",
        "name": "Co-write with a hit songwriter",
        "role": "Proven hooks",
        "cost": 0.6,
        "desc": "She has written five number-one singles. Her choruses are irresistible, and a bit predictable.",
        "craft": 2,
        "hype": 2,
        "risk": 0,
        "fit": [
         "altpop",
         "rnb"
        ]
       },
       {
        "id": "camp",
        "name": "A songwriting camp",
        "role": "Ten writers, one week",
        "cost": 0.4,
        "desc": "Ten writers and producers, one week, sixty song ideas. Some of them will be brilliant.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "hiphop",
         "altpop",
         "rnb"
        ]
       },
       {
        "id": "demos",
        "name": "Rework your old demos",
        "role": "The songs you already have",
        "cost": 0,
        "desc": "Your best songs might already exist on your phone. They need finishing, not replacing.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "neosoul",
         "folk",
         "rnb"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Why did you choose this way of writing? What are you giving up?",
     "What makes a lyric honest, and what makes it a cliché?",
     "If a co-writer changed your favourite line, would you fight for it?"
    ],
    "push": [
     "Push the trade-off: “Hits pay the bills. Why didn’t you hire the hit songwriter?”",
     "Listen for conditionals: If I wrote it all myself, I’d…"
    ]
   },
   {
    "id": "producer",
    "kind": "pick",
    "t": "The producer",
    "min": 12,
    "blurb": "Who shapes the sound",
    "intro": "The producer decides how your songs actually sound. Choose carefully: you’ll spend months in a small room together.",
    "slots": [
     {
      "key": "producer",
      "label": "Producer",
      "options": [
       {
        "id": "brooks",
        "name": "Darnell Brooks",
        "role": "Veteran soul producer",
        "cost": 0.8,
        "desc": "Thirty years of warm, analogue records. He works slowly and only with live instruments.",
        "craft": 3,
        "hype": 0,
        "risk": 0,
        "fit": [
         "rnb",
         "neosoul"
        ]
       },
       {
        "id": "vega",
        "name": "Kxng Vega",
        "role": "Hit-making beatmaker",
        "cost": 0.7,
        "desc": "Dark, heavy beats that dominate playlists. Every song will sound like a single.",
        "craft": 2,
        "hype": 2,
        "risk": 0,
        "fit": [
         "hiphop",
         "rnb",
         "altpop"
        ]
       },
       {
        "id": "holt",
        "name": "Mira Holt",
        "role": "Bedroom-pop producer",
        "cost": 0.3,
        "desc": "Strange textures, lo-fi charm and a cult following. She has never made a big-budget record.",
        "craft": 2,
        "hype": 1,
        "risk": 1,
        "fit": [
         "altpop",
         "indie"
        ]
       },
       {
        "id": "selfprod",
        "name": "Produce it yourself",
        "role": "Your vision",
        "cost": 0,
        "desc": "Nobody understands your sound better than you. Nobody will tell you when it’s finished, either.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "folk",
         "indie"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Describe the sound you want using three adjectives. Why is this producer the right person?",
     "What would you do if the producer wanted to change your sound completely?",
     "Which producer in real music history would you love to work with? Why?"
    ],
    "push": [
     "Ask him to describe one song in detail: tempo, instruments, the mood of the mix.",
     "Listen for precise vocabulary: warm, polished, raw, layered, punchy, lo-fi."
    ]
   },
   {
    "id": "feature",
    "kind": "pick",
    "t": "The feature",
    "min": 10,
    "blurb": "A guest artist, or nobody",
    "intro": "One guest verse can change an album’s life, or make it feel like a playlist. Who do you call?",
    "slots": [
     {
      "key": "feature",
      "label": "Featured artist",
      "options": [
       {
        "id": "star",
        "name": "A global superstar",
        "role": "One verse, a billion streams",
        "cost": 1.2,
        "desc": "Their name sells the album on its own. Their team wants approval on the single and the cover.",
        "craft": 0,
        "hype": 4,
        "risk": 1,
        "fit": [
         "altpop",
         "hiphop"
        ]
       },
       {
        "id": "underground",
        "name": "An underground rapper",
        "role": "Cult following",
        "cost": 0.2,
        "desc": "Fierce, clever and loved by the people who know. Almost nobody else has heard of them.",
        "craft": 1,
        "hype": 2,
        "risk": 0,
        "fit": [
         "hiphop",
         "rnb"
        ]
       },
       {
        "id": "legend",
        "name": "A soul legend, 70",
        "role": "The comeback duet",
        "cost": 0.5,
        "desc": "She hasn’t recorded in fifteen years. Critics would lose their minds.",
        "craft": 2,
        "hype": 2,
        "risk": 0,
        "fit": [
         "neosoul",
         "rnb",
         "folk"
        ]
       },
       {
        "id": "none",
        "name": "No features",
        "role": "Just you",
        "cost": 0,
        "desc": "Just you, start to finish. Critics respect it; streaming algorithms don’t.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": []
       }
      ]
     }
    ],
    "talk": [
     "Why this feature, or why none at all?",
     "The superstar’s team wants approval on your single. Do you accept? Negotiate.",
     "Which real collaboration do you think worked perfectly, and why?"
    ],
    "push": [
     "Be the superstar’s manager: “We want the single, the cover and the title.” Make him negotiate."
    ]
   },
   {
    "id": "sound",
    "kind": "pick",
    "t": "The sessions",
    "min": 15,
    "blurb": "Musicians, studio and mix",
    "intro": "Now you record it. Real players or programmed? A legendary studio or your bedroom? And who mixes it?",
    "slots": [
     {
      "key": "musicians",
      "label": "Musicians",
      "options": [
       {
        "id": "band",
        "name": "A live band in one room",
        "role": "Everyone together",
        "cost": 0.4,
        "desc": "Drums, bass, keys and guitar playing together, mistakes and all. You can hear the room.",
        "craft": 3,
        "hype": 0,
        "risk": 1,
        "fit": [
         "neosoul",
         "indie",
         "folk",
         "rnb"
        ]
       },
       {
        "id": "session",
        "name": "Session musicians",
        "role": "Professionals on demand",
        "cost": 0.3,
        "desc": "Perfect takes, recorded one instrument at a time.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "programmed",
        "name": "Everything programmed",
        "role": "Laptop production",
        "cost": 0.05,
        "desc": "Drum machines, synths and samples. Fast and cheap, and sometimes lifeless.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "hiphop",
         "altpop"
        ]
       },
       {
        "id": "strings",
        "name": "Add a string section",
        "role": "Cinematic",
        "cost": 0.3,
        "desc": "Twelve strings on three songs. Instant drama.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "rnb",
         "folk",
         "altpop"
        ]
       }
      ]
     },
     {
      "key": "studio",
      "label": "Studio",
      "options": [
       {
        "id": "analog",
        "name": "A legendary analogue studio",
        "role": "Tape machines and history",
        "cost": 0.6,
        "desc": "Old consoles, real tape and famous records on the walls.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "neosoul",
         "rnb",
         "indie"
        ]
       },
       {
        "id": "country",
        "name": "A residential studio in the countryside",
        "role": "Live where you record",
        "cost": 0.4,
        "desc": "Six weeks in a farmhouse with no distractions.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "folk",
         "indie"
        ]
       },
       {
        "id": "home",
        "name": "Your home studio",
        "role": "Free",
        "cost": 0,
        "desc": "Cheap and comfortable. The neighbours disagree.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": [
         "altpop",
         "hiphop"
        ]
       }
      ]
     },
     {
      "key": "mix",
      "label": "Mix and master",
      "options": [
       {
        "id": "starmix",
        "name": "A star mixing engineer",
        "role": "The final polish",
        "cost": 0.3,
        "desc": "Everything sounds bigger, clearer and more expensive.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "selfmix",
        "name": "Mix it yourself",
        "role": "Free",
        "cost": 0,
        "desc": "You know every sound by heart, which is exactly the problem.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "online",
        "name": "Cheap online mastering",
        "role": "Automatic",
        "cost": 0.02,
        "desc": "Uploaded at night, mastered by morning. Loud, flat and fine.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "talk": [
     "Describe the recording process from the first day to the final mix.",
     "Live band or programmed? Defend your choice as if your label wanted the other one.",
     "What’s the difference between a good mix and a great one?"
    ],
    "push": [
     "“Programming everything would save four hundred thousand dollars. Convince me.”"
    ]
   },
   {
    "id": "release",
    "kind": "pick",
    "t": "The release",
    "min": 12,
    "blurb": "Record deal and promotion",
    "intro": "A record deal pays you money, but it comes with strings attached. How are you going to release it, and how will people find it?",
    "slots": [
     {
      "key": "label",
      "label": "Record deal",
      "options": [
       {
        "id": "major",
        "name": "A major label deal",
        "role": "Big advance",
        "cost": -1.5,
        "desc": "A big advance, radio contacts and a marketing team. They also want a say in everything.",
        "craft": 0,
        "hype": 3,
        "risk": 1,
        "fit": [
         "altpop",
         "hiphop",
         "rnb"
        ]
       },
       {
        "id": "indielabel",
        "name": "An independent label",
        "role": "Freedom",
        "cost": -0.5,
        "desc": "A smaller advance, more freedom, and people who actually listen to your music.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "indie",
         "neosoul",
         "folk"
        ]
       },
       {
        "id": "selfrel",
        "name": "Release it yourself",
        "role": "You own everything",
        "cost": 0,
        "desc": "You keep every master and every decision. You also pay for everything.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "promo",
      "label": "Promotion",
      "options": [
       {
        "id": "video",
        "name": "A big-budget music video",
        "role": "Cinematic",
        "cost": 0.6,
        "desc": "A short film for the single, shot by a famous director.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "shorts",
        "name": "A short-video campaign",
        "role": "Clips and creators",
        "cost": 0.15,
        "desc": "Clips, challenges and creators. Cheap and completely unpredictable.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": [
         "altpop",
         "hiphop"
        ]
       },
       {
        "id": "tour",
        "name": "Tour first, release later",
        "role": "Test it live",
        "cost": 0.4,
        "desc": "Play the songs live before anyone hears the record.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "indie",
         "folk",
         "neosoul"
        ]
       },
       {
        "id": "silent",
        "name": "Let the music speak",
        "role": "No promotion",
        "cost": 0,
        "desc": "A surprise release with no warning. Mysterious, or invisible.",
        "craft": 0,
        "hype": -1,
        "risk": 0,
        "fit": []
       }
      ]
     }
    ],
    "talk": [
     "Major or independent? What are you giving up either way?",
     "How are you going to make people care about your album in a world of endless music?",
     "If the label demanded a shorter, radio-friendly version of your best song, what would you say?"
    ],
    "push": [
     "Be the label boss: “We pay the advance, we choose the single.” Make him negotiate."
    ]
   },
   {
    "id": "crisis",
    "kind": "events",
    "t": "Studio crises",
    "min": 15,
    "blurb": "Three things go wrong",
    "intro": "Making an album is never smooth. Here are the three worst moments. Choose how you handle each one, and explain it to your manager.",
    "events": [
     {
      "id": "voice",
      "when": "Day 9 in the studio",
      "t": "Your voice is gone",
      "text": "You’ve lost your voice, and the studio is booked for five more days.",
      "choices": [
       {
        "t": "Rest and rebook the studio",
        "cost": 0.2
       },
       {
        "t": "Sing through it: raw is real",
        "craft": 1,
        "risk": 2
       },
       {
        "t": "Let the producer fix it with vocal tuning",
        "craft": -1
       }
      ]
     },
     {
      "id": "single",
      "when": "Label meeting",
      "t": "They want a different single",
      "text": "The label wants the most commercial song as the first single, not your favourite.",
      "choices": [
       {
        "t": "Fight for your single",
        "craft": 1,
        "hype": -1
       },
       {
        "t": "Give them their single",
        "hype": 2,
        "craft": -1
       },
       {
        "t": "Release both on the same day",
        "cost": 0.1,
        "hype": 1
       }
      ]
     },
     {
      "id": "leak",
      "when": "Two weeks before release",
      "t": "The album leaks",
      "text": "All eleven songs are online, two weeks early.",
      "choices": [
       {
        "t": "Release it tonight",
        "hype": 1,
        "risk": 1
       },
       {
        "t": "Delay it and record three new songs",
        "cost": 0.3,
        "craft": 1,
        "hype": -1
       },
       {
        "t": "Pretend it was planned: drop a surprise deluxe edition",
        "cost": 0.1,
        "hype": 2,
        "risk": 1
       }
      ]
     }
    ],
    "task": "Explain it to your manager",
    "talk": [
     "For each crisis: what did you decide, and what would have happened if you had chosen differently?",
     "Which decision was the hardest? Why?",
     "What should an artist never compromise on?"
    ],
    "push": [
     "Be the stressed manager: “The leak is everywhere. You have ten minutes to decide.”",
     "Push for third conditionals and should have: If I had rested…, I would have… / We should have…"
    ]
   },
   {
    "id": "premiere",
    "kind": "premiere",
    "t": "Release day",
    "min": 14,
    "blurb": "The cover, the reviews and the charts",
    "intro": "It’s midnight and the album is out. Here’s what the critics, the fans and the charts made of it.",
    "task": "The interview",
    "talk": [
     "Radio interview: your teacher is the host. Talk about the album, the title and the sound.",
     "Read the reviews. Which one is fair, and which one would you answer back to?",
     "What should you have done differently? Use should have and if I had…"
    ],
    "push": [
     "Ask like a journalist: “Some critics say the album is too long. Do you agree?” / “What’s the story behind the title?”",
     "End with: “What’s next for you?”"
    ]
   }
  ],
  "show": {
   "cover": "album",
   "top": "{name}",
   "topAnon": "Lingua Records",
   "by": "Produced by {producer}",
   "byAnon": "",
   "cast": [
    "feature"
   ],
   "castLabel": "featuring",
   "sub": [
    "genre",
    "concept"
   ],
   "nums": [
    "Critics",
    "Fans",
    "Revenue"
   ],
   "credits": [
    [
     "write",
     "Songwriting"
    ],
    [
     "producer",
     "Produced by"
    ],
    [
     "musicians",
     "Musicians"
    ],
    [
     "studio",
     "Recorded at"
    ],
    [
     "mix",
     "Mix and master"
    ],
    [
     "label",
     "Released on"
    ],
    [
     "promo",
     "Promotion"
    ]
   ],
   "outlets": [
    "Wax & Wire",
    "The Liner Notes",
    "The Lingua Review"
   ],
   "tagline": "Lead single",
   "taglinePh": "The title of the first single",
   "verdicts": [
    "An instant classic",
    "The critics’ favourite",
    "A chart-topper",
    "A flop",
    "A cult record in the making",
    "A solid release"
   ],
   "extra": [
    "A confident record from an artist who knows exactly who they are.",
    "There’s a great EP hiding inside this album.",
    "The closing track alone is worth the price."
   ],
   "done": [
    "Album released ✓",
    "Release it: finish the class",
    "Album released"
   ],
   "miss": "Go back and finish, or release it as it is."
  },
  "reviews": [
   {
    "if": "producer=brooks",
    "t": "Darnell Brooks’s production is warm enough to live in."
   },
   {
    "if": "producer=vega",
    "t": "Every song hits like a single, which is both the strength and the problem."
   },
   {
    "if": "producer=holt",
    "t": "Strange, hazy and impossible to stop playing."
   },
   {
    "if": "feature=star",
    "t": "The superstar verse is great, but it sounds like it belongs on a different album."
   },
   {
    "if": "feature=legend",
    "t": "The duet with a soul legend is the musical moment of the year."
   },
   {
    "if": "feature=none",
    "t": "No guests, no distractions: just a voice that doesn’t need help."
   },
   {
    "if": "musicians=band",
    "t": "You can hear the room: a real band, playing together, mistakes and all."
   },
   {
    "if": "musicians=programmed",
    "t": "Every sound is perfect, and some of them feel a little lifeless."
   },
   {
    "if": "studio=home",
    "t": "Recorded in a bedroom, and somehow that’s the point."
   },
   {
    "if": "label=major",
    "t": "The radio-friendly polish is all over it."
   },
   {
    "if": "promo=video",
    "t": "The video for the lead single is everywhere this week."
   },
   {
    "if": "write=self",
    "t": "Every lyric sounds lived-in."
   },
   {
    "if": "mix=selfmix",
    "t": "The mix is muddy in places. Somebody should have hired an engineer."
   },
   {
    "if": "ev:voice=1",
    "t": "The cracked, raw vocals on the closing track are devastating."
   },
   {
    "if": "ev:single=0",
    "t": "Thank goodness the right song was the single."
   },
   {
    "if": "ev:single=1",
    "t": "The single is catchy, but it’s the least interesting song here."
   },
   {
    "if": "ev:leak=2",
    "t": "Turning a leak into a surprise deluxe edition was genius."
   },
   {
    "if": "risky",
    "t": "Messy, brave and impossible to ignore."
   },
   {
    "if": "over",
    "t": "You can hear every dollar, and a few that weren’t in the budget."
   },
   {
    "if": "fit",
    "t": "An artist who knows exactly what kind of record they’re making."
   },
   {
    "if": "high",
    "t": "One of the albums of the year."
   },
   {
    "if": "low",
    "t": "Forty-five minutes I will never get back."
   }
  ]
 },
 "plan": {
  "min": 120,
  "steps": [
   {
    "sec": "brief",
    "min": 8,
    "tip": "Explain the rules and read the phrasebook together."
   },
   {
    "sec": "concept",
    "min": 15,
    "tip": "He types the title and the one-sentence description, then pitches. Make him sharpen it."
   },
   {
    "sec": "writing",
    "min": 12,
    "tip": "Push the trade-off between control and hits."
   },
   {
    "sec": "producer",
    "min": 12,
    "tip": "Ask him to describe one song in detail: tempo, instruments, mood."
   },
   {
    "sec": "feature",
    "min": 10,
    "tip": "Negotiation: you’re the superstar’s manager."
   },
   {
    "sec": "sound",
    "min": 15,
    "tip": "Live vs programmed debate. Listen for precise sound vocabulary."
   },
   {
    "sec": "release",
    "min": 12,
    "tip": "Be the label boss. Major vs independent."
   },
   {
    "sec": "crisis",
    "min": 15,
    "tip": "Third conditionals and should have."
   },
   {
    "sec": "premiere",
    "min": 14,
    "tip": "Radio interview, then read the reviews together."
   },
   {
    "label": "Wrap-up",
    "sec": "_end",
    "min": 7,
    "tip": "Set homework. He can replay the game at home with a different sound."
   }
  ],
  "homework": "Play the game again at home with a different sound and a different record deal. Then write a 250-word press release for your favourite version: what the album is about, how it was made and why people should listen."
 }
};
