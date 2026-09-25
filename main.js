// 1. Footer Year
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// 2. Live IST Clock
function updateClock() {
    const clockEl = document.getElementById('ist-clock');
    if (clockEl) {
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeString = new Date().toLocaleTimeString('en-US', options);
        clockEl.textContent = `${timeString}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// 3. Smooth Reveal Animation
const revealOptions = { threshold: 0.15 };

const revealCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const observer = new IntersectionObserver(revealCallback, revealOptions);

// Target old and new elements
document.querySelectorAll('.bento-card, .philosophy, .cta-inner, #ai-automation').forEach(el => {
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
        will-change: transform, opacity;
    }
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleTag);

// 4. Developer Easter Egg
console.log(
    "%cHello from PixelCraze! Built by an elite dev. ☕ Contact: manas@pixelcraze.space", 
    "color:#7c7cff; font-size:16px; font-weight:bold;"
);