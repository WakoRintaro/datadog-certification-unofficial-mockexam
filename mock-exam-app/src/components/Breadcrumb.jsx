import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/context';

// items: [{ label, to? }] — the last item is the current page
export default function Breadcrumb({ items }) {
  const { lang } = useLanguage();
  return (
    <nav className="breadcrumb" aria-label={lang === 'ja' ? 'パンくずリスト' : 'Breadcrumb'}>
      <ol className="breadcrumb__list">
        {items.map((item, i) => (
          <li key={i} className="breadcrumb__item">
            {i > 0 && <span className="breadcrumb__separator" aria-hidden="true">＞</span>}
            {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
