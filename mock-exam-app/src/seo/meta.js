// Per-page <head> metadata. Used by scripts/prerender.js (written into the static
// HTML) and by useDocumentHead (kept up to date on client-side navigation).
import mockExams from '../data/mockExams.json';
import updates from '../data/updates.json';
import { splitLang, localizePath, LANGS, HTML_LANG, OG_LOCALE } from '../utils/i18n';

export const SITE_ORIGIN = 'https://wakorintaro.github.io';
// Base path from vite.config.js `base`, without the trailing slash.
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const SITE_NAME = { en: 'Datadog Fundamentals Mock Exams', ja: 'Datadog Fundamentals 模擬試験', pt: 'Simulados Datadog Fundamentals' };

const TOTAL_QUESTIONS = mockExams.reduce((n, exam) => n + exam.questions.length, 0);
const QUESTIONS_PER_SET = mockExams[0]?.questions.length ?? 0;

export const absoluteUrl = (appPath) => `${SITE_URL}${appPath}`;

// All indexable pages, in both languages.
export function getAllPaths() {
  const paths = ['/', '/fundamentals/'];
  for (const exam of mockExams) {
    paths.push(`/fundamentals/set/${exam.setId}/`, `/fundamentals/set/${exam.setId}/study/`);
  }
  paths.push('/updates/');
  return LANGS.flatMap((lang) => paths.map((p) => localizePath(p, lang)));
}

function pageText(path, lang) {
  if (lang === 'pt') return pageTextPt(path);
  const ja = lang === 'ja';

  if (path === '/') {
    return ja
      ? {
          title: 'Datadog Fundamentals 模擬試験 | 無料の認定試験対策（非公式）',
          description: `Datadog Fundamentals 認定試験対策の無料模擬試験（非公式）。全${mockExams.length}セット・各${QUESTIONS_PER_SET}問（計${TOTAL_QUESTIONS}問）を、クイズモードと学習モードで演習できます。すべての問題に解説付き、登録不要。`,
        }
      : {
          title: 'Datadog Fundamentals Mock Exams | Free Certification Prep (Unofficial)',
          description: `Free, unofficial mock exams for the Datadog Fundamentals certification: ${mockExams.length} sets of ${QUESTIONS_PER_SET} questions (${TOTAL_QUESTIONS} in total) with quiz and study modes and an explanation for every answer. No sign-up.`,
        };
  }

  if (path === '/fundamentals/') {
    return ja
      ? {
          title: `模擬試験一覧（全${mockExams.length}セット） | ${SITE_NAME.ja}`,
          description: `Datadog Fundamentals 模擬試験の全${mockExams.length}セット（各${QUESTIONS_PER_SET}問）の一覧です。セットを選んで、無料で練習を始められます。`,
        }
      : {
          title: `Mock Exam List (${mockExams.length} Sets) | ${SITE_NAME.en}`,
          description: `Choose from ${mockExams.length} Datadog Fundamentals mock exam sets of ${QUESTIONS_PER_SET} questions each and start practicing for free.`,
        };
  }

  const set = path.match(/^\/fundamentals\/set\/([^/]+)\/(study\/)?$/);
  const exam = set && mockExams.find((e) => e.setId === set[1]);
  if (exam) {
    const n = exam.questions.length;
    if (set[2]) {
      return ja
        ? {
            title: `模擬試験 セット${exam.setId} 全${n}問の正解と解説 | ${SITE_NAME.ja}`,
            description: `Datadog Fundamentals 模擬試験 セット${exam.setId}の全${n}問を、正解と解説付きで1ページにまとめた学習モードです。`,
          }
        : {
            title: `Mock Exam Set ${exam.setId}: All ${n} Questions with Answers and Explanations | ${SITE_NAME.en}`,
            description: `Study mode for Datadog Fundamentals mock exam set ${exam.setId}: all ${n} questions on one page, each with the correct answer and an explanation.`,
          };
    }
    return ja
      ? {
          title: `模擬試験 セット${exam.setId}（${n}問） | ${SITE_NAME.ja}`,
          description: `Datadog Fundamentals 模擬試験 セット${exam.setId}（全${n}問）。1問ずつ解答し、その場で正誤と解説を確認できます。無料・登録不要。`,
        }
      : {
          title: `Mock Exam Set ${exam.setId} (${n} Questions) | ${SITE_NAME.en}`,
          description: `Datadog Fundamentals mock exam set ${exam.setId}: answer ${n} questions one at a time and see the result and explanation right away. Free, no sign-up.`,
        };
  }

  if (path === '/updates/') {
    return ja
      ? {
          title: `更新履歴 | ${SITE_NAME.ja}`,
          description: 'Datadog Fundamentals 模擬試験（非公式）の更新履歴。GitHub で報告された問題の修正内容を新しい順に掲載しています。',
        }
      : {
          title: `Updates | ${SITE_NAME.en}`,
          description: 'Update history of the unofficial Datadog Fundamentals mock exams: fixes for problems reported on GitHub, newest first.',
        };
  }

  return null;
}

