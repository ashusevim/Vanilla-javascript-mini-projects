const form = document.getElementById('bmi-form');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const hLabel = document.getElementById('h-label');
const wLabel = document.getElementById('w-label');
const result = document.getElementById('result');
const bmiValue = document.getElementById('bmi-value');
const bmiCat = document.getElementById('bmi-cat');
const gaugeFill = document.getElementById('gauge-fill');
const gaugeDot = document.getElementById('gauge-dot');
const unitBtns = document.querySelectorAll('.u-btn');

let unit = 'metric';
const ARC_LENGTH = gaugeFill.getTotalLength();
gaugeFill.style.strokeDasharray = ARC_LENGTH;

unitBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    unitBtns.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    unit = btn.dataset.unit;
    if (unit === 'metric') {
      hLabel.textContent = 'Height (cm)';
      wLabel.textContent = 'Weight (kg)';
      heightInput.placeholder = '175';
      weightInput.placeholder = '70';
    } else {
      hLabel.textContent = 'Height (in)';
      wLabel.textContent = 'Weight (lb)';
      heightInput.placeholder = '69';
      weightInput.placeholder = '154';
    }
    result.hidden = true;
  });
});

function categoryFor(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', tone: 'low', color: '#ffd166' };
  if (bmi < 25) return { label: 'Normal range', tone: 'ok', color: '#67e0a3' };
  if (bmi < 30) return { label: 'Overweight', tone: 'high', color: '#ffa552' };
  return { label: 'Obese', tone: 'vhigh', color: '#ff8b8b' };
}

// Animate a number counting up.
function animateValue(el, to) {
  const start = performance.now();
  const duration = 700;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (to * eased).toFixed(1);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = to.toFixed(1);
  }
  requestAnimationFrame(frame);
}

function setGauge(bmi, color) {
  // Map BMI 10..40 onto the semicircle.
  const pct = Math.max(0, Math.min(1, (bmi - 10) / 30));
  const point = gaugeFill.getPointAtLength(ARC_LENGTH * pct);
  gaugeFill.style.stroke = color;
  gaugeFill.style.transition = 'stroke-dashoffset 0.8s ease, stroke 0.4s';
  gaugeFill.style.strokeDashoffset = ARC_LENGTH * (1 - pct);
  gaugeDot.style.transition = 'cx 0.8s ease, cy 0.8s ease, fill 0.4s';
  gaugeDot.setAttribute('cx', point.x);
  gaugeDot.setAttribute('cy', point.y);
  gaugeDot.style.fill = color;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const h = parseFloat(heightInput.value);
  const w = parseFloat(weightInput.value);

  if (isNaN(h) || h <= 0 || isNaN(w) || w <= 0) {
    result.hidden = false;
    bmiValue.textContent = '—';
    bmiCat.textContent = 'Enter valid height and weight';
    bmiCat.className = 'bmi-cat';
    gaugeFill.style.strokeDashoffset = ARC_LENGTH;
    return;
  }

  let bmi;
  if (unit === 'metric') {
    const m = h / 100;
    bmi = w / (m * m);
  } else {
    bmi = (703 * w) / (h * h);
  }
  bmi = Math.round(bmi * 10) / 10;

  const cat = categoryFor(bmi);
  result.hidden = false;
  animateValue(bmiValue, bmi);
  bmiCat.textContent = cat.label;
  bmiCat.className = `bmi-cat ${cat.tone}`;
  setGauge(bmi, cat.color);
});
