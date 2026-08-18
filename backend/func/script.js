let currentUser = sessionStorage.getItem('user_name') || null;
let isDark = false;
let pendingSkill = null;

window.onload = () => {
    initTheme();
    updateUI();
    loadSkills();
    if (sessionStorage.getItem('is_auth')) {
        showProfile(currentUser);
    }
};

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
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    if (themeBtn) {
        themeBtn.classList.toggle('active');
        themeBtn.textContent = isDark ? '🌞 Светлая тема' : '🌙 Темная тема';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('toggleThemeButton');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});

// Подгрузка UI
function updateUI() {
    const isAuth = sessionStorage.getItem('is_auth') === 'true';
    const guestZone = document.getElementById('guest-zone');
    const userZone = document.getElementById('user-zone');
    
    if (guestZone) guestZone.style.display = isAuth ? 'none' : 'block';
    if (userZone) userZone.style.display = isAuth ? 'block' : 'none';
    
    if(isAuth && document.getElementById('welcomeUser')) {
        document.getElementById('welcomeUser').textContent = `Привет, ${sessionStorage.getItem('user_name')}!`;
    }
}

function showProfile(name) {
    const profile = document.getElementById('profileSection');
    if (profile) {
        profile.style.display = 'block';
        document.getElementById('welcomeUser').textContent = `Привет, ${name}!`;
    }
}

function logout() {
    sessionStorage.clear();
    location.reload();
}

let currentCategory = 'all';
let currentSearch = '';

async function loadSkills(category = 'all', search = '') {
    try {
        let url = '/api/v1/skills';
        
        if (search && search.trim() !== '') {
            url = `/api/v1/skills/filter/${encodeURIComponent(search.trim())}`;
        } 
        else if (category && category !== 'all') {
            url = `/api/v1/skills/${encodeURIComponent(category)}`;
        }
        
        const res = await fetch(url);
        
        if (!res.ok) {
            if (res.status === 404) {
                showEmptyResult();
                return;
            }
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        const list = document.getElementById('skillList');
        if (!list) return;
        list.innerHTML = '';

        if (data && Array.isArray(data) && data.length > 0) {
            for (const item of data) {
                const li = document.createElement('li');
                
                let descMedia = '';
                try {
                    const descRes = await fetch(`/api/v1/skills/desc/${item.id}`);
                    if (descRes.ok) {
                        const desc = await descRes.json();
                        if (desc && desc.description) {
                            descMedia = `<br><small>${desc.media || ''}</small>`;
                        }
                    }
                } catch(e) { }
                
                li.innerHTML = `
                    <strong>${item.username}</strong>: ${item.skill} ↔ ${item.exchange}
                    ${descMedia}
                    <div class="button-container">
                        <button onclick="openChat('${item.username}')">Откликнуться</button>
                        <button onclick="openDetails(${item.id})">Подробнее</button>
                    </div>
                `;
                list.appendChild(li);
            }
        } else {
            showEmptyResult();
        }
    } catch (e) { 
        console.error("Ошибка загрузки навыков:", e);
        showEmptyResult();
    }
}

function showEmptyResult() {
    const list = document.getElementById('skillList');
    if (list) {
        list.innerHTML = '<li style="text-align: center; padding: 20px;">Ничего не найдено</li>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.skill-search-categories button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category || 'all';
            currentCategory = category;
            
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                currentSearch = '';
            }
            
            loadSkills(category, '');
        });
    });

    // Обработчик кнопки "Найти"
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            currentSearch = searchText;
            
            // Сбрасываем активную категорию
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            const allCategoryBtn = document.querySelector('.skill-search-categories button[data-category="all"]');
            if (allCategoryBtn) {
                allCategoryBtn.classList.add('active');
                currentCategory = 'all';
            }
            
            // Загружаем навыки по поиску
            loadSkills('all', searchText);
        });

        // Поиск по Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Загружаем все навыки при старте
    loadSkills('all', '');
});

