/* ============================================================
   ANIMATIONS.JS — Fade-in con IntersectionObserver
   ============================================================ */

(function () {
  'use strict';

  /* ── IntersectionObserver para fade-in ─────────────────── */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: muestra todos de golpe
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Solo una vez
          }
        });
      },
      {
        threshold:  0.12,   // 12% visible antes de animar
        rootMargin: '0px 0px -40px 0px' // un poco antes del borde inferior
      }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  /* ── Animación del contador de stats en el hero ─────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target || el.textContent, 10);
    const duration = 1600; // ms
    const steps    = 50;
    const step     = target / steps;
    let   current  = 0;
    let   count    = 0;

    const interval = setInterval(() => {
      count++;
      current = Math.round(step * count);
      el.textContent = count >= steps ? target : current;

      if (count >= steps) clearInterval(interval);
    }, duration / steps);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    const counterEls = document.querySelectorAll('[data-counter]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(el => observer.observe(el));
  }

  /* ── Resalte suave del nodo SVG al entrar a la sección ─── */
  function initMapPulse() {
    const mapWrapper = document.querySelector('.hero__map-wrapper');
    if (!mapWrapper) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            mapWrapper.classList.add('map-pulse');
            observer.unobserve(mapWrapper);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(mapWrapper);
  }

  /* ── Hover interactivo en las tarjetas de video ─────────── */
  function initCardHover() {
    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.willChange = 'transform, box-shadow';
      });
      card.addEventListener('mouseleave', () => {
        card.style.willChange = '';
      });
    });
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    initFadeIn();
    initCounters();
    initMapPulse();
    initCardHover();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
