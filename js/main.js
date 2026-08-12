/* ==========================================================================
   HAIDER MOHSIN — PORTFOLIO INTERACTIVE JS ENGINE
   ========================================================================== */

/* ── 1. REAL GITHUB REPOSITORY DATA ───────────────────────────────────────── */
const projectsData = [
  {
    id: 'ozmed',
    num: '01',
    name: 'OZMED',
    subtitle: 'AI TERMINAL ASSISTANT',
    repoUrl: 'https://github.com/haider1928/ozmed',
    language: 'Python',
    featured: true,
    accentColor: 'var(--accent-cyan)',
    categories: ['ai', 'automation', 'python'],
    tags: ['PYTHON', 'AI', 'CLI', 'AUTOMATION', 'AGENTS', 'API'],
    description: 'An AI-powered terminal assistant capable of executing system commands, running Python code, searching the web, and performing autonomous tasks directly from the CLI.',
    details: 'Ozmed AI is a terminal-based assistant that interacts directly with computer systems rather than simply responding with text. Capabilities include Python script execution, PowerShell command execution, live web searching, file manipulation, and autonomous AI-assisted workflows.'
  },
  {
    id: 'ai-bug-hunter',
    num: '02',
    name: 'AI-BUG-HUNTER',
    subtitle: 'AI-ASSISTED SECURITY AUTOMATION CLI',
    repoUrl: 'https://github.com/haider1928/AI-BUG-HUNTER',
    language: 'Python',
    featured: true,
    accentColor: 'var(--accent-cyan)',
    categories: ['cybersecurity', 'ai', 'python', 'automation'],
    tags: ['PYTHON', 'CYBERSECURITY', 'CLI', 'AI', 'SECURITY AUTOMATION', 'XSS'],
    description: 'A Python CLI tool that automates penetration testing steps by asking an AI for one command or script at a time, executing it, and storing the result.',
    details: 'Includes an XSS knowledge base and runs individual security-testing steps through an interactive, step-by-step workflow. Connects LLM decision-making directly to local execution and structured output storage.'
  },
  {
    id: 'sargoshi-whisper',
    num: '03',
    name: 'Sargoshi-Whisper',
    subtitle: 'SECURITY RESEARCH & MALWARE ANALYSIS DEMO',
    repoUrl: 'https://github.com/haider1928/Sargoshi-Whisper',
    language: 'Python',
    featured: true,
    accentColor: 'var(--accent-green)',
    categories: ['cybersecurity', 'python'],
    tags: ['PYTHON', 'DISCORD', 'SECURITY RESEARCH', 'MALWARE ANALYSIS', 'SECURITY LAB'],
    description: 'A security research demonstration showing how a Discord-based remote administration payload can be built and analyzed in an educational context.',
    details: 'Created strictly for educational security research and malware analysis. Demonstrates command C2 parsing over Discord API endpoints and how defenders analyze covert command-and-control channels.'
  },
  {
    id: 'boardready',
    num: '04',
    name: 'BoardReady',
    subtitle: 'STUDY PLANNING & EXAM PREP APP',
    repoUrl: 'https://github.com/haider1928/BoardReady',
    language: 'TypeScript',
    featured: true,
    accentColor: 'var(--accent-amber)',
    categories: ['education', 'web'],
    tags: ['TYPESCRIPT', 'EDUCATION', 'STUDY PLANNING', 'PRODUCTIVITY'],
    description: 'An application for Grade 9 and 10 students preparing for board examinations. Builds a study plan by working backward from exam dates.',
    details: 'Calculates daily and weekly study targets backward from scheduled exam deadlines, helping students organize curriculum topics and monitor preparation velocity.'
  },
  {
    id: 'instaposter',
    num: '05',
    name: 'InstaPoster',
    subtitle: 'AUTOMATED SOCIAL IMAGE GENERATOR',
    repoUrl: 'https://github.com/haider1928/InstaPoster',
    language: 'Python',
    featured: false,
    accentColor: 'var(--accent-blue)',
    categories: ['automation', 'python'],
    tags: ['PYTHON', 'AUTOMATION', 'INSTAGRAM', 'NEWSAPI', 'HADITH API', 'IMAGE GENERATION'],
    description: 'A Python application that turns live news headlines and Hadith quotes into ready-made images and saves them locally or uploads them to Instagram.',
    details: 'Fetches content via NewsAPI and Hadith APIs, renders structured graphic images using PIL/Pillow, and handles Instagram API upload authentication.'
  },
  {
    id: 'cryptotelegrambot',
    num: '06',
    name: 'CryptoTelegramBot',
    subtitle: 'CRYPTO MARKET TRACKING BOT',
    repoUrl: 'https://github.com/haider1928/CryptoTelegramBot',
    language: 'Python',
    featured: false,
    accentColor: 'var(--accent-blue)',
    categories: ['automation', 'python', 'bot'],
    tags: ['PYTHON', 'TELEGRAM API', 'CRYPTO', 'BOT', 'AUTOMATION'],
    description: 'A Python Telegram bot for automated cryptocurrency market tracking, price alerts, and automated status notifications.',
    details: 'Polls cryptocurrency price APIs, calculates threshold changes, and pushes automated notifications directly to configured Telegram channels.'
  },
  {
    id: 'ustaad',
    num: '07',
    name: 'Ustaad',
    subtitle: 'AI EDUCATIONAL DISCORD BOT',
    repoUrl: 'https://github.com/haider1928/Ustaad',
    language: 'Python',
    featured: false,
    accentColor: 'var(--accent-amber)',
    categories: ['ai', 'education', 'python', 'bot'],
    tags: ['PYTHON', 'DISCORD', 'AI', 'EDUCATION', 'BOT'],
    description: 'An AI-powered educational Discord bot providing automated assistance, interactive study tools, and learning support.',
    details: 'Integrates AI API prompts into Discord server commands to answer student queries, explain technical concepts, and assist with study tasks.'
  },
  {
    id: 'bookdioweb',
    num: '08',
    name: 'BookdioWeb',
    subtitle: 'AUDIOBOOK & TTS WEB APPLICATION',
    repoUrl: 'https://github.com/haider1928/BookdioWeb',
    language: 'Python',
    featured: false,
    accentColor: 'var(--accent-blue)',
    categories: ['web', 'python'],
    tags: ['PYTHON', 'WEB APP', 'AUDIO', 'TTS', 'READING'],
    description: 'A Python web application for audiobook browsing, text-to-speech audio generation, and digital reading management.',
    details: 'Converts book text to synthetic audio streams and presents a web dashboard for audio playback and reading organization.'
  },
  {
    id: 'discord-translator',
    num: '09',
    name: 'Discord Translator',
    subtitle: 'AUTOMATED SERVER TRANSLATION BOT',
    repoUrl: 'https://github.com/haider1928/discord-translator',
    language: 'JavaScript',
    featured: false,
    accentColor: 'var(--accent-blue)',
    categories: ['automation', 'web', 'bot'],
    tags: ['JAVASCRIPT', 'DISCORD.JS', 'TRANSLATION API', 'BOT'],
    description: 'A JavaScript Discord bot that translates server channel messages automatically across languages.',
    details: 'Listens to server channel messages, detects source language, invokes translation APIs, and posts translated text back into configured channels.'
  },
  {
    id: 'haider1928-github-io',
    num: '10',
    name: 'Personal Portfolio',
    subtitle: 'DEVELOPER PORTFOLIO REPOSITORY',
    repoUrl: 'https://github.com/haider1928/haider1928.github.io',
    language: 'HTML',
    featured: false,
    accentColor: 'var(--accent-cyan)',
    categories: ['web'],
    tags: ['HTML', 'CSS', 'JAVASCRIPT', 'PORTFOLIO'],
    description: 'The source repository for my personal developer portfolio website showcasing software engineering and security projects.',
    details: 'Built with clean HTML5, sharp CSS3 design tokens, and vanilla JavaScript. Features charcoal foundation theme, interactive CLI simulator, and project showcase.'
  }
];

