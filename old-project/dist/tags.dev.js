"use strict";

// === Grab elements ===
var filterBtn = document.querySelector('.filter-button') || document.getElementById('filter-btn'); // ^ Change the selector above to match your actual filter button (id or class)

var tagbar = document.getElementById('tagbar');
var closeBtn = document.querySelector('.close-btn');
var checkboxes = document.querySelectorAll('.tag-checkbox'); // === Open sidebar when filter button is clicked ===

if (filterBtn) {
  filterBtn.addEventListener('click', function () {
    tagbar.classList.add('show'); // adds the class that slides sidebar into view
  });
} // === Close sidebar when close button is clicked ===


if (closeBtn) {
  closeBtn.addEventListener('click', function () {
    tagbar.classList.remove('show'); // removes class so sidebar slides away
  });
} // === Toggle checkboxes (click → blue with ✓ tick) ===


checkboxes.forEach(function (box) {
  box.addEventListener('click', function () {
    box.classList.toggle('active');
  });
});