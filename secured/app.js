// SafeNotes Secured Frontend Demo App
// IMPORTANT: Because this is frontend-only, this code can improve safety patterns
// but cannot provide true authentication/authorization security without a backend.

const demoUsers = [
  { id: 1, username: "admin", passwordHint: "(hidden)", role: "admin", email: "admin@safenotes.local" },
  { id: 2, username: "alice", passwordHint: "(hidden)", role: "user", email: "alice@safenotes.local" },
];

// Minimal demo login map to reduce sensitive exposure in code compared with full objects.
const demoCredentials = {
  admin: "admin123",
  alice: "alice123",
};

const page = window.location.pathname.split("/").pop();

function getAuth() {
  return {
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    username: localStorage.getItem("username") || "",
    role: localStorage.getItem("role") || "demo",
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
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (!username || !password) {
      error.textContent = "Username and password are required.";
      return;
    }

    const expectedPassword = demoCredentials[username];
    if (!expectedPassword || expectedPassword !== password) {
      error.textContent = "Invalid login for this demo.";
      return;
    }

    const user = demoUsers.find((u) => u.username === username);
    if (!user) {
      error.textContent = "User profile missing.";
      return;
    }

    // Demo-only session state. Not a secure auth model.
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user.username);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", String(user.id));

    window.location.href = "dashboard.html";
  });
}

function initDashboard() {
  if (!document.getElementById("noteForm")) return;
  requireLogin();

  const auth = getAuth();
  document.getElementById("currentUser").textContent = auth.username;
  document.getElementById("currentRole").textContent = auth.role;
  document.getElementById("profileLink").href = `profile.html?id=${auth.userId}`;

  const noteForm = document.getElementById("noteForm");
  const noteInput = document.getElementById("noteInput");
  const notesList = document.getElementById("notesList");
  const noteFeedback = document.getElementById("noteFeedback");
  const noteKey = `notes_${auth.username}`;

  function loadNotes() {
    const notes = JSON.parse(localStorage.getItem(noteKey) || "[]");
    notesList.innerHTML = "";

    // FIX-1: Safe rendering using textContent, not innerHTML.
    notes.forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-item";
      item.textContent = note;
      notesList.appendChild(item);
    });
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const noteValue = noteInput.value.trim();

    // Basic input validation
    if (noteValue.length < 1 || noteValue.length > 240) {
      noteFeedback.textContent = "Note must be between 1 and 240 characters.";
      noteFeedback.className = "error";
      return;
    }

    const notes = JSON.parse(localStorage.getItem(noteKey) || "[]");
    notes.push(noteValue);
    localStorage.setItem(noteKey, JSON.stringify(notes));
    noteInput.value = "";
    noteFeedback.textContent = "Note saved safely as plain text.";
    noteFeedback.className = "small success";
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

  const auth = getAuth();

  // Avoid IDOR pattern in this demo by only showing the logged-in user profile.
  const user = demoUsers.find((u) => u.id === auth.userId);
  if (!user) {
    profileData.textContent = "Profile not available.";
    return;
  }

  const fields = [
    `ID: ${user.id}`,
    `Username: ${user.username}`,
    `Email: ${user.email}`,
    `Role (demo only): ${user.role}`,
  ];

  fields.forEach((field) => {
    const line = document.createElement("div");
    line.className = "note-item";
    line.textContent = field;
    profileData.appendChild(line);
  });
}

function initAdmin() {
  if (!window.location.pathname.endsWith("admin.html")) return;
  requireLogin();

  // FIX-2: Do not present client-side role checks as real authorization.
  // This page is intentionally educational and explains backend requirements instead.
}

if (page === "index.html" || page === "") {
  handleLogin();
}

initDashboard();
initProfile();
initAdmin();
