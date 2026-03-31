// ================================================================
//  FLOWLESS ECOM — Motor de Navegación
//  Desktop: translateY JS (hiper-suave, controlado)
//  Mobile:  CSS scroll-snap nativo (perfecto para touch)
// ================================================================

const isMobile = () => window.innerWidth <= 1024;

let currentIndex = 0;
const sections = Array.from(document.querySelectorAll('.snap-section'));
const sectionsCount = sections.length;
const container = document.getElementById('mainContainer');
const dots = document.querySelectorAll('.dot');
let isTransitioning = false;

// ── DOTS: ilumina el punto activo ─────────────────────────────────────────────
function highlightDot(index) {
    dots.forEach((dot, i) => {
        dot.classList.toggle('bg-indigo-500', i === index);
        dot.classList.toggle('bg-white/10', i !== index);
        dot.style.height = i === index ? '32px' : '24px';
    });
}

// ── DESKTOP: mueve el contenedor en eje Y ─────────────────────────────────────
function updateDesktopUI() {
    container.style.transform = `translateY(-${currentIndex * 100}vh)`;
    highlightDot(currentIndex);
}

// ── MOBILE: IntersectionObserver actualiza dots al hacer scroll nativo ─────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && isMobile()) {
            const idx = sections.indexOf(entry.target);
            if (idx !== -1) highlightDot(idx);
        }
    });
}, { threshold: 0.55 });

sections.forEach(s => observer.observe(s));

// ── NAVEGACIÓN PRINCIPAL ───────────────────────────────────────────────────────
function navigate(direction) {
    if (isTransitioning || isMobile()) return;  // móvil lo maneja CSS
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < sectionsCount) {
        isTransitioning = true;
        currentIndex = nextIndex;
        updateDesktopUI();
        setTimeout(() => { isTransitioning = false; }, 950);
    }
}

// ── goToSection: desde botones/dots ───────────────────────────────────────────
window.goToSection = function(index) {
    currentIndex = index;
    if (isMobile()) {
        // ScrollIntoView usa el snap nativo del CSS
        sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        updateDesktopUI();
    }
};

// ── EVENTOS DESKTOP: Wheel + Teclado ─────────────────────────────────────────
window.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    if (Math.abs(e.deltaY) < 40) return;
    navigate(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') navigate(1);
    if (e.key === 'ArrowUp') navigate(-1);
});

// ── RESIZE: recalcular según viewport ────────────────────────────────────────
window.addEventListener('resize', () => {
    if (isMobile()) {
        container.style.transform = 'none';
    } else {
        updateDesktopUI();
    }
});

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (!isMobile()) updateDesktopUI();
    highlightDot(0);

    // Inyección del precio desde config.js
    if (typeof CONFIG !== 'undefined') {
        const precioEl = document.getElementById('precio-suscripcion');
        if (precioEl) {
            const precioFormateado = CONFIG.PRECIO_SUSCRIPCION.toLocaleString('es-ES');
            precioEl.textContent = `${precioFormateado}${CONFIG.MONEDA_SIMBOLO}`;
        }
    }
});
