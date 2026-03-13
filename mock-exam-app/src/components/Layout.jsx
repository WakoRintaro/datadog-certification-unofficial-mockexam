import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../utils/context';
import { Globe, BookOpen } from 'lucide-react';

export default function Layout() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{ 
        backgroundColor: '#fff', 
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div className="container flex items-center justify-between" style={{ height: '64px' }}>
          <Link to="/" className="flex items-center gap-2" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.25rem' }}>
            <BookOpen size={24} color="var(--color-primary)" />
            <span>Datadog Mock Exams</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/fundamentals" style={{ fontWeight: 500, color: 'var(--color-text)' }} className="btn btn-secondary">
              Exams
            </Link>
            
            <button onClick={toggleLanguage} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
              <Globe size={18} />
              {lang === 'en' ? 'EN' : '日本語'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer style={{ backgroundColor: '#2B2C34', color: '#fff', padding: '2rem 0' }}>
        <div className="container text-center">
          <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
            Unofficial Mock Exam Platform for Datadog Fundamentals Certification.
            <br /> Not affiliated with Datadog, Inc.
          </p>
          <p style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.85rem' }}>
            {lang === 'en' ? (
              <>Found a mistake or have a suggestion? <a href="https://github.com/WakoRintaro/datadog-certification-unofficial-mockexam/issues" target="_blank" rel="noopener noreferrer" style={{color: '#a97cd5', textDecoration: 'underline'}}>Open an Issue on GitHub</a></>
            ) : (
              <>問題の不備やご要望をお見かけの際は、<a href="https://github.com/WakoRintaro/datadog-certification-unofficial-mockexam/issues" target="_blank" rel="noopener noreferrer" style={{color: '#a97cd5', textDecoration: 'underline'}}>GitHubのIssue</a>からご報告ください。</>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
