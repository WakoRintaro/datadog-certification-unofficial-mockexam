import { Link } from 'react-router-dom';
import { useLanguage, getSavedProgress } from '../utils/context';
import mockExams from '../data/mockExams.json';
import { PlayCircle, Award, CheckCircle } from 'lucide-react';

export default function ExamList() {
  const { lang } = useLanguage();

  const labels = {
    en: { title: "Fundamentals Exams", subtitle: "Select a mock exam to begin your practice.", questions: "questions", start: "Start Exam" },
    ja: { title: "模擬試験 一覧", subtitle: "練習を始める試験セットを選択してください。", questions: "問", start: "試験を開始" }
  };
  const t = labels[lang];

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="page-title">{t.title}</h1>
      <p className="page-subtitle">{t.subtitle}</p>

      <div className="flex flex-col gap-4">
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
            <Link to={`/fundamentals/set/${exam.setId}`} key={exam.setId} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '12px', 
                    backgroundColor: isComplete ? 'var(--color-success-light)' : 'var(--color-primary-light)', 
                    color: isComplete ? 'var(--color-success)' : 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isComplete ? <Award size={24} /> : <PlayCircle size={24} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                      {exam.title.replace('Datadog Fundamentals Mock Exam -', 'Mock Exam')}
                    </h3>
                    <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <span>{totalQs} {t.questions}</span>
                      {hasStarted && (
                        <>
                          <span style={{ fontSize: '0.6rem' }}>•</span>
                          <span style={{ 
                            color: isComplete ? 'var(--color-success)' : 'var(--color-text-muted)', 
                            fontWeight: isComplete ? 600 : 400 
                          }}>
                            {isComplete ? 'Completed: ' : 'In Progress: '} {scoreText}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ color: 'var(--color-text-muted)' }}>
                  {isComplete ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontWeight: 500 }}>
                      <CheckCircle size={20} />
                    </span>
                  ) : (
                    <div className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                      {t.start}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
