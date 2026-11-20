/* ============================================================
   TABS.JS — Sistema de Pestañas ISO + Integración Mapa SVG
   ============================================================ */

(function () {
  'use strict';

  /* ── Configuración ─────────────────────────────────────── */
  const TAB_SELECTOR  = '[role="tab"]';
  const PANEL_PREFIX  = 'panel-';

  /* ── Activa una pestaña por su data-tab ────────────────── */
  function activateTab(tabId, tabList) {
    const tabs   = tabList.querySelectorAll(TAB_SELECTOR);
    const panels = document.querySelectorAll('.tab-panel');

    // Desactiva todo
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
    });
    panels.forEach(panel => {
      panel.setAttribute('aria-hidden', 'true');
      panel.style.display = 'none';
    });

    // Activa el tab seleccionado
    const activeTab = tabList.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.tabIndex = 0;
    }

    // Activa el panel correspondiente
    const activePanel = document.getElementById(`${PANEL_PREFIX}${tabId}`);
    if (activePanel) {
      activePanel.setAttribute('aria-hidden', 'false');
      activePanel.style.display = '';
      activePanel.dataset.current = tabId;
    }
  }

  /* ── Navegación por teclado en tabs ────────────────────── */
  function handleTabKeydown(e, tabList) {
    const tabs = [...tabList.querySelectorAll(TAB_SELECTOR)];
    const currentIndex = tabs.indexOf(e.target);

    let newIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    const newTab = tabs[newIndex];
    if (newTab) {
      newTab.focus();
      activateTab(newTab.dataset.tab, tabList);
    }
  }

  /* ── Integración con nodos del mapa SVG ────────────────── */
  function initMapNodes(tabList) {
    const mapNodes = document.querySelectorAll('.map-node');

    mapNodes.forEach(node => {
      const tabId = node.dataset.tab;
      if (!tabId) return;

      // Accesibilidad del nodo SVG
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', `Ver norma ${tabId.toUpperCase()}`);

      node.addEventListener('click', () => {
        activateTab(tabId, tabList);
        // Scroll suave a la sección de normas
        const normasSection = document.getElementById('normas');
        if (normasSection) {
          const navbarHeight = 72;
          const top = normasSection.getBoundingClientRect().top + window.scrollY - navbarHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });

      node.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
        }
      });
    });
  }

  /* ── API pública: activar tab desde fuera ───────────────── */
  window.ISOTabs = {
    activate: function (tabId) {
      const tabList = document.querySelector('[role="tablist"]');
      if (tabList) activateTab(tabId, tabList);
    }
  };

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    const tabList = document.querySelector('[role="tablist"]');
    if (!tabList) return;

    const tabs = tabList.querySelectorAll(TAB_SELECTOR);
    if (!tabs.length) return;

    // Configuración inicial de ARIA
    tabs.forEach((tab, index) => {
      tab.tabIndex = index === 0 ? 0 : -1;
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');

      tab.addEventListener('click', () => {
        activateTab(tab.dataset.tab, tabList);
      });
    });

    tabList.addEventListener('keydown', e => handleTabKeydown(e, tabList));

    // Activa el primer panel
    const firstTab = tabs[0];
    if (firstTab) {
      activateTab(firstTab.dataset.tab, tabList);
    }

    // Nodos del mapa
    initMapNodes(tabList);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
