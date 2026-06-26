export interface TurnoDTO {
  id: number;             
  fecha: string;     // formato: "YYYY-MM-DD"   
  horario: string;    // formato: "HH:mm:ss"
  ubicacion: string;      
  estado: 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO' | string;
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