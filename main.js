// 1. Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// 2. Smooth Reveal Animation
const revealOptions = { threshold: 0.15 };

const revealCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const observer = new IntersectionObserver(revealCallback, revealOptions);

document.querySelectorAll('.bento-card, .philosophy, .cta-inner').forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
});

// Create animation styles dynamically
const styleTag = document.createElement('style');
styleTag.innerHTML = `
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
document.head.appendChild(styleTag);