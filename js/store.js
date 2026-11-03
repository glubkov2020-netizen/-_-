(function () {
    const KEY = 'obraz_data_v1';
    const EVT = 'obraz:data-changed';
    
    // Твой токен и репозиторий
    const GITHUB_TOKEN = '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'; 
    const REPO = 'glubkov2020-netizen/-_-';
    const FILE = 'data.json';

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

    // Сохраняем локально И отправляем в GitHub
    const save = async (data) => {
        // 1. Сохраняем в браузер
        localStorage.setItem(KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent(EVT, { detail: data }));

        // 2. Пытаемся отправить в GitHub
        try {
            // Сначала узнаем sha файла (он нужен для обновления)
            const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
                headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
            });
            let sha = null;
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            // Отправляем новые данные
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
            await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Обновление данных через админку',
                    content: content,
                    sha: sha || undefined
                })
            });
            console.log('Данные успешно сохранены на GitHub!');
        } catch (e) {
            console.error('Не удалось сохранить на GitHub:', e);
        }
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
