import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const login = async () => {
    // Simular login - En producción, esto vendría de Auth0 o tu backend
    const mockUser = { 
      id: 1,
      name: 'Usuario Demo', 
      email: 'demo@example.com',
      role: 'PATIENT'
    };
    
    // Guardar token y usuario
    localStorage.setItem('auth_token', 'demo_token_' + Date.now());
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return { user, loading, login, logout };
};