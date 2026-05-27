import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Gestao } from './pages/Gestao';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ 
        padding: '15px', 
        backgroundColor: '#222', 
        display: 'flex', 
        gap: '20px',
        fontFamily: 'sans-serif'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          Ir para Gestão
        </Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          Ir para Dashboard
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Gestao />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;