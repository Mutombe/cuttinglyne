/* Cutting Lyne — site interactions */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Mobile drawer ---------- */
  var drawer = $('#drawer');
  if (drawer) {
    var open = function () { drawer.classList.add('is-open'); document.body.classList.add('no-scroll'); };
    var shut = function () { drawer.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
    $$('[data-drawer-open]').forEach(function (b) { b.addEventListener('click', open); });
    $$('[data-drawer-close]').forEach(function (b) { b.addEventListener('click', shut); });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', shut); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  /* ---------- Scroll progress + back to top ---------- */
  var bar = $('#progress');
  var top = $('#totop');
  var onScroll = function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (top) top.classList.toggle('on', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.rv');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 90) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Counters ---------- */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dec = (String(target).split('.')[1] || '').length;
        var t0 = null, dur = 1700;
        var tick = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Hero slider ---------- */
  var hero = $('#hero');
  if (hero) {
    var slides = $$('[data-slide]', hero);
    var dots = $$('[data-dot]', hero);
    if (slides.length > 1) {
      var idx = 0, timer = null;
      var go = function (n) {
        idx = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) {
          s.style.opacity = i === idx ? '1' : '0';
          s.style.transition = 'opacity 1.1s cubic-bezier(.16,1,.3,1)';
        });
        dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); });
      };
      var loop = function () { timer = setInterval(function () { go(idx + 1); }, 6500); };
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { clearInterval(timer); go(i); loop(); });
      });
      go(0); loop();
    }
  }

  /* ---------- Testimonial slider ---------- */
  $$('[data-quotes]').forEach(function (root) {
    var track = $('[data-quotes-track]', root);
    var items = $$('.quote', track);
    if (!track || !items.length) return;
    var at = 0;
    var perView = function () { return window.innerWidth >= 900 ? 2 : 1; };
    var max = function () { return Math.max(0, items.length - perView()); };
    var render = function () {
      at = Math.min(at, max());
      track.style.transform = 'translateX(-' + (at * (100 / perView())) + '%)';
      var p = $('[data-quotes-prev]', root), n = $('[data-quotes-next]', root);
      if (p) p.disabled = at <= 0;
      if (n) n.disabled = at >= max();
    };
    var pv = $('[data-quotes-prev]', root);
    var nx = $('[data-quotes-next]', root);
    if (pv) pv.addEventListener('click', function () { at = Math.max(0, at - 1); render(); });
    if (nx) nx.addEventListener('click', function () { at = Math.min(max(), at + 1); render(); });
    window.addEventListener('resize', render);
    render();
  });

  /* ---------- Feature card carousel (dark panel) ---------- */
  $$('[data-fscroll]').forEach(function (root) {
    var vp = $('[data-fscroll-vp]', root);
    if (!vp) return;
    var step = function () { return vp.clientWidth * 0.55; };
    var pv = $('[data-fscroll-prev]', root);
    var nx = $('[data-fscroll-next]', root);
    if (pv) pv.addEventListener('click', function () { vp.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (nx) nx.addEventListener('click', function () { vp.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq').forEach(function (faq) {
    $$('.faq__q', faq).forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq__i');
        var isOpen = item.classList.contains('is-open');
        $$('.faq__i', faq).forEach(function (i) {
          i.classList.remove('is-open');
          $('.faq__q', i).setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) { item.classList.add('is-open'); q.setAttribute('aria-expanded', 'true'); }
      });
    });
  });

  /* ---------- Shipment tracking (demo lookup) ---------- */
  var tform = $('#track-form');
  if (tform) {
    var STAGES = [
      { at: 1, label: 'Booking confirmed',  place: 'Origin office' },
      { at: 2, label: 'Collected',          place: 'Shipper warehouse' },
      { at: 3, label: 'Export cleared',     place: 'Origin customs' },
      { at: 4, label: 'In transit',         place: 'On the water / in the air' },
      { at: 5, label: 'Arrived at gateway', place: 'Destination port' },
      { at: 6, label: 'Out for delivery',   place: 'Final mile' }
    ];
    tform.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('#track-id');
      var out = $('#track-out');
      var ref = (input.value || '').trim().toUpperCase();
      if (!ref) { input.focus(); return; }
      // Deterministic demo stage from the reference string.
      var sum = 0;
      for (var i = 0; i < ref.length; i++) sum += ref.charCodeAt(i);
      var stage = STAGES[sum % STAGES.length];
      var eta = new Date(Date.now() + ((STAGES.length - stage.at) * 2 + 1) * 86400000);
      var fmt = eta.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      var pips = '';
      for (var s = 1; s <= STAGES.length; s++) pips += '<i class="' + (s <= stage.at ? 'on' : '') + '"></i>';
      out.innerHTML =
        '<b>' + ref + ' &middot; ' + stage.label + '</b>' +
        'Last scan: ' + stage.place + '. Estimated delivery ' + fmt + '.' +
        '<div class="track__steps">' + pips + '</div>' +
        '<p style="margin-top:12px;font-size:.8125rem;opacity:.75">Demo lookup. Connect your TMS or carrier API for live milestones.</p>';
      out.hidden = false;
    });
  }

  /* ---------- Contact / quote form ---------- */
  $$('[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = $('[data-form-note]', form);
      if (note) {
        note.hidden = false;
        note.innerHTML = '<b>Thank you &mdash; your request is with our team.</b>' +
          'A Cutting Lyne coordinator will come back to you within one business day.';
      }
      form.reset();
    });
  });

  /* ---------- Active nav link ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link, .drawer__nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === here) a.classList.add('is-active');
  });

  /* ---------- Year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
