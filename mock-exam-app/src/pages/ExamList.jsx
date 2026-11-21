import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import { useSavedProgress } from '../utils/progress';
import mockExams from '../data/mockExams.json';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import Breadcrumb from '../components/Breadcrumb';

const labels = {
  en: {
    home: "Home", title: "Fundamentals Exams", subtitle: "Select a mock exam to begin your practice.", questions: "questions", start: "Start Exam",
    resume: "Continue", completed: "Completed", inProgress: "In progress", review: "Review"
  },
  ja: {
    home: "ホーム", title: "模擬試験 一覧", subtitle: "練習を始める試験セットを選択してください。", questions: "問", start: "試験を開始",
    resume: "続きから", completed: "完了", inProgress: "解答中", review: "見直す"
  },
  pt: {
    home: "Início", title: "Simulados Fundamentals", subtitle: "Selecione um simulado para começar a praticar.", questions: "questões", start: "Iniciar simulado",
    resume: "Continuar", completed: "Concluído", inProgress: "Em andamento", review: "Revisar"
  }
};

function ExamCard({ exam, t }) {
  const { localize } = useLanguage();
  const progress = useSavedProgress(exam.setId);
  const answeredCount = Object.keys(progress.answers).length;
  const totalQs = exam.totalQuestions || exam.questions.length;
  const isComplete = progress.completed;
  const hasStarted = answeredCount > 0;

  let scoreText = "";
  if (hasStarted) {
    const correct = Object.values(progress.answers).filter(a => a.isCorrect).length;
    scoreText = `${correct}/${totalQs} (${Math.round(correct / totalQs * 100)}%)`;
  }

  return (
    <li>
      <Link
        to={localize(`/fundamentals/set/${exam.setId}/`)}
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
}

export default function ExamList() {
  const { lang } = useLanguage();
  const t = labels[lang];

  return (
    <div className="container container--narrow">
      <Breadcrumb items={[{ label: t.home, to: '/' }, { label: t.title }]} />
      <header className="page-header">
        <h1 className="heading-1">{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <ul className="exam-list">
        {mockExams.map((exam) => <ExamCard key={exam.setId} exam={exam} t={t} />)}
      </ul>
    </div>
  );
}
