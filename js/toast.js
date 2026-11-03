(function () {
    const root = document.createElement('div');
    root.className = 'toast-stack';
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(root));

    const show = (msg, type = 'success') => {
        const el = document.createElement('div');
        el.className = `toast toast--${type}`;
        el.innerHTML = `<span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</span><span class="toast__text">${msg}</span>`;
        root.appendChild(el);
        requestAnimationFrame(() => el.classList.add('is-visible'));
        setTimeout(() => {
            el.classList.remove('is-visible');
            setTimeout(() => el.remove(), 350);
        }, 2400);
    };

    window.ObrazToast = { show };

    document.addEventListener('DOMContentLoaded', () => {
        if (!window.ObrazStore) return;
        const originalSave = window.ObrazStore.save;
        window.ObrazStore.save = function (data) {
            originalSave.call(window.ObrazStore, data);
            if (!window.__obrazSilentSave) show('Изменения сохранены');
        };
        const originalImport = window.ObrazStore.importJson;
        window.ObrazStore.importJson = function (text) {
            const r = originalImport.call(window.ObrazStore, text);
            show('Данные загружены');
            return r;
        };
        const originalReset = window.ObrazStore.reset;
        window.ObrazStore.reset = function () {
            originalReset.call(window.ObrazStore);
            show('Сброшено к демо-данным', 'info');
        };
    });
})();
