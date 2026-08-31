const QUESTIONS = [
  { q: "Capital of France?", a: ["Berlin", "Madrid", "Paris", "Rome"], c: 2 },
  { q: "Which planet is the Red Planet?", a: ["Earth", "Mars", "Jupiter", "Venus"], c: 1 },
  { q: "Which is a Python data type?", a: ["String", "Integer", "List", "All of these"], c: 3 },
  { q: "Keyword to create an object in Java?", a: ["new", "create", "object", "make"], c: 0 },
  { q: "Year World War II ended?", a: ["1942", "1945", "1948", "1939"], c: 1 },
  { q: "Largest ocean on Earth?", a: ["Atlantic", "Indian", "Pacific", "Arctic"], c: 2 },
  { q: "Currency of Japan?", a: ["Yen", "Won", "Dollar", "Peso"], c: 0 },
  { q: "Square root of 144?", a: ["10", "11", "12", "14"], c: 2 },
  { q: "HTTP stands for?", a: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Translation Protocol", "High Transmission Text Protocol"], c: 0 },
  { q: "What does CPU stand for?", a: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Programming Unit"], c: 1 },
  { q: "Time complexity of binary search?", a: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], c: 1 },
  { q: "DOM stands for?", a: ["Document Object Model", "Dynamic Object Model", "Document Object Management", "Dynamic Object Manipulation"], c: 0 },
];

const QUIZ_LENGTH = 5;
const TIME_PER_Q = 15;

const box = document.querySelector('.box');
const stage = document.getElementById('stage');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const counterEl = document.getElementById('counter');
const timerEl = document.getElementById('timer');
const progress = document.getElementById('progress');

let quiz = [];
let index = 0;
let score = 0;
let answered = false;
let timeLeft = TIME_PER_Q;
let timerId = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function start() {
  quiz = shuffle(QUESTIONS).slice(0, QUIZ_LENGTH);
  index = 0; score = 0;
  nextBtn.textContent = 'Next';
  showQuestion();
}

function showQuestion() {
  answered = false;
  const item = quiz[index];

  stage.classList.remove('in');
  void stage.offsetWidth;
  stage.classList.add('in');

  counterEl.textContent = `${index + 1} / ${QUIZ_LENGTH}`;
  progress.style.width = `${(index / QUIZ_LENGTH) * 100}%`;
  questionEl.textContent = item.q;

  optionsEl.innerHTML = '';
  item.a.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.type = 'button';
    btn.style.animationDelay = `${i * 60}ms`;
    btn.textContent = text;
    btn.addEventListener('click', () => choose(i, btn));
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = true;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_Q;
  timerEl.textContent = timeLeft;
  timerEl.classList.remove('low');
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 5) timerEl.classList.add('low');
    if (timeLeft <= 0) { clearInterval(timerId); timeUp(); }
  }, 1000);
}

function choose(i, btn) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const correct = quiz[index].c;
  const buttons = [...optionsEl.children];
  if (i === correct) { btn.classList.add('correct'); score++; }
  else { btn.classList.add('wrong'); buttons[correct].classList.add('correct'); }
  buttons.forEach((b) => (b.disabled = true));
  nextBtn.disabled = false;
}

function timeUp() {
  if (answered) return;
  answered = true;
  const buttons = [...optionsEl.children];
  buttons[quiz[index].c].classList.add('correct');
  buttons.forEach((b) => (b.disabled = true));
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  if (index < QUIZ_LENGTH - 1) { index++; showQuestion(); }
  else showScore();
});

function showScore() {
  clearInterval(timerId);
  progress.style.width = '100%';
  const pct = Math.round((score / QUIZ_LENGTH) * 100);
  const dash = 2 * Math.PI * 52;

  const msg = pct === 100 ? 'Perfect! 🏆' : pct >= 60 ? 'Nicely done! 🎯' : 'Keep practising 💪';

  stage.innerHTML = `
    <div class="score-wrap">
      <svg class="ring" viewBox="0 0 120 120">
        <circle class="ring-bg" cx="60" cy="60" r="52"></circle>
        <circle class="ring-fg" cx="60" cy="60" r="52"
          style="stroke-dasharray:${dash};stroke-dashoffset:${dash}"></circle>
        <text x="60" y="66" class="ring-text">${score}/${QUIZ_LENGTH}</text>
      </svg>
      <p class="score-msg">${msg}</p>
    </div>`;

  requestAnimationFrame(() => {
    const fg = stage.querySelector('.ring-fg');
    fg.style.transition = 'stroke-dashoffset 1s ease';
    fg.style.strokeDashoffset = dash * (1 - score / QUIZ_LENGTH);
  });

  counterEl.textContent = 'Done';
  timerEl.style.display = 'none';
  nextBtn.textContent = 'Play again';
  nextBtn.disabled = false;
  nextBtn.onclick = () => location.reload();
}

start();
