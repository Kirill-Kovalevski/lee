// /lee/search.js
document.addEventListener('DOMContentLoaded', () => {
  // Grab BOTH inputs (desktop + phone share the same id)
  const inputs = Array.from(document.querySelectorAll('#searchInput'));

  // Areas we toggle
  const resultsArea = document.getElementById('resultsArea');                // dynamic results
  const desktopStaticWrap = document.getElementById('static-rows');         // desktop static rows wrapper
  const phoneStaticWraps = document.querySelectorAll('.user-report-wrap');  // phone list wrapper(s)
  const lonePhoneCons    = document.querySelectorAll(
    // if you have phone "cards" not inside .user-report-wrap
    '.user-report-con:not(.user-report-wrap .user-report-con)'
  );

  // Helper toggles
  function hideStatic() {
    desktopStaticWrap?.classList.add('is-hidden');
    phoneStaticWraps.forEach(el => el.classList.add('is-hidden'));
    lonePhoneCons.forEach(el => el.classList.add('is-hidden'));
    resultsArea?.classList.remove('is-hidden');
  }
  function showStatic() {
    desktopStaticWrap?.classList.remove('is-hidden');
    phoneStaticWraps.forEach(el => el.classList.remove('is-hidden'));
    lonePhoneCons.forEach(el => el.classList.remove('is-hidden'));
    resultsArea?.classList.add('is-hidden');
  }

  // Render results into #resultsArea
  function renderResults(list) {
    if (!resultsArea) return;
    resultsArea.innerHTML = '';

    if (!list.length) {
      resultsArea.textContent = 'אין תוצאות';
      return;
    }

    list.forEach(c => {
      const row = document.createElement('div');
      row.className = 'search-result-box full-user-report-box'; // reuse your row look
      row.innerHTML = `
        <p class="grid-item rubik-400-regular-18px underline">${c.name}</p>
        <p class="grid-item rubik-400-regular-18px">${c.lastClass?.name || '—'}</p>
        <div class="double-p">
          <p class="rubik-400-regular-18px">${c.lastClass?.date || ''}</p>
          <p class="grid-item rubik-400-regular-14px grey-grid-box">${c.lastClass?.hour || ''}</p>
        </div>
        <p class="sky-blue-grid-box sky-font-color">${c.nextClassDate || 'ללא'}</p>
        <p class="grid-item grey-grid-box">${c.subscription || ''}</p>
      `;
      resultsArea.appendChild(row);
    });
  }

  // State
  let clients = [];

  // Load mock data (absolute path so it always resolves)
  fetch('/lee/data/clients.json')
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(data => {
      clients = Array.isArray(data) ? data : data.clients || [];
      // Fill datalist with names (both inputs point to the same <datalist id="client-names">)
      const dl = document.getElementById('client-names');
      if (dl) {
        dl.innerHTML = '';
        clients.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.name;
          dl.appendChild(opt);
        });
      }
    })
    .catch(err => console.error('Failed to load /lee/data/clients.json:', err));

  // Search handler (shared by both inputs)
  function onSearch(e) {
    const q = (e.target.value || '').trim().toLowerCase();

    if (!q) {
      showStatic();
      return;
    }

    const matches = clients.filter(c => (c.name || '').toLowerCase().includes(q));
    hideStatic();
    renderResults(matches);
  }

  // Attach to BOTH inputs (desktop + phone)
  inputs.forEach(inp => inp?.addEventListener('input', onSearch));
});