// ===== ДЕТАЛИ НАВЫКА =====
async function openDetails(skillId) {
    try {
        const res = await fetch(`/api/v1/skills/desc/${skillId}`);
        if (!res.ok) throw new Error('Описание не найдено');
        
        const data = await res.json();
        
        let modal = document.getElementById('detailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'detailsModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close" onclick="closeDetails()">&times;</span>
                    <h3>Подробное описание запроса</h3>
                    <div id="modalBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalBody').innerHTML = `
            <p><strong>Навык:</strong> ${data.skill || ''}</p>
            <p><strong>Обмен:</strong> ${data.exchange || ''}</p>
            <p><strong>Описание:</strong> ${data.description || 'Нет описания'}</p>
            <p><strong>Связь:</strong> ${data.media || ''}</p>
            <p><small>Добавлено: ${data.created_at ? new Date(data.created_at).toLocaleString() : ''}</small></p>
        `;
        
        modal.style.display = 'block';
    } catch (e) {
        console.error("Ошибка загрузки деталей:", e);
        alert("Не удалось загрузить подробное описание");
    }
}

function closeDetails() {
    const modal = document.getElementById('detailsModal');
    if (modal) modal.style.display = 'none';
}

// ===== ЧАТ =====
function openChat(user) {
    const chat = document.getElementById('chat');
    if (chat) {
        chat.style.display = 'block';
        const messages = document.getElementById('chatMessages');
        if (messages) messages.innerHTML += `<p><i>Чат с ${user} открыт</i></p>`;
    }
}

document.getElementById('closeChat')?.addEventListener('click', () => {
    document.getElementById('chat').style.display = 'none';
});

// ===== РЕГИСТРАЦИЯ =====
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
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

// ===== ВХОД =====
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/api/v1/login', {
        method: 'POST',
        body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        const user = await res.json();
        sessionStorage.setItem('is_auth', 'true');
        sessionStorage.setItem('user_id', user.id);
        sessionStorage.setItem('user_name', user.username);
        currentUser = user.username;
        updateUI();
        showProfile(currentUser);
    } else { 
        alert("Неверный логин или пароль"); 
    }
});

document.getElementById('skillForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem('is_auth')) return alert("Войдите в систему");
    
    pendingSkill = {
        username: sessionStorage.getItem('user_name'),
        skill: document.getElementById('skill').value,
        exchange: document.getElementById('exchange').value
    };
    
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'block';
    e.target.reset();
});

// Переключение поля контакта
function toggleContactField() {
    const type = document.getElementById('contactType')?.value;
    const container = document.getElementById('contactValueContainer');
    if (container) {
        container.style.display = (type === 'site') ? 'none' : 'block';
    }
}

// Показать превью
function showPreview() {
    if (!pendingSkill) return;
    
    const desc = document.getElementById('detailDescription')?.value || '';
    const contactType = document.getElementById('contactType')?.value || 'site';
    const contactValue = document.getElementById('contactValue')?.value || '';
    
    let contactText = '';
    if (contactType !== 'site' && contactValue) {
        contactText = `<small>Связь: ${contactType} — @${contactValue}</small>`;
    }
    
    const preview = `
        <strong>${pendingSkill.username}</strong>: ${pendingSkill.skill} ↔ ${pendingSkill.exchange}
        ${contactText ? `<br><small>${contactText}</small>` : ''}
        ${desc}
        <br><small style="color:#666;">[Предварительный просмотр]</small>
    `;
    
    const previewContent = document.getElementById('previewContent');
    const previewModal = document.getElementById('previewModal');
    if (previewContent) previewContent.innerHTML = preview;
    if (previewModal) previewModal.style.display = 'block';
}

// Опубликовать навык
async function publishSkill() {
    if (!pendingSkill) return;
    
    const payload = {
        username: pendingSkill.username,
        skill: pendingSkill.skill,
        exchange: pendingSkill.exchange,
        description: document.getElementById('detailDescription')?.value || '',
        contact_type: document.getElementById('contactType')?.value || 'site',
        contact_value: document.getElementById('contactValue')?.value || ''
    };
    
    try {
        // Если все доп. поля пустые — используем старый эндпоинт
        const hasExtendedData = payload.description !== "" || 
                       (payload.contact_type !== "site" && payload.contact_value !== "");

        if (!hasExtendedData) {
            await fetch('/api/v1/skills', {
                method: 'POST',
                body: JSON.stringify({
                    username: payload.username,
                    skill: payload.skill,
                    exchange: payload.exchange
                }),
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            await fetch('/api/v1/skills/with-desc', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        closeDetailModal();
        loadSkills();
        alert("Запрос опубликован.");
    } catch (e) {
        console.error("Ошибка публикации:", e);
        alert("Не удалось опубликовать запрос");
    }
}

// Закрытие модалок
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
    pendingSkill = null;
}

function closePreviewModal() {
    const modal = document.getElementById('previewModal');
    if (modal) modal.style.display = 'none';
}

// Закрытие по клику вне модалки
window.onclick = (e) => {
    if (e.target.id === 'detailModal') closeDetailModal();
    if (e.target.id === 'previewModal') closePreviewModal();
    if (e.target.id === 'detailsModal') closeDetails();
};

// ===== ОБНОВЛЕНИЕ ПРОФИЛЯ =====
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = sessionStorage.getItem('user_id');
    if (!id) return;
    
    const res = await fetch(`/api/v1/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            username: document.getElementById('newUsername')?.value,
            email: document.getElementById('newEmail')?.value,
            password: document.getElementById('newPassword')?.value
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        alert("Данные обновлены!");
        const newName = document.getElementById('newUsername')?.value;
        if(newName) sessionStorage.setItem('user_name', newName);
        updateUI();
    } else {
        alert("Ошибка обновления");
    }
});

// Выход
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.clear();
    updateUI();
});