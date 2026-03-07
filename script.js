document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

<<<<<<< ours
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
=======
const filterButtons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    cards.forEach((card) => {
      const categories = card.dataset.category || '';
      const match = target === 'all' || categories.includes(target);
      card.style.display = match ? 'block' : 'none';
    });
  });
});
>>>>>>> theirs
