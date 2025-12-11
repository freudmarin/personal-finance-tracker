import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CatchAllRedirect() {
  const { accessToken } = useAuth();
  return <Navigate to={accessToken ? '/' : '/login'} replace />;
}
