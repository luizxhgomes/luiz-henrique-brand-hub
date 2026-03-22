/* ===================================================
   BRAND HUB — Scroll Animations + Lenis Smooth Scroll
   Referencia: Social Media Machine design system
   =================================================== */

(function() {
  'use strict';

  // --- INTERSECTION OBSERVER (Scroll Animations) ---
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // Small delay so the browser paints the initial state first
          requestAnimationFrame(function() {
            entry.target.classList.add('ativo');
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );

  function applyAnimation(el, type, delay) {
    if (!el) return;
    el.classList.add(type);
    if (delay) el.style.transitionDelay = delay + 'ms';
    // Force browser to register the initial state before observing
    void el.offsetHeight;
    observer.observe(el);
  }

  function initScrollAnimations() {
    // --- PAGE HEADER: animate down from top ---
    var header = document.querySelector('.page-header');
    if (header) {
      applyAnimation(header, 'scroll-bottom', 100);
    }

    // --- SECTION DIVIDERS ---
    var dividers = document.querySelectorAll('.section-divider');
    dividers.forEach(function(el) {
      applyAnimation(el, 'scroll-bottom', 0);
    });

    // --- GRIDS: stagger children ---
    var grids = document.querySelectorAll('.grid-2, .grid-3, .grid-4');
    grids.forEach(function(grid) {
      var children = grid.querySelectorAll('.card, .stat-card, .story-block');
      children.forEach(function(child, i) {
        applyAnimation(child, 'scroll-bottom', i * 120);
      });
    });

    // --- STANDALONE CARDS (not inside grids) ---
    var standaloneCards = document.querySelectorAll('.content > .card, .tab-content.active > .card');
    standaloneCards.forEach(function(el) {
      if (!el.closest('.grid-2, .grid-3, .grid-4')) {
        applyAnimation(el, 'scroll-bottom', 0);
      }
    });

    // --- TIMELINE ITEMS: slide from left ---
    var timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(function(item, i) {
      applyAnimation(item, 'scroll-left', i * 150);
    });

    // --- CODE BLOCKS: blur in ---
    var codeBlocks = document.querySelectorAll('.content > .code-block, .tab-content.active .code-block');
    codeBlocks.forEach(function(el) {
      applyAnimation(el, 'blur-in', 0);
    });

    // --- VOICE METERS: slide from right ---
    var meters = document.querySelectorAll('.voice-meter');
    meters.forEach(function(meter, i) {
      applyAnimation(meter, 'scroll-right', i * 100);
    });

    // --- TABLES ---
    var tables = document.querySelectorAll('.cal-table');
    tables.forEach(function(el) {
      applyAnimation(el, 'scroll-bottom', 0);
    });

    // --- TABS BAR ---
    var tabBars = document.querySelectorAll('.tabs');
    tabBars.forEach(function(el) {
      applyAnimation(el, 'blur-in', 0);
    });

    // --- BADGE GROUPS ---
    var badgeGroups = document.querySelectorAll('[style*="flex-wrap"]');
    badgeGroups.forEach(function(el) {
      if (el.querySelector('.badge')) {
        applyAnimation(el, 'blur-in', 200);
      }
    });

    // --- LEGEND ROWS (calendario) ---
    var legends = document.querySelectorAll('.content > .grid-4:first-child');
    legends.forEach(function(el) {
      applyAnimation(el, 'blur-in', 0);
    });
  }

  // --- LENIS SMOOTH SCROLL (Desktop only) ---
  function initLenis() {
    if (window.innerWidth <= 1024) return;
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.7,
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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target);
        }
      });
    });
  }

  // --- VOICE METER FILL ANIMATION ---
  function initVoiceMeters() {
    var fills = document.querySelectorAll('.voice-meter-fill');
    var meterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var targetWidth = el.style.width;
          el.style.width = '0%';
          el.style.transition = 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          // Force reflow then animate
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

  // --- INIT ---
  function init() {
    // Wait a tick so the browser has painted the initial layout
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        initScrollAnimations();
        initVoiceMeters();
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
