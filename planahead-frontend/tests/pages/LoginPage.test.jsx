import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import LoginPage from '../../src/pages/LoginPage.jsx';
import { AuthContext } from '../../src/context/AuthContext.jsx';

function renderLoginPage(authOverrides = {}) {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        token: null,
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: false,
        ...authOverrides,
      }}
    >
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('LoginPage', () => {
  test('renderiza el formulario de login', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument();
  });

  test('muestra error cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup();
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Credenciales inválidas' }),
    });

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'ana@test.com');
    await user.type(screen.getByLabelText(/password/i), 'incorrecta');
    await user.click(screen.getByRole('button', { name: /iniciar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });

  test('botón de submit se deshabilita mientras carga', async () => {
    const user = userEvent.setup();
    global.fetch.mockReturnValueOnce(new Promise(() => {}));

    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'ana@test.com');
    await user.type(screen.getByLabelText(/password/i), '123456');
    await user.click(screen.getByRole('button', { name: /iniciar/i }));

    await waitFor(() => {
      const submit = screen.getByRole('button', { name: /ingresando/i });
      expect(submit).toBeDisabled();
    });
  });
});
