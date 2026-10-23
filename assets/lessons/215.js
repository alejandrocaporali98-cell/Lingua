// Lesson 215 · Technology & Everyday Problems (Domeniko). Converted from dom/clases/technology-everyday-problems.html
window.CLASE = {
 "id": "215",
 "titulo": "Technology & Everyday Problems",
 "nivel": "B1",
 "color": "#15803d",
 "icono": "chat",
 "tema": "Broken wifi, a frozen laptop, an app that won't load.",
 "objetivos": [
  "Saying what went wrong",
  "Explaining the problem",
  "A support agent who isn't helping"
 ],
 "flash": [
  {
   "img": "",
   "en": "It's not working.",
   "def": "Covers almost any device or service that has stopped doing its job. Simple and always correct.",
   "ex": "The printer's not working again.",
   "tag": "the all-purpose complaint"
  },
  {
   "img": "",
   "en": "It keeps crashing.",
   "def": "\"Keeps + -ing\" says it happens again and again — the detail support actually needs.",
   "ex": "The app keeps crashing when I open it.",
   "tag": "repeated failure"
  },
  {
   "img": "",
   "en": "It's frozen.",
   "def": "The screen is stuck and nothing responds. Never “it’s blocked”, which means something else.",
   "ex": "My laptop's frozen — nothing's responding.",
   "tag": "unresponsive"
  },
  {
   "img": "",
   "en": "I've tried turning it off and on again.",
   "def": "Say this early. It skips the first five minutes of any support call.",
   "ex": "Also: \"I've already restarted it twice.",
   "tag": "pre-empting"
  },
  {
   "img": "",
   "en": "The wifi keeps dropping.",
   "def": "The connection disconnects repeatedly. “Drop out” and “cut out” also work.",
   "ex": "The signal keeps dropping in this room.",
   "tag": "connection"
  },
  {
   "img": "",
   "en": "It won't let me log in.",
   "def": "\"It won't let me + verb\" is the natural way to say something is being refused.",
   "ex": "It won't let me reset my password.",
   "tag": "blocked action"
  },
  {
   "img": "",
   "en": "I'm getting an error message.",
   "def": "Then read it out exactly. The wording is what identifies the problem.",
   "ex": "It says ‘connection timed out’.",
   "tag": "reporting detail"
  },
  {
   "img": "",
   "en": "Could you talk me through it?",
   "def": "Asks someone to explain step by step without admitting you're lost.",
   "ex": "Could you talk me through it slowly?",
   "tag": "asking for steps"
  }
 ],
 "frases": [
  {
   "p": "Repeated failure: \"The app ___ crashing.\"",
   "a": "keeps",
   "w": [
    "keep",
    "is keeping",
    "always crash"
   ],
   "why": "\"Keeps + -ing\" is the fixed way to say something happens repeatedly."
  },
  {
   "p": "An unresponsive screen: \"My laptop's ___.\"",
   "a": "frozen",
   "w": [
    "blocked",
    "stopped",
    "freezing itself"
   ],
   "why": "\"Frozen\" is the standard word. \"Blocked\" suggests something is obstructed or banned."
  },
  {
   "p": "Something is refused: \"It ___ me log in.\"",
   "a": "won't let",
   "w": [
    "doesn't leave",
    "not permits",
    "won't leave"
   ],
   "why": "\"Won't let me + verb\" is the natural pattern. \"Leave\" is a false friend for dejar here."
  },
  {
   "p": "Connection problems: \"The wifi keeps ___.\"",
   "a": "dropping",
   "w": [
    "falling",
    "going down of",
    "to drop"
   ],
   "why": "\"The wifi keeps dropping\" is fixed. \"Falling\" is used for physical objects."
  },
  {
   "p": "Best opening line to a support agent:",
   "a": "\"Hi — my internet keeps dropping, and I've already restarted the router twice.\"",
   "w": [
    "\"Hello, I have a problem with the internet, it is bad.\"",
    "\"The internet does not function since some time.\"",
    "\"Good morning, my connection presents a failure.\""
   ],
   "why": "Symptom plus what you've already tried, in one sentence. It saves both of you five minutes of scripted questions."
  }
 ],
 "gaps": {
  "title": "Explaining the problem",
  "text": "Symptom, timing, what you've already tried. Fill each gap to build a call that skips the obvious questions and gets straight to a fix. Type the missing words.",
  "bank": [
   "keeps dropping",
   "I've already tried",
   "it won't let me",
   "an error message",
   "talk me through"
  ],
  "items": [
   {
    "s": "Hi — my internet ___, every ten minutes or so.",
    "a": [
     "keeps dropping"
    ],
    "note": ""
   },
   {
    "s": "___ restarting the router and changing the channel.",
    "a": [
     "I've already tried"
    ],
    "note": ""
   },
   {
    "s": "When I open the settings page ___ save anything — I just get an error message that says ‘connection timed out’.",
    "a": [
     "it won't let me"
    ],
    "note": ""
   },
   {
    "s": "When I open the settings page it won't let me save anything — I just get ___ that says ‘connection timed out’.",
    "a": [
     "an error message"
    ],
    "note": ""
   },
   {
    "s": "Could you ___ what to check next?",
    "a": [
     "talk me through"
    ],
    "note": ""
   }
  ]
 },
 "roleplay": {
  "title": "A support agent who isn't helping",
  "setup": "You've already tried everything they're suggesting. Read each turn, think about your reply, then reveal a version that stays polite and still pushes.",
  "lines": [
   {
    "who": "Support agent",
    "t": "Have you tried switching the router off and on again?"
   },
   {
    "you": true,
    "cue": "Natural response.",
    "model": "I have, yeah — three times, and I've also reset it to factory settings. The odd thing is it only drops in the evenings. Does that suggest anything to you?",
    "tip": "Confirm briefly, list what you've done, then hand over the clue they don't have. \"Does that suggest anything to you?\" moves them off the script and into actually thinking."
   },
   {
    "who": "Support agent",
    "t": "It could be congestion. I'd suggest waiting a few days and seeing if it settles down."
   },
   {
    "you": true,
    "cue": "Natural response.",
    "model": "I'd rather not wait, to be honest — I work from home and it's been going on for two weeks now. Is there anything else we can try today? And if not, could you escalate it for me?",
    "tip": "\"I'd rather not\" refuses without conflict. Giving a reason and a timescale makes the refusal reasonable, and asking them to escalate is a normal, effective request."
   }
  ],
  "extra": ""
 },
 "final": [
  {
   "p": "\"The app ___ crashing.\"",
   "a": "keeps",
   "w": [
    "keep",
    "is keep",
    "always crash"
   ],
   "why": ""
  },
  {
   "p": "\"My laptop's ___.\"",
   "a": "frozen",
   "w": [
    "blocked",
    "freezed",
    "stopped itself"
   ],
   "why": ""
  },
  {
   "p": "\"It ___ me log in.\"",
   "a": "won't let",
   "w": [
    "doesn't leave",
    "not lets",
    "won't leave"
   ],
   "why": ""
  },
  {
   "p": "\"The wifi keeps ___.\"",
   "a": "dropping",
   "w": [
    "falling",
    "to drop",
    "down"
   ],
   "why": ""
  },
  {
   "p": "\"I'm getting an error ___.\"",
   "a": "message",
   "w": [
    "note",
    "signal of error",
    "advice"
   ],
   "why": ""
  },
  {
   "p": "\"Could you ___ me through it?\"",
   "a": "talk",
   "w": [
    "explain",
    "say",
    "pass"
   ],
   "why": ""
  },
  {
   "p": "\"I need to ___ my password.\"",
   "a": "reset",
   "w": [
    "restart",
    "reinitiate",
    "put again"
   ],
   "why": ""
  },
  {
   "p": "\"Try ___ it off and on again.\"",
   "a": "turning",
   "w": [
    "to turn",
    "turn",
    "for turning"
   ],
   "why": ""
  },
  {
   "p": "\"The battery ___ very quickly.\"",
   "a": "drains",
   "w": [
    "empties itself",
    "goes down of",
    "finishes"
   ],
   "why": ""
  },
  {
   "p": "\"My phone won't ___ on.\"",
   "a": "turn",
   "w": [
    "start to",
    "put",
    "light"
   ],
   "why": ""
  },
  {
   "p": "\"Could you ___ the file over?\"",
   "a": "send",
   "w": [
    "pass to",
    "throw",
    "give to"
   ],
   "why": ""
  },
  {
   "p": "\"It's ___ of storage.\"",
   "a": "run out",
   "w": [
    "running out",
    "finished",
    "empty"
   ],
   "why": ""
  },
  {
   "p": "\"I'll ___ the app.\"",
   "a": "update",
   "w": [
    "actualise",
    "put up to date",
    "renew"
   ],
   "why": ""
  },
  {
   "p": "\"The screen has ___.\"",
   "a": "cracked",
   "w": [
    "broken itself",
    "crashed",
    "split up"
   ],
   "why": ""
  },
  {
   "p": "\"Is it ___ to the wifi?\"",
   "a": "connected",
   "w": [
    "connect",
    "in connection",
    "linked at"
   ],
   "why": ""
  },
  {
   "p": "\"I've ___ my password.\"",
   "a": "forgotten",
   "w": [
    "forget",
    "lost of memory",
    "missed"
   ],
   "why": ""
  },
  {
   "p": "\"Can you ___ me a screenshot?\"",
   "a": "send",
   "w": [
    "make to",
    "do",
    "take for"
   ],
   "why": ""
  },
  {
   "p": "\"The file won't ___.\"",
   "a": "open",
   "w": [
    "to open",
    "opening",
    "be opened by me"
   ],
   "why": ""
  },
  {
   "p": "\"It's been ___ for ten minutes.\"",
   "a": "loading",
   "w": [
    "load",
    "in load",
    "charging itself"
   ],
   "why": ""
  },
  {
   "p": "Best way to ask for the problem to go higher:",
   "a": "\"Could you escalate this for me?\"",
   "w": [
    "\"Pass me to your chief.\"",
    "\"I want speak with more important person.\"",
    "\"Send this problem up, please.\""
   ],
   "why": ""
  }
 ],
 "read": {
  "short": "A support call that worked",
  "kicker": "Tech · Story",
  "title": "Forty minutes with tech support",
  "before": "Have you ever called tech support? How did it go?",
  "text": [
   "On Monday morning, ten minutes before an important video call, Daniel's laptop froze. Not slow — completely [[frozen]]. When he restarted it, things got worse: the video app [[kept crashing]], and [[the wifi kept dropping]] every two minutes.",
   "He called his company's IT support. The first agent asked, \"Have you tried turning it off?\" Daniel said, \"Yes, [[I've tried turning it off and on again]], twice. Now [[it won't let me log in]] to the VPN either.\" That saved them five minutes.",
   "The agent asked him to describe exactly what happened. \"The app opens, then [[it keeps crashing]] after ten seconds. No error message.\" The agent took control of the laptop remotely and found the problem: an automatic update had installed overnight and hadn't finished.",
   "Twenty minutes later, everything was [[working]] again. Daniel joined the call a little late, apologised, and explained, \"Sorry — tech problems.\" Everybody nodded. It had happened to all of them."
  ],
  "gloss": {
   "frozen": "The screen is stuck and nothing responds.",
   "kept crashing": "keep + -ing = it happens again and again.",
   "the wifi kept dropping": "The connection disconnects again and again.",
   "I've tried turning it off and on again": "Say this early. It saves time with support.",
   "it won't let me log in": "It won't let me + verb = it doesn't allow me.",
   "it keeps crashing": "It closes unexpectedly again and again.",
   "working": "It's (not) working = it does (not) do its job."
  },
  "questions": [
   {
    "q": "When did the laptop freeze?",
    "a": "Just before an important video call",
    "w": [
     "During the night",
     "On Friday afternoon"
    ],
    "ev": "ten minutes before an important video call"
   },
   {
    "q": "What did Daniel say to save time?",
    "a": "That he had already restarted it twice",
    "w": [
     "That he needed a new laptop",
     "That it was urgent"
    ],
    "ev": "I've tried turning it off and on again"
   },
   {
    "q": "What else couldn't Daniel do?",
    "a": "Log in to the VPN",
    "w": [
     "Open his email",
     "Charge the laptop"
    ],
    "ev": "it won't let me log in to the VPN"
   },
   {
    "q": "What was causing the problem?",
    "a": "An unfinished automatic update",
    "w": [
     "A virus",
     "A broken wifi router"
    ],
    "ev": "an automatic update had installed overnight and hadn't finished"
   },
   {
    "q": "How did the others react on the call?",
    "a": "They understood — it had happened to them too.",
    "w": [
     "They were angry.",
     "They ended the call."
    ],
    "ev": "It had happened to all of them."
   }
  ],
  "after": "Describe a tech problem to your teacher as if they were support: what it <b>keeps doing</b>, what you've <b>tried</b>, and what it <b>won't let you</b> do."
 },
 "grammar": {
  "kind": "rule",
  "title": "keep + -ing / won't let me",
  "intro": "Two patterns do most of the work when something breaks: one for repeated problems, one for things that are blocked.",
  "pattern": [
   "It keeps",
   "+-ing",
   "=every two minutes"
  ],
  "note": "<b>keep + -ing</b> = again and again. <b>It won't let me + verb</b> = it doesn't allow me. Not <b>it doesn't let me to</b>.",
  "examples": [
   "It **keeps crashing**.",
   "The wifi **keeps dropping**.",
   "It **won't let me log in**.",
   "The printer **won't let me print** in colour."
  ],
  "wrong": "It doesn't let me ~~to log in~~.",
  "right": "It **won't let me log in**.",
  "task": "Your turn · choose the clearest description",
  "drill": [
   {
    "p": "The app closes again and again.",
    "a": "The app keeps crashing.",
    "w": [
     "The app keeps to crash.",
     "The app is crashing always."
    ]
   },
   {
    "p": "You can't download the file.",
    "a": "It won't let me download the file.",
    "w": [
     "It won't let me to download the file.",
     "It doesn't leave me download the file."
    ]
   },
   {
    "p": "The screen is stuck.",
    "a": "It's frozen.",
    "w": [
     "It's blocked.",
     "It's freezed."
    ]
   },
   {
    "p": "You already restarted it.",
    "a": "I've tried restarting it.",
    "w": [
     "I've tried to restarting it.",
     "I tried restart it already."
    ]
   }
  ],
  "say": "Now describe a real problem with your phone or computer in three sentences."
 }
};
