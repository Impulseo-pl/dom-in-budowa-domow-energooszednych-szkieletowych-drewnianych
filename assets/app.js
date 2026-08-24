/* DOM-IN — Impulseo 2026 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav: tło po scrollu ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('on', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Menu mobilne ---- */
  var burger = document.querySelector('.burger');
  var drawer = document.querySelector('.drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('on');
      burger.classList.toggle('on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        drawer.classList.remove('on');
        burger.classList.remove('on');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Reveal przy scrollu ---- */
  var rv = document.querySelectorAll('.rv');
  if (rv.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      rv.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Parallax hero ---- */
  var heroImg = document.querySelector('.hero-shot img');
  if (heroImg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 700);
        heroImg.style.transform = 'scale(1.06) translate3d(0,' + (y * 0.055) + 'px,0)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- FAQ ---- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-a');
      var open = item.classList.contains('on');

      item.parentElement.querySelectorAll('.faq-item.on').forEach(function (o) {
        o.classList.remove('on');
        o.querySelector('.faq-a').style.height = '0px';
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!open) {
        item.classList.add('on');
        panel.style.height = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- Lightbox galerii ---- */
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gal figure'));
  if (figs.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Powiększone zdjęcie realizacji');
    lb.innerHTML =
      '<img alt="">' +
      '<button class="lb-x" aria-label="Zamknij"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lb-p" aria-label="Poprzednie"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lb-n" aria-label="Następne"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<div class="lb-i"></div>';
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('img');
    var lbInfo = lb.querySelector('.lb-i');
    var idx = 0;

    function show(i) {
      idx = (i + figs.length) % figs.length;
      var src = figs[idx].querySelector('img');
      lbImg.src = src.getAttribute('src');
      lbImg.alt = src.getAttribute('alt') || '';
      var cap = figs[idx].querySelector('figcaption');
      lbInfo.textContent = (cap ? cap.textContent + ' · ' : '') + (idx + 1) + ' / ' + figs.length;
    }
    function open(i) {
      show(i);
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('on');
      document.body.style.overflow = '';
    }

    figs.forEach(function (f, i) {
      f.addEventListener('click', function () { open(i); });
    });
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.querySelector('.lb-p').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-n').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) close(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });

    /* swipe */
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) show(dx < 0 ? idx + 1 : idx - 1);
      x0 = null;
    }, { passive: true });
  }
})();
