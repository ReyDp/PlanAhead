import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>PlanAhead</div>
      <nav className={styles.links} aria-label="Navegacion principal">
        <NavLink className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} to="/">
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          to="/tareas"
        >
          Tareas
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          to="/calendario"
        >
          Calendario
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          to="/metas"
        >
          Metas
        </NavLink>
      </nav>
      <div className={styles.session}>
        <span>{user?.nombre || user?.email || 'Usuario'}</span>
        <button type="button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default Navbar;
