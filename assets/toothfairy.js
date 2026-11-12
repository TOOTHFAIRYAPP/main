(function () {
  // Before/after slider: the range input drives --pos on the box. The logo face in the
  // handle looks the way you drag, and nudges once when it first scrolls into view.
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function initSliders(root) {
    root.querySelectorAll('[data-tf-ba]').forEach(function (box) {
      var range = box.querySelector('input[type=range]');
      if (!range || box.dataset.tfReady) return;
      box.dataset.tfReady = '1';
      var last = +range.value, lookTimer = 0, touched = false;
      var set = function () { box.style.setProperty('--pos', range.value + '%'); };
      var look = function (dir) {
        box.setAttribute('data-look', dir);
        clearTimeout(lookTimer);
        lookTimer = setTimeout(function () { box.removeAttribute('data-look'); }, 650);
      };
      range.addEventListener('input', function () {
        var v = +range.value;
        if (v !== last) look(v < last ? 'left' : 'right');
        last = v; set();
      });
      var start = function () { touched = true; box.classList.add('is-dragging'); };
      var end = function () { box.classList.remove('is-dragging'); };
      range.addEventListener('pointerdown', start);
      range.addEventListener('keydown', function () { touched = true; });
      window.addEventListener('pointerup', end);
      range.addEventListener('blur', end);
      set();
      // One gentle nudge when the slider first comes into view.
      if (calm || !('IntersectionObserver' in window) || (window.Shopify && window.Shopify.designMode)) return;
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var keys = [[0, 50], [450, 40], [1050, 60], [1500, 50]], t0 = 0;
        setTimeout(function () {
          requestAnimationFrame(function step(ts) {
            if (touched) return;
            if (!t0) t0 = ts;
            var t = ts - t0, i = 1;
            while (i < keys.length - 1 && t > keys[i][0]) i++;
            var a = keys[i - 1], b = keys[i], k = Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0])));
            k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            var v = a[1] + (b[1] - a[1]) * k;
            if (Math.round(v) !== Math.round(last)) look(v < last ? 'left' : 'right');
            range.value = v; last = v; set();
            if (t < keys[keys.length - 1][0]) requestAnimationFrame(step);
          });
        }, 400);
      }, { threshold: 0.6 });
      io.observe(box);
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
  // Mobile menu: lock page scroll while open; close on outside tap or Escape.
  document.addEventListener('toggle', function (e) {
    if (!e.target.matches || !e.target.matches('[data-tf-menu]')) return;
    document.documentElement.classList.toggle('tf-menu-open', e.target.open);
  }, true);
  document.addEventListener('click', function (e) {
    document.querySelectorAll('[data-tf-menu][open]').forEach(function (m) { if (!m.contains(e.target)) m.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[data-tf-menu][open]').forEach(function (m) { m.removeAttribute('open'); var s = m.querySelector('summary'); if (s) s.focus(); });
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
      if (el.closest('[data-tf-slider]') && window.matchMedia('(max-width: 860px)').matches) return;
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

  // Cookie banner on top of Shopify's Customer Privacy API.
  function initCookies() {
    var box = document.querySelector('[data-tf-cookie]');
    if (!box || box.dataset.tfReady) return;
    box.dataset.tfReady = '1';
    var prefs = box.querySelector('#tf-cookie-prefs');
    var moreBtn = box.querySelector('[data-tf-cookie-action="prefs"]');
    var saveBtn = box.querySelector('[data-tf-cookie-action="save"]');
    var inputs = box.querySelectorAll('[data-tf-consent]');
    var api = null;
    function open(withPrefs) {
      if (api && api.currentVisitorConsent) {
        var c = api.currentVisitorConsent() || {};
        inputs.forEach(function (i) { i.checked = c[i.dataset.tfConsent] === 'yes'; });
      }
      showPrefs(!!withPrefs);
      box.hidden = false;
      requestAnimationFrame(function () { box.classList.add('is-in'); });
    }
    function close() {
      box.classList.remove('is-in');
      setTimeout(function () { box.hidden = true; }, 400);
    }
    function showPrefs(on) {
      prefs.hidden = !on; saveBtn.hidden = !on;
      box.classList.toggle('is-prefs', on);
      moreBtn.hidden = on;
      moreBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function decide(c) {
      if (!api) { close(); return; }
      api.setTrackingConsent({ analytics: c.analytics, marketing: c.marketing, preferences: c.preferences, sale_of_data: c.marketing }, close);
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tf-cookie-action]');
      if (!b) return;
      var a = b.dataset.tfCookieAction;
      if (a === 'accept') decide({ analytics: true, marketing: true, preferences: true });
      else if (a === 'reject') decide({ analytics: false, marketing: false, preferences: false });
      else if (a === 'prefs') showPrefs(true);
      else if (a === 'save') {
        var c = {}; inputs.forEach(function (i) { c[i.dataset.tfConsent] = i.checked; }); decide(c);
      }
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-tf-cookie-settings]')) { e.preventDefault(); open(true); }
    });
    if (!window.Shopify || !window.Shopify.loadFeatures) return;
    window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], function (err) {
      if (err) return;
      api = window.Shopify.customerPrivacy;
      if (api && api.shouldShowBanner && api.shouldShowBanner()) open(false);
    });
  }
  initCookies();

  // App Store QR codes (desktop only): load the generator on demand and draw a branded SVG.
  var qrDesktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches;
  var qrLib = null;
  function loadQrLib(src) {
    if (window.qrcode) return Promise.resolve();
    if (!qrLib) qrLib = new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = fail; document.head.appendChild(s);
    });
    return qrLib;
  }
  function drawQr(box) {
    // Short, locale-neutral App Store link (fewer, larger dots; opens the visitor's own store).
    var url = box.dataset.tfQr, id = (url.match(/id(\d{6,})/) || [])[1];
    if (id) url = 'https://apps.apple.com/app/id' + id;
    var qr = window.qrcode(0, 'Q'); qr.addData(url); qr.make();
    // Standard square modules (reliable to scan, adjacent modules merge into solid shapes), pink finder
    // "eyes" and a clear centre for the logo face (error correction Q covers it).
    var n = qr.getModuleCount(), c = (n - 1) / 2, hole = n * 0.14, ink = '#1a1517', pink = '#e6007e', dark = [], eyes = [];
    var isEye = function (r, k) { return [[2, 2], [2, n - 5], [n - 5, 2]].some(function (e) { return r >= e[0] && r < e[0] + 3 && k >= e[1] && k < e[1] + 3; }); };
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) {
      if (!qr.isDark(r, k) || Math.hypot(r - c, k - c) < hole) continue;
      (isEye(r, k) ? eyes : dark).push('<rect x="' + k + '" y="' + r + '" width="1.04" height="1.04"/>');
    }
    var svg = '<svg viewBox="0 0 ' + n + ' ' + n + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="crispEdges">' +
      '<g fill="' + ink + '">' + dark.join('') + '</g><g fill="' + pink + '">' + eyes.join('') + '</g></svg>';
    var code = box.querySelector('.tf-qr__code');
    code.insertAdjacentHTML('afterbegin', svg);
  }
  function initQr(root) {
    if (!qrDesktop) return;
    var boxes = [].filter.call(root.querySelectorAll('[data-tf-qr]'), function (b) { return !b.dataset.tfReady; });
    if (!boxes.length) return;
    loadQrLib(boxes[0].dataset.tfQrLib).then(function () {
      boxes.forEach(function (b) { b.dataset.tfReady = '1'; try { drawQr(b); } catch (e) { b.hidden = true; } });
    }).catch(function () { boxes.forEach(function (b) { b.hidden = true; }); });
  }

  // Eyebrow ticker: the lines take turns every few seconds (static with reduced motion).
  function initTickers(root) {
    root.querySelectorAll('[data-tf-ticker]').forEach(function (t) {
      var items = t.querySelectorAll('.tf-ticker__item');
      if (t.dataset.tfReady || items.length < 2 || calm) return;
      t.dataset.tfReady = '1';
      var i = 0;
      setInterval(function () {
        if (document.hidden) return;
        var cur = items[i], next = items[(i + 1) % items.length];
        cur.classList.remove('is-active'); cur.classList.add('is-leaving');
        next.classList.remove('is-leaving'); next.classList.add('is-active');
        setTimeout(function () { cur.classList.remove('is-leaving'); }, 700);
        i = (i + 1) % items.length;
      }, 2800);
    });
  }

  // Swipe sliders on small screens: dots that follow the scroll position.
  function initSliderDots(root) {
    root.querySelectorAll('[data-tf-slider]').forEach(function (track) {
      if (track.dataset.tfDots) return;
      var items = track.children; if (items.length < 2) return;
      track.dataset.tfDots = '1';
      var dots = document.createElement('div'); dots.className = 'tf-slider-dots';
      [].forEach.call(items, function (item, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to item ' + (i + 1));
        b.addEventListener('click', function () { track.scrollTo({ left: item.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: 'smooth' }); });
        dots.appendChild(b);
      });
      track.insertAdjacentElement('afterend', dots);
      var update = function () {
        var best = 0, bestD = Infinity, start = track.scrollLeft;
        [].forEach.call(items, function (item, i) { var d = Math.abs(item.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft) - start); if (d < bestD) { bestD = d; best = i; } });
        [].forEach.call(dots.children, function (d, i) { d.classList.toggle('is-active', i === best); });
      };
      track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
      update();
    });
  }

  // Videos: start muted inline playback explicitly (iOS can ignore the autoplay attribute),
  // play only while visible, and offer a play button if the device still refuses (e.g. Low Power Mode).
  var videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) tryPlay(v); else if (!v.paused) v.pause();
    });
  }, { threshold: 0.2 }) : null;
  function tryPlay(v) {
    var p = v.play();
    if (p && p.catch) p.then(function () { v.parentElement.classList.remove('needs-tap'); }).catch(function () { v.parentElement.classList.add('needs-tap'); });
  }
  function initVideos(root) {
    root.querySelectorAll('.tf-wrap video').forEach(function (v) {
      if (v.dataset.tfReady) return;
      v.dataset.tfReady = '1';
      v.muted = true; v.defaultMuted = true; v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.playsInline = true; v.loop = true;
      v.removeAttribute('controls');
      var host = v.parentElement;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      var tap = document.createElement('button'); tap.type = 'button'; tap.className = 'tf-video-tap'; tap.setAttribute('aria-label', 'Play video');
      tap.innerHTML = '<span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 3.5v13l11-6.5z" fill="#1a1517"/></svg></span>';
      tap.addEventListener('click', function () { v.play().then(function () { host.classList.remove('needs-tap'); }).catch(function () {}); });
      host.appendChild(tap);
      if (videoObserver) videoObserver.observe(v); else tryPlay(v);
    });
  }

  function init(root) { initSliders(root); initForms(root); initReveal(root); initTilt(root); initQr(root); initTickers(root); initSliderDots(root); initVideos(root); updateHeader(); }
  init(document);
  // Re-run when a section is added or changed in the theme editor.
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
