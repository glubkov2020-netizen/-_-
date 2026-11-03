(function () {
    const KEY_PREFIX = 'scrollPos:';
    const path = window.location.pathname + window.location.search;

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    window.addEventListener('load', () => {
        const saved = sessionStorage.getItem(KEY_PREFIX + path);
        if (saved !== null) {
            const y = parseInt(saved, 10);
            if (!isNaN(y)) {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: y, behavior: 'auto' });
                });
            }
        }
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            sessionStorage.setItem(KEY_PREFIX + path, String(window.scrollY));
            ticking = false;
        });
    }, { passive: true });
})();
