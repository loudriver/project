// ===== ЁЛКИ И СНЕГ =====
function makeRandom(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const n1 = v => v.toFixed(1);

function fir(o) {
  const rand = makeRandom(o.seed);
  const W = o.w, H = o.h, cx = W / 2, n = o.tiers;
  const y0 = 14;
  const lastBottom = H - 52;
  const lastApex = lastBottom - o.tierMax;
  const id = "fir" + o.seed;

  let out = `
    <defs>
      <linearGradient id="${id}g" x1="0" x2="1">
        <stop offset="0" stop-color="${o.green[0]}"/>
        <stop offset="0.55" stop-color="${o.green[1]}"/>
        <stop offset="1" stop-color="${o.green[2]}"/>
      </linearGradient>
      <linearGradient id="${id}b" x1="0" x2="1">
        <stop offset="0" stop-color="#3a2519"/>
        <stop offset="0.5" stop-color="#6a4530"/>
        <stop offset="1" stop-color="#33200f"/>
      </linearGradient>
    </defs>`;

  // ствол и сугроб у корней
  const tt = o.trunk;
  out += `<path d="M${n1(cx - tt)} ${H} L${n1(cx - tt * 0.7)} ${H - 90} L${n1(cx + tt * 0.7)} ${H - 90} L${n1(cx + tt)} ${H} Z" fill="url(#${id}b)"/>`;
  out += `<ellipse cx="${cx}" cy="${H - 5}" rx="${o.maxHalf * 0.85}" ry="15" fill="#e9f0fb"/>`;

  // ярусы веток: рисуем снизу вверх
  for (let i = n - 1; i >= 0; i--) {
    const t = i / (n - 1);
    const h = o.tierMin + (o.tierMax - o.tierMin) * t;
    const apexY = y0 + (lastApex - y0) * Math.pow(t, 1.05);
    const w = o.maxHalf * (0.18 + 0.82 * Math.pow(t, 0.9));
    const bottom = apexY + h;
    const ax = cx + (rand() - 0.5) * 8;

    // зубчатый нижний край яруса
    const m = Math.max(6, Math.round(w / 14));
    let pts = `${n1(ax)},${n1(apexY)} ${n1(cx - w)},${n1(bottom + 6)}`;
    const tips = [];
    for (let j = 1; j < m; j++) {
      const x = cx - w + (2 * w * j) / m;
      const down = j % 2 === 1;
      const y = bottom + (down ? 5 + rand() * 9 : -(5 + rand() * 7));
      pts += ` ${n1(x)},${n1(y)}`;
      if (down) tips.push([x, y]);
    }
    pts += ` ${n1(cx + w)},${n1(bottom + 6)}`;
    out += `<polygon points="${pts}" fill="url(#${id}g)" stroke="${o.edge}" stroke-width="0.8" stroke-linejoin="round"/>`;

    // иголки
    const count = Math.round(w / 2.5);
    for (let k = 0; k < count; k++) {
      const frac = 0.3 + rand() * 0.6;
      const yy = apexY + h * frac;
      const half = w * frac;
      const x = cx + (rand() * 2 - 1) * half * 0.92;
      const dx = (rand() - 0.5) * 8;
      const len = 5 + rand() * 8;
      out += `<line x1="${n1(x)}" y1="${n1(yy)}" x2="${n1(x + dx)}" y2="${n1(yy + len)}" stroke="${rand() > 0.5 ? o.needle[0] : o.needle[1]}" stroke-width="1.1" stroke-linecap="round" opacity="0.5"/>`;
    }

    // тень с правой стороны
    out += `<polygon points="${n1(ax)},${n1(apexY)} ${n1(cx + w)},${n1(bottom + 6)} ${n1(cx)},${n1(bottom + 6)}" fill="#000" opacity="0.14"/>`;

    // снежная шапка яруса
    const u = 0.48 + rand() * 0.16;
    const lx = ax + (cx - w - ax) * u;
    const rx = ax + (cx + w - ax) * u;
    const sy = apexY + (h + 6) * u;
    const sm = Math.max(4, Math.round((rx - lx) / 10));
    let snow = `${n1(ax)},${n1(apexY)} ${n1(lx)},${n1(sy)}`;
    for (let j = 1; j < sm; j++) {
      const x = lx + ((rx - lx) * j) / sm;
      const y = sy + (j % 2 === 1 ? 5 + rand() * 8 : -(1 + rand() * 4));
      snow += ` ${n1(x)},${n1(y)}`;
    }
    snow += ` ${n1(rx)},${n1(sy)}`;
    out += `<polygon points="${snow}" fill="#f3f7ff" stroke="#bccce6" stroke-width="0.8" stroke-linejoin="round"/>`;

    // снег на кончиках веток
    tips.forEach(([x, y]) => {
      if (rand() < 0.4) {
        out += `<ellipse cx="${n1(x)}" cy="${n1(y - 1)}" rx="${n1(3 + rand() * 3)}" ry="2.2" fill="#f3f7ff"/>`;
      }
    });
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

// Две разные ёлки: справа высокая, слева пониже и с синеватой хвоей
const specs = [
  { side: "right", offset: 8, w: 360, h: 560, seed: 11, tiers: 10, maxHalf: 150,
    tierMin: 62, tierMax: 128, trunk: 14,
    green: ["#3f8a5f", "#1f5a3e", "#0f3324"], edge: "#0b2418", needle: ["#5fae7f", "#0e2c1f"] },
  { side: "left", offset: 8, w: 320, h: 470, seed: 29, tiers: 8, maxHalf: 140,
    tierMin: 56, tierMax: 118, trunk: 13,
    green: ["#4a8f78", "#25615a", "#123a3a"], edge: "#0a2326", needle: ["#6cc0aa", "#0c2b2b"] }
];

specs.forEach(s => {
  const div = document.createElement("div");
  div.className = "tree";
  div.style.width = s.w + "px";
  div.style.height = s.h + "px";
  div.style[s.side] = s.offset + "px";
  div.innerHTML = fir(s);
  document.body.appendChild(div);
});

// Снежинки, которые слетают с веток
function snowflake(s) {
  const left0 = s.side === "left" ? s.offset : window.innerWidth - s.w - s.offset;
  const x = left0 + s.w * (0.15 + Math.random() * 0.7);
  const y = window.innerHeight - s.h + s.h * (0.1 + Math.random() * 0.75);
  const size = 3 + Math.random() * 4;
  const f = document.createElement("div");
  f.className = "flake";
  f.style.left = x + "px";
  f.style.top = y + "px";
  f.style.width = f.style.height = size + "px";
  f.style.setProperty("--fall", (window.innerHeight - y) + "px");
  f.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
  f.style.animationDuration = (7 + Math.random() * 5) + "s";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 13000);
}

setInterval(() => specs.forEach(s => { snowflake(s); snowflake(s); }), 1000);