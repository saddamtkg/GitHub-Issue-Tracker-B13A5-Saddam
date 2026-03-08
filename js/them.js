const initializeThemeToggle = () => {
  const themeToggleCheckbox = document.getElementById('theme-toggle');
  if (!themeToggleCheckbox) return;

  const currentThemeValue = document.documentElement.getAttribute('data-theme');
  themeToggleCheckbox.checked = currentThemeValue === 'dark';

  themeToggleCheckbox.addEventListener('change', () => {
    const newThemeValue = themeToggleCheckbox.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newThemeValue);
  });
};

initializeThemeToggle();
