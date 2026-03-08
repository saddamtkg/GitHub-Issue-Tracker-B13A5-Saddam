/**
 * ============================================================
 * THEME TOGGLE - Light / Dark mode
 * ============================================================
 * Theme checkbox (#theme-toggle) e change hole html er data-theme
 * attribute update hoy - light ba dark. DaisyUI ei attribute diye
 * theme change kore.
 */

/**
 * Theme toggle checkbox setup kore - change hole data-theme update
 */
const initializeThemeToggle = () => {
  // Theme checkbox element dhora
  const themeToggleCheckbox = document.getElementById('theme-toggle');
  // CLG: Check - theme toggle DOM e ache kina
  console.log('[THEME] theme toggle element:', themeToggleCheckbox ? 'Found' : 'Not found');

  if (!themeToggleCheckbox) return;

  // HTML (document.documentElement) e aktu theme set ache kina dekhe checkbox er state milao
  const currentThemeValue = document.documentElement.getAttribute('data-theme');
  themeToggleCheckbox.checked = currentThemeValue === 'dark';
  // CLG: Check - page load e theme ki (light/dark) ar checkbox state
  console.log('[THEME] Initial theme:', currentThemeValue, '| checkbox checked:', themeToggleCheckbox.checked);

  // Checkbox e change (click) hole theme update koro
  themeToggleCheckbox.addEventListener('change', () => {
    // Checkbox checked thakle dark, na thakle light
    const newThemeValue = themeToggleCheckbox.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newThemeValue);
    // CLG: Check - user theme change korche, new value ki
    console.log('[THEME] Theme changed to:', newThemeValue);
  });
};

// Page load holei theme setup kore dao
initializeThemeToggle();
console.log('[THEME] Script loaded - initializeThemeToggle called');
