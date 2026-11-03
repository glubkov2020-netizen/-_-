(function () {
    const USER = 'admin';
    const PASS = 'obraz2025';
    const SESSION_KEY = 'obraz_admin_session';

    const ui = `
        <button class="admin-trigger" id="adminTrigger" aria-label="Служебный вход">⚙</button>
        <div class="modal" id="loginModal" aria-hidden="true">
            <div class="modal__panel" role="dialog" aria-modal="true">
                <button class="modal__close" data-close="loginModal" aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Служебный вход</p>
                <h2 class="modal__title">Вход в админ-панель</h2>
                <form class="modal__form" id="loginForm">
                    <label class="form__label">Логин<input type="text" name="login" class="form__input" autocomplete="username" required></label>
                    <label class="form__label">Пароль<input type="password" name="password" class="form__input" autocomplete="current-password" required></label>
                    <p class="modal__error" id="loginError">Неверный логин или пароль</p>
                    <button type="submit" class="btn btn--primary btn--full">Войти</button>
                    <p class="modal__hint">Демо-доступ: admin / obraz2025</p>
                </form>
            </div>
        </div>
        <div class="modal" id="adminModal" aria-hidden="true">
            <div class="modal__panel modal__panel--wide" role="dialog" aria-modal="true">
                <button class="modal__close" data-close="adminModal" aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Админ-панель</p>
                <h2 class="modal__title">Управление сайтом</h2>
                <div class="admin-shell">
                    <div class="admin-shell__head">
                        <div class="admin-shell__tabs" id="adminTabs">
                            <button class="admin-tab is-active" data-pane="hero">Главный экран</button>
                            <button class="admin-tab" data-pane="about">О себе</button>
                            <button class="admin-tab" data-pane="directions">Направления</button>
                            <button class="admin-tab" data-pane="services">Услуги</button>
                            <button class="admin-tab" data-pane="process">Процесс</button>
                            <button class="admin-tab" data-pane="faq">FAQ</button>
                            <button class="admin-tab" data-pane="journal">Журнал</button>
                            <button class="admin-tab" data-pane="reviews">Отзывы</button>
                            <button class="admin-tab" data-pane="contact">Контакты</button>
                            <button class="admin-tab" data-pane="stats">Статистика</button>
                            <button class="admin-tab" data-pane="files">Файл данных</button>
                        </div>
                        <button class="btn btn--ghost" id="adminLogout">Выйти</button>
                    </div>

                    <div class="admin-pane is-active" data-pane="hero">
                        <div class="admin-form-grid">
                            <label class="form__label full">Плашка сверху<input type="text" id="hero-eyebrow" class="form__input"></label>
                            <label class="form__label full">Заголовок (можно &lt;br&gt;)<textarea id="hero-title" class="form__input" rows="2"></textarea></label>
                            <label class="form__label full">Подзаголовок<textarea id="hero-text" class="form__input" rows="3"></textarea></label>
                            <label class="form__label">Кнопка 1<input type="text" id="hero-primary" class="form__input"></label>
                            <label class="form__label">Кнопка 2<input type="text" id="hero-secondary" class="form__input"></label>
                            <label class="form__label full">Бейджи (через запятую)<input type="text" id="hero-badges" class="form__input"></label>
                            <label class="form__label full">Фото (путь)<input type="text" id="hero-photo" class="form__input" placeholder="assets/images/aaa.jpg"></label>
                            <label class="form__label">Метка на карточке<input type="text" id="hero-card-label" class="form__input"></label>
                            <label class="form__label">Заголовок карточки<input type="text" id="hero-card-title" class="form__input"></label>
                            <label class="form__label full">Текст карточки<textarea id="hero-card-text" class="form__input" rows="2"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--primary" data-save="hero">Сохранить главный экран</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="about">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="about-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="about-title" class="form__input"></label>
                            <label class="form__label full">Абзацы (каждый с новой строки)<textarea id="about-paragraphs" class="form__input" rows="4"></textarea></label>
                            <label class="form__label full">Статистика (num | label, каждая с новой строки)<textarea id="about-stats" class="form__input" rows="3"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--primary" data-save="about">Сохранить блок «О себе»</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="directions">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="dir-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="dir-title" class="form__input"></label>
                            <label class="form__label full">Подзаголовок<textarea id="dir-sub" class="form__input" rows="2"></textarea></label>
                        </div>
                        <div class="admin-list" id="dirList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="dir-edit-index" value="">
                            <label class="form__label">Заголовок карточки<input type="text" id="dir-item-title" class="form__input"></label>
                            <label class="form__label">Результат<input type="text" id="dir-item-result" class="form__input"></label>
                            <label class="form__label full">Текст<textarea id="dir-item-text" class="form__input" rows="2"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="dir">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="dir">Добавить карточку</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="services">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="svc-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="svc-title" class="form__input"></label>
                        </div>
                        <div class="admin-list" id="svcList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="svc-edit-index" value="">
                            <label class="form__label">Тег<input type="text" id="svc-item-tag" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="svc-item-title" class="form__input"></label>
                            <label class="form__label full">Текст<textarea id="svc-item-text" class="form__input" rows="2"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="svc">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="svc">Добавить услугу</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="process">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="proc-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="proc-title" class="form__input"></label>
                            <label class="form__label full">Подзаголовок<textarea id="proc-sub" class="form__input" rows="2"></textarea></label>
                        </div>
                        <div class="admin-list" id="procList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="proc-edit-index" value="">
                            <label class="form__label">Номер<input type="text" id="proc-item-num" class="form__input" placeholder="01"></label>
                            <label class="form__label">Заголовок<input type="text" id="proc-item-title" class="form__input"></label>
                            <label class="form__label full">Текст<textarea id="proc-item-text" class="form__input" rows="2"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="proc">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="proc">Добавить шаг</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="faq">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="faq-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="faq-title" class="form__input"></label>
                        </div>
                        <div class="admin-list" id="faqList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="faq-edit-index" value="">
                            <label class="form__label full">Вопрос<input type="text" id="faq-item-q" class="form__input"></label>
                            <label class="form__label full">Ответ<textarea id="faq-item-a" class="form__input" rows="3"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="faq">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="faq">Добавить вопрос</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="journal">
                        <div class="admin-list" id="jrnList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="jrn-edit-index" value="">
                            <label class="form__label">Дата<input type="text" id="jrn-item-date" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="jrn-item-title" class="form__input"></label>
                            <label class="form__label full">Краткое описание<textarea id="jrn-item-excerpt" class="form__input" rows="2"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="jrn">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="jrn">Добавить материал</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="reviews">
                        <div class="admin-list" id="revList"></div>
                        <div class="admin-form-grid" style="margin-top:16px;">
                            <input type="hidden" id="rev-edit-index" value="">
                            <label class="form__label">Имя<input type="text" id="rev-item-name" class="form__input"></label>
                            <label class="form__label">Кто<input type="text" id="rev-item-role" class="form__input"></label>
                            <label class="form__label">Оценка (1–5)<input type="number" min="1" max="5" id="rev-item-rating" class="form__input"></label>
                            <label class="form__label full">Текст<textarea id="rev-item-text" class="form__input" rows="3"></textarea></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--ghost" data-reset="rev">Сброс</button>
                                <button type="button" class="btn btn--primary" data-add="rev">Добавить отзыв</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="contact">
                        <div class="admin-form-grid">
                            <label class="form__label">Плашка<input type="text" id="ct-eyebrow" class="form__input"></label>
                            <label class="form__label">Заголовок<input type="text" id="ct-title" class="form__input"></label>
                            <label class="form__label full">Текст<textarea id="ct-text" class="form__input" rows="2"></textarea></label>
                            <label class="form__label">E-mail<input type="text" id="ct-email" class="form__input"></label>
                            <label class="form__label">Telegram (URL)<input type="text" id="ct-telegram" class="form__input"></label>
                            <label class="form__label full">WhatsApp (URL)<input type="text" id="ct-whatsapp" class="form__input"></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;">
                                <button type="button" class="btn btn--primary" data-save="contact">Сохранить контакты</button>
                            </div>
                        </div>
                    </div>

                    <div class="admin-pane" data-pane="stats">
                        <div class="admin-form-grid">
                            <label class="form__label full">Код GoatCounter (поддомен без .goatcounter.com)<input type="text" id="stats-code" class="form__input" placeholder="например: obraz"></label>
                            <div class="full" style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
                                <a href="https://www.goatcounter.com/signup" target="_blank" rel="noopener" class="btn btn--ghost">Регистрация GoatCounter</a>
                                <button type="button" class="btn btn--primary" id="statsSave">Подключить</button>
                            </div>
                        </div>
                        <div id="statsBlock" style="margin-top:20px;">
                            <p style="font-size:14px;color:var(--color-muted);">Подключите GoatCounter — бесплатный счётчик без cookie. Статистика появится здесь после первого визита.</p>
                        </div>
                    </div>
                    <div class="admin-pane" data-pane="files">
                        <p style="font-size:14px;color:var(--color-muted);margin-bottom:16px;">Данные хранятся в вашем браузере. Чтобы перенести правки на другое устройство — скачайте файл и загрузите его там.</p>
                        <div style="display:flex;gap:10px;flex-wrap:wrap;">
                            <button type="button" class="btn btn--primary" id="dataExport">Скачать data.json</button>
                            <label class="btn btn--ghost" style="cursor:pointer;">Загрузить data.json<input type="file" id="dataImport" accept="application/json" hidden></label>
                            <button type="button" class="btn btn--ghost" id="dataReset" style="color:var(--color-danger);">Сбросить к демо-данным</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const $ = (id) => document.getElementById(id);

    const open = (id) => { const m = $(id); if (m) { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); } };
    const close = (id) => { const m = $(id); if (m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); } };

    const fillForms = (d) => {
        $('hero-eyebrow').value = d.hero.eyebrow;
        $('hero-title').value = d.hero.title;
        $('hero-text').value = d.hero.text;
        $('hero-primary').value = d.hero.primaryBtn;
        $('hero-secondary').value = d.hero.secondaryBtn;
        $('hero-badges').value = d.hero.badges.join(', ');
        $('hero-photo').value = d.hero.photo;
        $('hero-card-label').value = d.hero.cardLabel;
        $('hero-card-title').value = d.hero.cardTitle;
        $('hero-card-text').value = d.hero.cardText;

        $('about-eyebrow').value = d.about.eyebrow;
        $('about-title').value = d.about.title;
        $('about-paragraphs').value = d.about.paragraphs.join('\n');
        $('about-stats').value = d.about.stats.map(s => `${s.num} | ${s.label}`).join('\n');

        $('dir-eyebrow').value = d.directions.eyebrow;
        $('dir-title').value = d.directions.title;
        $('dir-sub').value = d.directions.sub;

        $('svc-eyebrow').value = d.services.eyebrow;
        $('svc-title').value = d.services.title;

        $('proc-eyebrow').value = d.process.eyebrow;
        $('proc-title').value = d.process.title;
        $('proc-sub').value = d.process.sub;

        $('faq-eyebrow').value = d.faq.eyebrow;
        $('faq-title').value = d.faq.title;

        $('ct-eyebrow').value = d.contact.eyebrow;
        $('ct-title').value = d.contact.title;
        $('ct-text').value = d.contact.text;
        $('ct-email').value = d.site.email;
        $('ct-telegram').value = d.site.telegram;
        $('ct-whatsapp').value = d.site.whatsapp;
    };

    const renderLists = (d) => {
        const listDirs = $('dirList');
        if (listDirs) listDirs.innerHTML = d.directions.items.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.title}</div><div class="admin-row__meta">${it.result}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-edit-dir="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-dir="${i}">Удалить</button>
                </div>
            </div>`).join('');

        const listSvc = $('svcList');
        if (listSvc) listSvc.innerHTML = d.services.items.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.title}</div><div class="admin-row__meta">${it.tag}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-edit-svc="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-svc="${i}">Удалить</button>
                </div>
            </div>`).join('');

        const listProc = $('procList');
        if (listProc) listProc.innerHTML = d.process.steps.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.num} ${it.title}</div><div class="admin-row__meta">${it.text}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-edit-proc="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-proc="${i}">Удалить</button>
                </div>
            </div>`).join('');

        const listFaq = $('faqList');
        if (listFaq) listFaq.innerHTML = d.faq.items.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.q}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-edit-faq="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-faq="${i}">Удалить</button>
                </div>
            </div>`).join('');

        const listJrn = $('jrnList');
        if (listJrn) listJrn.innerHTML = d.journalPage.items.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.title}</div><div class="admin-row__meta">${it.date}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-edit-jrn="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-jrn="${i}">Удалить</button>
                </div>
            </div>`).join('');

        const listRev = $('revList');
        if (listRev) listRev.innerHTML = d.reviewsPage.items.map((it, i) => `
            <div class="admin-row">
                <div><div class="admin-row__title">${it.name} — ${'★'.repeat(it.rating)}</div><div class="admin-row__meta">${it.role} · ${it.status === 'published' ? 'опубликован' : 'на модерации'}</div></div>
                <div class="admin-row__actions">
                    <button class="admin-row__btn" data-toggle-rev="${i}">${it.status === 'published' ? 'Снять' : 'Опубликовать'}</button>
                    <button class="admin-row__btn" data-edit-rev="${i}">Изменить</button>
                    <button class="admin-row__btn admin-row__btn--danger" data-del-rev="${i}">Удалить</button>
                </div>
            </div>`).join('');
    };

    let refreshRaf = null;
    let lastSnapshot = '';
    const refreshAll = () => {
        if (refreshRaf) cancelAnimationFrame(refreshRaf);
        refreshRaf = requestAnimationFrame(() => {
            refreshRaf = null;
            const d = window.ObrazStore.load();
            const snapshot = JSON.stringify(d);
            if (snapshot === lastSnapshot) return;
            lastSnapshot = snapshot;
            const activePane = document.querySelector('.admin-pane.is-active');
            const scrollTop = activePane ? activePane.scrollTop : 0;
            fillForms(d);
            renderLists(d);
            const newActive = document.querySelector('.admin-pane.is-active');
            if (newActive) newActive.scrollTop = scrollTop;
        });
    };

    const save = async (mutator) => {
        const d = window.ObrazStore.load();
        mutator(d);
        lastSnapshot = '';
        window.ObrazStore.save(d); // Сохраняет в браузере

        // === ОТПРАВЛЯЕМ В GITHUB ===
        try {
            const octokit = new Octokit({
                auth: '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' // Твой токен
            });

            let sha = null;
            try {
                // Пытаемся узнать текущий SHA файла (если он есть)
                const { data } = await octokit.rest.repos.getContent({
                    owner: 'glubkov2020-netizen',
                    repo: '-_-',
                    path: 'data.json'
                });
                sha = data.sha;
            } catch (e) {
                // Файла еще нет, это нормально
            }

            // Отправляем новые данные
            await octokit.rest.repos.createOrUpdateFileContents({
                owner: 'glubkov2020-netizen',
                repo: '-_-',
                path: 'data.json',
                message: 'Обновление через админку',
                content: btoa(unescape(encodeURIComponent(JSON.stringify(d, null, 2)))),
                sha: sha
            });
            
            console.log('УСПЕХ! Файл сохранен в GitHub.');
            alert('Данные успешно сохранены в GitHub!');
        } catch (error) {
            console.error('ОШИБКА GITHUB:', error);
            alert('Ошибка сохранения в GitHub: ' + error.message);
        }
    };

    const wire = () => {
        $('adminTrigger').addEventListener('click', () => {
            if (sessionStorage.getItem(SESSION_KEY) === '1') open('adminModal');
            else open('loginModal');
        });
        document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => close(b.dataset.close)));
        document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', (e) => { if (e.target === m) close(m.id); }));

        $('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const login = (fd.get('login') || '').toString().trim();
            const password = (fd.get('password') || '').toString();
            const err = $('loginError');
            if (login === USER && password === PASS) {
                sessionStorage.setItem(SESSION_KEY, '1');
                err.classList.remove('is-visible');
                e.target.reset();
                close('loginModal');
                refreshAll();
                open('adminModal');
            } else {
                err.classList.add('is-visible');
            }
        });

        $('adminLogout').addEventListener('click', () => {
            sessionStorage.removeItem(SESSION_KEY);
            close('adminModal');
            lastSnapshot = '';
        });

        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.classList.contains('is-active')) return;
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('is-active'));
                document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('is-active'));
                tab.classList.add('is-active');
                const pane = document.querySelector(`.admin-pane[data-pane="${tab.dataset.pane}"]`);
                if (pane) pane.classList.add('is-active');
                if (pane) pane.scrollTop = 0;
                tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
            });
        });

        document.querySelectorAll('[data-save="hero"]').forEach(b => b.addEventListener('click', () => save(d => {
            d.hero.eyebrow = $('hero-eyebrow').value;
            d.hero.title = $('hero-title').value;
            d.hero.text = $('hero-text').value;
            d.hero.primaryBtn = $('hero-primary').value;
            d.hero.secondaryBtn = $('hero-secondary').value;
            d.hero.badges = $('hero-badges').value.split(',').map(s => s.trim()).filter(Boolean);
            d.hero.photo = $('hero-photo').value || 'assets/images/aaa.jpg';
            d.hero.cardLabel = $('hero-card-label').value;
            d.hero.cardTitle = $('hero-card-title').value;
            d.hero.cardText = $('hero-card-text').value;
        })));
        document.querySelectorAll('[data-save="about"]').forEach(b => b.addEventListener('click', () => save(d => {
            d.about.eyebrow = $('about-eyebrow').value;
            d.about.title = $('about-title').value;
            d.about.paragraphs = $('about-paragraphs').value.split('\n').map(s => s.trim()).filter(Boolean);
            d.about.stats = $('about-stats').value.split('\n').map(line => {
                const [num, ...rest] = line.split('|');
                return { num: (num || '').trim(), label: rest.join('|').trim() };
            }).filter(s => s.num || s.label);
        })));
        document.querySelectorAll('[data-save="contact"]').forEach(b => b.addEventListener('click', () => save(d => {
            d.contact.eyebrow = $('ct-eyebrow').value;
            d.contact.title = $('ct-title').value;
            d.contact.text = $('ct-text').value;
            d.site.email = $('ct-email').value;
            d.site.telegram = $('ct-telegram').value;
            d.site.whatsapp = $('ct-whatsapp').value;
        })));

        document.querySelectorAll('[data-add="dir"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('dir-edit-index').value;
            const item = { title: $('dir-item-title').value, text: $('dir-item-text').value, result: $('dir-item-result').value };
            if (idx !== '') d.directions.items[Number(idx)] = item;
            else d.directions.items.push(item);
            $('dir-edit-index').value = '';
            $('dir-item-title').value = ''; $('dir-item-text').value = ''; $('dir-item-result').value = '';
        })));
        document.querySelectorAll('[data-add="svc"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('svc-edit-index').value;
            const item = { tag: $('svc-item-tag').value, title: $('svc-item-title').value, text: $('svc-item-text').value };
            if (idx !== '') d.services.items[Number(idx)] = item;
            else d.services.items.push(item);
            $('svc-edit-index').value = '';
            $('svc-item-tag').value = ''; $('svc-item-title').value = ''; $('svc-item-text').value = '';
        })));
        document.querySelectorAll('[data-add="proc"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('proc-edit-index').value;
            const item = { num: $('proc-item-num').value, title: $('proc-item-title').value, text: $('proc-item-text').value };
            if (idx !== '') d.process.steps[Number(idx)] = item;
            else d.process.steps.push(item);
            $('proc-edit-index').value = '';
            $('proc-item-num').value = ''; $('proc-item-title').value = ''; $('proc-item-text').value = '';
        })));
        document.querySelectorAll('[data-add="faq"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('faq-edit-index').value;
            const item = { q: $('faq-item-q').value, a: $('faq-item-a').value };
            if (idx !== '') d.faq.items[Number(idx)] = item;
            else d.faq.items.push(item);
            $('faq-edit-index').value = '';
            $('faq-item-q').value = ''; $('faq-item-a').value = '';
        })));
        document.querySelectorAll('[data-add="jrn"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('jrn-edit-index').value;
            const item = { date: $('jrn-item-date').value || 'Без даты', title: $('jrn-item-title').value, excerpt: $('jrn-item-excerpt').value };
            if (idx !== '') d.journalPage.items[Number(idx)] = item;
            else d.journalPage.items.unshift(item);
            $('jrn-edit-index').value = '';
            $('jrn-item-date').value = ''; $('jrn-item-title').value = ''; $('jrn-item-excerpt').value = '';
        })));
        document.querySelectorAll('[data-add="rev"]').forEach(b => b.addEventListener('click', () => save(d => {
            const idx = $('rev-edit-index').value;
            const item = {
                name: $('rev-item-name').value,
                role: $('rev-item-role').value,
                rating: Math.min(5, Math.max(1, Number($('rev-item-rating').value) || 5)),
                text: $('rev-item-text').value,
                status: 'published'
            };
            if (idx !== '') d.reviewsPage.items[Number(idx)] = item;
            else d.reviewsPage.items.push(item);
            $('rev-edit-index').value = '';
            $('rev-item-name').value = ''; $('rev-item-role').value = ''; $('rev-item-rating').value = 5; $('rev-item-text').value = '';
        })));

        document.querySelectorAll('[data-reset="dir"]').forEach(b => b.addEventListener('click', () => { $('dir-edit-index').value = ''; }));
        document.querySelectorAll('[data-reset="svc"]').forEach(b => b.addEventListener('click', () => { $('svc-edit-index').value = ''; }));
        document.querySelectorAll('[data-reset="proc"]').forEach(b => b.addEventListener('click', () => { $('proc-edit-index').value = ''; }));
        document.querySelectorAll('[data-reset="faq"]').forEach(b => b.addEventListener('click', () => { $('faq-edit-index').value = ''; }));
        document.querySelectorAll('[data-reset="jrn"]').forEach(b => b.addEventListener('click', () => { $('jrn-edit-index').value = ''; }));
        document.querySelectorAll('[data-reset="rev"]').forEach(b => b.addEventListener('click', () => { $('rev-edit-index').value = ''; }));

        document.addEventListener('click', (e) => {
            const t = e.target;
            if (!(t instanceof HTMLElement)) return;
            if (t.closest('.admin-tab')) return;

            if (t.dataset.editDir !== undefined) {
                const idx = Number(t.dataset.editDir);
                const it = window.ObrazStore.load().directions.items[idx];
                $('dir-edit-index').value = idx;
                $('dir-item-title').value = it.title;
                $('dir-item-text').value = it.text;
                $('dir-item-result').value = it.result;
            }
            if (t.dataset.delDir !== undefined) save(d => { d.directions.items.splice(Number(t.dataset.delDir), 1); });

            if (t.dataset.editSvc !== undefined) {
                const idx = Number(t.dataset.editSvc);
                const it = window.ObrazStore.load().services.items[idx];
                $('svc-edit-index').value = idx;
                $('svc-item-tag').value = it.tag;
                $('svc-item-title').value = it.title;
                $('svc-item-text').value = it.text;
            }
            if (t.dataset.delSvc !== undefined) save(d => { d.services.items.splice(Number(t.dataset.delSvc), 1); });

            if (t.dataset.editProc !== undefined) {
                const idx = Number(t.dataset.editProc);
                const it = window.ObrazStore.load().process.steps[idx];
                $('proc-edit-index').value = idx;
                $('proc-item-num').value = it.num;
                $('proc-item-title').value = it.title;
                $('proc-item-text').value = it.text;
            }
            if (t.dataset.delProc !== undefined) save(d => { d.process.steps.splice(Number(t.dataset.delProc), 1); });

            if (t.dataset.editFaq !== undefined) {
                const idx = Number(t.dataset.editFaq);
                const it = window.ObrazStore.load().faq.items[idx];
                $('faq-edit-index').value = idx;
                $('faq-item-q').value = it.q;
                $('faq-item-a').value = it.a;
            }
            if (t.dataset.delFaq !== undefined) save(d => { d.faq.items.splice(Number(t.dataset.delFaq), 1); });

            if (t.dataset.editJrn !== undefined) {
                const idx = Number(t.dataset.editJrn);
                const it = window.ObrazStore.load().journalPage.items[idx];
                $('jrn-edit-index').value = idx;
                $('jrn-item-date').value = it.date;
                $('jrn-item-title').value = it.title;
                $('jrn-item-excerpt').value = it.excerpt;
            }
            if (t.dataset.delJrn !== undefined) save(d => { d.journalPage.items.splice(Number(t.dataset.delJrn), 1); });

            if (t.dataset.editRev !== undefined) {
                const idx = Number(t.dataset.editRev);
                const it = window.ObrazStore.load().reviewsPage.items[idx];
                $('rev-edit-index').value = idx;
                $('rev-item-name').value = it.name;
                $('rev-item-role').value = it.role;
                $('rev-item-rating').value = it.rating;
                $('rev-item-text').value = it.text;
            }
            if (t.dataset.toggleRev !== undefined) save(d => {
                const idx = Number(t.dataset.toggleRev);
                const it = d.reviewsPage.items[idx];
                it.status = it.status === 'published' ? 'pending' : 'published';
            });
            if (t.dataset.delRev !== undefined) save(d => { d.reviewsPage.items.splice(Number(t.dataset.delRev), 1); });
        });

        const statsCode = $('stats-code');
        const statsSave = $('statsSave');
        const statsBlock = $('statsBlock');
        if (statsSave && statsCode && statsBlock && window.ObrazAnalytics) {
            const currentCode = window.ObrazAnalytics.getCode();
            if (currentCode) statsCode.value = currentCode;
            const refreshStats = async () => {
                const code = window.ObrazAnalytics.getCode();
                if (!code) {
                    statsBlock.innerHTML = '<p style="font-size:14px;color:var(--color-muted);">Счётчик не подключён. Введите код выше и нажмите «Подключить».</p>';
                    return;
                }
                statsBlock.innerHTML = '<p style="font-size:14px;color:var(--color-muted);">Загружаем данные…</p>';
                const data = await window.ObrazAnalytics.fetchStats(code);
                if (!data) {
                    statsBlock.innerHTML = `<p style="font-size:14px;color:var(--color-muted);">Данные появятся после первого визита на сайт. Счётчик уже установлен (код: <strong>${code}</strong>).</p>`;
                    return;
                }
                statsBlock.innerHTML = `<pre style="font-size:12px;background:var(--color-bg);padding:16px;border-radius:12px;overflow:auto;max-height:300px;">${JSON.stringify(data, null, 2)}</pre>`;
            };
            statsSave.addEventListener('click', () => {
                window.ObrazAnalytics.setCode(statsCode.value.trim());
                refreshStats();
            });
            refreshStats();
        }

        $('dataExport').addEventListener('click', () => {
            const blob = new Blob([window.ObrazStore.exportJson()], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'data.json';
            a.click();
            URL.revokeObjectURL(a.href);
        });
        $('dataImport').addEventListener('change', (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    window.ObrazStore.importJson(reader.result);
                    refreshAll();
                    alert('Данные загружены.');
                } catch (err) {
                    alert('Не удалось загрузить файл: ' + err.message);
                }
            };
            reader.readAsText(f);
            e.target.value = '';
        });
        $('dataReset').addEventListener('click', () => {
            if (confirm('Сбросить все данные к демо-версии?')) {
                window.ObrazStore.reset();
                refreshAll();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { close('loginModal'); close('adminModal'); close('pdfModal'); }
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        const wrap = document.createElement('div');
        wrap.innerHTML = ui;
        document.body.appendChild(wrap);
        refreshAll();
        wire();
    });
})();
