/* ============================================================
   ACCORDION.JS — Acordeones de Numerales (max-height animado)
   ============================================================ */

(function () {
  'use strict';

  /* ── Abre un acordeón ──────────────────────────────────── */
  function openItem(header, body) {
    header.setAttribute('aria-expanded', 'true');
    body.classList.add('accordion-body--open');
    // Forzar max-height al scrollHeight para la animación
    body.style.maxHeight = body.scrollHeight + 'px';
  }

  /* ── Cierra un acordeón ────────────────────────────────── */
  function closeItem(header, body) {
    header.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = body.scrollHeight + 'px'; // desde el alto actual
    // Siguiente frame → colapsa
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.maxHeight = '0';
        body.classList.remove('accordion-body--open');
      });
    });
  }

  /* ── Toggle de un ítem ─────────────────────────────────── */
  function toggleItem(header) {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    const bodyId   = header.getAttribute('aria-controls');
    const body     = document.getElementById(bodyId);
    if (!body) return;

    // Cierra hermanos en el mismo acordeón (comportamiento exclusivo opcional)
    // Descomenta las líneas siguientes para comportamiento de acordeón exclusivo:
    // const accordion = header.closest('.accordion');
    // if (accordion) {
    //   accordion.querySelectorAll('.accordion-header[aria-expanded="true"]').forEach(openH => {
    //     if (openH !== header) {
    //       const openBodyId = openH.getAttribute('aria-controls');
    //       const openBody = document.getElementById(openBodyId);
    //       if (openBody) closeItem(openH, openBody);
    //     }
    //   });
    // }

    if (expanded) {
      closeItem(header, body);
    } else {
      openItem(header, body);
    }
  }

  /* ── Genera IDs únicos para body ───────────────────────── */
  let accordionCount = 0;

  function setupAccordionItem(item) {
    const header = item.querySelector('.accordion-header');
    const body   = item.querySelector('.accordion-body');
    if (!header || !body) return;

    // Asigna IDs si no existen
    if (!body.id) {
      accordionCount++;
      body.id = `accordion-body-${accordionCount}`;
    }
    header.setAttribute('aria-controls', body.id);
    header.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = '0';

    // Eventos
    header.addEventListener('click', () => toggleItem(header));

    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(header);
      }
    });
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll('.accordion-item').forEach(setupAccordionItem);

    // Observer para re-inicializar acordeones en paneles recién mostrados
    // (por si los tabs ocultan/muestran paneles dinámicamente)
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          node.querySelectorAll('.accordion-item').forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header && !header.hasAttribute('aria-expanded')) {
              setupAccordionItem(item);
            }
          });
        });
      });
    });

    const normasSection = document.getElementById('normas');
    if (normasSection) {
      observer.observe(normasSection, { childList: true, subtree: true });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
