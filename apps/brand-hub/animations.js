/* ===================================================
   BRAND HUB — Scroll Animations + Lenis Smooth Scroll
   Referencia: Social Media Machine design system
   =================================================== */

(function() {
  'use strict';

  // --- INTERSECTION OBSERVER (Scroll Animations) ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ativo');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -15% 0px' }
  );

  function initScrollAnimations() {
    // Animate page header
    const header = document.querySelector('.page-header');
    if (header) {
      header.classList.add('scroll-top');
      observer.observe(header);
    }

    // Animate section dividers
    document.querySelectorAll('.section-divider').forEach(el => {
      el.classList.add('scroll-bottom');
      observer.observe(el);
    });

    // Animate cards with stagger
    document.querySelectorAll('.grid-2, .grid-3, .grid-4').forEach(grid => {
      grid.classList.add('stagger');
      grid.querySelectorAll('.card, .stat-card, .story-block').forEach(card => {
        card.classList.add('scroll-bottom');
        observer.observe(card);
      });
    });

    // Animate standalone cards
    document.querySelectorAll('.content > .card, .tab-content > .card').forEach(el => {
      if (!el.closest('.grid-2, .grid-3, .grid-4')) {
        el.classList.add('scroll-bottom');
        observer.observe(el);
      }
    });

    // Animate timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.add('scroll-left');
      item.style.transitionDelay = `${i * 120}ms`;
      observer.observe(item);
    });

    // Animate code blocks
    document.querySelectorAll('.code-block').forEach(el => {
      if (!el.closest('.tab-content:not(.active)')) {
        el.classList.add('blur-in');
        observer.observe(el);
      }
    });

    // Animate voice meters
    document.querySelectorAll('.voice-meter').forEach((meter, i) => {
      meter.classList.add('scroll-right');
      meter.style.transitionDelay = `${i * 100}ms`;
      observer.observe(meter);
    });

    // Animate tables
    document.querySelectorAll('.cal-table').forEach(el => {
      el.classList.add('scroll-bottom');
      observer.observe(el);
    });

    // Animate tab containers
    document.querySelectorAll('.tabs').forEach(el => {
      el.classList.add('scroll-bottom');
      observer.observe(el);
    });

    // Animate badge groups
    document.querySelectorAll('[style*="flex-wrap"]').forEach(el => {
      if (el.querySelector('.badge')) {
        el.classList.add('blur-in');
        observer.observe(el);
      }
    });
  }

  // --- LENIS SMOOTH SCROLL (Desktop only) ---
  function initLenis() {
    if (window.innerWidth <= 1024) return;
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
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

    // Handle anchor links
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

  // --- VOICE METER ANIMATION ---
  function initVoiceMeters() {
    var meters = document.querySelectorAll('.voice-meter-fill');
    var meterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var width = target.style.width;
          target.style.width = '0%';
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              target.style.width = width;
            });
          });
          meterObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    meters.forEach(function(meter) { meterObserver.observe(meter); });
  }

  // --- SIDEBAR ACTIVE STATE ---
  function initSidebar() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(function(link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // --- INIT ---
  function init() {
    initSidebar();
    initScrollAnimations();
    initVoiceMeters();
    initLenis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
