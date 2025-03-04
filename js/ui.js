// js/ui.js

/**
 * Render daftar novel ke dalam DOM.
 * @param {Array} novels - Array objek novel.
 * @param {Function} onEdit - Callback ketika tombol Edit diklik.
 * @param {Function} onDelete - Callback ketika tombol Hapus diklik.
 * @param {Function} onNote - Callback ketika tombol Catatan diklik.
 */
export function renderNovels(novels, onEdit, onDelete, onNote) {
  const novelList = document.getElementById('novelList');
  novelList.innerHTML = '';

  novels.forEach((novel) => {
    const li = document.createElement('li');
    li.className = 'novel-item';

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'novel-details';
    detailsDiv.innerHTML = `
      <strong>${novel.title}</strong> - Bab: ${novel.chapter}<br/>
      <a href="${novel.url}" target="_blank">Buka Novel</a>
      ${novel.notes ? `<br/><em>Catatan: ${novel.notes}</em>` : ''}
    `;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'novel-actions';

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    // Mengirimkan novel.id alih-alih index
    editButton.addEventListener('click', () => onEdit(novel.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Hapus';
    // Mengirimkan novel.id alih-alih index
    deleteButton.addEventListener('click', () => onDelete(novel.id));

    const noteButton = document.createElement('button');
    noteButton.className = 'note-btn';
    noteButton.textContent = 'Catatan';
    // Mengirimkan novel.id alih-alih index
    noteButton.addEventListener('click', () => onNote(novel.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    actionsDiv.appendChild(noteButton);

    li.appendChild(detailsDiv);
    li.appendChild(actionsDiv);
    novelList.appendChild(li);
  });
}

/**
 * Render statistik bacaan ke dalam elemen dengan id "stats".
 * @param {Object} stats - Objek statistik, misalnya { totalNovel: 5, totalChapters: 123 }.
 */
export function renderStats(stats) {
  const statsDiv = document.getElementById('stats');
  if (!statsDiv) {
    console.warn('Element with id "stats" tidak ditemukan.');
    return;
  }
  statsDiv.innerHTML = `
    <p>Total Novel: ${stats.totalNovel}</p>
    <p>Total Bab Dibaca: ${stats.totalChapters}</p>
  `;
}

/**
 * Render tombol toggle tema (dark/light mode).
 * @param {string} currentMode - 'light' atau 'dark'.
 * @param {Function} onToggle - Callback ketika tombol diklik.
 */
export function renderThemeToggle(currentMode, onToggle) {
  let toggleContainer = document.getElementById('theme-toggle');
  if (!toggleContainer) {
    toggleContainer = document.createElement('div');
    toggleContainer.id = 'theme-toggle';
    document.body.insertBefore(toggleContainer, document.body.firstChild);
  }
  
  toggleContainer.innerHTML = '';
  const toggleButton = document.createElement('button');
  toggleButton.textContent = currentMode === 'dark' ? 'Mode Terang' : 'Mode Gelap';
  toggleButton.addEventListener('click', onToggle);
  toggleContainer.appendChild(toggleButton);
}
