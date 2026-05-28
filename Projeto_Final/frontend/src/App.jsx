import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { EstoqueProvider } from './context/EstoqueProvider';
import { Gestao } from './pages/Gestao';
import { Dashboard } from './pages/Dashboard';
import './App.css';

/**
 * Raiz da aplicação.
 *
 * - <EstoqueProvider> compartilha o estoque entre todas as páginas (1 fetch só).
 * - <BrowserRouter> habilita as rotas /  e  /dashboard.
 * - <NavLink> realça o link ativo automaticamente.
 */
function App() {
  return (
    <EstoqueProvider>
      <BrowserRouter>
        <nav className="app-nav">
          <NavLink to="/" end className="nav-link">
            Gestão
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Gestao />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </EstoqueProvider>
  );
}

export default App;
