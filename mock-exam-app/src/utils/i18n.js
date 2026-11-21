import { createContext, useContext } from 'react';

// URLs carry the language: English pages live at the root, Japanese pages under /ja/.
// Paths here are app paths (without the GitHub Pages base path).

export const LANG_STORAGE_KEY = 'dd-mock-lang';

// '/ja/fundamentals/' -> { lang: 'ja', path: '/fundamentals/' }
export function splitLang(pathname) {
  if (pathname === '/ja' || pathname.startsWith('/ja/')) {
    return { lang: 'ja', path: pathname.slice(3) || '/' };
  }
  return { lang: 'en', path: pathname || '/' };
}

// '/fundamentals/', 'ja' -> '/ja/fundamentals/'
export function localizePath(path, lang) {
  if (lang !== 'ja') return path;
  return path === '/' ? '/ja/' : `/ja${path}`;
}

// The same page in the other language.
export function alternatePath(pathname) {
  const { lang, path } = splitLang(pathname);
  return localizePath(path, lang === 'ja' ? 'en' : 'ja');
}

export function getLangPreference() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLangPreference(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the URL still holds the language.
  }
}

export const LanguageContext = createContext({ lang: 'en' });

// Returns the current language and `localize`, which turns an app path into the
// path of the same page in the current language.
export function useLanguage() {
  const { lang } = useContext(LanguageContext);
  return { lang, localize: (path) => localizePath(path, lang) };
}
