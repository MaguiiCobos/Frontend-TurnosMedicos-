import { API_BASE_URL } from "../config/auth0";
import { TurnoDTO } from "../types";

let globalToken: string | null = null;

export const setAuthToken = (token: string) => {
  globalToken = token;
};

class TurnoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getTurnosDisponibles(): Promise<TurnoDTO[]> {
    const response = await fetch(`${this.baseUrl}/api/public/turnos`); 

    if (!response.ok) {
      throw new Error("Error al obtener la cartilla de turnos disponibles");
    }
    return response.json();
  }

  private async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ) {
    const activeToken = token || globalToken;
    
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${activeToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor médico: ${response.status}`);
    }

    if (response.status === 204) {
      return;
    }

    return response.json();
  }

  async reservarTurno(turnoId: number, emailPaciente: string, token?: string): Promise<TurnoDTO> {
    return this.makeAuthenticatedRequest(
      `/private/turnos/${turnoId}/reservar`,
      {
        method: "PUT",
        body: JSON.stringify({ email: emailPaciente }),
      },
      token
    );
  }

  async getTurnosByPaciente(emailPaciente: string, token?: string): Promise<TurnoDTO[]> {
    return this.makeAuthenticatedRequest(
      `/private/turnos/mis-citas`,
      {},
      token
    );
  }

  async getAllTurnos(token?: string): Promise<TurnoDTO[]> {
    return this.makeAuthenticatedRequest("/private/turnos", {}, token);
  }

  async updateTurnoStatus(
    turnoId: number,
    nuevoEstado: "DISPONIBLE" | "RESERVADO" | "CANCELADO",
    token?: string
  ): Promise<TurnoDTO> {
    return this.makeAuthenticatedRequest(
      `/private/turnos/${turnoId}/estado`,
      {
        method: "PUT",
        body: JSON.stringify({ estado: nuevoEstado }),
      },
      token
    );
  }

  async createTurno(
    turno: Omit<TurnoDTO, "id">,
    token?: string
  ): Promise<TurnoDTO> {
    return this.makeAuthenticatedRequest(
      "/private/turnos",
      {
        method: "POST",
        body: JSON.stringify(turno),
      },
      token
    );
  }

  async deleteTurno(id: number, token?: string): Promise<void> {
    return this.makeAuthenticatedRequest(
      `/private/turnos/${id}`,
      { method: "DELETE" },
      token
    );
  }
}

export const turnoService = new TurnoService();

export const apiService = turnoService;