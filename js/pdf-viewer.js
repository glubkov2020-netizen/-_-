(function () {
    const modalHtml = `
        <div class="modal" id="pdfModal" aria-hidden="true">
            <div class="modal__panel modal__panel--wide" role="dialog" aria-modal="true" aria-labelledby="pdfTitle">
                <button class="modal__close" data-close="pdfModal" aria-label="Закрыть">×</button>
                <p class="modal__eyebrow">Документ</p>
                <h2 class="modal__title" id="pdfTitle">Просмотр</h2>
                <div style="margin-top:16px;border-radius:16px;overflow:hidden;border:1px solid var(--color-border);min-height:60vh;background:var(--color-bg);">
                    <iframe id="pdfFrame" src="" title="Документ" style="width:100%;height:60vh;border:0;display:block;"></iframe>
                </div>
                <div style="margin-top:16px;display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
                    <a id="pdfDownload" href="#" target="_blank" rel="noopener" class="btn btn--ghost">Открыть в новой вкладке</a>
                    <button type="button" class="btn btn--primary" data-close="pdfModal">Закрыть</button>
                </div>
            </div>
        </div>
    `;

    const mount = () => {
        if (!document.getElementById('pdfModal')) {
            const wrap = document.createElement('div');
            wrap.innerHTML = modalHtml;
            document.body.appendChild(wrap);
        }
    };

    const openPdf = (src, title) => {
        mount();
        document.getElementById('pdfTitle').textContent = title || 'Документ';
        document.getElementById('pdfFrame').src = src;
        document.getElementById('pdfDownload').href = src;
        const m = document.getElementById('pdfModal');
        m.classList.add('is-open');
        m.setAttribute('aria-hidden', 'false');
    };

    const closePdf = () => {
        const m = document.getElementById('pdfModal');
        if (!m) return;
        m.classList.remove('is-open');
        m.setAttribute('aria-hidden', 'true');
        const frame = document.getElementById('pdfFrame');
        if (frame) frame.src = '';
    };

    document.addEventListener('click', (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;

        const docBtn = t.closest('[data-doc]');
        if (docBtn) {
            e.preventDefault();
            openPdf(docBtn.getAttribute('data-doc'), docBtn.getAttribute('data-doc-title'));
            return;
        }

        const closeBtn = t.closest('[data-close="pdfModal"]');
        if (closeBtn) {
            e.preventDefault();
            closePdf();
            return;
        }

        if (t.id === 'pdfModal') closePdf();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePdf();
    });

    window.ObrazPdf = { rebind: mount };
    document.addEventListener('DOMContentLoaded', mount);
})();
