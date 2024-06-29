import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from './useUser';

export default function PrivateRoute({ children }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.rol !== 'Administrador')) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || user.rol !== 'Administrador') {
    return null;
  }

  return children;
}