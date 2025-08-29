"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var box = document.querySelector(".flex-search-container"); // the container to move

  var slot = document.getElementById("search-slot"); // mobile target slot

  if (!box || !slot) return console.warn("Missing .flex-search-container or #search-slot"); // Remember original position

  var placeholder = document.createComment("flexSearchPH");
  box.parentNode.insertBefore(placeholder, box);

  function move() {
    if (window.innerWidth <= 430) {
      // Move into mobile slot
      if (box.parentNode !== slot) slot.appendChild(box); // Force show (if hidden)

      box.hidden = false;
      box.classList.remove("hidden");
      box.style.removeProperty("display");
      box.style.visibility = "visible";
    } else {
      // Restore to original position
      if (placeholder.parentNode && box.parentNode !== placeholder.parentNode) {
        placeholder.replaceWith(box);
      }
    }
  }

  move(); // run once on page load

  window.addEventListener("resize", move); // run on resize
}); //Text dissapears from filter button

document.addEventListener('DOMContentLoaded', function () {
  // === Customize these two selectors ===
  var FLEX = document.querySelector('.flex-search-container'); // e.g. '.flex-container' or '#row'

  var ITEM = document.querySelector('.filter-text'); // e.g. '.box2' or '#right'

  var BREAKPOINT = 430; // px

  if (!FLEX || !ITEM) return; // nothing to do if selectors aren't found
  // Keep original position so we can restore in the same spot

  var placeholder = document.createComment('removedItemPH');
  ITEM.parentNode.insertBefore(placeholder, ITEM);

  function apply() {
    if (window.innerWidth <= BREAKPOINT) {
      if (FLEX.contains(ITEM)) ITEM.remove(); // remove on small screens
    } else {
      if (!FLEX.contains(ITEM)) placeholder.replaceWith(ITEM); // restore on larger screens
    }
  }

  apply();
  window.addEventListener('resize', apply);
}); //Boxes shift 

document.addEventListener("DOMContentLoaded", function () {
  var box = document.querySelector(".flex-search-container"); // source

  var slot1 = document.getElementById("block-top"); // top target

  var slot2 = document.getElementById("block-bottom"); // bottom target

  if (!box || !slot1 || !slot2) return; // First two children

  var el1 = box.children[0]; // originally first

  var el2 = box.children[1]; // originally second

  if (!el1 || !el2) return; // Placeholders to restore originals

  var ph1 = document.createComment("el1PH");
  var ph2 = document.createComment("el2PH");
  el1.parentNode.insertBefore(ph1, el1);
  el2.parentNode.insertBefore(ph2, el2);

  function move() {
    if (window.innerWidth <= 430) {
      // Swap order
      if (el2.parentNode !== slot1) slot1.appendChild(el2); // second → top

      if (el1.parentNode !== slot2) slot2.appendChild(el1); // first → bottom

      el1.style.width = "100%";
      el2.style.width = "100%";
    } else {
      // Restore
      if (ph1.parentNode && el1.parentNode !== ph1.parentNode) ph1.replaceWith(el1);
      if (ph2.parentNode && el2.parentNode !== ph2.parentNode) ph2.replaceWith(el2);
      el1.style.width = "";
      el2.style.width = "";
    }
  }

  move();
  window.addEventListener("resize", move);
});