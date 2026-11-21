import { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage, alternatePath, saveLangPreference, LANGS, LANG_NAMES, HTML_LANG } from '../utils/i18n';

// The button names the menu in the current language; each choice is named in its own
// language, so readers who can't read the current language can still find theirs.
const LABEL = { en: 'Language', ja: '言語', pt: 'Idioma' };

// A button that opens a list of links to the same page in each language.
export default function LanguageMenu() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();

  // Close on a click outside the menu, or on Escape (and return focus to the button).
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="lang-menu" ref={rootRef}>
      <button
        type="button"
        ref={buttonRef}
        className="lang-menu__button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${LABEL[lang]}: ${LANG_NAMES[lang]}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe size={20} aria-hidden="true" />
        <span className="lang-menu__current">{LANG_NAMES[lang]}</span>
        <ChevronDown size={16} aria-hidden="true" className="lang-menu__chevron" />
      </button>

      {/* Rendered (hidden) even when closed, so the prerendered HTML links every language. */}
      <ul id={listId} className="lang-menu__list" hidden={!open}>
        {LANGS.map((l) => (
          <li key={l}>
            <Link
              to={alternatePath(pathname, l)}
              onClick={() => {
                saveLangPreference(l);
                setOpen(false);
              }}
              className="lang-menu__link"
              lang={HTML_LANG[l]}
              hrefLang={HTML_LANG[l]}
              aria-current={l === lang ? 'true' : undefined}
            >
              {LANG_NAMES[l]}
              {l === lang && <Check size={18} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
