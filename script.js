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
  };
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  }
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); current.unobserve(entry.target); }
    }), { threshold: 0.12 });
    reveals.forEach((item) => observer.observe(item));
  } else reveals.forEach((item) => item.classList.add('in'));
  document.querySelectorAll('.field input, .field textarea').forEach((field) => {
    const wrapper = field.closest('.field');
    field.addEventListener('focus', () => wrapper?.classList.add('focused'));
    field.addEventListener('blur', () => wrapper?.classList.remove('focused'));
  });
  const form = get('#contactForm');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();
    const name = get('#fname').value.trim();
    const email = get('#femail').value.trim();
    const message = get('#fmsg').value.trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    get('#formStatus').textContent = 'Opening your email app…';
    window.location.href = `mailto:sagarpuranam058@gmail.com?subject=${subject}&body=${body}`;
  });
(function () {
        var scroller = document.getElementById('projScroller');
        var prev = document.getElementById('projPrev');
        var next = document.getElementById('projNext');
        if (!scroller || !prev || !next) return;
        function scrollByCard(dir) {
          var card = scroller.querySelector('.proj-card');
          var amount = card ? card.getBoundingClientRect().width + 24 : 340;
          scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
        }
        prev.addEventListener('click', function () { scrollByCard(-1); });
        next.addEventListener('click', function () { scrollByCard(1); });
      })();
})();
