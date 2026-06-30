const state = {
  mode: "login",
  token: localStorage.getItem("todo_token"),
  email: localStorage.getItem("todo_email"),
  page: 1,
};

const authPanel = document.querySelector("#auth-panel");
const sessionPanel = document.querySelector("#session-panel");
const sessionEmail = document.querySelector("#session-email");
const dashboard = document.querySelector("#dashboard");
const authForm = document.querySelector("#auth-form");
const authSubmit = document.querySelector("#auth-submit");
const loginTab = document.querySelector("#login-tab");
const registerTab = document.querySelector("#register-tab");
const message = document.querySelector("#message");
const taskForm = document.querySelector("#task-form");
const tasks = document.querySelector("#tasks");
const pageLabel = document.querySelector("#page-label");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function authHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail[0]?.msg || "Request failed"
      : data.detail || "Request failed";
    throw new Error(detail);
  }

  return data;
}

function setAuthMode(mode) {
  state.mode = mode;
  loginTab.classList.toggle("active", mode === "login");
  registerTab.classList.toggle("active", mode === "register");
  authSubmit.textContent = mode === "login" ? "Login" : "Register";
}

function renderSession() {
  const signedIn = Boolean(state.token);
  document.body.classList.toggle("signed-out", !signedIn);
  authPanel.classList.toggle("hidden", signedIn);
  sessionPanel.classList.toggle("hidden", !signedIn);
  dashboard.classList.toggle("hidden", !signedIn);
  sessionEmail.textContent = state.email || "";
}

function formatDate(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderTasks(items) {
  if (!state.token) {
    tasks.innerHTML = '<div class="empty">Login to manage your tasks.</div>';
    return;
  }

  if (items.length === 0) {
    tasks.innerHTML = '<div class="empty">No tasks found.</div>';
    return;
  }

  tasks.innerHTML = items
    .map(
      (task) => `
        <article class="task-row">
          <div>
            <p class="task-title">${escapeHtml(task.title)}</p>
            <p class="task-description">${escapeHtml(task.description || "")}</p>
            <p class="task-meta">${formatDate(task.due_date)}</p>
          </div>
          <span class="badge ${task.priority}">${task.priority}</span>
          <span class="badge">${task.completed ? "Completed" : "Open"}</span>
          <button class="secondary" data-action="complete" data-id="${task.id}" type="button">
            Done
          </button>
          <button class="secondary danger" data-action="delete" data-id="${task.id}" type="button">
            Delete
          </button>
        </article>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildTaskQuery() {
  const params = new URLSearchParams();
  const search = document.querySelector("#search").value.trim();
  const completed = document.querySelector("#completed-filter").value;
  const limit = Number(document.querySelector("#limit").value || 10);
  const skip = (state.page - 1) * limit;

  if (search) params.set("search", search);
  if (completed) params.set("completed", completed);
  params.set("skip", String(skip));
  params.set("limit", String(limit));

  return params.toString();
}

async function loadTasks() {
  renderSession();
  pageLabel.textContent = `Page ${state.page}`;

  if (!state.token) {
    return;
  }

  try {
    const data = await api(`/tasks?${buildTaskQuery()}`);
    renderTasks(data);
    setMessage("");
  } catch (error) {
    renderTasks([]);
    setMessage(error.message, true);
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    if (state.mode === "register") {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthMode("login");
      setMessage("Account created. Login to continue.");
      return;
    }

    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    state.token = data.access_token;
    state.email = email;
    localStorage.setItem("todo_token", state.token);
    localStorage.setItem("todo_email", state.email);
    authForm.reset();
    setMessage("Logged in.");
    await loadTasks();
  } catch (error) {
    setMessage(error.message, true);
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#task-title").value.trim();
  const description = document.querySelector("#task-description").value.trim();
  const priority = document.querySelector("#task-priority").value;
  const dueDate = document.querySelector("#task-due-date").value;

  try {
    await api("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description: description || null,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      }),
    });

    taskForm.reset();
    document.querySelector("#task-priority").value = "medium";
    state.page = 1;
    await loadTasks();
  } catch (error) {
    setMessage(error.message, true);
  }
});

tasks.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;

  try {
    if (button.dataset.action === "complete") {
      await api(`/tasks/${id}/complete`, { method: "PATCH" });
    }

    if (button.dataset.action === "delete") {
      await api(`/tasks/${id}`, { method: "DELETE" });
    }

    await loadTasks();
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.querySelector("#logout-button").addEventListener("click", async () => {
  state.token = null;
  state.email = null;
  localStorage.removeItem("todo_token");
  localStorage.removeItem("todo_email");
  setMessage("Logged out.");
  await loadTasks();
});

document.querySelector("#refresh-button").addEventListener("click", loadTasks);
document.querySelector("#search").addEventListener("input", () => {
  state.page = 1;
  loadTasks();
});
document.querySelector("#completed-filter").addEventListener("change", () => {
  state.page = 1;
  loadTasks();
});
document.querySelector("#limit").addEventListener("change", () => {
  state.page = 1;
  loadTasks();
});
document.querySelector("#prev-button").addEventListener("click", () => {
  state.page = Math.max(1, state.page - 1);
  loadTasks();
});
document.querySelector("#next-button").addEventListener("click", () => {
  state.page += 1;
  loadTasks();
});
loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

setAuthMode("login");
loadTasks();
