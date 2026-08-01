import { createContext, useContext, useState, useEffect } from 'react';

// Context
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  // Load selected language from storage, otherwise fall back to browser language
  useEffect(() => {
    const savedL = localStorage.getItem('dd-mock-lang');
    if (savedL) {
      setLang(savedL);
    } else if (navigator.language?.toLowerCase().startsWith('ja')) {
      setLang('ja');
    }
  }, []);

  // Keep the declared document language in sync with what's actually shown
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => {
      const v = prev === 'en' ? 'ja' : 'en';
      localStorage.setItem('dd-mock-lang', v);
      return v;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// LocalStorage helpers for Exam Progress
export function getSavedProgress(setId) {
  try {
    const data = localStorage.getItem(`dd-mock-progress-${setId}`);
    return data ? JSON.parse(data) : { answers: {}, completed: false };
  } catch(e) {
    return { answers: {}, completed: false };
  }
}

export function saveProgress(setId, data) {
  localStorage.setItem(`dd-mock-progress-${setId}`, JSON.stringify(data));
}
