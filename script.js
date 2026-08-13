(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGE_IDS = ['home', 'sobre', 'experiencia', 'projetos', 'arquitetura', 'stack', 'certificacoes'];

  /* ---------- Navbar scrolled state ---------- */
  var navbar = document.getElementById('navbar');
  function onScrollNav() {
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navToggle.classList.remove('is-open');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- Page router (SPA-style, hash based) ---------- */
  var pages = document.querySelectorAll('.page');
  var navLinks = document.querySelectorAll('.nav-link');

  function showPage(id) {
    if (PAGE_IDS.indexOf(id) === -1) id = 'home';

    pages.forEach(function (page) {
      page.classList.toggle('is-active', page.id === id);
    });

    navLinks.forEach(function (link) {
      var linkId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', linkId === id);
    });

    onScrollNav();
    triggerReveal();
  }

  function currentHashId() {
    return (window.location.hash || '#home').replace('#', '');
  }

  function navigateTo(id, push) {
    showPage(id);
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (push !== false) {
      var url = id === 'home' ? window.location.pathname + window.location.search : '#' + id;
      history.pushState({ page: id }, '', url);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').replace('#', '');
      if (PAGE_IDS.indexOf(id) === -1) return;
      e.preventDefault();
      navigateTo(id);
      closeMenu();
    });
  });

  window.addEventListener('popstate', function () {
    showPage(currentHashId());
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* ---------- Reveal on scroll (re-armed per page switch) ---------- */
  var io = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  function triggerReveal() {
    var active = document.querySelector('.page.is-active');
    if (!active) return;
    var els = active.querySelectorAll('.reveal:not(.visible)');
    if (io) {
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ---------- Animated counters ---------- */
  var animatedCounters = {};
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterIo = null;
  if ('IntersectionObserver' in window) {
    counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var el = entry.target;
          if (entry.isIntersecting && !animatedCounters[el]) {
            animatedCounters[el] = true;
            animateCounter(el);
            counterIo.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll('[data-count]').forEach(function (el) { counterIo.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(animateCounter);
  }

  /* ---------- Architecture tabs ---------- */
  var tabs = document.querySelectorAll('.arch-tab');
  var panels = document.querySelectorAll('.arch-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      panels.forEach(function (panel) {
        var match = panel.id === 'arch-' + target;
        panel.classList.toggle('is-active', match);
        if (match) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      });
    });
  });

  /* ---------- Footer: click-to-copy email ---------- */
  var emailBtn = document.querySelector('.footer-email');
  if (emailBtn) {
    var emailText = emailBtn.querySelector('.footer-email-text');
    var defaultLabel = emailText.textContent;
    var copyTimer = null;

    emailBtn.addEventListener('click', function () {
      var email = emailBtn.getAttribute('data-email');

      function showCopied() {
        emailBtn.classList.add('is-copied');
        emailText.textContent = 'E-mail copiado!';
        clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          emailBtn.classList.remove('is-copied');
          emailText.textContent = defaultLabel;
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied, function () {
          window.location.href = 'mailto:' + email;
        });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  }

  /* ---------- Init ---------- */
  showPage(currentHashId());
})();
