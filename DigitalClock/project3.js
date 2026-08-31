const clock = document.getElementById('clock');
const dateEl = document.getElementById('date');
const greeting = document.getElementById('greeting');
const hourHand = document.getElementById('hour');
const minuteHand = document.getElementById('minute');
const secondHand = document.getElementById('second');

function greetingFor(hour) {
  if (hour < 5) return 'Good night 🌙';
  if (hour < 12) return 'Good morning ☀️';
  if (hour < 17) return 'Good afternoon 🌤️';
  if (hour < 21) return 'Good evening 🌆';
  return 'Good night 🌙';
}

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ms = now.getMilliseconds();

  clock.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  greeting.textContent = greetingFor(h);
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Smooth (sub-second) hand movement.
  const secDeg = (s + ms / 1000) * 6;
  const minDeg = (m + s / 60) * 6;
  const hrDeg = ((h % 12) + m / 60) * 30;

  secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
  hourHand.style.transform = `translateX(-50%) rotate(${hrDeg}deg)`;

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
