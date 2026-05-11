// Simple authentication system using localStorage
// In a real app, you'd validate credentials against a backend

const DEMO_CREDENTIALS = {
  username: "admin",
  password: "password"
};

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("user_session") !== null;
}

// Get current user
function getCurrentUser() {
  const session = localStorage.getItem("user_session");
  if (session) {
    return JSON.parse(session);
  }
  return null;
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  // Simple demo validation (replace with backend API call in production)
  if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
    // Store session
    const user = {
      username: username,
      loginTime: new Date().toISOString(),
      sessionId: Math.random().toString(36).substr(2, 9)
    };
    localStorage.setItem("user_session", JSON.stringify(user));

    // Redirect to dashboard
    window.location.href = "index.html";
  } else {
    // Show error
    errorMessage.textContent = "Invalid username or password";
    errorMessage.classList.add("show");
  }
}

// Logout user
function logout() {
  localStorage.removeItem("user_session");
  window.location.href = "login-page.html";
}

// Check if user is logged in on page load (for protected pages)
window.addEventListener("DOMContentLoaded", () => {
  // If on login page and already logged in, redirect to dashboard
  if (window.location.pathname.includes("login-page.html") && isLoggedIn()) {
    window.location.href = "index.html";
  }

  // If on protected page (index.html) and not logged in, redirect to login
  if (window.location.pathname.includes("index.html") && !isLoggedIn()) {
    window.location.href = "login-page.html";
  }

  // Display current user info if logged in
  const user = getCurrentUser();
  if (user) {
    const userInfoElement = document.getElementById("userInfo");
    if (userInfoElement) {
      userInfoElement.textContent = `👤 ${user.username}`;
    }
  }
});
