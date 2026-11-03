(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth <= 768) return;

    let ticking = false;
    let lastX = 0, lastY = 0;
    let currentCard = null;

    const update = () => {
        ticking = false;
        if (!currentCard) return;
        const rect = currentCard.getBoundingClientRect();
        currentCard.style.setProperty('--mx', ((lastX - rect.left) / rect.width * 100) + '%');
        currentCard.style.setProperty('--my', ((lastY - rect.top) / rect.height * 100) + '%');
    };

    document.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const card = e.target.closest('.card, .service, .review-card');
        if (card !== currentCard) {
            currentCard = card;
        }
        if (!card) return;
        lastX = e.clientX;
        lastY = e.clientY;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
})();
