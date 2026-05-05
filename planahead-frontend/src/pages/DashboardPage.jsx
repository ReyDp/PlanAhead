import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import { formatDate } from '../lib/dates.js';
import layout from './pageLayout.module.css';
import styles from './DashboardPage.module.css';

const URGENCIA_STYLES = {
  CRITICA: { className: 'chipCritica', label: 'CRÍTICA' },
  ALTA: { className: 'chipAlta', label: 'ALTA' },
  MEDIA: { className: 'chipMedia', label: 'MEDIA' },
  BAJA: { className: 'chipBaja', label: 'BAJA' },
};

function getUrgenciaStyle(urgencia) {
  return URGENCIA_STYLES[urgencia] || URGENCIA_STYLES.BAJA;
}

function getMetaText(diasAMeta) {
  if (diasAMeta < 0) {
    return `Meta vencida hace ${Math.abs(diasAMeta)} días`;
  }

  return `Meta: ${diasAMeta} días`;
}

function DashboardPage() {
  const { token } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [completingTaskId, setCompletingTaskId] = useState(null);

  async function fetchDashboard() {
    setError('');
    setActionError('');
    setIsLoading(true);

    try {
      const data = await apiFetch('/api/dashboard', {}, token);
      setDashboard(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
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
    const previousDashboard = dashboard;

    setUpdatingTaskId(taskId);
    setCompletingTaskId(taskId);
    setActionError('');
    setSuccessMessage('');

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });

      setDashboard((previousData) => ({
        ...previousData,
        tareasDelDia: previousData.tareasDelDia.filter((tarea) => tarea.id !== taskId),
      }));

      await apiFetch(
        `/api/tareas/${taskId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ estado: 'COMPLETADA' }),
        },
        token
      );

      setSuccessMessage('Tarea completada ✓');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (updateError) {
      setDashboard(previousDashboard);
      setActionError(updateError.message);
    } finally {
      setUpdatingTaskId(null);
      setCompletingTaskId(null);
    }
  }

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        {isLoading && (
          <div className={styles.skeletonLayout}>
            <SkeletonCard height="40px" />
            <div className={styles.skeletonGroup}>
              <SkeletonCard height="80px" />
              <SkeletonCard height="80px" />
              <SkeletonCard height="80px" />
            </div>
            <div className={styles.skeletonGroup}>
              <SkeletonCard height="60px" />
              <SkeletonCard height="60px" />
              <SkeletonCard height="60px" />
              <SkeletonCard height="60px" />
              <SkeletonCard height="60px" />
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.errorState}>
            <span aria-hidden="true">⚠</span>
            <h2>No se pudo cargar el dashboard</h2>
            <button type="button" onClick={fetchDashboard}>
              Reintentar
            </button>
          </div>
        )}

        {actionError && <p className={styles.inlineError}>{actionError}</p>}
        {successMessage && <p className={styles.successToast}>{successMessage}</p>}

        {!isLoading && !error && dashboard && (
          <>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <h1>Buenos días, {dashboard.usuario.nombre.split(' ')[0]} 👋</h1>
                <p className={styles.headerSub}>
                  {dashboard.resumen.totalCriticas > 0
                    ? `⚠ Tienes ${dashboard.resumen.totalCriticas} tarea${
                        dashboard.resumen.totalCriticas > 1 ? 's' : ''
                      } en estado crítico`
                    : '✓ Sin alertas críticas por ahora'}
                </p>
              </div>
              <div className={styles.headerStats}>
                <span className={styles.stat}>
                  <strong>{dashboard.resumen.totalPendientes}</strong> pendientes
                </span>
                <span className={styles.stat}>
                  <strong>{dashboard.resumen.totalAltas}</strong> urgentes
                </span>
              </div>
            </div>

            <div className={styles.grid}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Alertas</h2>
                  <span>{dashboard.alertas.length}</span>
                </div>

                {dashboard.alertas.length === 0 ? (
                  <div className={styles.successEmpty}>✓ Estás al día — no tienes alertas activas</div>
                ) : (
                  <ul className={styles.list}>
                    {dashboard.alertas.map((alerta) => {
                      const urgenciaStyle = getUrgenciaStyle(alerta.urgencia);

                      return (
                        <li
                          className={`${styles.alertItem} ${styles[`alert${alerta.urgencia}`]}`}
                          key={alerta.id}
                        >
                          <div className={styles.alertContent}>
                            <span className={`${styles.chip} ${styles[urgenciaStyle.className]}`}>
                              {urgenciaStyle.label}
                            </span>
                            <h3>{alerta.titulo}</h3>
                            <p>
                              <span
                                className={styles.subjectDot}
                                style={{ backgroundColor: alerta.materia.color }}
                              />
                              {alerta.materia.nombre}
                            </p>
                          </div>
                          <strong className={alerta.diasAMeta < 0 ? styles.metaOverdue : styles.metaText}>
                            {getMetaText(alerta.diasAMeta)}
                          </strong>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Tareas del día</h2>
                  <span>{dashboard.resumen.totalPendientes}</span>
                </div>

                {dashboard.tareasDelDia.length === 0 ? (
                  <p className={layout.empty}>No hay tareas pendientes.</p>
                ) : (
                  <ul className={styles.list}>
                    {dashboard.tareasDelDia.map((tarea) => {
                      const urgenciaStyle = getUrgenciaStyle(tarea.urgencia);

                      return (
                        <li
                          className={`${styles.taskItem} ${
                            completingTaskId === tarea.id ? styles.completando : ''
                          }`}
                          key={tarea.id}
                        >
                          <input
                            aria-label={`Completar ${tarea.titulo}`}
                            checked={completingTaskId === tarea.id}
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
                          <span className={`${styles.chip} ${styles[urgenciaStyle.className]}`}>
                            {urgenciaStyle.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Progreso por materia</h2>
                  <span>{dashboard.progreso.length}</span>
                </div>

                {dashboard.progreso.length === 0 ? (
                  <p className={layout.empty}>Aún no hay tareas para calcular progreso.</p>
                ) : (
                  <div className={styles.progressList}>
                    {dashboard.progreso.map((materia) => (
                      <div className={styles.progressItem} key={materia.materiaId}>
                        <div className={styles.progressHeader}>
                          <span style={{ color: materia.color }}>● {materia.nombre}</span>
                          <span>{materia.porcentaje}%</span>
                        </div>
                        <div className={styles.progressTrack}>
                          <div
                            className={styles.progressFill}
                            style={{
                              background: materia.color,
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
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
