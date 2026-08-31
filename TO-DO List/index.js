const form = document.getElementById('form');
const taskInput = document.getElementById('task');
const list = document.getElementById('list');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const filtersEl = document.getElementById('filters');
const clearDoneBtn = document.getElementById('clear-done');

const STORAGE_KEY = 'todo-tasks-v2';
let tasks = load();
let filter = 'all';
let dragId = null;

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

const CHECK = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`;

function render() {
  const visible = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  );

  list.innerHTML = '';
  visible.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'item' + (task.done ? ' done' : '');
    li.draggable = true;
    li.dataset.id = task.id;

    li.innerHTML = `
      <button class="check" aria-label="Toggle done">${task.done ? CHECK : ''}</button>
      <span class="text">${escapeHtml(task.text)}</span>
      <button class="del" aria-label="Delete">✕</button>`;

    li.querySelector('.check').addEventListener('click', () => toggle(task.id));
    li.querySelector('.del').addEventListener('click', () => remove(task.id, li));

    li.addEventListener('dragstart', () => { dragId = task.id; li.classList.add('dragging'); });
    li.addEventListener('dragend', () => { dragId = null; li.classList.remove('dragging'); });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (dragId === null || dragId === task.id) return;
      reorder(dragId, task.id);
    });

    list.appendChild(li);
  });

  const active = tasks.filter((t) => !t.done).length;
  countEl.textContent = `${active} left · ${tasks.length} total`;
  emptyEl.style.display = visible.length ? 'none' : 'block';
  emptyEl.textContent = tasks.length
    ? 'No tasks in this view.'
    : 'Nothing here yet — add your first task! ✨';
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function add(text) {
  tasks.push({ id: Date.now() + Math.random(), text, done: false });
  save(); render();
}
function toggle(id) {
  const t = tasks.find((x) => x.id === id);
  if (t) t.done = !t.done;
  save(); render();
}
function remove(id, li) {
  li.classList.add('removing');
  li.addEventListener('animationend', () => {
    tasks = tasks.filter((x) => x.id !== id);
    save(); render();
  }, { once: true });
}
function reorder(from, to) {
  const fromIdx = tasks.findIndex((t) => t.id === from);
  const toIdx = tasks.findIndex((t) => t.id === to);
  if (fromIdx < 0 || toIdx < 0) return;
  const [moved] = tasks.splice(fromIdx, 1);
  tasks.splice(toIdx, 0, moved);
  save(); render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) { taskInput.classList.add('shake'); setTimeout(() => taskInput.classList.remove('shake'), 400); return; }
  add(text);
  taskInput.value = '';
  taskInput.focus();
});

filtersEl.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    filtersEl.querySelectorAll('.filter').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    filter = btn.dataset.filter;
    render();
  });
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter((t) => !t.done);
  save(); render();
});

render();
