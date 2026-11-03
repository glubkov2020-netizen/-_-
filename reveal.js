(function () {
    let io = null;
    const setup = () => {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
            return;
        }
        if (io) io.disconnect();
        io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => io.observe(el));
    };
    window.ObrazReveal = { rebind: setup };
    document.addEventListener('DOMContentLoaded', setup);
    window.addEventListener('obraz:data-changed', setup);
})();
