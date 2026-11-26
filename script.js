// Здесь логика сайта. Данные (люди, числа) лежат в data.js

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// Разметка одной строки человека (аватар, имя, статус)
function rowHTML(p) {
  const img = p.photo ? `<img src="${p.photo}" alt="" onerror="this.remove()">` : "";
  return `
    <div class="avatar">${initials(p.name)}${img}</div>
    <div class="info"><div class="name">${p.name}</div><div class="class">${p.info}</div></div>
    <div class="status"><span class="dot ${colors[p.status]}"></span>
      <span class="status-text">${p.status}</span></div>`;
}

// Список «Наши люди» и счётчики
function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  people.forEach(p => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = rowHTML(p);
    list.appendChild(row);
  });
  document.getElementById("count-students").textContent = classSize;
  document.getElementById("count-teachers").textContent = teachers;
  document.getElementById("count-cooks").textContent = cooks;
  document.getElementById("count-guards").textContent = guards;
}

// Блок «Случайный ученик» (каждый раз при загрузке страницы выбирается новый)
function renderRandom() {
  const pool = people.filter(p => p.group === "ученик");
  if (pool.length === 0) return;
  const p = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById("rnd-name").textContent = p.name;
  document.getElementById("rnd-info").textContent = p.info;
  const photo = document.getElementById("rnd-photo");
  if (p.photo) photo.src = p.photo; else photo.remove();
}

// ===== ПОИСК ПО ЛЮДЯМ =====
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

function closeSearch() {
  searchPanel.classList.remove("open");
}

searchBtn.addEventListener("click", e => {
  e.stopPropagation();
  searchPanel.classList.toggle("open");
  if (searchPanel.classList.contains("open")) {
    searchInput.focus();
    runSearch();
  }
});
searchInput.addEventListener("input", runSearch);
searchPanel.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", closeSearch);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSearch(); });

// ===== ОПРОС =====
document.getElementById("vote").addEventListener("click", () => {
  document.getElementById("poll-result").textContent = "Спасибо! Голос учтён ✓";
});

render();
renderRandom();