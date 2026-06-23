import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm tracking-wide"
    >
      Acceder al Portal
    </button>
  );
};

export default LoginButton;