let loggedInUser = "Неизвестный"; // Переменная для хранения информации о пользователе
let darkMode = false; // Переменная для отслеживания состояния темы
let users = []; // Массив для хранения пользователей
let chats = {}; // Объект для хранения чатов

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

// Функция для загрузки пользователей и чатов из локального хранилища
function loadUsers() {
    const usersData = localStorage.getItem('users');
    if (usersData) {
        users = JSON.parse(usersData);
    }
    const chatsData = localStorage.getItem('chats');
    if (chatsData) {
        chats = JSON.parse(chatsData);
        updateChatList();
    }
}

// Функция для сохранения данных пользователей и чатов в локальное хранилище
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveChats() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

// Функция для обновления списка чатов
function updateChatList() {
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = ''; // Очищаем список
    for (const user in chats) {
        const li = document.createElement('li');
        li.textContent = `${user} (чат)`;
        li.addEventListener('click', function() {
            openChat(user);
        });
        chatList.appendChild(li);
    }
}

// Функция для открытия чата
function openChat(user) {
    const chat = chats[user] || [];
    document.getElementById('chatMessages').innerHTML = chat.map(msg => `<p>${msg}</p>`).join('');
    document.getElementById('chat').style.display = 'block';
}

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
    document.getElementById('registerForm').reset();
});

// Обработка входа
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Поиск пользователя по имени и паролю
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        loggedInUser = user.firstName || user.username; // Сохраняем имя пользователя
        document.getElementById('profileSection').style.display = 'block'; // Показываем профиль
    } else {
        alert('Неправильное имя пользователя или пароль.');
    }
    document.getElementById('loginForm').reset(); // Очищаем форму
});

// Обработка отправки предложения
document.getElementById('skillForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы и обновление страницы

    // Получаем значения из формы
    const skill = document.getElementById('skill').value;
    const exchange = document.getElementById('exchange').value;

    // Создаем новый элемент списка
    const li = document.createElement('li');
    li.innerHTML = `
        ${loggedInUser} предоставляет: ${skill} - в обмен на: ${exchange}
        <div class="button-container">
            <button class="reply-button">Откликнуться</button>
            <button class="delete-button">Дальше</button>
        </div>
    `;

    // Добавляем элемент в список
    document.getElementById('skillList').appendChild(li);

    // Очищаем форму
    document.getElementById('skillForm').reset();

    // Обработчик для кнопки "Откликнуться"
    li.querySelector('.reply-button').addEventListener('click', function() {
        document.getElementById('chat').style.display = 'block';
        document.getElementById('chatMessages').innerHTML += `<p>${loggedInUser}: Откликнулся на объявление</p>`;
    });

    // Обработчик для кнопки "Дальше"
    li.querySelector('.delete-button').addEventListener('click', function() {
        li.style.opacity = '0'; // Начинаем анимацию исчезновения
        setTimeout(() => {
            li.remove(); // Удаляем элемент после анимации
        }, 300); // Время должно совпадать с CSS-анимацией
    });
});

// Обработка отправки сообщения в чате
document.getElementById('sendMessage').addEventListener('click', function() {
    const message = document.getElementById('chatInput').value;
    if (message) {
        const currentChatUser = loggedInUser; // Замените на реального пользователя
        if (!chats[currentChatUser]) {
            chats[currentChatUser] = [];
        }
        chats[currentChatUser].push(`${loggedInUser}: ${message}`);
        saveChats();
        document.getElementById('chatMessages').innerHTML += `<p>${loggedInUser}: ${message}</p>`;
        document.getElementById('chatInput').value = ''; // Очищаем поле ввода
    }
});

// Обработка закрытия чата
document.getElementById('closeChat').addEventListener('click', function() {
    document.getElementById('chat').style.display = 'none';
});

// Обработка открытия и закрытия выпадающего меню
document.getElementById('optionsMenu').addEventListener('click', function() {
    const dropdown = document.getElementById('dropdownContent');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Закрытие выпадающего меню при клике вне его
window.addEventListener('click', function(event) {
    if (!event.target.matches('.options-menu')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
            }
        }
    }
});

// Обработчики действий
document.getElementById('pinChat').addEventListener('click', function() {
    alert('Чат закреплен!');
});

document.getElementById('deleteChat').addEventListener('click', function() {
    alert('Чат удален!');
});

document.getElementById('blockChat').addEventListener('click', function() {
    alert('Чат заблокирован!');
});

// Загрузка пользователей и чатов при запуске
loadUsers();