// NOTE: free OpenWeatherMap demo key. Client-side apps always expose their key;
// a production app would proxy this through a backend.
const API_KEY = 'c0ec28dfcd7676ef723f882bb0df8f82';

const form = document.getElementById('search');
const input = document.getElementById('input');
const card = document.getElementById('card');
const placeholder = document.getElementById('placeholder');
const weather = document.getElementById('weather');

const iconEl = document.getElementById('icon');
const tempEl = document.getElementById('temp');
const placeEl = document.getElementById('place');
const descEl = document.getElementById('desc');
const feelsEl = document.getElementById('feels');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const loEl = document.getElementById('lo');
const hiEl = document.getElementById('hi');

const EMOJI = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Smoke: '🌫️',
  Haze: '🌫️', Fog: '🌫️', Tornado: '🌪️',
};
const THEME = {
  Clear: 'linear-gradient(160deg,#2980b9,#6dd5fa)',
  Clouds: 'linear-gradient(160deg,#5c6b7a,#bdc3c7)',
  Rain: 'linear-gradient(160deg,#3a4a5a,#5b7a8c)',
  Drizzle: 'linear-gradient(160deg,#4a6070,#7f9aa8)',
  Thunderstorm: 'linear-gradient(160deg,#232526,#414345)',
  Snow: 'linear-gradient(160deg,#83a4d4,#e6eef7)',
  Mist: 'linear-gradient(160deg,#606c88,#8a94ad)',
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  getWeather();
});

async function getWeather() {
  const city = input.value.trim();
  if (!city) return;

  placeholder.textContent = 'Loading…';
  placeholder.hidden = false;
  weather.hidden = true;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (String(data.cod) !== '200' || !data.main) {
      placeholder.textContent = data.message ? cap(data.message) : 'City not found';
      return;
    }

    const cond = data.weather[0].main;
    iconEl.textContent = EMOJI[cond] || '🌡️';
    tempEl.textContent = `${Math.round(data.main.temp)}°`;
    placeEl.textContent = `${data.name}, ${data.sys.country}`;
    descEl.textContent = cap(data.weather[0].description);
    feelsEl.textContent = `${Math.round(data.main.feels_like)}°`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${(data.wind.speed * 3.6).toFixed(0)} km/h`;
    loEl.textContent = `L: ${Math.round(data.main.temp_min)}°`;
    hiEl.textContent = `H: ${Math.round(data.main.temp_max)}°`;

    card.style.background = THEME[cond] || 'linear-gradient(160deg,#2980b9,#6dd5fa)';

    placeholder.hidden = true;
    weather.hidden = false;
    weather.classList.remove('in');
    void weather.offsetWidth;
    weather.classList.add('in');
  } catch {
    placeholder.textContent = 'Network error — try again';
  }
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
