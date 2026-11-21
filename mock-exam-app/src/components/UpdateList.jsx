import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../utils/i18n';

const TEXT = {
  en: { none: 'No updates yet.', fixed: 'Fixed', opens: '(opens GitHub)' },
  ja: { none: '更新情報はまだありません。', fixed: '修正済み', opens: '（GitHubで開く）' },
  pt: { none: 'Ainda não há atualizações.', fixed: 'Corrigido', opens: '(abre o GitHub)' }
};
import { formatDate } from '../utils/updates';

export default function UpdateList({ items, headingLevel = 3 }) {
  const { lang } = useLanguage();
  const Heading = `h${headingLevel}`;
  const t = TEXT[lang];
  if (items.length === 0) {
    return <p className="text-description">{t.none}</p>;
  }
  return (
    <ol className="update-list">
      {items.map((item) => (
        <li key={item.number} className="update-item">
          <p className="update-item__meta">
            <time dateTime={item.closedAt}>{formatDate(item.closedAt, lang)}</time>
            <span className="chip chip--success">{t.fixed}</span>
          </p>
          <Heading className="update-item__title" lang="en">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
              <ExternalLink size={16} className="link-icon" aria-label={t.opens} />
            </a>
            <span className="update-item__number">#{item.number}</span>
          </Heading>
          {item.summary && <p className="update-item__summary" lang="en">{item.summary}</p>}
        </li>
      ))}
    </ol>
  );
}
