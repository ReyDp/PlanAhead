import { createContext, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'planahead_token';

export const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      return;
    }

    const payload = decodeToken(storedToken);

    if (!payload) {
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    setToken(storedToken);
    setUser(payload);
  }, []);

  function login(newToken, userData) {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(token && user),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
