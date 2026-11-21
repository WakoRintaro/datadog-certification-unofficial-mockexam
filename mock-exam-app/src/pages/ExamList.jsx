import { Link } from 'react-router-dom';
import { useLanguage, getSavedProgress } from '../utils/context';
import mockExams from '../data/mockExams.json';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import Breadcrumb from '../components/Breadcrumb';

export default function ExamList() {
  const { lang } = useLanguage();

  const labels = {
    en: {
      home: "Home", title: "Fundamentals Exams", subtitle: "Select a mock exam to begin your practice.", questions: "questions", start: "Start Exam",
      resume: "Continue", completed: "Completed", inProgress: "In progress", review: "Review",
      metaTitle: "Fundamentals Mock Exam List | Datadog Fundamentals Mock Exams",
      metaDescription: "Choose from 7 Datadog Fundamentals mock exam sets, 90 questions total, and start practicing for free."
    },
    ja: {
      home: "ホーム", title: "模擬試験 一覧", subtitle: "練習を始める試験セットを選択してください。", questions: "問", start: "試験を開始",
      resume: "続きから", completed: "完了", inProgress: "解答中", review: "見直す",
      metaTitle: "模擬試験一覧 | Datadog Fundamentals 模擬試験",
      metaDescription: "Datadog Fundamentals模擬試験の全7セット・計90問から選んで、無料で練習を始めましょう。"
    }
  };
  const t = labels[lang];

  return (
    <div className="container container--narrow">
      <title>{t.metaTitle}</title>
      <meta name="description" content={t.metaDescription} />

      <Breadcrumb items={[{ label: t.home, to: '/' }, { label: t.title }]} />
      <header className="page-header">
        <h1 className="heading-1">{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <ul className="exam-list">
        {mockExams.map((exam) => {
          const progress = getSavedProgress(exam.setId);
          const answeredCount = Object.keys(progress.answers || {}).length;
          const totalQs = exam.totalQuestions || exam.questions.length;
          const isComplete = progress.completed;
          const hasStarted = answeredCount > 0;

          let scoreText = "";
          if (hasStarted) {
             const correct = Object.values(progress.answers).filter(a => a.isCorrect).length;
             scoreText = `${correct}/${totalQs} (${Math.round(correct/totalQs * 100)}%)`;
          }

          return (
            <li key={exam.setId}>
              <Link
                to={`/fundamentals/set/${exam.setId}`}
                className="exam-card"
                onClick={() => trackEvent('exam_start', {
                  exam_set_id: exam.setId,
                  exam_title: exam.title,
                  total_questions: totalQs,
                  resumed: hasStarted
                })}
              >
                <div>
                  <h2 className="exam-card__title">
                    {exam.title.replace('Datadog Fundamentals Mock Exam -', 'Mock Exam')}
                  </h2>
                  <p className="exam-card__meta">
                    <span>{totalQs} {t.questions}</span>
                    {hasStarted && (
                      <>
                        <span className={`chip ${isComplete ? 'chip--success' : 'chip--progress'}`}>
                          {isComplete ? t.completed : t.inProgress}
                        </span>
                        <span>{scoreText}</span>
                      </>
                    )}
                  </p>
                </div>

                {isComplete ? (
                  <span className="exam-card__action exam-card__action--done">
                    <CheckCircle size={20} aria-hidden="true" /> {t.review}
                  </span>
                ) : (
                  <span className="exam-card__action">
                    {hasStarted ? t.resume : t.start} <ChevronRight size={20} aria-hidden="true" />
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
