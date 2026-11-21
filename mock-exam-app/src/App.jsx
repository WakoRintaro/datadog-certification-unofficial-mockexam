import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './utils/context';

import Layout from './components/Layout';
import Home from './pages/Home';
import ExamList from './pages/ExamList';
import ExamSession from './pages/ExamSession';
import Updates from './pages/Updates';
import NotFound from './pages/NotFound';

// The same pages exist in both languages: English at the root, Japanese under /ja/.
// The router (BrowserRouter in main.jsx, StaticRouter in entry-server.jsx) wraps this.
function pageRoutes() {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="fundamentals" element={<ExamList />} />
      <Route path="fundamentals/set/:setId" element={<ExamSession mode="quiz" />} />
      <Route path="fundamentals/set/:setId/study" element={<ExamSession mode="study" />} />
      <Route path="updates" element={<Updates />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
}

function LangLayout({ lang }) {
  return (
    <LanguageProvider lang={lang}>
      <Layout />
    </LanguageProvider>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/ja" element={<LangLayout lang="ja" />}>{pageRoutes()}</Route>
      <Route path="/" element={<LangLayout lang="en" />}>{pageRoutes()}</Route>
    </Routes>
  );
}
