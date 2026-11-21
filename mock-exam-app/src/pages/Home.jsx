import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import UpdateList from '../components/UpdateList';
import { updates, formatDate } from '../utils/updates';

const RECENT_COUNT = 3;

export default function Home() {
  const { lang, localize } = useLanguage();

  const content = {
    en: {
      label: "Datadog Fundamentals",
      title: "Datadog Fundamentals certification mock exams",
      subtitle: "Practice questions for the Datadog Fundamentals exam, with an explanation for every answer. Free, no sign-up required. Your progress is saved in this browser.",
      cta: "See the exam list",
      factsLabel: "Overview",
      facts: [
        ["Sets", "7 sets"],
        ["Questions", "90 per set"],
        ["Modes", "Quiz mode / Study mode"],
        ["Price", "Free, no sign-up"]
      ],
      featuresTitle: "How to use",
      features: [
        { title: "Quiz mode", desc: "Answer one question at a time. The result and explanation appear right after you choose." },
        { title: "Study mode", desc: "Read all 90 questions of a set on one page and review the explanations you need." },
        { title: "Explanations", desc: "Each explanation says why the answer is correct. Errors reported on GitHub are fixed and listed below." }
      ],
      updatesTitle: "Recent updates",
      updatesAll: "All updates",
      lastUpdated: "Last updated"
    },
    ja: {
      label: "Datadog Fundamentals",
      title: "Datadog Fundamentals 認定試験の模擬試験",
      subtitle: "Datadog Fundamentals 試験の練習問題です。すべての問題に解説が付いています。無料・登録不要で、解答の進捗はお使いのブラウザに保存されます。",
      cta: "模擬試験の一覧を見る",
      factsLabel: "概要",
      facts: [
        ["セット数", "7セット"],
        ["問題数", "各セット90問"],
        ["モード", "クイズモード／学習モード"],
        ["料金", "無料・登録不要"]
      ],
      featuresTitle: "使い方",
      features: [
        { title: "クイズモード", desc: "1問ずつ解答します。選択するとすぐに正誤と解説が表示されます。" },
        { title: "学習モード", desc: "1セット90問を1ページで一覧し、必要な解説を見直せます。" },
        { title: "解説", desc: "正解の理由を解説しています。GitHub で報告された誤りは修正し、下の更新履歴に掲載しています。" }
      ],
      updatesTitle: "最近の更新",
      updatesAll: "すべての更新履歴",
      lastUpdated: "最終更新日"
    },
    pt: {
      label: "Datadog Fundamentals",
      title: "Simulados da certificação Datadog Fundamentals",
      subtitle: "Questões de prática para o exame Datadog Fundamentals, com explicação para cada resposta. Grátis e sem cadastro. Seu progresso fica salvo neste navegador.",
      cta: "Ver a lista de simulados",
      factsLabel: "Visão geral",
      facts: [
        ["Sets", "7 sets"],
        ["Questões", "90 por set"],
        ["Modos", "Quiz mode / Study mode"],
        ["Preço", "Grátis, sem cadastro"]
      ],
      featuresTitle: "Como usar",
      features: [
        { title: "Quiz mode", desc: "Responda uma questão por vez. O resultado e a explicação aparecem logo depois que você escolhe." },
        { title: "Study mode", desc: "Leia as 90 questões de um set em uma única página e revise as explicações de que precisar." },
        { title: "Explicações", desc: "Cada explicação diz por que a resposta está correta. Os erros reportados no GitHub são corrigidos e listados abaixo." }
      ],
      updatesTitle: "Atualizações recentes",
      updatesAll: "Todas as atualizações",
      lastUpdated: "Última atualização"
    }
  };

  const t = content[lang];

  return (
    <div className="container">
      <section className="intro" aria-labelledby="intro-title">
        <div>
          <p className="intro__label">{t.label}</p>
          <h1 id="intro-title" className="heading-1 intro__title">{t.title}</h1>
          <p className="lead intro__lead">{t.subtitle}</p>
          <Link
            to={localize('/fundamentals/')}
            className="button button--lg button--primary"
            onClick={() => trackEvent('home_cta_click', { destination: '/fundamentals' })}
          >
            {t.cta}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>

        <dl className="facts" aria-label={t.factsLabel}>
          {t.facts.map(([term, value]) => (
            <div key={term} className="facts__row">
              <dt className="facts__term">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section" aria-labelledby="features-title">
        <div className="section__header">
          <h2 id="features-title" className="heading-2">{t.featuresTitle}</h2>
        </div>
        <ul className="feature-list">
          {t.features.map((f) => (
            <li key={f.title} className="feature-list__item">
              <h3 className="heading-3">{f.title}</h3>
              <p>{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="updates-title">
        <div className="section__header">
          <h2 id="updates-title" className="heading-2">{t.updatesTitle}</h2>
          <p className="last-updated">
            {t.lastUpdated}: <time dateTime={updates.lastUpdated ?? undefined}>{formatDate(updates.lastUpdated, lang)}</time>
          </p>
        </div>
        <UpdateList items={updates.items.slice(0, RECENT_COUNT)} />
        <p className="section__footer">
          <Link to={localize('/updates/')}>{t.updatesAll}</Link>
        </p>
      </section>
    </div>
  );
}
