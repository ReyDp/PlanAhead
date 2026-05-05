import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CalendarioPage from './pages/CalendarioPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MetasPage from './pages/MetasPage.jsx';
import TareasPage from './pages/TareasPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tareas" element={<TareasPage />} />
        <Route path="/calendario" element={<CalendarioPage />} />
        <Route path="/metas" element={<MetasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
