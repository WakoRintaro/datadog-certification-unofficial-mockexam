import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';

export default function NotFound() {
  const { lang, localize } = useLanguage();
  const t = {
    en: { title: 'Page not found', lead: 'The page you were looking for does not exist or has moved.', home: 'Go to the home page', exams: 'See the exam list' },
    ja: { title: 'ページが見つかりません', lead: 'お探しのページは存在しないか、移動した可能性があります。', home: 'ホームへ', exams: '模擬試験の一覧へ' }
  }[lang];

  return (
    <div className="container container--narrow">
      <header className="page-header">
        <h1 className="heading-1">{t.title}</h1>
        <p>{t.lead}</p>
      </header>
      <ul className="section__footer">
        <li><Link to={localize('/fundamentals/')}>{t.exams}</Link></li>
        <li><Link to={localize('/')}>{t.home}</Link></li>
      </ul>
    </div>
  );
}
