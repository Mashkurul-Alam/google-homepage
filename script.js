const input = document.getElementById('q');
const bar = document.getElementById('bar');
const list = document.getElementById('list');
const clearBtn = document.getElementById('clear');
let items = [], active = -1;

function search(text) {
  const term = (text ?? input.value).trim();
  if (term) window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(term);
}

// Fake suggestions so the dropdown works offline (replace with a real API later)
const pool = ['javascript tutorial', 'java vs python', 'weather today', 'what is html',
  'css flexbox guide', 'computer science roadmap', 'react vs vue', 'git commands cheat sheet'];

function render() {
  const v = input.value.trim().toLowerCase();
  bar.classList.toggle('has-text', v.length > 0);
  items = v ? pool.filter(p => p.includes(v)).slice(0, 6) : [];
  if (v && !items.includes(v)) items.unshift(input.value.trim());
  active = -1;
  list.innerHTML = '';
  items.forEach((text, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
    const span = document.createElement('span');
    span.textContent = text;           // textContent avoids injecting HTML
    li.appendChild(span);
    li.addEventListener('mousedown', e => { e.preventDefault(); search(text); });
    list.appendChild(li);
  });
  const open = items.length > 0;
  list.classList.toggle('show', open);
  bar.classList.toggle('open', open);
}

function highlight() {
  [...list.children].forEach((li, i) => li.classList.toggle('active', i === active));
  if (active >= 0) input.value = items[active];
}

input.addEventListener('input', render);
input.addEventListener('blur', () => { list.classList.remove('show'); bar.classList.remove('open'); });
input.addEventListener('focus', render);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
  else if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); active = (active + 1) % items.length; highlight(); }
  else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); active = (active - 1 + items.length) % items.length; highlight(); }
  else if (e.key === 'Escape') { list.classList.remove('show'); bar.classList.remove('open'); }
});
clearBtn.addEventListener('mousedown', e => { e.preventDefault(); input.value = ''; render(); input.focus(); });
document.getElementById('search-btn').addEventListener('click', () => search());
document.getElementById('lucky-btn').addEventListener('click', () => {
  const term = input.value.trim();
  if (term) window.location.href = 'https://www.google.com/search?btnI=1&q=' + encodeURIComponent(term);
});
