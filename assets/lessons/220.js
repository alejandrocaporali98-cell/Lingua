// Lesson 220 · Formal vs Casual (Domeniko). Converted from dom/clases/formal-vs-casual.html
window.CLASE = {
 "id": "220",
 "titulo": "Formal vs Casual",
 "nivel": "B1",
 "color": "#0e7490",
 "icono": "chat",
 "tema": "English shifts register constantly: same meaning, different words, depending on who's listening.",
 "objetivos": [
  "The same thing, said two ways",
  "Writing it up and down",
  "Two messages, ten minutes apart"
 ],
 "flash": [
  {
   "img": "",
   "en": "Could you…\" vs \"Can you…",
   "def": "Could is softer and safer with anyone senior or external. Can is fine among friends and close colleagues.",
   "ex": "Could you send it over?\" / \"Can you send it?",
   "tag": "request"
  },
  {
   "img": "",
   "en": "I apologise\" vs \"Sorry",
   "def": "I apologise is for clients and formal writing. Sorry covers everything else.",
   "ex": "I apologise for the delay.\" / \"Sorry, my bad.",
   "tag": "apology"
  },
  {
   "img": "",
   "en": "I'd like to\" vs \"I want to",
   "def": "I want to sounds blunt in English. I'd like to is the neutral default.",
   "ex": "I'd like to suggest something.",
   "tag": "stating a wish"
  },
  {
   "img": "",
   "en": "Regarding\" vs \"About",
   "def": "Regarding belongs in formal email; about is what people say out loud.",
   "ex": "Regarding your invoice…\" / \"About that invoice…",
   "tag": "introducing a topic"
  },
  {
   "img": "",
   "en": "Please find attached\" vs \"Here's",
   "def": "The first is formal email boilerplate; the second is normal between colleagues.",
   "ex": "Here's the file.\" / \"Please find the report attached.",
   "tag": "sending a file"
  },
  {
   "img": "",
   "en": "Contractions",
   "def": "I'm, don't, we'll sound natural and relaxed. Writing them out sounds formal or stern.",
   "ex": "I do not agree\" lands much harder than \"I don't agree\".",
   "tag": "the quickest dial"
  },
  {
   "img": "",
   "en": "Best regards\" vs \"Cheers",
   "def": "Best regards for clients, Cheers or Thanks among colleagues, nothing at all in chat.",
   "ex": "Never \"Cheers\" in a first email to a client.",
   "tag": "sign-off"
  },
  {
   "img": "",
   "en": "No worries\" / \"Not a problem",
   "def": "Warm and very common at work, but too light for a formal complaint or apology.",
   "ex": "No worries, take your time.",
   "tag": "casual reassurance"
  }
 ],
 "frases": [
  {
   "p": "Emailing a client you've never met:",
   "a": "\"Could you confirm the details, please?\"",
   "w": [
    "\"Can you confirm the details?\"",
    "\"Confirm the details please.\"",
    "\"Need you to confirm details.\""
   ],
   "why": "Could plus please is the safe default with someone external. The others range from blunt to abrupt."
  },
  {
   "p": "Messaging a colleague you sit next to:",
   "a": "\"Can you send me that file?\"",
   "w": [
    "\"I would be grateful if you could forward the document.\"",
    "\"Please find attached your request.\"",
    "\"I hereby request the file.\""
   ],
   "why": "Over-formal language with a close colleague reads as cold or sarcastic. Match the distance."
  },
  {
   "p": "Formal apology to a client: \"I ___ for the delay.\"",
   "a": "apologise",
   "w": [
    "am sorry so much",
    "say sorry",
    "regret you"
   ],
   "why": "\"I apologise\" is the formal standard. \"Sorry\" is fine informally, but weaker in writing to a client."
  },
  {
   "p": "Softening a wish: \"I ___ suggest a different approach.\"",
   "a": "'d like to",
   "w": [
    "want to",
    "am wanting to",
    "will"
   ],
   "why": "\"I want to\" sounds demanding in English. \"I'd like to\" is the neutral professional form."
  },
  {
   "p": "Which sign-off fits a first email to a new client?",
   "a": "Best regards",
   "w": [
    "Cheers",
    "Later",
    "Hugs"
   ],
   "why": "Best regards is the safe formal sign-off. Cheers is for colleagues you already know."
  }
 ],
 "gaps": {
  "title": "Writing it up and down",
  "text": "One request, written to a colleague and to a client. Fill each gap with the version that matches the reader. Type the missing words.",
  "bank": [
   "Could you",
   "Regarding",
   "I apologise",
   "Please find",
   "Best regards"
  ],
  "items": [
   {
    "s": "Dear Ms Turner, ___ the delivery scheduled for Friday — I apologise for the short notice, but we need to move it to Monday.",
    "a": [
     "Regarding"
    ],
    "note": ""
   },
   {
    "s": "Dear Ms Turner, Regarding the delivery scheduled for Friday — ___ for the short notice, but we need to move it to Monday.",
    "a": [
     "I apologise"
    ],
    "note": ""
   },
   {
    "s": "___ confirm whether that works on your end?",
    "a": [
     "Could you"
    ],
    "note": ""
   },
   {
    "s": "___ the updated schedule attached.",
    "a": [
     "Please find"
    ],
    "note": ""
   },
   {
    "s": "___, Domeniko",
    "a": [
     "Best regards"
    ],
    "note": ""
   }
  ]
 },
 "roleplay": {
  "title": "Two messages, ten minutes apart",
  "setup": "The same problem explained to a friend and to a client. Read each turn, then reveal a natural version.",
  "lines": [
   {
    "who": "Friend at work",
    "t": "Did the delivery thing get sorted? I heard it went sideways."
   },
   {
    "you": true,
    "cue": "Natural response.",
    "model": "Ugh, not yet. The supplier messed up the dates and now it's on me to tell the client. It's a bit of a nightmare, to be honest.",
    "tip": "Contractions, a filler (‘Ugh’), a phrasal verb (‘messed up’) and an idiom. This is the casual dial turned all the way up — and completely appropriate here."
   },
   {
    "who": "The client, ten minutes later",
    "t": "We were expecting the shipment this morning. Can you explain what happened?"
   },
   {
    "you": true,
    "cue": "Natural response.",
    "model": "I apologise for the delay — there was an error on the supplier's side with the delivery dates. I'd like to propose Monday as the new date, and I'll confirm in writing this afternoon. Could you let me know if that works for you?",
    "tip": "Same facts, different voice: \"an error on the supplier's side\" instead of \"they messed up\", no contractions in the apology, and \"I'd like to propose\" instead of \"I want to move it\"."
   }
  ],
  "extra": ""
 },
 "final": [
  {
   "p": "To a client: \"___ confirm the details, please?\"",
   "a": "Could you",
   "w": [
    "Can you",
    "You can",
    "Will you to"
   ],
   "why": ""
  },
  {
   "p": "Formal: \"I ___ for the delay.\"",
   "a": "apologise",
   "w": [
    "am sorry much",
    "regret you",
    "say sorry"
   ],
   "why": ""
  },
  {
   "p": "Neutral: \"I ___ suggest something.\"",
   "a": "'d like to",
   "w": [
    "want to",
    "am wanting",
    "will want"
   ],
   "why": ""
  },
  {
   "p": "Formal email opener:",
   "a": "Regarding your invoice…",
   "w": [
    "About that invoice…",
    "On your invoice thing…",
    "Invoice talk:"
   ],
   "why": ""
  },
  {
   "p": "Formal sign-off:",
   "a": "Best regards",
   "w": [
    "Cheers",
    "Later",
    "See ya"
   ],
   "why": ""
  },
  {
   "p": "Casual reassurance:",
   "a": "No worries.",
   "w": [
    "It is of no consequence.",
    "I absolve you.",
    "Think nothing of this."
   ],
   "why": ""
  },
  {
   "p": "Sending a file formally:",
   "a": "Please find the report attached.",
   "w": [
    "Here's the thing.",
    "I send you the report.",
    "Attached goes report."
   ],
   "why": ""
  },
  {
   "p": "\"I do not agree\" compared to \"I don't agree\" sounds…",
   "a": "colder and firmer",
   "w": [
    "warmer",
    "identical",
    "less correct"
   ],
   "why": ""
  },
  {
   "p": "To your manager: \"___ have a quick word?\"",
   "a": "Could I",
   "w": [
    "Can I to",
    "I want to",
    "May I to"
   ],
   "why": ""
  },
  {
   "p": "Formal: \"Thank you for ___ patience.\"",
   "a": "your",
   "w": [
    "the your",
    "you",
    "yours"
   ],
   "why": ""
  },
  {
   "p": "Casual: \"___ you a hand?\"",
   "a": "Need",
   "w": [
    "Do you need that I give",
    "Are you needing",
    "You want that"
   ],
   "why": ""
  },
  {
   "p": "Formal decline:",
   "a": "I'm afraid we won't be able to.",
   "w": [
    "No way.",
    "Nope, can't.",
    "That is impossible for us."
   ],
   "why": ""
  },
  {
   "p": "Casual chase: \"___ on that file?\"",
   "a": "Any update",
   "w": [
    "I request update",
    "Update please now",
    "Where is situated"
   ],
   "why": ""
  },
  {
   "p": "Formal chase:",
   "a": "I wanted to follow up on my previous email.",
   "w": [
    "You didn't answer me.",
    "Why no reply?",
    "I am waiting still."
   ],
   "why": ""
  },
  {
   "p": "To a close colleague:",
   "a": "Can you send it over?",
   "w": [
    "I would be most grateful if you could forward it.",
    "I hereby request it.",
    "Kindly do the needful."
   ],
   "why": ""
  },
  {
   "p": "\"Cheers\" as a sign-off is right for…",
   "a": "a colleague you know",
   "w": [
    "a first email to a client",
    "a legal letter",
    "a job application"
   ],
   "why": ""
  },
  {
   "p": "Formal: \"___ let me know at your earliest convenience.\"",
   "a": "Please",
   "w": [
    "I want you",
    "You must",
    "Do"
   ],
   "why": ""
  },
  {
   "p": "Casual: \"Sorry, ___.\"",
   "a": "my bad",
   "w": [
    "my fault is",
    "the guilt is mine",
    "I am guilty"
   ],
   "why": ""
  },
  {
   "p": "Which is too casual for a client email?",
   "a": "Just wanted to ping you real quick.",
   "w": [
    "I wanted to follow up.",
    "Could you confirm?",
    "Please find attached."
   ],
   "why": ""
  },
  {
   "p": "The safest rule when you're unsure of the register:",
   "a": "Go slightly more formal than you think you need.",
   "w": [
    "Always use the most casual option.",
    "Avoid greetings entirely.",
    "Use the same tone with everyone."
   ],
   "why": ""
  }
 ],
 "read": {
  "short": "Two messages, ten minutes apart",
  "kicker": "Work · Writing",
  "title": "Same news, two very different messages",
  "before": "Do you write differently to your boss and to your friends? How?",
  "text": [
   "Last Friday, a delivery to an important client arrived two days late. Andrés had to tell two people: the client, and his colleague Mariana. He wrote both messages in ten minutes — and they look like they come from two different people.",
   "To the client: \"Dear Mr Hall, [[regarding]] your order from 3 March, I [[apologise]] for the delay in delivery. The shipment was held at customs. [[I'd like to]] offer a 10% discount on your next order. [[Please find attached]] the updated tracking information. Kind regards, Andrés Molina.\"",
   "To Mariana on chat: \"Hey! So the Hall order showed up late — customs again. [[Sorry]], I know you told me to check it. [[Can you]] send me the discount code thing? I wanna sort it today. [[Here's]] the tracking 👇\"",
   "Both messages are good English. The difference is distance. Formal language creates space and shows respect. Casual language — [[contractions]], short sentences, \"hey\" — shows trust. The skill isn't knowing one style. It's knowing when to switch."
  ],
  "gloss": {
   "regarding": "Formal for \"about\". Mostly in emails.",
   "apologise": "I apologise = formal and serious. \"Sorry\" covers everything else.",
   "I'd like to": "The neutral, polite default. \"I want to\" sounds blunt.",
   "Please find attached": "Formal email phrase. Casual: \"Here's…\"",
   "Sorry": "The casual apology for almost everything.",
   "Can you": "Fine with friends and close colleagues. \"Could you\" is softer.",
   "Here's": "The casual way to share something.",
   "contractions": "I'm, don't, we'll. Natural and relaxed. Full forms sound formal."
  },
  "questions": [
   {
    "q": "What was the problem?",
    "a": "A delivery arrived two days late.",
    "w": [
     "The client cancelled the order.",
     "The wrong product was sent."
    ],
    "ev": "arrived two days late"
   },
   {
    "q": "Why was the shipment late?",
    "a": "It was held at customs.",
    "w": [
     "The driver got lost.",
     "The factory closed."
    ],
    "ev": "The shipment was held at customs."
   },
   {
    "q": "What did Andrés offer the client?",
    "a": "A 10% discount on the next order",
    "w": [
     "A full refund",
     "Free shipping forever"
    ],
    "ev": "a 10% discount on your next order"
   },
   {
    "q": "What does Andrés ask Mariana for?",
    "a": "The discount code",
    "w": [
     "The tracking number",
     "The client's phone number"
    ],
    "ev": "send me the discount code thing"
   },
   {
    "q": "According to the writer, what's the real skill?",
    "a": "Knowing when to switch styles",
    "w": [
     "Always writing formally",
     "Using lots of emojis"
    ],
    "ev": "It's knowing when to switch."
   }
  ],
  "after": "Write the same message twice: tell your <b>boss</b> and then a <b>friend</b> that you'll be late tomorrow."
 },
 "grammar": {
  "kind": "rule",
  "title": "up or down a register",
  "intro": "Most phrases have a formal version and a casual version. Moving between them is a skill you can practise like grammar.",
  "pattern": [
   "Casual",
   "+↔",
   "=Formal"
  ],
  "note": "about ↔ <b>regarding</b> · sorry ↔ <b>I apologise</b> · I want ↔ <b>I'd like</b> · here's ↔ <b>please find attached</b> · can you ↔ <b>could you</b>",
  "examples": [
   "**About** the meeting… → **Regarding** the meeting…",
   "**Sorry** for the delay. → **I apologise** for the delay.",
   "**I want** to change the date. → **I'd like** to change the date.",
   "**Here's** the file. → **Please find attached** the file."
  ],
  "wrong": "Dear Mr Hall, ~~I want~~ a refund. ~~Here's~~ my receipt.",
  "right": "Dear Mr Hall, **I'd like** a refund. **Please find attached** my receipt.",
  "task": "Your turn · choose the formal version",
  "drill": [
   {
    "p": "\"About your email from Monday…\"",
    "a": "Regarding your email from Monday…",
    "w": [
     "Respecting your email from Monday…",
     "About of your email from Monday…"
    ]
   },
   {
    "p": "\"Sorry for the mistake.\"",
    "a": "I apologise for the mistake.",
    "w": [
     "I apologise the mistake.",
     "I'm apologising of the mistake."
    ]
   },
   {
    "p": "\"Can you send me the contract?\"",
    "a": "Could you send me the contract, please?",
    "w": [
     "You could send me the contract?",
     "Could you to send me the contract?"
    ]
   },
   {
    "p": "\"I want to book a meeting.\"",
    "a": "I'd like to book a meeting.",
    "w": [
     "I'd like book a meeting.",
     "I would want booking a meeting."
    ]
   }
  ],
  "say": "Now tell your teacher about your weekend twice: once casually, once as if to a client."
 }
};
