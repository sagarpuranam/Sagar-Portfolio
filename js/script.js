(() => {
  'use strict';
  const get = (selector, parent = document) => parent.querySelector(selector);
  const menuButton = get('#menuBtn');
  const mobileMenu = get('#mobile-menu');
  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('menu-open', open);
  };
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else revealElements.forEach((element) => element.classList.add('in'));

  // Optional focus tabs used by the reference layout. This stays harmless if
  // the section is not present, so future HTML edits cannot cause an error.
  const focusText = get('#focus-text');
  const focusCopy = {
    uiux: 'I start every screen with the person using it: what they are trying to do, and the fastest, clearest path there.',
    frontend: 'I turn ideas into responsive, accessible interfaces with clean HTML, CSS, and JavaScript.',
    ai: 'I build the systems that make products smarter using computer vision, NLP, and machine learning.'
  };
  document.querySelectorAll('.focus-tab').forEach((tab) => tab.addEventListener('click', () => {
    if (!focusText || !focusCopy[tab.dataset.focus]) return;
    document.querySelectorAll('.focus-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    focusText.textContent = focusCopy[tab.dataset.focus];
  }));

  const form = get('#contactForm');
  const status = get('#formStatus');
  const button = get('#submitButton');
  const EMAILJS = { publicKey: 'YOUR_PUBLIC_KEY', serviceId: 'YOUR_SERVICE_ID', templateId: 'YOUR_TEMPLATE_ID' };
  const configured = Object.values(EMAILJS).every((value) => value && !value.startsWith('YOUR_'));
  if (configured && window.emailjs) window.emailjs.init({ publicKey: EMAILJS.publicKey });
  const mailtoFallback = ({ name, email, message }) => {
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:sagarpuranam058@gmail.com?subject=${subject}&body=${body}`;
  };
  if (form && status && button) form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); status.textContent = 'Please complete all fields correctly.'; return; }
    const data = { name: get('#fname')?.value.trim(), email: get('#femail')?.value.trim(), message: get('#fmsg')?.value.trim() };
    button.disabled = true; button.setAttribute('aria-busy', 'true');
    if (!configured || !window.emailjs) { status.textContent = 'Opening your email app…'; mailtoFallback(data); button.disabled = false; button.removeAttribute('aria-busy'); return; }
    status.textContent = 'Sending…';
    try {
      await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { from_name: data.name, from_email: data.email, message: data.message });
      form.reset(); status.textContent = 'Message sent — thank you!';
    } catch {
      status.textContent = 'Email delivery failed. Opening your email app…'; mailtoFallback(data);
    } finally { button.disabled = false; button.removeAttribute('aria-busy'); }
  });
})();
