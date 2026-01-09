// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach(el => observer.observe(el));

// Stagger cards
const cards = document.querySelectorAll(".card");
cards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});
