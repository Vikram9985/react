// Minimal localStorage helpers for the task manager
const USERS_KEY = 'taskManager_users_v1';
const TASKS_KEY = 'taskManager_tasks_v1';

function generateId(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function defaultUsers() {
  return [
    { id: 'u1', name: 'Alice' },
    { id: 'u2', name: 'Bob' },
    { id: 'u3', name: 'Carol' },
  ];
}

function defaultTasks() {
  return [
    { id: generateId('t'), title: 'Welcome task', description: 'This is assigned to Alice', assignedTo: 'u1', status: 'Todo', createdAt: Date.now() },
  ];
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const d = defaultUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(d));
      return d;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadUsers error', e);
    return defaultUsers();
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('saveUsers error', e);
  }
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      const d = defaultTasks();
      localStorage.setItem(TASKS_KEY, JSON.stringify(d));
      return d;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadTasks error', e);
    return defaultTasks();
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('saveTasks error', e);
  }
}

export function createUser(name) {
  const u = { id: generateId('u'), name };
  const users = loadUsers();
  users.push(u);
  saveUsers(users);
  return u;
}

export function createTask({ title, description, assignedTo }) {
  const t = { id: generateId('t'), title, description, assignedTo, status: 'Todo', createdAt: Date.now() };
  const tasks = loadTasks();
  tasks.push(t);
  saveTasks(tasks);
  return t;
}

export function updateTask(taskId, patch) {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch };
  saveTasks(tasks);
  return tasks[idx];
}

export default { loadUsers, saveUsers, loadTasks, saveTasks, createUser, createTask, updateTask };
