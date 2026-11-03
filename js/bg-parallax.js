(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let raf = null;
    let active = false;

    const onMove = (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!active) {
            active = true;
            raf = requestAnimationFrame(tick);
        }
    };

    const tick = () => {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        root.style.setProperty('--mx', currentX.toFixed(3));
        root.style.setProperty('--my', currentY.toFixed(3));
        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
            raf = requestAnimationFrame(tick);
        } else {
            active = false;
        }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
})();
