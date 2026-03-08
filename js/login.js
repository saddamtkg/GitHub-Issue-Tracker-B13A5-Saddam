/**
 * ============================================================
 * LOGIN PAGE - Sign in er kaj
 * ============================================================
 * Ei file e login form handle hoy. User admin/admin123 dile
 * home.html e pathabo, na hole error message dekhabo.
 */

/**
 * Login form er kaj start kore - button click shune credential check kore
 */
const initializeLogin = () => {
  // CLG: Check - login button DOM e ache kina
  const loginButtonElement = document.getElementById('login-btn');
  console.log('[LOGIN] login button element:', loginButtonElement ? 'Found' : 'Not found');

  if (!loginButtonElement) return;

  // Login button e click hole ei function chalbe
  loginButtonElement.addEventListener('click', () => {
    // CLG: Check - button e click hocche kina
    console.log('[LOGIN] Sign In button clicked');

    // Username ar password input element dhora
    const usernameInputElement = document.getElementById('username');
    const passwordInputElement = document.getElementById('password');

    // User je type koreche ta niye trim (space kata) + username lowercase
    const usernameValue = usernameInputElement.value.trim().toLowerCase();
    const passwordValue = passwordInputElement.value.trim();

    // CLG: Check - username ar password value ki asche (password full na dekhiye)
    console.log('[LOGIN] username value:', usernameValue, '| password length:', passwordValue.length);

    // Khali thakle error dekhao ar return (aage theke beriye jao)
    if (usernameValue === '' || passwordValue === '') {
      const errorMessageElement = document.getElementById('error-message');
      errorMessageElement.textContent = 'Please enter a valid username and password';
      errorMessageElement.classList.remove('hidden');
      console.log('[LOGIN] Validation failed - empty username or password');
      return;
    }

    // Admin credential match hole home.html e pathao
    if (usernameValue === 'admin' && passwordValue === 'admin123') {
      console.log('[LOGIN] Success - redirecting to home.html');
      window.location.href = 'home.html';
      return;
    }

    // Match na hole invalid credential error dekhao
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = 'Invalid username or password';
    errorMessageElement.classList.remove('hidden');
    console.log('[LOGIN] Failed - wrong username or password');
  });
};

// Page load holei login setup kore dao
initializeLogin();
console.log('[LOGIN] Script loaded - initializeLogin called');
