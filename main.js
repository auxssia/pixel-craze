// 1. Set current year
document.getElementById("year").textContent = new Date().getFullYear();

// 2. Intersection Observer for Scroll Animations
const observerOptions = { threshold: 0.15 };

const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Target all sections and cards
document.querySelectorAll('.bento-card, .philosophy, .cta-inner').forEach(el => {
    el.classList.add('reveal-hidden');
    revealOnScroll.observe(el);
});

// Inline Styles for Animations (to keep CSS clean)
const style = document.createElement('style');
style.textContent = `
    .reveal-hidden {
        opacity: 0;
        transform: translateY(40px);
        transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);