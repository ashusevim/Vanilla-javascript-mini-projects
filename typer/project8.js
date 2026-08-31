const typed = document.getElementById('typed');
const cursor = document.getElementById('cursor');
const speedInput = document.getElementById('speed');
const cursorsWrap = document.getElementById('cursors');

const PHRASES = ['awesome.', 'everywhere.', 'powerful.', 'fun to learn.', 'just getting started.'];
const HOLD = 1400;
const ERASE_FACTOR = 0.5;

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let typeSpeed = Number(speedInput.value);
let timer = null;

function tick() {
  const phrase = PHRASES[phraseIndex];

  if (!deleting) {
    charIndex++;
    typed.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      timer = setTimeout(tick, HOLD);
      return;
    }
    timer = setTimeout(tick, typeSpeed);
  } else {
    charIndex--;
    typed.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      timer = setTimeout(tick, typeSpeed);
      return;
    }
    timer = setTimeout(tick, typeSpeed * ERASE_FACTOR);
  }
}

speedInput.addEventListener('input', () => {
  // Higher slider = faster typing, so invert.
  typeSpeed = 240 - Number(speedInput.value);
});

cursorsWrap.addEventListener('click', (e) => {
  const btn = e.target.closest('.cbtn');
  if (!btn) return;
  cursorsWrap.querySelectorAll('.cbtn').forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  cursor.className = 'cursor ' + btn.dataset.cursor;
});

typeSpeed = 240 - Number(speedInput.value);
cursor.classList.add('bar');
timer = setTimeout(tick, 400);
