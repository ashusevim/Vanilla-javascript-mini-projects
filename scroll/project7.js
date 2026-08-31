const bar = document.getElementById('bar');
const readout = document.getElementById('readout');
const content = document.getElementById('content');
const dotsWrap = document.getElementById('dots');

const SECTIONS = [
  { title: 'Momentum', icon: '🌀', text: 'A scroll indicator turns a vague sense of "how far am I?" into a precise, ambient signal you barely have to think about.' },
  { title: 'Feedback', icon: '📶', text: 'Progress bars reduce perceived wait and uncertainty. The same idea powers reading progress on long articles.' },
  { title: 'Rhythm', icon: '🎚️', text: 'Reveal-on-scroll animations give a page rhythm — content arrives as you reach for it, not all at once.' },
  { title: 'Navigation', icon: '🧭', text: 'Section dots double as a map and a remote control: they show where you are and jump you anywhere.' },
  { title: 'Performance', icon: '⚡', text: 'Throttling scroll work to one update per animation frame keeps everything buttery, even on long pages.' },
  { title: 'The End', icon: '🏁', text: 'You made it to the bottom — the bar is full and the dial reads 100%. Scroll back up to replay.' },
];

// Build sections + nav dots.
SECTIONS.forEach((s, i) => {
  const section = document.createElement('section');
  section.className = 'panel';
  section.id = `sec-${i}`;
  section.innerHTML = `
    <div class="panel-inner">
      <span class="panel-icon">${s.icon}</span>
      <h2>${s.title}</h2>
      <p>${s.text}</p>
    </div>`;
  content.appendChild(section);

  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.title = s.title;
  dot.addEventListener('click', () => section.scrollIntoView({ behavior: 'smooth' }));
  dotsWrap.appendChild(dot);
});

const dots = [...dotsWrap.children];
const panels = [...document.querySelectorAll('.panel')];

// Reveal on scroll.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.3 });
panels.forEach((p) => observer.observe(p));

// Active dot tracking.
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const idx = panels.indexOf(e.target);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.6 });
panels.forEach((p) => activeObserver.observe(p));

// Progress bar + readout, throttled with rAF.
let ticking = false;
function update() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = height > 0 ? Math.min(100, Math.round((scrollTop / height) * 100)) : 0;
  bar.style.width = pct + '%';
  readout.textContent = pct + '%';
  readout.style.setProperty('--p', pct);
  ticking = false;
}
addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(update); ticking = true; }
});
update();
