// js/storage.js

const DB_NAME = 'NovelTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'novels';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export async function getNovels() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject('Error reading novels');
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export async function addNovel(novel) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(novel);
    request.onerror = () => reject('Error adding novel');
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export async function updateNovel(novel) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(novel);
    request.onerror = () => reject('Error updating novel');
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export async function deleteNovel(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject('Error deleting novel');
    request.onsuccess = () => {
      resolve();
    };
  });
}