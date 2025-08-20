
// 1) Grab elements we’ll use
const searchInput = document.getElementById('search');
const rowsTbody   = document.getElementById('rows');
const summary     = document.getElementById('result-summary');
const emptyMsg    = document.getElementById('empty');
const form = document.getElementById('search-form');
const flexRows = Array.from(document.querySelectorAll('.flex-row'));

let allClients = []; // will hold the JSON data


// Prevent form submit from refreshing page
form.addEventListener('submit', e => e.preventDefault());


// 2) Helper: normalize strings for case-insensitive search (and ignore accents)
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')              // split accented chars
    .replace(/[\u0300-\u036f]/g, ''); // remove diacritics
}

// 3) Render table rows from an array of client objects
function renderRows(clients, term = '') {
  // Clear old rows
  rowsTbody.innerHTML = '';

  // If nothing to show
  if (!clients.length) {
    emptyMsg.hidden = false;
    summary.textContent = '0 results';
    return;
  }

  emptyMsg.hidden = true;
  summary.textContent = `${clients.length} result${clients.length === 1 ? '' : 's'}`;

  const frag = document.createDocumentFragment();

  clients.forEach(client => {
    const tr = document.createElement('tr');

    // Optional: highlight matches inside the name
    const nameHtml = highlight(client.name, term);

    tr.innerHTML = `
      <td>${client.id}</td>
      <td>${nameHtml}</td>
      <td>${client.email}</td>
      <td>${client.city}</td>
    `;

    frag.appendChild(tr);
  });

  rowsTbody.appendChild(frag);
}

// 4) Highlight helper (wrap matching part in <mark>)
function highlight(name, term) {
  if (!term) return escapeHtml(name);

  const nName = normalize(name);
  const nTerm = normalize(term);

  const idx = nName.indexOf(nTerm);
  if (idx === -1) return escapeHtml(name);

  // Split the original (to preserve case/accents) around the match
  const start = name.slice(0, idx);
  const mid   = name.slice(idx, idx + term.length);
  const end   = name.slice(idx + term.length);

  return `${escapeHtml(start)}<mark>${escapeHtml(mid)}</mark>${escapeHtml(end)}`;
}

// Simple HTML escape to avoid injecting markup if data is untrusted
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[s]));
}

// 5) Filter function: keeps only rows whose **Client Name** contains the term
function filterByName(term) {
  const t = normalize(term.trim());
  if (!t) return allClients; // empty search shows all

  return allClients.filter(c => normalize(c.name).includes(t));
}

// 6) Wire up live search (input event fires on every keystroke)
searchInput.addEventListener('input', () => {
  const term = searchInput.value;
  const filtered = filterByName(term);
  renderRows(filtered, term);
});

// 7) Load mock JSON, then render all rows initially
init();

async function init() {
  try {
    // IMPORTANT: run a local server (e.g., VS Code "Live Server") to allow fetch.
    const res = await fetch('./data/clients.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allClients = await res.json();
    renderRows(allClients, '');
  } catch (err) {
    console.error('Failed to load clients.json:', err);
    summary.textContent = 'Error loading data.';
    emptyMsg.hidden = false;
    emptyMsg.textContent = 'Could not load client data.';
  }
}
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim();

  // If nothing typed yet → hide results and stop
  if (!term) {
    document.getElementById('results').hidden = true;
    return;
  }

  // Otherwise → show results and filter
  document.getElementById('results').hidden = false;
  const filtered = filterByName(term);
  renderRows(filtered, term);
});
