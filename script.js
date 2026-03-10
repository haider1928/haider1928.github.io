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
        const selected = (button.dataset.filter || "all").trim().toLowerCase();

        filterButtons.forEach((item) => {
          const itemFilter = (item.dataset.filter || "all").trim().toLowerCase();
          const isActive = itemFilter === selected;
          item.classList.toggle("is-active", isActive);
          item.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        projectCards.forEach((card) => {
          const categories = (card.dataset.category || "").trim().toLowerCase().split(/\s+/);
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

  const contactForm = document.querySelector(".contact-form");
  const captchaCanvas = document.getElementById("captcha-canvas");
  const captchaInput = document.getElementById("captcha-input");
  const refreshButton = document.getElementById("refresh-captcha");
  let currentCaptcha = "";

  const generateCaptcha = () => {
    if (!captchaCanvas) return;
    const ctx = captchaCanvas.getContext("2d");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking chars
    currentCaptcha = "";
    for (let i = 0; i < 6; i++) {
      currentCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Clear canvas
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Background noise
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Random lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
      ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
      ctx.stroke();
    }

    // Draw characters
    ctx.font = "bold 28px Space Grotesk, sans-serif";
    ctx.textBaseline = "middle";

    for (let i = 0; i < currentCaptcha.length; i++) {
      const x = 20 + i * 22;
      const y = captchaCanvas.height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 0.4 - 0.2);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#111827";
      ctx.fillText(currentCaptcha[i], 0, 0);
      ctx.restore();
    }
  };

  if (captchaCanvas) {
    generateCaptcha();
    refreshButton?.addEventListener("click", generateCaptcha);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const userInput = captchaInput.value.toUpperCase();
      if (userInput !== currentCaptcha) {
        alert("Incorrect captcha. Please try again.");
        generateCaptcha();
        captchaInput.value = "";
        return;
      }

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        project_type: formData.get("project_type"),
        message: formData.get("message")
      };

      // Immediate reset as requested
      contactForm.reset();
      generateCaptcha();
      
      // Small delay before alert to ensure reset state is rendered and fetch is initiated
      setTimeout(() => {
        alert("Message sent successfully!");
      }, 50);

      // Fire and forget fetch with keepalive for better browser reliability (especially Edge)
      fetch("https://vapours-cell.onrender.com/forms", {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(data)
      }).catch(error => {
        console.warn("Background submission issue:", error);
      });
    });
  }
})();
