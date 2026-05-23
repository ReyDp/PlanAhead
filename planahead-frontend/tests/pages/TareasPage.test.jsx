import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import TareasPage from '../../src/pages/TareasPage.jsx';
import { AuthContext } from '../../src/context/AuthContext.jsx';

vi.mock('../../src/components/SkeletonCard.jsx', () => ({
  default: () => <div data-testid="skeleton-card" />,
}));

function mockFetch(data, status = 200) {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });
}

function renderTareasPage() {
  return render(
    <AuthContext.Provider
      value={{
        user: { nombre: 'Test User', email: 'test@test.com' },
        token: 'fake_jwt_token_for_testing',
        isAuthenticated: true,
        logout: vi.fn(),
      }}
    >
      <MemoryRouter>
        <TareasPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

const tareaFixture = {
  id: 1,
  titulo: 'Preparar parcial',
  estado: 'PENDIENTE',
  prioridad: 'MEDIA',
  fechaMeta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  fechaLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  materiaId: 1,
  materia: {
    nombre: 'BD',
    color: '#1A56DB',
  },
};

describe('TareasPage', () => {
  test('muestra estado de loading al iniciar', () => {
    global.fetch.mockReturnValue(new Promise(() => {}));

    renderTareasPage();

    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(5);
  });

  test('muestra lista de tareas cuando carga exitosamente', async () => {
    mockFetch([tareaFixture]);
    mockFetch([{ id: 1, nombre: 'BD', color: '#1A56DB' }]);

    renderTareasPage();

    expect(await screen.findByText('Preparar parcial')).toBeInTheDocument();
  });

  test('muestra mensaje de bloqueo cuando no hay materias', async () => {
    const user = userEvent.setup();
    mockFetch([]);
    mockFetch([]);

    renderTareasPage();

    await waitFor(() => {
      expect(screen.queryAllByTestId('skeleton-card')).toHaveLength(0);
    });
    await user.click(screen.getByRole('button', { name: /\+ nueva tarea/i }));

    expect(screen.getByText('Necesitas al menos una materia para crear tareas.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
    expect(screen.getByRole('option', { name: /sin materias disponibles/i })).toBeInTheDocument();
  });

  test('botón guardar deshabilitado si falta el título', async () => {
    const user = userEvent.setup();
    mockFetch([]);
    mockFetch([{ id: 1, nombre: 'BD', color: '#1A56DB' }]);

    renderTareasPage();

    await waitFor(() => {
      expect(screen.queryAllByTestId('skeleton-card')).toHaveLength(0);
    });
    await user.click(screen.getByRole('button', { name: /\+ nueva tarea/i }));

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });
});
