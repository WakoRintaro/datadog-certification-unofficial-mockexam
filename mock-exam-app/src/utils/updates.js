import updates from '../data/updates.json';
import { HTML_LANG } from './i18n';

export { updates };

export function formatDate(iso, lang) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(HTML_LANG[lang] === 'ja' ? 'ja-JP' : HTML_LANG[lang] === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric', month: lang === 'ja' ? 'long' : 'short', day: 'numeric', timeZone: 'Asia/Tokyo',
  }).format(new Date(iso));
}
