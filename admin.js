(function () {
    const USER = 'admin';
    const PASS = 'obraz2025';
    const SESSION_KEY = 'obraz_admin_session';
    
    // Твои данные для GitHub
    const TOKEN = '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';
    const OWNER = 'glubkov2020-netizen';
    const REPO = '-_-';
    const FILE = 'data.json';

    // Загружаем Octokit (библиотеку GitHub) прямо в фоне
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/octokit@3/dist/octokit.min.js';
    document.head.appendChild(script);

    const ui = `
        <button class="admin-trigger" id="adminTrigger" aria-label="Служебный вход">⚙</button>
        <div class="modal" id="loginModal" aria-hidden="true">
            <div class="modal__panel" role="dialog">
                <button class="modal__close" data-close="loginModal" aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Служебный вход</p>
                <h2 class="modal__title">Вход в админ-панель</h2>
                <form class="modal__form" id="loginForm">
                    <label class="form__label">Логин<input type="text" name="login" class="form__input" value="admin" required></label>
                    <label class="form__label">Пароль<input type="password" name="password" class="form__input" value="obraz2025" required></label>
                    <p class="modal__error" id="loginError">Неверный логин или пароль</p>
                    <button type="submit" class="btn btn--primary btn--full">Войти</button>
                </form>
            </div>
        </div>
        <div class="modal" id="adminModal" aria-hidden="true">
            <div class="modal__panel modal__panel--wide" role="dialog">
                <button class="modal__close" data-close="adminModal" aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Админ-панель</p>
                <h2 class="modal__title">Управление сайтом (Синхронизация с GitHub)</h2>
                <div style="margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
                    <span id="syncStatus" style="font-size:13px; color:var(--color-muted);">Готово к работе</span>
                    <button class="btn btn--ghost" id="adminLogout">Выйти</button>
                </div>
                
                <div class="admin-shell" style="min-height: 300px;">
                    <div class="admin-form-grid">
                        <label class="form__label full">Главный заголовок (Hero)<textarea id="edit-hero-title" class="form__input" rows="2"></textarea></label>
                        <label class="form__label full">Подзаголовок<textarea id="edit-hero-text" class="form__input" rows="3"></textarea></label>
                        <label class="form__label full">Текст кнопки<input type="text" id="edit-hero-btn" class="form__input"></label>
                        <div class="full" style="display:flex;gap:10px;justify-content:flex-end; margin-top:20px;">
                            <button type="button" class="btn btn--primary" id="saveBtn">Сохранить и отправить в GitHub</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const $ = (id) => document.getElementById(id);
    const open = (id) => { const m = $(id); if (m) { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); } };
    const close = (id) => { const m = $(id); if (m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); } };

    const mount = () => {
        if (document.getElementById('adminTrigger')) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = ui;
        document.body.appendChild(wrap);

        // Заполняем поля текущими данными
        const d = window.ObrazStore.load();
        if ($('edit-hero-title')) $('edit-hero-title').value = d.hero.title || '';
        if ($('edit-hero-text')) $('edit-hero-text').value = d.hero.text || '';
        if ($('edit-hero-btn')) $('edit-hero-btn').value = d.hero.primaryBtn || '';

        $('adminTrigger').addEventListener('click', () => {
            if (sessionStorage.getItem(SESSION_KEY) === '1') open('adminModal');
            else open('loginModal');
        });

        document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => close(b.dataset.close)));

        $('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            if (fd.get('login') === USER && fd.get('password') === PASS) {
                sessionStorage.setItem(SESSION_KEY, '1');
                close('loginModal');
                open('adminModal');
            } else {
                $('loginError').classList.add('is-visible');
            }
        });

        $('adminLogout').addEventListener('click', () => { sessionStorage.removeItem(SESSION_KEY); close('adminModal'); });

        $('saveBtn').addEventListener('click', async () => {
            const btn = $('saveBtn');
            const status = $('syncStatus');
            btn.textContent = 'Отправка в GitHub...';
            btn.disabled = true;
            status.textContent = 'Обновление...';

            // 1. Обновляем данные локально
            const currentData = window.ObrazStore.load();
            currentData.hero.title = $('edit-hero-title').value;
            currentData.hero.text = $('edit-hero-text').value;
            currentData.hero.primaryBtn = $('edit-hero-btn').value;
            
            // Принудительно сохраняем локально
            localStorage.setItem('obraz_data_v1', JSON.stringify(currentData));
            window.dispatchEvent(new CustomEvent('obraz:data-changed', { detail: currentData }));

            // 2. Отправляем в GitHub
            if (typeof Octokit === 'undefined') {
                alert('Библиотека GitHub еще загружается. Подождите 2 секунды и нажмите снова.');
                btn.textContent = 'Сохранить и отправить в GitHub';
                btn.disabled = false;
                return;
            }

            try {
                const octokit = new Octokit({ auth: TOKEN });

                // Получаем SHA файла data.json (он нужен для обновления)
                let sha = null;
                try {
                    const { data } = await octokit.rest.repos.getContent({ owner: OWNER, repo: REPO, path: FILE });
                    sha = data.sha;
                } catch (e) {
                    console.log('Файл data.json не найден, создаем новый.');
                }

                // Отправляем новый файл
                await octokit.rest.repos.createOrUpdateFileContents({
                    owner: OWNER,
                    repo: REPO,
                    path: FILE,
                    message: 'Обновление данных через админку',
                    content: btoa(unescape(encodeURIComponent(JSON.stringify(currentData, null, 2)))),
                    sha: sha
                });

                btn.textContent = 'Успешно сохранено!';
                status.textContent = 'Данные улетели на GitHub 🚀';
                setTimeout(() => {
                    btn.textContent = 'Сохранить и отправить в GitHub';
                    status.textContent = 'Готово к работе';
                }, 3000);
            } catch (err) {
                console.error(err);
                alert('Ошибка GitHub: ' + err.message);
                btn.textContent = 'Сохранить и отправить в GitHub';
                status.textContent = 'Ошибка синхронизации';
            }
            btn.disabled = false;
        });
    };

    document.addEventListener('DOMContentLoaded', mount);
})();
