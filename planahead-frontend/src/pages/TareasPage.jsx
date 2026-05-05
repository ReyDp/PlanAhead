import { useContext, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import { calcularUrgencia, formatDate, toDateInputValue } from '../lib/dates.js';
import layout from './pageLayout.module.css';
import styles from './TareasPage.module.css';

const EMPTY_FORM = {
  titulo: '',
  materiaId: '',
  fechaLimite: '',
  fechaMeta: '',
  prioridad: 'MEDIA',
  descripcion: '',
};

function TareasPage() {
  const { token } = useContext(AuthContext);
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estado, setEstado] = useState('');
  const [materiaId, setMateriaId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  async function loadData() {
    setError('');
    const [tareasData, materiasData] = await Promise.all([
      apiFetch('/api/tareas', {}, token),
      apiFetch('/api/materias', {}, token),
    ]);
    setTareas(tareasData);
    setMaterias(materiasData);
  }

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [tareasData, materiasData] = await Promise.all([
          apiFetch('/api/tareas', {}, token),
          apiFetch('/api/materias', {}, token),
        ]);

        if (isMounted) {
          setTareas(tareasData);
          setMaterias(materiasData);
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

  const filteredTasks = useMemo(
    () =>
      tareas.filter((tarea) => {
        const matchesEstado = estado ? tarea.estado === estado : true;
        const matchesMateria = materiaId ? String(tarea.materiaId) === materiaId : true;
        return matchesEstado && matchesMateria;
      }),
    [estado, materiaId, tareas]
  );

  function openCreateModal() {
    setEditingTask(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(tarea) {
    setEditingTask(tarea);
    setForm({
      titulo: tarea.titulo,
      materiaId: String(tarea.materiaId),
      fechaLimite: toDateInputValue(tarea.fechaLimite),
      fechaMeta: toDateInputValue(tarea.fechaMeta),
      prioridad: tarea.prioridad,
      descripcion: tarea.descripcion || '',
    });
    setFormError('');
    setModalOpen(true);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function saveTask(event) {
    event.preventDefault();
    setFormError('');

    if (new Date(form.fechaMeta) >= new Date(form.fechaLimite)) {
      setFormError('La fecha meta debe ser anterior a la fecha limite.');
      return;
    }

    const payload = {
      ...form,
      materiaId: Number(form.materiaId),
    };

    try {
      await apiFetch(
        editingTask ? `/api/tareas/${editingTask.id}` : '/api/tareas',
        {
          method: editingTask ? 'PUT' : 'POST',
          body: JSON.stringify(payload),
        },
        token
      );
      setModalOpen(false);
      await loadData();
    } catch (saveError) {
      setFormError(saveError.message);
    }
  }

  async function advanceState(tarea) {
    const nextState = tarea.estado === 'PENDIENTE' ? 'EN_PROGRESO' : 'COMPLETADA';

    try {
      await apiFetch(
        `/api/tareas/${tarea.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ estado: nextState }),
        },
        token
      );
      await loadData();
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        <header className={layout.pageHeader}>
          <div>
            <h1>Tareas</h1>
            <p>Gestiona pendientes, fechas meta y prioridades.</p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={openCreateModal}>
            + Nueva tarea
          </button>
        </header>

        <section className={styles.filters}>
          <select value={estado} onChange={(event) => setEstado(event.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROGRESO">En progreso</option>
            <option value="COMPLETADA">Completada</option>
          </select>
          <select value={materiaId} onChange={(event) => setMateriaId(event.target.value)}>
            <option value="">Todas las materias</option>
            {materias.map((materia) => (
              <option key={materia.id} value={materia.id}>
                {materia.nombre}
              </option>
            ))}
          </select>
        </section>

        {isLoading && <p className={layout.loading}>Cargando tareas...</p>}
        {error && <p className={layout.error}>{error}</p>}

        {!isLoading && (
          <ul className={styles.taskList}>
            {filteredTasks.map((tarea) => {
              const { urgencia } = calcularUrgencia(tarea.fechaMeta);
              return (
                <li className={styles.taskCard} key={tarea.id}>
                  <div>
                    <h2>{tarea.titulo}</h2>
                    <p>
                      <span style={{ backgroundColor: tarea.materia.color }} />
                      {tarea.materia.nombre} · Meta {formatDate(tarea.fechaMeta)}
                    </p>
                  </div>
                  <div className={styles.taskActions}>
                    <span className={`${styles.badge} ${styles[urgencia]}`}>{urgencia}</span>
                    <span className={styles.state}>{tarea.estado}</span>
                    <button type="button" onClick={() => openEditModal(tarea)}>
                      Editar
                    </button>
                    {tarea.estado !== 'COMPLETADA' && (
                      <button type="button" onClick={() => advanceState(tarea)}>
                        Cambiar estado
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {modalOpen && (
          <div className={styles.modalBackdrop}>
            <form className={styles.modal} onSubmit={saveTask}>
              <h2>{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h2>
              <label>
                Titulo
                <input name="titulo" value={form.titulo} onChange={updateForm} required />
              </label>
              <label>
                Materia
                <select name="materiaId" value={form.materiaId} onChange={updateForm} required>
                  <option value="">Selecciona una materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.twoColumns}>
                <label>
                  Fecha meta
                  <input name="fechaMeta" type="date" value={form.fechaMeta} onChange={updateForm} required />
                </label>
                <label>
                  Fecha limite
                  <input name="fechaLimite" type="date" value={form.fechaLimite} onChange={updateForm} required />
                </label>
              </div>
              <label>
                Prioridad
                <select name="prioridad" value={form.prioridad} onChange={updateForm}>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </label>
              <label>
                Descripcion
                <textarea name="descripcion" value={form.descripcion} onChange={updateForm} rows="4" />
              </label>
              {formError && <p className={styles.formError}>{formError}</p>}
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit">Guardar</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default TareasPage;
