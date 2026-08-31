const ROWS = [
  [['Escape', 'esc'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['0'], ['Backspace', '⌫']],
  [['Tab', 'tab'], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p']],
  [['CapsLock', 'caps'], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], ['Enter', '⏎']],
  [['Shift', 'shift', 'ShiftLeft'], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [','], ['.'], ['/']],
  [['Control', 'ctrl', 'ControlLeft'], ['Alt', 'alt', 'AltLeft'], [' ', 'space', 'Space'], ['ArrowLeft', '←'], ['ArrowUp', '↑'], ['ArrowDown', '↓'], ['ArrowRight', '→']],
];

const keyboard = document.getElementById('keyboard');
const history = document.getElementById('history');
const LOCATIONS = ['Standard', 'Left', 'Right', 'Numpad'];
const keyMap = {};

ROWS.forEach((row) => {
  const rowEl = document.createElement('div');
  rowEl.className = 'row';
  row.forEach(([key, label, codeName]) => {
    const el = document.createElement('div');
    el.className = 'k';
    if (label && label.length > 1) el.classList.add('wide');
    if (key === ' ') el.classList.add('space');
    el.textContent = label || key;
    // Register under lowercased key and optional code.
    keyMap[key.toLowerCase()] = el;
    if (codeName) keyMap[codeName.toLowerCase()] = el;
    rowEl.appendChild(el);
  });
  keyboard.appendChild(rowEl);
});

function setInfo(e) {
  document.getElementById('v-key').textContent = e.key === ' ' ? 'Space' : e.key;
  document.getElementById('v-code').textContent = e.code || '—';
  document.getElementById('v-which').textContent = e.keyCode;
  document.getElementById('v-loc').textContent = LOCATIONS[e.location] || e.location;
}

function addHistory(key) {
  const chip = document.createElement('span');
  chip.className = 'h-chip';
  chip.textContent = key === ' ' ? '␣' : key;
  history.prepend(chip);
  while (history.children.length > 12) history.lastChild.remove();
}

function highlight(e) {
  const el = keyMap[e.key.toLowerCase()] || keyMap[e.code.toLowerCase()];
  if (el) el.classList.add('active');
}
function unhighlight(e) {
  const el = keyMap[e.key.toLowerCase()] || keyMap[e.code.toLowerCase()];
  if (el) el.classList.remove('active');
}

window.addEventListener('keydown', (e) => {
  if (['Tab', ' ', 'ArrowUp', 'ArrowDown', '/'].includes(e.key)) e.preventDefault();
  setInfo(e);
  highlight(e);
  addHistory(e.key);
});
window.addEventListener('keyup', unhighlight);
