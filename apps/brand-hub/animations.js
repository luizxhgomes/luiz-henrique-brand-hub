/* ===================================================
   BRAND HUB v6.0 — Scroll Animations
   Baseado no sistema do BRANDBOOK (IntersectionObserver + Lenis + Parallax)
   =================================================== */

(function() {
  'use strict';

  /* ============================================================
     1. SCROLL REVEAL com IntersectionObserver
     ============================================================ */
  var revealObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          requestAnimationFrame(function() {
            entry.target.classList.add('visible');
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  function apply(el, type, index) {
    if (!el) return;
    el.classList.add(type);
    if (typeof index === 'number') {
      el.style.setProperty('--i', index);
    }
    void el.offsetHeight;
    revealObserver.observe(el);
  }

  function initScrollAnimations() {
    // Page header
    var header = document.querySelector('.page-header');
    if (header) apply(header, 'reveal');

    // Section dividers
    document.querySelectorAll('.section-divider').forEach(function(el) {
      apply(el, 'reveal');
    });

    // Grids com stagger
    document.querySelectorAll('.grid-2, .grid-3, .grid-4').forEach(function(grid) {
      grid.classList.add('stagger-container');
      var children = grid.querySelectorAll('.card, .stat-card, .story-block, .system-card, .case-card');
      children.forEach(function(child, i) {
        apply(child, 'reveal', i);
      });
    });

    // Cards soltos fora de grids
    document.querySelectorAll('.content > .card').forEach(function(el) {
      if (!el.closest('.grid-2, .grid-3, .grid-4')) apply(el, 'reveal');
    });

    // Timeline items vêm da esquerda
    document.querySelectorAll('.timeline-item').forEach(function(item, i) {
      apply(item, 'reveal-left', i);
    });

    // Tabelas com scale
    document.querySelectorAll('.cal-table').forEach(function(el) {
      apply(el, 'reveal-scale');
    });

    // Code blocks
    document.querySelectorAll('.code-block').forEach(function(el) {
      apply(el, 'reveal');
    });

    // Quote blocks com scale
    document.querySelectorAll('.quote-block').forEach(function(el) {
      apply(el, 'reveal-scale');
    });

    // Tabs bar
    document.querySelectorAll('.tabs').forEach(function(el) {
      apply(el, 'reveal');
    });
  }

  /* ============================================================
     2. VOICE METER FILL (barras DISC)
     ============================================================ */
  function initVoiceMeters() {
    var fills = document.querySelectorAll('.voice-meter-fill');
    var meterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var targetWidth = el.style.width;
          if (!targetWidth) return;
          el.style.width = '0%';
          el.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          void el.offsetHeight;
          requestAnimationFrame(function() {
            el.style.width = targetWidth;
          });
          meterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function(fill) { meterObserver.observe(fill); });
  }

  /* ============================================================
     3. PARALLAX ORBS no header (movimento sutil ao scroll)
     ============================================================ */
  function initParallaxOrbs() {
    var orbs = document.querySelectorAll('.hero-glow');
    if (orbs.length === 0) return;

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var scrolled = window.scrollY;
          if (scrolled < window.innerHeight * 1.2) {
            orbs.forEach(function(orb, i) {
              var speed = (i + 1) * 0.08;
              orb.style.transform = 'translate(' + (scrolled * speed * 0.4) + 'px, ' + (scrolled * speed) + 'px)';
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ============================================================
     4. SIDEBAR SCROLL EFFECT (aumenta opacidade ao scrollar)
     ============================================================ */
  function initSidebarEffect() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        sidebar.style.background = 'linear-gradient(180deg, rgba(0,18,80,0.95) 0%, rgba(0,1,6,0.98) 100%)';
      } else {
        sidebar.style.background = 'linear-gradient(180deg, rgba(0,18,80,0.85) 0%, rgba(2,8,23,0.95) 100%)';
      }
    }, { passive: true });
  }

  /* ============================================================
     5. SMOOTH SCROLL ANCHORS
     ============================================================ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     6. LENIS SMOOTH SCROLL (desktop apenas)
     ============================================================ */
  function initLenis() {
    if (window.innerWidth <= 1024) return;
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.4,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target);
        }
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        initScrollAnimations();
        initVoiceMeters();
        initParallaxOrbs();
        initSidebarEffect();
        initSmoothAnchors();
        initLenis();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
