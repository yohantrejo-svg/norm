/* ============================================================
   NAV.JS — Navegación: Scroll Spy + Hamburger + Smooth Scroll
   ============================================================ */

(function () {
  'use strict';

  /* ── Referencias del DOM ───────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.querySelector('.navbar__hamburger');
  const drawer      = document.getElementById('navbar-drawer');
  const overlay     = document.getElementById('navbar-overlay');
  const drawerClose = document.getElementById('drawer-close');
  const navLinks    = document.querySelectorAll('.navbar__link');
  const drawerLinks = document.querySelectorAll('.navbar__drawer-link');
  const sections    = document.querySelectorAll('section[id]');

  /* ── Estado ────────────────────────────────────────────── */
  let isDrawerOpen = false;

  /* ── 1. Sombra de navbar al hacer scroll ───────────────── */
  function handleNavbarScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  /* ── 2. Scroll Spy ─────────────────────────────────────── */
  function updateActiveNav() {
    let currentSection = '';
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72',
      10
    ) + 20;

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= sectionTop - offset) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('navbar__link--active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('navbar__link--active');
      }
    });

    drawerLinks.forEach(link => {
      link.classList.remove('navbar__drawer-link--active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('navbar__drawer-link--active');
      }
    });
  }

  /* ── 3. Hamburger / Drawer ─────────────────────────────── */
  function openDrawer() {
    isDrawerOpen = true;
    drawer.classList.add('navbar__drawer--open');
    overlay.classList.add('navbar__overlay--visible');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Foco al primer enlace del drawer
    const firstLink = drawer.querySelector('.navbar__drawer-link');
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    isDrawerOpen = false;
    drawer.classList.remove('navbar__drawer--open');
    overlay.classList.remove('navbar__overlay--visible');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  /* ── 4. Smooth Scroll para enlaces internos ────────────── */
  function smoothScrollTo(href) {
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;

    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 72;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    if (!navbar) return;

    // Scroll events
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    window.addEventListener('scroll', updateActiveNav,    { passive: true });

    // Estado inicial
    handleNavbarScroll();
    updateActiveNav();

    // Hamburger
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        isDrawerOpen ? closeDrawer() : openDrawer();
      });
    }

    // Overlay → cierra drawer
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Botón X del drawer
    if (drawerClose) {
      drawerClose.addEventListener('click', closeDrawer);
    }

    // Escape → cierra drawer
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isDrawerOpen) closeDrawer();
    });

    // Links de la navbar principal
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          smoothScrollTo(href);
          history.replaceState(null, '', href);
        }
      });
    });

    // Links del drawer
    drawerLinks.forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          closeDrawer();
          setTimeout(() => {
            smoothScrollTo(href);
            history.replaceState(null, '', href);
          }, 320); // espera el cierre del drawer
        }
      });
    });

    // CTA del hero
    const heroBtn = document.querySelector('[data-scroll-to]');
    if (heroBtn) {
      heroBtn.addEventListener('click', e => {
        e.preventDefault();
        const target = heroBtn.dataset.scrollTo;
        smoothScrollTo(`#${target}`);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
