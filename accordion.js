(function () {
    const bind = () => {
        document.querySelectorAll('.faq__question').forEach(button => {
            if (button.dataset.bound) return;
            button.dataset.bound = '1';
            button.addEventListener('click', () => {
                const item = button.closest('.faq__item');
                const isOpen = item.classList.contains('is-open');
                document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('is-open'));
                if (!isOpen) item.classList.add('is-open');
            });
        });
    };
    window.ObrazAccordion = { rebind: bind };
    document.addEventListener('DOMContentLoaded', bind);
    window.addEventListener('obraz:data-changed', bind);
})();
