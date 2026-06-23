// En lugar de MenuItem, ahora manejamos la estructura exacta del Turno de la Base de Datos
export interface TurnoDTO {
  id: number;             
  fecha: string;          
  horario: string;        
  ubicacion: string;      
  disponible: 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO' | string;
  customerEmail?: string;  // mail del paciente que reservo
  customerName?: string;  
}

export interface UserProfile {
  sub: string;
  email: string;
  name: string;
  roles: string[];
}

export type UserRole = 'admin' | 'recepcionista' | 'usuario';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string>;
}