import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css';

const MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

function validateForm(form, isRegisterMode) {
  const nombre = form.nombre.trim();
  const email = form.email.trim();
  const password = form.password;

  if (isRegisterMode && !nombre) {
    return 'Ingresa tu nombre para crear la cuenta';
  }

  if (!email) {
    return 'Ingresa tu email';
  }

  if (!email.includes('@')) {
    return 'Ingresa un email valido, por ejemplo ana@email.com';
  }

  if (!password) {
    return 'Ingresa tu password';
  }

  if (isRegisterMode && password.length < 6) {
    return 'El password debe tener al menos 6 caracteres';
  }

  return '';
}

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [mode, setMode] = useState(MODES.LOGIN);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setError('');
  }, [mode]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const isRegisterMode = mode === MODES.REGISTER;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const validationError = validateForm(form, isRegisterMode);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegisterMode
      ? {
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
        }
      : {
          email: form.email.trim(),
          password: form.password,
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'No se pudo completar la solicitud');
        return;
      }

      login(data.token, data.usuario);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.brandPanel}>
        <h1>PlanAhead</h1>
        <p className={styles.tagline}>
          Organiza tu semestre.
          <br />
          Cumple tus metas.
        </p>
        <ul className={styles.features}>
          <li>✓ Tareas con fecha meta y fecha límite</li>
          <li>✓ Alertas inteligentes de vencimiento</li>
          <li>✓ Dashboard con prioridades del día</li>
          <li>✓ Seguimiento de progreso académico</li>
        </ul>
      </div>

      <section className={styles.formPanel}>
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2>{isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
            <p>{isRegisterMode ? 'Regístrate para comenzar.' : 'Ingresa a tu agenda académica.'}</p>
          </div>

          <div className={styles.switcher} role="tablist" aria-label="Modo de acceso">
            <button
              className={mode === MODES.LOGIN ? styles.activeTab : styles.tab}
              type="button"
              onClick={() => setMode(MODES.LOGIN)}
            >
              Login
            </button>
            <button
              className={mode === MODES.REGISTER ? styles.activeTab : styles.tab}
              type="button"
              onClick={() => setMode(MODES.REGISTER)}
            >
              Registro
            </button>
          </div>

          <div className={styles.demoHint}>
            <strong>Demo:</strong> carlos@demo.com / demo1234
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {isRegisterMode && (
              <label className={styles.field}>
                Nombre
                <input
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={updateField}
                  autoComplete="name"
                  aria-invalid={Boolean(error && isRegisterMode && !form.nombre.trim())}
                />
              </label>
            )}

            <label className={styles.field}>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                aria-invalid={Boolean(error && (!form.email.trim() || !form.email.includes('@')))}
              />
            </label>

            <label className={styles.field}>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={updateField}
                autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                aria-invalid={Boolean(error && !form.password)}
              />
            </label>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
