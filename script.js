(function () {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    nav.hidden = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      nav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

document.getElementById('footer-year').textContent = `© ${new Date().getFullYear()} haaymaakt.nl · Rob de Haay`;

(function () {
  const form = document.getElementById('contact-form');
  const errorEl = form.querySelector('.form-error');
  const submitBtn = form.querySelector('button[type="submit"]');
  const thankYou = document.querySelector('.thank-you');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const data = new FormData(form);
    if (!data.get('Naam').trim()) {
      showError('Vul uw naam in.');
      return;
    }
    if (!data.get('Telefoon').trim() && !data.get('email').trim()) {
      showError('Vul een telefoonnummer of e-mailadres in, zodat ik contact kan opnemen.');
      return;
    }

    data.append('_subject', 'Nieuwe aanvraag via haaymaakt.nl');
    data.append('_template', 'table');
    data.append('_captcha', 'false');

    submitBtn.disabled = true;
    fetch('https://formsubmit.co/ajax/haaytohb@outlook.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
    })
      .then((r) => r.json())
      .then(() => {
        form.hidden = true;
        thankYou.hidden = false;
      })
      .catch(() => {
        submitBtn.disabled = false;
        showError('Verzenden lukte niet. Bel of app Rob gerust direct op 06 52 47 91 77.');
      });
  });
})();

(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function dropIn(gridId, opts) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const o = Object.assign(
      { animation: 'haay-drop-in', duration: 900, stagger: 110, easing: 'cubic-bezier(0.16, 0.9, 0.28, 1)', threshold: 0.25 },
      opts || {}
    );
    const cards = Array.from(grid.children);
    if (!cards.length) return;
    cards.forEach((c) => { c.style.opacity = '0'; c.style.willChange = 'transform, opacity'; });

    const play = () => cards.forEach((c, i) => {
      c.style.animation = `${o.animation} ${o.duration}ms ${o.easing} ${i * o.stagger}ms both`;
      c.addEventListener('animationend', () => { c.style.willChange = ''; }, { once: true });
    });

    if (!('IntersectionObserver' in window)) { play(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: o.threshold });
    io.observe(grid);
  }

  dropIn('cijfers-grid');
  dropIn('werkwijze-grid', { animation: 'haay-rise-in' });
  dropIn('waarom-lijst', { animation: 'haay-slide-in', duration: 520, stagger: 160, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', threshold: 0.35 });

  document.querySelectorAll('#reviews [data-sterren]').forEach((row, rowIndex) => {
    const stars = Array.from(row.children);
    if (!stars.length) return;
    stars.forEach((s) => { s.style.opacity = '0'; s.style.transformOrigin = '50% 50%'; });

    const play = () => stars.forEach((s, i) => {
      const delay = rowIndex * 140 + i * 90;
      s.style.animation = `haay-star-pop 460ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms both`;
      s.addEventListener('animationend', () => { s.style.animation = ''; s.style.opacity = ''; s.style.transform = ''; }, { once: true });
    });

    if (!('IntersectionObserver' in window)) { play(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(row);
  });

  const heading = document.getElementById('over-titel');
  const word = document.getElementById('haay-woord');
  if (heading && word) {
    heading.style.opacity = '0';
    const playGreeting = () => {
      heading.style.animation = 'haay-fade-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both';
      word.style.animation = 'haay-wave 1100ms ease-in-out 420ms both';
      word.addEventListener('animationend', () => { word.style.animation = ''; word.style.transform = ''; }, { once: true });
    };
    if (!('IntersectionObserver' in window)) {
      playGreeting();
    } else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { playGreeting(); io.disconnect(); }
      }, { threshold: 0.6 });
      io.observe(heading);
    }
  }

  const headerWord = document.getElementById('header-haay-woord');
  if (headerWord) {
    setTimeout(() => {
      headerWord.style.animation = 'haay-wave 1100ms ease-in-out both';
      headerWord.addEventListener('animationend', () => { headerWord.style.animation = ''; headerWord.style.transform = ''; }, { once: true });
    }, 600);
  }

  const parallaxGrid = document.getElementById('diensten-grid');
  if (parallaxGrid) {
    const cards = Array.from(parallaxGrid.children);
    const depths = cards.map((_, i) => [1, 0.55, 0.15][i % 3]);
    cards.forEach((c) => { c.style.willChange = 'transform'; });
    let raf = null;
    const update = () => {
      raf = null;
      const r = parallaxGrid.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      const shift = (0.5 - progress) * 150;
      cards.forEach((c, i) => { c.style.transform = `translate3d(0, ${(shift * depths[i]).toFixed(2)}px, 0)`; });
    };
    window.addEventListener('scroll', () => { if (raf == null) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
