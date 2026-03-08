const initializeLogin = () => {
  const loginButtonElement = document.getElementById('login-btn');
  if (!loginButtonElement) return;

  loginButtonElement.addEventListener('click', () => {
    const usernameInputElement = document.getElementById('username');
    const passwordInputElement = document.getElementById('password');
    const usernameValue = usernameInputElement.value.trim().toLowerCase();
    const passwordValue = passwordInputElement.value.trim();

    if (usernameValue === '' || passwordValue === '') {
      const errorMessageElement = document.getElementById('error-message');
      errorMessageElement.textContent = 'Please enter a valid username and password';
      errorMessageElement.classList.remove('hidden');
      return;
    }

    if (usernameValue === 'admin' && passwordValue === 'admin123') {
      window.location.href = 'home.html';
      return;
    }

    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = 'Invalid username or password';
    errorMessageElement.classList.remove('hidden');
  });
};

const initializeShowPassword = () => {
  const showPasswordCheckbox = document.getElementById('show-password');
  const passwordInput = document.getElementById('password');
  if (!showPasswordCheckbox || !passwordInput) return;
  showPasswordCheckbox.addEventListener('change', () => {
    passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
  });
};

initializeLogin();
initializeShowPassword();
