// ===============================
// Live search for flex cards + mock results (6 slots)
// ===============================

// ---- Elements
const form         = document.getElementById('search-form');
const searchInput  = document.getElementById('user-search');
const grid         = document.getElementById('results-area'); // may be null
const summary      = document.getElementById('result-summary'); // <-- add in HTML
const emptyMsg     = document.getElementById('empty');          // <-- add in HTML

form?.addEventListener('submit', e => e.preventDefault());

// Your existing (static) cards in the DOM
const staticCards  = Array.from(document.querySelectorAll('.full-user-report-box'));
const cardsParent  = grid || staticCards[0]?.parentElement || null;

// ---- Helpers
function normalize(str) { return String(str).toLowerCase().trim(); }
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

// ---- Mock data (customize)
const mockData = [
  { name: 'דנה כהן',       slot1: 'שם השיעור האחרון', slot2: '23/06', slot3: '12:30', slot4: '23/10', slot5: 'ללא', slot6: 'ללא מנוי' },
  { name: 'Delta Partners', slot1: 'Value A',           slot2: 'Value B', slot3: 'Value C', slot4: 'Value D', slot5: 'Value E', slot6: 'Value F' },
];

// Build normalized haystacks
function haystackForMock(item) {
  const slots = [item.slot1,item.slot2,item.slot3,item.slot4,item.slot5,item.slot6]
    .filter(Boolean).join(' ');
  return normalize(`${item.name} ${slots}`);
}

// IMPORTANT: try .card-name first; else data-name; else full text
function haystackForStaticCard(card) {
  const title    = card.querySelector('.card-name')?.textContent || '';
  const dataName = card.dataset.name || '';
  const fallback = card.textContent || '';
  return normalize(title || dataName || fallback);
}

// sample classes from first static card's <p> tags (to mirror styling)
function getSamplePClasses() {
  const sample = staticCards[0];
  if (!sample) return [];
  const pList = Array.from(sample.querySelectorAll('p'));
  return pList.slice(0, 6).map(p => p.getAttribute('class') || '');
}
const SAMPLE_P_CLASSES = getSamplePClasses();

function createCardFromData(item, term='') {
  const el = document.createElement('div');
  el.className = 'full-user-report-box from-mock';
  el.dataset.name = item.name;

  const titleHtml = `<h3 class="card-name">${highlightName(item.name, term)}</h3>`;
  const slots = [item.slot1||'', item.slot2||'', item.slot3||'', item.slot4||'', item.slot5||'', item.slot6||''];
  const pLines = slots.map((val, idx) => {
    const cls = SAMPLE_P_CLASSES[idx] || ''; // mirrors your first card’s <p> classes
    return `<p class="${cls}">${escapeHtml(val)}</p>`;
  }).join('\n');

  el.innerHTML = `${titleHtml}\n${pLines}`;
  return el;
}

function clearMockCards() {
  if (!cardsParent) return;
  cardsParent.querySelectorAll('.from-mock').forEach(el => el.remove());
}

// ---- Core filter + render
function filterAndRender(term) {
  const t = normalize(term.trim());

  if (!t) {
    // show everything; remove mock; clear messages
    staticCards.forEach(c => c.classList.remove('is-hidden'));
    clearMockCards();
    if (emptyMsg) emptyMsg.hidden = true;
    if (summary)  summary.textContent = '';
    return;
  }

  // Filter static and count
  let staticMatchCount = 0;
  staticCards.forEach(card => {
    const hit = haystackForStaticCard(card).includes(t);
    card.classList.toggle('is-hidden', !hit);
    if (hit) staticMatchCount++;
  });

  // Update summary/empty safely
  if (emptyMsg && summary) {
    if (staticMatchCount === 0) {
      emptyMsg.hidden = false;
      summary.textContent = 'No results found.';
    } else {
      emptyMsg.hidden = true;
      summary.textContent = `${staticMatchCount} result${staticMatchCount === 1 ? '' : 's'}`;
    }
  }

  // Filter mock and append
  const mockMatches = mockData.filter(item => haystackForMock(item).includes(t));
  clearMockCards();
  if (cardsParent && mockMatches.length) {
    const frag = document.createDocumentFragment();
    mockMatches.forEach(item => frag.appendChild(createCardFromData(item, term)));
    cardsParent.appendChild(frag);
  }
}

// Live search
searchInput?.addEventListener('input', () => filterAndRender(searchInput.value));
// Initial
filterAndRender('');
