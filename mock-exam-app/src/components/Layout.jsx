import { useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import LanguageMenu from './LanguageMenu';
import useDocumentHead from '../seo/useDocumentHead';
import useGoogleAnalytics from '../utils/useGoogleAnalytics';
import { setUserProperties } from '../utils/analytics';
import { updates, formatDate } from '../utils/updates';
import { buildFeedbackUrl } from '../utils/feedback';

const ISSUES_URL = 'https://github.com/WakoRintaro/datadog-certification-unofficial-mockexam/issues';
// Tip page (e.g. 'https://ko-fi.com/your-id'). The footer link is hidden while this is empty.
const SUPPORT_URL = 'https://ko-fi.com/wakorintaro';

export default function Layout() {
  const { lang, localize } = useLanguage();
  // Update the head first so the page_view below reports the new page title.
  useDocumentHead();
  useGoogleAnalytics();

  useEffect(() => {
    setUserProperties({ interface_language: lang });
  }, [lang]);

  const t = {
    en: {
      siteSub: 'Unofficial mock exams', exams: 'Exams', updates: 'Updates',
      lastUpdated: 'Last updated',
      report: 'Found a mistake or have a suggestion? Open an issue on GitHub',
      reportForm: 'Or send a report with a form (no GitHub account needed)',
      support: 'Find this site useful? Buy me a coffee',
      note: 'Unofficial mock exam platform for the Datadog Fundamentals certification. Not affiliated with Datadog, Inc.',
      mainNav: 'Main'
    },
    ja: {
      siteSub: '非公式の模擬試験', exams: '模擬試験一覧', updates: '更新履歴',
      lastUpdated: '最終更新日',
      report: '問題の誤りやご要望は GitHub の Issue からお知らせください',
      reportForm: 'フォームで報告する（GitHub アカウント不要）',
      support: '役に立ったら、コーヒー1杯分の支援をお願いします',
      note: 'Datadog Fundamentals 認定試験の非公式模擬試験です。Datadog, Inc. とは関係ありません。',
      mainNav: 'メインメニュー'
    },
    pt: {
      siteSub: 'Simulados não oficiais', exams: 'Simulados', updates: 'Atualizações',
      lastUpdated: 'Última atualização',
      report: 'Encontrou um erro ou tem uma sugestão? Abra uma issue no GitHub',
      reportForm: 'Ou envie um relato por formulário (não precisa de conta no GitHub)',
      support: 'Este site foi útil? Me pague um café',
      note: 'Plataforma não oficial de simulados para a certificação Datadog Fundamentals. Sem vínculo com a Datadog, Inc.',
      mainNav: 'Menu principal'
    }
  }[lang];

  return (
    <div className="site">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to={localize('/')} className="site-name">
            {/* Keep "Mock Exams" together when the name wraps on phones. */}
            <span className="site-name__main">Datadog Fundamentals Mock{'\u00a0'}Exams</span>
            <span className="site-name__sub">{t.siteSub}</span>
          </Link>

          <nav className="site-nav" aria-label={t.mainNav}>
            <NavLink to={localize('/fundamentals/')} className="site-nav__link">{t.exams}</NavLink>
            <NavLink to={localize('/updates/')} className="site-nav__link site-nav__link--optional">{t.updates}</NavLink>
            <LanguageMenu />
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p className="site-footer__name">Datadog Fundamentals Mock Exams</p>
          <ul className="site-footer__links">
            <li><Link to={localize('/fundamentals/')}>{t.exams}</Link></li>
            <li><Link to={localize('/updates/')}>{t.updates}</Link></li>
            <li><a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">{t.report}</a></li>
            <li><a href={buildFeedbackUrl({ lang })} target="_blank" rel="noopener noreferrer">{t.reportForm}</a></li>
            {SUPPORT_URL && (
              <li><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">{t.support}</a></li>
            )}
          </ul>
          <p className="site-footer__note">
            {t.note}
            <br />
            {t.lastUpdated}: <time dateTime={updates.lastUpdated ?? undefined}>{formatDate(updates.lastUpdated, lang)}</time>
          </p>
        </div>
      </footer>
    </div>
  );
}
