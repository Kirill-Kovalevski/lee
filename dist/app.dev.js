"use strict";

// 1) Grab elements we’ll use
var searchInput = document.getElementById('search');
var rowsTbody = document.getElementById('rows');
var summary = document.getElementById('result-summary');
var emptyMsg = document.getElementById('empty');
var form = document.getElementById('search-form');
var flexRows = Array.from(document.querySelectorAll('.flex-row'));
var allClients = []; // will hold the JSON data
// Prevent form submit from refreshing page

form.addEventListener('submit', function (e) {
  return e.preventDefault();
}); // 2) Helper: normalize strings for case-insensitive search (and ignore accents)

function normalize(str) {
  return str.toLowerCase().normalize('NFD') // split accented chars
  .replace(/[\u0300-\u036f]/g, ''); // remove diacritics
} // 3) Render table rows from an array of client objects


function renderRows(clients) {
  var term = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  // Clear old rows
  rowsTbody.innerHTML = ''; // If nothing to show

  if (!clients.length) {
    emptyMsg.hidden = false;
    summary.textContent = '0 results';
    return;
  }

  emptyMsg.hidden = true;
  summary.textContent = "".concat(clients.length, " result").concat(clients.length === 1 ? '' : 's');
  var frag = document.createDocumentFragment();
  clients.forEach(function (client) {
    var tr = document.createElement('tr'); // Optional: highlight matches inside the name

    var nameHtml = highlight(client.name, term);
    tr.innerHTML = "\n      <td>".concat(client.id, "</td>\n      <td>").concat(nameHtml, "</td>\n      <td>").concat(client.email, "</td>\n      <td>").concat(client.city, "</td>\n    ");
    frag.appendChild(tr);
  });
  rowsTbody.appendChild(frag);
} // 4) Highlight helper (wrap matching part in <mark>)


function highlight(name, term) {
  if (!term) return escapeHtml(name);
  var nName = normalize(name);
  var nTerm = normalize(term);
  var idx = nName.indexOf(nTerm);
  if (idx === -1) return escapeHtml(name); // Split the original (to preserve case/accents) around the match

  var start = name.slice(0, idx);
  var mid = name.slice(idx, idx + term.length);
  var end = name.slice(idx + term.length);
  return "".concat(escapeHtml(start), "<mark>").concat(escapeHtml(mid), "</mark>").concat(escapeHtml(end));
} // Simple HTML escape to avoid injecting markup if data is untrusted


function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[s];
  });
} // 5) Filter function: keeps only rows whose **Client Name** contains the term


function filterByName(term) {
  var t = normalize(term.trim());
  if (!t) return allClients; // empty search shows all

  return allClients.filter(function (c) {
    return normalize(c.name).includes(t);
  });
} // 6) Wire up live search (input event fires on every keystroke)


searchInput.addEventListener('input', function () {
  var term = searchInput.value;
  var filtered = filterByName(term);
  renderRows(filtered, term);
}); // 7) Load mock JSON, then render all rows initially

init();

function init() {
  var res;
  return regeneratorRuntime.async(function init$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch('./data/clients.json'));

        case 3:
          res = _context.sent;

          if (res.ok) {
            _context.next = 6;
            break;
          }

          throw new Error("HTTP ".concat(res.status));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(res.json());

        case 8:
          allClients = _context.sent;
          renderRows(allClients, '');
          _context.next = 18;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Failed to load clients.json:', _context.t0);
          summary.textContent = 'Error loading data.';
          emptyMsg.hidden = false;
          emptyMsg.textContent = 'Could not load client data.';

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}

searchInput.addEventListener('input', function () {
  var term = searchInput.value.trim(); // If nothing typed yet → hide results and stop

  if (!term) {
    document.getElementById('results').hidden = true;
    return;
  } // Otherwise → show results and filter


  document.getElementById('results').hidden = false;
  var filtered = filterByName(term);
  renderRows(filtered, term);
});