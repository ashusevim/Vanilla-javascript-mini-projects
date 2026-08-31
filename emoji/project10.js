const CATEGORIES = {
  '😀 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','😋','😛','😜','🤪','😝','🤗','🤭','🤫','🤔','😐','😑','😬','🙄','😴','🤤','😪','😵','🥴','🤠','🥳','🤓','🧐'],
  '🐶 Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦉','🦇','🐺','🐗','🦄','🐝','🦋','🐌','🐢','🐙','🦕','🐬','🐳','🦈','🐊'],
  '🍔 Food': ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🍜','🍣','🍩','🍪','🎂','🍰','🍫','🍿','🍺','🍷','☕'],
  '⚽ Activities': ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','⛳','🎣','🎿','🛹','🎮','🎲','🎯','🎳','🎸','🎹','🎺','🎻','🥁','🎤','🎧','🎨','♟️','🧩'],
  '💜 Symbols': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💗','💓','💞','💕','💌','⭐','🌟','✨','⚡','🔥','💥','🌈','☀️','🌙','⭐','💯','✅','❌','❓','❗','🎉'],
};

const bigEl = document.getElementById('big');
const catsEl = document.getElementById('cats');
const gridEl = document.getElementById('grid');
const toast = document.getElementById('toast');
const shuffleBtn = document.getElementById('shuffle');

let toastTimer = null;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1200);
}

async function copyEmoji(emoji) {
  bigEl.textContent = emoji;
  bigEl.classList.remove('pop');
  void bigEl.offsetWidth;
  bigEl.classList.add('pop');
  try {
    await navigator.clipboard.writeText(emoji);
    showToast(`Copied ${emoji}`);
  } catch {
    showToast(`${emoji} (copy unavailable)`);
  }
}

function renderGrid(list) {
  gridEl.innerHTML = '';
  list.forEach((emoji, i) => {
    const btn = document.createElement('button');
    btn.className = 'emoji';
    btn.textContent = emoji;
    btn.style.animationDelay = `${Math.min(i * 12, 300)}ms`;
    btn.addEventListener('click', () => copyEmoji(emoji));
    gridEl.appendChild(btn);
  });
}

Object.keys(CATEGORIES).forEach((cat, idx) => {
  const btn = document.createElement('button');
  btn.className = 'cat' + (idx === 0 ? ' is-active' : '');
  btn.textContent = cat;
  btn.addEventListener('click', () => {
    catsEl.querySelectorAll('.cat').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    renderGrid(CATEGORIES[cat]);
  });
  catsEl.appendChild(btn);
});

shuffleBtn.addEventListener('click', () => {
  const all = Object.values(CATEGORIES).flat();
  copyEmoji(all[(Math.random() * all.length) | 0]);
});

renderGrid(Object.values(CATEGORIES)[0]);
