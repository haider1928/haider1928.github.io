document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');

if (nav && toggle) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const currentPath = window.location.pathname.replace(/index\.html$/, '');
  nav.querySelectorAll('a').forEach((a) => {
    const href = new URL(a.getAttribute('href'), window.location.href).pathname.replace(/index\.html$/, '');
    if (href === currentPath) {
      nav.querySelectorAll('a').forEach((link) => link.removeAttribute('aria-current'));
      a.setAttribute('aria-current', 'page');
      a.classList.add('active');
    }
  });
}

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
