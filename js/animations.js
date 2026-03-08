/**
 * Modern animations – runs on page load and handles modal close.
 * Add anim-modal-in to modal .modal-box when opening (from app.js / newIssue.js).
 */

(function () {
  function addPageReady() {
    requestAnimationFrame(function () {
      document.body.classList.add('anim-page-ready');
    });
  }

  function setupModalCloseCleanup(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    dialog.addEventListener('close', function () {
      const box = dialog.querySelector('.modal-box');
      if (box) box.classList.remove('anim-modal-in');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPageReady);
  } else {
    addPageReady();
  }

  setupModalCloseCleanup('issue-modal');
  setupModalCloseCleanup('new-issue-modal');

  window.animationsAddModalIn = function (dialogId) {
    const dialog = document.getElementById(dialogId);
    const box = dialog && dialog.querySelector('.modal-box');
    if (box) box.classList.add('anim-modal-in');
  };
})();
