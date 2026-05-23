import { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api.js';
import layout from './pageLayout.module.css';
import styles from './MateriasPage.module.css';

const COLORES = ['#1A56DB', '#E74694', '#0EA5E9', '#7E3AF2', '#057A55', '#EA580C', '#CA8A04', '#DC2626'];

function MateriasPage() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [materias, setMaterias] = useState([]);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(COLORES[0]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function cargarMaterias() {
      try {
        const data = await apiFetch('/api/materias', {}, token);

        if (isMounted) {
          setMaterias(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    cargarMaterias();

    return () => {
      isMounted = false;
    };
  }, [token]);

  function cerrarModal() {
    setModalAbierto(false);
    setNombre('');
    setColor(COLORES[0]);
    setFormError('');
  }

  async function crearMateria(event) {
    event.preventDefault();
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setFormError('El nombre de la materia es obligatorio.');
      return;
    }

    setGuardando(true);
    setFormError('');

    try {
      const nuevaMateria = await apiFetch(
        '/api/materias',
        {
          method: 'POST',
          body: JSON.stringify({ nombre: nombreLimpio, color }),
        },
        token
      );

      setMaterias((prevMaterias) => [...prevMaterias, nuevaMateria]);
      cerrarModal();
    } catch (saveError) {
      setFormError(saveError.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className={layout.page}>
      <Navbar />
      <main className={layout.content}>
        <header className={layout.pageHeader}>
          <div>
            <h1>Mis Materias</h1>
            <p>Organiza tus cursos y asígnalos a tus tareas</p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={() => setModalAbierto(true)}>
            + Nueva materia
          </button>
        </header>

        {loading && (
          <div className={styles.skeletonList}>
            <SkeletonCard height="80px" />
            <SkeletonCard height="80px" />
            <SkeletonCard height="80px" />
          </div>
        )}

        {error && <p className={layout.error}>{error}</p>}

        {!loading && !error && materias.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <h2>Aún no tienes materias</h2>
            <p>Crea tu primera materia para empezar a organizar tus tareas académicas.</p>
            <button className={styles.primaryButton} type="button" onClick={() => setModalAbierto(true)}>
              Crear mi primera materia
            </button>
          </div>
        )}

        {!loading && !error && materias.length > 0 && (
          <div className={styles.materiasGrid}>
            {materias.map((materia) => (
              <article className={styles.materiaCard} key={materia.id}>
                <span className={styles.colorCircle} style={{ backgroundColor: materia.color }} />
                <strong>{materia.nombre}</strong>
                {materia.cantidadTareas !== undefined && (
                  <span className={styles.badge}>{materia.cantidadTareas} tareas</span>
                )}
              </article>
            ))}
          </div>
        )}

        {modalAbierto && (
          <div className={styles.modalBackdrop}>
            <form className={styles.modal} onSubmit={crearMateria}>
              <h2>Nueva materia</h2>
              <label>
                Nombre de la materia
                <input
                  autoFocus
                  name="nombre"
                  onChange={(event) => setNombre(event.target.value)}
                  placeholder="Ej: Cálculo Diferencial"
                  required
                  value={nombre}
                />
              </label>

              <div className={styles.colorPicker}>
                <span>Color</span>
                <div className={styles.colorOptions}>
                  {COLORES.map((opcion) => (
                    <button
                      aria-label={`Seleccionar color ${opcion}`}
                      className={opcion === color ? styles.colorSelected : styles.colorOption}
                      key={opcion}
                      onClick={() => setColor(opcion)}
                      style={{ backgroundColor: opcion }}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.modalActions}>
                <button type="button" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" disabled={!nombre.trim() || guardando}>
                  {guardando ? 'Guardando...' : 'Guardar materia'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default MateriasPage;
