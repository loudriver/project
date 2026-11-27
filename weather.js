// ===== ДАТА И ПОГОДА =====
// Координаты Пушкино (Московская область). Если нужен другой город, меняем здесь
const LAT = 56.01;
const LON = 37.85;
const TZ = "Europe/Moscow";

// ----- дата и время (обновляются сами) -----
function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString("ru-RU", { day: "numeric", month: "long", timeZone: TZ });
  let day = now.toLocaleDateString("ru-RU", { weekday: "long", timeZone: TZ });
  day = day.charAt(0).toUpperCase() + day.slice(1);
  const time = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  document.getElementById("w-date").textContent = date;
  document.getElementById("w-day").textContent = day;
  document.getElementById("w-time").textContent = time;
}

// ----- картинки: солнце, луна, облака -----
function cloud(x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
    <circle cx="20" cy="32" r="14"/><circle cx="40" cy="22" r="19"/><circle cx="60" cy="32" r="14"/>
    <rect x="8" y="30" width="64" height="16" rx="8"/></g>`;
}

function sun(cx, cy, r) {
  let s = "";
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    s += `<line x1="${cx + Math.cos(a) * (r + 6)}" y1="${cy + Math.sin(a) * (r + 6)}"
      x2="${cx + Math.cos(a) * (r + 14)}" y2="${cy + Math.sin(a) * (r + 14)}"
      stroke="#f5c542" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#f5c542"/>`;
}

function moon(cx, cy, r) {
  return `<mask id="moonmask"><rect width="140" height="110" fill="#fff"/>
    <circle cx="${cx + r * 0.45}" cy="${cy - r * 0.3}" r="${r * 0.85}" fill="#000"/></mask>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8ecf5" mask="url(#moonmask)"/>
    <circle cx="112" cy="20" r="2" fill="#fff"/><circle cx="22" cy="28" r="1.6" fill="#fff"/>
    <circle cx="100" cy="46" r="1.4" fill="#fff"/>`;
}

function weatherArt(kind, isDay) {
  switch (kind) {
    case "clear":
      return isDay ? sun(70, 55, 26) : moon(70, 55, 32);
    case "partly":
      return (isDay ? sun(50, 38, 18) : moon(50, 38, 20)) + cloud(38, 44, 1.2, "#dfe6f7");
    case "cloudy":
      return cloud(6, 30, 1.0, "#6b7899") + cloud(40, 38, 1.25, "#dfe6f7");
    case "fog":
      return cloud(30, 10, 1.3, "#b8c2dc") +
        `<g stroke="#8d99b5" stroke-width="4" stroke-linecap="round">
          <line x1="28" y1="82" x2="112" y2="82"/><line x1="40" y1="92" x2="122" y2="92"/>
          <line x1="28" y1="102" x2="100" y2="102"/></g>`;
    case "rain":
      return cloud(30, 8, 1.3, "#b8c2dc") +
        `<g stroke="#6ea8ff" stroke-width="4" stroke-linecap="round">
          <line x1="52" y1="78" x2="46" y2="94"/><line x1="74" y1="80" x2="68" y2="96"/>
          <line x1="96" y1="78" x2="90" y2="94"/><line x1="63" y1="98" x2="59" y2="108"/></g>`;
    case "snow":
      return cloud(30, 8, 1.3, "#b8c2dc") +
        `<g fill="#fff"><circle cx="52" cy="84" r="3.5"/><circle cx="74" cy="92" r="3.5"/>
          <circle cx="96" cy="84" r="3.5"/><circle cx="63" cy="103" r="3.5"/><circle cx="87" cy="104" r="3.5"/></g>`;
    case "storm":
      return cloud(30, 8, 1.3, "#8d99b5") +
        `<polygon points="74,66 58,92 70,92 64,108 90,80 77,80 86,66" fill="#f5c542"/>`;
  }
  return cloud(40, 38, 1.25, "#dfe6f7");
}

// ----- расшифровка кода погоды -----
function describe(code) {
  if (code === 0) return { text: "Ясно", kind: "clear" };
  if (code === 1) return { text: "Малооблачно", kind: "partly" };
  if (code === 2) return { text: "Облачно", kind: "partly" };
  if (code === 3) return { text: "Пасмурно", kind: "cloudy" };
  if (code === 45 || code === 48) return { text: "Туман", kind: "fog" };
  if (code >= 51 && code <= 57) return { text: "Морось", kind: "rain" };
  if (code >= 61 && code <= 67) return { text: "Дождь", kind: "rain" };
  if (code >= 71 && code <= 77) return { text: "Снег", kind: "snow" };
  if (code >= 80 && code <= 82) return { text: "Ливень", kind: "rain" };
  if (code === 85 || code === 86) return { text: "Снегопад", kind: "snow" };
  if (code >= 95) return { text: "Гроза", kind: "storm" };
  return { text: "Облачно", kind: "cloudy" };
}

function fmtTemp(t) {
  const r = Math.round(t);
  return (r > 0 ? "+" : r < 0 ? "−" : "") + Math.abs(r) + "°";
}

// ----- загрузка погоды -----
async function loadWeather() {
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + LAT + "&longitude=" + LON +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day" +
      "&wind_speed_unit=ms&timezone=Europe%2FMoscow";
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const c = (await res.json()).current;
    const w = describe(c.weather_code);
    document.getElementById("w-temp").textContent = fmtTemp(c.temperature_2m);
    document.getElementById("w-desc").textContent = w.text;
    document.getElementById("w-extra").textContent =
      "Ощущается " + fmtTemp(c.apparent_temperature) + " · ветер " + Math.round(c.wind_speed_10m) + " м/с";
    document.getElementById("w-art").innerHTML = weatherArt(w.kind, c.is_day === 1);
  } catch (e) {
    console.warn("Не удалось загрузить погоду:", e);
    document.getElementById("w-desc").textContent = "Погода недоступна";
  }
}

document.getElementById("w-art").innerHTML = weatherArt("partly", true); // пока погода грузится
updateClock();
setInterval(updateClock, 1000);
loadWeather();
setInterval(loadWeather, 15 * 60 * 1000);   // обновлять погоду каждые 15 минут