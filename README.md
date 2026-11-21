# Datadog Fundamentals 模擬試験（非公式）

Datadog Fundamentals 認定試験の練習問題サイトです。7セット × 90問を、クイズモードと学習モードで解けます。

- 公開URL: https://wakorintaro.github.io/datadog-certification-unofficial-mockexam/
- 更新履歴: https://wakorintaro.github.io/datadog-certification-unofficial-mockexam/updates/

Datadog, Inc. とは関係のない非公式サイトです。

## 構成

アプリ本体は `mock-exam-app/` にあります。React + Vite のシングルページアプリで、GitHub Pages で公開しています。

| パス | 内容 |
|---|---|
| `mock-exam-app/src/data/mockExams.json` | 問題データ（英語・日本語）。問題の修正はこのファイルを直接編集します |
| `mock-exam-app/src/data/updates.json` | 更新履歴のデータ。ビルド時に自動生成されます（手で編集しない） |
| `mock-exam-app/src/pages/` | 画面（トップ、試験一覧、解答画面、更新履歴） |
| `mock-exam-app/src/index.css` | スタイル。デジタル庁デザインシステムのトークンを使っています |
| `mock-exam-app/scripts/fetch-updates.js` | クローズ済み Issue を取得して `updates.json` を書き出すスクリプト |
| `mock-exam-app/scripts/seo-updates-plugin.js` | ビルド時に `/updates/` の静的ページと `sitemap.xml` を書き出す Vite プラグイン |
| `.github/workflows/deploy.yml` | 自動デプロイのワークフロー |

`mock-exam-app/build-data.js` と `mock-exam-app/translate.js` は、最初に Markdown から問題データを作ったときのスクリプトです。元の Markdown はリポジトリに含まれていないため、今は使いません。

## ローカルで動かす

Node.js 20 以上が必要です。

```sh
cd mock-exam-app
npm install
npm run dev        # 開発サーバー（http://localhost:5173/datadog-certification-unofficial-mockexam/）
```

本番と同じ内容で確認する場合は、ビルドしてからプレビューします。`/updates/` の静的ページとサイトマップはビルドしたときだけ作られます。

```sh
npm run build      # Issue の取得（prebuild）→ ビルド。結果は dist/ に出力
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
