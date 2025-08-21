// Elements
const form        = document.getElementById('search-form');
const searchInput = document.getElementById('user-search');
const cards       = Array.from(document.querySelectorAll('.full-user-report-box'));

// Prevent the form from navigating on Enter
form.addEventListener('submit', e => e.preventDefault());

// Normalize helper: lowercase + remove accents for fair matching
function normalize(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// If you want to match multiple parameters (name, city, id),
// combine any data-* attributes you care about into one search string.
function getSearchHaystack(card) {
  // Prefer data attributes (robust and fast)
  const name = card.dataset.name || '';
  const city = card.dataset.city || '';
  const id   = card.dataset.id   || '';
  // Add/remove fields as needed:
  const combined = `${name} ${city} ${id}`;
  return combined.trim() || card.textContent.trim(); // fallback to full text if no data-*
}

// Core filter: show all when empty; otherwise hide non-matches
function filterCards(term) {
  const t = normalize(term.trim());

  // If input is empty → show everything
  if (!t) {
    cards.forEach(c => c.classList.remove('is-hidden'));
    return;
  }

  // Input has text → show only matching cards
  cards.forEach(card => {
    const haystack = normalize(getSearchHaystack(card));
    const hit = haystack.includes(t);
    card.classList.toggle('is-hidden', !hit);
  });
}

// Live filter on every keystroke
searchInput.addEventListener('input', () => {
  filterCards(searchInput.value);
});

// Initial state: show all cards
filterCards('');
