import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

function PrivateRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}

export default PrivateRoute;
