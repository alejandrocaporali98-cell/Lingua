// Lesson 10 · Team Boss (Emiliano · A2 · Racing) · a racing team game
window.CLASE = {
 "id": "10",
 "titulo": "Team Boss",
 "nivel": "A2",
 "color": "#c2410c",
 "icono": "flag",
 "tema": "Twenty million dollars and an empty garage. Build your own racing team and win the Mexico City Grand Prix.",
 "objetivos": [
  "Make decisions in English and say why: I want…, because…",
  "Review: comparatives, can / can't and going to",
  "Racing team words: sponsors, drivers, engine, pit crew and team orders"
 ],
 "studio": {
  "budget": 20,
  "finale": "race",
  "name": "A racing team game",
  "cardsText": "Choose sponsors, drivers, engine, wings and crew",
  "labels": {
   "craft": "Speed",
   "hype": "Fans",
   "risk": "Risk",
   "fit": "Fits your team ✓",
   "fitKey": "style"
  },
  "how": [
   "You are the team boss. You have $20 million.",
   "Every card costs money. Sponsors give you money!",
   "Cards add Speed, Fans or Risk. Cards that fit your team style get a bonus.",
   "At every step, explain your choices in English.",
   "On race day, you see where your drivers finish."
  ],
  "kit": [
   {
    "t": "Choosing",
    "p": [
     "I want…, because…",
     "I choose…",
     "…is better than…",
     "…is cheaper, but…"
    ]
   },
   {
    "t": "Your team",
    "p": [
     "Our driver can…",
     "Our car is faster than…",
     "We’re going to win!",
     "We’re going to…"
    ]
   },
   {
    "t": "Money",
    "p": [
     "It’s too expensive.",
     "We don’t have enough money.",
     "This sponsor gives us…"
    ]
   }
  ],
  "stages": [
   {
    "id": "brief",
    "kind": "brief",
    "t": "The brief",
    "min": 4,
    "blurb": "The rules and the boss phrases",
    "intro": "You are the boss of a new racing team. You have twenty million dollars. Can you win in Mexico City?",
    "task": "Warm up",
    "talk": [
     "What’s your favourite racing team? Why?",
     "What do you want to buy first for your team? Why?"
    ],
    "push": [
     "Keep it short: the game starts on the next screen."
    ]
   },
   {
    "id": "team",
    "kind": "pick",
    "t": "Your team",
    "min": 7,
    "blurb": "Name, slogan, team style and your car design",
    "intro": "Every team needs a name, a slogan, a style and a cool car. Design your car: choose the shape, the colours and the number.",
    "inputs": [
     {
      "key": "title",
      "label": "Team name",
      "ph": "e.g. Thunder Racing"
     },
     {
      "key": "tagline",
      "label": "Team slogan",
      "ph": "e.g. Fast. Fearless. Mexican."
     }
    ],
    "slots": [
     {
      "key": "style",
      "label": "Team style",
      "hint": "Cards that fit your style get a bonus.",
      "options": [
       {
        "id": "speed",
        "name": "Speed first",
        "role": "Fast and brave",
        "cost": 0,
        "desc": "You want the fastest car. You take risks.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "safe",
        "name": "Never break down",
        "role": "Strong and careful",
        "cost": 0,
        "desc": "Your car isn’t the fastest, but it always finishes the race.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "young",
        "name": "Young stars",
        "role": "New talent",
        "cost": 0,
        "desc": "You give young drivers a chance. The fans love it.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       }
      ]
     }
    ],
    "task": "Present your team",
    "talk": [
     "Say your team name and your slogan.",
     "Describe your car: the shape, the colours and the number. Why did you choose them?",
     "What is your team style? Describe your team in three sentences."
    ],
    "push": [
     "Ask: “Where is your team from?” and “Is your team faster than the other teams?”"
    ],
    "designer": true
   },
   {
    "id": "sponsors",
    "kind": "pick",
    "t": "Sponsors",
    "min": 6,
    "blurb": "Companies that give you money",
    "intro": "Sponsors give you money, but they want something too. Choose a main sponsor and a small sponsor.",
    "slots": [
     {
      "key": "main",
      "label": "Main sponsor",
      "options": [
       {
        "id": "energy",
        "name": "Volt Energy Drink",
        "role": "Energy drink",
        "cost": -6,
        "desc": "They pay a lot! But they want crazy videos with your drivers every week.",
        "craft": 0,
        "hype": 1,
        "risk": 1,
        "fit": [
         "young"
        ]
       },
       {
        "id": "tech",
        "name": "Nexa Tech",
        "role": "Tech company",
        "cost": -5,
        "desc": "They make phones and computers. They want a fast, modern team.",
        "craft": 0,
        "hype": 1,
        "risk": 0,
        "fit": [
         "speed"
        ]
       },
       {
        "id": "bank",
        "name": "Sierra Bank",
        "role": "Bank",
        "cost": -4,
        "desc": "Serious and safe. They pay well, and they don’t want any problems.",
        "craft": 0,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ]
       },
       {
        "id": "nomain",
        "name": "No main sponsor",
        "role": "Free",
        "cost": 0,
        "desc": "Your car stays clean and you are free, but you have less money.",
        "craft": 0,
        "hype": 0,
        "risk": 0,
        "fit": []
       }
      ]
     },
     {
      "key": "small",
      "label": "Small sponsor",
      "options": [
       {
        "id": "tacos",
        "name": "Tacos El Güero",
        "role": "Taco shop",
        "cost": -1,
        "desc": "A small taco shop. Not much money, but the fans love it!",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "game",
        "name": "PixelRace",
        "role": "Video game company",
        "cost": -2,
        "desc": "They’re going to put your team in their new racing game.",
        "craft": 0,
        "hype": 1,
        "risk": 0,
        "fit": [
         "young"
        ]
       },
       {
        "id": "watch",
        "name": "Arden Watches",
        "role": "Luxury watches",
        "cost": -3,
        "desc": "They pay well, but your drivers have to go to a lot of boring parties.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "nosmall",
        "name": "No small sponsor",
        "role": "Free",
        "cost": 0,
        "desc": "Nothing extra on the car.",
        "craft": 0,
        "hype": 0,
        "risk": 0,
        "fit": []
       }
      ]
     }
    ],
    "task": "Explain your choice",
    "talk": [
     "Which sponsors did you choose? Why?",
     "Which sponsor is better for you: the energy drink or the bank? Why?",
     "What do your sponsors want from you?"
    ],
    "push": [
     "Push the comparatives: “Which sponsor is more serious? Which one is more fun?”"
    ]
   },
   {
    "id": "drivers",
    "kind": "pick",
    "t": "The drivers",
    "min": 10,
    "blurb": "Choose your two drivers",
    "intro": "A team needs two drivers. A champion is fast, but expensive. A young driver is cheap, but can make mistakes.",
    "slots": [
     {
      "key": "driver1",
      "label": "Driver 1",
      "options": [
       {
        "id": "ferro",
        "name": "Max Ferro",
        "role": "World champion",
        "cost": 9,
        "desc": "He’s the fastest driver in the world. He’s very expensive, and he gets angry when he loses.",
        "craft": 4,
        "hype": 3,
        "risk": 1,
        "fit": [
         "speed"
        ],
        "num": "1"
       },
       {
        "id": "sato",
        "name": "Kenji Sato",
        "role": "Fast and calm",
        "cost": 6,
        "desc": "He’s very fast and he never makes mistakes. He doesn’t talk a lot.",
        "craft": 3,
        "hype": 1,
        "risk": 0,
        "fit": [
         "safe"
        ],
        "num": "8"
       },
       {
        "id": "reyes",
        "name": "Sofia Reyes",
        "role": "Mexican rookie star",
        "cost": 4,
        "desc": "She’s 19 and she’s from Monterrey. She’s fast, but she has a lot to learn.",
        "craft": 2,
        "hype": 3,
        "risk": 1,
        "fit": [
         "young"
        ],
        "num": "21"
       },
       {
        "id": "becker",
        "name": "Tom Becker",
        "role": "Old but careful",
        "cost": 2,
        "desc": "He’s 38. He isn’t the fastest, but he never crashes.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ],
        "num": "38"
       }
      ]
     },
     {
      "key": "driver2",
      "label": "Driver 2",
      "options": [
       {
        "id": "dubois",
        "name": "Leo Dubois",
        "role": "Rain master",
        "cost": 5,
        "desc": "He’s very fast in the rain. He can overtake anyone.",
        "craft": 3,
        "hype": 1,
        "risk": 0,
        "fit": [
         "speed"
        ]
       },
       {
        "id": "silva",
        "name": "Ana Silva",
        "role": "Junior champion",
        "cost": 3,
        "desc": "She won the junior championship last year. She learns very quickly.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "young"
        ]
       },
       {
        "id": "kumar",
        "name": "Ravi Kumar",
        "role": "Test driver",
        "cost": 1,
        "desc": "He knows the car very well, but he isn’t very fast.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ]
       },
       {
        "id": "moran",
        "name": "Jack Moran",
        "role": "Social media star",
        "cost": 2,
        "desc": "He has ten million followers. He’s good, not great, but everyone knows him.",
        "craft": 1,
        "hype": 3,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "task": "Describe your drivers",
    "talk": [
     "Describe your drivers: who are they and what can they do?",
     "Who is faster? Who is more famous? Who is cheaper?",
     "Why did you choose them and not the others?"
    ],
    "push": [
     "Listen for can + verb: “He can overtake”, not “He can overtakes”.",
     "Ask: “Max Ferro is the best. Why didn’t you choose him?”"
    ]
   },
   {
    "id": "car",
    "kind": "pick",
    "t": "The car",
    "min": 9,
    "blurb": "Engine and wings",
    "intro": "Now the car. A powerful engine is fast, but it can break. New wings are good in the corners.",
    "slots": [
     {
      "key": "engine",
      "label": "Engine",
      "options": [
       {
        "id": "power",
        "name": "Super engine",
        "role": "The most powerful",
        "cost": 6,
        "desc": "It’s very, very fast, but sometimes it breaks.",
        "craft": 3,
        "hype": 0,
        "risk": 1,
        "fit": [
         "speed"
        ]
       },
       {
        "id": "strong",
        "name": "Strong engine",
        "role": "It never breaks",
        "cost": 4,
        "desc": "It isn’t the fastest, but it always finishes.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ]
       },
       {
        "id": "cheap",
        "name": "Cheap engine",
        "role": "Slow",
        "cost": 1,
        "desc": "It’s cheap. It’s also slow.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "wings",
      "label": "Wings",
      "options": [
       {
        "id": "new",
        "name": "New wings",
        "role": "Faster in the corners",
        "cost": 3,
        "desc": "The car is much faster in the corners.",
        "craft": 2,
        "hype": 0,
        "risk": 0,
        "fit": [
         "speed"
        ]
       },
       {
        "id": "small",
        "name": "Small upgrades",
        "role": "A little better",
        "cost": 1,
        "desc": "A little faster than last year.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe",
         "young"
        ]
       },
       {
        "id": "old",
        "name": "Last year’s wings",
        "role": "Free",
        "cost": 0,
        "desc": "Free, but the other teams are faster.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "task": "Describe your car",
    "talk": [
     "Describe your car: the engine, the wings and the colours.",
     "Is your car faster than the other cars? Why?",
     "What can your car do? What can’t it do?"
    ],
    "push": [
     "Ask for comparatives: “Is the super engine better than the strong engine? Why?”"
    ]
   },
   {
    "id": "crew",
    "kind": "pick",
    "t": "The crew",
    "min": 6,
    "blurb": "Pit crew and race engineer",
    "intro": "Races are won in the pit lane too. Who is going to change the tyres, and who is going to talk to your driver?",
    "slots": [
     {
      "key": "pit",
      "label": "Pit crew",
      "options": [
       {
        "id": "best",
        "name": "The best pit crew",
        "role": "2 seconds",
        "cost": 3,
        "desc": "They can change four tyres in two seconds!",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ]
       },
       {
        "id": "normal",
        "name": "A normal pit crew",
        "role": "3 seconds",
        "cost": 1.5,
        "desc": "They can change the tyres in three seconds.",
        "craft": 0,
        "hype": 0,
        "risk": 0,
        "fit": []
       },
       {
        "id": "rookie",
        "name": "A new pit crew",
        "role": "Slow",
        "cost": 0.5,
        "desc": "They’re cheap, but they’re slow and they make mistakes.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       }
      ]
     },
     {
      "key": "engineer",
      "label": "Race engineer",
      "options": [
       {
        "id": "expert",
        "name": "An expert engineer",
        "role": "20 years of experience",
        "cost": 2,
        "desc": "She knows everything about racing.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "safe"
        ]
       },
       {
        "id": "youngeng",
        "name": "A young engineer",
        "role": "New ideas",
        "cost": 1,
        "desc": "He has new ideas, but no experience.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": [
         "young",
         "speed"
        ]
       },
       {
        "id": "noeng",
        "name": "No race engineer",
        "role": "Free",
        "cost": 0,
        "desc": "Your driver is alone on the radio!",
        "craft": 0,
        "hype": 0,
        "risk": 2,
        "fit": []
       }
      ]
     }
    ],
    "task": "Radio check",
    "talk": [
     "What can your pit crew do?",
     "You’re the engineer: give your driver three radio messages.",
     "Is your crew better than last year’s crew? Why?"
    ],
    "push": [
     "Recycle lesson 07: “Box, box!”, “Push now!”, “Slow down!”"
    ]
   },
   {
    "id": "weekend",
    "kind": "events",
    "t": "Race weekend",
    "min": 8,
    "blurb": "Three problems: what do you do?",
    "intro": "It’s race weekend in Mexico City. Three problems! Choose what to do, and explain why.",
    "events": [
     {
      "id": "rain",
      "when": "Saturday",
      "t": "It’s raining!",
      "text": "It’s raining before qualifying. What tyres do you want?",
      "choices": [
       {
        "t": "Rain tyres",
        "craft": 1
       },
       {
        "t": "Normal tyres: the rain is going to stop",
        "craft": 2,
        "risk": 2
       },
       {
        "t": "Wait and see",
        "risk": 1
       }
      ]
     },
     {
      "id": "engine",
      "when": "Sunday morning",
      "t": "Engine problem!",
      "text": "Driver 1 has a problem with the engine. The race is in two hours.",
      "choices": [
       {
        "t": "Change the engine",
        "cost": 1
       },
       {
        "t": "Race with it",
        "risk": 2
       },
       {
        "t": "Start from the pit lane",
        "craft": -1
       }
      ]
     },
     {
      "id": "lastlap",
      "when": "Last lap",
      "t": "Your drivers are fighting!",
      "text": "Your two drivers are fighting for the same position. They can crash!",
      "choices": [
       {
        "t": "Let them race",
        "hype": 1,
        "risk": 1
       },
       {
        "t": "Team orders: Driver 2, let him pass",
        "craft": 1,
        "hype": -1
       },
       {
        "t": "Tell them: be careful!"
       }
      ]
     }
    ],
    "task": "Explain it",
    "talk": [
     "What did you decide for each problem? Why?",
     "What are you going to tell your drivers before the race?",
     "Which problem is the most difficult? Why?"
    ],
    "push": [
     "Be the angry sponsor: “Why are your drivers fighting?!”",
     "Listen for because: “I chose rain tyres because…”"
    ]
   },
   {
    "id": "race",
    "kind": "premiere",
    "t": "Race day",
    "min": 7,
    "blurb": "Where do your drivers finish?",
    "intro": "The lights go out and away we go! Here are the results of the Mexico City Grand Prix.",
    "task": "Interview after the race",
    "talk": [
     "Interview: How do you feel? What happened in the race?",
     "What was your best decision? What was your worst?",
     "What are you going to change for the next race?"
    ],
    "push": [
     "Be the TV reporter. End with: “What are you going to do in the next race?”"
    ]
   }
  ],
  "race": {
   "series": "Formula Lingua · Round 1",
   "track": "Mexico City Grand Prix",
   "verdicts": [
    "Victory!",
    "On the podium!",
    "In the points",
    "A tough day"
   ],
   "outlets": [
    "Race News",
    "Pit Lane Daily",
    "Lingua Sport"
   ],
   "extra": [
    "What a race in Mexico City!",
    "This new team is a team to watch."
   ],
   "rivals": [
    [
     "Luca Bianchi",
     "Rossa Corse"
    ],
    [
     "Erik Larsen",
     "Nordic GP"
    ],
    [
     "Hiro Tanaka",
     "Kaizen Motorsport"
    ],
    [
     "Oliver Grant",
     "Apex Racing"
    ],
    [
     "Mateo Ruiz",
     "Blue Comet"
    ],
    [
     "Pierre Laurent",
     "Falcon"
    ],
    [
     "Noah Fischer",
     "Vortex"
    ],
    [
     "Yuki Mori",
     "Kaizen Motorsport"
    ],
    [
     "Sam Walker",
     "Apex Racing"
    ],
    [
     "Diego Sola",
     "Rossa Corse"
    ],
    [
     "Felix Braun",
     "Nordic GP"
    ],
    [
     "Marco Neri",
     "Falcon"
    ]
   ]
  },
  "reviews": [
   {
    "if": "win",
    "t": "{d1} wins in Mexico City! The crowd goes crazy!"
   },
   {
    "if": "podium",
    "t": "{d1} is on the podium! A great day for {team}."
   },
   {
    "if": "low",
    "t": "A bad day for {team}. They’re going to work hard for the next race."
   },
   {
    "if": "dnf",
    "t": "{d2} crashes on lap 40. The team boss says: “We’re going to come back stronger.”"
   },
   {
    "if": "driver1=reyes",
    "t": "Sofia Reyes is the new hero of Mexico!"
   },
   {
    "if": "driver1=ferro",
    "t": "Max Ferro is fast, but he’s angry with the team again."
   },
   {
    "if": "driver2=moran",
    "t": "Jack Moran’s video from the race has five million views."
   },
   {
    "if": "small=tacos",
    "t": "Free tacos for the fans! {team} is the most popular team in the paddock."
   },
   {
    "if": "pit=best",
    "t": "The pit stop takes only 2.1 seconds. Amazing!"
   },
   {
    "if": "engine=cheap",
    "t": "The cheap engine is very slow on the long straight."
   },
   {
    "if": "ev:rain=1",
    "t": "Normal tyres in the rain? A big risk from {team}!"
   },
   {
    "if": "ev:lastlap=0",
    "t": "The two {team} drivers fight on the last lap. Fantastic race!"
   },
   {
    "if": "fans",
    "t": "The fans love {team}!"
   },
   {
    "if": "over",
    "t": "{team} spends too much money. The sponsors aren’t happy."
   }
  ]
 },
 "plan": {
  "min": 60,
  "steps": [
   {
    "sec": "brief",
    "min": 4,
    "tip": "Read the rules and the phrases together."
   },
   {
    "sec": "team",
    "min": 7,
    "tip": "He types the team name and slogan, designs the car and presents his team."
   },
   {
    "sec": "sponsors",
    "min": 6,
    "tip": "Sponsors give money: he can spend more later. Comparatives: which sponsor is better?"
   },
   {
    "sec": "drivers",
    "min": 10,
    "tip": "Can + verb and comparatives: who is faster, who is more famous."
   },
   {
    "sec": "car",
    "min": 9,
    "tip": "He describes his car. Push for faster than / the fastest."
   },
   {
    "sec": "crew",
    "min": 6,
    "tip": "Radio messages from lesson 07."
   },
   {
    "sec": "weekend",
    "min": 8,
    "tip": "He explains each decision with because."
   },
   {
    "sec": "race",
    "min": 7,
    "tip": "TV interview: How do you feel? What are you going to change?"
   },
   {
    "label": "Wrap-up",
    "sec": "_end",
    "min": 3,
    "tip": "He can play again at home with a different team."
   }
  ],
  "homework": "Play the game again at home with a different team style. Then write five sentences about your team: who your drivers are, what your car can do and what you’re going to do in the next race."
 }
};
