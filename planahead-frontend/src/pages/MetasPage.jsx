import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import { formatDate } from '../lib/dates.js';
import layout from './pageLayout.module.css';
import styles from './MetasPage.module.css';

function MetasPage() {
  const { token } = useContext(AuthContext);
  const [metas, setMetas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMetas() {
      try {
        const data = await apiFetch('/api/metas/progreso', {}, token);

        if (isMounted) {
          setMetas(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMetas();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        <header className={layout.pageHeader}>
          <div>
            <h1>Metas</h1>
            <p>Seguimiento de avance por periodo.</p>
          </div>
        </header>
        {isLoading && <p className={layout.loading}>Cargando metas...</p>}
        {error && <p className={layout.error}>{error}</p>}
        {!isLoading && (
          <div className={styles.grid}>
            {metas.map((meta) => (
              <article className={styles.card} key={meta.id}>
                <div>
                  <span>{meta.tipo}</span>
                  <h2>{meta.titulo}</h2>
                  <p>{formatDate(meta.fechaInicio)} - {formatDate(meta.fechaFin)}</p>
                </div>
                <strong>{meta.progreso.porcentaje}%</strong>
                <div className={styles.track}>
                  <div style={{ width: `${meta.progreso.porcentaje}%` }} />
                </div>
                <small>{meta.progreso.completadas} de {meta.progreso.total} tareas completadas</small>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MetasPage;
