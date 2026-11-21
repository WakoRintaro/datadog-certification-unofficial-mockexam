import { useLanguage } from '../utils/i18n';
import Breadcrumb from '../components/Breadcrumb';
import UpdateList from '../components/UpdateList';
import { updates, formatDate } from '../utils/updates';

export default function Updates() {
  const { lang } = useLanguage();
  const t = {
    en: {
      home: 'Home', title: 'Updates',
      lead: 'Fixes for problems reported in GitHub issues, newest first.',
      lastUpdated: 'Last updated', report: 'Report a problem on GitHub'
    },
    ja: {
      home: 'ホーム', title: '更新履歴',
      lead: 'GitHub Issue で報告いただいた問題の修正を、新しい順に掲載しています。',
      lastUpdated: '最終更新日', report: 'GitHub で問題を報告する'
    },
    pt: {
      home: 'Início', title: 'Atualizações',
      lead: 'Correções de problemas reportados em issues do GitHub, das mais recentes para as mais antigas.',
      lastUpdated: 'Última atualização', report: 'Reportar um problema no GitHub'
    }
  }[lang];

  return (
    <div className="container container--narrow">
      <Breadcrumb items={[{ label: t.home, to: '/' }, { label: t.title }]} />
      <header className="page-header">
        <h1 className="heading-1">{t.title}</h1>
        <p>{t.lead}</p>
        <p className="last-updated">
          {t.lastUpdated}: <time dateTime={updates.lastUpdated ?? undefined}>{formatDate(updates.lastUpdated, lang)}</time>
        </p>
      </header>

      <UpdateList items={updates.items} headingLevel={2} />

      <p className="section__footer">
        <a href={`${updates.repository}/issues`} target="_blank" rel="noopener noreferrer">{t.report}</a>
      </p>
    </div>
  );
}
