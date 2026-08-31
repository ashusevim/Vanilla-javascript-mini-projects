const SOLIDS = [
  { label: 'Slate', value: '#334155' },
  { label: 'Snow', value: '#f8fafc' },
  { label: 'Ocean', value: '#1e6fff' },
  { label: 'Sunflower', value: '#ffd21e' },
  { label: 'Ink', value: '#0f1116' },
  { label: 'Gold', value: '#ffd700' },
  { label: 'Rose', value: '#ff5c9d' },
  { label: 'Mint', value: '#24d3a5' },
];

const GRADIENTS = [
  { label: 'Aurora', value: 'linear-gradient(135deg,#7c5cff,#24d3ee)' },
  { label: 'Sunset', value: 'linear-gradient(135deg,#ff5c9d,#ffaf7b)' },
  { label: 'Forest', value: 'linear-gradient(135deg,#0ba360,#3cba92)' },
  { label: 'Grape', value: 'linear-gradient(135deg,#3a1c71,#d76d77)' },
  { label: 'Steel', value: 'linear-gradient(135deg,#141e30,#243b55)' },
  { label: 'Peach', value: 'linear-gradient(135deg,#ee9ca7,#ffdde1)' },
  { label: 'Neon', value: 'linear-gradient(135deg,#12c2e9,#c471ed,#f64f59)' },
  { label: 'Lagoon', value: 'linear-gradient(135deg,#43cea2,#185a9d)' },
];

const swatchWrap = document.getElementById('swatches');
const codeChip = document.getElementById('code');
const codeText = document.getElementById('code-text');
const copyHint = document.getElementById('copy-hint');
const tabs = document.querySelectorAll('.tab');

let current = '';

function isDark(hex) {
  if (!hex.startsWith('#')) return true;
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  // Perceived luminance.
  return (0.299 * r + 0.587 * g + 0.114 * b) < 150;
}

function applyBackground(value) {
  current = value;
  document.body.style.background = value;
  document.body.style.color = isDark(value) ? '#f8fafc' : '#111';
  codeText.textContent = value;
  copyHint.textContent = 'copy';
}

function renderSwatches(kind) {
  const list = kind === 'gradient' ? GRADIENTS : SOLIDS;
  swatchWrap.innerHTML = '';

  list.forEach(({ label, value }, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch';
    btn.style.background = value;
    btn.style.animationDelay = `${i * 45}ms`;
    btn.setAttribute('aria-label', label);
    btn.title = label;

    btn.addEventListener('click', (e) => {
      ripple(btn, e);
      swatchWrap.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      applyBackground(value);
    });

    swatchWrap.appendChild(btn);
  });
}

function ripple(el, event) {
  const circle = document.createElement('span');
  circle.className = 'ripple';
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  circle.style.width = circle.style.height = `${size}px`;
  circle.style.left = `${event.clientX - rect.left - size / 2}px`;
  circle.style.top = `${event.clientY - rect.top - size / 2}px`;
  el.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    renderSwatches(tab.dataset.tab);
  });
});

codeChip.addEventListener('click', async () => {
  if (!current) return;
  try {
    await navigator.clipboard.writeText(current);
    copyHint.textContent = 'copied!';
    codeChip.classList.add('copied');
    setTimeout(() => {
      copyHint.textContent = 'copy';
      codeChip.classList.remove('copied');
    }, 1200);
  } catch {
    copyHint.textContent = 'press ⌘/Ctrl+C';
  }
});

renderSwatches('solid');
