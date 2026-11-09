// Lingua collections: each student style has something to collect by passing lessons (80%+).
//   racing → a garage of cars (one per lesson, see garage.js)
//   riding → a stable of horses · music → a studio of instruments · cinema → a wall of classic posters
// For riding, music and cinema the Nth lesson passed unlocks the Nth item, so it works with any lessons.
// Everything here is an original design (no real brands, films or people).
(function () {
  const L = window.LINGUA, esc = s => L.esc(String(s));
  const T = (x, y, s, w, fill, txt, extra) => `<text x="${x}" y="${y}" font-family="system-ui,-apple-system,Segoe UI,sans-serif" font-size="${s}" font-weight="${w}" fill="${fill}" ${extra || ""}>${txt}</text>`;

  // ── Horses (260 × 170, ground at 160, facing right) ──
  function horse(h, locked) {
    const c = locked ? "currentColor" : h.coat, m = locked ? "currentColor" : h.mane, far = locked ? "currentColor" : shade(h.coat, -.18);
    const id = "h" + Math.random().toString(36).slice(2, 7);
    const body = "M80 80 Q100 66 134 68 Q166 66 184 74 Q202 84 200 102 Q198 118 178 120 L100 120 Q78 120 72 104 Q68 88 80 80 Z";
    const neck = "M164 82 Q170 58 190 38 Q200 28 212 24 L226 44 Q214 58 204 76 Q196 92 192 100 Z";
    const head = "M204 30 Q214 18 226 24 L250 58 Q256 68 246 72 Q238 75 230 68 L214 52 Z";
    const legs = { fl: "M178 112 L190 112 L189 136 L190 152 L182 152 L181 136 Z", bl: "M86 104 L104 110 L100 132 L98 152 L90 152 L91 132 Z",
                   fr: "M166 112 L177 112 L176 136 L178 152 L169 152 L168 136 Z", br: "M100 108 L114 112 L112 132 L111 152 L103 152 L104 132 Z" };
    const hoof = (d, col) => { const xs = d.match(/L(\d+) 152 L(\d+) 152/); return `<rect x="${Math.min(+xs[2], +xs[1]) - 1}" y="151" width="${Math.abs(xs[1] - xs[2]) + 2}" height="8" rx="2" fill="${col}"/>`; };
    const sock = (d, on) => on && !locked ? `<path d="${d}" fill="#f4f1ea" clip-path="url(#${id}s)"/>` : "";
    const hoofC = locked ? "currentColor" : "#2a2420";
    const out = [`<ellipse cx="140" cy="160" rx="96" ry="6" fill="#000" opacity="${locked ? .16 : .26}"/>`,
      // far legs
      `<path d="${legs.fr}" fill="${far}"/>${hoof(legs.fr, hoofC)}`, `<path d="${legs.br}" fill="${far}"/>${hoof(legs.br, hoofC)}`,
      // tail
      `<path d="M78 84 Q54 92 56 128 Q58 146 66 142 Q62 120 70 104 Q76 94 86 88 Z" fill="${m}"/>`,
      `<path d="${body}" fill="${c}"/>`, `<path d="${neck}" fill="${c}"/>`, `<path d="${head}" fill="${c}"/>`,
      `<path d="M206 26 L208 10 L216 22 Z M214 22 L219 9 L224 24 Z" fill="${c}"/>`,
      `<path d="${legs.fl}" fill="${c}"/>${hoof(legs.fl, hoofC)}`, `<path d="${legs.bl}" fill="${c}"/>${hoof(legs.bl, hoofC)}`];
    if (!locked) {
      out.push(`<defs><clipPath id="${id}b"><path d="${body}"/><path d="${neck}"/><path d="${head}"/></clipPath><clipPath id="${id}s"><rect x="0" y="136" width="260" height="16"/></clipPath>
        <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`);
      if (h.spots) out.push(`<g clip-path="url(#${id}b)" fill="${h.spots}">${[[92, 84, 5], [104, 96, 4], [86, 100, 4], [116, 82, 3.5], [100, 76, 3], [124, 92, 3], [110, 108, 3.5], [96, 112, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}<path d="M74 78 Q104 70 128 74 L120 116 L72 116 Z" opacity=".25"/></g>`);
      if (h.patches) out.push(`<g clip-path="url(#${id}b)" fill="${h.patches}"><path d="M124 64 Q150 70 158 92 Q150 114 128 122 Q112 100 124 64 Z"/><path d="M60 70 Q92 72 96 96 Q86 110 64 112 Z"/><path d="M186 50 Q200 46 206 66 L192 84 Z"/></g>`);
      if (h.dapple) out.push(`<g clip-path="url(#${id}b)" fill="#fff" opacity=".35">${[[100, 86, 6], [118, 96, 5], [136, 84, 6], [154, 98, 5], [170, 86, 5], [92, 104, 4], [128, 108, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("")}</g>`);
      out.push(`<g clip-path="url(#${id}b)"><path d="M60 60 H260 V125 H60 Z" fill="url(#${id}g)"/></g>`);
      out.push(sock(legs.fl, h.socks > 0), sock(legs.bl, h.socks > 1), sock(legs.fr, h.socks > 2), sock(legs.br, h.socks > 3));
      out.push(`<path d="M190 34 Q198 26 212 22 Q206 36 198 50 Q190 66 180 84 Q172 76 176 64 Q182 46 190 34 Z" fill="${m}"/>`); // mane
      out.push(`<path d="M208 26 Q212 20 218 22 Q212 28 210 34 Z" fill="${m}"/>`); // forelock
      if (h.blaze) out.push(`<path d="M222 30 Q228 30 238 50 Q244 60 246 66 Q240 66 234 56 Q226 44 222 30 Z" fill="#f4f1ea"/>`);
      if (h.star) out.push(`<path d="M225 34 l2 -4 l2 4 l-2 3 z" fill="#f4f1ea"/>`);
      out.push(`<circle cx="222" cy="38" r="2.6" fill="#1b1612"/><circle cx="221.3" cy="37.2" r=".8" fill="#fff"/><circle cx="246" cy="64" r="1.6" fill="#1b1612" opacity=".6"/>`);
      if (h.tack) out.push(`<path d="M214 52 L246 52 M224 26 L236 64 M208 46 L188 74" stroke="${h.tack}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
        `<path d="M118 70 Q136 62 156 68 L158 86 Q138 92 120 88 Z" fill="${h.tack}"/><path d="M118 88 Q138 94 158 86 L158 98 Q138 104 120 100 Z" fill="${shade(h.tack, .35)}"/>`);
    }
    return `<svg viewBox="0 0 260 170" class="col-svg" role="img" aria-label="${locked ? "Locked horse" : esc(h.name)}">${out.join("")}</svg>`;
  }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16), ch = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k));
    return "#" + ch.map(v => v.toString(16).padStart(2, "0")).join("");
  }

  const HORSES = [
    { name: "Biscuit", kind: "Quarter Horse · chestnut", coat: "#a5582c", mane: "#7a3b1a", socks: 1, star: 1, tack: "#3b2a20",
      specs: [["Speed", 6], ["Jumping", 4], ["Calm", 9]], about: "Biscuit is the calmest horse in the stable. He's perfect for beginners, and he never spooks — not even at plastic bags." },
    { name: "Storm", kind: "Thoroughbred · bay", coat: "#6b3a22", mane: "#1d1612", socks: 2, blaze: 1,
      specs: [["Speed", 10], ["Jumping", 7], ["Calm", 4]], about: "Storm used to race. He's incredibly fast, but he gets nervous before a show, so you have to keep calm for both of you." },
    { name: "Luna", kind: "Arabian · grey", coat: "#d9d6d0", mane: "#a9a49b", socks: 0, dapple: 1,
      specs: [["Speed", 8], ["Jumping", 6], ["Calm", 6]], about: "Luna is small but very strong. Arabians can travel long distances, and she loves long rides more than the ring." },
    { name: "Pepper", kind: "Appaloosa · spotted", coat: "#ece6da", mane: "#4a3a2e", socks: 0, spots: "#4a3a2e",
      specs: [["Speed", 6], ["Jumping", 6], ["Calm", 8]], about: "You can recognise Pepper from far away because of her spots. She's clever and a little stubborn when she's hungry." },
    { name: "Duke", kind: "Friesian · black", coat: "#1f1b1a", mane: "#0d0b0b", socks: 0, tack: "#7a1f24",
      specs: [["Speed", 6], ["Jumping", 5], ["Calm", 8]], about: "Duke is tall, black and elegant, with a long wavy mane. People always want a photo with him after a show." },
    { name: "Maple", kind: "Paint Horse · pinto", coat: "#f2ede4", mane: "#5a3020", socks: 0, patches: "#8a4a2a",
      specs: [["Speed", 7], ["Jumping", 6], ["Calm", 7]], about: "Every Paint Horse has a different pattern. Maple's brown patches look like a map, and she's the friendliest horse here." },
    { name: "Blaze", kind: "Dutch Warmblood · dark bay", coat: "#4a2716", mane: "#120d0a", socks: 4, blaze: 1, tack: "#1e2a44",
      specs: [["Speed", 8], ["Jumping", 10], ["Calm", 6]], about: "Blaze was born to jump. He has competed in Grand Prix shows, and he has never had a refusal in a jump-off." },
    { name: "Honey", kind: "Haflinger · palomino", coat: "#d79a43", mane: "#f3e6c4", socks: 0, star: 1,
      specs: [["Speed", 5], ["Jumping", 5], ["Calm", 10]], about: "Honey has a golden coat and a blond mane. She's strong, gentle and patient — the horse everyone wants for their first lesson." },
    { name: "Shadow", kind: "Andalusian · dapple grey", coat: "#9a9894", mane: "#e8e6e1", socks: 0, dapple: 1, tack: "#3b2a20",
      specs: [["Speed", 7], ["Jumping", 6], ["Calm", 7]], about: "Andalusians come from Spain and are famous for dressage. Shadow moves so smoothly that riding her feels like dancing." },
    { name: "Rusty", kind: "Welsh Cob · red roan", coat: "#9c5a46", mane: "#5a2a1e", socks: 2, dapple: 1,
      specs: [["Speed", 6], ["Jumping", 8], ["Calm", 7]], about: "Rusty is a cob: shorter, but with a lot of energy. He jumps higher than you'd expect and loves cross-country." },
    { name: "Cocoa", kind: "Morgan · liver chestnut", coat: "#4f2a1c", mane: "#3a1c12", socks: 1, star: 1,
      specs: [["Speed", 7], ["Jumping", 6], ["Calm", 8]], about: "Cocoa is easy to groom and easy to tack up. Riders say she understands what you want before you even ask." },
    { name: "Champion", kind: "Selle Français · bay", coat: "#7a4126", mane: "#1d1612", socks: 3, blaze: 1, tack: "#7a1f24",
      specs: [["Speed", 9], ["Jumping", 10], ["Calm", 7]], about: "The last horse in your stable is a true champion: fast, brave and calm. You only get him after a whole season of hard work." }
  ];

  // ── Instruments (260 × 170) ──
  const wood = "#b06a32", woodD = "#7c4520", met = "#c7ccd3", dark = "#1d1f24";
  const STRINGS = (x1, x2, y, n, gap) => Array.from({ length: n }, (_, i) => `<path d="M${x1} ${y + i * gap} L${x2} ${y + i * gap}" stroke="#e9e3d6" stroke-width=".7"/>`).join("");
  const ART = {
    acoustic: (c, k) => `<ellipse cx="74" cy="92" rx="46" ry="44" fill="${c}"/><ellipse cx="128" cy="92" rx="34" ry="34" fill="${c}"/><rect x="70" y="70" width="60" height="44" fill="${c}"/>
      <circle cx="120" cy="92" r="13" fill="${dark}"/><circle cx="120" cy="92" r="16" fill="none" stroke="${k}" stroke-width="2"/>
      <rect x="62" y="84" width="8" height="18" rx="2" fill="${woodD}"/><rect x="156" y="85" width="70" height="14" fill="${woodD}"/><path d="M226 82 L250 78 L252 106 L226 102 Z" fill="${woodD}"/>
      ${[0, 1, 2].map(i => `<circle cx="${232 + i * 7}" cy="77" r="2.4" fill="${met}"/><circle cx="${232 + i * 7}" cy="107" r="2.4" fill="${met}"/>`).join("")}
      ${STRINGS(66, 228, 87, 6, 2)}${[170, 184, 197, 209, 220].map(x => `<path d="M${x} 85 V99" stroke="${met}" stroke-width=".8"/>`).join("")}`,
    electric: (c, k) => `<path d="M30 92 Q28 56 64 58 Q84 58 92 70 Q108 62 128 66 Q146 70 144 82 L150 82 L150 102 L144 102 Q148 120 124 124 Q104 126 94 116 Q80 132 54 128 Q28 124 30 92 Z" fill="${c}"/>
      <path d="M58 76 Q84 70 112 78 L120 92 L112 108 Q84 114 58 108 Q50 92 58 76 Z" fill="${k}"/>
      <rect x="76" y="84" width="9" height="16" rx="2" fill="${dark}"/><rect x="98" y="84" width="9" height="16" rx="2" fill="${dark}"/><rect x="60" y="85" width="6" height="14" rx="1" fill="${met}"/>
      ${[[50, 112], [62, 118], [74, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${met}"/>`).join("")}
      <rect x="146" y="86" width="80" height="12" fill="#d8b98a"/><path d="M226 84 Q240 76 254 80 L250 96 Q238 100 226 100 Z" fill="#d8b98a"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${230 + i * 4}" cy="${81 - (i % 2)}" r="1.8" fill="${met}"/>`).join("")}
      ${STRINGS(60, 232, 87.5, 6, 1.8)}${[160, 174, 187, 199, 210, 220].map(x => `<path d="M${x} 86 V98" stroke="${met}" stroke-width=".8"/>`).join("")}`,
    bass: (c, k) => `<path d="M22 94 Q20 60 54 62 Q74 62 82 74 Q96 64 112 70 Q124 74 122 86 L128 86 L128 102 L122 102 Q124 116 104 120 Q90 122 82 114 Q70 130 46 126 Q22 122 22 94 Z" fill="${c}"/>
      <path d="M46 80 L70 78 L76 92 L70 108 L46 106 Z" fill="${k}"/><rect x="58" y="86" width="12" height="14" rx="2" fill="${dark}"/><rect x="90" y="86" width="12" height="14" rx="2" fill="${dark}"/>
      <rect x="124" y="87" width="104" height="11" fill="#c9a272"/><path d="M228 84 L254 82 L254 102 L228 100 Z" fill="${c}"/>
      ${[0, 1].map(i => `<path d="M${236 + i * 10} 82 V76 M${236 + i * 10} 102 V108" stroke="${met}" stroke-width="3" stroke-linecap="round"/>`).join("")}
      ${STRINGS(54, 236, 88.5, 4, 2.6)}${[144, 164, 182, 198, 212].map(x => `<path d="M${x} 87 V98" stroke="${met}" stroke-width=".8"/>`).join("")}`,
    mic: (c, k) => `<path d="M130 160 L130 112" stroke="${dark}" stroke-width="5"/><path d="M104 162 L156 162" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>
      <path d="M118 104 Q130 120 142 104" stroke="${met}" stroke-width="4" fill="none"/>
      <rect x="112" y="30" width="36" height="74" rx="18" fill="${met}"/><rect x="112" y="30" width="36" height="74" rx="18" fill="url(#mesh)"/>
      <rect x="110" y="64" width="40" height="8" fill="${c}"/><rect x="122" y="104" width="16" height="12" rx="3" fill="${k}"/>`,
    drums: (c, k) => `<path d="M48 54 L82 50 M178 50 L214 54" stroke="#d6b44a" stroke-width="4" stroke-linecap="round"/><path d="M65 52 V150 M196 52 V150" stroke="${met}" stroke-width="2.5"/>
      <ellipse cx="65" cy="52" rx="28" ry="5" fill="#d6b44a"/><ellipse cx="196" cy="52" rx="30" ry="5" fill="#d6b44a"/>
      <rect x="96" y="58" width="32" height="24" rx="4" fill="${c}"/><rect x="134" y="58" width="32" height="24" rx="4" fill="${c}"/><ellipse cx="112" cy="58" rx="16" ry="4" fill="#efe9dc"/><ellipse cx="150" cy="58" rx="16" ry="4" fill="#efe9dc"/>
      <circle cx="130" cy="118" r="40" fill="${c}"/><circle cx="130" cy="118" r="32" fill="#efe9dc"/><circle cx="130" cy="118" r="32" fill="none" stroke="${k}" stroke-width="3"/>
      ${T(130, 123, 12, 800, k, "STUDIO", 'text-anchor="middle" letter-spacing="2"')}
      <rect x="62" y="108" width="34" height="22" rx="3" fill="${c}"/><ellipse cx="79" cy="108" rx="17" ry="4" fill="#efe9dc"/><rect x="172" y="112" width="40" height="34" rx="4" fill="${c}"/><ellipse cx="192" cy="112" rx="20" ry="4" fill="#efe9dc"/>`,
    synth: (c, k) => `<rect x="20" y="70" width="220" height="62" rx="8" fill="${c}"/><rect x="20" y="70" width="220" height="24" rx="8" fill="${shade(c, -.25)}"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${40 + i * 18}" cy="82" r="5" fill="${met}"/><path d="M${40 + i * 18} 82 L${40 + i * 18} 78" stroke="${dark}" stroke-width="1.6"/>`).join("")}
      <rect x="170" y="76" width="56" height="12" rx="2" fill="#0f2a22"/>${T(174, 85, 8, 700, "#5fe0a8", "PAD 07")}
      ${Array.from({ length: 21 }, (_, i) => `<rect x="${28 + i * 10}" y="96" width="9" height="32" rx="1.5" fill="#f4f2ec"/>`).join("")}
      ${Array.from({ length: 20 }, (_, i) => [1, 2, 4, 5, 6].includes(i % 7) ? `<rect x="${35 + i * 10}" y="96" width="5.5" height="19" rx="1" fill="${dark}"/>` : "").join("")}
      <path d="M40 134 L34 160 M220 134 L226 160" stroke="${dark}" stroke-width="4"/>`,
    amp: (c, k) => `<rect x="62" y="34" width="136" height="122" rx="8" fill="${c}"/><rect x="72" y="44" width="116" height="26" rx="3" fill="${k}"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${84 + i * 18}" cy="57" r="5" fill="${dark}"/><circle cx="${84 + i * 18}" cy="57" r="2" fill="${met}"/>`).join("")}
      <rect x="72" y="78" width="116" height="68" rx="4" fill="#3a3229"/><rect x="72" y="78" width="116" height="68" rx="4" fill="url(#grille)"/>
      <rect x="112" y="86" width="36" height="10" rx="2" fill="${k}"/>${T(130, 94, 7, 800, dark, "TUBE 30", 'text-anchor="middle" letter-spacing="1"')}
      <path d="M110 34 Q130 22 150 34" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    turntable: (c, k) => `<rect x="34" y="40" width="192" height="118" rx="8" fill="${c}"/><circle cx="114" cy="100" r="50" fill="#141414"/>
      ${[44, 36, 28].map(r => `<circle cx="114" cy="100" r="${r}" fill="none" stroke="#2c2c2c" stroke-width="1"/>`).join("")}<circle cx="114" cy="100" r="15" fill="${k}"/><circle cx="114" cy="100" r="2.4" fill="${met}"/>
      <circle cx="196" cy="58" r="8" fill="${met}"/><path d="M196 58 L200 120 L182 140" stroke="${met}" stroke-width="3.6" fill="none" stroke-linecap="round"/><rect x="176" y="136" width="12" height="9" rx="2" fill="${dark}"/>
      <circle cx="52" cy="142" r="5" fill="${met}"/><rect x="190" y="140" width="22" height="6" rx="2" fill="${dark}"/>`
  };
  const DEFS = `<defs><pattern id="mesh" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#7d838c"/></pattern>
    <pattern id="grille" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#b9a988" stroke-width="1" opacity=".55"/></pattern></defs>`;
  function instrument(it, locked) {
    const inner = ART[it.art](locked ? "currentColor" : it.color, locked ? "currentColor" : it.accent);
    const shadow = `<ellipse cx="130" cy="${it.art === "mic" || it.art === "drums" ? 164 : 150}" rx="${it.art === "mic" ? 40 : 100}" ry="5" fill="#000" opacity="${locked ? .14 : .28}"/>`;
    return `<svg viewBox="0 0 260 170" class="col-svg" role="img" aria-label="${locked ? "Locked instrument" : esc(it.name)}">${DEFS}${locked ? `<defs><filter id="silh"><feFlood flood-color="currentColor"/><feComposite in2="SourceAlpha" operator="in"/></filter></defs>` : ""}${shadow}${locked ? `<g filter="url(#silh)">${inner}</g>` : inner}</svg>`;
  }
  const INSTRUMENTS = [
    { name: "Parlor Acoustic", kind: "Acoustic guitar", art: "acoustic", color: "#c98a4b", accent: "#3a2414", specs: [["Warmth", 9], ["Volume", 4], ["Year", "1962"]],
      about: "Small-bodied parlor guitars were made for playing at home, which is exactly why they sound so intimate on a recording." },
    { name: "Sunburst Electric", kind: "Electric guitar", art: "electric", color: "#a23a1f", accent: "#f2ead8", specs: [["Warmth", 6], ["Volume", 9], ["Year", "1974"]],
      about: "Two single-coil pickups and a sunburst finish: the kind of guitar that's been on more indie records than anyone could count." },
    { name: "Ribbon Mic", kind: "Studio microphone", art: "mic", color: "#2c2f35", accent: "#b08a3e", specs: [["Warmth", 10], ["Detail", 8], ["Year", "1958"]],
      about: "Ribbon mics are fragile but beautifully smooth. Engineers love them on vocals because they take the harshness off the top end." },
    { name: "Short-Scale Bass", kind: "Bass guitar", art: "bass", color: "#2a4a6b", accent: "#ece7dc", specs: [["Warmth", 8], ["Punch", 7], ["Year", "1967"]],
      about: "A short-scale bass has a rounder, thumpier tone. Having been overlooked for years, it's now a favourite in R&B and indie." },
    { name: "Tube Combo", kind: "Guitar amplifier", art: "amp", color: "#2a2723", accent: "#d9c9a3", specs: [["Warmth", 9], ["Volume", 8], ["Watts", "30"]],
      about: "Push a tube amp hard and it starts to break up naturally. That's the crunch you hear on half the guitar records you love." },
    { name: "Vintage Drum Kit", kind: "Drum kit", art: "drums", color: "#7a1f24", accent: "#1d1f24", specs: [["Punch", 9], ["Volume", 10], ["Pieces", "5"]],
      about: "Recorded with just three microphones, a vintage kit like this one gives you that dry, punchy sound from classic soul records." },
    { name: "Analog Synth", kind: "Synthesizer", art: "synth", color: "#3b3f46", accent: "#e8590c", specs: [["Warmth", 8], ["Range", 9], ["Voices", "8"]],
      about: "Analog synths drift slightly out of tune as they warm up — and that imperfection is precisely what makes them sound alive." },
    { name: "Studio Turntable", kind: "Turntable", art: "turntable", color: "#d9d4ca", accent: "#c0392b", specs: [["Warmth", 9], ["Detail", 7], ["Speed", "33⅓"]],
      about: "Vinyl never really went away. Producers still dig through old records for samples, looking for a loop nobody has used yet." }
  ];

  // ── Classic posters (120 × 170) — original titles, studios and credits ──
  function poster(p, locked) {
    if (locked) return `<svg viewBox="0 0 120 170" class="col-svg poster" role="img" aria-label="Locked poster"><rect x="4" y="4" width="112" height="162" rx="2" fill="currentColor"/><rect x="12" y="12" width="96" height="146" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.5" stroke-dasharray="4 4"/><text x="60" y="92" text-anchor="middle" font-size="22" fill="#fff" opacity=".35" font-family="system-ui,sans-serif" font-weight="800">?</text></svg>`;
    const [bg, a, b, ink] = p.pal, S = SCENE[p.scene](a, b, ink, bg);
    const titleLines = p.title.toUpperCase().split("|");
    return `<svg viewBox="0 0 120 170" class="col-svg poster" role="img" aria-label="${esc(p.title.replace("|", " "))} poster">
      <rect x="4" y="4" width="112" height="162" rx="1.5" fill="${bg}"/>${S}
      ${titleLines.map((t, i) => `<text x="60" y="${p.ty + i * p.ts * 1.02}" text-anchor="middle" font-family="${p.font}" font-size="${p.ts}" font-weight="800" fill="${ink}" letter-spacing=".4">${esc(t)}</text>`).join("")}
      ${T(60, p.ty > 80 ? 15 : p.ty - p.ts - 3, Math.min(4.6, 150 / p.tag.length).toFixed(2), 700, ink, esc(p.tag.toUpperCase()), 'text-anchor="middle" letter-spacing=".8" opacity=".85"')}
      <rect x="14" y="150" width="92" height="9" fill="${ink}" opacity=".12"/>${T(60, 156.5, 3.6, 600, ink, "A " + esc(p.studio) + " PICTURE · " + p.year, 'text-anchor="middle" letter-spacing=".6" opacity=".8"')}
      <rect x="4" y="4" width="112" height="162" rx="1.5" fill="url(#paper)" opacity=".5"/>
      <defs><linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient></defs></svg>`;
  }
  const SCENE = {
    noir: (a, b, ink) => `<path d="M4 120 L30 120 L30 80 L46 80 L46 100 L58 100 L58 60 L76 60 L76 96 L90 96 L90 74 L116 74 L116 150 L4 150 Z" fill="${b}"/>
      ${[[64, 66], [70, 66], [64, 74], [70, 80], [96, 82], [104, 90]].map(([x, y]) => `<rect x="${x}" y="${y}" width="3" height="4" fill="${a}"/>`).join("")}
      <path d="M22 150 L22 96 Q22 90 28 90 L34 90" stroke="${b}" stroke-width="2" fill="none"/><path d="M34 90 L40 104 L28 104 Z" fill="${a}" opacity=".85"/><path d="M28 104 L-10 150 L60 150 L40 104 Z" fill="${a}" opacity=".18"/>
      <path d="M82 150 L82 128 Q82 118 88 116 L92 106 Q96 104 98 108 L100 116 Q104 120 104 128 L104 150 Z" fill="${b}"/><path d="M86 107 L104 107 L100 101 L90 101 Z" fill="${b}"/>`,
    western: (a, b, ink) => `<circle cx="60" cy="78" r="30" fill="${a}"/><path d="M4 110 L22 92 L40 92 L48 102 L70 102 L80 86 L100 86 L116 104 L116 150 L4 150 Z" fill="${b}"/>
      <path d="M86 150 V112 M86 122 Q78 122 78 114 M86 130 Q94 130 94 120" stroke="${ink}" stroke-width="4" stroke-linecap="round" fill="none" opacity=".7"/>
      <path d="M30 150 L36 124 L40 124 L44 150 Z M34 124 Q38 116 42 124" fill="${ink}" opacity=".7"/>`,
    scifi: (a, b, ink) => `${[[18, 30], [96, 24], [30, 60], [104, 64], [14, 92], [80, 40], [56, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${ink}"/>`).join("")}
      <circle cx="84" cy="110" r="34" fill="${b}"/><ellipse cx="84" cy="110" rx="50" ry="9" fill="none" stroke="${a}" stroke-width="2.5" transform="rotate(-14 84 110)"/>
      <ellipse cx="40" cy="72" rx="20" ry="6" fill="${a}"/><path d="M30 70 Q40 58 50 70 Z" fill="${ink}" opacity=".8"/><path d="M34 77 L22 120 L58 120 L46 77 Z" fill="${a}" opacity=".22"/>`,
    musical: (a, b, ink) => `<path d="M60 16 L10 150 L110 150 Z" fill="${a}" opacity=".22"/><path d="M4 128 L116 128 L116 150 L4 150 Z" fill="${b}"/>
      <path d="M58 128 L58 96 Q58 90 62 88 L64 76 Q66 72 68 76 L68 88 Q72 92 70 100 L78 84 L80 86 L72 104 L72 128 Z" fill="${ink}"/>
      ${[[18, 36], [100, 30], [24, 70], [94, 64]].map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 1.6} ${y - 1.6} L${x + 5} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 5} L${x - 1.6} ${y + 1.6} L${x - 5} ${y} L${x - 1.6} ${y - 1.6} Z" fill="${a}"/>`).join("")}`,
    spy: (a, b, ink) => `${[44, 34, 24, 14].map((r, i) => `<circle cx="60" cy="86" r="${r}" fill="${i % 2 ? a : b}"/>`).join("")}
      <path d="M52 150 L52 108 Q52 98 60 96 Q54 92 54 84 Q54 74 62 74 Q70 74 70 84 Q70 92 64 96 Q72 98 72 108 L72 150 Z" fill="${ink}"/><path d="M50 78 L74 78 L70 72 L54 72 Z" fill="${ink}"/>`,
    newwave: (a, b, ink) => `<rect x="4" y="4" width="56" height="118" fill="${a}"/><rect x="60" y="40" width="56" height="82" fill="${b}"/>
      <circle cx="42" cy="66" r="16" fill="${ink}" opacity=".9"/><circle cx="80" cy="76" r="14" fill="${ink}" opacity=".9"/><path d="M14 122 Q42 92 58 122 Z M64 122 Q80 98 104 122 Z" fill="${ink}" opacity=".9"/>`,
    heist: (a, b, ink) => `<circle cx="60" cy="72" r="38" fill="${b}"/><circle cx="60" cy="72" r="30" fill="none" stroke="${a}" stroke-width="3"/>
      ${Array.from({ length: 12 }, (_, i) => { const t = i * Math.PI / 6; return `<path d="M${60 + Math.cos(t) * 32} ${72 + Math.sin(t) * 32} L${60 + Math.cos(t) * 36} ${72 + Math.sin(t) * 36}" stroke="${a}" stroke-width="2"/>`; }).join("")}
      <circle cx="60" cy="72" r="12" fill="${a}"/><path d="M60 72 L72 58" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`,
    chase: (a, b, ink) => `<path d="M4 4 L116 4 L116 86 L4 86 Z" fill="${a}" opacity=".4"/><path d="M50 82 L70 82 L116 150 L4 150 Z" fill="${b}"/>
      ${[0, 1, 2, 3].map(i => `<path d="M${59 - i} ${90 + i * 16} L${61 + i} ${90 + i * 16} L${61 + i * 1.6} ${100 + i * 16} L${59 - i * 1.6} ${100 + i * 16} Z" fill="${a}"/>`).join("")}
      <path d="M30 136 L34 124 Q36 120 42 120 L62 120 Q68 120 70 124 L74 136 Z" fill="${ink}"/><circle cx="38" cy="138" r="5" fill="${ink}"/><circle cx="66" cy="138" r="5" fill="${ink}"/>`,
    monster: (a, b, ink) => `<path d="M4 118 Q18 112 32 118 T60 118 T88 118 T116 118 L116 150 L4 150 Z" fill="${b}"/>
      <path d="M20 120 Q12 92 30 74 Q42 64 40 82 Q36 98 34 120 Z M84 120 Q80 86 98 66 Q110 56 106 74 Q100 94 98 120 Z M50 120 Q46 80 62 58 Q72 48 70 64 Q64 86 64 120 Z" fill="${ink}"/>
      ${[[31, 92], [33, 102], [97, 82], [98, 94], [61, 74], [62, 88], [62, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${a}"/>`).join("")}
      <path d="M68 116 L74 106 L76 106 L76 98 L78 98 L78 106 L86 106 L92 116 Z" fill="${a}"/>
      <path d="M4 126 Q18 120 32 126 T60 126 T88 126 T116 126" stroke="${ink}" stroke-opacity=".25" stroke-width="1.2" fill="none"/>`,
    romance: (a, b, ink) => `<circle cx="60" cy="62" r="36" fill="${a}" opacity=".9"/><path d="M4 112 Q60 94 116 112 L116 150 L4 150 Z" fill="${b}"/>
      <path d="M44 112 L44 80 Q44 72 50 70 Q46 66 46 60 Q46 52 53 52 Q60 52 60 60 Q60 66 56 70 Q60 72 60 80 L60 112 Z" fill="${ink}"/>
      <path d="M62 112 L62 82 Q62 74 68 72 Q64 68 64 62 Q64 55 70 55 Q76 55 76 62 Q76 68 72 72 Q78 74 78 84 L80 112 Z" fill="${ink}"/>`
  };
  const SERIF = "Georgia, 'Times New Roman', serif", SANS = "Impact, 'Arial Narrow', system-ui, sans-serif";
  const POSTERS = [
    { title: "Night Falls on|Harbor Street", tag: "Every city has a secret", scene: "noir", year: 1951, studio: "Meridian", pal: ["#1c1f26", "#f2c14e", "#2e333d", "#f1ece1"], ty: 34, ts: 10, font: SERIF,
      kind: "Film noir · 1951", specs: [["Runtime", "94 min"], ["Shot on", "Black & white"]], about: "Low-key lighting, venetian-blind shadows and a detective who's too tired to care: noir was born out of post-war cynicism." },
    { title: "Dust|& Iron", tag: "One town. One sheriff. One last chance.", scene: "western", year: 1956, studio: "Pinecrest", pal: ["#e9c27a", "#d9572b", "#8a4b2a", "#2b1a12"], ty: 34, ts: 15, font: SANS,
      kind: "Western · 1956", specs: [["Runtime", "108 min"], ["Shot on", "Technicolor-style colour"]], about: "Wide landscapes shot in widescreen, a lone hero and a moral line drawn in the sand — the western was Hollywood's favourite myth." },
    { title: "They Came|from Orbit 9", tag: "Keep watching the skies", scene: "scifi", year: 1957, studio: "Starfall", pal: ["#0f1a3a", "#5fd3c4", "#d9572b", "#f3e9c6"], ty: 30, ts: 11, font: SANS,
      kind: "Sci-fi B-movie · 1957", specs: [["Runtime", "78 min"], ["Budget", "Tiny"]], about: "Made on shoestring budgets in a matter of weeks, fifties B-movies turned Cold War paranoia into flying saucers." },
    { title: "Moonlight|Avenue", tag: "Songs. Stars. Broadway.", scene: "musical", year: 1961, studio: "Grand Royale", pal: ["#3a1530", "#f5c518", "#7a2348", "#fff4e0"], ty: 30, ts: 14, font: SERIF,
      kind: "Musical · 1961", specs: [["Runtime", "131 min"], ["Songs", "14"]], about: "Big studio musicals were shot on huge soundstages with full orchestras. Not a single dance step was left to chance." },
    { title: "Code Name|Velvet", tag: "She knows too much", scene: "spy", year: 1965, studio: "Halcyon", pal: ["#efe7d6", "#d1342f", "#efe7d6", "#151515"], ty: 26, ts: 15, font: SANS,
      kind: "Spy thriller · 1965", specs: [["Runtime", "112 min"], ["Locations", "Lisbon, Vienna"]], about: "Sixties spy films sold glamour: tuxedos, gadgets and exotic locations, all wrapped in a jazzy, brassy score." },
    { title: "Two Summers|in Paris", tag: "A film in nine conversations", scene: "newwave", year: 1963, studio: "Rive Gauche", pal: ["#f4f0e6", "#2f6fd6", "#e3483a", "#151515"], ty: 135, ts: 10, font: SERIF,
      kind: "New Wave · 1963", specs: [["Runtime", "86 min"], ["Shot on", "Handheld 35mm"]], about: "Handheld cameras, jump cuts and real streets instead of sets: the New Wave broke the rules on purpose, and cinema never recovered." },
    { title: "The Last|Combination", tag: "Six thieves. One vault. No guns.", scene: "heist", year: 1969, studio: "Ashford", pal: ["#16302b", "#d9b04a", "#24453e", "#f2ead8"], ty: 133, ts: 12, font: SANS,
      kind: "Heist · 1969", specs: [["Runtime", "104 min"], ["Score", "Jazz"]], about: "A good heist film spends an hour planning the job and ten minutes watching it go wrong. Patience is the whole point." },
    { title: "Highway|Zero", tag: "No brakes. No way back.", scene: "chase", year: 1971, studio: "Overdrive", pal: ["#f1a13a", "#fff2c6", "#3a3a3a", "#141414"], ty: 30, ts: 16, font: SANS,
      kind: "Car-chase thriller · 1971", specs: [["Runtime", "97 min"], ["Stunts", "All practical"]], about: "Seventies car chases were filmed for real, at real speed, on real streets — which is precisely why they still hold up." },
    { title: "Colossus|of the Bay", tag: "The sea has woken up", scene: "monster", year: 1954, studio: "Tidewater", pal: ["#c9d8d2", "#e3483a", "#5e7d74", "#14201d"], ty: 30, ts: 13, font: SANS,
      kind: "Monster movie · 1954", specs: [["Runtime", "82 min"], ["Effects", "Miniatures"]], about: "Men in rubber suits, tiny model cities and a lot of smoke: monster movies turned fear of the atomic age into spectacle." },
    { title: "Until|September", tag: "Some summers stay with you", scene: "romance", year: 1973, studio: "Lantern", pal: ["#f6dcc4", "#f08a5d", "#b85c48", "#3a1f1a"], ty: 131, ts: 14, font: SERIF,
      kind: "Romantic drama · 1973", specs: [["Runtime", "118 min"], ["Shot on", "Natural light"]], about: "Seventies dramas slowed everything down: long takes, golden-hour light and characters who say less than they feel." }
  ];

  // ── Collections by style ──
  const SETS = {
    riding: { key: "stable", title: "Your stable", noun: "horse", nouns: "horses", menu: "My stable", stage: "stable", items: HORSES, art: horse, mystery: "Mystery horse" },
    music: { key: "studio", title: "Your studio", noun: "instrument", nouns: "instruments", menu: "My studio", stage: "studio", items: INSTRUMENTS, art: instrument, mystery: "Mystery instrument" },
    cinema: { key: "posters", title: "Your poster wall", noun: "poster", nouns: "posters", menu: "My poster wall", stage: "posters", items: POSTERS, art: poster, mystery: "Mystery poster" }
  };
  const themeKey = () => (L.settings && L.settings.theme) || "racing";
  const visible = () => L.modulos.flatMap(m => m.lecciones).filter(l => l.estado === "lista");
  const passed = () => visible().map(l => ({ l, d: L.store.get("diploma." + l.id, null) })).filter(x => x.d)
    .sort((x, y) => String(x.d.at || "").localeCompare(String(y.d.at || "")) || x.l.id.localeCompare(y.l.id, undefined, { numeric: true }));
  const nextLesson = () => visible().find(l => !L.store.get("diploma." + l.id, null));

  function current() {
    const k = themeKey();
    if (k === "racing" && L.garage) return {
      key: "garage", title: "Your garage", noun: "car", nouns: "cars", menu: "My garage", stage: "garage", mystery: "Mystery car",
      list: () => L.garage.list().map(c => ({ key: c.lesson.id, name: c.name, kind: c.kind, unlocked: c.unlocked, lesson: c.lesson, num: c.num, about: c.about, learned: c.learned,
        specs: [["Power", c.hp.toLocaleString("en-US") + " hp", c.hp / L.garage.MAX.hp], ["Top speed", c.top + " km/h", c.top / L.garage.MAX.top], ["0–100 km/h", c.zero.toFixed(1) + " s", (12 - c.zero) / 10]],
        art: locked => L.garage.svg(c, { locked }) })),
      byLesson: id => { const c = L.garage.car(id); return c ? { name: c.name } : null; }
    };
    const S = SETS[k]; if (!S) return null;
    return {
      ...S,
      list() {
        const got = passed(), nx = nextLesson();
        return S.items.map((it, i) => {
          const by = got[i], specs = it.specs.map(([lab, v]) => typeof v === "number" ? [lab, v + " / 10", v / 10] : [lab, v, null]);
          return { key: S.key + "." + i, name: it.name || it.title.replace("|", " "), kind: it.kind, unlocked: !!by, lesson: by ? by.l : (i === got.length ? nx : null), num: String(i + 1).padStart(2, "0"),
            about: it.about, specs, need: i + 1 - got.length, art: locked => S.art(it, locked) };
        });
      },
      byLesson(id) { const i = passed().findIndex(x => x.l.id === id); return i >= 0 && S.items[i] ? { name: S.items[i].name } : null; }
    };
  }
  const seen = () => L.store.get("garage.seen", []) || [];
  const markSeen = k => { const s = seen(); if (!s.includes(k)) { s.push(k); L.store.set("garage.seen", s); } };

  L.collection = { current, seen, markSeen, SETS, HORSES, INSTRUMENTS, POSTERS, horse, instrument, poster };
})();
