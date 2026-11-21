import updates from '../data/updates.json';

export { updates };

export function formatDate(iso, lang) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric', month: lang === 'ja' ? 'long' : 'short', day: 'numeric', timeZone: 'Asia/Tokyo',
  }).format(new Date(iso));
}
