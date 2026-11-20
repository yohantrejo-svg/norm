/* ============================================================
   VIDEOS.JS — Placeholders y activación de iframes YouTube
   ============================================================ */

(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────
     Cómo editar un video:
     1. Busca la etiqueta <iframe data-youtube-id="..."> en index.html
     2. Reemplaza el valor de data-youtube-id con el ID del video.
        Ejemplo: https://youtube.com/watch?v=dQw4w9WgXcQ
                 → el ID es: dQw4w9WgXcQ
     3. Guarda el archivo y recarga el navegador.
        El overlay de placeholder desaparecerá automáticamente.
  ──────────────────────────────────────────────────────── */

  /* ── Activa un iframe si tiene data-youtube-id ──────────── */
  function activateIframe(iframe) {
    const id = (iframe.dataset.youtubeId || '').trim();
    if (!id || id === 'YOUTUBE_ID') return; // placeholder vacío

    // Construye URL de embed con parámetros recomendados
    const src = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`;
    iframe.src = src;
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('title', iframe.dataset.title || 'Video');

    // Oculta el overlay de placeholder
    const overlay = iframe.parentElement.querySelector('.video-overlay, .video-card__overlay');
    if (overlay) {
      overlay.classList.add('video-overlay--hidden', 'video-card__overlay--hidden');
      overlay.setAttribute('hidden', '');
    }
  }

  /* ── Revisa todos los iframes y activa los que tienen ID ── */
  function initVideoPlaceholders() {
    document.querySelectorAll('iframe[data-youtube-id]').forEach(activateIframe);
  }

  /* ── API pública: actualizar un video en caliente ────────── */
  window.ISOVideo = {
    /**
     * Actualiza el video de un iframe específico en tiempo real.
     * Uso: ISOVideo.update('caso-grupal', 'dQw4w9WgXcQ');
     * @param {string} iframeId  - Atributo id del <iframe>
     * @param {string} youtubeId - ID del video de YouTube
     */
    update: function (iframeId, youtubeId) {
      const iframe = document.getElementById(iframeId);
      if (!iframe) {
        console.warn(`ISOVideo.update: no se encontró iframe con id="${iframeId}"`);
        return;
      }
      iframe.dataset.youtubeId = youtubeId;
      activateIframe(iframe);
    }
  };

  /* ── Init ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', initVideoPlaceholders);
})();
