const API = 'https://api.thecatapi.com/v1/images/search?limit=6';
const grid = document.getElementById('grid');
const moreBtn = document.getElementById('more');
const favToggle = document.getElementById('fav-toggle');
const favCount = document.getElementById('fav-count');

const STORAGE_KEY = 'cat-favorites';
let favorites = load();
let showingFavs = false;

function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); favCount.textContent = favorites.length; }

function skeletons(n) {
  for (let i = 0; i < n; i++) {
    const sk = document.createElement('div');
    sk.className = 'tile skeleton';
    grid.appendChild(sk);
  }
}

function makeTile(url) {
  const tile = document.createElement('div');
  tile.className = 'tile';

  const img = document.createElement('img');
  img.loading = 'lazy';
  img.alt = 'A random cat';
  img.addEventListener('load', () => tile.classList.add('loaded'));
  img.addEventListener('error', () => tile.remove());
  img.src = url;

  const fav = document.createElement('button');
  fav.className = 'fav' + (favorites.includes(url) ? ' active' : '');
  fav.innerHTML = '★';
  fav.setAttribute('aria-label', 'Favorite');
  fav.addEventListener('click', () => {
    if (favorites.includes(url)) favorites = favorites.filter((u) => u !== url);
    else favorites.push(url);
    save();
    fav.classList.toggle('active');
    if (showingFavs) renderFavorites();
  });

  tile.append(img, fav);
  return tile;
}

async function fetchCats() {
  if (showingFavs) return;
  moreBtn.disabled = true;
  moreBtn.textContent = 'Fetching…';
  skeletons(6);

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error();
    const data = await res.json();
    grid.querySelectorAll('.skeleton').forEach((s) => s.remove());
    data.forEach((c) => grid.appendChild(makeTile(c.url)));
  } catch {
    grid.querySelectorAll('.skeleton').forEach((s) => s.remove());
    const err = document.createElement('p');
    err.className = 'msg';
    err.textContent = 'Could not fetch cats — try again!';
    grid.appendChild(err);
  } finally {
    moreBtn.disabled = false;
    moreBtn.textContent = 'Fetch more';
  }
}

function renderFavorites() {
  grid.innerHTML = '';
  if (favorites.length === 0) {
    grid.innerHTML = '<p class="msg">No favorites yet. Tap ★ on a cat you like!</p>';
    return;
  }
  favorites.forEach((url) => grid.appendChild(makeTile(url)));
}

moreBtn.addEventListener('click', fetchCats);

favToggle.addEventListener('click', () => {
  showingFavs = !showingFavs;
  favToggle.classList.toggle('on', showingFavs);
  moreBtn.style.display = showingFavs ? 'none' : '';
  if (showingFavs) renderFavorites();
  else { grid.innerHTML = ''; fetchCats(); }
});

save();
fetchCats();
