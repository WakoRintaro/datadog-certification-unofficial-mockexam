import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '..');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'mockExams.json');

function parseQuestions(content) {
  const questions = [];
  // Split by double newline, filter out blocks that don't start with a number
  const questionBlocks = content.split('\n\n').filter(b => /^\s*\d+\./.test(b));
  
  for (const block of questionBlocks) {
    const lines = block.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    // Parse Q ID and text
    const qMatch = lines[0].match(/^\s*(\d+)\.\s+(.*)/);
    if (!qMatch) continue;
    const id = parseInt(qMatch[1]);
    let text = qMatch[2];
    
    let lineIdx = 1;
    // Continue matching text until we hit an option like "A.", "B.", or "  A."
    while (lineIdx < lines.length && !/^\s*[A-Z]\./.test(lines[lineIdx])) {
        text += '\n' + lines[lineIdx].trim();
        lineIdx++;
    }

    const options = [];
    while (lineIdx < lines.length) {
      if (/^\s*[A-Z]\./.test(lines[lineIdx])) {
        const oMatch = lines[lineIdx].match(/^\s*([A-Z])\.\s+(.*)/);
        if (oMatch) {
            options.push({ id: oMatch[1], text: oMatch[2] });
        }
      }
      lineIdx++;
    }

    questions.push({ id, text, options });
  }
  return questions;
}

function parseAnswers(content) {
  const answers = {};
  const lines = content.split('\n');
  
  let currentId = null;
  let currentAnswer = null;
  let currentExplanation = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const qMatch = line.match(/^(\d+)\.\s+\*\*Answer:\s+([A-Z]+)\*\*/);
    
    if (qMatch) {
      // Save previous if exists
      if (currentId) {
        answers[currentId] = { answer: currentAnswer, explanation: currentExplanation.trim() };
      }
      currentId = parseInt(qMatch[1]);
      currentAnswer = qMatch[2];
      currentExplanation = '';
    } else if (currentId && line.startsWith('**Explanation:**')) {
      currentExplanation = line.replace('**Explanation:**', '').trim();
    } else if (currentId && !line.startsWith('>') && !line.startsWith('---') && !line.startsWith('#')) {
      currentExplanation += '\n' + line;
    }
  }
  
  if (currentId) {
    answers[currentId] = { answer: currentAnswer, explanation: currentExplanation.trim() };
  }
  
  return answers;
}

function build() {
    const exams = [];
    
    for (let i = 1; i <= 9; i++) {
        const qFile = path.join(DATA_DIR, `mock_exam_set${i}_questions.md`);
        const aFile = path.join(DATA_DIR, `mock_exam_set${i}_answers.md`);
        
        if (!fs.existsSync(qFile) || !fs.existsSync(aFile)) {
            console.log(`Skipping Set ${i} - Files not found`);
            continue;
        }
        
        const qContent = fs.readFileSync(qFile, 'utf-8');
        const aContent = fs.readFileSync(aFile, 'utf-8');
        
        const parsedQ = parseQuestions(qContent);
        const parsedA = parseAnswers(aContent);
        
        const finalQuestions = parsedQ.map(q => {
            const ansContext = parsedA[q.id] || { answer: 'A', explanation: 'No explanation found.' };
            return {
                id: String(q.id),
                question: {
                    en: q.text,
                    ja: "[JA] " + q.text
                },
                options: q.options.map(o => ({
                    id: o.id,
                    text: { en: o.text, ja: "[JA] " + o.text },
                    isCorrect: o.id === ansContext.answer
                })),
                explanation: {
                    en: ansContext.explanation,
                    ja: "[JA] " + ansContext.explanation
                }
            };
        });
        
        exams.push({
            setId: String(i),
            title: `Datadog Fundamentals Mock Exam - Set ${i}`,
            totalQuestions: finalQuestions.length,
            questions: finalQuestions
        });
    }
    
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exams, null, 2), 'utf-8');
    console.log(`Successfully built ${OUTPUT_FILE} with ${exams.length} sets.`);
}

build();
