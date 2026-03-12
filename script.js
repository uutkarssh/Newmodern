/* =====================================================
   MODERN FOOD EXPRESS — script.js  v7  (fully fixed)
   - No loader references
   - Single execution guard
   - Hamburger works on ALL pages
   - All features intact
   ===================================================== */
(function () {
  'use strict';

  if (window.__mfeScriptLoaded) return;
  window.__mfeScriptLoaded = true;

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  ready(function () {

    /* NAVBAR SCROLL */
    var navEl = document.getElementById('nav');
    function onScroll() {
      if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* HAMBURGER MENU — works on every page */
    var hbg   = document.getElementById('hbg');
    var mobNv = document.getElementById('mobNav');
    var mobOv = document.getElementById('mobOv');

    function closeMenu() {
      if (hbg)   { hbg.classList.remove('open'); hbg.setAttribute('aria-expanded', 'false'); }
      if (mobNv) mobNv.classList.remove('open');
      if (mobOv) mobOv.classList.remove('open');
      document.body.style.overflow = '';
    }
    function openMenu() {
      if (hbg)   { hbg.classList.add('open'); hbg.setAttribute('aria-expanded', 'true'); }
      if (mobNv) mobNv.classList.add('open');
      if (mobOv) mobOv.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    if (hbg) {
      hbg.addEventListener('click', function (e) {
        e.stopPropagation();
        mobNv && mobNv.classList.contains('open') ? closeMenu() : openMenu();
      });
    }
    if (mobOv) mobOv.addEventListener('click', closeMenu);
    if (mobNv) {
      mobNv.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    /* IMAGE SLIDER (index.html) */
    var track    = document.getElementById('slTrack');
    var dotsWrap = document.getElementById('slDots');
    var prog     = document.getElementById('slProg');
    var slides   = track ? Array.from(track.querySelectorAll('.slide')) : [];
    var cur = 0, slTimer = null;

    if (slides.length && dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'sl-dot' + (i === 0 ? ' on' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsWrap.appendChild(d);
      });
    }

    function goTo(n) {
      if (!slides.length) return;
      cur = ((n % slides.length) + slides.length) % slides.length;
      if (track) track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      if (dotsWrap) dotsWrap.querySelectorAll('.sl-dot').forEach(function (d, i) {
        d.classList.toggle('on', i === cur);
      });
      if (prog) { prog.style.animation = 'none'; void prog.offsetHeight; prog.style.animation = ''; }
    }

    function resetTimer() {
      if (slTimer) clearInterval(slTimer);
      if (slides.length) slTimer = setInterval(function () { goTo(cur + 1); }, 5000);
    }

    if (slides.length) {
      resetTimer();
      var slNext = document.getElementById('slNext');
      var slPrev = document.getElementById('slPrev');
      if (slNext) slNext.addEventListener('click', function () { goTo(cur + 1); resetTimer(); });
      if (slPrev) slPrev.addEventListener('click', function () { goTo(cur - 1); resetTimer(); });
      var sliderWrap = track && track.closest('.slider-wrap');
      if (sliderWrap) {
        sliderWrap.addEventListener('mouseenter', function () { if (slTimer) clearInterval(slTimer); });
        sliderWrap.addEventListener('mouseleave', resetTimer);
      }
      var touchStartX = 0;
      if (track) {
        track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
          var dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 45) { dx < 0 ? goTo(cur + 1) : goTo(cur - 1); resetTimer(); }
        });
      }
    }

    /* SCROLL-FADE ANIMATIONS */
    var fadeEls = document.querySelectorAll('.fade');
    if (fadeEls.length && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
      fadeEls.forEach(function (el) { io.observe(el); });
    } else {
      fadeEls.forEach(function (el) { el.classList.add('vis'); });
    }

    /* MENU TABS (menu.html) */
    document.querySelectorAll('.mf-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.mf-btn').forEach(function (b) { b.classList.remove('on'); });
        document.querySelectorAll('.menu-sec').forEach(function (s) { s.classList.remove('on'); });
        btn.classList.add('on');
        var sec = document.getElementById(btn.dataset.tab);
        if (sec) sec.classList.add('on');
      });
    });

    /* GALLERY LIGHTBOX (gallery.html) */
    var lb    = document.getElementById('lightbox');
    var lbImg = document.getElementById('lbImg');
    var lbSrcs = [], lbIdx = 0;

    function lbOpen(srcs, idx) {
      if (!srcs.length) return;
      lbSrcs = srcs; lbIdx = idx;
      if (lbImg) lbImg.src = srcs[idx];
      if (lb) lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function lbClose() {
      if (lb) lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    function lbGo(dir) {
      if (!lbSrcs.length) return;
      lbIdx = ((lbIdx + dir) + lbSrcs.length) % lbSrcs.length;
      if (lbImg) lbImg.src = lbSrcs[lbIdx];
    }

    var lbCloseBtn = document.getElementById('lbClose');
    var lbPrevBtn  = document.getElementById('lbPrev');
    var lbNextBtn  = document.getElementById('lbNext');
    if (lbCloseBtn) lbCloseBtn.addEventListener('click', lbClose);
    if (lbPrevBtn)  lbPrevBtn.addEventListener('click', function () { lbGo(-1); });
    if (lbNextBtn)  lbNextBtn.addEventListener('click', function () { lbGo(1); });
    if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });

    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') lbGo(-1);
      if (e.key === 'ArrowRight') lbGo(1);
    });

    var galItems = document.querySelectorAll('.gal-item');
    if (galItems.length) {
      var srcs = [];
      galItems.forEach(function (el) {
        var img = el.querySelector('img');
        if (img && img.getAttribute('src')) srcs.push(img.getAttribute('src'));
      });
      galItems.forEach(function (item, i) {
        item.addEventListener('click', function () { lbOpen(srcs, i); });
      });
    }

    /* FORMS */
    ['form-res', 'form-contact'].forEach(function (id) {
      var form = document.getElementById(id);
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('.btn-submit');
        var orig = btn ? btn.textContent : '';
        if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
        setTimeout(function () {
          if (btn) { btn.textContent = orig; btn.disabled = false; }
          var msg = form.querySelector('.success-msg');
          if (msg) { msg.classList.add('show'); setTimeout(function () { msg.classList.remove('show'); }, 5000); }
          form.reset();
        }, 1400);
      });
    });

    /* ADD TO CART FLASH */
    document.querySelectorAll('.btn-add').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
        var svg = btn.querySelector('svg');
        if (svg) svg.style.stroke = '#fff';
        setTimeout(function () {
          btn.style.background = '';
          if (svg) svg.style.stroke = '';
        }, 1000);
      });
    });

    /* RATING BARS (reviews.html) */
    var rbarFills = document.querySelectorAll('.rbar-fill');
    if (rbarFills.length && 'IntersectionObserver' in window) {
      var rIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width || '0%';
            rIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      rbarFills.forEach(function (b) { rIO.observe(b); });
    }

    /* STAT COUNTERS */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
      var cIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = +el.dataset.count;
          var suffix = el.dataset.suffix || '';
          var val = 0, step = target / 60;
          var t = setInterval(function () {
            val += step;
            el.textContent = Math.floor(Math.min(val, target)) + suffix;
            if (val >= target) clearInterval(t);
          }, target > 999 ? 14 : 30);
          cIO.unobserve(el);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cIO.observe(el); });
    }

  });
})();
