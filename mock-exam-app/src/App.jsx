import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './utils/context';

import Layout from './components/Layout';
import Home from './pages/Home';
import ExamList from './pages/ExamList';
import ExamSession from './pages/ExamSession';
import Updates from './pages/Updates';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="fundamentals" element={<ExamList />} />
            <Route path="fundamentals/set/:setId" element={<ExamSession />} />
            <Route path="updates" element={<Updates />} />
          </Route>
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
