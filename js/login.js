function initLogin() {
  document.getElementById("login-btn").addEventListener("click", function () {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const usernameValue = username.value.trim().toLowerCase();
    const passwordValue = password.value.trim();

    if (usernameValue === "" || passwordValue === "") {
      document.getElementById("error-message").textContent = "Please enter a valid username and password";
      document.getElementById("error-message").classList.remove("hidden");
      return;
    }

    if (usernameValue === "admin" && passwordValue === "admin123") {
      window.location.href = "home.html";
    } else {
      document.getElementById("error-message").textContent = "Invalid username or password";
      document.getElementById("error-message").classList.remove("hidden");
    }
  });
}

initLogin();
