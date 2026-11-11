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

  // Sticky header: compact, frosted look once the page has scrolled.
  var ticking = false;
  function updateHeader() {
    ticking = false;
    var scrolled = window.scrollY > 8;
    document.querySelectorAll('.tf-section--header').forEach(function (h) { h.classList.toggle('is-scrolled', scrolled); });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHeader); }
  }, { passive: true });
  // Close the mobile menu after tapping a link in it.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.tf-menu__panel a');
    if (link) { var menu = link.closest('details'); if (menu) menu.removeAttribute('open'); }
  });

  function init(root) { initSliders(root); initForms(root); updateHeader(); }
  init(document);
  // Re-run when a section is added or changed in the theme editor.
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
