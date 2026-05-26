let currentUser = sessionStorage.getItem('user_name') || null;
let isDark = false;

// Загрузка данных при старте
window.onload = () => {
    loadSkills();
    if (sessionStorage.getItem('is_auth')) {
        showProfile(currentUser);
    }
};

// Функция загрузки навыков с бэкенда (Go API)
async function loadSkills() {
    try {
        const res = await fetch('/api/v1/skills');
        const data = await res.json();
        const list = document.getElementById('skillList');
        list.innerHTML = '';

        if (data) {
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.username}</strong>: ${item.skill} ↔ ${item.exchange}
                    <div class="button-container">
                        <button onclick="openChat('${item.username}')">Откликнуться</button>
                    </div>
                `;
                list.appendChild(li);
            });
        }
    } catch (e) { console.error("Ошибка загрузки навыков:", e); }
}

// Регистрация
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        username: document.getElementById('username').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        socialLink: document.getElementById('socialLink').value
    };

    const res = await fetch('/api/v1/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        alert("Успех! Теперь войдите.");
        e.target.reset();
    } else { alert("Ошибка регистрации"); }
});

// Вход
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    const res = await fetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        const user = await res.json();
        currentUser = user.username;
        sessionStorage.setItem('is_auth', 'true');
        sessionStorage.setItem('user_name', currentUser);
        showProfile(currentUser);
    } else { alert("Неверный логин или пароль"); }
});

// Добавление предложения
document.getElementById('skillForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem('is_auth')) return alert("Войдите в систему");

    const payload = {
        username: currentUser,
        skill: document.getElementById('skill').value,
        exchange: document.getElementById('exchange').value
    };

    await fetch('/api/v1/skills', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
    });
    
    e.target.reset();
    loadSkills();
});

function showProfile(name) {
    document.getElementById('profileSection').style.display = 'block';
    document.getElementById('welcomeUser').textContent = `Привет, ${name}!`;
}

function logout() {
    sessionStorage.clear();
    location.reload();
}

function openChat(user) {
    document.getElementById('chat').style.display = 'block';
    document.getElementById('chatMessages').innerHTML += `<p><i>Чат с ${user} открыт</i></p>`;
}

document.getElementById('closeChat').onclick = () => document.getElementById('chat').style.display = 'none';

document.getElementById('toggleThemeButton').onclick = () => {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
};

const updateUI = () => {
    const isAuth = sessionStorage.getItem('is_auth') === 'true';
    document.getElementById('guest-zone').style.display = isAuth ? 'none' : 'block';
    document.getElementById('user-zone').style.display = isAuth ? 'block' : 'none';
    if(isAuth) {
        document.getElementById('welcomeUser').textContent = `Привет, ${sessionStorage.getItem('user_name')}!`;
    }
};

// Вход
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        })
    });

    if (res.ok) {
        const user = await res.json();
        sessionStorage.setItem('is_auth', 'true');
        sessionStorage.setItem('user_id', user.id); // Сохраняем ID для PUT запросов
        sessionStorage.setItem('user_name', user.username);
        updateUI();
    } else {
        alert("Ошибка входа");
    }
});

// Обновление профиля
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = sessionStorage.getItem('user_id');
    const res = await fetch(`/api/v1/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            username: document.getElementById('newUsername').value,
            email: document.getElementById('newEmail').value,
            password: document.getElementById('newPassword').value
        })
    });

    if (res.ok) {
        alert("Данные обновлены!");
        const newName = document.getElementById('newUsername').value;
        if(newName) sessionStorage.setItem('user_name', newName);
        updateUI();
    }
});
// --- Логика темной темы ---

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeBtn = document.getElementById('toggleThemeButton');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if(themeBtn) themeBtn.classList.add('active');
    }
}

function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('toggleThemeButton');
    
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    // Сохраняем выбор
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Меняем вид кнопки
    if (themeBtn) {
        themeBtn.classList.toggle('active');
        themeBtn.textContent = isDark ? '🌞 Светлая тема' : '🌙 Темная тема';
    }
}

// Привязываем событие (вызывать в updateUI или DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    initTheme(); // Инициализация при загрузке
    
    const themeBtn = document.getElementById('toggleThemeButton');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    updateUI(); // Твоя существующая функция
});

// Выход
document.getElementById('logoutBtn').onclick = () => {
    sessionStorage.clear();
    updateUI();
};

document.addEventListener('DOMContentLoaded', updateUI);