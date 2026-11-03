(function () {
    const modalHtml = `
        <div class="modal search-modal" id="searchModal" aria-hidden="true">
            <div class="modal__panel search-modal__panel" role="dialog" aria-modal="true" aria-labelledby="searchTitle">
                <button type="button" class="modal__close" data-search-close aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Поиск по сайту</p>
                <h2 class="modal__title" id="searchTitle" style="margin-bottom:14px;">Что вы ищете?</h2>
                <div class="search-modal__field">
                    <span class="search-modal__icon">⌕</span>
                    <input type="text" id="searchInput" class="search-modal__input" placeholder="Например: профориентация, цены, документы…" autocomplete="off" aria-label="Поисковый запрос">
                </div>
                <div class="search-modal__hint">
                    <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd> — открыть поиск · <kbd>Esc</kbd> — закрыть
                </div>
                <div class="search-modal__results" id="searchResults"></div>
            </div>
        </div>
    `;

    const normalize = (s) => (s || '').toLowerCase().replace(/ё/g, 'е').replace(/[«»"'`]/g, '').trim();

    const buildIndex = () => {
        const d = window.ObrazStore.load();
        const items = [];
        const add = (title, text, url, group) => {
            items.push({ title, text: (text || '').slice(0, 300), url, group, norm: normalize(title + ' ' + text) });
        };

        add('Главная', d.hero.text, 'index.html#hero', 'Страница');
        add(d.hero.cardTitle, d.hero.cardText, 'index.html#hero', 'Результат работы');
        add(d.about.title, d.about.paragraphs.join(' '), 'index.html#about', 'О себе');
        d.directions.items.forEach(it => add(it.title, it.text + ' ' + it.result, 'index.html#directions', 'Направления'));
        d.services.items.forEach(it => add(it.title, it.text, 'index.html#services', 'Услуги'));
        d.process.steps.forEach(it => add(it.title, it.text, 'index.html#process', 'Как проходит'));
        d.faq.items.forEach(it => add(it.q, it.a, 'index.html#faq', 'FAQ'));
        add(d.contact.title, d.contact.text, 'index.html#contact', 'Контакты');

        add('О себе', d.aboutPage.text + ' ' + d.aboutPage.bioText + ' ' + d.aboutPage.approachText, 'about.html', 'Страница');
        d.aboutPage.values.forEach(v => add(v.title, v.text, 'about.html', 'Ценности'));
        d.aboutPage.list.forEach((it, i) => add('О себе — пункт ' + (i + 1), it, 'about.html', 'Опыт'));

        d.journalPage.items.forEach(it => add(it.title, it.excerpt, 'journal.html', 'Журнал'));
        d.reviewsPage.items.forEach(it => add('Отзыв — ' + it.name, it.text, 'reviews.html', 'Отзывы'));
        d.documentsPage.docs.forEach(doc => add(doc.title, doc.subtitle, 'documents.html', 'Документы'));
        d.documentsPage.requisites.forEach(r => add(r.title, r.text, 'documents.html', 'Реквизиты'));

        add('Записаться на консультацию', 'Оставить заявку, обсудить запрос', 'index.html#contact', 'Контакты');

        return items;
    };

    const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const highlight = (text, query) => {
        if (!query) return escapeHtml(text);
        const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return escapeHtml(text).replace(new RegExp(q, 'gi'), (m) => `<mark>${m}</mark>`);
    };

    const renderResults = (results, query) => {
        const box = document.getElementById('searchResults');
        if (!box) return;
        if (!query.trim()) {
            box.innerHTML = `
                <div class="search-modal__empty">
                    <p class="search-modal__empty-title">Быстрый доступ</p>
                    <div class="search-modal__chips">
                        <button class="search-chip" data-q="профориентация">Профориентация</button>
                        <button class="search-chip" data-q="подросток">Подростки</button>
                        <button class="search-chip" data-q="студент">Студенты</button>
                        <button class="search-chip" data-q="выгорание">Выгорание</button>
                        <button class="search-chip" data-q="документы">Документы</button>
                        <button class="search-chip" data-q="отзывы">Отзывы</button>
                        <button class="search-chip" data-q="контакты">Контакты</button>
                    </div>
                </div>
            `;
            return;
        }
        if (results.length === 0) {
            box.innerHTML = `<p class="search-modal__empty-title">Ничего не найдено. Попробуйте другой запрос.</p>`;
            return;
        }
        box.innerHTML = results.map(r => `
            <a href="${r.url}" class="search-result" data-search-goto>
                <div class="search-result__head">
                    <span class="search-result__group">${escapeHtml(r.group)}</span>
                    <span class="search-result__title">${highlight(r.title, query)}</span>
                </div>
                <p class="search-result__text">${highlight(r.text, query)}</p>
            </a>
        `).join('');
    };

    const setBodyLock = (locked) => {
        document.body.style.overflow = locked ? 'hidden' : '';
    };

    const openSearch = () => {
        const m = document.getElementById('searchModal');
        if (!m) return;
        m.classList.add('is-open');
        m.setAttribute('aria-hidden', 'false');
        setBodyLock(true);
        const input = document.getElementById('searchInput');
        setTimeout(() => { if (input) { input.focus(); input.select(); } }, 60);
        renderResults([], '');
    };
    const closeSearch = () => {
        const m = document.getElementById('searchModal');
        if (!m) return;
        m.classList.remove('is-open');
        m.setAttribute('aria-hidden', 'true');
        setBodyLock(false);
        const input = document.getElementById('searchInput');
        if (input) input.value = '';
    };

    const doSearch = (query) => {
        const index = buildIndex();
        const q = normalize(query);
        if (!q) return renderResults([], query);
        const words = q.split(/\s+/).filter(Boolean);
        const scored = index.map(it => {
            let score = 0;
            words.forEach(w => {
                if (it.norm.includes(w)) score += 1;
                if (normalize(it.title).includes(w)) score += 2;
            });
            return { ...it, score };
        }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 12);
        renderResults(scored, query);
    };

    const mount = () => {
        if (!document.getElementById('searchModal')) {
            const wrap = document.createElement('div');
            wrap.innerHTML = modalHtml;
            document.body.appendChild(wrap);

            const input = document.getElementById('searchInput');
            input.addEventListener('input', (e) => doSearch(e.target.value));
        }

        if (!document.getElementById('searchTrigger')) {
            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.id = 'searchTrigger';
            trigger.className = 'search-trigger';
            trigger.setAttribute('aria-label', 'Открыть поиск');
            trigger.innerHTML = `<span class="search-trigger__icon">⌕</span><span class="search-trigger__label">Поиск</span><kbd class="search-trigger__kbd">⌘K</kbd>`;
            trigger.addEventListener('click', openSearch);

            const headerInner = document.querySelector('.header__inner');
            if (headerInner) {
                const burger = headerInner.querySelector('.burger');
                if (burger) headerInner.insertBefore(trigger, burger);
                else headerInner.appendChild(trigger);
            }
        }

        if (!window.__obrazSearchDelegation) {
            window.__obrazSearchDelegation = true;
            document.addEventListener('click', (e) => {
                const t = e.target;
                if (!(t instanceof Element)) return;

                if (t.closest('[data-search-close]')) {
                    e.preventDefault();
                    closeSearch();
                    return;
                }
                if (t.id === 'searchModal') {
                    closeSearch();
                    return;
                }
                const chip = t.closest('.search-chip');
                if (chip && chip.dataset.q) {
                    e.preventDefault();
                    const inp = document.getElementById('searchInput');
                    if (inp) { inp.value = chip.dataset.q; inp.focus(); doSearch(chip.dataset.q); }
                    return;
                }
                const link = t.closest('[data-search-goto]');
                if (link) closeSearch();
            });

            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
                    e.preventDefault();
                    const m = document.getElementById('searchModal');
                    if (m && m.classList.contains('is-open')) closeSearch();
                    else openSearch();
                }
                if (e.key === 'Escape') {
                    const m = document.getElementById('searchModal');
                    if (m && m.classList.contains('is-open')) closeSearch();
                }
            });
        }
    };

    document.addEventListener('DOMContentLoaded', mount);
})();
