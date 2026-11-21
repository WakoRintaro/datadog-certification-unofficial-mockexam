import { useMemo, useSyncExternalStore } from 'react';

// Exam progress is kept in localStorage. Pages read it through useSavedProgress so
// that the prerendered HTML (no saved progress) and the first client render match;
// React switches to the saved value right after hydration.

const EMPTY = { answers: {}, completed: false };
const storageKey = (setId) => `dd-mock-progress-${setId}`;
const listeners = new Set();

function readRaw(setId) {
  try {
    return localStorage.getItem(storageKey(setId));
  } catch {
    return null;
  }
}

function parse(raw) {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw);
    return { answers: data.answers || {}, completed: !!data.completed };
  } catch {
    return EMPTY;
  }
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener('storage', callback); // changes made in other tabs
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

export function saveProgress(setId, data) {
  try {
    localStorage.setItem(storageKey(setId), JSON.stringify(data));
  } catch {
    // Storage unavailable: progress just isn't kept.
  }
  listeners.forEach((callback) => callback());
}

export function useSavedProgress(setId) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(setId), () => null);
  return useMemo(() => parse(raw), [raw]);
}
