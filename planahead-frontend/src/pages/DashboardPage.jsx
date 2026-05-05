import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import { formatDate } from '../lib/dates.js';
import layout from './pageLayout.module.css';
import styles from './DashboardPage.module.css';

const URGENCY_LABELS = {
  CRITICA: 'Critica',
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
};

function DashboardPage() {
  const { token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  async function loadDashboard() {
    setError('');
    const data = await apiFetch('/api/dashboard', {}, token);
    setDashboard(data);
  }

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await apiFetch('/api/dashboard', {}, token);

        if (isMounted) {
          setDashboard(data);
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

    load();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function completeTask(taskId) {
    setUpdatingTaskId(taskId);
    setError('');

    try {
      await apiFetch(
        `/api/tareas/${taskId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ estado: 'COMPLETADA' }),
        },
        token
      );
      await loadDashboard();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        <header className={layout.pageHeader}>
          <div>
            <h1>Dashboard</h1>
            <p>Resumen de pendientes, alertas y avance por materia.</p>
          </div>
        </header>

        {isLoading && <p className={layout.loading}>Cargando dashboard...</p>}
        {error && <p className={layout.error}>{error}</p>}

        {!isLoading && dashboard && (
          <div className={styles.grid}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Alertas</h2>
                <span>{dashboard.alertas.length}</span>
              </div>

              {dashboard.alertas.length === 0 ? (
                <p className={layout.empty}>No hay alertas criticas o altas.</p>
              ) : (
                <ul className={styles.list}>
                  {dashboard.alertas.map((alerta) => (
                    <li className={styles.alertItem} key={alerta.id}>
                      <div>
                        <h3>{alerta.titulo}</h3>
                        <p>
                          <span
                            className={styles.subjectDot}
                            style={{ backgroundColor: alerta.materia.color }}
                          />
                          {alerta.materia.nombre}
                        </p>
                      </div>
                      <div className={styles.alertMeta}>
                        <span className={`${styles.urgency} ${styles[alerta.urgencia]}`}>
                          {URGENCY_LABELS[alerta.urgencia]}
                        </span>
                        <span>{alerta.diasAMeta} dias</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Tareas del dia</h2>
                <span>{dashboard.resumen.totalPendientes}</span>
              </div>

              {dashboard.tareasDelDia.length === 0 ? (
                <p className={layout.empty}>No hay tareas pendientes.</p>
              ) : (
                <ul className={styles.list}>
                  {dashboard.tareasDelDia.map((tarea) => (
                    <li className={styles.taskItem} key={tarea.id}>
                      <input
                        aria-label={`Completar ${tarea.titulo}`}
                        checked={false}
                        disabled={updatingTaskId === tarea.id}
                        onChange={() => completeTask(tarea.id)}
                        type="checkbox"
                      />
                      <div>
                        <h3>{tarea.titulo}</h3>
                        <p>
                          {tarea.materia.nombre} · Meta {formatDate(tarea.fechaMeta)}
                        </p>
                      </div>
                      <span className={`${styles.urgency} ${styles[tarea.urgencia]}`}>
                        {URGENCY_LABELS[tarea.urgencia]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Progreso por materia</h2>
                <span>{dashboard.progreso.length}</span>
              </div>

              {dashboard.progreso.length === 0 ? (
                <p className={layout.empty}>Aun no hay tareas para calcular progreso.</p>
              ) : (
                <div className={styles.progressList}>
                  {dashboard.progreso.map((materia) => (
                    <div className={styles.progressItem} key={materia.materiaId}>
                      <div className={styles.progressText}>
                        <span>{materia.nombre}</span>
                        <strong>{materia.porcentaje}%</strong>
                      </div>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressBar}
                          style={{
                            backgroundColor: materia.color,
                            width: `${materia.porcentaje}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
