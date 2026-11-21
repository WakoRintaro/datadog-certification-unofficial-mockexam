/* global process */
// Fetches closed GitHub issues and writes them to src/data/updates.json.
// Runs before every build (see "prebuild" in package.json). If the request
// fails, the existing file is kept so the build never breaks because of it.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const REPO = 'WakoRintaro/datadog-certification-unofficial-mockexam';
const OUT = fileURLToPath(new URL('../src/data/updates.json', import.meta.url));
const SUMMARY_MAX = 220;

// First paragraph of the "## Summary" section (or of the body), as plain text.
function summarize(body = '') {
  const text = body.replace(/\r\n/g, '\n');
  const section = text.match(/^##\s*Summary\s*\n([\s\S]*?)(?=\n#{1,6}\s|$)/im);
  const firstParagraph = (source) => source
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^[|#>-]/.test(p)) || '';
  const paragraph = (section && firstParagraph(section[1])) || firstParagraph(text);

  const plain = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= SUMMARY_MAX) return plain;
  return plain.slice(0, SUMMARY_MAX).replace(/\s+\S*$/, '') + '…';
}

async function main() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mock-exam-updates-build',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const url = `https://api.github.com/repos/${REPO}/issues?state=closed&per_page=100&sort=updated`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API responded ${res.status} ${res.statusText}`);
  const issues = await res.json();

  const items = issues
    // The issues endpoint also returns pull requests; "not planned" issues aren't updates.
    .filter((i) => !i.pull_request && i.state_reason !== 'not_planned')
    .map((i) => ({
      number: i.number,
      title: i.title,
      summary: summarize(i.body ?? ''),
      closedAt: i.closed_at,
      url: i.html_url,
    }))
    .sort((a, b) => b.closedAt.localeCompare(a.closedAt));

  const data = {
    repository: `https://github.com/${REPO}`,
    lastUpdated: items[0]?.closedAt ?? null,
    items,
  };
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`[updates] wrote ${items.length} closed issues to src/data/updates.json`);
}

main().catch((err) => {
  console.warn(`[updates] could not fetch issues, keeping existing updates.json: ${err.message}`);
});
