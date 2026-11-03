(function () {
    const STORAGE_KEY = 'obraz_chat_state';

    const loadSaved = () => {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const p = JSON.parse(raw);
            if (!p || !Array.isArray(p.history)) return null;
            return p;
        } catch (e) { return null; }
    };

    const saved = loadSaved();
    const state = {
        open: false,
        greeted: saved ? !!saved.greeted : false,
        lastTopic: saved ? saved.lastTopic || null : null,
        userName: saved ? saved.userName || null : null,
        history: saved && Array.isArray(saved.history) ? saved.history : []
    };

    const persist = () => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                greeted: state.greeted,
                lastTopic: state.lastTopic,
                userName: state.userName,
                history: state.history
            }));
        } catch (e) {}
    };

    const clearSaved = () => {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    };

    const ICON_EXPAND = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v6h6M20 10V4h-6M14 4l6 6M10 20l-6-6"/></svg>';
    const ICON_COLLAPSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10V4h6M20 14v6h-6M14 20l6-6M10 4l-6 6"/></svg>';

    const html = `
        <button class="chat-launcher" id="chatLauncher" aria-label="Открыть помощника">
            <span class="chat-launcher__icon">💬</span>
            <span class="chat-launcher__pulse"></span>
            <span class="chat-launcher__badge">1</span>
        </button>
        <div class="chat-panel" id="chatPanel" aria-hidden="true" role="dialog" aria-label="Помощник по сайту">
            <div class="chat-panel__head">
                <div class="chat-panel__avatar">О</div>
                <div class="chat-panel__who">
                    <p class="chat-panel__name">Помощник по сайту</p>
                    <p class="chat-panel__status"><span class="chat-panel__dot"></span>онлайн · отвечает сразу</p>
                </div>
                <button type="button" class="chat-panel__expand" id="chatExpand" aria-label="Развернуть" title="Развернуть">${ICON_EXPAND}</button>
                <button type="button" class="chat-panel__reset" id="chatReset" aria-label="Начать заново" title="Начать заново">↺</button>
                <button type="button" class="chat-panel__close" id="chatClose" aria-label="Закрыть">×</button>
            </div>
            <div class="chat-panel__body" id="chatBody"></div>
            <div class="chat-panel__suggest" id="chatSuggest"></div>
            <form class="chat-panel__form" id="chatForm">
                <input type="text" id="chatInput" class="chat-panel__input" placeholder="Спросите что-нибудь…" autocomplete="off" aria-label="Сообщение" maxlength="300">
                <button type="submit" class="chat-panel__send" aria-label="Отправить">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </button>
            </form>
        </div>
    `;

    const data = () => window.ObrazStore.load();

    const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const norm = (s) => String(s || '')
        .toLowerCase()
        .replace(/ё/g, 'е')
        .replace(/умеете/g, 'умеешь')
        .replace(/можете/g, 'можешь')
        .replace(/знаете/g, 'знаешь')
        .replace(/хотите/g, 'хочешь')
        .replace(/будете/g, 'будешь')
        .replace(/делаете/g, 'делаешь')
        .replace(/расскажете/g, 'расскажешь')
        .replace(/подскажете/g, 'подскажешь')
        .replace(/поможете/g, 'поможешь')
        .replace(/ищете/g, 'ищешь')
        .replace(/смотрите/g, 'смотришь')
        .replace(/[^\wа-я\s]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const scrollToBottom = () => {
        const body = document.getElementById('chatBody');
        if (body) body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' });
    };

    const setSuggestions = (list) => {
        const box = document.getElementById('chatSuggest');
        if (!box) return;
        box.innerHTML = (list || []).map(s => `<button type="button" class="chat-suggest" data-suggest="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('');
    };

    const addMsg = (text, who = 'bot', actions = null, persistIt = true) => {
        const body = document.getElementById('chatBody');
        if (!body) return;
        const el = document.createElement('div');
        el.className = `chat-msg chat-msg--${who}`;
        const actionsHtml = (actions && actions.length)
            ? `<div class="chat-msg__actions">${actions.map(a => `<a href="${escapeHtml(a.href)}" class="chat-msg__action">${escapeHtml(a.label)}</a>`).join('')}</div>`
            : '';
        el.innerHTML = `<div class="chat-msg__bubble">${text}${actionsHtml}</div>`;
        body.appendChild(el);
        requestAnimationFrame(() => {
            el.classList.add('is-visible');
            scrollToBottom();
        });
        state.history.push({ who, text, actions: actions || null });
        if (persistIt) persist();
    };

    const showTyping = () => {
        const body = document.getElementById('chatBody');
        if (!body) return null;
        const el = document.createElement('div');
        el.className = 'chat-msg chat-msg--bot chat-typing';
        el.innerHTML = `<div class="chat-msg__bubble"><span></span><span></span><span></span></div>`;
        body.appendChild(el);
        requestAnimationFrame(() => { el.classList.add('is-visible'); scrollToBottom(); });
        return el;
    };
    const hideTyping = (el) => {
        if (!el) return;
        el.classList.remove('is-visible');
        setTimeout(() => el.remove(), 200);
    };

    const greetByTime = () => {
        const h = new Date().getHours();
        if (h < 6) return 'Доброй ночи';
        if (h < 12) return 'Доброе утро';
        if (h < 18) return 'Добрый день';
        return 'Добрый вечер';
    };

    const personalize = (base) => state.userName ? `${base}, ${state.userName}` : base;

    const suggestionsDefault = ['Что умеете?', 'Профориентация подростков', 'Сколько стоит?', 'Как проходит работа?', 'Документы', 'Как записаться?'];

    const scenarios = [
        {
            id: 'greet',
            weight: 10,
            match: (q) => /(^|\s)(привет|здравствуй|здравствуйте|добрый день|добрый вечер|доброе утро|доброй ночи|хай|приветствую)(\s|$)/.test(q),
            reply: () => ({ text: `${greetByTime()}! Я помощник по сайту. Расскажу про услуги, направления, документы и как записаться — просто спросите.`, suggest: suggestionsDefault })
        },
        {
            id: 'thanks',
            weight: 9,
            match: (q) => /(^|\s)(спасибо|благодарю|класс|круто|супер|отлично|спс|пасиб)(\s|$)/.test(q),
            reply: () => ({ text: 'Рад помочь! Если что-то ещё — спрашивайте.', suggest: ['Как записаться?', 'Документы', 'Отзывы'] })
        },
        {
            id: 'capabilities',
            weight: 9,
            match: (q) => q.includes('что умеешь') || q.includes('что можешь') || q.includes('чем помочь') || q.includes('что знаешь') || q.includes('возможности') || q.includes('функции') || q.includes('help') || q.includes('умеешь делать') || q.includes('можешь делать'),
            reply: () => ({
                text: 'Умею подсказывать по сайту:<br>• услуги и направления<br>• форматы и стоимость<br>• процесс работы<br>• документы и реквизиты<br>• отзывы и журнал<br>• как записаться и связаться',
                suggest: ['Услуги', 'Сколько стоит?', 'Документы', 'Как записаться?']
            })
        },
        {
            id: 'price',
            weight: 7,
            match: (q) => q.includes('цена') || q.includes('цены') || q.includes('цену') || q.includes('стоимость') || q.includes('стоит') || q.includes('стоят') || q.includes('тариф') || q.includes('прайс') || q.includes('оплат') || q.includes('рубл') || q.includes('руб') || q.includes('деньг') || q.includes('дорого') || q.includes('бюджет') || q.includes('почем') || q.includes('скока') || q.includes('сколько') || q.includes('price') || q.includes('cost'),
            reply: (d) => {
                const ctx = { teen: 'для подростков ', adult: 'для взрослых ', student: 'для студентов ' }[state.lastTopic] || '';
                return {
                    text: `Стоимость консультаций ${ctx}обсуждается индивидуально — зависит от запроса и формата. Оставьте заявку в разделе «Контакты», и я свяжусь, чтобы обсудить детали.`,
                    suggest: ['Как записаться?', 'Сколько встреч нужно?', 'Как проходит работа?']
                };
            }
        },
        {
            id: 'duration',
            weight: 8,
            match: (q) => q.includes('сколько встреч') || q.includes('сколько занятий') || q.includes('сколько сессий') || q.includes('как долго') || q.includes('сколько по времени') || q.includes('длительн') || q.includes('сколько нужно'),
            reply: (d) => {
                const faq = d.faq.items.find(f => norm(f.q).includes('сколько'));
                return { text: faq ? faq.a : 'Обычно 2–3 встречи для диагностики и стратегии, для подростков с выбором вуза — 4–6 встреч с сопровождением.', suggest: ['Как проходит работа?', 'Сколько стоит?', 'Как записаться?'] };
            }
        },
        {
            id: 'signup',
            weight: 8,
            match: (q) => q.includes('запис') || q.includes('заявк') || q.includes('консультац') || q.includes('связаться') || q.includes('хочу начать') || q.includes('оставить') || q.includes('как начать'),
            reply: (d) => ({
                text: 'Оставьте заявку в разделе «Контакты» — я свяжусь, чтобы обсудить запрос и формат.',
                actions: [{ label: 'Оставить заявку', href: 'index.html#contact' }, { label: 'Написать на e-mail', href: `mailto:${d.site.email}` }],
                suggest: ['Сколько стоит?', 'Как проходит работа?', 'Документы']
            })
        },
        {
            id: 'contacts',
            weight: 7,
            match: (q) => q.includes('контакт') || q.includes('почт') || q.includes('email') || q.includes('телеграм') || q.includes('telegram') || q.includes('tg') || q.includes('ватсап') || q.includes('whatsapp') || q.includes('написать') || q.includes('позвон') || q.includes('связь') || q.includes('номер'),
            reply: (d) => ({
                text: `Связаться можно так: e-mail ${d.site.email}, Telegram и WhatsApp — ссылки в футере сайта. Или оставьте заявку в форме «Записаться».`,
                actions: [{ label: 'Оставить заявку', href: 'index.html#contact' }],
                suggest: ['Как записаться?', 'Сколько стоит?']
            })
        },
        {
            id: 'docs',
            weight: 8,
            match: (q) => q.includes('документ') || q.includes('политик') || q.includes('конфиденц') || q.includes('соглашен') || q.includes('согласие') || q.includes('реквизит') || q.includes('юрид') || q.includes('оферт') || q.includes('лиценз'),
            reply: () => ({
                text: 'Все документы — на странице «Документы»: политика конфиденциальности, пользовательское соглашение, согласие на обработку данных и реквизиты. Открываются прямо на сайте.',
                actions: [{ label: 'Открыть документы', href: 'documents.html' }],
                suggest: ['Реквизиты', 'Политика конфиденциальности', 'Как записаться?']
            })
        },
        {
            id: 'reviews',
            weight: 7,
            match: (q) => q.includes('отзыв') || q.includes('мнен') || q.includes('рекоменд') || q.includes('клиент') || q.includes('говорят') || q.includes('рейтинг'),
            reply: () => ({
                text: 'Отзывы клиентов собраны в разделе «Отзывы». Там же можно оставить свой — после модерации он появится на сайте.',
                actions: [{ label: 'Открыть отзывы', href: 'reviews.html' }],
                suggest: ['Отзывы', 'Как записаться?']
            })
        },
        {
            id: 'journal',
            weight: 7,
            match: (q) => q.includes('журнал') || q.includes('новост') || q.includes('блог') || q.includes('стать') || q.includes('кейс') || q.includes('заметк') || q.includes('публикац'),
            reply: () => ({
                text: 'В разделе «Журнал» — заметки из практики: разборы кейсов, наблюдения о поступлении и работе с образом Я.',
                actions: [{ label: 'Открыть журнал', href: 'journal.html' }],
                suggest: ['Журнал', 'Профориентация подростков']
            })
        },
        {
            id: 'teen',
            weight: 6,
            match: (q) => q.includes('подрост') || q.includes('9 класс') || q.includes('10 класс') || q.includes('11 класс') || q.includes('егэ') || q.includes('огэ') || q.includes('школьник') || q.includes('старшекласс') || q.includes('выбор вуза') || q.includes('куда поступать') || q.includes('поступлен') || q.includes('абитуриент'),
            reply: (d) => {
                state.lastTopic = 'teen';
                const s = d.services.items.find(it => norm(it.tag).includes('подрост') || norm(it.title).includes('профориентац'));
                return {
                    text: s ? `<strong>${escapeHtml(s.title)}.</strong><br>${escapeHtml(s.text)}` : 'Для подростков — глубинная профориентация: анализ навыков, профпробы, стратегия поступления под баллы ЕГЭ/ОГЭ.',
                    suggest: ['Как проходит работа?', 'Сколько стоит?', 'Сколько встреч нужно?', 'Как записаться?']
                };
            }
        },
        {
            id: 'student',
            weight: 6,
            match: (q) => q.includes('студент') || q.includes('курс') || q.includes('вуз') || q.includes('универ') || q.includes('магистратур') || q.includes('корочк') || q.includes('перепоступ') || q.includes('специализац'),
            reply: (d) => {
                state.lastTopic = 'student';
                const s = d.services.items.find(it => norm(it.tag).includes('студент'));
                return {
                    text: s ? `<strong>${escapeHtml(s.title)}.</strong><br>${escapeHtml(s.text)}` : 'Для студентов — помощь выйти из тупика «корочка есть, а кем быть — непонятно»: анализ рынка труда, портфолио, резюме, стратегия смены специализации.',
                    suggest: ['Как проходит работа?', 'Сколько стоит?', 'Как записаться?']
                };
            }
        },
        {
            id: 'adult',
            weight: 6,
            match: (q) => q.includes('взросл') || q.includes('выгоран') || q.includes('смен карьер') || q.includes('карьер') || q.includes('перепрофил') || q.includes('сменить профессию') || q.includes('кризис') || q.includes('устал') || q.includes('junior') || q.includes('middle') || q.includes('senior'),
            reply: (d) => {
                state.lastTopic = 'adult';
                const s = d.services.items.find(it => norm(it.tag).includes('взросл') || norm(it.title).includes('выгорание'));
                return {
                    text: s ? `<strong>${escapeHtml(s.title)}.</strong><br>${escapeHtml(s.text)}` : 'Для взрослых — работа с выгоранием и сменой карьеры: аудит активов, маршрут перехода в новую сферу.',
                    suggest: ['Как проходит работа?', 'Сколько стоит?', 'Как записаться?']
                };
            }
        },
        {
            id: 'kids',
            weight: 6,
            match: (q) => q.includes('дети') || q.includes('ребенок') || q.includes('ребён') || q.includes('младш') || q.includes('7 11') || q.includes('начальная школа'),
            reply: (d) => {
                const dir = d.directions.items.find(it => norm(it.title).includes('дети'));
                return { text: dir ? `<strong>${escapeHtml(dir.title)}.</strong><br>${escapeHtml(dir.text)}<br><em>${escapeHtml(dir.result)}</em>` : 'Для детей 7–11 лет — фундамент здоровой самооценки и первые контуры личных интересов.', suggest: ['Направления работы', 'Как проходит работа?'] };
            }
        },
        {
            id: 'self',
            weight: 6,
            match: (q) => q.includes('образ я') || q.includes('самооценк') || q.includes('идентичн') || q.includes('уверенност') || q.includes('сильные стороны') || q.includes('ценност'),
            reply: () => ({
                text: 'Работа с образом Я помогает сформировать устойчивую самооценку, осознать сильные стороны и принимать решения из своей сути, а не из страха или чужих ожиданий. Есть форматы для детей 7–11, подростков 12–17 и взрослых 25+.',
                suggest: ['Направления работы', 'Профориентация подростков', 'Как проходит работа?']
            })
        },
        {
            id: 'directions',
            weight: 6,
            match: (q) => q.includes('направлен') || q.includes('формат') || q.includes('услуг') || q.includes('чем занима') || q.includes('что предлага') || q.includes('что делаете') || q.includes('что у вас'),
            reply: (d) => {
                const list = d.directions.items.map(it => `• ${escapeHtml(it.title)}`).join('<br>');
                return { text: `Работаю по нескольким направлениям:<br>${list}<br><br>Подробнее — в разделе «Направления» на главной.`, suggest: ['Профориентация подростков', 'Как проходит работа?', 'Сколько стоит?'] };
            }
        },
        {
            id: 'process',
            weight: 7,
            match: (q) => q.includes('как проходит') || q.includes('процесс') || q.includes('этап') || q.includes('шаг') || q.includes('как работа') || q.includes('что будет') || q.includes('что входит'),
            reply: (d) => {
                const steps = d.process.steps.map(s => `<strong>${escapeHtml(s.num)}. ${escapeHtml(s.title)}</strong> — ${escapeHtml(s.text)}`).join('<br>');
                return { text: `Работа строится так:<br>${steps}`, suggest: ['Сколько стоит?', 'Как записаться?', 'Сколько встреч нужно?'] };
            }
        },
        {
            id: 'online',
            weight: 6,
            match: (q) => q.includes('онлайн') || q.includes('офлайн') || q.includes('город') || q.includes('дистанц'),
            reply: () => ({ text: 'Консультации проходят онлайн — это удобно для семей из разных городов и не снижает качество работы.', suggest: ['Как проходит работа?', 'Как записаться?'] })
        },
        {
            id: 'about',
            weight: 6,
            match: (q) => q.includes('о себе') || q.includes('кто вы') || q.includes('опыт') || q.includes('образован') || q.includes('стаж') || q.includes('преподав') || q.includes('фото') || q.includes('биограф'),
            reply: (d) => ({
                text: escapeHtml(d.about.paragraphs.join(' ')) + ' Подробнее — в разделе «О себе».',
                actions: [{ label: 'Открыть «О себе»', href: 'about.html' }],
                suggest: ['О себе', 'Как проходит работа?', 'Отзывы']
            })
        },
        {
            id: 'result',
            weight: 6,
            match: (q) => q.includes('результат') || q.includes('гарант') || q.includes('что получа') || q.includes('обеща'),
            reply: (d) => ({ text: escapeHtml(d.result.text), suggest: ['Как проходит работа?', 'Сколько стоит?', 'Как записаться?'] })
        },
        {
            id: 'name',
            weight: 5,
            match: (q) => q.includes('меня зовут') || q.includes('мое имя') || q.includes('моё имя'),
            reply: (d, raw) => {
                const m = String(raw).match(/(?:меня зовут|мое имя|моё имя)\s+([А-ЯЁA-Z][а-яёa-z\-]+)/);
                if (m) {
                    state.userName = m[1];
                    persist();
                    return { text: `Приятно познакомиться, ${state.userName}! Чем могу помочь?`, suggest: suggestionsDefault };
                }
                return { text: 'Приятно познакомиться! Чем могу помочь?', suggest: suggestionsDefault };
            }
        }
    ];

    const answer = (rawQuery) => {
        const d = data();
        const q = norm(rawQuery);
        if (!q) return { text: 'Напишите вопрос — подскажу по сайту.', suggest: suggestionsDefault };

        const hits = scenarios
            .map(s => ({ s, w: s.match(q, rawQuery) ? s.weight : 0 }))
            .filter(x => x.w > 0)
            .sort((a, b) => b.w - a.w);

        if (hits.length) {
            const best = hits[0].s;
            const r = best.reply(d, rawQuery);
            r.suggest = r.suggest || suggestionsDefault;
            return r;
        }

        const qWords = q.split(' ').filter(w => w.length >= 4);
        const faqCandidates = d.faq.items
            .map(f => {
                const fText = norm(f.q + ' ' + f.a);
                const score = qWords.reduce((acc, w) => acc + (fText.includes(w) ? 1 : 0), 0);
                return { f, score };
            })
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score);

        if (faqCandidates.length) {
            const top = faqCandidates[0].f;
            return {
                text: `Возможно, вы про это:<br><strong>${escapeHtml(top.q)}</strong><br>${escapeHtml(top.a)}`,
                suggest: ['Как проходит работа?', 'Сколько стоит?', 'Как записаться?']
            };
        }

        return {
            text: 'Точно ответить не могу — уточните вопрос, пожалуйста. Могу рассказать про услуги, направления, цены, документы, отзывы или как записаться.',
            suggest: suggestionsDefault
        };
    };

    const send = (text) => {
        const clean = String(text || '').trim();
        if (!clean) return;
        if (clean.length < 2) { addMsg('Напишите чуть подробнее, пожалуйста.'); return; }

        const lastUser = [...state.history].reverse().find(m => m.who === 'user');
        if (lastUser && norm(lastUser.text) === norm(clean)) return;

        addMsg(escapeHtml(clean), 'user');
        const typing = showTyping();
        const delay = 400 + Math.min(900, clean.length * 14);
        setTimeout(() => {
            hideTyping(typing);
            const r = answer(clean);
            addMsg(r.text, 'bot', r.actions);
            setSuggestions(r.suggest || suggestionsDefault);
            persist();
        }, delay);
    };

    const hideBadge = () => {
        const b = document.querySelector('.chat-launcher__badge');
        if (b) b.classList.add('is-hidden');
    };

    const restoreHistory = () => {
        const body = document.getElementById('chatBody');
        if (!body || !state.history.length) return;
        body.innerHTML = '';
        state.history.forEach(m => {
            const el = document.createElement('div');
            el.className = `chat-msg chat-msg--${m.who} is-visible`;
            const actionsHtml = (m.actions && m.actions.length)
                ? `<div class="chat-msg__actions">${m.actions.map(a => `<a href="${escapeHtml(a.href)}" class="chat-msg__action">${escapeHtml(a.label)}</a>`).join('')}</div>`
                : '';
            el.innerHTML = `<div class="chat-msg__bubble">${m.text}${actionsHtml}</div>`;
            body.appendChild(el);
        });
        requestAnimationFrame(scrollToBottom);
    };

    const openChat = () => {
        state.open = true;
        const p = document.getElementById('chatPanel');
        p.classList.add('is-open');
        p.setAttribute('aria-hidden', 'false');
        document.getElementById('chatLauncher').classList.add('is-hidden');
        hideBadge();
        if (!state.greeted || state.history.length === 0) {
            state.greeted = true;
            setTimeout(() => {
                const greeting = state.userName
                    ? `${greetByTime()}, ${state.userName}! Расскажу про услуги, направления, документы и как записаться. С чего начнём?`
                    : `${greetByTime()}! Я помощник по сайту. Расскажу про услуги, направления, документы и как записаться. С чего начнём?`;
                addMsg(greeting);
                setSuggestions(suggestionsDefault);
            }, 300);
        } else {
            restoreHistory();
            setSuggestions(suggestionsDefault);
        }
        setTimeout(() => document.getElementById('chatInput').focus(), 320);
    };

    const closeChat = () => {
        state.open = false;
        const p = document.getElementById('chatPanel');
        p.classList.remove('is-open');
        p.setAttribute('aria-hidden', 'true');
        document.getElementById('chatLauncher').classList.remove('is-hidden');
    };

    const resetChat = () => {
        const body = document.getElementById('chatBody');
        if (body) body.innerHTML = '';
        state.history = [];
        state.greeted = false;
        state.lastTopic = null;
        state.userName = null;
        clearSaved();
        setTimeout(() => {
            state.greeted = true;
            addMsg(personalize('Начнём заново. Чем могу помочь?'));
            setSuggestions(suggestionsDefault);
        }, 100);
    };

    const toggleExpand = () => {
        const p = document.getElementById('chatPanel');
        const btn = document.getElementById('chatExpand');
        if (!p || !btn) return;
        const expanded = p.classList.toggle('is-expanded');
        btn.setAttribute('aria-label', expanded ? 'Свернуть' : 'Развернуть');
        btn.setAttribute('title', expanded ? 'Свернуть' : 'Развернуть');
        btn.innerHTML = expanded ? ICON_COLLAPSE : ICON_EXPAND;
        setTimeout(scrollToBottom, 320);
    };

    const mount = () => {
        if (document.getElementById('chatLauncher')) return;
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap);

        document.getElementById('chatLauncher').addEventListener('click', openChat);
        document.getElementById('chatClose').addEventListener('click', closeChat);
        document.getElementById('chatReset').addEventListener('click', resetChat);

        const expandBtn = document.getElementById('chatExpand');
        if (expandBtn) expandBtn.addEventListener('click', toggleExpand);

        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('chatInput');
            const v = input.value;
            input.value = '';
            send(v);
        });

        document.getElementById('chatSuggest').addEventListener('click', (e) => {
            const b = e.target.closest('[data-suggest]');
            if (b) send(b.dataset.suggest);
        });

        document.getElementById('chatBody').addEventListener('click', (e) => {
            const a = e.target.closest('.chat-msg__action');
            if (a) closeChat();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.open) {
                if (document.getElementById('chatPanel').classList.contains('is-expanded')) {
                    toggleExpand();
                } else {
                    closeChat();
                }
            }
        });

        setTimeout(() => {
            const l = document.getElementById('chatLauncher');
            if (l) l.classList.add('is-ready');
        }, 800);
    };

    document.addEventListener('DOMContentLoaded', mount);
})();
