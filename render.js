(function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const set = (sel, value, asHtml = false) => { const el = $(sel); if (!el) return; if (asHtml) el.innerHTML = value; else el.textContent = value; };

    const renderHeader = (d) => {
        $$('.logo__text').forEach(el => { el.innerHTML = 'Образ<span>Я</span>'; });
    };

    const renderHero = (d) => {
        if (!$('#hero')) return;
        const h = d.hero;
        set('#hero .hero__eyebrow', h.eyebrow);
        set('#hero .hero__title', h.title, true);
        set('#hero .hero__text', h.text);
        const actions = $$('#hero .hero__actions .btn');
        if (actions[0]) actions[0].innerHTML = `${h.primaryBtn} <span class="btn__arrow">→</span>`;
        if (actions[1]) actions[1].textContent = h.secondaryBtn;
        const badges = $('#hero .hero__badges');
        if (badges) badges.innerHTML = h.badges.map(b => `<span>${b}</span>`).join('');
        const photo = $('#hero .hero__photo');
        if (photo) { photo.src = h.photo; photo.alt = 'Образовательный консультант'; }
        set('#hero .hero__card-label', h.cardLabel);
        set('#hero .hero__card-title', h.cardTitle);
        set('#hero .hero__card-text', h.cardText);
    };

    const renderAbout = (d) => {
        const root = $('#about');
        if (!root) return;
        set('#about .section__eyebrow', d.about.eyebrow);
        set('#about .section__title', d.about.title);
        const text = $('#about .about__text');
        if (text) text.innerHTML = d.about.paragraphs.map(p => `<p>${p}</p>`).join('');
        const stats = $('#about .about__stats');
        if (stats) stats.innerHTML = d.about.stats.map(s => `<div class="stat"><span class="stat__num">${s.num}</span><span class="stat__label">${s.label}</span></div>`).join('');
    };

    const renderDirections = (d) => {
        const root = $('#directions');
        if (!root) return;
        set('#directions .section__eyebrow', d.directions.eyebrow);
        set('#directions .section__title', d.directions.title);
        set('#directions .section__sub', d.directions.sub);
        const cards = $('#directions .cards');
        if (cards) cards.innerHTML = d.directions.items.map((it, i) => `
            <article class="card reveal ${i ? 'reveal--delay-' + i : ''}">
                <h3 class="card__title">${it.title}</h3>
                <p class="card__text">${it.text}</p>
                <p class="card__result">${it.result}</p>
            </article>
        `).join('');
    };

    const renderServices = (d) => {
        const root = $('#services');
        if (!root) return;
        set('#services .section__eyebrow', d.services.eyebrow);
        set('#services .section__title', d.services.title);
        const grid = $('#services .services__grid');
        if (grid) grid.innerHTML = d.services.items.map((it, i) => `
            <article class="service reveal ${i ? 'reveal--delay-' + i : ''}">
                <span class="service__tag">${it.tag}</span>
                <h3 class="service__title">${it.title}</h3>
                <p>${it.text}</p>
            </article>
        `).join('');
    };

    const renderProcess = (d) => {
        const root = $('#process');
        if (!root) return;
        set('#process .section__eyebrow', d.process.eyebrow);
        set('#process .section__title', d.process.title);
        set('#process .section__sub', d.process.sub);
        const steps = $('#process .steps');
        if (steps) steps.innerHTML = d.process.steps.map((s, i) => `
            <li class="step reveal ${i ? 'reveal--delay-' + i : ''}">
                <span class="step__num">${s.num}</span>
                <div><h3>${s.title}</h3><p>${s.text}</p></div>
            </li>
        `).join('');
    };

    const renderResult = (d) => {
        const root = $('.result .result__inner');
        if (!root) return;
        set('.result .result__title', d.result.title);
        set('.result .result__text', d.result.text);
        const btn = $('.result .result__inner .btn');
        if (btn) btn.innerHTML = `${d.result.btn} <span class="btn__arrow">→</span>`;
    };

    const renderFaq = (d) => {
        const root = $('#faq');
        if (!root) return;
        set('#faq .section__eyebrow', d.faq.eyebrow);
        set('#faq .section__title', d.faq.title);
        const list = $('#faq .faq__list');
        if (list) list.innerHTML = d.faq.items.map(it => `
            <div class="faq__item reveal">
                <button class="faq__question">${it.q}<span class="faq__icon"></span></button>
                <div class="faq__answer"><p>${it.a}</p></div>
            </div>
        `).join('');
        if (window.ObrazAccordion) window.ObrazAccordion.rebind();
    };

    const renderContact = (d) => {
        const root = $('#contact');
        if (!root) return;
        set('#contact .section__eyebrow', d.contact.eyebrow);
        set('#contact .section__title', d.contact.title);
        set('#contact .contact__text', d.contact.text);
        const links = $('#contact .contact__links');
        if (links) links.innerHTML = `
            <a href="${d.site.telegram}" class="contact__link">Telegram</a>
            <a href="${d.site.whatsapp}" class="contact__link">WhatsApp</a>
            <a href="mailto:${d.site.email}" class="contact__link">${d.site.email}</a>
        `;
    };

    const renderAboutPage = (d) => {
        if (!document.body.classList.contains('page-about')) return;
        const p = d.aboutPage;
        set('.page-hero__title', p.title, true);
        set('.page-hero__text', p.text);
        const photos = $('.profile__photos');
        if (photos) {
            photos.innerHTML = p.photos.map((ph, i) => `
                <div class="profile__photo ${ph.tall ? 'profile__photo--tall' : ''}" ${i === 2 ? 'style="grid-column: 1 / -1; aspect-ratio: 16 / 9;"' : ''}>
                    <img src="${ph.src}" alt="${ph.alt}" onerror="this.parentElement.classList.add('is-fallback'); this.remove();">
                </div>
            `).join('');
        }
        set('.profile__bio h3:nth-of-type(1)', p.bioHeading);
        const bioP = $('.profile__bio p:nth-of-type(1)');
        if (bioP) bioP.textContent = p.bioText;
        set('.profile__bio h3:nth-of-type(2)', p.approachHeading);
        const approachP = $('.profile__bio p:nth-of-type(2)');
        if (approachP) approachP.textContent = p.approachText;
        const list = $('.profile__list');
        if (list) list.innerHTML = p.list.map(x => `<li>${x}</li>`).join('');
        const valuesSection = $$('.section--alt')[0];
        if (valuesSection) {
            const ey = $('.section__eyebrow', valuesSection);
            const ti = $('.section__title', valuesSection);
            const cards = $('.cards', valuesSection);
            if (ey) ey.textContent = p.valuesEyebrow;
            if (ti) ti.textContent = p.valuesTitle;
            if (cards) cards.innerHTML = p.values.map((v, i) => `
                <article class="card reveal ${i ? 'reveal--delay-' + i : ''}">
                    <h3 class="card__title">${v.title}</h3>
                    <p class="card__text">${v.text}</p>
                </article>
            `).join('');
        }
    };

    const renderJournal = (d) => {
        if (!document.body.classList.contains('page-journal')) return;
        set('.page-hero__title', d.journalPage.title);
        set('.page-hero__text', d.journalPage.text);
        const grid = $('.journal__grid');
        if (grid) grid.innerHTML = d.journalPage.items.map((it, i) => `
            <article class="journal-card reveal ${i ? 'reveal--delay-' + i : ''}">
                <div class="journal-card__cover"></div>
                <div class="journal-card__body">
                    <span class="journal-card__date">${it.date}</span>
                    <h3 class="journal-card__title">${it.title}</h3>
                    <p class="journal-card__excerpt">${it.excerpt}</p>
                    <span class="journal-card__more">Читать →</span>
                </div>
            </article>
        `).join('');
    };

    const renderReviews = (d) => {
        if (!document.body.classList.contains('page-reviews')) return;
        set('.page-hero__title', d.reviewsPage.title);
        set('.page-hero__text', d.reviewsPage.text);
        const grid = $('.reviews__grid');
        const published = d.reviewsPage.items.filter(r => r.status !== 'pending');
        if (grid) grid.innerHTML = published.map((r, i) => `
            <article class="review-card reveal ${i ? 'reveal--delay-' + i : ''}">
                <span class="review-card__quote">«</span>
                <div class="review-card__stars">${'★'.repeat(r.rating)}</div>
                <p class="review-card__text">${r.text}</p>
                <div class="review-card__author">
                    <div class="review-card__avatar">${(r.name || '?').charAt(0).toUpperCase()}</div>
                    <div><p class="review-card__name">${r.name}</p><p class="review-card__role">${r.role || ''}</p></div>
                </div>
            </article>
        `).join('');
    };

    const renderDocuments = (d) => {
        if (!document.body.classList.contains('page-documents')) return;
        set('.page-hero__title', d.documentsPage.title);
        set('.page-hero__text', d.documentsPage.text);
        const list = $('.docs__list');
        if (list) list.innerHTML = d.documentsPage.docs.map((doc, i) => `
            <div class="doc-item reveal ${i ? 'reveal--delay-' + i : ''}">
                <div class="doc-item__icon">PDF</div>
                <div class="doc-item__info"><h3>${doc.title}</h3><p>${doc.subtitle}</p></div>
                <button class="btn btn--ghost" data-doc="${doc.file}" data-doc-title="${doc.title}">Открыть</button>
            </div>
        `).join('');
        const reqSection = $$('.section--alt')[0];
        if (reqSection) {
            const ti = $('.section__title', reqSection);
            const sub = $('.section__sub', reqSection);
            const cards = $('.cards', reqSection);
            if (ti) ti.textContent = d.documentsPage.requisitesTitle;
            if (sub) sub.textContent = d.documentsPage.requisitesSub;
            if (cards) cards.innerHTML = d.documentsPage.requisites.map((r, i) => `
                <article class="card reveal ${i ? 'reveal--delay-' + i : ''}">
                    <h3 class="card__title">${r.title}</h3>
                    <p class="card__text">${r.text}</p>
                </article>
            `).join('');
        }
        if (window.ObrazPdf) window.ObrazPdf.rebind();
    };

    let renderRaf = null;
    let lastRenderSnapshot = '';
    const renderAll = () => {
        if (renderRaf) return;
        renderRaf = requestAnimationFrame(() => {
            renderRaf = null;
            const d = window.ObrazStore.load();
            const snap = JSON.stringify(d);
            if (snap === lastRenderSnapshot) return;
            lastRenderSnapshot = snap;
            renderHeader(d);
        renderHero(d);
        renderAbout(d);
        renderDirections(d);
        renderServices(d);
        renderProcess(d);
        renderResult(d);
        renderFaq(d);
        renderContact(d);
        renderAboutPage(d);
        renderJournal(d);
        renderReviews(d);
        renderDocuments(d);
        if (window.ObrazReveal) window.ObrazReveal.rebind();
        });
    };

    window.ObrazRender = { renderAll, rebind: renderAll };
    document.addEventListener('DOMContentLoaded', renderAll);
    window.addEventListener('obraz:data-changed', renderAll);
})();
