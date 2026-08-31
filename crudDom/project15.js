const form = document.getElementById('book-form');
const titleIn = document.getElementById('title');
const authorIn = document.getElementById('author');
const yearIn = document.getElementById('year');
const bookList = document.getElementById('book-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchIn = document.getElementById('search');
const countEl = document.getElementById('count');

const STORAGE = 'crud-books-v2';
let books = load();
let editingId = null;
let sortKey = null;
let sortDir = 1;
let query = '';

function load() { try { return JSON.parse(localStorage.getItem(STORAGE)) || []; } catch { return []; } }
function save() { localStorage.setItem(STORAGE, JSON.stringify(books)); }
function esc(s) { return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function filtered() {
  let list = [...books];
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || String(b.year).includes(q));
  }
  if (sortKey) list.sort((a, b) => {
    const va = sortKey === 'year' ? Number(a[sortKey]) : a[sortKey].toLowerCase();
    const vb = sortKey === 'year' ? Number(b[sortKey]) : b[sortKey].toLowerCase();
    return (va < vb ? -1 : va > vb ? 1 : 0) * sortDir;
  });
  return list;
}

function render() {
  const list = filtered();
  bookList.innerHTML = '';
  countEl.textContent = `${books.length} book${books.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    bookList.innerHTML = `<p class="empty">${books.length ? 'No matches.' : 'No books yet — add one above.'}</p>`;
    return;
  }

  list.forEach((b) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.animationDelay = '0ms';
    row.innerHTML = `
      <div class="cell">${esc(b.title)}</div>
      <div class="cell">${esc(b.author)}</div>
      <div class="cell">${b.year}</div>
      <div class="cell actions">
        <button class="act edit" data-id="${b.id}" aria-label="Edit">✏️</button>
        <button class="act del" data-id="${b.id}" aria-label="Delete">🗑️</button>
      </div>`;
    bookList.appendChild(row);
  });
}

bookList.addEventListener('click', (e) => {
  const btn = e.target.closest('.act');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.classList.contains('del')) {
    books = books.filter((b) => b.id !== id);
    save(); render();
  }
  if (btn.classList.contains('edit')) {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    editingId = id;
    titleIn.value = book.title;
    authorIn.value = book.author;
    yearIn.value = book.year;
    submitBtn.textContent = 'Save';
    cancelBtn.hidden = false;
    titleIn.focus();
  }
});

cancelBtn.addEventListener('click', () => {
  editingId = null;
  form.reset();
  submitBtn.textContent = 'Add Book';
  cancelBtn.hidden = true;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleIn.value.trim();
  const author = authorIn.value.trim();
  const year = yearIn.value.trim();
  if (!title || !author || !year) { titleIn.focus(); return; }

  if (editingId !== null) {
    const book = books.find((b) => b.id === editingId);
    if (book) { book.title = title; book.author = author; book.year = year; }
    editingId = null;
    submitBtn.textContent = 'Add Book';
    cancelBtn.hidden = true;
  } else {
    books.push({ id: Date.now(), title, author, year });
  }
  save(); render();
  form.reset();
  titleIn.focus();
});

searchIn.addEventListener('input', (e) => { query = e.target.value; render(); });

document.querySelectorAll('[data-sort]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sort;
    if (sortKey === key) sortDir *= -1;
    else { sortKey = key; sortDir = 1; }
    document.querySelectorAll('[data-sort]').forEach((b) => b.classList.remove('asc', 'desc'));
    btn.classList.add(sortDir === 1 ? 'asc' : 'desc');
    render();
  });
});

render();
