// js/app.js

import { getNovels, addNovel, updateNovel, deleteNovel as deleteNovelFromDB } from './storage.js';
import { renderNovels, renderStats, renderThemeToggle } from './ui.js';
import { filterNovels } from './search.js';

let currentTheme = 'light';

// Fungsi untuk memperbarui cache localStorage dengan data dari IndexedDB
async function updateCache() {
  const novels = await getNovels();
  localStorage.setItem("novelsCache", JSON.stringify(novels));
}

async function loadAndRenderNovels() {
  let novels = [];
  // Cek apakah ada cache di localStorage
  const cachedNovels = localStorage.getItem("novelsCache");
  if (cachedNovels) {
    novels = JSON.parse(cachedNovels);
  } else {
    novels = await getNovels();
    localStorage.setItem("novelsCache", JSON.stringify(novels));
  }
  
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value : '';
  const filteredNovels = query ? filterNovels(query, novels) : novels;
  renderNovels(filteredNovels, editNovel, deleteNovel, addNote, updateNovelFromUrl);
  
  // Hitung dan render statistik bacaan
  const totalNovel = novels.length;
  const totalChapters = novels.reduce((sum, novel) => sum + (parseInt(novel.chapter, 10) || 0), 0);
  renderStats({ totalNovel, totalChapters });
}

document.getElementById('novelForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const chapter = document.getElementById('chapter').value;
  const url = document.getElementById('url').value;
  
  // Tambahkan novel baru ke IndexedDB
  await addNovel({ title, chapter, url, notes: '' });
  
  // Bersihkan form input
  document.getElementById('title').value = '';
  document.getElementById('chapter').value = '';
  document.getElementById('url').value = '';
  
  // Perbarui cache setelah penambahan novel dan render ulang
  await updateCache();
  await loadAndRenderNovels();
});

document.getElementById('searchInput').addEventListener('input', async function(e) {
  await loadAndRenderNovels();
});

async function editNovel(id) {
  const idNum = Number(id);
  let novels = await getNovels();
  const novel = novels.find(n => n.id === idNum);
  if (!novel) {
    alert("Novel tidak ditemukan.");
    return;
  }
  const newChapter = prompt("Update bab terakhir untuk novel: " + novel.title, novel.chapter);
  if (newChapter !== null) {
    novel.chapter = newChapter;
    await updateNovel(novel);
    // Perbarui cache setelah edit dan render ulang
    await updateCache();
    await loadAndRenderNovels();
  }
}

async function deleteNovel(id) {
  const idNum = Number(id);
  if (confirm("Apakah Anda yakin ingin menghapus novel ini?")) {
    await deleteNovelFromDB(idNum);
    // Perbarui cache setelah penghapusan dan render ulang
    await updateCache();
    await loadAndRenderNovels();
  }
}

async function addNote(id) {
  const idNum = Number(id);
  let novels = await getNovels();
  const novel = novels.find(n => n.id === idNum);
  if (!novel) {
    alert("Novel tidak ditemukan.");
    return;
  }
  const note = prompt("Tambahkan catatan untuk novel: " + novel.title, novel.notes || "");
  if (note !== null) {
    novel.notes = note;
    await updateNovel(novel);
    // Perbarui cache setelah menambahkan catatan dan render ulang
    await updateCache();
    await loadAndRenderNovels();
  }
}

async function updateNovelFromUrl(id) {
  const novels = await getNovels();
  const novel = novels.find(n => n.id === id);
  if (!novel) {
    alert('Novel tidak ditemukan.');
    return;
  }
  try {
    const response = await fetch(novel.url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    // Contoh: ambil elemen dengan kelas "latest-chapter" untuk mendapatkan bab terbaru
    const chapterElement = doc.querySelector('.latest-chapter');
    if (chapterElement) {
      const newChapter = chapterElement.textContent.trim();
      novel.chapter = newChapter;
      await updateNovel(novel);
      alert('Novel berhasil diperbarui!');
      await updateCache();
      await loadAndRenderNovels();
    } else {
      alert('Bab terbaru tidak ditemukan pada halaman novel.');
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat memperbarui novel.');
  }
}


function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark');
  renderThemeToggle(currentTheme, toggleTheme);
}

renderThemeToggle(currentTheme, toggleTheme);
loadAndRenderNovels();
