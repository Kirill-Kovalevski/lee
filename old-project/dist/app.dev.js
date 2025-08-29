"use strict";

// Elements
var form = document.getElementById('search-form');
var searchInput = document.getElementById('user-search');
var cards = Array.from(document.querySelectorAll('.full-user-report-box')); // Prevent the form from navigating on Enter

form.addEventListener('submit', function (e) {
  return e.preventDefault();
}); // Normalize helper: lowercase + remove accents for fair matching

function normalize(str) {
  return String(str).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
} // If you want to match multiple parameters (name, city, id),
// combine any data-* attributes you care about into one search string.


function getSearchHaystack(card) {
  // Prefer data attributes (robust and fast)
  var name = card.dataset.name || '';
  var city = card.dataset.city || '';
  var id = card.dataset.id || ''; // Add/remove fields as needed:

  var combined = "".concat(name, " ").concat(city, " ").concat(id);
  return combined.trim() || card.textContent.trim(); // fallback to full text if no data-*
} // Core filter: show all when empty; otherwise hide non-matches


function filterCards(term) {
  var t = normalize(term.trim()); // If input is empty → show everything

  if (!t) {
    cards.forEach(function (c) {
      return c.classList.remove('is-hidden');
    });
    return;
  } // Input has text → show only matching cards


  cards.forEach(function (card) {
    var haystack = normalize(getSearchHaystack(card));
    var hit = haystack.includes(t);
    card.classList.toggle('is-hidden', !hit);
  });
} // Live filter on every keystroke


searchInput.addEventListener('input', function () {
  filterCards(searchInput.value);
}); // Initial state: show all cards

filterCards(''); // const div = document.createElement('div');
// div.className = 'full-user-report-box from-mock';
// div.dataset.name = client.name;
// div.innerHTML = `
//   <h3>${client.name}</h3>
//   <p>Email: ${client.email}</p>
//   <p>City: ${client.city}</p>
// `;