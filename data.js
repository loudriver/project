// ===== ЗДЕСЬ МЕНЯЕМ ДАННЫЕ =====
const classSize = 2556;    // число в счётчике «Учеников»
const teachers = 63;       // число в счётчике «Учителей»
const cooks = 8;           // число в счётчике «Поваров»
const guards = 4;          // число в счётчике «Охранников»

// group: "ученик", "учитель" или "сотрудник"
// info: что показывать под именем (класс, должность)
// status: "На месте", "Удалённо", "Болеет", "Отпуск" или "Выходной"
// photo: путь к картинке, если фото нет — оставь пустые кавычки ""
const people = [
  { name: "Максим Орлов", info: "8 «Б» класс", group: "ученик", status: "Болеет", photo: "avatars/maxim.png" },
  { name: "Аня Смирнова", info: "5 «А» класс", group: "ученик", status: "На месте", photo: "avatars/anya.png" },
  { name: "Катя Лебедева", info: "6 «Б» класс", group: "ученик", status: "Удалённо", photo: "avatars/katya.png" },
  { name: "Антон Волков", info: "7 «Б» класс", group: "ученик", status: "На месте", photo: "avatars/anton.png" },
  { name: "Дима Балякин", info: "10 «Б» класс", group: "ученик", status: "Отпуск", photo: "avatars/dima.png" },
  { name: "Артём Соколов", info: "9 «А» класс", group: "ученик", status: "На месте", photo: "avatars/artem.png" },
  { name: "Полина Кузнецова", info: "7 «А» класс", group: "ученик", status: "На месте", photo: "avatars/polina.jpg" },
  { name: "Дарья Лисицына", info: "11 «А» класс", group: "ученик", status: "Удалённо", photo: "avatars/darya.jpg" },
  { name: "Егор Новиков", info: "6 «А» класс", group: "ученик", status: "На месте", photo: "avatars/egor.jpg" },
  { name: "Даниил Попов", info: "8 «А» класс", group: "ученик", status: "На месте", photo: "avatars/daniil.webp" },
  { name: "Кирилл Зайцев", info: "10 «А» класс", group: "ученик", status: "На месте", photo: "avatars/kirill.webp" },
  { name: "Тимофей Фёдоров", info: "7 «В» класс", group: "ученик", status: "Удалённо", photo: "avatars/timofey.webp" },
  { name: "Ярослав Беляев", info: "8 «В» класс", group: "ученик", status: "На месте", photo: "avatars/yaroslav.webp" },
  { name: "Глеб Маслов", info: "5 «Г» класс", group: "ученик", status: "Удалённо", photo: "avatars/gleb.webp" },
  { name: "Савелий Егоров", info: "9 «Г» класс", group: "ученик", status: "На месте", photo: "avatars/saveliy.webp" },
  { name: "Илья Захаров", info: "8 «Г» класс", group: "ученик", status: "На месте", photo: "avatars/ilya.webp" },
  { name: "Милана Ковалёва", info: "6 «В» класс", group: "ученик", status: "Отпуск", photo: "avatars/milana.webp" },
  { name: "Алиса Васильева", info: "5 «Б» класс", group: "ученик", status: "Болеет", photo: "avatars/alisa.webp" },
  { name: "Роман Киселёв", info: "11 «Б» класс", group: "ученик", status: "На месте", photo: "avatars/roman.webp" },
  { name: "Никита Громов", info: "10 «В» класс", group: "ученик", status: "На месте", photo: "avatars/nikita.webp" },
  { name: "Владислав Рябов", info: "8 «Б» класс", group: "ученик", status: "Отпуск", photo: "avatars/vladislav.webp" },
  { name: "Ксения Леонтьева", info: "10 «Г» класс", group: "ученик", status: "На месте", photo: "avatars/ksenia.webp" },
  { name: "Арсений Тихонов", info: "9 «В» класс", group: "ученик", status: "На месте", photo: "avatars/arseniy.webp" },
  { name: "Демид Воронов", info: "9 «Б» класс", group: "ученик", status: "На месте", photo: "avatars/demid.webp" },
  { name: "Алёна Сорокина", info: "11 «В» класс", group: "ученик", status: "На месте", photo: "avatars/alena.webp" },
  { name: "Варвара Никитина", info: "7 «Г» класс", group: "ученик", status: "Болеет", photo: "avatars/varvara.webp" },
  { name: "Диана Борисова", info: "6 «Г» класс", group: "ученик", status: "На месте", photo: "avatars/diana.webp" },
  { name: "Фёдор Макаров", info: "5 «В» класс", group: "ученик", status: "На месте", photo: "avatars/fedor.webp" },
  { name: "Матвей Залупайкин", info: "10 «Б» класс", group: "ученик", status: "На месте", photo: "avatars/matvey.webp" },
  { name: "Сидоров Олег Иванович", info: "Учитель математики", group: "учитель", status: "На месте", photo: "" },
  { name: "Королёва Наталья Андреевна", info: "Русский язык и литература", group: "учитель", status: "На месте", photo: "" },
  { name: "Орлова Ирина Васильевна", info: "Учитель английского языка", group: "учитель", status: "Болеет", photo: "" },
  { name: "Фролов Павел Александрович", info: "Учитель физики", group: "учитель", status: "На месте", photo: "" },
  { name: "Никифорова Анна Сергеевна", info: "Учитель химии и биологии", group: "учитель", status: "Удалённо", photo: "" },
  { name: "Баранов Дмитрий Олегович", info: "Учитель истории", group: "учитель", status: "Выходной", photo: "" },
  { name: "Жукова Людмила Борисовна", info: "Учитель начальных классов", group: "учитель", status: "Отпуск", photo: "" },
  { name: "Прохоров Сергей Николаевич", info: "Учитель физкультуры", group: "учитель", status: "Выходной", photo: "" },
  { name: "Пономарёва Екатерина Юрьевна", info: "Учитель информатики", group: "учитель", status: "На месте", photo: "" },
  { name: "Иванова Мария Петровна", info: "Директор", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Кузьмин Андрей Сергеевич", info: "Заместитель директора", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Белова Ольга Николаевна", info: "Завуч по воспитательной работе", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Громова Татьяна Викторовна", info: "Секретарь", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Тарасова Елена Игоревна", info: "Школьный психолог", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Волкова Светлана Павловна", info: "Медсестра", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Мельникова Валентина Петровна", info: "Библиотекарь", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Лебедев Виктор Анатольевич", info: "Завхоз", group: "сотрудник", status: "Отпуск", photo: "" },
  { name: "Матвеева Галина Ивановна", info: "Повар", group: "сотрудник", status: "На месте", photo: "" },
  { name: "Ефимова Нина Степановна", info: "Повар", group: "сотрудник", status: "Болеет", photo: "" },
  { name: "Сомов Николай Петрович", info: "Охранник", group: "сотрудник", status: "Выходной", photo: "" },
  { name: "Зуев Алексей Дмитриевич", info: "Охранник", group: "сотрудник", status: "На месте", photo: "" }

];
// =================================

// Цвет точки для каждого статуса (не менять названия слева, иначе пропадёт точка)
const colors = { "На месте": "green", "Удалённо": "blue", "Болеет": "red", "Отпуск": "yellow", "Выходной": "gray" };