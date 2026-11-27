// ===== ЗДЕСЬ МЕНЯЕМ НОВОСТИ =====
// id: короткое имя латиницей (понадобится для страницы «Подробнее»)
// folder: название папки внутри папки news
// date: дата в формате ГОД-МЕСЯЦ-ДЕНЬ (по ней новости сами сортируются, свежие выше)
// photos: названия файлов с фото в этой папке, первое показывается на главной
// videos: пока оставь пустым [], позже подключим на странице «Подробнее»
const news = [
  { id: "judo", folder: "judo", title: "Наш ученик взял бронзу по карате",
    date: "2026-11-26", text: "Ученик нашей школы занял III место на первенстве Москвы по сито-рю.",
    photos: ["1.jpg"], videos: [] },
  { id: "kindness-day", folder: "kindness day", title: "День доброты в нашей школе",
    date: "2026-11-13", text: "Ученицы раскрасили большой плакат «Маленькие дела — большое добро».",
    photos: ["1.jpg"], videos: [] },
  { id: "swimming", folder: "swimming tournament", title: "Серебро на турнире по плаванию",
    date: "2026-11-22", text: "Наш пловец занял II место на дистанции 800 метров на турнире «Область» в Черноголовке.",
    photos: ["1.jpg"], videos: [] },
  { id: "tournament-cinema", folder: "tournament cinema", title: "Победа на фестивале «Телемания»",
    date: "2026-11-10", text: "Фильм ученика нашей школы занял I место в номинации «Телемания Юниоры».",
    photos: ["1.jpg"], videos: [] },
  { id: "visiting-students", folder: "visiting students", title: "Наши на фестивале «Голоса детства»",
    date: "2026-11-22", text: "Ребята из нашей школы побывали на торжественном награждении лауреатов.",
    photos: ["1.jpg"], videos: [] },
  { id: "day-open-doors", folder: "day open doors", title: "Старшеклассникам: день открытых дверей",
    date: "2026-11-21", text: "Военно-воздушная академия в Воронеже пригласила будущих абитуриентов и их родителей.",
    photos: ["1.jpg"], videos: [] }
];
// =================================

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// Если фото не нашлось, пробуем то же имя с другим расширением
function loadPhoto(img, folder, file) {
  const name = file.replace(/\.[^.]+$/, "");
  const variants = [file];
  ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "jpg.jpg"].forEach(ext => variants.push(name + "." + ext));
  let i = 0;
  const next = () => {
    if (i >= variants.length) {
      console.warn("Не найдено фото в папке news/" + folder);
      img.remove();
      return;
    }
    img.src = encodeURI("news/" + folder + "/" + variants[i++]);
  };
  img.onerror = next;
  next();
}

function renderNews() {
  const box = document.getElementById("news-list");
  if (!box) return;
  const sorted = news.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  box.innerHTML = "";
  sorted.forEach(n => {
    const a = document.createElement("a");
    a.className = "news-item";
    a.href = "news.html?id=" + n.id;
    a.innerHTML = `
      <div class="news-img"><img alt=""></div>
      <div class="news-body">
        <div class="news-title">${n.title}</div>
        <div class="news-date">${formatDate(n.date)}</div>
        <div class="news-text">${n.text}</div>
      </div>`;
    const img = a.querySelector("img");
    img.style.objectPosition = "center 20%";   // чтобы не обрезались лица
    loadPhoto(img, n.folder, n.photos[0]);
    box.appendChild(a);
  });
}

renderNews();