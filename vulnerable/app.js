// SafeNotes Vulnerable Demo App

// VULN-1: Hardcoded credentials and sensitive user details exposed in client-side JavaScript
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin", email: "admin@safenotes.local" },
  { id: 2, username: "alice", password: "alice123", role: "user", email: "alice@safenotes.local" },
];

const page = window.location.pathname.split("/").pop();

function getAuth() {
  return {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    username: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "guest",
    userId: Number(localStorage.getItem("userId") || 0),
  };
}

function requireLogin() {
  const auth = getAuth();
  if (!auth.isLoggedIn) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.location.href = "index.html";
}

function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    const match = users.find((u) => u.username === username && u.password === password);
    if (!match) {
      error.textContent = "Invalid username or password.";
      return;
    }

    // VULN-2: Client-side auth only, including role and login state in localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", match.username);
    localStorage.setItem("role", match.role);
    localStorage.setItem("userId", String(match.id));

    window.location.href = "dashboard.html";
  });
}

function initDashboard() {
  if (!document.getElementById("noteForm")) return;
  requireLogin();

  const auth = getAuth();
  document.getElementById("currentUser").textContent = auth.username;
  document.getElementById("currentRole").textContent = auth.role;
  document.getElementById("profileLink").href = `profile.html?id=${auth.userId || 1}`;

  const noteForm = document.getElementById("noteForm");
  const noteInput = document.getElementById("noteInput");
  const notesList = document.getElementById("notesList");

  const noteKey = `notes_${auth.username}`;

  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem(noteKey) || "[]");
    notesList.innerHTML = "";

    // VULN-3: Unsafe innerHTML rendering with no sanitization (stored XSS)
    notes.forEach((note) => {
      notesList.innerHTML += `<div class="note-item">${note}</div>`;
    });
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Weak validation: only checks for empty string after trim, no length/content restrictions
    const noteValue = noteInput.value;
    if (!noteValue.trim()) {
      return;
    }

    const notes = JSON.parse(localStorage.getItem(noteKey) || "[]");
    notes.push(noteValue);
    localStorage.setItem(noteKey, JSON.stringify(notes));
    noteInput.value = "";
    loadNotes();
  });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  loadNotes();
}

function initProfile() {
  const profileData = document.getElementById("profileData");
  if (!profileData) return;
  requireLogin();

  // VULN-4: IDOR via URL parameter. No authorization check on requested profile id.
  const params = new URLSearchParams(window.location.search);
  const requestedId = Number(params.get("id"));
  const user = users.find((u) => u.id === requestedId);

  if (!user) {
    profileData.innerHTML = "<p class='error'>Profile not found.</p>";
    return;
  }

  profileData.innerHTML = `
    <div class="note-item"><strong>ID:</strong> ${user.id}</div>
    <div class="note-item"><strong>Username:</strong> ${user.username}</div>
    <div class="note-item"><strong>Email:</strong> ${user.email}</div>
    <div class="note-item"><strong>Role:</strong> ${user.role}</div>
  `;
}

function initAdmin() {
  if (!window.location.pathname.endsWith("admin.html")) return;
  requireLogin();

  // VULN-2: Authorization relies only on client-controlled localStorage role
  const auth = getAuth();
  if (auth.role !== "admin") {
    alert("Access denied: Admins only.");
    window.location.href = "dashboard.html";
  }
}

if (page === "index.html" || page === "") {
  handleLogin();
}

initDashboard();
initProfile();
initAdmin();
