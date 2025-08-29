// === Elements ===
const filterBtn = document.getElementById('filter-btn');
const tagbar = document.getElementById('tagbar');
const closeBtn = document.querySelector('.close-btn');
const dropdownBtn = document.getElementById('dropdown-btn');
const midTitle = document.getElementById('appearing-tag');
const checkboxes = document.querySelectorAll('.tag-checkbox');

// === Open sidebar + show dropdown ===
filterBtn?.addEventListener('click', () => {
  tagbar.classList.add('show');
  dropdownBtn?.classList.remove('hidden'); // show dropdown button
});

// === Close sidebar + hide dropdown ===
closeBtn?.addEventListener('click', () => {
  tagbar.classList.remove('show');
  dropdownBtn?.classList.add('hidden'); // hide dropdown button again
});

// === Checkbox logic: add/remove tags near mid-title ===
checkboxes.forEach((box, index) => {
  box.addEventListener('click', (e) => {
    e.preventDefault();
    box.classList.toggle('active');

    // Build label text from <p> tags in the tagbar
    const parent = box.closest('.tag-item');
    let labelText = `Tag ${index + 1}`;
    if (parent) {
      const p1 = parent.querySelector('p:nth-child(1)')?.textContent || '';
      const p2 = parent.querySelector('p:nth-child(2)')?.textContent || '';
      labelText = (p1 + ' ' + p2).trim() || labelText;
      labelText = "תגית לדוגמה"
    }

    // Look for existing tag near mid-title
    let existingTag = midTitle.querySelector(`.tag-label[data-id="${index}"]`);

    if (box.classList.contains('active')) {
      // Add tag box near mid-title if it doesn't exist
      if (!existingTag) {
        const tag = document.createElement('div');
        tag.className = 'tag-label';
        tag.dataset.id = index;
        tag.innerHTML = `${labelText} <button class="remove-tag">✕</button>`;
        midTitle.appendChild(tag);

        // Removal logic for the tag's X button
        tag.querySelector('.remove-tag').addEventListener('click', () => {
          tag.remove();
          box.classList.remove('active'); // uncheck in tagbar too
        });
      }
    } else {
      // Remove tag if user unchecks directly in tagbar
      if (existingTag) existingTag.remove();
    }
  });
});
