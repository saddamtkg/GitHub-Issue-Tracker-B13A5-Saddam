function initThemeToggle() {

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const currentTheme = document.documentElement.getAttribute('data-theme');
  toggle.checked = currentTheme === 'dark';

  toggle.addEventListener('change', function () {
    document.documentElement.setAttribute('data-theme', toggle.checked ? 'dark' : 'light');
  });
}

initThemeToggle();
