// js/search.js

/**
 * Filter novel berdasarkan query pada properti title.
 * @param {string} query - Kata kunci pencarian.
 * @param {Array} novels - Array objek novel.
 * @returns {Array} Novel yang memenuhi kriteria pencarian.
 */
export function filterNovels(query, novels) {
  return novels.filter(novel => novel.title.toLowerCase().includes(query.toLowerCase()));
}