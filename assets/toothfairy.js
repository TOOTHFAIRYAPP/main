(function () {
  // Before/after slider: the range input drives --pos on the box.
  function initSliders(root) {
    root.querySelectorAll('[data-tf-ba]').forEach(function (box) {
      var range = box.querySelector('input[type=range]');
      if (!range || box.dataset.tfReady) return;
      box.dataset.tfReady = '1';
      var set = function () { box.style.setProperty('--pos', range.value + '%'); };
      range.addEventListener('input', set);
      set();
    });
  }

  // Demo form: remember name + email so the confirmation after the reload can greet the visitor.
  var KEY = 'tf-form-request';
  function initForms(root) {
    root.querySelectorAll('[data-tf-remember]').forEach(function (form) {
      if (form.dataset.tfReady) return;
      form.dataset.tfReady = '1';
      form.addEventListener('submit', function () {
        try {
          var name = (form.querySelector('[name="contact[name]"]') || {}).value || '';
          var email = (form.querySelector('[name="contact[email]"]') || {}).value || '';
          sessionStorage.setItem(KEY, JSON.stringify({ name: name.trim(), email: email.trim() }));
        } catch (e) {}
      });
    });
    root.querySelectorAll('[data-tf-sent]').forEach(function (sent) {
      try {
        var data = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        var nameEl = sent.querySelector('[data-tf-name]'), emailEl = sent.querySelector('[data-tf-email]');
        if (data) {
          var first = (data.name || '').replace(/^Dr\.?\s+/i, '').split(/\s+/)[0];
          if (first && nameEl) nameEl.textContent = ', ' + first;
          if (data.email && emailEl) emailEl.textContent = 'at ' + data.email;
        }
      } catch (e) {}
      sent.focus({ preventScroll: true });
    });
  }

  // Sticky header: becomes a capsule once the page scrolls, slides away while
  // scrolling down past the first part of the page, and returns on scroll up.
  var ticking = false, lastY = window.scrollY, HIDE_AFTER = 480, DELTA = 6;
  function updateHeader() {
    ticking = false;
    var y = Math.max(0, window.scrollY), dy = y - lastY;
    document.querySelectorAll('.tf-section--header').forEach(function (h) {
      h.classList.toggle('is-scrolled', y > 8);
      var nav = h.querySelector('.tf-header');
      var sticky = nav && nav.hasAttribute('data-sticky');
      var menu = h.querySelector('.tf-menu');
      var busy = (menu && menu.open) || h.contains(document.activeElement);
      if (!sticky || y < HIDE_AFTER || busy) h.classList.remove('is-hidden');
      else if (dy > DELTA) h.classList.add('is-hidden');
      else if (dy < -DELTA) h.classList.remove('is-hidden');
    });
    if (Math.abs(dy) > DELTA) lastY = y;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  // Keyboard users: bring the header back when focus moves into it.
  document.addEventListener('focusin', function (e) {
    var h = e.target.closest && e.target.closest('.tf-section--header');
    if (h) h.classList.remove('is-hidden');
  });
  // Close the mobile menu after tapping a link in it.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.tf-menu__panel a');
    if (link) { var menu = link.closest('details'); if (menu) menu.removeAttribute('open'); }
  });

  // Scroll reveal: content fades up as it enters the screen; siblings come in one after another.
  var REVEAL = [
    '.tf-ba__head', '.tf-ba', '.tf-col', '.tf-flow > div:first-child', '.tf-flow__visual',
    '.tf-video__text', '.tf-card', '.tf-pricing > div:first-child', '.tf-plan',
    '.tf-faq > div:first-child', '.tf-q', '.tf-cta > *', '.tf-form-panel > div:first-child',
    '.tf-form-panel form', '.tf-footer'
  ].join(',');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var designMode = window.Shopify && window.Shopify.designMode;
  var observer = (!reduceMotion && !designMode && 'IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  function initReveal(root) {
    if (!observer) return;
    root.querySelectorAll(REVEAL).forEach(function (el) {
      if (el.dataset.tfReveal) return;
      el.dataset.tfReveal = '1';
      // Already on screen at load: leave it alone, so nothing flickers.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      var i = 0, sib = el;
      while ((sib = sib.previousElementSibling) && i < 5) { if (sib.matches(REVEAL)) i++; }
      el.style.setProperty('--tf-d', (i * 90) + 'ms');
      el.classList.add('tf-reveal');
      observer.observe(el);
    });
  }

  // Hero tilt: the phones turn a few degrees towards the mouse (desktop only).
  var canTilt = !reduceMotion && !designMode && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function initTilt(root) {
    if (!canTilt) return;
    root.querySelectorAll('[data-tf-tilt]').forEach(function (stage) {
      if (stage.dataset.tfTiltReady) return;
      stage.dataset.tfTiltReady = '1';
      var phones = stage.querySelector('.tf-hero-c__phones');
      var area = stage.closest('.tf-hero-c') || stage;
      var raf = 0, mx = 0, my = 0;
      function apply() {
        raf = 0;
        var r = stage.getBoundingClientRect();
        var x = Math.max(-1, Math.min(1, (mx - (r.left + r.width / 2)) / (r.width / 2)));
        var y = Math.max(-1, Math.min(1, (my - (r.top + r.height / 2)) / (r.height / 2)));
        phones.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg');
        phones.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      }
      area.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(apply); });
      area.addEventListener('mouseleave', function () { phones.style.setProperty('--ry', '0deg'); phones.style.setProperty('--rx', '0deg'); });
    });
  }

  function init(root) { initSliders(root); initForms(root); initReveal(root); initTilt(root); updateHeader(); }
  init(document);
  // Re-run when a section is added or changed in the theme editor.
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
