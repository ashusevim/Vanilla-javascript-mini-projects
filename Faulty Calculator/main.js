/*
 * A calculator with a mischievous twist: roughly 10% of the time it flips the
 * operator to its opposite and shows the "wrong" answer with a glitch flash.
 * No eval() — a small parser evaluates a single binary expression safely.
 */

const display = document.getElementById('display');
const exprEl = document.getElementById('expr');
const calc = document.getElementById('calc');
const historyEl = document.getElementById('history');

const ops = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
};
const opposite = { '+': '-', '-': '+', '*': '/', '/': '*' };
const symbol = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const FAULT_CHANCE = 0.1;

let a = '';
let op = null;
let b = '';
let justEvaluated = false;

function render() {
  const shown = (op === null ? a : b) || (op === null ? '0' : '');
  display.textContent = shown || '0';
  exprEl.innerHTML = op === null ? '&nbsp;' : `${a} ${symbol[op]}`;
}

function inputNum(n) {
  if (justEvaluated && op === null) { a = ''; justEvaluated = false; }
  if (op === null) {
    if (n === '.' && a.includes('.')) return;
    a = a === '0' && n !== '.' ? n : a + n;
  } else {
    if (n === '.' && b.includes('.')) return;
    b = b === '0' && n !== '.' ? n : b + n;
  }
  render();
}

function inputOp(nextOp) {
  if (a === '') return;
  if (op !== null && b !== '') evaluate(false);
  op = nextOp;
  justEvaluated = false;
  render();
}

function evaluate(showHistory = true) {
  if (op === null || a === '' || b === '') return;
  const x = parseFloat(a);
  const y = parseFloat(b);

  const faulty = Math.random() < FAULT_CHANCE;
  const actualOp = faulty ? opposite[op] : op;

  if (actualOp === '/' && y === 0) {
    display.textContent = 'Nope ÷0';
    resetAll();
    return;
  }

  let value = ops[actualOp](x, y);
  value = Math.round(value * 1e6) / 1e6;

  if (showHistory) addHistory(`${x} ${symbol[op]} ${y}`, value, faulty);

  if (faulty) flashGlitch();

  a = String(value);
  op = null;
  b = '';
  justEvaluated = true;
  render();
}

function addHistory(expr, value, faulty) {
  const row = document.createElement('div');
  row.className = 'h-row' + (faulty ? ' faulty' : '');
  row.innerHTML = `<span>${expr}</span><span>= ${value}${faulty ? ' 👻' : ''}</span>`;
  historyEl.appendChild(row);
  historyEl.scrollTop = historyEl.scrollHeight;
}

function flashGlitch() {
  calc.classList.remove('glitch');
  void calc.offsetWidth; // restart animation
  calc.classList.add('glitch');
}

function resetAll() { a = ''; op = null; b = ''; justEvaluated = false; }

function backspace() {
  if (op === null) a = a.slice(0, -1);
  else if (b !== '') b = b.slice(0, -1);
  else op = null;
  render();
}

document.querySelector('.keys').addEventListener('click', (e) => {
  const btn = e.target.closest('.key');
  if (!btn) return;
  if (btn.dataset.num !== undefined) inputNum(btn.dataset.num);
  else if (btn.dataset.op !== undefined) inputOp(btn.dataset.op);
  else if (btn.dataset.action === 'equals') { evaluate(); }
  else if (btn.dataset.action === 'clear') { resetAll(); render(); display.textContent = '0'; }
  else if (btn.dataset.action === 'back') backspace();
});

// Keyboard support.
window.addEventListener('keydown', (e) => {
  if (/[0-9.]/.test(e.key)) inputNum(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) inputOp(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); evaluate(); }
  else if (e.key === 'Backspace') backspace();
  else if (e.key === 'Escape') { resetAll(); render(); display.textContent = '0'; }
});

render();
