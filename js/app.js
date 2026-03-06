(function () {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const searchPanel = document.getElementById('search-toggle-panel');

  if (!searchBtn || !searchPanel) return;

  // Search icon click: toggle panel (smooth expand er jonno 'expanded' use)
  searchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    searchPanel.classList.toggle('expanded');
    if (searchPanel.classList.contains('expanded')) {
      searchInput.focus();
    } else {
      searchInput.blur();
    }
  });

  // Baire click korle panel close
  document.addEventListener('click', function (e) {
    if (
      !searchPanel.contains(e.target) &&
      !searchBtn.contains(e.target) &&
      searchPanel.classList.contains('expanded')
    ) {
      searchPanel.classList.remove('expanded');
    }
  });
})();
