// ===== ЁЛКА, СНЕГОВИК И ЗИМНЯЯ СЦЕНКА =====
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

// ===== СНЕГОВИК (рисуется в своих координатах 240 x 330) =====
function snowmanArt() {
  const line = "#b6c6e2";
  const body = `fill="url(#snowmanG)" stroke="${line}" stroke-width="1"`;
  return `
    <ellipse cx="120" cy="320" rx="112" ry="11" fill="#e9f0fb"/>
    <g stroke="#5b3a24" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M78 168 L22 132"/><path d="M44 146 L34 124"/><path d="M36 141 L16 146"/>
      <path d="M162 168 L218 134"/><path d="M196 148 L206 168"/><path d="M204 143 L214 122"/>
    </g>
    <circle cx="120" cy="255" r="68" ${body}/>
    <circle cx="120" cy="165" r="50" ${body}/>
    <circle cx="120" cy="93" r="36" ${body}/>
    <rect x="82" y="52" width="76" height="8" rx="3" fill="#1a1f2e"/>
    <rect x="94" y="16" width="52" height="38" rx="3" fill="#232a3f"/>
    <rect x="94" y="42" width="52" height="9" fill="#d94f4f"/>
    <ellipse cx="120" cy="17" rx="26" ry="4" fill="#f3f7ff"/>
    <circle cx="108" cy="84" r="4.2" fill="#1a1f2e"/>
    <circle cx="132" cy="84" r="4.2" fill="#1a1f2e"/>
    <circle cx="100" cy="98" r="5" fill="#ff9aa8" opacity="0.35"/>
    <circle cx="140" cy="98" r="5" fill="#ff9aa8" opacity="0.35"/>
    <polygon points="120,92 158,99 120,104" fill="#f08a24"/>
    <polygon points="120,98 158,99 120,104" fill="#c96a14"/>
    <g fill="#1a1f2e">
      <circle cx="103" cy="108" r="2.2"/><circle cx="109" cy="114" r="2.2"/><circle cx="120" cy="117" r="2.2"/>
      <circle cx="131" cy="114" r="2.2"/><circle cx="137" cy="108" r="2.2"/>
    </g>
    <rect x="86" y="122" width="68" height="15" rx="7.5" fill="#d94f4f"/>
    <g fill="#b83a3a">
      <rect x="100" y="122" width="7" height="15"/><rect x="122" y="122" width="7" height="15"/>
      <rect x="142" y="122" width="7" height="15"/>
    </g>
    <rect x="136" y="130" width="16" height="48" rx="4" fill="#d94f4f"/>
    <rect x="136" y="146" width="16" height="6" fill="#b83a3a"/>
    <rect x="136" y="162" width="16" height="6" fill="#b83a3a"/>
    <g fill="#1a1f2e">
      <circle cx="120" cy="152" r="4.5"/><circle cx="120" cy="174" r="4.5"/><circle cx="120" cy="196" r="4.5"/>
    </g>`;
}

// ===== ЗИМНИЕ ПРИКОЛЫ (каждый рисуется от точки 0,0 вверх) =====
function miniFir() {
  const tiers = [[-58, -14, 34, "#1b4f37"], [-76, -40, 27, "#206043"], [-96, -62, 19, "#277050"]];
  let s = `<rect x="-4" y="-16" width="8" height="16" fill="#5a3a26"/>`;
  tiers.forEach(([top, bot, hw, c]) => {
    s += `<polygon points="0,${top} ${-hw},${bot} ${hw},${bot}" fill="${c}"/>`;
    const ch = (bot - top) * 0.42, cw = hw * 0.42;
    s += `<path d="M0 ${top} L${-cw} ${top + ch} Q${-cw / 2} ${top + ch - 3} 0 ${top + ch + 2} Q${cw / 2} ${top + ch - 3} ${cw} ${top + ch} Z" fill="#f3f7ff"/>`;
  });
  return s;
}

function gifts() {
  return `
    <rect x="-28" y="-26" width="30" height="26" fill="#d94f4f"/>
    <rect x="-16" y="-26" width="6" height="26" fill="#f5c542"/>
    <rect x="-28" y="-16" width="30" height="5" fill="#f5c542"/>
    <ellipse cx="-17" cy="-29" rx="5" ry="3.5" fill="#f5c542"/><ellipse cx="-9" cy="-29" rx="5" ry="3.5" fill="#f5c542"/>
    <rect x="4" y="-20" width="24" height="20" fill="#4d8be0"/>
    <rect x="13" y="-20" width="5" height="20" fill="#e8ecf5"/>
    <rect x="8" y="-34" width="16" height="14" fill="#3dbf84"/>
    <rect x="14" y="-34" width="4" height="14" fill="#f5c542"/>
    <ellipse cx="16" cy="-34" rx="9" ry="2.5" fill="#f3f7ff"/>`;
}