/* ── DOM READY ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavigation();
  initScrollReveal();
  initHeroTerminal();
  initProjectsEngine();
  initContactForm();
});

/* ── 2. SCROLL PROGRESS INDICATOR ────────────────────────────────────────── */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  }, { passive: true });
}

/* ── 3. TOOLBAR NAVIGATION ────────────────────────────────────────────────── */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-links a');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || link.getAttribute('href').endsWith(`#${current}`)) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }
}

/* ── 4. SCROLL REVEAL ─────────────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(el => observer.observe(el));
}

/* ── 5. TERMINAL SIMULATOR ────────────────────────────────────────────────── */
const terminalScripts = {
  'ozmed.py': [
    { type: 'prompt', text: 'haider@dev:~$ python ozmed.py --mode autonomous' },
    { type: 'info',   text: '[*] Initializing OZMED AI Terminal Assistant...' },
    { type: 'dim',    text: '[+] Environment validated. Tool execution enabled.' },
    { type: 'info',   text: '[*] Executing CLI command: python check_system.py' },
    { type: 'success',text: '[+] Result: 0 errors. Execution completed.' },
    { type: 'prompt', text: 'haider@dev:~$ ' }
  ],
  'ai-bug-hunter': [
    { type: 'prompt', text: 'haider@dev:~$ python ai_bug_hunter.py --target site.com' },
    { type: 'info',   text: '[*] Loading XSS Knowledge Base & AI Agent...' },
    { type: 'dim',    text: '[+] Requesting next security step from LLM...' },
    { type: 'success',text: '[+] Step 1: Executing parameter reflection check' },
    { type: 'warn',   text: '[!] Reflection logged: parameter "q" reflected without encoding' },
    { type: 'prompt', text: 'haider@dev:~$ ' }
  ],
  'sargoshi': [
    { type: 'prompt', text: 'haider@dev:~$ python sargoshi_demo.py --analyze' },
    { type: 'info',   text: '[*] Security Research & Malware Analysis Environment' },
    { type: 'dim',    text: '[+] Parsing Discord API C2 communication structure...' },
    { type: 'success',text: '[+] Logged command channel payload mechanics for defensive audit.' },
    { type: 'prompt', text: 'haider@dev:~$ ' }
  ]
};

