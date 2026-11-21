import { useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage, alternatePath, saveLangPreference } from '../utils/i18n';
import { Globe } from 'lucide-react';
import useDocumentHead from '../seo/useDocumentHead';
import useGoogleAnalytics from '../utils/useGoogleAnalytics';
import { setUserProperties } from '../utils/analytics';
import { updates, formatDate } from '../utils/updates';
import { buildFeedbackUrl } from '../utils/feedback';

const ISSUES_URL = 'https://github.com/WakoRintaro/datadog-certification-unofficial-mockexam/issues';

export default function Layout() {
  const { lang, localize } = useLanguage();
  const { pathname } = useLocation();
  const otherLang = lang === 'ja' ? 'en' : 'ja';
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
      note: 'Unofficial mock exam platform for the Datadog Fundamentals certification. Not affiliated with Datadog, Inc.'
    },
    ja: {
      siteSub: '非公式の模擬試験', exams: '模擬試験一覧', updates: '更新履歴',
      lastUpdated: '最終更新日',
      report: '問題の誤りやご要望は GitHub の Issue からお知らせください',
      reportForm: 'フォームで報告する（GitHub アカウント不要）',
      note: 'Datadog Fundamentals 認定試験の非公式模擬試験です。Datadog, Inc. とは関係ありません。'
    }
  }[lang];

  return (
    <div className="site">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to={localize('/')} className="site-name">
            <span className="site-name__main">Datadog Fundamentals Mock Exams</span>
            <span className="site-name__sub">{t.siteSub}</span>
          </Link>

          <nav className="site-nav" aria-label={lang === 'ja' ? 'メインメニュー' : 'Main'}>
            <NavLink to={localize('/fundamentals/')} className="site-nav__link">{t.exams}</NavLink>
            <NavLink to={localize('/updates/')} className="site-nav__link site-nav__link--optional">{t.updates}</NavLink>
            {/* Show the language to switch to, written in that language, so that
                readers who can't read the current language can still find it. */}
            {/* A link to the same page in the other language, so crawlers can follow it too. */}
            <Link
              to={alternatePath(pathname)}
              onClick={() => saveLangPreference(otherLang)}
              className="lang-button"
              lang={otherLang}
              hrefLang={otherLang}
              aria-label={lang === 'ja' ? 'Switch to English' : '日本語に切り替える'}
            >
              <Globe size={20} aria-hidden="true" />
              {lang === 'ja' ? 'English' : '日本語'}
            </Link>
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