function lamp() {
  return `
    <circle cx="0" cy="-148" r="75" fill="url(#lampGlow)"/>
    <ellipse cx="0" cy="-2" rx="52" ry="6" fill="#ffd27a" opacity="0.18"/>
    <rect x="-3" y="-142" width="6" height="142" fill="#2a3350"/>
    <rect x="-9" y="-6" width="18" height="6" rx="2" fill="#2a3350"/>
    <rect x="-9" y="-160" width="18" height="20" rx="3" fill="#ffd27a"/>
    <polygon points="-13,-160 0,-173 13,-160" fill="#2a3350"/>
    <path d="M-11 -163 L0 -174 L11 -163 Q0 -166 -11 -163 Z" fill="#f3f7ff"/>`;
}

function igloo() {
  return `
    <path d="M-46 0 A46 40 0 0 1 46 0 Z" fill="#e9f0fb" stroke="#b6c6e2" stroke-width="1.5"/>
    <path d="M-40 -14 Q0 -22 40 -14 M-30 -28 Q0 -34 30 -28" fill="none" stroke="#b6c6e2" stroke-width="1.2"/>
    <path d="M-12 0 L-12 -14 A12 12 0 0 1 12 -14 L12 0 Z" fill="#1b2a52"/>`;
}

function sled() {
  return `
    <path d="M-40 -16 Q-40 -5 -30 -5 L32 -5" fill="none" stroke="#6a4530" stroke-width="3" stroke-linecap="round"/>
    <rect x="-22" y="-13" width="4" height="8" fill="#6a4530"/>
    <rect x="18" y="-13" width="4" height="8" fill="#6a4530"/>
    <rect x="-28" y="-20" width="56" height="7" rx="2" fill="#c0552f"/>
    <ellipse cx="0" cy="-20" rx="20" ry="2.5" fill="#f3f7ff"/>
    <path d="M-40 -16 Q-58 -14 -66 -4" fill="none" stroke="#e8ecf5" stroke-width="1.5"/>`;
}

function canes() {
  const d = "M0 0 L0 -42 Q0 -56 -12 -56 Q-23 -56 -23 -45";
  const cane = `<path d="${d}" fill="none" stroke="#f3f7ff" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#d94f4f" stroke-width="7" stroke-dasharray="5 6"/>`;
  return `<g transform="translate(-14 0) rotate(-6)">${cane}</g><g transform="translate(16 0) rotate(7)">${cane}</g>`;
}

