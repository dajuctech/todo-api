const state = {
  mode: "login",
  token: localStorage.getItem("todo_token"),
  email: localStorage.getItem("todo_email"),
  page: 1,
  tasks: [],
  editingTaskId: null,
  loading: false,
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
const taskSubmitButton = document.querySelector("#task-submit-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");
const taskFormTitle = document.querySelector("#task-form-title");
const tasks = document.querySelector("#tasks");
const pageLabel = document.querySelector("#page-label");
const workspaceSummary = document.querySelector("#workspace-summary");
const openCount = document.querySelector("#open-count");
const completedCount = document.querySelector("#completed-count");
const highCount = document.querySelector("#high-count");
const dueCount = document.querySelector("#due-count");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function authHeaders() {
  return state.token ? { Authorization: `Bearer ${state.token}` } : {};
}

async function api(path, options = {}) {
  const { headers = {}, skipAuth = false, ...fetchOptions } = options;

  const response = await fetch(path, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(skipAuth ? {} : authHeaders()),
      ...headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { detail: await response.text() };

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail[0]?.msg || "Request failed"
      : data.detail || "Request failed";
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  return data;
}

function clearSession(text = "Logged out.", isError = false) {
  state.token = null;
  state.email = null;
  state.page = 1;
  state.tasks = [];
  state.editingTaskId = null;
  localStorage.removeItem("todo_token");
  localStorage.removeItem("todo_email");
  resetTaskForm();
  renderSession();
  renderTasks([]);
  renderMetrics([]);
  setMessage(text, isError);
}

function handleRequestError(error) {
  if (error.status === 401 && state.token) {
    clearSession("Your session expired. Login again.", true);
    return true;
  }

  setMessage(error.message, true);
  return false;
}

function setBusy(isBusy) {
  state.loading = isBusy;
  authSubmit.disabled = isBusy;
  taskSubmitButton.disabled = isBusy;
  document.querySelector("#refresh-button").disabled = isBusy;
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

function renderMetrics(items) {
  const open = items.filter((task) => !task.completed).length;
  const completed = items.filter((task) => task.completed).length;
  const high = items.filter((task) => task.priority === "high").length;
  const dueSoon = items.filter((task) => isDueSoon(task.due_date) && !task.completed).length;

  openCount.textContent = String(open);
  completedCount.textContent = String(completed);
  highCount.textContent = String(high);
  dueCount.textContent = String(dueSoon);
  workspaceSummary.textContent = `${items.length} task${items.length === 1 ? "" : "s"} on this page`;
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

function isDueSoon(value) {
  if (!value) return false;
  const dueDate = new Date(value);
  const now = new Date();
  const sevenDaysFromNow = new Date(now);
  sevenDaysFromNow.setDate(now.getDate() + 7);
  return dueDate >= now && dueDate <= sevenDaysFromNow;
}

function renderTasks(items) {
  state.tasks = items;

  if (!state.token) {
    tasks.innerHTML = `
      <div class="empty">
        <strong>Login required</strong>
        <span>Sign in to view and manage your tasks.</span>
      </div>
    `;
    return;
  }

  if (state.loading) {
    tasks.innerHTML = '<div class="loading">Loading tasks...</div>';
    return;
  }

  if (items.length === 0) {
    tasks.innerHTML = `
      <div class="empty">
        <strong>No tasks found</strong>
        <span>Create a task or adjust the current filters.</span>
      </div>
    `;
    return;
  }

  tasks.innerHTML = items.map(renderTaskRow).join("");
}

function renderTaskRow(task) {
  const status = task.completed ? "Completed" : "Open";
  const toggleText = task.completed ? "Reopen" : "Done";

  return `
    <article class="task-row ${task.completed ? "completed" : ""}" data-id="${task.id}">
      <div>
        <p class="task-title">${escapeHtml(task.title)}</p>
        <p class="task-description">${escapeHtml(task.description || "No description")}</p>
        <p class="task-meta">${formatDate(task.due_date)}</p>
      </div>
      <span class="badge ${task.priority}">${task.priority}</span>
      <span class="badge ${task.completed ? "complete" : ""}">${status}</span>
      <div class="task-actions">
        <button class="secondary" data-action="edit" data-id="${task.id}" type="button">Edit</button>
        <button class="secondary" data-action="toggle" data-id="${task.id}" type="button">${toggleText}</button>
        <button class="secondary danger" data-action="delete" data-id="${task.id}" type="button">Delete</button>
      </div>
    </article>
  `;
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
    renderMetrics([]);
    return;
  }

  try {
    setBusy(true);
    renderTasks(state.tasks);
    const data = await api(`/tasks?${buildTaskQuery()}`);
    setBusy(false);
    renderMetrics(data);
    renderTasks(data);
    setMessage("");
  } catch (error) {
    setBusy(false);
    if (handleRequestError(error)) return;
    renderTasks([]);
  }
}

function resetTaskForm() {
  state.editingTaskId = null;
  taskForm.reset();
  document.querySelector("#task-priority").value = "medium";
  taskFormTitle.textContent = "New Task";
  taskSubmitButton.textContent = "Add Task";
  cancelEditButton.classList.add("hidden");
}

function fillTaskForm(task) {
  state.editingTaskId = task.id;
  document.querySelector("#task-title").value = task.title;
  document.querySelector("#task-description").value = task.description || "";
  document.querySelector("#task-priority").value = task.priority;
  document.querySelector("#task-due-date").value = toDatetimeLocal(task.due_date);
  taskFormTitle.textContent = "Edit Task";
  taskSubmitButton.textContent = "Save";
  cancelEditButton.classList.remove("hidden");
}

function toDatetimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  try {
    setBusy(true);

    if (state.mode === "register") {
      await api("/auth/register", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email, password }),
      });
      setAuthMode("login");
      setMessage("Account created. Login to continue.");
      return;
    }

    const data = await api("/auth/login", {
      method: "POST",
      skipAuth: true,
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
    handleRequestError(error);
  } finally {
    setBusy(false);
  }
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#task-title").value.trim();
  const description = document.querySelector("#task-description").value.trim();
  const priority = document.querySelector("#task-priority").value;
  const dueDate = document.querySelector("#task-due-date").value;
  const body = {
    title,
    description: description || null,
    priority,
    due_date: dueDate ? new Date(dueDate).toISOString() : null,
  };

  try {
    setBusy(true);

    if (state.editingTaskId) {
      await api(`/tasks/${state.editingTaskId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setMessage("Task updated.");
    } else {
      await api("/tasks", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setMessage("Task created.");
    }

    resetTaskForm();
    state.page = 1;
    await loadTasks();
  } catch (error) {
    handleRequestError(error);
  } finally {
    setBusy(false);
  }
});

tasks.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const task = state.tasks.find((item) => item.id === id);

  if (!task) return;

  try {
    if (button.dataset.action === "edit") {
      fillTaskForm(task);
      return;
    }

    if (button.dataset.action === "toggle") {
      await api(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
    }

    if (button.dataset.action === "delete") {
      const confirmed = window.confirm(`Delete "${task.title}"?`);
      if (!confirmed) return;
      await api(`/tasks/${id}`, { method: "DELETE" });
    }

    if (state.editingTaskId === id) {
      resetTaskForm();
    }

    await loadTasks();
  } catch (error) {
    handleRequestError(error);
  }
});

document.querySelector("#logout-button").addEventListener("click", () => {
  clearSession("Logged out.");
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
cancelEditButton.addEventListener("click", resetTaskForm);
loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

setAuthMode("login");
renderSession();
loadTasks();
