import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from './useUser';

export default function PrivateRoute({ children }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.rol !== 'Administrador')) {
      // si no está cargando y el usuario no está autenticado o no es administrador, redirige a /login
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    // mientras se carga la información del usuario, muestra un indicador de carga
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || user.rol !== 'Administrador') {
    // si no hay usuario autenticado o no es administrador, no renderiza nada 
    return null;
  }

  return children;
}
