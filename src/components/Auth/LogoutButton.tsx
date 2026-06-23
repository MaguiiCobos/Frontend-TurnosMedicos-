import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;