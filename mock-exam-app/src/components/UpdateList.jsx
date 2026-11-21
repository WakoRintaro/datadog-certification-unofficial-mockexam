import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { formatDate } from '../utils/updates';

export default function UpdateList({ items, headingLevel = 3 }) {
  const { lang } = useLanguage();
  const Heading = `h${headingLevel}`;
  if (items.length === 0) {
    return <p className="text-description">{lang === 'ja' ? '更新情報はまだありません。' : 'No updates yet.'}</p>;
  }
  return (
    <ol className="update-list">
      {items.map((item) => (
        <li key={item.number} className="update-item">
          <p className="update-item__meta">
            <time dateTime={item.closedAt}>{formatDate(item.closedAt, lang)}</time>
            <span className="chip chip--success">{lang === 'ja' ? '修正済み' : 'Fixed'}</span>
          </p>
          <Heading className="update-item__title" lang="en">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
              <ExternalLink size={16} className="link-icon" aria-label={lang === 'ja' ? '（GitHubで開く）' : '(opens GitHub)'} />
            </a>
            <span className="update-item__number">#{item.number}</span>
          </Heading>
          {item.summary && <p className="update-item__summary" lang="en">{item.summary}</p>}
        </li>
      ))}
    </ol>
  );
}
