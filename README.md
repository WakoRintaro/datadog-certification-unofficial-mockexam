# Datadog Fundamentals 模擬試験（非公式）

Datadog Fundamentals 認定試験の練習問題サイトです。7セット × 90問を、クイズモードと学習モードで解けます。

- 公開URL: https://wakorintaro.github.io/datadog-certification-unofficial-mockexam/
- 更新履歴: https://wakorintaro.github.io/datadog-certification-unofficial-mockexam/updates/

Datadog, Inc. とは関係のない非公式サイトです。

## 構成

アプリ本体は `mock-exam-app/` にあります。React + Vite のアプリで、GitHub Pages で公開しています。検索エンジンが中身を読めるように、ビルド時に全ページの HTML を書き出しています（プリレンダリング）。ブラウザでは、その HTML の上で React が動きます。

| パス | 内容 |
|---|---|
| `mock-exam-app/src/data/mockExams.json` | 問題データ（英語・日本語・ブラジルポルトガル語）。問題の修正はこのファイルを直接編集します |
| `mock-exam-app/src/data/updates.json` | 更新履歴のデータ。ビルド時に自動生成されます（手で編集しない） |
| `mock-exam-app/src/pages/` | 画面（トップ、試験一覧、解答画面、更新履歴） |
| `mock-exam-app/src/index.css` | スタイル。デジタル庁デザインシステムのトークンを使っています |
| `mock-exam-app/scripts/fetch-updates.js` | クローズ済み Issue を取得して `updates.json` を書き出すスクリプト |
| `mock-exam-app/src/seo/meta.js` | ページごとの title、description、canonical、hreflang、OGP。ページを増やしたときはここにも追加します |
| `mock-exam-app/src/entry-server.jsx` | プリレンダリング用の入口（ビルド時だけ使う） |
| `mock-exam-app/scripts/prerender.js` | ビルド後に全ページの HTML、`404.html`、`sitemap.xml` を `dist/` に書き出すスクリプト |
| `.github/workflows/deploy.yml` | 自動デプロイのワークフロー |

`mock-exam-app/build-data.js` と `mock-exam-app/translate.js` は、最初に Markdown から問題データを作ったときのスクリプトです。元の Markdown はリポジトリに含まれていないため、今は使いません。

### URL

英語のページはルート、日本語のページは `/ja/`、ブラジルポルトガル語のページは `/pt/` の下にあります。

| ページ | 英語 | 日本語 | ポルトガル語（ブラジル） |
|---|---|---|---|
| ホーム | `/` | `/ja/` | `/pt/` |
| 試験一覧 | `/fundamentals/` | `/ja/fundamentals/` | `/pt/fundamentals/` |
| クイズモード | `/fundamentals/set/1/` | `/ja/fundamentals/set/1/` | `/pt/fundamentals/set/1/` |
| 学習モード（全問の正解と解説を折りたたみで掲載） | `/fundamentals/set/1/study/` | `/ja/fundamentals/set/1/study/` | `/pt/fundamentals/set/1/study/` |
| 更新履歴 | `/updates/` | `/ja/updates/` | `/pt/updates/` |

- ヘッダーの言語切替は、ほかの言語の同じページへのリンクです。選んだ言語はブラウザに保存されます。
- 言語を選んだことがなく、ブラウザが日本語またはポルトガル語の人が英語のページを開くと、その言語のページに移動します。
- ポルトガル語版でも、Datadog の製品名・機能名・コマンドは公式試験と同じ体験になるよう英語のままにしています（日本語版と同じ方針）。
- 以前の `#/fundamentals/set/1` 形式の URL は、新しい URL に自動で転送されます。

## ローカルで動かす

Node.js 20 以上が必要です。

```sh
cd mock-exam-app
npm install
npm run dev        # 開発サーバー（http://localhost:5173/datadog-certification-unofficial-mockexam/）
```

本番と同じ内容で確認する場合は、ビルドしてからプレビューします。各ページの HTML、`404.html`、サイトマップはビルドしたときだけ作られます。開発サーバーでは、ページの中身はブラウザで描画されます。

```sh
npm run build      # Issue の取得（prebuild）→ ビルド → プリレンダリング。結果は dist/ に出力
npx vite preview   # http://localhost:4173/datadog-certification-unofficial-mockexam/
```

## デプロイ

**手動の作業はありません。** GitHub Actions（`.github/workflows/deploy.yml`）がビルドして `gh-pages` ブランチに公開し、GitHub Pages がそのブランチを配信します。

ワークフローが動くタイミング:

- `main` ブランチへの push（プルリクエストのマージを含む）
- Issue のクローズ・再オープン・編集
- Actions タブからの手動実行（Deploy to GitHub Pages → Run workflow）

公開されない場合は、Actions タブでワークフローの実行結果を確認してください。失敗していたら、同じタブから手動で実行し直してください。`npm run deploy`（gh-pages パッケージによる手動公開）も残っていますが、通常は使いません。

## 問題を修正する流れ

1. 誤りの報告や改善案を Issue に書きます。
2. ブランチを切って `mock-exam-app/src/data/mockExams.json` を修正し、プルリクエストを `main` に出します。
3. マージすると自動でデプロイされます。
4. Issue をクローズすると、その Issue が数分後にサイトの「更新履歴」に載ります。

### フォームからの報告

GitHub アカウントがなくても報告できるように、Google フォームも用意しています。

- 解説の下にある「この問題の正解・解説について報告する」リンクを押すと、セット番号・問題番号・表示言語が入力された状態でフォームが開きます。サイトのフッターからも開けます。
- 回答は、管理者の Google ドライブにあるスプレッドシート「Datadog 模擬試験 問題の報告（回答）」に記録され、届くたびに通知メールが送られます。
- 修正するときは、報告の内容を Issue に書き写してから、上の流れで直します。Issue にしないと「更新履歴」に載りません。
- フォームの URL と項目 ID は `mock-exam-app/src/utils/feedback.js` にあります。フォームの項目を作り直したときは、「事前入力した URL を取得」で新しい ID を確認して書き換えてください。

## 更新履歴の仕組み

- サイトの「最近の更新」と「更新履歴」には、**クローズ済みの Issue** がクローズ日の新しい順に表示されます。
  - プルリクエストと、「Close as not planned」で閉じた Issue は表示されません。
- 表示されるのは Issue のタイトルと、本文の `## Summary` の最初の段落（なければ本文の最初の段落）です。
  - Issue を書くときは、最初の段落に何を直したかを短くまとめてください。
  - Issue を英語で書くと、サイトでも英語のまま表示されます。
- 載せたくない Issue は、「Close as not planned」で閉じてください。
- Issue の取得に失敗した場合は、前回の `updates.json` を使ってビルドを続けます。

## デザイン

[デジタル庁デザインシステム](https://design.digital.go.jp/dads/) に沿っています。

- 色・文字サイズ・角丸・影は、公式トークン（npm パッケージ `@digital-go-jp/design-tokens`）の CSS 変数を使います。新しい色や値を直接書かないでください。
- ボタン、リンク、フォーカス枠は、デジタル庁の[見本コンポーネント](https://github.com/digital-go-jp/design-system-example-components-html)に合わせています。
