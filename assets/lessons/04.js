// Lesson 04 content. The player (assets/leccion.js) renders it.
window.CLASE = {
 "id": "04",
 "titulo": "Anime Night",
 "nivel": "A2",
 "color": "#6d3fd6",
 "icono": "chat",
 "objetivos": [
  "Give your opinion with I love, I don’t mind, I can’t stand…",
  "Explain why with because, and describe with -ing / -ed adjectives",
  "Agree and disagree politely in a conversation"
 ],
 "flash": [
  {
   "img": "❤️",
   "en": "I love…",
   "def": "I like it 100%.",
   "ex": "I love Attack on Titan. The story is incredible.",
   "tag": "opinion"
  },
  {
   "img": "😐",
   "en": "I don't mind…",
   "def": "It's OK. I don't love it and I don't hate it.",
   "ex": "I don't mind dubbed anime, but I prefer subtitles.",
   "tag": "opinion"
  },
  {
   "img": "😖",
   "en": "I can't stand…",
   "def": "I really hate it.",
   "ex": "I can't stand filler episodes.",
   "tag": "opinion"
  },
  {
   "img": "💭",
   "en": "I think…",
   "def": "This is my opinion.",
   "ex": "I think the ending is perfect.",
   "tag": "opinion"
  },
  {
   "img": "👉",
   "en": "because",
   "def": "It gives the reason.",
   "ex": "I like Levi because he's so calm.",
   "tag": "connector"
  },
  {
   "img": "🤝",
   "en": "agree / disagree",
   "def": "Have the same opinion / a different opinion.",
   "ex": "I agree with you. / Sorry, I disagree.",
   "tag": "opinion"
  },
  {
   "img": "📉",
   "en": "overrated",
   "def": "People say it's great, but you think it isn't.",
   "ex": "In my opinion, that show is overrated.",
   "tag": "opinion"
  },
  {
   "img": "📣",
   "en": "recommend",
   "def": "Tell someone to try something good.",
   "ex": "I recommend One Piece. It's long, but it's amazing.",
   "tag": "phrase"
  },
  {
   "img": "📺",
   "en": "episode",
   "def": "One part of a series.",
   "ex": "Each episode is about 24 minutes long.",
   "tag": "anime"
  },
  {
   "img": "🗓️",
   "en": "season",
   "def": "A group of episodes.",
   "ex": "Attack on Titan has four seasons.",
   "tag": "anime"
  },
  {
   "img": "🦸",
   "en": "main character",
   "def": "The most important person in the story.",
   "ex": "Eren Yeager is the main character of Attack on Titan.",
   "tag": "anime"
  },
  {
   "img": "😈",
   "en": "villain",
   "def": "The bad character in a story.",
   "ex": "Every hero needs a good villain.",
   "tag": "anime"
  },
  {
   "img": "📖",
   "en": "plot",
   "def": "What happens in the story.",
   "ex": "The plot has a lot of surprises.",
   "tag": "anime"
  },
  {
   "img": "💬",
   "en": "subtitles",
   "def": "Words at the bottom of the screen.",
   "ex": "I watch anime in Japanese with English subtitles.",
   "tag": "anime"
  },
  {
   "img": "🤩",
   "en": "exciting / excited",
   "def": "-ing = how the thing is. -ed = how you feel.",
   "ex": "The fight is exciting. I'm so excited!",
   "tag": "grammar"
  },
  {
   "img": "🥱",
   "en": "boring / bored",
   "def": "-ing = how the thing is. -ed = how you feel.",
   "ex": "The episode is boring, so I'm bored.",
   "tag": "grammar"
  }
 ],
 "frases": [
  {
   "p": "Do you like horror anime?",
   "a": "No, I can't stand it. It's too scary.",
   "w": [
    "No, I can't stand. It's too scary.",
    "No, I don't stand it. It's too scary.",
    "No, I can't support it. It's too scary."
   ],
   "why": "Can't stand + the thing (it). “Support” means to help or to cheer for a team."
  },
  {
   "p": "What do you think of the new season?",
   "a": "I think it's amazing.",
   "w": [
    "I think is amazing.",
    "I'm think it's amazing.",
    "I think that amazing."
   ],
   "why": "Always use a subject and a verb: I think it's…"
  },
  {
   "p": "Why do you like Levi?",
   "a": "Because he's the strongest soldier.",
   "w": [
    "Because is the strongest soldier.",
    "Why he's the strongest soldier.",
    "For that he's the strongest soldier."
   ],
   "why": "Answer “why” with because + subject + verb."
  },
  {
   "p": "Do you like the new episodes?",
   "a": "Yes! I'm really excited for the next one.",
   "w": [
    "Yes! I'm really exciting for the next one.",
    "Yes! I'm really excite for the next one.",
    "Yes! I have really excited for the next one."
   ],
   "why": "How you feel → -ed: I'm excited. The thing → -ing: it's exciting."
  },
  {
   "p": "I think One Piece is too long.",
   "a": "I agree. It has more than a thousand episodes!",
   "w": [
    "I'm agree. It has more than a thousand episodes!",
    "I am agree with. It has more than a thousand episodes!",
    "I agree. It has more than a thousands episodes!"
   ],
   "why": "Agree is a verb: I agree (not I'm agree)."
  },
  {
   "p": "Do you prefer subtitles or dubbing?",
   "a": "I prefer subtitles, but I don't mind dubbing.",
   "w": [
    "I prefer subtitles, but I don't care of dubbing.",
    "I prefer subtitles, but I'm not mind dubbing.",
    "I prefer more subtitles, but I don't mind dubbing."
   ],
   "why": "I don't mind = it's OK for me."
  },
  {
   "p": "Do you like the show?",
   "a": "Not really. I think it's boring.",
   "w": [
    "Not really. I think it's bored.",
    "Not really. I'm boring with it.",
    "Not really. I think is boring."
   ],
   "why": "The show is boring (-ing). You are bored (-ed)."
  },
  {
   "p": "What anime do you recommend?",
   "a": "I recommend Demon Slayer. The animation is beautiful.",
   "w": [
    "I recommend you Demon Slayer. The animation is beautiful.",
    "I recommend to watch Demon Slayer. The animation is beautiful.",
    "Recommend Demon Slayer. The animation is beautiful."
   ],
   "why": "Recommend + the thing. Not “recommend you…” or “recommend to…”."
  }
 ],
 "gaps": {
  "title": "My anime review",
  "text": "Complete the review with a word from the word bank. Press Enter to check each one.",
  "bank": [
   "love",
   "because",
   "think",
   "mind",
   "stand",
   "boring",
   "excited",
   "agree",
   "main",
   "recommend"
  ],
  "items": [
   {
    "s": "I ___ Attack on Titan. It's my favorite anime.",
    "a": [
     "love"
    ],
    "note": "I love = I like it 100%."
   },
   {
    "s": "The ___ character is Eren.",
    "a": [
     "main"
    ],
    "note": "Main character = the most important one."
   },
   {
    "s": "I like it ___ the story is full of surprises.",
    "a": [
     "because"
    ],
    "note": "Because gives the reason."
   },
   {
    "s": "I ___ the last season is the best one.",
    "a": [
     "think"
    ],
    "note": "I think = in my opinion."
   },
   {
    "s": "Some episodes are slow, but I don't ___.",
    "a": [
     "mind"
    ],
    "note": "I don't mind = it's OK for me."
   },
   {
    "s": "I can't ___ sad endings. I always cry!",
    "a": [
     "stand"
    ],
    "note": "Can't stand = really hate."
   },
   {
    "s": "My friend thinks it's ___, but I think it's exciting.",
    "a": [
     "boring"
    ],
    "note": "Boring is the opposite of exciting."
   },
   {
    "s": "I'm so ___ for the movie!",
    "a": [
     "excited"
    ],
    "note": "How you feel → -ed."
   },
   {
    "s": "Do you ___ with me? Is it the best anime?",
    "a": [
     "agree"
    ],
    "note": "Agree = have the same opinion."
   },
   {
    "s": "I ___ it to everyone. Watch it!",
    "a": [
     "recommend"
    ],
    "note": "Recommend = tell people to try it."
   }
  ]
 },
 "roleplay": {
  "title": "Anime Night debate",
  "setup": "You and a friend are choosing what to watch tonight. Your friend has different opinions. Answer out loud and give reasons with “because”. If you get stuck, look at the example.",
  "lines": [
   {
    "who": "Friend",
    "t": "So, what do we watch tonight? I want something funny."
   },
   {
    "you": true,
    "cue": "Suggest an anime you like.",
    "model": "What about Attack on Titan? I love it."
   },
   {
    "who": "Friend",
    "t": "Hmm, I think it's too dark. I can't stand sad stories."
   },
   {
    "you": true,
    "cue": "Disagree politely and give a reason.",
    "model": "I don't agree. It's sad, but the story is amazing."
   },
   {
    "who": "Friend",
    "t": "OK… Who is your favorite character?"
   },
   {
    "you": true,
    "cue": "Say your favorite character and why (because…).",
    "model": "My favorite is Levi, because he's calm and super strong."
   },
   {
    "who": "Friend",
    "t": "Do you prefer subtitles or dubbing?"
   },
   {
    "you": true,
    "cue": "Use “I prefer…” or “I don't mind…”.",
    "model": "I prefer subtitles, but I don't mind dubbing."
   },
   {
    "who": "Friend",
    "t": "What about Spy x Family? It's really funny."
   },
   {
    "you": true,
    "cue": "Say what you think about it.",
    "model": "I think it's fun, but a little boring for me."
   },
   {
    "who": "Friend",
    "t": "OK, let's decide. One episode of each?"
   },
   {
    "you": true,
    "cue": "Agree and finish the conversation.",
    "model": "I agree! Get the popcorn. I'm so excited."
   }
  ],
  "extra": "Now ask your teacher about his favorite series or movie. Ask: What do you think of…? Why do you like it? What do you recommend?"
 },
 "final": [
  {
   "p": "I ___ Naruto. It's my favorite!",
   "a": "love",
   "w": [
    "can't stand",
    "don't mind",
    "hate"
   ],
   "why": "Favorite → love."
  },
  {
   "p": "I can't ___ horror movies.",
   "a": "stand",
   "w": [
    "support",
    "suffer",
    "like to"
   ],
   "why": "Can't stand = really hate."
  },
  {
   "p": "I don't ___ waiting. It's OK.",
   "a": "mind",
   "w": [
    "care of",
    "matter",
    "bother of"
   ],
   "why": "Don't mind = it's OK for me."
  },
  {
   "p": "I like Luffy ___ he's funny and brave.",
   "a": "because",
   "w": [
    "why",
    "for",
    "so"
   ],
   "why": "Because gives the reason."
  },
  {
   "p": "The final battle is really ___.",
   "a": "exciting",
   "w": [
    "excited",
    "excite",
    "excitement"
   ],
   "why": "How the thing is → -ing."
  },
  {
   "p": "I'm ___. Can we watch something else?",
   "a": "bored",
   "w": [
    "boring",
    "bore",
    "boredom"
   ],
   "why": "How you feel → -ed."
  },
  {
   "p": "A: Levi is the best character. B: I ___! He's amazing.",
   "a": "agree",
   "w": [
    "am agree",
    "agreed with",
    "have agree"
   ],
   "why": "Agree is a verb: I agree."
  },
  {
   "p": "The bad character in a story is the ___.",
   "a": "villain",
   "w": [
    "hero",
    "main character",
    "narrator"
   ],
   "why": "Villain = the bad character."
  },
  {
   "p": "One part of a series is an ___.",
   "a": "episode",
   "w": [
    "season",
    "subtitle",
    "opening"
   ],
   "why": "Episode = one part of a series."
  },
  {
   "p": "Words at the bottom of the screen are ___.",
   "a": "subtitles",
   "w": [
    "lyrics",
    "credits",
    "titles"
   ],
   "why": "Subtitles = words at the bottom of the screen."
  },
  {
   "p": "What happens in a story is the ___.",
   "a": "plot",
   "w": [
    "cast",
    "season",
    "episode"
   ],
   "why": "Plot = what happens in the story."
  },
  {
   "p": "___ do you think of Demon Slayer?",
   "a": "What",
   "w": [
    "How",
    "Which",
    "Who"
   ],
   "why": "Ask for an opinion with “What do you think of…?”"
  },
  {
   "p": "I ___ it's the best anime ever.",
   "a": "think",
   "w": [
    "am think",
    "thinking",
    "thinks"
   ],
   "why": "I think…"
  },
  {
   "p": "Everyone says it's great, but I think it's ___.",
   "a": "overrated",
   "w": [
    "recommended",
    "excited",
    "favorite"
   ],
   "why": "Overrated = people say it's great, but you don't agree."
  },
  {
   "p": "I ___ Spy x Family. It's so funny!",
   "a": "recommend",
   "w": [
    "recommend you",
    "recommend to",
    "am recommend"
   ],
   "why": "Recommend + the thing."
  },
  {
   "p": "Do you prefer subtitles ___ dubbing?",
   "a": "or",
   "w": [
    "and",
    "but",
    "than"
   ],
   "why": "Choose between two things with “or”."
  },
  {
   "p": "Eren is the ___ character of Attack on Titan.",
   "a": "main",
   "w": [
    "principal",
    "most",
    "first of"
   ],
   "why": "“Main character” is what native speakers say."
  },
  {
   "p": "My sister ___ like anime.",
   "a": "doesn't",
   "w": [
    "don't",
    "isn't",
    "not"
   ],
   "why": "She → doesn't + verb."
  },
  {
   "p": "I'm really ___ in this story. I want to know the ending.",
   "a": "interested",
   "w": [
    "interesting",
    "interest",
    "interests"
   ],
   "why": "How you feel → -ed: interested."
  },
  {
   "p": "Sorry, I ___. I think the ending is bad.",
   "a": "disagree",
   "w": [
    "am disagree",
    "disagreed with",
    "not agree"
   ],
   "why": "Disagree = have a different opinion."
  }
 ],
 "read": {
  "short": "Is it overrated?",
  "kicker": "Anime · Review",
  "title": "Everyone loves this anime. I don't.",
  "before": "Is there a show that everyone loves, but you don't? Tell your teacher.",
  "text": [
   "Everyone at my school is talking about \"Sky Blade\". My friends say it's the best anime of the year. I watched the first [[season]] last month, and I think it's a bit [[overrated]].",
   "The [[main character]], Ren, is a boy who wants to be a pilot. The animation is beautiful, and the fights are really exciting. But the [[plot]] is very slow. In [[episode]] four, nothing happens for twenty minutes!",
   "The best part is the [[villain]]. She is smart, funny and a little sad. I love her. I can't stand Ren, because he cries in every episode.",
   "Do I [[recommend]] it? Yes, but only if you have a lot of patience. Watch it with [[subtitles]] — the Japanese voices are much better. My friend Diego doesn't agree with me. He says the slow parts are the best!"
  ],
  "questions": [
   {
    "q": "What does the writer think of \"Sky Blade\"?",
    "a": "It's a bit overrated.",
    "w": [
     "It's the best anime of the year.",
     "It's very boring."
    ],
    "ev": "I think it's a bit overrated"
   },
   {
    "q": "What is the problem with the plot?",
    "a": "It's very slow.",
    "w": [
     "It's too fast.",
     "It's very scary."
    ],
    "ev": "the plot is very slow"
   },
   {
    "q": "Why can't the writer stand Ren?",
    "a": "Because he cries in every episode.",
    "w": [
     "Because he is the villain.",
     "Because he wants to be a pilot."
    ],
    "ev": "because he cries in every episode"
   },
   {
    "q": "How does the writer recommend watching it?",
    "a": "With subtitles",
    "w": [
     "In Spanish",
     "Without sound"
    ],
    "ev": "Watch it with subtitles"
   },
   {
    "q": "True or false: Diego agrees with the writer.",
    "a": "False",
    "w": [
     "True"
    ],
    "ev": "My friend Diego doesn't agree with me."
   }
  ],
  "after": "Tell your teacher about a series you think is <b>overrated</b> or <b>underrated</b>. Say <b>why</b> with <b>because</b>."
 },
 "grammar": {
  "kind": "compare",
  "title": "exciting or excited?",
  "intro": "Both words exist, but they describe different things. One is the show, the other is you.",
  "forms": [
   {
    "name": "-ing",
    "form": "boring · exciting · interesting",
    "use": "How the thing is: the show, the game, the episode.",
    "examples": [
     "The fights are **exciting**.",
     "Episode four is **boring**."
    ]
   },
   {
    "name": "-ed",
    "form": "bored · excited · interested",
    "use": "How a person feels.",
    "examples": [
     "I'm **excited** about season two.",
     "I was **bored** in episode four."
    ]
   }
  ],
  "task": "Sort them · -ing or -ed?",
  "sort": [
   {
    "s": "The final episode was really ___.",
    "f": 0,
    "answer": "exciting"
   },
   {
    "s": "I'm so ___ — nothing is happening!",
    "f": 1,
    "answer": "bored"
   },
   {
    "s": "My friends are ___ about the new season.",
    "f": 1,
    "answer": "excited"
   },
   {
    "s": "The plot is slow and ___.",
    "f": 0,
    "answer": "boring"
   }
  ]
 }
};
