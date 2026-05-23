import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/tareas', label: 'Tareas' },
  { to: '/materias', label: 'Materias' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/metas', label: 'Metas' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function isActive(path) {
    return path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  }

  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>PlanAhead</span>
      <div className={styles.links}>
        {LINKS.map((link) => (
          <Link
            className={isActive(link.to) ? styles.activeLink : styles.link}
            key={link.to}
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className={styles.userArea}>
        <span>{user?.nombre ? user.nombre.split(' ')[0] : 'Usuario'}</span>
        <button type="button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
