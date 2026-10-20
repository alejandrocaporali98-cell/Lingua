// Lesson 109 · Travel & the Airport (Ada). Converted from ada/clases/travel.html
window.CLASE = {
 "id": "109",
 "titulo": "Travel & the Airport",
 "nivel": "B1",
 "color": "#7c3aed",
 "icono": "plane",
 "tema": "Airports and hotels run on a small set of fixed phrases.",
 "objetivos": [
  "How to get around when you travel",
  "Getting through the airport",
  "At the check-in desk"
 ],
 "flash": [
  {
   "img": "",
   "en": "I'd like to check in, please.",
   "def": "\"Check in\" for a flight or a hotel; \"check out\" when you leave a hotel. Two words as a verb.",
   "ex": "Hi, I'd like to check in for the 9am flight.",
   "tag": "at the desk"
  },
  {
   "img": "",
   "en": "Just this one, carry-on.",
   "def": "\"Carry-on\" is the bag you take on the plane. \"Checked baggage\" goes in the hold.",
   "ex": "No bags to check — just this one, carry-on.",
   "tag": "luggage"
  },
  {
   "img": "",
   "en": "Which gate is it?",
   "def": "\"Gate\" for the plane, \"platform\" for trains, \"terminal\" for the building.",
   "ex": "Do you know which gate the flight leaves from?",
   "tag": "finding your way"
  },
  {
   "img": "",
   "en": "The flight's been delayed.",
   "def": "Delayed = late. Cancelled = not happening. Note the passive: it HAS BEEN delayed.",
   "ex": "Our flight's been delayed by two hours.",
   "tag": "problems"
  },
  {
   "img": "",
   "en": "Excuse me, how do I get to...?",
   "def": "The standard opener for asking directions. Softer than \"Where is...?\" on its own.",
   "ex": "Excuse me, how do I get to the train station?",
   "tag": "directions"
  },
  {
   "img": "",
   "en": "It's just around the corner.",
   "def": "Means very close. Also useful: \"it's a five-minute walk\", \"it's just down the road\".",
   "ex": "The hotel? It's just around the corner.",
   "tag": "directions"
  },
  {
   "img": "",
   "en": "I'm here for a week.",
   "def": "What immigration and hotel staff ask. Answer with \"for\" + a length of time.",
   "ex": "I'm here for a week, visiting family.",
   "tag": "small talk"
  },
  {
   "img": "",
   "en": "Could you say that again, please?",
   "def": "The polite rescue phrase. Far better than freezing or saying \"What?\"",
   "ex": "Sorry, could you say that again, a bit slower?",
   "tag": "not understanding"
  }
 ],
 "frases": [
  {
   "p": "At the desk: \"I'd like to ___ for my flight.\"",
   "a": "check in",
   "w": [
    "check",
    "make check-in",
    "do the check in"
   ],
   "why": "\"Check in\" is the verb. \"Do the check-in\" is a direct translation that sounds wrong."
  },
  {
   "p": "Your bag goes on the plane with you: it's a ___.",
   "a": "carry-on",
   "w": [
    "hand luggage bag of hand",
    "carry bag",
    "portable"
   ],
   "why": "\"Carry-on\" (US) or \"hand luggage\" (UK). \"Portable\" is a false friend."
  },
  {
   "p": "The plane is late: \"The flight has been ___.\"",
   "a": "delayed",
   "w": [
    "delay",
    "retarded",
    "late"
   ],
   "why": "\"Delayed\" is the standard word. \"Retarded\" is a false friend of \"retrasado\" and is offensive in English — never use it."
  },
  {
   "p": "Asking directions: \"Excuse me, how do I ___ the museum?\"",
   "a": "get to",
   "w": [
    "arrive to",
    "go at",
    "reach at"
   ],
   "why": "\"Get to\" is the natural phrase. \"Arrive to\" is wrong — it's \"arrive at\" — but \"get to\" is what people actually say."
  },
  {
   "p": "Saying how long you're staying:",
   "a": "\"I'm here for a week.\"",
   "w": [
    "\"I'm here during a week.\"",
    "\"I stay a week here.\"",
    "\"I'm here by one week.\""
   ],
   "why": "\"For\" + length of time. \"During\" is used with events, not lengths."
  }
 ],
 "gaps": {
  "title": "Getting through the airport",
  "text": "A whole airport journey, from the check-in desk to the gate. Fill each gap to build it. Type the missing words.",
  "bank": [
   "check in",
   "carry-on",
   "boarding pass",
   "gate",
   "delayed"
  ],
  "items": [
   {
    "s": "I got to the airport early and went straight to ___.",
    "a": [
     "check in"
    ],
    "note": ""
   },
   {
    "s": "I only had a ___, so it was quick.",
    "a": [
     "carry-on"
    ],
    "note": ""
   },
   {
    "s": "They printed my ___ and told me the gate was B12.",
    "a": [
     "boarding pass"
    ],
    "note": ""
   },
   {
    "s": "They printed my boarding pass and told me the ___ was B12.",
    "a": [
     "gate"
    ],
    "note": ""
   },
   {
    "s": "Then the screen said the flight had been ___ by an hour, so I got a coffee and waited.",
    "a": [
     "delayed"
    ],
    "note": ""
   }
  ]
 },
 "roleplay": {
  "title": "At the check-in desk",
  "setup": "You're flying alone for the first time. Read each line, think how you'd answer, then reveal a natural version — and notice why it works.",
  "lines": [
   {
    "who": "Check-in agent",
    "t": "Good morning. Can I see your passport, please? Any bags to check?"
   },
   {
    "you": true,
    "cue": "Checking in.",
    "model": "Here you go. No, just this one — it's carry-on. Is that the right size, or do I need to check it?",
    "tip": "\"Here you go\" is what you say when handing something over. Asking one question about your own bag is normal and stops a problem at the gate later."
   },
   {
    "who": "Check-in agent",
    "t": "That's fine. You're at gate B12, boarding at seven twenty. Window or aisle?"
   },
   {
    "you": true,
    "cue": "Asking to confirm.",
    "model": "Sorry, could you say that again? Gate B12, boarding at seven twenty — is that right? And window, please.",
    "tip": "Repeating the numbers back is what travellers actually do, and \"could you say that again?\" is the polite rescue phrase. Never guess at a gate number."
   },
   {
    "who": "Passenger next to you",
    "t": "Excuse me — do you know if this is the queue for B12? The screen says the flight's delayed."
   },
   {
    "you": true,
    "cue": "Helping out.",
    "model": "I think so, yeah. Mine's B12 too. They said an hour delay, but the desk is just around the corner if you want to double-check.",
    "tip": "\"I think so, yeah\" hedges honestly instead of pretending to be sure. Offering a next step (\"the desk is just around the corner\") is what makes it helpful rather than a dead end."
   }
  ],
  "extra": ""
 },
 "final": [
  {
   "p": "\"I'd like to ___ for the 9am flight.\"",
   "a": "check in",
   "w": [
    "check",
    "do check in",
    "make check"
   ],
   "why": ""
  },
  {
   "p": "\"I only have a ___ bag.\"",
   "a": "carry-on",
   "w": [
    "portable",
    "hand of hand",
    "carrying"
   ],
   "why": ""
  },
  {
   "p": "\"The flight has been ___.\"",
   "a": "delayed",
   "w": [
    "retarded",
    "delay",
    "late of two hours"
   ],
   "why": ""
  },
  {
   "p": "\"Which ___ does it leave from?\"",
   "a": "gate",
   "w": [
    "door",
    "platform",
    "terminal number of gate"
   ],
   "why": ""
  },
  {
   "p": "\"Excuse me, how do I ___ the station?\"",
   "a": "get to",
   "w": [
    "arrive to",
    "go at",
    "reach on"
   ],
   "why": ""
  },
  {
   "p": "\"It's just around the ___.\"",
   "a": "corner",
   "w": [
    "side",
    "turn",
    "angle"
   ],
   "why": ""
  },
  {
   "p": "\"I'm here ___ a week.\"",
   "a": "for",
   "w": [
    "during",
    "by",
    "since"
   ],
   "why": ""
  },
  {
   "p": "\"Could you say that ___, please?\"",
   "a": "again",
   "w": [
    "another time",
    "one more",
    "repeat"
   ],
   "why": ""
  },
  {
   "p": "\"I need to ___ my luggage.\"",
   "a": "pick up",
   "w": [
    "take up",
    "catch",
    "recover"
   ],
   "why": ""
  },
  {
   "p": "\"Do you have a room ___ tonight?\"",
   "a": "available",
   "w": [
    "disponible",
    "free of",
    "vacant for"
   ],
   "why": ""
  },
  {
   "p": "\"What time do I have to check ___?\"",
   "a": "out",
   "w": [
    "off",
    "away",
    "down"
   ],
   "why": ""
  },
  {
   "p": "\"I missed my ___.\"",
   "a": "connection",
   "w": [
    "connecting",
    "correspondence",
    "link flight"
   ],
   "why": ""
  },
  {
   "p": "\"Is this seat ___?\"",
   "a": "taken",
   "w": [
    "occupied of",
    "busy",
    "reserved by someone"
   ],
   "why": ""
  },
  {
   "p": "\"It's a five-minute ___ from here.\"",
   "a": "walk",
   "w": [
    "walking",
    "to walk",
    "on foot walk"
   ],
   "why": ""
  },
  {
   "p": "\"Where can I ___ some money?\"",
   "a": "change",
   "w": [
    "exchange to",
    "change of",
    "make change"
   ],
   "why": ""
  },
  {
   "p": "Asking a stranger for directions politely:",
   "a": "\"Excuse me, how do I get to the museum?\"",
   "w": [
    "\"Where is the museum, tell me.\"",
    "\"You know the museum where is?\"",
    "\"I want to go the museum.\""
   ],
   "why": ""
  },
  {
   "p": "\"My suitcase didn't ___ up.\"",
   "a": "show",
   "w": [
    "came",
    "arrive to",
    "appear of"
   ],
   "why": ""
  },
  {
   "p": "\"Take the second ___ on the right.\"",
   "a": "turning",
   "w": [
    "turn of",
    "street to",
    "way"
   ],
   "why": ""
  },
  {
   "p": "\"The train ___ from platform four.\"",
   "a": "leaves",
   "w": [
    "leave",
    "is leave",
    "goes out"
   ],
   "why": ""
  },
  {
   "p": "When you don't understand the announcement:",
   "a": "\"Sorry, could you repeat that a bit slower?\"",
   "w": [
    "\"I no understand, speak slow.\"",
    "\"Repeat please more slow.\"",
    "\"Again but slowly you say.\""
   ],
   "why": ""
  }
 ]
};
