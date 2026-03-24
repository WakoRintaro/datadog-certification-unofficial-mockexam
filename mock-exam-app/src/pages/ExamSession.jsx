import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage, getSavedProgress, saveProgress } from '../utils/context';
import mockExams from '../data/mockExams.json';
import { ChevronLeft, Check, X, ArrowRight, ArrowLeft, RefreshCw, Layers, Award } from 'lucide-react';

export default function ExamSession() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const exam = useMemo(() => mockExams.find(e => e.setId === String(setId)), [setId]);
  
  if (!exam) {
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h1 className="page-title">Exam Not Found</h1>
            <Link to="/fundamentals" className="btn btn-primary mt-4">Back to Exams</Link>
        </div>
    );
  }

  const t = {
    en: { 
      back: "Back", study: "Study Mode", quiz: "Quiz Mode", q: "Question", next: "Next", prev: "Previous", 
      exp: "Explanation", correct: "Correct", incorrect: "Incorrect", finish: "Finish Exam", reset: "Reset Progress",
      results: "Exam Results", score: "Your Score", pct: "Score percentage", reviewStudy: "Review in Study Mode", restart: "Restart Exam"
    },
    ja: { 
      back: "戻る", study: "学習モード", quiz: "クイズモード", q: "問題", next: "次へ", prev: "前へ", 
      exp: "解説", correct: "正解！", incorrect: "不正解", finish: "試験を完了する", reset: "進捗をリセット",
      results: "試験結果", score: "スコア", pct: "正解率", reviewStudy: "学習モードで全問見直す", restart: "もう一度挑戦する"
    }
  }[lang];

  const [mode, setMode] = useState('quiz'); // 'quiz' | 'study'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: { selectedId: string, isCorrect: boolean } }
  const [completed, setCompleted] = useState(false);
  
  const correctCount = useMemo(() => {
    return Object.values(answers).filter(a => a.isCorrect).length;
  }, [answers]);

  // Load progress
  useEffect(() => {
    const saved = getSavedProgress(setId);
    if (saved.answers) {
      setAnswers(saved.answers);
      // Auto-advance to first unanswered question in quiz mode
      if (mode === 'quiz' && Object.keys(saved.answers).length > 0) {
          const firstUnanswered = exam.questions.findIndex(q => !saved.answers[q.id]);
          if (firstUnanswered !== -1) setCurrentQIndex(firstUnanswered);
      }
    }
    setCompleted(!!saved.completed);
  }, [setId, exam, mode]);

  const handleSelectOption = (qId, optionId, isCorrect) => {
    if (answers[qId]) return; // Already answered
    
    const newAnswers = { ...answers, [qId]: { selectedId: optionId, isCorrect } };
    setAnswers(newAnswers);
    
    const isNowComplete = Object.keys(newAnswers).length === exam.questions.length;
    if (isNowComplete) setCompleted(true);

    saveProgress(setId, { answers: newAnswers, completed: isNowComplete });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your progress for this exam?")) {
        setAnswers({});
        setCompleted(false);
        setCurrentQIndex(0);
        saveProgress(setId, { answers: {}, completed: false });
    }
  };

  const renderQuestion = (q, index, isStudyMode) => {
    const hasAnswered = !!answers[q.id];
    const userAnswer = answers[q.id];

    return (
      <div key={q.id} className="card" style={{ marginBottom: isStudyMode ? '2rem' : 0 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
          {t.q} {index + 1}
        </h3>
        
        <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
            {q.question[lang]}
        </div>

        <div className="flex flex-col gap-2">
          {q.options.map(opt => {
            let stateClass = "";
            if (hasAnswered) {
                if (opt.isCorrect) stateClass = "correct";
                else if (userAnswer.selectedId === opt.id) stateClass = "incorrect";
            }

            return (
              <button
                key={opt.id}
                className={`option-btn ${stateClass}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(q.id, opt.id, opt.isCorrect)}
              >
                <span className="option-label">{opt.id}</span>
                <span style={{flex: 1}}>{opt.text[lang]}</span>
                {stateClass === 'correct' && <Check size={20} />}
                {stateClass === 'incorrect' && <X size={20} />}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--color-bg)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
             <h4 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: userAnswer.isCorrect ? 'var(--color-success)' : 'var(--color-error)' }}>
                {userAnswer.isCorrect ? <Check size={20} /> : <X size={20} />}
                {userAnswer.isCorrect ? t.correct : t.incorrect}
             </h4>
             <div style={{ fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{t.exp}:</div>
             <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: q.explanation[lang] }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Link to="/fundamentals" className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                <ChevronLeft size={20} /> {t.back}
            </Link>
            
            <div className="flex items-center gap-4">
                <button onClick={handleReset} className="flex items-center gap-2" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <RefreshCw size={16} /> {t.reset}
                </button>
                <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', padding: '4px', borderRadius: '8px' }}>
                    <button 
                        className="btn" 
                        style={{ padding: '0.4rem 1rem', border: 'none', backgroundColor: mode === 'quiz' ? 'var(--color-surface)' : 'transparent', color: mode === 'quiz' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: mode === 'quiz' ? 'var(--box-shadow)' : 'none' }}
                        onClick={() => setMode('quiz')}
                    >
                        {t.quiz}
                    </button>
                    <button 
                        className="btn" 
                        style={{ padding: '0.4rem 1rem', border: 'none', backgroundColor: mode === 'study' ? 'var(--color-surface)' : 'transparent', color: mode === 'study' ? 'var(--color-primary)' : 'var(--color-text-muted)', boxShadow: mode === 'study' ? 'var(--box-shadow)' : 'none' }}
                        onClick={() => setMode('study')}
                    >
                        <Layers size={16} style={{marginRight: '0.25rem'}} /> {t.study}
                    </button>
                </div>
            </div>
        </div>

        <h1 className="page-title">{exam.title}</h1>

        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: 'var(--color-text-muted)' }}>
                {Object.keys(answers).length} / {exam.questions.length} answered
            </div>
            {completed && (
                <div style={{ color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} /> {t.finish}
                </div>
            )}
        </div>

        {/* Results Summary Card */}
        {completed && mode === 'quiz' && (
            <div className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-success)', backgroundColor: 'var(--color-success-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Award size={28} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t.results}</h2>
                        <div style={{ color: 'var(--color-success)', fontWeight: 600 }}>{t.finish}</div>
                    </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{t.score}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{correctCount} / {exam.questions.length}</div>
                    </div>
                    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{t.pct}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{Math.round(correctCount / exam.questions.length * 100)}%</div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        className="btn btn-primary" 
                        style={{ flex: 1 }}
                        onClick={() => setMode('study')}
                    >
                        <Layers size={18} /> {t.reviewStudy}
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={handleReset}
                    >
                        <RefreshCw size={18} /> {t.restart}
                    </button>
                </div>
            </div>
        )}

        {/* Content */}
        {mode === 'study' ? (
            <div>
                {exam.questions.map((q, i) => renderQuestion(q, i, true))}
            </div>
        ) : (
            <div>
                {/* Quiz Mode Pagination Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                    {exam.questions.map((q, i) => {
                        const isAns = !!answers[q.id];
                        let bg = 'var(--color-bg)';
                        let col = 'var(--color-text-muted)';
                        if (currentQIndex === i) {
                            bg = 'var(--color-primary)'; col = '#fff';
                        } else if (isAns) {
                            bg = answers[q.id].isCorrect ? 'var(--color-success-light)' : 'var(--color-error-light)';
                            col = answers[q.id].isCorrect ? 'var(--color-success)' : 'var(--color-error)';
                        }
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentQIndex(i)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '4px', border: 'none',
                                    backgroundColor: bg, color: col, fontWeight: 600, cursor: 'pointer',
                                    boxShadow: currentQIndex === i ? '0 0 0 2px var(--color-primary-light)' : 'none'
                                }}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>

                {renderQuestion(exam.questions[currentQIndex], currentQIndex, false)}
                
                <div className="flex items-center justify-between mt-8">
                    <button 
                       className="btn btn-secondary" 
                       onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                       disabled={currentQIndex === 0}
                    >
                        <ArrowLeft size={20} /> {t.prev}
                    </button>
                    <button 
                       className="btn btn-primary" 
                       onClick={() => setCurrentQIndex(Math.min(exam.questions.length - 1, currentQIndex + 1))}
                       disabled={currentQIndex === exam.questions.length - 1}
                    >
                        {t.next} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
