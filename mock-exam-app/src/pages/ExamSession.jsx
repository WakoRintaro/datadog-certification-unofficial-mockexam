import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import { useSavedProgress, saveProgress } from '../utils/progress';
import mockExams from '../data/mockExams.json';
import { Check, X, ArrowRight, ArrowLeft, RefreshCw, Layers, Award, ChevronDown, ExternalLink } from 'lucide-react';
import { buildFeedbackUrl } from '../utils/feedback';
import { trackEvent } from '../utils/analytics';
import Breadcrumb from '../components/Breadcrumb';
import NotFound from './NotFound';

// mode comes from the URL: /fundamentals/set/:setId/ is quiz mode, .../study/ is study mode.
export default function ExamSessionRoute({ mode }) {
  const { setId } = useParams();
  const exam = mockExams.find(e => e.setId === String(setId));
  if (!exam) return <NotFound />;
  // A fresh session per set and mode, so the current question starts over.
  return <ExamSession key={`${setId}-${mode}`} exam={exam} mode={mode} />;
}

function ExamSession({ exam, mode }) {
  const { setId } = exam;
  const { lang, localize } = useLanguage();
  const { answers, completed } = useSavedProgress(setId);

  // The question grid is long, so it starts collapsed.
  const [navOpen, setNavOpen] = useState(false);
  // null until the visitor moves: quiz mode then opens at the first unanswered question.
  const [chosenQIndex, setChosenQIndex] = useState(null);

  const correctCount = useMemo(() => {
    return Object.values(answers).filter(a => a.isCorrect).length;
  }, [answers]);

  const t = {
    en: {
      study: "Study Mode", quiz: "Quiz Mode", q: "Question", next: "Next", prev: "Previous",
      exp: "Explanation", correct: "Correct", incorrect: "Incorrect", finish: "Completed", reset: "Reset Progress",
      home: "Home", exams: "Exams", answered: "answered", modeLabel: "Display mode", navLabel: "Questions",
      correctAnswer: "Correct answer", yourAnswer: "Your answer", showAnswer: "Show the answer and explanation",
      reportQuestion: "Report a problem with this answer or explanation", opensForm: "(opens a Google Form)",
      confirmReset: "Are you sure you want to reset your progress for this exam?",
      results: "Exam Results", score: "Your Score", pct: "Score percentage", reviewStudy: "Review in Study Mode", restart: "Restart Exam"
    },
    ja: {
      study: "学習モード", quiz: "クイズモード", q: "問題", next: "次へ", prev: "前へ",
      exp: "解説", correct: "正解", incorrect: "不正解", finish: "完了", reset: "進捗をリセット",
      home: "ホーム", exams: "模擬試験一覧", answered: "問解答済み", modeLabel: "表示モード", navLabel: "問題一覧",
      correctAnswer: "正解", yourAnswer: "あなたの解答", showAnswer: "正解と解説を見る",
      reportQuestion: "この問題の正解・解説について報告する", opensForm: "（Google フォームが開きます）",
      confirmReset: "この試験の進捗をリセットしてもよろしいですか？",
      results: "試験結果", score: "スコア", pct: "正解率", reviewStudy: "学習モードで全問見直す", restart: "もう一度挑戦する"
    }
  }[lang];

  const total = exam.questions.length;
  const answeredCount = Object.keys(answers).length;
  const firstUnanswered = exam.questions.findIndex(q => !answers[q.id]);
  const currentQIndex = chosenQIndex ?? (mode === 'quiz' && firstUnanswered > 0 ? firstUnanswered : 0);

  const handleSelectOption = (qId, optionId, isCorrect) => {
    if (answers[qId]) return; // Already answered

    // Stay on this question to show its explanation.
    if (chosenQIndex === null) setChosenQIndex(currentQIndex);

    const newAnswers = { ...answers, [qId]: { selectedId: optionId, isCorrect } };

    trackEvent('answer_question', {
      exam_set_id: setId,
      question_id: qId,
      question_index: currentQIndex,
      is_correct: isCorrect,
      mode
    });

    const isNowComplete = Object.keys(newAnswers).length === total;
    if (isNowComplete) {
      const score = Object.values(newAnswers).filter(a => a.isCorrect).length;
      trackEvent('exam_complete', {
        exam_set_id: setId,
        exam_title: exam.title,
        score,
        total_questions: total,
        score_percent: Math.round(score / total * 100)
      });
    }

    saveProgress(setId, { answers: newAnswers, completed: isNowComplete });
  };

  const handleReset = () => {
    if (window.confirm(t.confirmReset)) {
        trackEvent('exam_reset', {
          exam_set_id: setId,
          questions_answered_before_reset: answeredCount
        });
        setChosenQIndex(0);
        saveProgress(setId, { answers: {}, completed: false });
    }
  };

  const quizPath = localize(`/fundamentals/set/${setId}/`);
  const studyPath = localize(`/fundamentals/set/${setId}/study/`);
  const trackModeChange = (toMode) => {
    if (toMode !== mode) trackEvent('mode_change', { exam_set_id: setId, from_mode: mode, to_mode: toMode });
  };

  const handleQuestionNavigate = (direction, toIndex) => {
    trackEvent('question_navigate', {
      exam_set_id: setId,
      direction,
      from_index: currentQIndex,
      to_index: toIndex
    });
    setChosenQIndex(toIndex);
    // On phones, close the grid after jumping so the question is right below.
    if (direction === 'jump' && !window.matchMedia('(min-width: 768px)').matches) setNavOpen(false);
  };

  const renderReportLink = (q) => (
    <p className="explanation__report">
      <a
        href={buildFeedbackUrl({ setId, questionId: q.id, lang })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('feedback_click', { exam_set_id: setId, question_id: q.id, lang })}
      >
        {t.reportQuestion}
        <ExternalLink size={16} className="link-icon" aria-label={t.opensForm} />
      </a>
    </p>
  );

  const renderQuestion = (q, index) => {
    const hasAnswered = !!answers[q.id];
    const userAnswer = answers[q.id];

    return (
      <article key={q.id} className="question" aria-labelledby={`q-${q.id}`}>
        <h2 id={`q-${q.id}`} className="question__number">
          {t.q} {index + 1}
        </h2>

        <div className="question__text">
            {q.question[lang]}
        </div>

        <div className="options">
          {q.options.map(opt => {
            let stateClass = "";
            if (hasAnswered) {
                if (opt.isCorrect) stateClass = "is-correct";
                else if (userAnswer.selectedId === opt.id) stateClass = "is-incorrect";
            }
            const isSelected = hasAnswered && userAnswer.selectedId === opt.id;

            return (
              <button
                type="button"
                key={opt.id}
                className={`option ${stateClass}`}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(q.id, opt.id, opt.isCorrect)}
              >
                <span className="option__label">{opt.id}</span>
                <span className="option__text">{opt.text[lang]}</span>
                {(stateClass || isSelected) && (
                  <span className="option__status">
                    {stateClass === 'is-correct' && <Check size={18} aria-hidden="true" />}
                    {stateClass === 'is-incorrect' && <X size={18} aria-hidden="true" />}
                    {[opt.isCorrect && t.correctAnswer, isSelected && t.yourAnswer].filter(Boolean).join(' / ')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={`notice explanation ${userAnswer.isCorrect ? 'notice--success' : 'notice--error'}`}>
             <p className="notice__title">
                {userAnswer.isCorrect ? <Check size={20} aria-hidden="true" /> : <X size={20} aria-hidden="true" />}
                {userAnswer.isCorrect ? t.correct : t.incorrect}
             </p>
             <p className="explanation__heading">{t.exp}</p>
             <div className="explanation__body" dangerouslySetInnerHTML={{ __html: q.explanation[lang] }} />
             {renderReportLink(q)}
          </div>
        )}

        {/* Study mode: the answer is in the page (and in the prerendered HTML) but folded away
            until the reader asks for it, so it doesn't give the answer away. */}
        {!hasAnswered && mode === 'study' && (
          <details className="answer-reveal">
            <summary className="answer-reveal__summary">
              <ChevronDown size={20} className="answer-reveal__icon" aria-hidden="true" />
              {t.showAnswer}
            </summary>
            <div className="answer-reveal__body">
              <p className="explanation__heading">{t.correctAnswer}</p>
              {q.options.filter(opt => opt.isCorrect).map(opt => (
                <p key={opt.id}>{opt.id}. {opt.text[lang]}</p>
              ))}
              <p className="explanation__heading">{t.exp}</p>
              <div className="explanation__body" dangerouslySetInnerHTML={{ __html: q.explanation[lang] }} />
              {renderReportLink(q)}
            </div>
          </details>
        )}
      </article>
    );
  };

  return (
    <div className="container container--narrow">
        <Breadcrumb items={[{ label: t.home, to: '/' }, { label: t.exams, to: '/fundamentals/' }, { label: exam.title }]} />

        <header className="page-header">
            <h1 className="heading-1">{exam.title}</h1>
        </header>

        {/* Toolbar */}
        <div className="toolbar">
            <nav className="segmented" aria-label={t.modeLabel}>
                <Link to={quizPath} className="segmented__button" aria-current={mode === 'quiz' ? 'page' : undefined} onClick={() => trackModeChange('quiz')}>
                    {t.quiz}
                </Link>
                <Link to={studyPath} className="segmented__button" aria-current={mode === 'study' ? 'page' : undefined} onClick={() => trackModeChange('study')}>
                    <Layers size={18} aria-hidden="true" /> {t.study}
                </Link>
            </nav>
            <button type="button" onClick={handleReset} className="button button--sm button--tertiary">
                <RefreshCw size={16} aria-hidden="true" /> {t.reset}
            </button>
        </div>

        <div className="progress-summary">
            <p className="text-description">
                {lang === 'ja' ? `${total}問中 ${answeredCount}${t.answered}` : `${answeredCount} / ${total} ${t.answered}`}
            </p>
            {completed && (
                <span className="chip chip--success">
                    <Award size={16} aria-hidden="true" /> {t.finish}
                </span>
            )}
        </div>
        <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answeredCount} aria-label={t.answered}>
            <div className="progress-bar__value" style={{ width: `${answeredCount / total * 100}%` }} />
        </div>

        {/* Results Summary */}
        {completed && mode === 'quiz' && (
            <section className="results" aria-labelledby="results-title">
                <h2 id="results-title" className="heading-2">{t.results}</h2>
                <dl className="score-list">
                    <div className="score-list__item">
                        <dt className="score-list__label">{t.score}</dt>
                        <dd className="score-list__value">{correctCount} / {total}</dd>
                    </div>
                    <div className="score-list__item">
                        <dt className="score-list__label">{t.pct}</dt>
                        <dd className="score-list__value">{Math.round(correctCount / total * 100)}%</dd>
                    </div>
                </dl>
                <div className="button-row">
                    <button type="button" className="button button--secondary" onClick={handleReset}>
                        <RefreshCw size={18} aria-hidden="true" /> {t.restart}
                    </button>
                    <Link to={studyPath} className="button button--primary" onClick={() => trackModeChange('study')}>
                        <Layers size={18} aria-hidden="true" /> {t.reviewStudy}
                    </Link>
                </div>
            </section>
        )}

        {/* Content */}
        {mode === 'study' ? (
            <div>
                {exam.questions.map((q, i) => renderQuestion(q, i))}
            </div>
        ) : (
            <div>
                <details
                    className="question-nav-panel"
                    open={navOpen}
                    onToggle={(e) => setNavOpen(e.currentTarget.open)}
                >
                    <summary className="question-nav-panel__summary">
                        <ChevronDown size={20} className="question-nav-panel__icon" aria-hidden="true" />
                        <span>{t.navLabel}</span>
                        <span className="question-nav-panel__counts">
                            {t.correct} {correctCount} ・ {t.incorrect} {answeredCount - correctCount}
                        </span>
                    </summary>
                <nav aria-label={t.navLabel}>
                    <ol className="question-nav">
                        {exam.questions.map((q, i) => {
                            const ans = answers[q.id];
                            const stateClass = ans ? (ans.isCorrect ? 'is-correct' : 'is-incorrect') : '';
                            const stateText = ans ? (ans.isCorrect ? t.correct : t.incorrect) : '';
                            return (
                                <li key={q.id}>
                                    <button
                                        type="button"
                                        className={`question-nav__button ${stateClass}`}
                                        aria-current={currentQIndex === i ? 'step' : undefined}
                                        aria-label={`${t.q} ${i + 1}${stateText ? ` (${stateText})` : ''}`}
                                        onClick={() => handleQuestionNavigate('jump', i)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
                </details>

                {renderQuestion(exam.questions[currentQIndex], currentQIndex)}

                <div className="button-row session-nav">
                    <button
                       type="button"
                       className="button button--secondary"
                       onClick={() => handleQuestionNavigate('prev', Math.max(0, currentQIndex - 1))}
                       disabled={currentQIndex === 0}
                    >
                        <ArrowLeft size={20} aria-hidden="true" /> {t.prev}
                    </button>
                    <button
                       type="button"
                       className="button button--primary"
                       onClick={() => handleQuestionNavigate('next', Math.min(total - 1, currentQIndex + 1))}
                       disabled={currentQIndex === total - 1}
                    >
                        {t.next} <ArrowRight size={20} aria-hidden="true" />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
