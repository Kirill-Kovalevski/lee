document.addEventListener('DOMContentLoaded', () => {
  // ----- DOM hooks -----
  const barWrap = document.querySelector('.filter-bar-wrap');  // the outer wrap (drawer on desktop)
  const bar     = document.getElementById('filterBar');        // the inner panel (collapsible on phone)
  const close   = document.getElementById('closeBar');         // close button inside the header
  const filters = document.getElementById('filters');          // boxes container
  const tagsEl  = document.querySelector('.appearing-tags');   // tags row next to .mid-title

  // If any of these are missing, we stop (no errors).
  if (!barWrap || !bar || !filters || !tagsEl) return;

  // Both openers (phone + desktop)
  const openers = Array.from(document.querySelectorAll('#filter-btn, #filter-btn-desktop'));

  // ----- State of selected filters -----
  const selected = {}; // e.g., { "filter1": true }

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
  }

  // Get the display label for a filter (prefer the .label text if present)
  function getDisplayLabel(name) {
    const box = filters.querySelector(`.filter-box-tag[data-name="${CSS.escape(name)}"]`);
    if (box) {
      const lbl = box.querySelector('.label');
      if (lbl) return (lbl.textContent || '').trim();
    }
    return name;
  }

  // Render tags horizontally in .appearing-tags
  function renderTags() {
    tagsEl.innerHTML = '';
    for (const name in selected) {
      if (!selected[name]) continue;

      const label = getDisplayLabel(name);

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.dataset.name = name;
      tag.innerHTML = `<p>${label}</p><button type="button" aria-label="הסר ${label}">×</button>`;
      tagsEl.appendChild(tag);
    }
  }

  // Open/Close logic for phone vs. desktop
  function togglePanel() {
    // Always toggle the phone collapse class
    bar.classList.toggle('open');

    // On desktop, also slide the drawer container
    if (window.matchMedia('(min-width: 431px)').matches) {
      barWrap.classList.toggle('open');
    }
  }
  function closePanel() {
    bar.classList.remove('open');
    barWrap.classList.remove('open');
  }

  // ----- Events -----
  // Openers (phone + desktop)
  openers.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', togglePanel);
  });

  // Close button inside the panel
  if (close) close.addEventListener('click', closePanel);

  // ESC closes the panel (nice on desktop)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  // Click on a filter box: toggle ✓ and tag
  filters.addEventListener('click', (e) => {
    const box = closest(e.target, '.filter-box-tag');
    if (!box) return;

    const name = box.getAttribute('data-name');
    if (!name) return;

    // Flip selected state
    selected[name] = !selected[name];

    // Toggle the tick class on the square
    const sq = box.querySelector('.box-square');
    if (sq) sq.classList.toggle('on', !!selected[name]);

    // Re-render tags
    renderTags();
  });

  // Click on a tag's X: remove tag and untick the box
  tagsEl.addEventListener('click', (e) => {
    const x = closest(e.target, 'button');
    if (!x) return;

    const tag = closest(x, '.tag');
    if (!tag) return;

    const name = tag.dataset.name;
    if (!name) return;

    // Update state
    delete selected[name];

    // Untick the corresponding box
    const box = filters.querySelector(`.filter-box-tag[data-name="${CSS.escape(name)}"]`);
    if (box) {
      const sq = box.querySelector('.box-square');
      if (sq) sq.classList.remove('on');
    }

    renderTags();
  });

  // Initial paint
  renderTags();
});