// ===== ВСЯ СЦЕНКА ВНИЗУ: снеговик слева, приколы посередине =====
function scene(W, H, snowCx, treeLeft) {
  const rand = makeRandom(7);
  const sc = (H - 6) / 330;          // размер снеговика
  const snowBase = H - 8;
  const ground = H - 14;
  const xL = snowCx + 120 * sc + 40; // где начинаются приколы
  const rangeW = treeLeft - 10 - xL; // сколько места до ёлки

  let out = `
    <defs>
      <radialGradient id="snowmanG" cx="0.38" cy="0.32" r="0.85">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset="0.6" stop-color="#e4ecf9"/>
        <stop offset="1" stop-color="#a7b9d6"/>
      </radialGradient>
      <radialGradient id="lampGlow">
        <stop offset="0" stop-color="#ffd27a" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#ffd27a" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

  // звёзды
  for (let i = 0; i < 16; i++) {
    out += `<circle cx="${n1(rand() * W)}" cy="${n1(6 + rand() * H * 0.45)}" r="${n1(0.8 + rand() * 1.4)}" fill="#fff" opacity="${n1(0.3 + rand() * 0.5)}"/>`;
  }

  // месяц
  if (rangeW > 300) {
    const mx = xL + rangeW * 0.62, my = Math.max(34, H * 0.2);
    out += `<g transform="translate(${n1(mx)} ${n1(my)})"><circle r="34" fill="#f3eac2" opacity="0.07"/><path d="M0 -18 A18 18 0 0 0 0 18 A24 24 0 0 1 0 -18 Z" fill="#f3eac2"/></g>`;
  }

  // дальний сугроб
  out += `<path d="M0 ${H} L0 ${n1(H - 34)} C${n1(W * 0.12)} ${n1(H - 58)} ${n1(W * 0.28)} ${n1(H - 22)} ${n1(W * 0.5)} ${n1(H - 38)} S${n1(W * 0.86)} ${n1(H - 58)} ${W} ${n1(H - 30)} L${W} ${H} Z" fill="#9db0d0" opacity="0.5"/>`;

  // снеговик
  out += `<g transform="translate(${n1(snowCx - 120 * sc)} ${n1(snowBase - 330 * sc)}) scale(${sc.toFixed(3)})">${snowmanArt()}</g>`;

  // зимние приколы между снеговиком и ёлкой
  if (rangeW > 260) {
    const u = Math.min(1.25, Math.max(0.6, H / 260));
    const items = [
      [0.02, miniFir, 0.85], [0.13, gifts, 1], [0.30, lamp, 1], [0.47, igloo, 1.05],
      [0.64, sled, 1], [0.77, canes, 1], [0.92, miniFir, 0.7]
    ];
    let lastX = -1e9;
    items.forEach(([f, draw, k]) => {
      const x = xL + f * rangeW;
      if (x - lastX < 95 * u) return;   // если тесно, пропускаем
      lastX = x;
      out += `<g transform="translate(${n1(x)} ${n1(ground)}) scale(${(u * k).toFixed(2)})">${draw()}</g>`;
    });
  }

  // ближний сугроб (закрывает основания предметов)
  out += `<path d="M0 ${H} L0 ${n1(H - 14)} Q${n1(W * 0.25)} ${n1(H - 24)} ${n1(W * 0.5)} ${n1(H - 12)} T${W} ${n1(H - 16)} L${W} ${H} Z" fill="#e9f0fb"/>`;

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}

// ===== РАЗМЕР И МЕСТО ЁЛКИ =====
const GUTTER_LEFT = 304;   // где по центру стоит снеговик (от левого края экрана)
const GUTTER_RIGHT = 344;  // где по центру стоит ёлка (от правого края экрана)
const SHIFT = 0;           // доп. сдвиг в пикселях

const lookRight = { green: ["#3f8a5f", "#1f5a3e", "#0f3324"], edge: "#0b2418", needle: ["#5fae7f", "#0e2c1f"] };

// widthK — ширина ёлки относительно высоты (больше число — пышнее ёлка)
function makeSpec(side, gutter, widthK, seed, look) {
  const header = document.querySelector("header");
  const headerH = header ? header.offsetHeight : 100;
  // ёлка заканчивается чуть ниже шапки, чтобы не заезжать на меню
  const h = Math.max(window.innerHeight - headerH - 16, 400);
  const w = Math.round(h * widthK);
  return Object.assign({
    side: side,
    offset: Math.round(gutter - w / 2 + SHIFT),
    w: w, h: h, seed: seed,
    tiers: Math.max(8, Math.round(h / 65)),
    maxHalf: Math.round(w * 0.43),
    tierMin: Math.round(h * 0.09),
    tierMax: Math.round(h * 0.19),
    trunk: Math.round(w * 0.035)
  }, look);
}

let specs = [];

function buildTrees() {
  document.querySelectorAll(".tree, .scene").forEach(t => t.remove());
  specs = [];
  document.body.style.paddingBottom = "0px";
  if (window.innerWidth < 900) return;           // на телефоне ничего не рисуем

  const treeSpec = makeSpec("right", GUTTER_RIGHT, 0.58, 11, lookRight);
  specs = [treeSpec];

  // высота сценки зависит от высоты окна, а не от свободного места
  const H = Math.round(Math.min(380, Math.max(220, window.innerHeight * 0.32)));
  const W = document.documentElement.clientWidth;
  const treeLeft = W - GUTTER_RIGHT - treeSpec.w * 0.45;

  // запас внизу страницы, чтобы в конце прокрутки сценка была видна целиком
  document.body.style.paddingBottom = H + "px";

  const sceneDiv = document.createElement("div");
  sceneDiv.className = "scene";
  sceneDiv.style.height = H + "px";
  sceneDiv.innerHTML = scene(W, H, GUTTER_LEFT + SHIFT, treeLeft);
  document.body.appendChild(sceneDiv);

  const div = document.createElement("div");
  div.className = "tree";
  div.style.width = treeSpec.w + "px";
  div.style.height = treeSpec.h + "px";
  div.style[treeSpec.side] = treeSpec.offset + "px";
  div.innerHTML = fir(treeSpec);
  document.body.appendChild(div);
}

buildTrees();
window.addEventListener("load", buildTrees);   // пересобрать, когда всё загрузилось

// при изменении размера окна пересобираем под новый размер
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildTrees, 300);
});

// Снежинки, которые слетают с веток
function snowflake(s) {
  if (window.innerWidth < 900) return;  // на телефоне снег не создаём
  const vh = Math.min(s.h, window.innerHeight);  // видимая часть ёлки
  const left0 = s.side === "left" ? s.offset : window.innerWidth - s.w - s.offset;
  const x = left0 + s.w * (0.15 + Math.random() * 0.7);
  const y = window.innerHeight - vh + vh * (0.1 + Math.random() * 0.75);
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