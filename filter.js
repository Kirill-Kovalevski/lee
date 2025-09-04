document.addEventListener("DOMContentLoaded", () => {

  const mqDesktop = window.matchMedia("(min-width: 431px)");

  /** Wrapper element for the desktop drawer */
  const wrap = document.querySelector(".filter-bar-wrap");

  /** Panel element used on phone for the collapsible effect */
  const panel = document.getElementById("filterBar");

  /** Close (X) button inside the panel/drawer */
  const closeEl = document.getElementById("closeBar");

  /** Grid containing all filter boxes */
  const filters = document.getElementById("filters");

  /** Where the selected filter chips should appear next to the title */
  const tagsEl = document.querySelector(".appearing-tags");

  /** Opener button shown on phone (CSS = visibility) */
  const phoneBtn = document.getElementById("filter-btn");

  /** Opener button shown on desktop (CSS = visibility). */
  const desktopBtn = document.getElementById("filter-btn-desktop");

  // ---- Guard: bail early if critical nodes are missing ----------------------

  if (!wrap || !panel || !filters || !tagsEl) {
    console.warn(
      "Missing one of required nodes: .filter-bar-wrap, #filterBar, #filters, .appearing-tags"
    );
    return;
  }

  [phoneBtn, desktopBtn].forEach((btn) => {
    if (btn && !btn.hasAttribute("type")) {
      btn.setAttribute("type", "button");
    }
  });

  const selected = Object.create(null);

  // ---- Utilities ------------------------------------------------------------

  /**
   * Safe closest helper that won't explode if el is null/undefined.
   * @param {Element|null} el
   * @param {string} selector
   */
  const closest = (el, selector) => (el?.closest ? el.closest(selector) : null);

  /**
   * Escape a string for CSS attribute selectors.
   * Falls back to a simple double-quote escape if CSS.escape isn't available.
   * @param {string} str
   */
  const safeEscape = (str) =>
    (window.CSS && CSS.escape ? CSS.escape(str) : String(str).replace(/"/g, '\\"'));

  /**
   * Compute the display label for a chip by the filter's "name".
   * - Phone: always show a fixed generic label (per product spec).
   * - Desktop: prefer data-chip; otherwise .first-filter-bar-p text; fallback to name.
   * @param {string} name
   * @returns {string}
   */
  function getDisplayLabel(name) {
    // Phone: fixed generic label
    if (!mqDesktop.matches) return "תגית פילטר";

    // Desktop: try to read from the clicked box
    const box = filters.querySelector(
      `.filter-box-tag[data-name="${CSS.escape(name)}"]`
    );
    if (!box) return name;

    const fromDataChip = box.getAttribute("data-chip");
    if (fromDataChip) return fromDataChip.trim();

    const firstLine = box.querySelector(".first-filter-bar-p")?.textContent;
    return (firstLine || name).trim();
  }

  /**
   * Rebuild the selected chips UI next to the title.
   */
  function renderTags() {
    tagsEl.innerHTML = "";

    Object.keys(selected).forEach((name) => {
      if (!selected[name]) return;

      const chip = document.createElement("span");
      chip.className = "tag";
      chip.dataset.name = name;
      chip.innerHTML = `
        <p>${getDisplayLabel(name)}</p>
        <button type="button" aria-label="הסר">✕</button>
      `;
      tagsEl.appendChild(chip);
    });
  }

  /**
   * Keep aria-expanded on both openers in sync (accessibility).
   * @param {boolean} open
   */
  function setExpandedAttr(open) {
    if (phoneBtn) phoneBtn.setAttribute("aria-expanded", String(open));
    if (desktopBtn) desktopBtn.setAttribute("aria-expanded", String(open));
  }

  /**
   * Set open/close state depending on current viewport (desktop vs phone).
   * @param {boolean} open
   */
  function setOpen(open) {
    if (mqDesktop.matches) {
      // Desktop: toggle the overlay drawer on the wrapper
      wrap.classList.toggle("open", open);
      // Make sure phone style isn't lingering
      panel.classList.remove("open");
    } else {
      // Phone: toggle the collapsible panel (max-height)
      panel.classList.toggle("open", open);
      // Make sure desktop style isn't lingering
      wrap.classList.remove("open");
    }
    setExpandedAttr(open);
  }

  /**
   * Is the UI currently open? (Checks the correct element per viewport)
   */
  const isOpen = () =>
    mqDesktop.matches
      ? wrap.classList.contains("open")
      : panel.classList.contains("open");

  /**
   * Click handler for open/close toggle.
   * @param {MouseEvent} e
   */
  function togglePanel(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(!isOpen());
  }

  /**
   * Close handler (used by X button).
   * @param {MouseEvent|KeyboardEvent} e
   */
  function closePanel(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    setOpen(false);
  }


  phoneBtn?.addEventListener("click", togglePanel);
  desktopBtn?.addEventListener("click", togglePanel);
  closeEl?.addEventListener("click", closePanel);

  // ESC key closes the panel/drawer.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Click outside should close (areas differ per viewport).
  document.addEventListener("click", (e) => {
    // If user clicked one of the opener buttons, ignore.
    if (closest(e.target, "#filter-btn, #filter-btn-desktop, .filter-button")) {
      return;
    }

    if (mqDesktop.matches) {
      // Desktop: click outside the entire drawer closes it.
      if (!closest(e.target, ".filter-bar-wrap")) setOpen(false);
    } else {
      // Phone: click outside the panel body closes it.
      if (!closest(e.target, "#filterBar")) setOpen(false);
    }
  });

  // Keep state consistent if the viewport crosses the breakpoint while open.
  mqDesktop.addEventListener("change", () => {
    const wasOpen = isOpen();

    // Clear both classes; then re-apply the correct one based on current mode.
    wrap.classList.remove("open");
    panel.classList.remove("open");

    if (wasOpen) setOpen(true);
  });

  // ---- Filter selection --------------------------------------

  // Event delegation: clicking inside a .filter-box-tag toggles selection.
  filters.addEventListener("click", (e) => {
    const box = closest(e.target, ".filter-box-tag");
    if (!box) return;

    const name = box.getAttribute("data-name");
    if (!name) return;

    // Flip the selection state for this filter name.
    selected[name] = !selected[name];

    // Visually toggle the square checkmark.
    const square = box.querySelector(".box-square");
    if (square) square.classList.toggle("on", !!selected[name]);

    renderTags();
  });

  // ---- Chip removal ---------------------------

  // clicking the X button on a chip unselects it.
  tagsEl.addEventListener("click", (e) => {
    const btn = closest(e.target, "button");
    if (!btn) return;

    const tag = closest(btn, ".tag");
    const name = tag?.dataset?.name;
    if (!name) return;

    // Remove from state.
    delete selected[name];

    // Untick the corresponding box.
    const box = filters.querySelector(
      `.filter-box-tag[data-name="${safeEscape(name)}"]`
    );
    const square = box?.querySelector(".box-square");
    if (square) square.classList.remove("on");

    renderTags();
  });


  renderTags();
});
