import { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import { formatDate } from '../lib/dates.js';
import layout from './pageLayout.module.css';
import styles from './CalendarioPage.module.css';

const WEEK_DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

function getMonthDays(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
  const days = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  return days;
}

function dateKey(date) {
  return date.toISOString().split('T')[0];
}

function CalendarioPage() {
  const { token } = useContext(AuthContext);
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calendar, setCalendar] = useState(null);
  const [selectedDay, setSelectedDay] = useState(dateKey(today));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthLabel = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(currentDate);
  const days = useMemo(() => getMonthDays(year, monthIndex), [year, monthIndex]);
  const selectedTasks = calendar?.dias?.[selectedDay] || [];

  useEffect(() => {
    let isMounted = true;

    async function loadCalendar() {
      setIsLoading(true);
      setError('');

      try {
        const data = await apiFetch(`/api/calendario?mes=${monthIndex + 1}&anio=${year}`, {}, token);

        if (isMounted) {
          setCalendar(data);
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

    loadCalendar();

    return () => {
      isMounted = false;
    };
  }, [monthIndex, token, year]);

  function moveMonth(amount) {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  }

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        <header className={layout.pageHeader}>
          <div>
            <h1>Calendario</h1>
            <p>Vista mensual de fechas meta y limites.</p>
          </div>
          <div className={styles.monthNav}>
            <button type="button" onClick={() => moveMonth(-1)}>Anterior</button>
            <strong>{monthLabel}</strong>
            <button type="button" onClick={() => moveMonth(1)}>Siguiente</button>
          </div>
        </header>

        {isLoading && <p className={layout.loading}>Cargando calendario...</p>}
        {error && <p className={layout.error}>{error}</p>}

        {!isLoading && calendar && (
          <>
            <section className={styles.calendar}>
              {WEEK_DAYS.map((day) => (
                <div className={styles.weekDay} key={day}>{day}</div>
              ))}
              {days.map((day, index) => {
                if (!day) {
                  return <div className={styles.emptyCell} key={`empty-${index}`} />;
                }

                const key = dateKey(day);
                const tasks = calendar.dias[key] || [];
                return (
                  <button
                    className={selectedDay === key ? styles.selectedCell : styles.dayCell}
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                  >
                    <span>{day.getDate()}</span>
                    <div className={styles.dots}>
                      {tasks.slice(0, 5).map((task) => (
                        <i key={task.id} style={{ backgroundColor: task.materia.color }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </section>

            <section className={styles.selectedPanel}>
              <h2>Tareas del {selectedDay}</h2>
              {selectedTasks.length === 0 ? (
                <p className={layout.empty}>No hay tareas para este dia.</p>
              ) : (
                <ul>
                  {selectedTasks.map((task) => (
                    <li key={task.id}>
                      <span style={{ backgroundColor: task.materia.color }} />
                      <div>
                        <strong>{task.titulo}</strong>
                        <p>{task.materia.nombre} · Limite {formatDate(task.fechaLimite)} · {task.estado}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default CalendarioPage;
