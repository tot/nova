import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/styles.css';
import { Home, Explorer, Peers, Settings } from './pages';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/peers" element={<Peers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
