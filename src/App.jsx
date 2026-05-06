import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MisTurnosPage } from './pages/MisTurnosPage';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/UI/LoadingSpinner';

function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={login} />
          } />
          <Route path="/dashboard" element={
            user ? <DashboardPage user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/mis-turnos" element={
            user ? <MisTurnosPage /> : <Navigate to="/login" />
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;