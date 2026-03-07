document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');

if (filters.length && projectCards.length) {
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      const selected = button.dataset.filter;

      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const shouldShow = selected === 'all' || categories.includes(selected);
        card.style.display = shouldShow ? '' : 'none';
      });
    });
  });
}
