// Renders the small subset of Markdown used in the exam data:
// `code`, **strong** and *emphasis* (both shown in bold).
// Everything else is plain text, so placeholders like <hostname> stay visible.
const CODE = /(`[^`]+`)/;
const EMPHASIS = /\*\*([^*]+?)\*\*|\*([^*\s](?:[^*]*?[^*\s])?)\*/g;

function renderEmphasis(text, keyPrefix) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(EMPHASIS)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<strong key={`${keyPrefix}-${m.index}`} className="emphasis">{m[1] ?? m[2]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function InlineMarkdown({ text }) {
  return String(text ?? '')
    .split(CODE)
    .flatMap((segment, i) =>
      segment.startsWith('`') && segment.endsWith('`') && segment.length > 1
        ? [<code key={i}>{segment.slice(1, -1)}</code>]
        : renderEmphasis(segment, i)
    );
}
