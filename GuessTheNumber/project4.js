const MAX_GUESSES = 10;

const form = document.getElementById('form');
const input = document.getElementById('guessField');
const submitBtn = document.getElementById('subt');
const feedback = document.getElementById('feedback');
const thermo = document.getElementById('thermo');
const attemptsEl = document.getElementById('attempts');
const remainingEl = document.getElementById('remaining');
const history = document.getElementById('history');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

let target, guessCount, playing;

function start() {
  target = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  playing = true;
  attemptsEl.textContent = '0';
  remainingEl.textContent = MAX_GUESSES;
  history.innerHTML = '';
  feedback.textContent = 'Take a guess…';
  feedback.className = 'feedback';
  thermo.style.width = '0%';
  thermo.style.background = '#334155';
  input.value = '';
  input.disabled = false;
  submitBtn.textContent = 'Guess';
  input.focus();
}

function proximity(guess) {
  const diff = Math.abs(guess - target);
  if (diff === 0) return { pct: 100, color: '#67e0a3', word: '' };
  if (diff <= 3) return { pct: 92, color: '#ff4d4d', word: '🔥 Boiling!' };
  if (diff <= 8) return { pct: 74, color: '#ff8c42', word: '♨️ Very hot' };
  if (diff <= 15) return { pct: 55, color: '#ffd166', word: '🌤️ Warm' };
  if (diff <= 30) return { pct: 36, color: '#4dabf7', word: '❄️ Cold' };
  return { pct: 18, color: '#4263eb', word: '🧊 Freezing' };
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!playing) { start(); return; }

  const guess = Number(input.value);
  if (input.value.trim() === '' || Number.isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = 'Enter a number from 1 to 100.';
    feedback.className = 'feedback warn';
    return;
  }

  guessCount++;
  attemptsEl.textContent = guessCount;
  remainingEl.textContent = MAX_GUESSES - guessCount;

  const prox = proximity(guess);
  thermo.style.width = prox.pct + '%';
  thermo.style.background = prox.color;

  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.textContent = guess;
  chip.style.borderColor = prox.color;
  history.appendChild(chip);

  input.value = '';

  if (guess === target) {
    feedback.textContent = `🎉 Got it in ${guessCount}!`;
    feedback.className = 'feedback win';
    burstConfetti();
    endGame();
  } else if (guessCount >= MAX_GUESSES) {
    feedback.textContent = `Out of guesses — it was ${target}.`;
    feedback.className = 'feedback lose';
    endGame();
  } else {
    const dir = guess > target ? 'Too high' : 'Too low';
    feedback.textContent = `${prox.word} · ${dir} ${guess > target ? '⬇️' : '⬆️'}`;
    feedback.className = 'feedback';
  }
});

function endGame() {
  playing = false;
  input.disabled = true;
  submitBtn.textContent = 'Play again';
}

/* ---- Confetti ---- */
let pieces = [];
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);

function burstConfetti() {
  const colors = ['#7c5cff', '#ff5c9d', '#24d3ee', '#67e0a3', '#ffd166'];
  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: innerWidth / 2, y: innerHeight / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 20,
      life: 1,
    });
  }
  if (pieces.length <= 140) requestAnimationFrame(drawConfetti);
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.35; p.rot += p.vr; p.life -= 0.008;
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.life > 0 && p.y < canvas.height + 50);
  if (pieces.length) requestAnimationFrame(drawConfetti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}

start();
