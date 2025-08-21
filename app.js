// ===============================
// Live search for flex cards + mock results (6 slots)
// Requirements in HTML:
// - <form id="search-form"> ... <input id="user-search" ...>
// - Your existing cards have class "full-user-report-box"
// - (Optional) a wrapper to append into: <div id="results-area">...</div>
// ===============================

// ---- Elements
const form        = document.getElementById('search-form');
const searchInput = document.getElementById('user-search');
const grid        = document.getElementById('results-area'); // may be null

// Prevent navigation on Enter
form?.addEventListener('submit', e => e.preventDefault());

// Your existing (static) cards in the DOM
const staticCards = Array.from(document.querySelectorAll('.full-user-report-box'));

// Where to append mock cards: prefer #results-area; else parent of first static card
const cardsParent = grid || staticCards[0]?.parentElement || null;

// ---- Helpers
function normalize(str) {
  return String(str).toLowerCase().trim();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[s]));
}

function highlightName(name, term) {
  const nName = normalize(name), nTerm = normalize(term || '');
  if (!nTerm) return escapeHtml(name);
  const i = nName.indexOf(nTerm);
  if (i === -1) return escapeHtml(name);
  return `${escapeHtml(name.slice(0,i))}<mark>${escapeHtml(name.slice(i,i+term.length))}</mark>${escapeHtml(name.slice(i+term.length))}`;
}

// ===============================
// Mock data (customize freely)
// Each item MUST have a "name" and can have slot1 … slot6
// ===============================
const mockData = [
  {
    name: 'דנה כהן',
    slot1: 'שם השיעור האחרון',
    slot2: '23/06',
    slot3: '12:30',
    slot4: '23/10',
    slot5: 'ללא',
    slot6: 'ללא מנוי'
  },
  {
    name: 'Delta Partners',
    slot1: 'Value A',
    slot2: 'Value B',
    slot3: 'Value C',
    slot4: 'Value D',
    slot5: 'Value E',
    slot6: 'Value F'
  },
  // add more…
];

// Build a normalized “haystack” of searchable text for a mock item
function haystackForMock(item) {
  const slots = [item.slot1, item.slot2, item.slot3, item.slot4, item.slot5, item.slot6]
    .filter(Boolean)
    .join(' ');
  return normalize(`${item.name} ${slots}`);
}


function haystackForStaticCard(card) {
  const title = card.querySelector('.search-block-one')?.textContent || '';
  const dataName = card.dataset.name || '';
  const fallback = card.textContent || '';
  // Use title if present, else data-name, else the whole card text
  const haystack = title || dataName || fallback;
  return normalize(haystack);
}
// Debug: print what each fixed card is matched on
console.log('Fixed card haystacks:');
staticCards.forEach((c, i) => console.log(i, haystackForStaticCard(c)));


// Capture the <p> classes from your first static card so mock cards match styling
function getSamplePClasses() {
  const sample = staticCards[0];
  if (!sample) return [];
  const pList = Array.from(sample.querySelectorAll('p'));
  // up to 6 p tags (or fewer if your static card has fewer)
  return pList.slice(0, 6).map(p => p.getAttribute('class') || '');
}
const SAMPLE_P_CLASSES = getSamplePClasses();

// Create a mock card DOM node that matches your fixed cards:
// - same outer class "full-user-report-box"
// - extra class "from-mock" so we can remove between searches
// - <h3 class="card-name"> + 6 <p> lines (copy classes from SAMPLE_P_CLASSES)
function createCardFromData(item, term = '') {
  const el = document.createElement('div');
  el.className = 'full-user-report-box from-mock';
  el.dataset.name = item.name; // helpful if you later add more filters

  const titleHtml = `<h3 class="card-name">${highlightName(item.name, term)}</h3>`;

  const slots = [
    item.slot1 || '', item.slot2 || '', item.slot3 || '',
    item.slot4 || '', item.slot5 || '', item.slot6 || ''
  ];

  const pLines = slots.map((val, idx) => {
    const cls = SAMPLE_P_CLASSES[idx] || '';
    return `<p class="${cls}">${escapeHtml(val)}</p>`;
  }).join('\n');

  el.innerHTML = `${titleHtml}\n${pLines}`;
  return el;
}

// Remove previously added mock cards
function clearMockCards() {
  if (!cardsParent) return;
  cardsParent.querySelectorAll('.from-mock').forEach(el => el.remove());
}

// ---- Core filter + render
function filterAndRender(term) {
  const t = normalize(term.trim());

  if (!t) {
    // Empty input → show all static; remove mock
    staticCards.forEach(c => c.classList.remove('is-hidden'));
    clearMockCards();
    return;
  }

  // Filter static cards
  let staticMatches = 0;
  staticCards.forEach(card => {
    const hit = haystackForStaticCard(card).includes(t);
    card.classList.toggle('is-hidden', !hit);
    if (hit) staticMatches++;
  });

  // Filter mock items and append as lookalike cards
  const mockMatches = mockData.filter(item => haystackForMock(item).includes(t));

  clearMockCards();
  if (cardsParent && mockMatches.length) {
    const frag = document.createDocumentFragment();
    mockMatches.forEach(item => frag.appendChild(createCardFromData(item, term)));
    cardsParent.appendChild(frag);
  }

  // Optional: if you want to hide the whole container when NOTHING matches:
  // const total = staticMatches + mockMatches.length;
  // (grid || cardsParent)?.classList.toggle('is-hidden', total === 0);
}

// ---- Wire up live search
searchInput?.addEventListener('input', () => filterAndRender(searchInput.value));

// ---- Initial: show all static; no mock yet
filterAndRender('');
