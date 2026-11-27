// Логика страницы «Все свои». Данные (люди, числа) лежат в data.js

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function rowHTML(p) {
  const img = p.photo ? `<img src="${p.photo}" alt="" onerror="this.remove()">` : "";
  return `
    <div class="avatar">${initials(p.name)}${img}</div>
    <div class="info"><div class="name">${p.name}</div><div class="class">${p.info}</div></div>
    <div class="status"><span class="dot ${colors[p.status]}"></span>
      <span class="status-text">${p.status}</span></div>`;
}

// ===== СЧЁТЧИКИ =====
document.getElementById("count-students").textContent = classSize;
document.getElementById("count-teachers").textContent = teachers;

// ===== СВЕЖАЯ НОВОСТЬ СЛЕВА =====
(function () {
  const box = document.getElementById("mini-news");
  const n = news.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!n) { box.remove(); return; }
  box.href = "news.html?id=" + n.id;
  box.innerHTML = `
    <div class="mini-news-img"><img alt=""></div>
    <div class="mini-news-title">${n.title}</div>
    <div class="mini-news-date">${formatDate(n.date)}</div>`;
  const img = box.querySelector("img");
  img.style.objectPosition = "center 20%";
  loadPhoto(img, n.folder, n.photos[0]);
})();

// ===== КАРТОЧКИ ЛЮДЕЙ + ФИЛЬТРЫ =====
const grid = document.getElementById("pgrid");
const qInput = document.getElementById("people-q");
const fClass = document.getElementById("f-class");
const fStatus = document.getElementById("f-status");
const fGroup = document.getElementById("f-group");
const fPosition = document.getElementById("f-position");
const foundEl = document.getElementById("found");

// список классов берём из данных (только у учеников)
const classes = [...new Set(people.filter(p => p.group === "ученик").map(p => p.info))]
  .sort((a, b) => a.localeCompare(b, "ru", { numeric: true }));
classes.forEach(c => {
  const o = document.createElement("option");
  o.textContent = c;
  fClass.appendChild(o);
});

// список должностей берём из данных (у учителей и сотрудников)
const positions = [...new Set(people.filter(p => p.group !== "ученик").map(p => p.info))]
  .sort((a, b) => a.localeCompare(b, "ru"));
positions.forEach(c => {
  const o = document.createElement("option");
  o.textContent = c;
  fPosition.appendChild(o);
});

function cardHTML(p) {
  const img = p.photo ? `<img src="${p.photo}" alt="" onerror="this.remove()">` : "";
  return `
    <div class="pphoto"><span>${initials(p.name)}</span>${img}</div>
    <div class="pbody">
      <div class="pname">${p.name}</div>
      <div class="pclass">${p.info}</div>
      <div class="pstatus"><span class="dot ${colors[p.status]}"></span>${p.status}</div>
    </div>`;
}

function renderPeople() {
  const q = qInput.value.trim().toLowerCase();
  const found = people.filter(p =>
    (!q || (p.name + " " + p.info).toLowerCase().includes(q)) &&
    (!fClass.value || p.info === fClass.value) &&
    (!fStatus.value || p.status === fStatus.value) &&
    (!fGroup.value || p.group === fGroup.value) &&
    (!fPosition.value || p.info === fPosition.value)
  );
  grid.innerHTML = "";
  found.forEach(p => {
    const c = document.createElement("div");
    c.className = "pcard";
    c.innerHTML = cardHTML(p);
    grid.appendChild(c);
  });
  if (found.length === 0) grid.innerHTML = '<div class="search-empty">Никого не найдено</div>';
  foundEl.textContent = "Найдено: " + found.length;
}

[qInput, fClass, fStatus, fGroup, fPosition].forEach(el => {
  el.addEventListener("input", renderPeople);
  el.addEventListener("change", renderPeople);
});
renderPeople();

// ===== ПОИСК В ШАПКЕ =====
const searchBtn = document.getElementById("search-btn");
const searchPanel = document.getElementById("search-panel");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";
  if (!q) {
    searchResults.innerHTML = '<div class="search-empty">Введите имя, класс или должность</div>';
    return;
  }
  const found = people.filter(p => (p.name + " " + p.info + " " + p.group).toLowerCase().includes(q));
  if (found.length === 0) {
    searchResults.innerHTML = '<div class="search-empty">Никого не найдено</div>';
    return;
  }
  found.forEach(p => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = rowHTML(p);
    searchResults.appendChild(row);
  });
}

function closeSearch() { searchPanel.classList.remove("open"); }

searchBtn.addEventListener("click", e => {
  e.stopPropagation();
  searchPanel.classList.toggle("open");
  if (searchPanel.classList.contains("open")) { searchInput.focus(); runSearch(); }
});
searchInput.addEventListener("input", runSearch);
searchPanel.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", closeSearch);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });

// ===== ОПРОС =====
document.getElementById("vote").addEventListener("click", () => {
  document.getElementById("poll-result").textContent = "Спасибо! Голос учтён ✓";
});