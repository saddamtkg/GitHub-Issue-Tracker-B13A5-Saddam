function initLogin() {
  document.getElementById("login-btn").addEventListener("click", function () {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const usernameValue = username.value.trim().toLowerCase();
    const passwordValue = password.value.trim();

    if (usernameValue === "" || passwordValue === "") {
      alert("Please enter a valid username and password");
      return;
    }

    if (usernameValue === "admin" && passwordValue === "admin123") {
      window.location.href = "home.html";
    } else {
      alert("Invalid username or password");
    }
  });
}

initLogin();