// Brazilian Portuguese. Product and feature names stay in English, as in the exam.
function pageTextPt(path) {
  const name = SITE_NAME.pt;

  if (path === '/') {
    return {
      title: 'Simulados Datadog Fundamentals | Preparação gratuita para a certificação (não oficial)',
      description: `Simulados gratuitos e não oficiais para a certificação Datadog Fundamentals: ${mockExams.length} sets de ${QUESTIONS_PER_SET} questões (${TOTAL_QUESTIONS} no total), com Quiz mode, Study mode e explicação para cada resposta. Sem cadastro.`,
    };
  }

  if (path === '/fundamentals/') {
    return {
      title: `Lista de simulados (${mockExams.length} sets) | ${name}`,
      description: `Escolha entre ${mockExams.length} sets de simulados Datadog Fundamentals, com ${QUESTIONS_PER_SET} questões cada, e comece a praticar de graça.`,
    };
  }

  const set = path.match(/^\/fundamentals\/set\/([^/]+)\/(study\/)?$/);
  const exam = set && mockExams.find((e) => e.setId === set[1]);
  if (exam) {
    const n = exam.questions.length;
    if (set[2]) {
      return {
        title: `Mock Exam Set ${exam.setId}: todas as ${n} questões com respostas e explicações | ${name}`,
        description: `Study mode do simulado Datadog Fundamentals set ${exam.setId}: todas as ${n} questões em uma única página, cada uma com a resposta correta e uma explicação.`,
      };
    }
    return {
      title: `Mock Exam Set ${exam.setId} (${n} questões) | ${name}`,
      description: `Simulado Datadog Fundamentals set ${exam.setId}: responda ${n} questões uma por vez e veja o resultado e a explicação na hora. Grátis e sem cadastro.`,
    };
  }

  if (path === '/updates/') {
    return {
      title: `Atualizações | ${name}`,
      description: 'Histórico de atualizações dos simulados não oficiais Datadog Fundamentals: correções de problemas reportados no GitHub, das mais recentes para as mais antigas.',
    };
  }

  return null;
}

// pathname: app path, e.g. '/ja/fundamentals/set/1/'
export function getPageMeta(pathname) {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const { lang, path } = splitLang(normalized);
  const text = pageText(path, lang);

  if (!text) {
    return {
      lang,
      title: { en: `Page Not Found | ${SITE_NAME.en}`, ja: `ページが見つかりません | ${SITE_NAME.ja}`, pt: `Página não encontrada | ${SITE_NAME.pt}` }[lang],
      description: '',
      noindex: true,
    };
  }

  const meta = {
    lang,
    htmlLang: HTML_LANG[lang],
    ...text,
    canonical: absoluteUrl(normalized),
    alternates: Object.fromEntries(LANGS.map((l) => [l, absoluteUrl(localizePath(path, l))])),
    hreflangs: HTML_LANG,
  };

  if (path === '/') {
    meta.jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME[lang],
      url: meta.canonical,
      description: text.description,
      inLanguage: HTML_LANG[lang],
      ...(updates.lastUpdated ? { dateModified: updates.lastUpdated } : {}),
    };
  }
  return meta;
}

// The tags managed per page, other than <title>. Each is marked with data-seo so
// the client can replace them on navigation.
export function getHeadTags(meta) {
  const tags = [];
  const metaTag = (attrs) => tags.push({ tag: 'meta', attrs });
  const linkTag = (attrs) => tags.push({ tag: 'link', attrs });

  if (meta.noindex) {
    metaTag({ name: 'robots', content: 'noindex' });
    return tags;
  }

  const others = LANGS.filter((l) => l !== meta.lang);

  metaTag({ name: 'description', content: meta.description });
  linkTag({ rel: 'canonical', href: meta.canonical });
  for (const l of LANGS) linkTag({ rel: 'alternate', hreflang: HTML_LANG[l], href: meta.alternates[l] });
  linkTag({ rel: 'alternate', hreflang: 'x-default', href: meta.alternates.en });

  metaTag({ property: 'og:type', content: 'website' });
  metaTag({ property: 'og:site_name', content: SITE_NAME[meta.lang] });
  metaTag({ property: 'og:url', content: meta.canonical });
  metaTag({ property: 'og:title', content: meta.title });
  metaTag({ property: 'og:description', content: meta.description });
  metaTag({ property: 'og:image', content: OG_IMAGE });
  metaTag({ property: 'og:locale', content: OG_LOCALE[meta.lang] });
  for (const l of others) metaTag({ property: 'og:locale:alternate', content: OG_LOCALE[l] });

  metaTag({ name: 'twitter:card', content: 'summary_large_image' });
  metaTag({ name: 'twitter:title', content: meta.title });
  metaTag({ name: 'twitter:description', content: meta.description });
  metaTag({ name: 'twitter:image', content: OG_IMAGE });

  return tags;
}

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// HTML for the prerendered <head>.
export function renderHeadTags(meta) {
  const lines = [`<title>${escapeHtml(meta.title)}</title>`];
  for (const { tag, attrs } of getHeadTags(meta)) {
    const attrText = Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ');
    lines.push(`<${tag} data-seo ${attrText} />`);
  }
  if (meta.jsonLd) {
    // Escape "<" so the JSON can't close the script element.
    const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json" data-seo>${json}</script>`);
  }
  return lines.join('\n    ');
}
