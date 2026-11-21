// Vite plugin that makes the update history visible to search engines:
// - emits a static, JavaScript-free page at /updates/
// - emits sitemap.xml with <lastmod> taken from the latest closed issue
// - adds dateModified to the WebSite JSON-LD in index.html
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = 'https://wakorintaro.github.io/datadog-certification-unofficial-mockexam/';
const GA_ID = 'G-N7JDZLWZ18';
const DATA = fileURLToPath(new URL('../src/data/updates.json', import.meta.url));

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const toDay = (iso) => (iso ? iso.slice(0, 10) : new Date().toISOString().slice(0, 10));

const formatJa = (iso) => new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
}).format(new Date(iso));

function loadUpdates() {
  return JSON.parse(readFileSync(DATA, 'utf8'));
}

function renderUpdatesPage(data) {
  const items = data.items.map((item) => `
      <li class="update">
        <p class="update__meta"><time datetime="${item.closedAt}">${formatJa(item.closedAt)}</time><span class="chip">修正済み Fixed</span></p>
        <h2 class="update__title" lang="en"><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a> <span class="update__num">#${item.number}</span></h2>
        ${item.summary ? `<p class="update__summary" lang="en">${escapeHtml(item.summary)}</p>` : ''}
      </li>`).join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '更新履歴 | Datadog Fundamentals Mock Exams',
    url: `${SITE}updates/`,
    dateModified: data.lastUpdated,
    isPartOf: { '@type': 'WebSite', name: 'Datadog Fundamentals Certification Mock Exams', url: SITE },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: data.items.map((item, i) => ({
        '@type': 'ListItem', position: i + 1, name: item.title, url: item.url,
      })),
    },
  };

  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>更新履歴 (Updates) | Datadog Fundamentals 模擬試験</title>
<meta name="description" content="Datadog Fundamentals 模擬試験（非公式）の更新履歴。GitHub Issue で報告された問題の修正内容を新しい順に掲載しています。">
<link rel="canonical" href="${SITE}updates/">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans JP',sans-serif;color:#333;background:#fff;font-size:1rem;line-height:1.7;letter-spacing:.02em}
a{color:#00118f;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
a:visited{color:#8b008b}
a:hover{color:#0017c1;text-decoration-thickness:3px}
a:focus-visible{outline:4px solid #000;outline-offset:2px;background:#ffd43d;box-shadow:0 0 0 2px #ffd43d;border-radius:4px}
.wrap{max-width:52rem;margin:0 auto;padding:0 1rem}
@media (min-width:768px){.wrap{padding:0 2rem}}
header{border-bottom:1px solid #949494}
header .wrap{display:flex;align-items:center;min-height:4rem}
.site-name{font-weight:700;font-size:1.125rem;color:#1a1a1a;text-decoration:none}
.site-name:visited{color:#1a1a1a}
main{padding:2.5rem 0 4rem}
.breadcrumb{margin-bottom:1.5rem;font-size:1rem}
h1{font-size:2rem;line-height:1.5;letter-spacing:.01em;color:#1a1a1a;margin-bottom:1rem}
.lead{margin-bottom:2rem}
.updates{list-style:none;border-top:1px solid #949494}
.update{padding:1.5rem 0;border-bottom:1px solid #949494}
.update__meta{display:flex;align-items:center;gap:.75rem;margin-bottom:.25rem;color:#4d4d4d}
.chip{display:inline-flex;align-items:center;min-height:1.75rem;padding:0 .5rem;border:1px solid #197a4b;border-radius:.375rem;background:#e6f5ec;color:#115a36;font-size:.875rem;line-height:1}
.update__title{font-size:1.25rem;line-height:1.5;margin-bottom:.5rem}
.update__num{color:#4d4d4d;font-weight:400}
.cta{margin-top:2.5rem}
footer{border-top:1px solid #949494;background:#f2f2f2;padding:2rem 0;font-size:.875rem}
</style>
</head>
<body>
<header><div class="wrap"><a class="site-name" href="../">Datadog Fundamentals 模擬試験</a></div></header>
<main>
  <div class="wrap">
    <nav class="breadcrumb" aria-label="パンくずリスト"><a href="../">ホーム</a> ＞ 更新履歴</nav>
    <h1>更新履歴 <span lang="en">(Updates)</span></h1>
    <p class="lead">GitHub Issue で報告いただいた問題の修正を、新しい順に掲載しています。最終更新日：<time datetime="${data.lastUpdated ?? ''}">${data.lastUpdated ? formatJa(data.lastUpdated) : '—'}</time></p>
    <ol class="updates">${items}
    </ol>
    <p class="cta"><a href="../#/fundamentals">模擬試験の一覧へ</a> ・ <a href="${escapeHtml(data.repository)}/issues">GitHub で問題を報告する</a></p>
  </div>
</main>
<footer><div class="wrap">Datadog Fundamentals 認定試験の非公式模擬試験です。Datadog, Inc. とは関係ありません。</div></footer>
</body>
</html>
`;
}

function renderSitemap(data) {
  const lastmod = toDay(data.lastUpdated);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}updates/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`;
}

export default function seoUpdatesPlugin() {
  return {
    name: 'seo-updates',
    transformIndexHtml(html) {
      const { lastUpdated } = loadUpdates();
      if (!lastUpdated) return html;
      return html.replace('"inLanguage": ["en", "ja"]', `"inLanguage": ["en", "ja"],\n        "dateModified": "${lastUpdated}"`);
    },
    generateBundle() {
      const data = loadUpdates();
      this.emitFile({ type: 'asset', fileName: 'updates/index.html', source: renderUpdatesPage(data) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap(data) });
    },
  };
}
