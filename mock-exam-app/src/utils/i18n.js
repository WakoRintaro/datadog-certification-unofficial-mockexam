import { createContext, useContext } from 'react';

// URLs carry the language: English pages live at the root, other languages under
// a prefix (/ja/ for Japanese, /pt/ for Brazilian Portuguese).
// Paths here are app paths (without the GitHub Pages base path).

export const LANG_STORAGE_KEY = 'dd-mock-lang';

export const LANGS = ['en', 'ja', 'pt'];
export const DEFAULT_LANG = 'en';

// Value for the HTML lang attribute, hreflang and locale formatting.
export const HTML_LANG = { en: 'en', ja: 'ja', pt: 'pt-BR' };
export const OG_LOCALE = { en: 'en_US', ja: 'ja_JP', pt: 'pt_BR' };

// How each language names itself (shown in the language switcher).
export const LANG_NAMES = { en: 'English', ja: '日本語', pt: 'Português (BR)' };

// The language a browser language tag (navigator.language) maps to, or null.
export function langFromBrowser(tag) {
  const code = String(tag ?? '').toLowerCase().slice(0, 2);
  return LANGS.includes(code) && code !== DEFAULT_LANG ? code : null;
}

// '/ja/fundamentals/' -> { lang: 'ja', path: '/fundamentals/' }
export function splitLang(pathname) {
  for (const lang of LANGS) {
    if (lang === DEFAULT_LANG) continue;
    if (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)) {
      return { lang, path: pathname.slice(lang.length + 1) || '/' };
    }
  }
  return { lang: DEFAULT_LANG, path: pathname || '/' };
}

// '/fundamentals/', 'ja' -> '/ja/fundamentals/'
export function localizePath(path, lang) {
  if (!lang || lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}

// The same page in another language.
export function alternatePath(pathname, lang) {
  return localizePath(splitLang(pathname).path, lang);
}

export function getLangPreference() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return LANGS.includes(saved) ? saved : null;
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

export const LanguageContext = createContext({ lang: DEFAULT_LANG });

// Returns the current language and `localize`, which turns an app path into the
// path of the same page in the current language.
export function useLanguage() {
  const { lang } = useContext(LanguageContext);
  return { lang, localize: (path) => localizePath(path, lang) };
}

// Picks the text for the current language, falling back to English.
export function pick(textByLang, lang) {
  return textByLang[lang] ?? textByLang[DEFAULT_LANG];
}
