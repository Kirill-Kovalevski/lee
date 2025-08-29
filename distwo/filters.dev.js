"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // ----- DOM hooks -----
  var barWrap = document.querySelector('.filter-bar-wrap'); // the outer wrap (drawer on desktop)

  var bar = document.getElementById('filterBar'); // the inner panel (collapsible on phone)

  var close = document.getElementById('closeBar'); // close button inside the header

  var filters = document.getElementById('filters'); // boxes container

  var tagsEl = document.querySelector('.appearing-tags'); // tags row next to .mid-title
  // If any of these are missing, we stop (no errors).

  if (!barWrap || !bar || !filters || !tagsEl) return; // Both openers (phone + desktop)

  var openers = Array.from(document.querySelectorAll('#filter-btn, #filter-btn-desktop')); // ----- State of selected filters -----

  var selected = {}; // e.g., { "filter1": true }
  // ----- Helpers -----
  // Fallback for Element.closest (older browsers)

  function closest(node, selector) {
    if (!node) return null;
    if (node.closest) return node.closest(selector);

    while (node && node.nodeType === 1) {
      if (node.matches && node.matches(selector)) return node;
      node = node.parentNode;
    }

    return null;
  } // Get the display label for a filter (prefer the .label text if present)


  function getDisplayLabel(name) {
    var box = filters.querySelector(".filter-box-tag[data-name=\"".concat(CSS.escape(name), "\"]"));

    if (box) {
      var lbl = box.querySelector('.label');
      if (lbl) return (lbl.textContent || '').trim();
    }

    return name;
  } // Render tags horizontally in .appearing-tags


  function renderTags() {
    tagsEl.innerHTML = '';

    for (var name in selected) {
      if (!selected[name]) continue;
      var label = getDisplayLabel(name);
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.dataset.name = name;
      tag.innerHTML = "<p>".concat(label, "</p><button type=\"button\" aria-label=\"\u05D4\u05E1\u05E8 ").concat(label, "\">\xD7</button>");
      tagsEl.appendChild(tag);
    }
  } // Open/Close logic for phone vs. desktop


  function togglePanel() {
    // Always toggle the phone collapse class
    bar.classList.toggle('open'); // On desktop, also slide the drawer container

    if (window.matchMedia('(min-width: 431px)').matches) {
      barWrap.classList.toggle('open');
    }
  }

  function closePanel() {
    bar.classList.remove('open');
    barWrap.classList.remove('open');
  } // ----- Events -----
  // Openers (phone + desktop)


  openers.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener('click', togglePanel);
  }); // Close button inside the panel

  if (close) close.addEventListener('click', closePanel); // ESC closes the panel (nice on desktop)

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  }); // Click on a filter box: toggle ✓ and tag

  filters.addEventListener('click', function (e) {
    var box = closest(e.target, '.filter-box-tag');
    if (!box) return;
    var name = box.getAttribute('data-name');
    if (!name) return; // Flip selected state

    selected[name] = !selected[name]; // Toggle the tick class on the square

    var sq = box.querySelector('.box-square');
    if (sq) sq.classList.toggle('on', !!selected[name]); // Re-render tags

    renderTags();
  }); // Click on a tag's X: remove tag and untick the box

  tagsEl.addEventListener('click', function (e) {
    var x = closest(e.target, 'button');
    if (!x) return;
    var tag = closest(x, '.tag');
    if (!tag) return;
    var name = tag.dataset.name;
    if (!name) return; // Update state

    delete selected[name]; // Untick the corresponding box

    var box = filters.querySelector(".filter-box-tag[data-name=\"".concat(CSS.escape(name), "\"]"));

    if (box) {
      var sq = box.querySelector('.box-square');
      if (sq) sq.classList.remove('on');
    }

    renderTags();
  }); // Initial paint

  renderTags();
});