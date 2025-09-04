document.addEventListener("DOMContentLoaded", () => {
  
  const inputs = Array.from(document.querySelectorAll("#searchInput"));

  /** Container dynamic results */
  const resultsArea = document.getElementById("resultsArea");

  /** Desktop wrapper with  static rows  */
  const desktopStaticWrap = document.getElementById("static-rows");

  /** Phone-only: full-user-report */
  const phoneListWraps = document.querySelectorAll(".user-report-wrap");

  /** datalist **/
  const dataList = document.getElementById("client-names");

  // ---------------------------------------------------------------------------
  //  show/hide sections depending on search state
  // ---------------------------------------------------------------------------
  const hideStatic = () => {
    desktopStaticWrap?.classList.add("is-hidden");
    phoneListWraps.forEach((el) => el.classList.add("is-hidden"));
    resultsArea?.classList.remove("is-hidden");
  };

  const showStatic = () => {
    desktopStaticWrap?.classList.remove("is-hidden");
    phoneListWraps.forEach((el) => el.classList.remove("is-hidden"));
    resultsArea?.classList.add("is-hidden");
  };

  function renderRow(c) {
    // Whether there’s a “next class” date (controls which cell we render).
    const hasNext = !!(c.nextClassDate && String(c.nextClassDate).trim());

    // If has next class → blue tag with V icon; otherwise → "ללא" box with X icon.
    const nextCellHTML = hasNext
      ? `
        <p class="sky-blue-grid-box sky-font-color">
          <img src="/lee/icons/page_table_line_cell_future_tag-icon_type-yes.png" alt="V" />
          ${c.nextClassDate}
        </p>
      `
      : `
        <div class="lelo-box">
          <p class="rubik-400-regular-14px">ללא</p>
          <img class="x-icon" src="/lee/icons/page_table_line_cell_future_tag-icon_type-no.png" alt="X" />
        </div>
      `;

    // Subscription cell styling (active: blue, else: grey).
    const subText = (c.subscription || "").trim();
    const isActive = subText === "מנוי פעיל";
    const subCellClass = isActive
      ? "sky-blue-grid-box sky-font-color"
      : "grey-grid-box grey-text";
    const subCellHTML = `
      <p class="grid-item ${subCellClass}">
        ${subText || ""}
      </p>
    `;

    const lastName = c.lastClass?.name || "—";
    const lastDate = c.lastClass?.startDate || "";
    const lastHour = c.lastClass?.startHour || "";

    return `
      <div class="full-user-report-box search-block-one" data-important="yes">
        <p class="grid-item rubik-400-regular-18px underline">${c.name || ""}</p>
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

  /**
   * If list is empty, show a friendly "no results" message.
   */
  function renderResults(list) {
    if (!resultsArea) return;

    resultsArea.innerHTML = "";

    if (!list.length) {
      resultsArea.textContent = "אין תוצאות";
      return;
    }

    // Build a single string for performance
    const html = list.map(renderRow).join("");
    resultsArea.insertAdjacentHTML("beforeend", html);
  }

  /** In-memory list of clients */
  let clients = [];

  fetch("/lee/data/clients.json", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      
      clients = Array.isArray(data) ? data : data.clients || [];

    
      if (dataList) {
        dataList.innerHTML = "";
        clients.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = c.name || "";
          dataList.appendChild(opt);
        });
      }
    })
    .catch((err) => {
      console.error("Failed to load /lee/data/clients.json:", err);
      clients = [];
    });

  // ---------------------------------------------------------------------------
  // Search handler: runs on "input" for BOTH search boxes
  // ---------------------------------------------------------------------------
  function onSearch(e) {
    const query = (e.target.value || "").trim().toLowerCase();

    // If the search is empty show the original static content.
    if (!query) {
      showStatic();
      return;
    }

    const matches = clients.filter((c) =>
      (c.name || "").toLowerCase().includes(query)
    );

    hideStatic();
    renderResults(matches);
  }

  // Wire up listeners for all search inputs (desktop + phone).
  inputs.forEach((inp) => {
    inp?.addEventListener("input", onSearch);
  });
});
