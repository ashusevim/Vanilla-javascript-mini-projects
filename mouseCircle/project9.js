const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor');

let w, h;
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);

let mouseX = w / 2;
let mouseY = h / 2;
let ringX = mouseX;
let ringY = mouseY;
let hue = 0;
let moving = false;
let idleTimer = null;

const particles = [];

function addParticles(x, y) {
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 6 + 2,
      hue,
      life: 1,
    });
  }
}

function onMove(x, y) {
  mouseX = x; mouseY = y;
  addParticles(x, y);
  moving = true;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => (moving = false), 120);
}

addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  onMove(t.clientX, t.clientY);
}, { passive: true });

function loop() {
  hue = (hue + 1.5) % 360;

  // Fade the canvas slightly each frame for motion-blur trails.
  ctx.fillStyle = 'rgba(6, 6, 12, 0.15)';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02;
    p.life -= 0.02;
    if (p.life <= 0) { particles.splice(i, 1); continue; }

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.life})`;
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Smooth follower ring.
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursor.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${moving ? 1 : 0.6})`;
  cursor.style.borderColor = `hsl(${hue}, 90%, 65%)`;

  requestAnimationFrame(loop);
}
loop();
