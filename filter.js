// /lee/filter.js
document.addEventListener('DOMContentLoaded', () => {
  // Viewport breakpoint to switch behavior
  const mqDesktop = window.matchMedia('(min-width: 431px)');

  // --- DOM refs (shared panel, two different open modes) ---
  const wrap    = document.querySelector('.filter-bar-wrap'); // desktop: overlay drawer (display toggled)
  const panel   = document.getElementById('filterBar');       // phone: collapsible block (max-height)
  const closeEl = document.getElementById('closeBar');        // X button
  const filters = document.getElementById('filters');         // click targets for boxes
  const tagsEl  = document.querySelector('.appearing-tags');  // where chips appear

  // Openers (one shows on phone via CSS, the other on desktop via CSS)
  const phoneBtn   = document.getElementById('filter-btn');
  const desktopBtn = document.getElementById('filter-btn-desktop');

  // Bail if critical nodes are missing
  if (!wrap || !panel || !filters || !tagsEl) {
    console.warn('Missing one of: .filter-bar-wrap, #filterBar, #filters, .appearing-tags');
    return;
  }

  // Make sure all openers are <button type="button">
  [phoneBtn, desktopBtn].forEach(btn => {
    if (btn && !btn.hasAttribute('type')) btn.setAttribute('type', 'button');
  });

  // --- State: selected filter names -> boolean ---
  const selected = Object.create(null);

  // --- Small utils ---
  const closest = (el, sel) => (el?.closest ? el.closest(sel) : null);
  const safeEscape = (str) => (window.CSS && CSS.escape ? CSS.escape(str) : String(str).replace(/"/g, '\\"'));

 function getDisplayLabel(name) {
  // On phone: always show the fixed text
  if (!mqDesktop.matches) return 'תגית פילטר';

  // On desktop: keep showing the filter label (current behavior)
  const box = filters.querySelector(`.filter-box-tag[data-name="${CSS.escape(name)}"]`);
  const lbl = box?.querySelector('.label');
  return (lbl?.textContent || name).trim();
}


  function renderTags() {
    tagsEl.innerHTML = '';
    Object.keys(selected).forEach((name) => {
      if (!selected[name]) return;
      const chip = document.createElement('span');
      chip.className = 'tag';
      chip.dataset.name = name;
      chip.innerHTML = `<p>${getDisplayLabel(name)}</p><button type="button" aria-label="הסר">✕</button>`;
      tagsEl.appendChild(chip);
    });
  }

  // Keep aria-expanded on both buttons in sync
  function setExpandedAttr(open) {
    if (phoneBtn)   phoneBtn.setAttribute('aria-expanded', String(open));
    if (desktopBtn) desktopBtn.setAttribute('aria-expanded', String(open));
  }

  // Open/close logic depends on viewport
  function setOpen(open) {
    if (mqDesktop.matches) {
      wrap.classList.toggle('open', open);  // desktop drawer (display: block/none)
      panel.classList.remove('open');       // ensure phone style is off
    } else {
      panel.classList.toggle('open', open); // phone collapse (max-height)
      wrap.classList.remove('open');        // ensure desktop style is off
    }
    setExpandedAttr(open);
  }

  const isOpen = () => (mqDesktop.matches
    ? wrap.classList.contains('open')
    : panel.classList.contains('open'));

  function togglePanel(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(!isOpen());
  }

  function closePanel(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
  }

  // --- Event wiring ---
  phoneBtn?.addEventListener('click', togglePanel);
  desktopBtn?.addEventListener('click', togglePanel);
  closeEl?.addEventListener('click', closePanel);

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Click outside closes (different hit areas per viewport)
  document.addEventListener('click', (e) => {
    // Ignore clicks on openers
    if (closest(e.target, '#filter-btn, #filter-btn-desktop, .filter-button')) return;

    if (mqDesktop.matches) {
      // Close when clicking outside the entire drawer on desktop
      if (!closest(e.target, '.filter-bar-wrap')) setOpen(false);
    } else {
      // Close when clicking outside the panel itself on phone
      if (!closest(e.target, '#filterBar')) setOpen(false);
    }
  });

  // Keep the open state consistent if the viewport crosses the breakpoint while open
  mqDesktop.addEventListener('change', () => {
    const open = isOpen();
    // Clear both, then re-apply correct one
    wrap.classList.remove('open');
    panel.classList.remove('open');
    if (open) setOpen(true);
  });

  // --- Filters: box click => toggle ✓ + chip ---
  filters.addEventListener('click', (e) => {
    const box = closest(e.target, '.filter-box-tag');
    if (!box) return;

    const name = box.getAttribute('data-name');
    if (!name) return;

    selected[name] = !selected[name];

    const square = box.querySelector('.box-square');
    if (square) square.classList.toggle('on', !!selected[name]);

    renderTags();
  });

  // --- Chips: X click => remove chip + untick the box ---
  tagsEl.addEventListener('click', (e) => {
    const btn = closest(e.target, 'button');
    if (!btn) return;

    const tag = closest(btn, '.tag');
    const name = tag?.dataset?.name;
    if (!name) return;

    delete selected[name];

    const box = filters.querySelector(`.filter-box-tag[data-name="${safeEscape(name)}"]`);
    const square = box?.querySelector('.box-square');
    if (square) square.classList.remove('on');

    renderTags();
  });

  // Initial paint (no chips selected)
  renderTags();
});
