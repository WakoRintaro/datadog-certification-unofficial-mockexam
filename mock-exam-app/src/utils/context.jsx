import { useEffect } from 'react';
import { LanguageContext } from './i18n';

// The language comes from the URL (see App.jsx), not from state.
export function LanguageProvider({ lang, children }) {
  // Keep the declared document language in sync with what's actually shown
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}
