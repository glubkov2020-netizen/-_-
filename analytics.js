(function () {
    const KEY = 'obraz_goatcounter_code';

    const getCode = () => {
        try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; }
    };
    const setCode = (code) => {
        try { localStorage.setItem(KEY, code); } catch (e) {}
        if (code) injectCounter(code);
    };

    const injectCounter = (code) => {
        if (!code) return;
        if (document.querySelector('script[data-goatcounter]')) return;
        const s = document.createElement('script');
        s.async = true;
        s.setAttribute('data-goatcounter', `https://${code}.goatcounter.com/count`);
        s.src = '//gc.zgo.at/count.js';
        document.head.appendChild(s);
    };

    const fetchStats = async (code) => {
        if (!code) return null;
        try {
            const r = await fetch(`https://${code}.goatcounter.com/api/v0/stats/hits?limit=10`, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (!r.ok) return null;
            return await r.json();
        } catch (e) {
            return null;
        }
    };

    const init = () => {
        const code = getCode();
        if (code) injectCounter(code);
    };

    window.ObrazAnalytics = { getCode, setCode, fetchStats, injectCounter };
    document.addEventListener('DOMContentLoaded', init);
})();
