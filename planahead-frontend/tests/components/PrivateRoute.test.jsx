import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import PrivateRoute from '../../src/components/PrivateRoute.jsx';
import { AuthContext } from '../../src/context/AuthContext.jsx';

function renderPrivateRoute(isAuthenticated) {
  return render(
    <AuthContext.Provider
      value={{
        user: isAuthenticated ? { nombre: 'Test User', email: 'test@test.com' } : null,
        token: isAuthenticated ? 'fake_jwt_token_for_testing' : null,
        isAuthenticated,
        logout: vi.fn(),
      }}
    >
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/privado" element={<div>Contenido protegido</div>} />
          </Route>
          <Route path="/login" element={<div>Página de login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('PrivateRoute', () => {
  test('redirige a /login si no está autenticado', () => {
    renderPrivateRoute(false);

    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    expect(screen.getByText('Página de login')).toBeInTheDocument();
  });

  test('renderiza el contenido si está autenticado', () => {
    renderPrivateRoute(true);

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
});
