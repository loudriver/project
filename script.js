// ===== ЗДЕСЬ МЕНЯЕМ ДАННЫЕ =====
const classSize = 2556;    // число в счётчике «Учеников»
const teachers = 63;     // число в счётчике «Учителей»

const students = [
  { name: "Максим Орлов",  cls: "8 «Б» класс", status: "Болеет",   photo: "avatars/maxim.png" },
  { name: "Аня Смирнова",  cls: "5 «А» класс", status: "На месте", photo: "avatars/anya.png" },
  { name: "Катя Лебедева", cls: "6 «Б» класс", status: "Удалённо", photo: "avatars/katya.png" },
  { name: "Антон Волков",  cls: "7 «Б» класс", status: "На месте", photo: "avatars/anton.png" },
  { name: "Дима Балякин", cls: "10 «Б» класс", status: "Отпуск",   photo: "avatars/dima.png" }
];
// =================================

const colors = { "На месте": "green", "Удалённо": "blue", "Болеет": "red", "Отпуск": "yellow" };

try {
  const saved = JSON.parse(localStorage.getItem("svoi-statuses-v2") || "{}");
  students.forEach(s => { if (saved[s.name]) s.status = saved[s.name]; });
} catch (e) {}

function save() {
  try {
    const map = {};
    students.forEach(s => map[s.name] = s.status);
    localStorage.setItem("svoi-statuses-v2", JSON.stringify(map));
  } catch (e) {}
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  students.forEach((s, i) => {
    const options = Object.keys(colors)
      .map(st => `<option ${st === s.status ? "selected" : ""}>${st}</option>`).join("");
    const img = s.photo ? `<img src="${s.photo}" alt="" onerror="this.remove()">` : "";
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="avatar">${initials(s.name)}${img}</div>
      <div class="info"><div class="name">${s.name}</div><div class="class">${s.cls}</div></div>
      <div class="status"><span class="dot ${colors[s.status]}"></span>
        <select data-i="${i}">${options}</select></div>`;
    list.appendChild(row);
  });
  list.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", e => {
      students[e.target.dataset.i].status = e.target.value;
      save();
      render();
    });
  });
  document.getElementById("count-students").textContent = classSize;
  document.getElementById("count-teachers").textContent = teachers;
}

document.getElementById("vote").addEventListener("click", () => {
  document.getElementById("poll-result").textContent = "Спасибо! Голос учтён ✓";
});

render();