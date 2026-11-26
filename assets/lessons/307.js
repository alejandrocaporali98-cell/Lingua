// Lesson 307 · Greenlight 2: The Sequel (Derek · C1 · Cinema) · a film sequel game
window.CLASE = {
 "id": "307",
 "titulo": "Greenlight 2: The Sequel",
 "nivel": "C1",
 "color": "#9f1239",
 "icono": "clapper",
 "tema": "Your first film made money, so the studio wants a sequel. Twice the budget, twice the pressure, and a studio that wants a say in everything.",
 "objetivos": [
  "Negotiate with a studio and defend your creative choices",
  "Compare and contrast: bigger, darker, braver than the original; not as… as…",
  "The language of franchises: sequel, prequel, spin-off, recast, final cut, release window"
 ],
 "studio": {
  "budget": 40,
  "name": "A film sequel game",
  "cardsText": "Choose the direction, the deal, the cast, the effects and the campaign",
  "labels": {
   "craft": "Craft",
   "hype": "Star power",
   "risk": "Risk",
   "fit": "Fits your sequel ✓",
   "fitKey": "kind"
  },
  "prev": {
   "id": "306",
   "none": "You haven’t played Greenlight yet? No problem: imagine your first film was a surprise hit, and now everybody wants part two.",
   "leads": {
    "hale": "Marcus Hale",
    "ruiz": "Elena Ruiz",
    "price": "Jonah Price",
    "chen": "Ava Chen"
   },
   "genres": {
    "noir": "Film noir",
    "western": "Western",
    "scifi": "Science fiction",
    "heist": "Heist thriller",
    "drama": "Coming-of-age drama",
    "horror": "Horror"
   }
  },
  "how": [
   "Your first film was a hit. Now you have $40 million for the sequel.",
   "The studio will offer you money, but every deal comes with strings attached.",
   "Cards add Craft, Star power or Risk. Cards that fit the kind of sequel you choose get a bonus.",
   "At every stage, defend your choices out loud: your teacher is the studio boss.",
   "At the premiere, everyone compares it with the original. Is it better?"
  ],
  "kit": [
   {
    "t": "Comparing with the original",
    "p": [
     "It’s bigger, but is it better?",
     "It isn’t as… as the first one.",
     "It’s far darker than the original.",
     "It has to stand on its own."
    ]
   },
   {
    "t": "Negotiating with the studio",
    "p": [
     "I can live with that, as long as…",
     "That’s a deal-breaker for me.",
     "What if we met halfway on…?",
     "I’m not signing anything until…"
    ]
   },
   {
    "t": "Franchise talk",
    "p": [
     "We need to raise the stakes.",
     "Let’s not just repeat ourselves.",
     "The fans will never forgive us if…",
     "It sets up a third film."
    ]
   }
  ],
  "stages": [
   {
    "id": "brief",
    "kind": "brief",
    "t": "The brief",
    "min": 5,
    "blurb": "Last time, the new budget and the phrasebook",
    "intro": "Your first film was a hit. The studio is calling with forty million dollars and a lot of opinions.",
    "task": "Warm up",
    "talk": [
     "Which sequel is better than the original? Why?",
     "Which sequel should never have been made?"
    ],
    "push": [
     "Keep it short. Push for comparatives: better than, not as good as, far darker than."
    ]
   },
   {
    "id": "direction",
    "kind": "pick",
    "t": "The direction",
    "min": 12,
    "blurb": "What kind of sequel, its title and logline",
    "intro": "Sequels fail when they copy the original. What kind of part two are you going to make?",
    "inputs": [
     {
      "key": "title",
      "label": "Title of the sequel",
      "ph": "e.g. The Last Reel II: Rewind"
     },
     {
      "key": "logline",
      "label": "Logline: the sequel in one sentence",
      "long": true,
      "ph": "Years after…, she must… before…"
     }
    ],
    "slots": [
     {
      "key": "kind",
      "label": "Kind of sequel",
      "hint": "This decides which cards fit later.",
      "options": [
       {
        "id": "bigger",
        "name": "Bigger and louder",
        "role": "The blockbuster",
        "cost": 0,
        "desc": "More action, more locations, higher stakes. What audiences expect, and what critics fear.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": []
       },
       {
        "id": "darker",
        "name": "Darker and deeper",
        "role": "The braver film",
        "cost": 0,
        "desc": "Less spectacle, more consequences. The kind of sequel critics remember.",
        "craft": 2,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "prequel",
        "name": "A prequel",
        "role": "How it all began",
        "cost": 0,
        "desc": "Go back in time and show how it started. Everyone knows the ending, so the journey has to be great.",
        "craft": 1,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "spinoff",
        "name": "A spin-off",
        "role": "Same world, new hero",
        "cost": 0,
        "desc": "A minor character takes the lead. Fresh, risky and full of surprises.",
        "craft": 0,
        "hype": 1,
        "risk": 1,
        "fit": []
       }
      ]
     }
    ],
    "task": "Pitch the sequel",
    "talk": [
     "Read your title and logline, then pitch the sequel in sixty seconds.",
     "How is it different from the first film? Use comparatives.",
     "Why does this story need a part two at all?"
    ],
    "push": [
     "Be the studio boss: “Just give us the same film again, but bigger.” Make him push back.",
     "Listen for comparatives: far darker than, not as… as…, the most… ever."
    ]
   },
   {
    "id": "deal",
    "kind": "pick",
    "t": "The deal",
    "min": 10,
    "blurb": "Studio money and the release date",
    "intro": "The studio and its partners are offering extra money. Every dollar comes with a condition. Then choose when the film comes out.",
    "slots": [
     {
      "key": "deal",
      "label": "Extra money",
      "options": [
       {
        "id": "studio",
        "name": "The studio’s big offer",
        "role": "+$10M, they get final cut",
        "cost": -10,
        "desc": "Ten more million, but the studio decides the final version of the film.",
        "craft": 0,
        "hype": 2,
        "risk": 2,
        "fit": [
         "bigger"
        ]
       },
       {
        "id": "streaming",
        "name": "A streaming co-production",
        "role": "+$6M, online after two weeks",
        "cost": -6,
        "desc": "A platform pays six million. The film goes online just two weeks after it opens in cinemas.",
        "craft": 0,
        "hype": 1,
        "risk": 1,
        "fit": [
         "spinoff"
        ]
       },
       {
        "id": "placement",
        "name": "Product placement",
        "role": "+$3M, a car brand in three scenes",
        "cost": -3,
        "desc": "A car company pays three million to have its new model in three scenes. Your hero has to drive it.",
        "craft": 0,
        "hype": 0,
        "risk": 1,
        "fit": []
       },
       {
        "id": "nodeal",
        "name": "No deal",
        "role": "Keep your freedom",
        "cost": 0,
        "desc": "No extra money and no conditions. The film is yours.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "darker",
         "prequel"
        ]
       }
      ]
     },
     {
      "key": "release",
      "label": "Release date",
      "options": [
       {
        "id": "summer",
        "name": "Summer blockbuster weekend",
        "role": "Maximum audience",
        "cost": 2,
        "desc": "The biggest weekend of the year, and the most competition.",
        "craft": 0,
        "hype": 3,
        "risk": 1,
        "fit": [
         "bigger"
        ]
       },
       {
        "id": "awards",
        "name": "Awards season, December",
        "role": "Prestige",
        "cost": 1,
        "desc": "Released just in time for the awards conversation.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "darker",
         "prequel"
        ]
       },
       {
        "id": "festival",
        "name": "A film festival premiere",
        "role": "Critics first",
        "cost": 0.5,
        "desc": "World premiere at a big festival. Great reviews can make the film; bad ones can kill it.",
        "craft": 2,
        "hype": 0,
        "risk": 1,
        "fit": [
         "darker",
         "spinoff"
        ]
       },
       {
        "id": "holiday",
        "name": "Christmas family weekend",
        "role": "Families",
        "cost": 1.5,
        "desc": "Everyone is at the cinema, but the film has to work for families.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": [
         "bigger",
         "spinoff"
        ]
       }
      ]
     }
    ],
    "task": "Negotiate",
    "talk": [
     "Which deal did you take, and what condition are you accepting?",
     "The studio wants final cut. Negotiate: what would you give up to keep it?",
     "Why this release date? What are you risking?"
    ],
    "push": [
     "Be the studio boss: “Ten million, final cut, take it or leave it.” Make him negotiate conditions.",
     "Listen for: as long as…, that’s a deal-breaker, what if we met halfway…"
    ]
   },
   {
    "id": "cast",
    "kind": "pick",
    "t": "The cast",
    "min": 15,
    "blurb": "Does the hero return? And who is the villain?",
    "intro": "The biggest question in any sequel: does the hero come back? And every sequel needs a better villain.",
    "inputs": [
     {
      "key": "leadName",
      "label": "Your original lead: who is it?",
      "ph": "The star of your first film",
      "showIf": "lead=back"
     },
     {
      "key": "leadName",
      "label": "Your original lead: who is it?",
      "ph": "The star of your first film",
      "showIf": "lead=cameo"
     },
     {
      "key": "newStar",
      "label": "The new star: invent a name",
      "ph": "e.g. Mia Laurent",
      "showIf": "lead=recast"
     },
     {
      "key": "newHero",
      "label": "The new hero: invent a name",
      "ph": "e.g. Tom Vale",
      "showIf": "lead=kill"
     }
    ],
    "slots": [
     {
      "key": "lead",
      "label": "The hero",
      "options": [
       {
        "id": "back",
        "name": "Bring back your original lead",
        "role": "Triple pay",
        "cost": 12,
        "desc": "The fans want them back, and their agent knows it. They want three times their old fee.",
        "craft": 1,
        "hype": 3,
        "risk": 0,
        "fit": [
         "bigger",
         "darker"
        ],
        "ask": "leadName"
       },
       {
        "id": "recast",
        "name": "Recast with a new star",
        "role": "A new face",
        "cost": 7,
        "desc": "A new actor plays the same character. Some fans will be furious; some won’t notice.",
        "craft": 1,
        "hype": 2,
        "risk": 2,
        "fit": [
         "prequel"
        ],
        "ask": "newStar"
       },
       {
        "id": "cameo",
        "name": "A cameo from your original lead",
        "role": "Two minutes on screen",
        "cost": 3,
        "desc": "Two minutes in the final scene. The audience will scream.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": [
         "spinoff",
         "prequel"
        ],
        "ask": "leadName"
       },
       {
        "id": "kill",
        "name": "Kill the hero in the first scene",
        "role": "Shock opening",
        "cost": 1,
        "desc": "The old hero dies in the first five minutes, and a new hero takes over. Nobody will see it coming.",
        "craft": 2,
        "hype": 0,
        "risk": 2,
        "fit": [
         "darker",
         "spinoff"
        ],
        "ask": "newHero"
       }
      ]
     },
     {
      "key": "villain",
      "label": "The villain",
      "options": [
       {
        "id": "comedian",
        "name": "Rex Calloway",
        "role": "Comedian playing against type",
        "cost": 3,
        "desc": "The funniest man on television, as a terrifying villain. A huge surprise, or a huge mistake.",
        "craft": 1,
        "hype": 2,
        "risk": 1,
        "fit": [
         "darker",
         "spinoff"
        ]
       },
       {
        "id": "legend",
        "name": "Dame Vivian Ashe",
        "role": "Theatre legend",
        "cost": 4,
        "desc": "Fifty years on stage. She can make one sentence sound like a threat.",
        "craft": 3,
        "hype": 1,
        "risk": 0,
        "fit": [
         "darker",
         "prequel"
        ]
       },
       {
        "id": "creature",
        "name": "The Creature",
        "role": "Fully computer-generated",
        "cost": 5,
        "desc": "A monster made entirely with visual effects. Impressive in the trailer, cold on screen.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": [
         "bigger"
        ]
       },
       {
        "id": "ortiz",
        "name": "Sam Ortiz",
        "role": "The unknown from your first film, now a star",
        "cost": 3,
        "desc": "Your discovery from the first film is now famous, and wants to play the bad guy.",
        "craft": 2,
        "hype": 2,
        "risk": 0,
        "fit": [
         "bigger",
         "spinoff"
        ]
       }
      ]
     }
    ],
    "task": "Casting meeting",
    "talk": [
     "Does the hero return? Defend your decision as if the fans were in the room.",
     "Describe your villain: what do they want, and why are they scarier than the last one?",
     "Role-play: your teacher is the original lead’s agent asking for triple pay. Negotiate."
    ],
    "push": [
     "Be the agent: “Triple pay, or my client walks.”",
     "Ask: “Why is this villain better than the one in the first film?”"
    ]
   },
   {
    "id": "look",
    "kind": "pick",
    "t": "The look",
    "min": 12,
    "blurb": "Effects, locations and music",
    "intro": "Bigger budget, bigger choices. Real stunts or computers? New places or the old ones? The original theme, or a new sound?",
    "slots": [
     {
      "key": "fx",
      "label": "Effects",
      "options": [
       {
        "id": "practical",
        "name": "Practical effects and real stunts",
        "role": "The real thing",
        "cost": 5,
        "desc": "Real explosions, real cars, real falls. Expensive and dangerous, but the audience can feel it.",
        "craft": 3,
        "hype": 0,
        "risk": 1,
        "fit": [
         "darker",
         "prequel"
        ]
       },
       {
        "id": "cgi",
        "name": "Mostly computer effects",
        "role": "Anything is possible",
        "cost": 6,
        "desc": "Cities can fly. It looks spectacular, until it looks like a video game.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": [
         "bigger",
         "spinoff"
        ]
       },
       {
        "id": "mix",
        "name": "A mix of both",
        "role": "Best of both worlds",
        "cost": 4,
        "desc": "Real sets and stunts, extended with digital effects.",
        "craft": 2,
        "hype": 1,
        "risk": 0,
        "fit": [
         "bigger"
        ]
       },
       {
        "id": "minimal",
        "name": "Almost no effects",
        "role": "Story first",
        "cost": 1,
        "desc": "Spend the money on actors and time instead.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "darker"
        ]
       }
      ]
     },
     {
      "key": "location",
      "label": "Locations",
      "options": [
       {
        "id": "abroad",
        "name": "Three countries",
        "role": "Globe-trotting",
        "cost": 4,
        "desc": "Shoot in three countries. Epic, exhausting and very expensive.",
        "craft": 1,
        "hype": 2,
        "risk": 0,
        "fit": [
         "bigger",
         "spinoff"
        ]
       },
       {
        "id": "original",
        "name": "Back to the original locations",
        "role": "Nostalgia",
        "cost": 1,
        "desc": "The same streets, years later. Fans will recognise every corner.",
        "craft": 1,
        "hype": 0,
        "risk": 0,
        "fit": [
         "darker",
         "prequel"
        ]
       },
       {
        "id": "bigset",
        "name": "One giant studio set",
        "role": "Total control",
        "cost": 3,
        "desc": "Build the whole world on a soundstage.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "prequel",
         "bigger"
        ]
       },
       {
        "id": "led",
        "name": "Virtual production",
        "role": "Giant LED screens",
        "cost": 3,
        "desc": "Actors perform in front of huge screens showing any place in the world.",
        "craft": 1,
        "hype": 1,
        "risk": 1,
        "fit": [
         "spinoff"
        ]
       }
      ]
     },
     {
      "key": "music",
      "label": "Music",
      "options": [
       {
        "id": "theme",
        "name": "Bring back the original theme",
        "role": "The fans’ favourite",
        "cost": 1,
        "desc": "The moment it plays, everyone remembers why they loved the first film.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "bigger",
         "prequel"
        ]
       },
       {
        "id": "newsound",
        "name": "A completely new sound",
        "role": "A new identity",
        "cost": 2,
        "desc": "A different composer, a different world.",
        "craft": 2,
        "hype": 0,
        "risk": 1,
        "fit": [
         "darker",
         "spinoff"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Describe the opening shot of the sequel. How is it different from the opening of the first film?",
     "Real stunts or computer effects? Defend your choice as if the studio wanted the other one.",
     "Which sequel do you think looks better than the original, and why?"
    ],
    "push": [
     "“Practical effects cost five million. The audience can’t tell the difference. Prove me wrong.”"
    ]
   },
   {
    "id": "campaign",
    "kind": "pick",
    "t": "The campaign",
    "min": 8,
    "blurb": "How you sell it",
    "intro": "Everyone saw the first film. How do you make them want to see the second?",
    "slots": [
     {
      "key": "trailer",
      "label": "Marketing",
      "options": [
       {
        "id": "everything",
        "name": "A trailer that shows everything",
        "role": "Sell the spectacle",
        "cost": 1,
        "desc": "Every big moment, in two and a half minutes.",
        "craft": -1,
        "hype": 2,
        "risk": 0,
        "fit": [
         "bigger"
        ]
       },
       {
        "id": "teaser",
        "name": "A mysterious teaser",
        "role": "Show almost nothing",
        "cost": 0.5,
        "desc": "Thirty seconds, one image, one line. The internet goes wild.",
        "craft": 1,
        "hype": 1,
        "risk": 0,
        "fit": [
         "darker",
         "prequel"
        ]
       },
       {
        "id": "fanevent",
        "name": "A fan event with the cast",
        "role": "Fans first",
        "cost": 2,
        "desc": "Show ten minutes of the film to five thousand fans.",
        "craft": 0,
        "hype": 2,
        "risk": 0,
        "fit": [
         "bigger",
         "spinoff"
        ]
       },
       {
        "id": "viral",
        "name": "A viral campaign",
        "role": "Fake websites and clues",
        "cost": 1.5,
        "desc": "Hidden clues online that tell part of the story before release.",
        "craft": 0,
        "hype": 2,
        "risk": 1,
        "fit": [
         "spinoff",
         "darker"
        ]
       }
      ]
     }
    ],
    "talk": [
     "Write the trailer’s last line out loud, then perform it like the voice-over guy.",
     "How much should a trailer show? Where is the line?",
     "Pitch your campaign to the studio in sixty seconds."
    ],
    "push": [
     "Ask him to perform the trailer voice-over: “In a world where…”"
    ]
   },
   {
    "id": "crisis",
    "kind": "events",
    "t": "The crises",
    "min": 15,
    "blurb": "Three things go wrong",
    "intro": "Sequels are war. Here are the three worst moments. Decide what to do, and explain it to the studio boss.",
    "events": [
     {
      "id": "leak",
      "when": "Week 6 of the shoot",
      "t": "The twist is online",
      "text": "Someone leaked the script. The big twist is all over social media.",
      "choices": [
       {
        "t": "Rewrite the ending and reshoot it",
        "cost": 1.5,
        "craft": 1
       },
       {
        "t": "Ignore it: a good film survives spoilers",
        "hype": -1
       },
       {
        "t": "Leak a fake ending to confuse everyone",
        "hype": 1,
        "risk": 1
       }
      ]
     },
     {
      "id": "cut",
      "when": "Post-production",
      "t": "The studio cuts twenty minutes",
      "text": "Without telling you, the studio removed twenty minutes to make the film shorter.",
      "choices": [
       {
        "t": "Go to the press",
        "hype": 1,
        "risk": 2
       },
       {
        "t": "Accept it and move on",
        "craft": -2
       },
       {
        "t": "Negotiate a director’s cut release later",
        "cost": 0.5,
        "craft": 1
       }
      ]
     },
     {
      "id": "rival",
      "when": "Six weeks before release",
      "t": "A superhero film moves to your weekend",
      "text": "The biggest superhero film of the year is now opening on the same weekend as yours.",
      "choices": [
       {
        "t": "Move your release date",
        "cost": 1,
        "hype": -1
       },
       {
        "t": "Stay and fight",
        "hype": 1,
        "risk": 2
       },
       {
        "t": "Market it as the smart alternative",
        "craft": 1,
        "hype": 1
       }
      ]
     }
    ],
    "task": "Explain it to the studio boss",
    "talk": [
     "For each crisis: what did you decide, and what would have happened if you had chosen differently?",
     "Which decision was the hardest? Why?",
     "If you could have changed one decision from the first film, which one would it have been?"
    ],
    "push": [
     "Be the furious studio boss. Push for third conditionals and should have."
    ]
   },
   {
    "id": "premiere",
    "kind": "premiere",
    "t": "The premiere",
    "min": 10,
    "blurb": "Is it better than the original?",
    "intro": "Opening night. Everyone is asking the same question: is it better than the first one?",
    "task": "Press conference",
    "talk": [
     "Press conference: your teacher is the press. Answer three questions about the sequel.",
     "Is it better than the original? Compare them honestly.",
     "Would you make a third film? What would it be about?"
    ],
    "push": [
     "Ask like a journalist: “Critics say it’s not as good as the original. What do you say?”",
     "End with: “Part three: yes or no?”"
    ]
   }
  ],
  "show": {
   "credits": [
    [
     "deal",
     "Deal"
    ],
    [
     "villain",
     "Villain"
    ],
    [
     "fx",
     "Effects"
    ],
    [
     "location",
     "Locations"
    ],
    [
     "music",
     "Music"
    ],
    [
     "trailer",
     "Marketing"
    ],
    [
     "release",
     "Release"
    ]
   ],
   "cast": [
    "lead",
    "villain"
   ],
   "sub": [
    "kind",
    "release"
   ],
   "verdicts": [
    "Better than the original",
    "The critics’ favourite sequel",
    "A box-office monster",
    "A franchise killer",
    "A misunderstood sequel",
    "A worthy part two"
   ],
   "extra": [
    "A sequel that knows why the first film worked.",
    "It isn’t as good as the original, but it isn’t trying to be.",
    "The last scene sets up a third film, and I’m already in."
   ]
  },
  "reviews": [
   {
    "if": "kind=bigger",
    "t": "Bigger, louder, longer. Not always better."
   },
   {
    "if": "kind=darker",
    "t": "A darker, braver sequel that’s better than the original."
   },
   {
    "if": "kind=prequel",
    "t": "A prequel that actually adds something. That’s rare."
   },
   {
    "if": "kind=spinoff",
    "t": "A new hero, the same world, and a surprising amount of heart."
   },
   {
    "if": "deal=studio",
    "t": "You can feel the studio’s fingerprints on every scene."
   },
   {
    "if": "deal=nodeal",
    "t": "This is clearly the director’s film, for better and for worse."
   },
   {
    "if": "deal=placement",
    "t": "Did the hero really need to stop and admire his new car?"
   },
   {
    "if": "lead=back",
    "t": "{lead} is back, and better than ever."
   },
   {
    "if": "lead=kill",
    "t": "Killing the hero in the first scene? The audience gasped. So did I."
   },
   {
    "if": "lead=recast",
    "t": "{lead} had big shoes to fill, and very nearly fills them."
   },
   {
    "if": "villain=creature",
    "t": "The computer-made creature looks expensive and feels empty."
   },
   {
    "if": "villain=legend",
    "t": "Dame Vivian Ashe plays a villain you can’t take your eyes off."
   },
   {
    "if": "villain=comedian",
    "t": "Who knew Rex Calloway could be this frightening?"
   },
   {
    "if": "fx=practical",
    "t": "Real stunts, real fire, real fear. You can tell."
   },
   {
    "if": "fx=cgi",
    "t": "The effects are impressive; the story isn’t."
   },
   {
    "if": "music=theme",
    "t": "When the original theme returns, the whole cinema cheered."
   },
   {
    "if": "trailer=everything",
    "t": "The trailer showed the whole film. Why buy a ticket?"
   },
   {
    "if": "trailer=teaser",
    "t": "The less they told us, the more we wanted to see it."
   },
   {
    "if": "ev:cut=0",
    "t": "The director’s war with the studio is the best story of the year."
   },
   {
    "if": "ev:cut=1",
    "t": "Something is missing: you can feel the scenes that were cut."
   },
   {
    "if": "ev:rival=2",
    "t": "The smart alternative to the superhero weekend, and the better film."
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
    "t": "A director who knows exactly what kind of sequel this should be."
   },
   {
    "if": "high",
    "t": "One of the best sequels in years."
   },
   {
    "if": "low",
    "t": "The first film deserved better than this."
   }
  ]
 },
 "plan": {
  "min": 90,
  "steps": [
   {
    "sec": "brief",
    "min": 5,
    "tip": "Remind him of his first film. Read the phrasebook together."
   },
   {
    "sec": "direction",
    "min": 12,
    "tip": "Comparatives with the first film. Make him sharpen the logline."
   },
   {
    "sec": "deal",
    "min": 10,
    "tip": "Be the studio boss. Push the negotiation language."
   },
   {
    "sec": "cast",
    "min": 15,
    "tip": "Play the agent asking for triple pay."
   },
   {
    "sec": "look",
    "min": 12,
    "tip": "Practical vs CGI debate. He describes the opening shot."
   },
   {
    "sec": "campaign",
    "min": 8,
    "tip": "He performs the trailer voice-over."
   },
   {
    "sec": "crisis",
    "min": 15,
    "tip": "Furious studio boss. Third conditionals and should have."
   },
   {
    "sec": "premiere",
    "min": 10,
    "tip": "Press conference: is it better than the original?"
   },
   {
    "label": "Wrap-up",
    "sec": "_end",
    "min": 3,
    "tip": "Set homework. Part three is up to him."
   }
  ],
  "homework": "Write a 200-word review of your own sequel, as a critic who loved the first film. Is it better or worse than the original, and why?"
 }
};
