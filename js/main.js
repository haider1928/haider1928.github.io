document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile menu ─────────────────────────────
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll reveal ───────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
  );

  reveals.forEach(el => observer.observe(el));

  // ── Terminal typing (index page only) ───────
  const termBody = document.getElementById('terminalBody');
  if (termBody) {
    const lines = termBody.querySelectorAll('.t-line');
    lines.forEach(line => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(4px)';
      line.style.transition = 'opacity 250ms ease, transform 250ms ease';
    });

    const termObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const all = entry.target.querySelectorAll('.t-line');
          all.forEach((line, i) => {
            setTimeout(() => {
              line.style.opacity = '1';
              line.style.transform = 'none';
            }, i * 100);
          });
          termObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    termObserver.observe(termBody);
  }

  // ── Contact form ────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('formSubmit');
      const orig = btn.textContent;
      btn.textContent = 'Sent';
      btn.disabled = true;
      btn.style.opacity = '0.6';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.opacity = '';
        form.reset();
      }, 2500);
    });
  }

});
