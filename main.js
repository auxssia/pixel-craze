// Save as main.js
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.bento-card, .philosophy, .cta-inner').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s cubic-bezier(0.19, 1, 0.22, 1)";
    observer.observe(el);
});

// Adding visible class via observer
const style = document.createElement('style');
style.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);