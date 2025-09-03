// /lee/search.js
document.addEventListener('DOMContentLoaded', () => {
  // --- DOM refs ---
  // Both search inputs share the same id in your HTML (desktop + phone)
  const inputs = Array.from(document.querySelectorAll('#searchInput'));

  const resultsArea        = document.getElementById('resultsArea');   // where dynamic results go
  const desktopStaticWrap  = document.getElementById('static-rows');   // wrapper for the static desktop rows
  const phoneListWraps     = document.querySelectorAll('.user-report-wrap'); // phone-only cards container(s)
  const dataList           = document.getElementById('client-names');  // datalist for autocomplete

  // Helpers to show/hide
  const hideStatic = () => {
    desktopStaticWrap?.classList.add('is-hidden');
    phoneListWraps.forEach(el => el.classList.add('is-hidden'));
    resultsArea?.classList.remove('is-hidden');
  };
  const showStatic = () => {
    desktopStaticWrap?.classList.remove('is-hidden');
    phoneListWraps.forEach(el => el.classList.remove('is-hidden'));
    resultsArea?.classList.add('is-hidden');
  };

  // --- Rendering ---
  function renderRow(c) {
    // Decide visual styles based on values so it matches your static rows
    const hasNext = !!(c.nextClassDate && String(c.nextClassDate).trim());
    const nextCellHTML = hasNext
      ? `<p class="sky-blue-grid-box sky-font-color"><img src="/lee/icons/page_table_line_cell_future_tag-icon_type-yes.png" alt="V" /> ${c.nextClassDate}</p>`
      : `<div class="lelo-box">
           <p class="rubik-400-regular-14px">ללא</p>
           <img class="x-icon" src="/lee/icons/page_table_line_cell_future_tag-icon_type-no.png" alt="X" />
         </div>`;

    const sub = (c.subscription || '').trim();
    const isActive = sub === 'מנוי פעיל';
    const subCellClass = isActive ? 'sky-blue-grid-box sky-font-color' : 'grey-grid-box grey-text';
    const subCellHTML = `<p class="grid-item ${subCellClass}">${sub || ''}</p>`;

    const lastName   = c.lastClass?.name  || '—';
    const lastDate   = c.lastClass?.startDate || '';
    const lastHour   = c.lastClass?.startHour || '';

    // EXACT same structure/classes as your static rows
    return `
      <div class="full-user-report-box search-block-one" data-important="yes">
        <p class="grid-item rubik-400-regular-18px underline">${c.name || ''}</p>
        <p class="grid-item rubik-400-regular-18px">${lastName}</p>
        <div class="double-p">
          <p class="rubik-400-regular-18px">${lastDate}</p>
          <p class="grid-item rubik-400-regular-14px grey-grid-box">${lastHour}</p>
        </div>
        ${nextCellHTML}
        ${subCellHTML}
      </div>
    `;
  }

  function renderResults(list) {
    if (!resultsArea) return;
    resultsArea.innerHTML = '';

    if (!list.length) {
      resultsArea.textContent = 'אין תוצאות';
      return;
    }
    // Build once for performance
    const html = list.map(renderRow).join('');
    resultsArea.insertAdjacentHTML('beforeend', html);
  }

  // --- Data loading ---
  let clients = [];
  fetch('/lee/data/clients.json', { cache: 'no-store' })
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => {
      clients = Array.isArray(data) ? data : (data.clients || []);
      // Fill datalist for autocomplete
      if (dataList) {
        dataList.innerHTML = '';
        clients.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.name || '';
          dataList.appendChild(opt);
        });
      }
    })
    .catch(err => console.error('Failed to load /lee/data/clients.json:', err));

  // --- Search handler (for both inputs) ---
  function onSearch(e) {
    const q = (e.target.value || '').trim().toLowerCase();
    if (!q) {
      showStatic();
      return;
    }
    const matches = clients.filter(c =>
      (c.name || '').toLowerCase().includes(q)
    );
    hideStatic();
    renderResults(matches);
  }

  // Wire up inputs
  inputs.forEach(inp => inp?.addEventListener('input', onSearch));
});