function initHeroTerminal() {
  const termBody = document.getElementById('terminalBody');
  const tabs = document.querySelectorAll('.terminal-tab');
  if (!termBody || tabs.length === 0) return;

  function renderScript(name) {
    termBody.innerHTML = '';
    const lines = terminalScripts[name] || [];
    lines.forEach(item => {
      const div = document.createElement('div');
      div.className = 'terminal-line';
      if (item.type === 'prompt') {
        div.innerHTML = `<span class="t-prompt">${item.text}</span><span class="t-cursor"></span>`;
      } else {
        div.innerHTML = `<span class="t-${item.type}">${item.text}</span>`;
      }
      termBody.appendChild(div);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      if (target) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderScript(target);
      }
    });
  });

  renderScript('ozmed.py');
}

/* ── 6. COMPREHENSIVE PROJECT FILTER, SEARCH & MODAL ENGINE ───────────────── */
function initProjectsEngine() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('projectSearchInput');
  const searchClear = document.getElementById('projectSearchClear');
  const featuredContainer = document.getElementById('featuredProjectsContainer');
  const secondaryContainer = document.getElementById('secondaryProjectsContainer');
  const modalOverlay = document.getElementById('projectModalOverlay');
  const modalClose = document.getElementById('projectModalClose');
  const modalBody = document.getElementById('projectModalBody');

  if (!featuredContainer || !secondaryContainer) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function renderProjects() {
    const searchTrimmed = currentSearch.trim().toLowerCase();

    const filtered = projectsData.filter(p => {
      // Category match
      const matchesCategory = currentCategory === 'all' || p.categories.includes(currentCategory);
      
      // Comprehensive Search match across Name, Subtitle, Description, Details, Language, Categories, and Tags
      const matchesSearch = !searchTrimmed || 
        p.name.toLowerCase().includes(searchTrimmed) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchTrimmed)) ||
        p.description.toLowerCase().includes(searchTrimmed) ||
        (p.details && p.details.toLowerCase().includes(searchTrimmed)) ||
        p.language.toLowerCase().includes(searchTrimmed) ||
        p.categories.some(c => c.toLowerCase().includes(searchTrimmed)) ||
        p.tags.some(t => t.toLowerCase().includes(searchTrimmed));

      // If user is actively typing a search query, search globally across all categories
      if (searchTrimmed) {
        return matchesSearch;
      }

      return matchesCategory && matchesSearch;
    });

    const featured = filtered.filter(p => p.featured);
    const secondary = filtered.filter(p => !p.featured);

    // Show/Hide Clear Button in Search Input
    if (searchClear) {
      searchClear.style.display = searchTrimmed ? 'block' : 'none';
    }

    // Render Featured Cards
    if (featured.length > 0) {
      featuredContainer.style.display = 'flex';
      featuredContainer.innerHTML = featured.map(p => `
        <div class="project-card-featured reveal active" style="border-left-color:${p.accentColor};" onclick="openProjectModal('${p.id}')">
          <div class="project-info">
            <div>
              <div class="project-num-tag">${p.num} // FEATURED REPOSITORY</div>
              <h3 class="project-title">${p.name}</h3>
              <p class="project-subtitle">${p.subtitle}</p>
              <p class="project-description">${p.description}</p>

              <div class="project-tech-stack" style="margin-bottom:20px;">
                ${p.tags.map(t => `<span class="badge badge-tech">[ ${t} ]</span>`).join('')}
              </div>
            </div>

            <div>
              <span class="btn btn-secondary">Inspect Details &amp; Repository →</span>
            </div>
          </div>

          <div class="project-preview-window">
            <div class="project-code-snippet">
<span style="color:var(--accent-cyan)">// REPOSITORY SPECIFICATION</span>
<span style="color:var(--text-muted)">Language: ${p.language}</span>
<span style="color:var(--accent-green)">Domain: ${p.categories.join(' / ').toUpperCase()}</span>

<span style="color:var(--text-main); font-weight:bold;">${p.details}</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      featuredContainer.style.display = 'none';
      featuredContainer.innerHTML = '';
    }

    // Render Secondary Cards
    if (secondary.length > 0) {
      secondaryContainer.style.display = 'grid';
      secondaryContainer.innerHTML = secondary.map(p => `
        <div class="project-card-sub reveal active" onclick="openProjectModal('${p.id}')">
          <div>
            <div class="project-num-tag">${p.num} // ${p.language}</div>
            <h4 class="heading-md" style="margin-bottom:4px;">${p.name}</h4>
            <p style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.76rem; margin-bottom:12px;">${p.subtitle}</p>
            <p style="color:var(--text-sub); font-size:0.84rem; margin-bottom:16px;">${p.description}</p>
          </div>
          <div>
            <div class="project-tech-stack" style="margin-bottom:14px;">
              ${p.tags.slice(0, 3).map(t => `<span class="badge badge-tech">[ ${t} ]</span>`).join('')}
            </div>
            <span style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.78rem;">Details &amp; Code →</span>
          </div>
        </div>
      `).join('');
    } else {
      secondaryContainer.style.display = 'none';
      secondaryContainer.innerHTML = '';
    }

    // Handle Empty State
    let noResultsEl = document.getElementById('noProjectsMessage');
    if (filtered.length === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noProjectsMessage';
        noResultsEl.style.cssText = 'color:var(--accent-amber); font-family:var(--font-mono); padding:24px; border:1px solid var(--border-subtle); background:var(--bg-surface); text-align:center; margin-top:20px; font-size:0.88rem;';
        featuredContainer.parentNode.insertBefore(noResultsEl, secondaryContainer);
      }
      noResultsEl.innerHTML = `[!] No projects matching "${escapeHtml(searchTrimmed)}" found. Try searching for "python", "ai", "security", "bot", "discord", or "typescript".`;
      noResultsEl.style.display = 'block';
    } else if (noResultsEl) {
      noResultsEl.style.display = 'none';
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderProjects();
    });
  });

  // Search Input Listeners (input, keyup, change)
  if (searchInput) {
    ['input', 'keyup', 'change'].forEach(evt => {
      searchInput.addEventListener(evt, (e) => {
        currentSearch = e.target.value;
        renderProjects();
      });
    });
  }

  // Clear Search Button Listener
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearch = '';
        renderProjects();
        searchInput.focus();
      }
    });
  }

  // Modal Open Function attached to window
  window.openProjectModal = function(id) {
    const p = projectsData.find(proj => proj.id === id);
    if (!p || !modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-cyan); margin-bottom:6px;">
        ${p.num} // REPOSITORY DETAILED SPECIFICATION
      </div>
      <h2 class="heading-lg" style="margin-bottom:2px;">${p.name}</h2>
      <p style="font-family:var(--font-mono); color:var(--text-muted); font-size:0.82rem; margin-bottom:20px;">${p.subtitle}</p>
      
      <div style="margin-bottom:20px;">
        <h4 class="heading-sm" style="margin-bottom:6px; color:var(--text-main);">Repository Overview</h4>
        <p style="color:var(--text-sub); font-size:0.92rem; line-height:1.7;">${p.description}</p>
      </div>

      <div style="margin-bottom:20px;">
        <h4 class="heading-sm" style="margin-bottom:6px; color:var(--text-main);">Technical Architecture &amp; Capabilities</h4>
        <p style="color:var(--text-sub); font-size:0.9rem; line-height:1.7;">${p.details}</p>
      </div>

      <div style="margin-bottom:24px;">
        <h4 class="heading-sm" style="margin-bottom:8px; color:var(--text-main);">Verified Technologies</h4>
        <div class="project-tech-stack">
          ${p.tags.map(t => `<span class="badge badge-tech">[ ${t} ]</span>`).join('')}
        </div>
      </div>

      <div>
        <a href="${p.repoUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%;">
          View Repository on GitHub →
        </a>
      </div>
    `;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Initial render
  renderProjects();
}

/* ── HELPER: ESCAPE HTML ─────────────────────────────────────────────────── */
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ── 7. CONTACT FORM HANDLER ─────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const message = document.getElementById('message')?.value || '';

    if (!name || !email || !message) return;

    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span>Processing...</span>`;

    setTimeout(() => {
      btn.innerHTML = `<span style="color:var(--accent-green);">✓ Prepared! Opening Email Client...</span>`;
      
      const mailtoUrl = `mailto:haidermohsin2468@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();
      }, 3000);
    }, 800);
  });
}
