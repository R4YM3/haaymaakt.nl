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
