const API_BASE_URL = 'http://localhost:8080';

export const api = {
  async getTurnos() {
    const response = await fetch(`${API_BASE_URL}/turnos`);
    if (!response.ok) throw new Error('Error al cargar turnos');
    return response.json();
  },

  async reservarTurno(id) {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Si hay token, agregarlo al header
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/turnos/reservar/${id}`, {
      method: 'POST',
      headers: headers,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
      }
      throw new Error('Error al reservar turno');
    }
    
    return response.json();
  }
};