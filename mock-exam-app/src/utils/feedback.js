// Google Form for reporting problems without a GitHub account.
// Responses go to a spreadsheet owned by the maintainer.
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe1Ve1-Qm_NE4Uvm4o6ktuH1e-8rTnOasxKiGSPSsE-CAy-HQ/viewform';

// Field ids from the form's "Get pre-filled link".
const ENTRY_IDS = {
  setId: 'entry.739291700',
  questionId: 'entry.2064715024',
  lang: 'entry.1714217688'
};

// Returns the form URL with the set, question and language filled in.
// Call it with no arguments for a blank form.
export function buildFeedbackUrl({ setId, questionId, lang } = {}) {
  const params = new URLSearchParams({ usp: 'pp_url' });
  if (setId) params.set(ENTRY_IDS.setId, setId);
  if (questionId) params.set(ENTRY_IDS.questionId, questionId);
  if (lang) params.set(ENTRY_IDS.lang, lang);
  return `${FEEDBACK_FORM_URL}?${params}`;
}
