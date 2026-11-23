// Lesson 306 · Greenlight (Derek · C1 · Cinema) · a film production game
window.CLASE = {
 "id": "306",
 "titulo": "Greenlight",
 "nivel": "C1",
 "color": "#b45309",
 "icono": "clapper",
 "tema": "Twenty million dollars and one film. Hire the writers, cast the stars, choose the cameras, survive the shoot and face the critics.",
 "objetivos": [
  "Make production decisions and defend them out loud",
  "Talk about trade-offs and hypotheticals: If we hire…, we’ll… / I’d rather… because…",
  "The language of a real production: casting, crew, cameras, lenses and lighting"
 ],
 "studio": {
  "budget": 20,
  "how": [
   "You have $20 million to make one film. Every choice costs money.",
   "Each card adds Craft (quality), Star power (hype) or Risk. Cards that fit your genre get a bonus.",
   "At every stage, defend your choices out loud to the producer: your teacher.",
   "During the shoot, things go wrong. You decide how to fix them.",
   "At the premiere, the critics, the audience and the box office decide what you made."
  ],
  "kit": [
   {
    "t": "Making the call",
    "p": [
     "I’d rather go with… because…",
     "If we hire…, we’ll be able to…",
     "It’s worth every penny.",
     "That’s a risk worth taking."
    ]
   },
   {
    "t": "Talking money",
    "p": [
     "We can’t afford… unless we cut…",
     "The trade-off is…",
     "Let’s not cut corners on…",
     "That would blow the budget."
    ]
   },
   {
    "t": "Pushing back",
    "p": [
     "I see your point, but…",
     "What would happen if…?",
     "With all due respect, that’s not the film I want to make.",
     "Let’s meet halfway."
    ]
   }
  ],
  "stages": [
   {
    "id": "brief",
    "kind": "brief",
    "t": "The brief",
    "min": 5,
    "blurb": "The budget, the rules and the producer’s phrasebook",
    "intro": "You’re the director. The studio has given you twenty million dollars and one rule: make something people will remember.",
    "task": "Warm up",
    "talk": [
     "What’s the best film you’ve seen that was made on a small budget?",
     "If you had twenty million dollars, what would you spend most of it on?"
    ],
    "push": [
     "Keep this short: five minutes. The game starts on the next screen."
    ]
   },
   {
    "id": "idea",
    "kind": "pick",
    "t": "The idea",
    "min": 12,
    "blurb": "Genre, setting, title and logline",
    "intro": "Every film starts with a sentence. Choose a genre and a world, give your film a title and write the logline.",
    "inputs": [
     {
      "key": "title",
      "label": "Working title",
      "ph": "e.g. The Last Projectionist"
     },
     {
      "key": "logline",
      "label": "Logline: your film in one sentence",
      "long": true,
      "ph": "When a…, she must… before…"
     }
    ],
    "slots": [
     {
      "key": "genre",
      "label": "Genre",
      "hint": "This decides which cards fit later.",
      "options": [
       {
        "id": "noir",
        "name": "Film noir",
        "role": "Shadows and cynics",
        "cost": 0,
        "desc": "Rain, cigarette smoke and a detective who trusts nobody. Critics adore it; audiences need convincing.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "western",
        "name": "Western",
        "role": "Wide open spaces",
        "cost": 0,
        "desc": "Dust, horses and a town with a secret. A classic genre that rewards great photography.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": []
       },
       {
        "id": "scifi",
        "name": "Science fiction",
        "role": "Big ideas, big worlds",
        "cost": 0,
        "desc": "Another planet, another century, the same human problems. Expensive to do well.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "heist",
        "name": "Heist thriller",
        "role": "One last job",
        "cost": 0,
        "desc": "A crew, a plan and everything that goes wrong. Fun to watch and easy to sell.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "drama",
        "name": "Coming-of-age drama",
        "role": "Small story, big heart",
        "cost": 0,
        "desc": "One summer that changes everything. Cheap to make, hard to make well.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "horror",
        "name": "Horror",
        "role": "Don’t look behind you",
        "cost": 0,
        "desc": "A house, a family and a noise in the night. Cheap, profitable and loved by teenagers.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "setting",
      "label": "Setting",
      "options": [
       {
        "id": "la",
        "name": "Los Angeles, 1954",
        "role": "Period piece",
        "cost": 1.5,
        "desc": "Neon signs, big cars and studio gossip. Period costumes and cars cost money.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "noir",
         "drama",
         "heist"
        ]
       },
       {
        "id": "cdmx",
        "name": "Mexico City, today",
        "role": "Contemporary",
        "cost": 0.5,
        "desc": "Crowded streets, rooftops and a city that never stops. Cheap to shoot and full of life.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "heist",
         "drama",
         "horror"
        ]
       },
       {
        "id": "space",
        "name": "A space station, 2140",
        "role": "Built on a soundstage",
        "cost": 3,
        "desc": "Every corridor has to be built and every window is a visual effect.",
        "craft": 0,
        "hype": 1,
        "risk": 0,
        "fit": [
         "scifi",
         "horror"
        ]
       },
       {
        "id": "desert",
        "name": "A desert town, 1972",
        "role": "On location",
        "cost": 1,
        "desc": "Empty roads, a diner and endless horizons. Beautiful, but hot and far from everything.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "western",
         "drama",
         "horror"
        ]
       }
      ]
     }
    ],
    "task": "Pitch it",
    "talk": [
     "Read your logline out loud. Then pitch the film in sixty seconds: who, what, and why we should care.",
     "Why this genre? What can it do that other genres can’t?",
     "Which classic film is closest to yours, and how is yours different?"
    ],
    "push": [
     "Ask: “Who is this film for?” and “Why now?”",
     "If the logline is vague, make him rewrite it out loud: who wants what, and what stops them?"
    ]
   },
   {
    "id": "script",
    "kind": "pick",
    "t": "The script",
    "min": 10,
    "blurb": "Hire the screenwriter",
    "intro": "A great script won’t guarantee a great film, but a bad one guarantees a bad film. Who’s going to write it?",
    "slots": [
     {
      "key": "writer",
      "label": "Screenwriter",
      "options": [
       {
        "id": "nora",
        "name": "Nora Vance",
        "role": "Veteran screenwriter",
        "cost": 3,
        "desc": "Twenty years of tight, character-driven scripts, and she never misses a deadline. Her dialogue is sharp, but she hates rewrites.",
        "craft": 3,
        "hype": 0,
        "risk": 0,
        "fit": [
         "drama",
         "noir"
        ]
       },
       {
        "id": "okafor",
        "name": "The Okafor twins",
        "role": "Writing duo",
        "cost": 2,
        "desc": "Twisty plots and clever set pieces. They argue constantly, which is either a problem or the secret to their success.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "heist",
         "scifi"
        ]
       },
       {
        "id": "marsh",
        "name": "Leo Marsh",
        "role": "Novelist adapting his own book",
        "cost": 4,
        "desc": "A best-selling novel comes with a built-in audience. The catch: he’s never written a screenplay and wants to keep every chapter.",
        "craft": 2,
        "hype": 2,
        "risk": 1,
        "fit": [
         "drama",
         "western"
        ]
       },
       {
        "id": "rivera",
        "name": "Sam Rivera",
        "role": "First-timer from film school",
        "cost": 1,
        "desc": "Raw talent and fresh ideas for almost nothing. The first draft will need a lot of work.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "horror",
         "scifi"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Why this writer? What are you giving up by not choosing the others?",
     "If the writer refused to change the ending, what would you do?",
     "Would you ever write the script yourself? Why or why not?"
    ],
    "push": [
     "Push the trade-off: “You could have had a veteran for one million more. Why didn’t you?”",
     "Listen for conditionals: If we hire…, we’ll… / If I wrote it myself, I’d…"
    ]
   },
   {
    "id": "cast",
    "kind": "pick",
    "t": "The cast",
    "min": 15,
    "blurb": "Choose your lead and your supporting actor",
    "intro": "Casting is ninety percent of directing, or so they say. A star sells tickets; the right actor makes the film. Can you have both?",
    "slots": [
     {
      "key": "lead",
      "label": "Lead actor",
      "options": [
       {
        "id": "hale",
        "name": "Marcus Hale",
        "role": "A-list star",
        "cost": 8,
        "desc": "Opens any film worldwide. Insists on script approval and a trailer the size of a house.",
        "craft": 1,
        "hype": 4,
        "risk": 1,
        "fit": []
       },
       {
        "id": "ruiz",
        "name": "Elena Ruiz",
        "role": "Acclaimed stage actor",
        "cost": 4,
        "desc": "Two theatre awards, no film credits. Extraordinary range, and the camera doesn’t scare her.",
        "craft": 3,
        "hype": 1,
        "risk": 0,
        "fit": [
         "drama",
         "noir"
        ]
       },
       {
        "id": "price",
        "name": "Jonah Price",
        "role": "Method actor",
        "cost": 5,
        "desc": "Stays in character for the whole shoot. Brilliant on screen, exhausting off screen.",
        "craft": 3,
        "hype": 2,
        "risk": 2,
        "fit": [
         "western",
         "horror"
        ]
       },
       {
        "id": "chen",
        "name": "Ava Chen",
        "role": "Rising star from a streaming hit",
        "cost": 3,
        "desc": "Twenty million followers and real talent. Her fans will turn up on opening night.",
        "craft": 2,
        "hype": 3,
        "risk": 0,
        "fit": [
         "scifi",
         "heist"
        ]
       }
      ]
     },
     {
      "key": "support",
      "label": "Supporting actor",
      "options": [
       {
        "id": "byrne",
        "name": "Walter Byrne",
        "role": "Veteran character actor",
        "cost": 2,
        "desc": "He’s been in eighty films and he steals every scene.",
        "craft": 3,
        "hype": 0,
        "risk": 0,
        "fit": [
         "noir",
         "western"
        ]
       },
       {
        "id": "moreau",
        "name": "Dani Moreau",
        "role": "Comedian going serious",
        "cost": 2,
        "desc": "Famous for comedy. This could be the surprise of the year, or a disaster.",
        "craft": 1,
        "hype": 2,
        "risk": 1,
        "fit": [
         "drama",
         "heist"
        ]
       },
       {
        "id": "unknown",
        "name": "An unknown from open auditions",
        "role": "New face",
        "cost": 0.5,
        "desc": "Cheap and hungry. Could be the discovery of the decade.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "horror",
         "drama"
        ]
       },
       {
        "id": "holloway",
        "name": "Grace Holloway",
        "role": "Screen legend, 78",
        "cost": 4,
        "desc": "She hasn’t made a film in ten years. The critics would love the comeback.",
        "craft": 3,
        "hype": 2,
        "risk": 1,
        "fit": [
         "noir",
         "drama",
         "western"
        ]
       }
      ]
     }
    ],
    "task": "Hold an audition",
    "talk": [
     "Audition time: your teacher reads a line from your script. Direct them: “Try it again, but this time…”",
     "Star power or the right actor? Defend your lead.",
     "If your lead dropped out tomorrow, who would you call, and why?"
    ],
    "push": [
     "Be a difficult actor in the audition: ask “What’s my motivation?” and make him explain.",
     "Challenge the money: “Marcus Hale is forty percent of your budget. Is he worth it?”"
    ]
   },
   {
    "id": "crew",
    "kind": "pick",
    "t": "The crew",
    "min": 10,
    "blurb": "Cinematographer, editor and composer",
    "intro": "The people the audience never sees, and the ones who decide what they see and hear.",
    "slots": [
     {
      "key": "dp",
      "label": "Director of photography",
      "options": [
       {
        "id": "natural",
        "name": "Ines Calder",
        "role": "Veteran cinematographer",
        "cost": 3,
        "desc": "Famous for natural light and long, patient shots. Slow, but every frame looks like a painting.",
        "craft": 3,
        "hype": 0,
        "risk": 0,
        "fit": [
         "western",
         "drama"
        ]
       },
       {
        "id": "neon",
        "name": "Kai Mercer",
        "role": "Music-video cinematographer",
        "cost": 2,
        "desc": "Bold colour, neon and a camera that never stops moving. Exciting, sometimes too much.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "scifi",
         "heist",
         "horror"
        ]
       },
       {
        "id": "friend",
        "name": "Your film-school friend",
        "role": "First feature",
        "cost": 1,
        "desc": "Cheap, loyal and eager. Has never lit a scene this big.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "editor",
      "label": "Editor",
      "options": [
       {
        "id": "award",
        "name": "Ruth Adler",
        "role": "Award-winning editor",
        "cost": 2,
        "desc": "Knows where the film really is, even when you don’t. Will tell you to cut your favourite scene.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "drama",
         "noir"
        ]
       },
       {
        "id": "trailer",
        "name": "A fast trailer editor",
        "role": "Pace and punch",
        "cost": 1,
        "desc": "Makes everything feel exciting. Quiet moments are not his strength.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "heist",
         "horror"
        ]
       },
       {
        "id": "self",
        "name": "Edit it yourself",
        "role": "Director’s cut",
        "cost": 0,
        "desc": "Free, and you keep total control. Nobody will stop you from falling in love with every take.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "music",
      "label": "Music",
      "options": [
       {
        "id": "orchestra",
        "name": "A full orchestra",
        "role": "Classic film score",
        "cost": 3,
        "desc": "Strings, brass and a theme people will hum on the way out.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "western",
         "scifi",
         "drama"
        ]
       },
       {
        "id": "synth",
        "name": "An electronic producer",
        "role": "Synth score",
        "cost": 1.5,
        "desc": "Dark, pulsing and modern.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "scifi",
         "heist",
         "horror",
         "noir"
        ]
       },
       {
        "id": "songs",
        "name": "Licensed songs from the 60s and 70s",
        "role": "Soundtrack album",
        "cost": 2,
        "desc": "Instant mood and a soundtrack people will buy. The rights are expensive.",
        "craft": 1,
        "hype": 2,
        "risk": 0,
        "fit": [
         "drama",
         "heist"
        ]
       },
       {
        "id": "library",
        "name": "Stock library music",
        "role": "Cheap and safe",
        "cost": 0.5,
        "desc": "It does the job. Nobody will remember it.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "talk": [
     "Which crew member matters most to your film, and why?",
     "Describe the look of your film in three words. Who on your crew is going to make it happen?",
     "Would you rather have a great score or great cinematography? You can’t have both."
    ],
    "push": [
     "Ask him to describe one shot in detail: camera position, light, movement.",
     "“You hired your friend to save a million. If it goes wrong, whose fault is it?”"
    ]
   },
   {
    "id": "gear",
    "kind": "pick",
    "t": "The gear",
    "min": 12,
    "blurb": "Camera, lenses and lighting",
    "intro": "Film or digital? Wide or close? Lamps or the sun? The gear decides how your film feels before anyone says a word.",
    "slots": [
     {
      "key": "camera",
      "label": "Camera",
      "options": [
       {
        "id": "35",
        "name": "35mm film",
        "role": "The classic",
        "cost": 3,
        "desc": "Rich grain, deep blacks, real texture. Every take costs money, so you can’t shoot forever.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "noir",
         "western",
         "drama"
        ]
       },
       {
        "id": "digital",
        "name": "Large-format digital cinema camera",
        "role": "The modern standard",
        "cost": 2,
        "desc": "Clean, sharp and great in low light. Shoot as many takes as you like.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "scifi",
         "heist"
        ]
       },
       {
        "id": "16",
        "name": "16mm film",
        "role": "Gritty and intimate",
        "cost": 1.5,
        "desc": "Grainy, raw and cheaper than 35mm. Perfect for handheld and documentary feeling.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "horror",
         "drama"
        ]
       },
       {
        "id": "mirrorless",
        "name": "A mirrorless camera",
        "role": "Small and cheap",
        "cost": 0.5,
        "desc": "Light, fast and cheap. It looks fine, until you put it on a big screen.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "lens",
      "label": "Lenses",
      "options": [
       {
        "id": "anamorphic",
        "name": "Anamorphic lenses",
        "role": "Wide and epic",
        "cost": 2,
        "desc": "Wide frames, oval bokeh and horizontal flares. The look of the big classics.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "western",
         "scifi",
         "heist"
        ]
       },
       {
        "id": "vintage",
        "name": "Vintage primes",
        "role": "Soft and characterful",
        "cost": 1,
        "desc": "Old glass with soft edges and warm flares. It feels like the 70s.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "noir",
         "drama",
         "horror"
        ]
       },
       {
        "id": "zoom",
        "name": "One zoom lens",
        "role": "Flexible",
        "cost": 0.5,
        "desc": "Covers everything from wide to close-up. Practical, but flat.",
        "craft": 0,
        "hype": 0,
        "risk": 0,
        "fit": []
       }
      ]
     },
     {
      "key": "light",
      "label": "Lighting",
      "options": [
       {
        "id": "truck",
        "name": "A full lighting truck and crew",
        "role": "Total control",
        "cost": 2,
        "desc": "Day for night, sunlight on demand, perfect skin tones. Expensive and slow to set up.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "scifi",
         "heist"
        ]
       },
       {
        "id": "practical",
        "name": "Practical lights only",
        "role": "Lamps, neon and windows",
        "cost": 0.5,
        "desc": "Only the lights you can see in the shot. Moody and real, but hard to control.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "noir",
         "horror",
         "drama"
        ]
       },
       {
        "id": "magic",
        "name": "Natural light at magic hour",
        "role": "The golden forty minutes",
        "cost": 0,
        "desc": "Breathtaking light for forty minutes a day. Miss it and you wait until tomorrow.",
        "craft": 1,
        "hype": 0,
        "risk": 2,
        "fit": [
         "western",
         "drama"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Film or digital? Defend your camera as if the studio wanted the other one.",
     "Describe your opening shot: the lens, the light and what we see first.",
     "Which classic film’s look are you stealing from, and what are you changing?"
    ],
    "push": [
     "“Digital is cheaper and you can do more takes. Convince me film is worth it.”",
     "Listen for precise vocabulary: wide shot, close-up, shallow depth of field, backlit, handheld."
    ]
   },
   {
    "id": "shoot",
    "kind": "events",
    "t": "The shoot",
    "min": 13,
    "blurb": "Three days that go wrong, and how you fix them",
    "intro": "Forty days of shooting, and something goes wrong every day. Here are the three worst. Choose how you handle each one, and explain it to the producer.",
    "events": [
     {
      "id": "rain",
      "when": "Day 12",
      "t": "It’s pouring with rain",
      "text": "Today’s big scene is in bright sunshine, and the forecast says rain all week. Every day you wait costs money.",
      "choices": [
       {
        "t": "Wait for the sun",
        "cost": 1
       },
       {
        "t": "Rewrite the scene for the rain",
        "craft": 1,
        "risk": 1
       },
       {
        "t": "Build a tent and light it as daylight",
        "cost": 0.5,
        "craft": 0
       }
      ]
     },
     {
      "id": "monologue",
      "when": "Day 23",
      "t": "Your lead wants to rewrite the big speech",
      "text": "Your lead actor says the monologue “doesn’t feel true” and wants to improvise it. The writer is furious.",
      "choices": [
       {
        "t": "Let them improvise",
        "craft": 1,
        "risk": 1
       },
       {
        "t": "Stick to the script",
        "hype": -1
       },
       {
        "t": "Fly the writer in to rework it together",
        "cost": 0.5,
        "craft": 1
       }
      ]
     },
     {
      "id": "ending",
      "when": "After the test screening",
      "t": "The studio wants a happier ending",
      "text": "A test audience hated the ending. The studio says change it, or they’ll cut your marketing budget.",
      "choices": [
       {
        "t": "Keep your ending",
        "craft": 2,
        "hype": -1
       },
       {
        "t": "Shoot both endings",
        "cost": 1.5,
        "craft": 1,
        "hype": 1
       },
       {
        "t": "Give them the happy ending",
        "craft": -1,
        "hype": 1
       }
      ]
     }
    ],
    "task": "Explain it to the producer",
    "talk": [
     "For each problem: what did you decide, and what would have happened if you had chosen differently?",
     "Which of the three decisions was the hardest? Why?",
     "What should a director never compromise on?"
    ],
    "push": [
     "Be the angry producer: “You’re three days behind and over budget. Explain yourself.”",
     "Push for third conditionals and should have: If we had waited…, we would have… / We should have…"
    ]
   },
   {
    "id": "premiere",
    "kind": "premiere",
    "t": "The premiere",
    "min": 10,
    "blurb": "Your poster, the reviews and the box office",
    "intro": "The lights go down. Here’s what the critics, the audience and the box office made of your film.",
    "task": "Press conference",
    "talk": [
     "Press conference: your teacher is the press. Answer three questions about the film.",
     "Read the reviews. Which one is fair, and which one would you answer back to?",
     "What should you have done differently? Use should have and if I had…"
    ],
    "push": [
     "Ask like a journalist: “Your lead was very expensive. Was it worth it?” / “What do you say to the critic who called it boring?”",
     "End with: “What’s your next film about?”"
    ]
   }
  ],
  "reviews": [
   {
    "if": "lens=anamorphic",
    "t": "Every frame is wide enough to get lost in."
   },
   {
    "if": "camera=35",
    "t": "Shot on film, and you can feel it: the grain, the texture, the warmth."
   },
   {
    "if": "camera=mirrorless",
    "t": "On a big screen, the cheap camera shows. Watch it on your phone."
   },
   {
    "if": "light=magic",
    "t": "Half the film seems to happen at sunset, and nobody is complaining."
   },
   {
    "if": "light=practical",
    "t": "Shadows do half the acting, and they’re very good at it."
   },
   {
    "if": "lead=hale",
    "t": "{lead} does what stars do: you can’t look anywhere else."
   },
   {
    "if": "lead=ruiz",
    "t": "{lead} is a revelation. Remember the name."
   },
   {
    "if": "lead=price",
    "t": "{lead} disappears into the role so completely it’s almost frightening."
   },
   {
    "if": "lead=chen",
    "t": "{lead} proves she’s much more than a streaming star."
   },
   {
    "if": "support=byrne",
    "t": "{support} steals every scene he’s in, as usual."
   },
   {
    "if": "support=holloway",
    "t": "{support}’s comeback is worth the ticket on its own."
   },
   {
    "if": "support=unknown",
    "t": "The discovery of the year is the actor nobody had heard of."
   },
   {
    "if": "music=orchestra",
    "t": "The score swells in all the right places."
   },
   {
    "if": "music=library",
    "t": "The music sounds like it came free with the camera."
   },
   {
    "if": "ev:ending=0",
    "t": "Thank goodness nobody changed that ending."
   },
   {
    "if": "ev:ending=2",
    "t": "The happy ending feels like it was added by a committee."
   },
   {
    "if": "editor=self",
    "t": "Twenty minutes too long. Somebody should have taken the scissors away."
   },
   {
    "if": "risky",
    "t": "Messy, brave and impossible to ignore."
   },
   {
    "if": "over",
    "t": "You can see every dollar on screen, and a few that weren’t there."
   },
   {
    "if": "fit",
    "t": "A director who knows exactly what kind of film they’re making."
   },
   {
    "if": "high",
    "t": "One of the best films of the year."
   },
   {
    "if": "low",
    "t": "Two hours I will never get back."
   }
  ]
 },
 "plan": {
  "min": 90,
  "steps": [
   {
    "sec": "brief",
    "min": 5,
    "tip": "Explain the rules, read the phrasebook together. He keeps it in mind all class."
   },
   {
    "sec": "idea",
    "min": 12,
    "tip": "He types the title and logline, then pitches. Make him rewrite a vague logline out loud."
   },
   {
    "sec": "script",
    "min": 10,
    "tip": "Push the trade-offs: money vs quality vs risk."
   },
   {
    "sec": "cast",
    "min": 15,
    "tip": "Do the audition: you read a line, he directs you. The fun part of the class."
   },
   {
    "sec": "crew",
    "min": 10,
    "tip": "Ask him to describe one shot in detail."
   },
   {
    "sec": "gear",
    "min": 12,
    "tip": "Film vs digital debate. Listen for precise vocabulary."
   },
   {
    "sec": "shoot",
    "min": 13,
    "tip": "Be the angry producer. Third conditionals and should have."
   },
   {
    "sec": "premiere",
    "min": 10,
    "tip": "Press conference, then read the reviews together."
   },
   {
    "label": "Wrap-up",
    "sec": "_end",
    "min": 3,
    "tip": "Set homework. He can replay the game at home with different choices."
   }
  ],
  "homework": "Play the game again at home with a different genre and budget plan. Then write a 200-word director’s statement for your favourite version: what the film is about, and why you made the choices you made."
 }
};
