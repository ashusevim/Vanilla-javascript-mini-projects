const input = document.getElementById('user-input');
const card = document.getElementById('user-card');
const timer = document.getElementById('timer');
const keysEl = document.getElementById('keys');
const callsEl = document.getElementById('calls');
const savedEl = document.getElementById('saved');

const DELAY = 700;
let keystrokes = 0;
let calls = 0;
let requestId = 0;
let timerStart = 0;
let rafId = null;

function updateSaved() {
  const pct = keystrokes ? Math.round((1 - calls / keystrokes) * 100) : 0;
  savedEl.textContent = `${pct}%`;
}

function animateTimer() {
  const elapsed = performance.now() - timerStart;
  const pct = Math.min(1, elapsed / DELAY);
  timer.style.width = `${pct * 100}%`;
  if (pct < 1) rafId = requestAnimationFrame(animateTimer);
}

function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    timerStart = performance.now();
    cancelAnimationFrame(rafId);
    animateTimer();
    t = setTimeout(() => {
      timer.style.width = '0%';
      fn(...args);
    }, delay);
  };
}

function showStatus(msg) {
  card.classList.add('visible');
  card.innerHTML = `<span class="status">${msg}</span>`;
}

async function fetchUser() {
  const id = ++requestId;
  calls++;
  callsEl.textContent = calls;
  updateSaved();
  showStatus('Fetching…');

  try {
    const res = await fetch('https://randomuser.me/api/');
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (id !== requestId) return;

    const u = data.results[0];
    card.classList.add('visible');
    card.innerHTML = `
      <img src="${u.picture.large}" alt="Avatar of ${u.name.first}" />
      <div class="u-name">${u.name.first} ${u.name.last}</div>
      <div class="u-row"><span>📧</span> ${u.email}</div>
      <div class="u-row"><span>📞</span> ${u.phone}</div>
      <div class="u-row"><span>📍</span> ${u.location.city}, ${u.location.country}</div>`;
  } catch {
    if (id === requestId) showStatus('Could not load — keep typing.');
  }
}

const debouncedFetch = debounce(fetchUser, DELAY);

input.addEventListener('input', () => {
  keystrokes++;
  keysEl.textContent = keystrokes;
  updateSaved();
  debouncedFetch();
});
