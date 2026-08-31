const URL = 'https://official-joke-api.appspot.com/jokes/random';
const getBtn = document.getElementById('get');
const copyBtn = document.getElementById('copy');
const setupEl = document.getElementById('setup');
const punchEl = document.getElementById('punch');

let requestId = 0;
let typingTimer = null;
let currentJoke = '';

getBtn.addEventListener('click', getJoke);

async function getJoke() {
  const id = ++requestId;
  clearTimeout(typingTimer);
  getBtn.disabled = true;
  getBtn.textContent = 'Thinking…';
  copyBtn.hidden = true;
  setupEl.textContent = '…';
  punchEl.textContent = '';
  punchEl.classList.remove('show');

  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (id !== requestId) return;

    setupEl.textContent = data.setup;
    currentJoke = `${data.setup}\n${data.punchline}`;

    // Reveal the punchline with a typewriter effect after a beat.
    typingTimer = setTimeout(() => typewrite(data.punchline, id), 700);
  } catch {
    if (id === requestId) setupEl.textContent = 'Could not load a joke — try again!';
  } finally {
    if (id === requestId) { getBtn.disabled = false; getBtn.textContent = 'Another one'; }
  }
}

function typewrite(text, id) {
  punchEl.classList.add('show');
  let i = 0;
  (function step() {
    if (id !== requestId) return;
    punchEl.textContent = text.slice(0, i);
    if (i <= text.length) {
      i++;
      typingTimer = setTimeout(step, 28);
    } else {
      copyBtn.hidden = false;
    }
  })();
}

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentJoke);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
  } catch {
    copyBtn.textContent = 'Copy failed';
  }
});
