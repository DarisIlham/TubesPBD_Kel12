import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import SearchIndexPage from './pages/SearchIndexPage';

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<SearchIndexPage />} />
      </Routes>
    </Router>
  );
}
