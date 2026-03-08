(function () {
  const yearNodes = document.querySelectorAll("[data-year]");
  const currentYear = String(new Date().getFullYear());
  yearNodes.forEach((node) => {
    node.textContent = currentYear;
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  if (menuButton && siteNav) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      siteNav.classList.remove("is-open");
    };

    const openMenu = () => {
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close menu");
      siteNav.classList.add("is-open");
    };

    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
        return;
      }
      openMenu();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!siteNav.classList.contains("is-open")) {
        return;
      }
      const clickedInsideMenu = siteNav.contains(event.target);
      const clickedToggle = menuButton.contains(event.target);
      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  const normalizePath = (path) => {
    if (!path) {
      return "/";
    }
    let nextPath = path.replace(/\/index\.html$/i, "/");
    nextPath = nextPath.replace(/\/+$/, "");
    return nextPath || "/";
  };

  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll("[data-site-nav] a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) {
      return;
    }

    const target = new URL(href, window.location.href);
    const targetPath = normalizePath(target.pathname);

    if (currentPath === targetPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
      return;
    }

    link.classList.remove("is-active");
    link.removeAttribute("aria-current");
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-project-card]");

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter || "all";

        filterButtons.forEach((item) => {
          item.classList.toggle("is-active", item === button);
          item.setAttribute("aria-pressed", item === button ? "true" : "false");
        });

        projectCards.forEach((card) => {
          const categories = (card.dataset.category || "").split(" ");
          const shouldShow = selected === "all" || categories.includes(selected);
          card.style.display = shouldShow ? "" : "none";
        });
      });
    });
  }

  const revealNodes = document.querySelectorAll(".reveal");

  if (!revealNodes.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
})();
