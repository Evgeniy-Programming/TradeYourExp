let loggedInUser = null; // Переменная для хранения информации о пользователе
let darkMode = false; // Переменная для отслеживания состояния темы
// Функция для переключения темы
function toggleTheme() {
    darkMode = !darkMode; // Изменяем состояние темы
    document.body.classList.toggle('dark-mode', darkMode);
    document.querySelector('.sidebar').classList.toggle('dark-mode', darkMode);
    document.querySelector('.main-content').classList.toggle('dark-mode', darkMode);
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.toggle('dark-mode', darkMode));
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.classList.toggle('dark-mode', darkMode));
}

// Обработка смены темы
document.getElementById('toggleThemeButton').addEventListener('click', toggleTheme);
document.getElementById('skillForm').addEventListener('submit', function(event) {
event.preventDefault(); // Предотвращаем отправку формы
// Получаем значения из формы
const skill = document.getElementById('skill').value;
const exchange = document.getElementById('exchange').value;
// Создаем новый элемент списка
const li = document.createElement('li');
li.textContent = `Я предлагаю: ${skill} в обмен на: ${exchange}`;
// Добавляем элемент в список
document.getElementById('skillList').appendChild(li);
// Очищаем форму
document.getElementById('skillForm').reset();
});

let users = []; // массив для хранения пользователей

// Функция для загрузки данных из локального хранилища
function loadUsers() {
const usersData = localStorage.getItem('users');
if (usersData) {
    users = JSON.parse(usersData);
}
}

// Функция для сохранения данных пользователей в локальное хранилище
function saveUsers() {
localStorage.setItem('users', JSON.stringify(users));
}

// Загрузка пользователей при запуске
loadUsers();

// Обработка регистрации
document.getElementById('registerForm').addEventListener('submit', function(event) {
event.preventDefault();
const username = document.getElementById('username').value;
const email = document.getElementById('registerEmail').value;
const password = document.getElementById('registerPassword').value;
const firstName = document.getElementById('firstName').value;
const lastName = document.getElementById('lastName').value;
const socialLink = document.getElementById('socialLink').value;

// Проверка на существование пользователя с таким же именем
if (users.find(user => user.username === username)) {
    alert('Пользователь с таким именем уже существует.');
    return;
}

// Создание нового пользователя и добавление в массив
const newUser = { username, email, password, firstName, lastName, socialLink };
users.push(newUser);
saveUsers();
alert('Регистрация завершена успешно!');

// Очищаем форму
document.getElementById('registerForm').reset();
});

// Обработка входа
document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault();
const email = document.getElementById('loginEmail').value;
const password = document.getElementById('loginPassword').value;

// Поиск пользователя по имени и паролю
const user = users.find(user => user.email === email && user.password === password);
console.log(users);
if (user) {
    const userData = JSON.stringify(user, null, 2);
    console.log(userData)
    document.getElementById('profileSection').style.display = 'block'; // Показываем профиль
} else {
    alert('Неправильное имя пользователя или пароль.');
}


document.getElementById('loginForm').reset(); // Очищаем форму
});        // Обработка изменения профиля
document.getElementById('profileForm').addEventListener('submit', function(event) {
event.preventDefault();
const newUsername = document.getElementById('newUsername').value;
const newEmail = document.getElementById('newEmail').value;
const newPassword = document.getElementById('newPassword').value;

// Здесь можно добавить логику для обновления данных пользователя
console.log('Обновление профиля:', { newUsername, newEmail, newPassword });

// Очищаем форму
document.getElementById('profileForm').reset();
});
