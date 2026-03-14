import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/context';
import { Award, ArrowRight, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const { lang } = useLanguage();

  const content = {
    en: {
      title: "Master Datadog Certification",
      subtitle: "The ultimate preparation platform for the Datadog Fundamentals Exam. Practice with structured mock exams to ensure you pass on the first try.",
      cta: "Explore Fundamentals Exams",
      features: [
        { icon: LayoutDashboard, title: "7 Full Exam Sets", desc: "Comprehensive coverage of all Datadog domains." },
        { icon: ShieldCheck, title: "Real Exam Feel", desc: "Practice in Quiz Mode with immediate feedback." },
        { icon: Database, title: "Detailed Explanations", desc: "Understand the 'Why' behind every answer." }
      ]
    },
    ja: {
      title: "Datadog認定試験をマスターする",
      subtitle: "Datadog Fundamentals試験に向けた究極の学習プラットフォーム。構造化された模擬試験で一発合格を目指しましょう。",
      cta: "Fundamentals試験一覧を見る",
      features: [
        { icon: LayoutDashboard, title: "全9セットの模擬試験", desc: "Datadogの全ドメインを網羅的に学習。" },
        { icon: ShieldCheck, title: "本番さながらの演習", desc: "クイズモードで即座にフィードバックを取得。" },
        { icon: Database, title: "詳細な解説付き", desc: "すべての解答の「なぜ」を深く理解。" }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--box-shadow)',
        marginBottom: '3rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99, 44, 166, 0.05) 0%, rgba(255, 131, 0, 0.05) 100%)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)',
          padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Award size={16} /> Datadog Fundamentals
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#2B2C34', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {t.title}
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          {t.subtitle}
        </p>

        <Link to="/fundamentals" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          {t.cta}
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Feature Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {t.features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ 
                backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '12px', 
                marginBottom: '1rem', color: 'var(--color-primary)' 
              }}>
                <Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
