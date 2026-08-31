const input = document.getElementById('input');
const output = document.getElementById('output');
const toolbar = document.getElementById('toolbar');
const charsEl = document.getElementById('chars');
const wordsEl = document.getElementById('words');
const copyBtn = document.getElementById('copy');

let textCase = 'none';
const styles = { bold: false, italic: false, underline: false, strike: false };

function transformCase(text) {
  switch (textCase) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\b\w/g, (c) => c.toUpperCase());
    default: return text;
  }
}

function render() {
  const raw = input.value;
  output.textContent = raw ? transformCase(raw) : 'Your formatted text appears here…';
  output.classList.toggle('placeholder', !raw);

  output.style.fontWeight = styles.bold ? '700' : '400';
  output.style.fontStyle = styles.italic ? 'italic' : 'normal';
  const deco = [];
  if (styles.underline) deco.push('underline');
  if (styles.strike) deco.push('line-through');
  output.style.textDecoration = deco.join(' ') || 'none';

  const chars = raw.length;
  const words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
  charsEl.textContent = chars;
  wordsEl.textContent = words;
}

toolbar.addEventListener('click', (e) => {
  const btn = e.target.closest('.tool');
  if (!btn) return;

  if (btn.dataset.case) {
    // Case is exclusive; toggling the active one turns it off.
    textCase = textCase === btn.dataset.case ? 'none' : btn.dataset.case;
    toolbar.querySelectorAll('[data-case]').forEach((b) =>
      b.classList.toggle('active', b.dataset.case === textCase));
  }

  if (btn.dataset.style) {
    styles[btn.dataset.style] = !styles[btn.dataset.style];
    btn.classList.toggle('active', styles[btn.dataset.style]);
  }
  render();
});

input.addEventListener('input', render);

copyBtn.addEventListener('click', async () => {
  if (!input.value) return;
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('done');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('done'); }, 1200);
  } catch {
    copyBtn.textContent = 'Failed';
  }
});

render();
