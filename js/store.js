(function () {
    const KEY = 'obraz_data_v1';
    const EVT = 'obraz:data-changed';

    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

    const mergeDefaults = (stored) => {
        const base = deepClone(window.OBRAZ_DEFAULTS || {});
        if (!stored) return base;
        const out = { ...base };
        Object.keys(base).forEach(k => {
            if (stored[k] !== undefined) {
                if (Array.isArray(base[k]) && Array.isArray(stored[k])) out[k] = stored[k];
                else if (typeof base[k] === 'object' && base[k] !== null && typeof stored[k] === 'object' && !Array.isArray(stored[k])) out[k] = { ...base[k], ...stored[k] };
                else out[k] = stored[k];
            }
        });
        return out;
    };

    const load = () => {
        try {
            const raw = localStorage.getItem(KEY);
            return mergeDefaults(raw ? JSON.parse(raw) : null);
        } catch (e) {
            return mergeDefaults(null);
        }
    };

    const save = (data) => {
        localStorage.setItem(KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent(EVT, { detail: data }));
    };

    const reset = () => {
        localStorage.removeItem(KEY);
        window.dispatchEvent(new CustomEvent(EVT, { detail: load() }));
    };

    const exportJson = () => JSON.stringify(load(), null, 2);

    const importJson = (text) => {
        const parsed = JSON.parse(text);
        const merged = mergeDefaults(parsed);
        save(merged);
        return merged;
    };

    window.ObrazStore = { load, save, reset, exportJson, importJson, EVT };
})();
