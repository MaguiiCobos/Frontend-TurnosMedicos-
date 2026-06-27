import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { turnoService } from '../../services/api';
import { TurnoDTO } from '../../types';
import TurnoCard from './TurnoCard';

interface TurnosViewProps {
  adminMode?: boolean;
  onStatusChangeItem?: (id: number, nuevoEstado: string) => void;
  canReserve?: boolean;
}

const TurnosView: React.FC<TurnosViewProps> = ({ 
  adminMode = false, 
  onStatusChangeItem,
  canReserve = false
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const [turnos, setTurnos] = useState<TurnoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();

  const loadTurnos = async () => {
    try {
      setLoading(true);
      setError(null);

      let items: TurnoDTO[] = [];
      if (adminMode && isAuthenticated) {
        const token = await getAccessToken();
        items = await turnoService.getAllTurnos(token);
      } else {
        items = await turnoService.getTurnosDisponibles();
      }

      // Ordena cronológicamente por fecha y hora
      items.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.horario}`);
        const fechaB = new Date(`${b.fecha}T${b.horario}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setTurnos(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la cartilla de turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurnos();
  }, [adminMode, isAuthenticated]);

  const handleReservarTurno = async (id: number) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar un turno médico.');
      return;
    }

    const emailPaciente = user?.email;
    if (!emailPaciente) {
      alert('No se pudo recuperar el correo electrónico de tu sesión.');
      return;
    }

    if (window.confirm('¿Confirmas la reserva de este espacio de atención médica?')) {
      try {
        // Se asocia el turno al paciente y pasa a estar RESERVADO
        await turnoService.reservarTurno(id, emailPaciente);
        alert('¡Tu cita médica ha sido reservada con éxito!');
        
        // si el turno ya esta reservado, se saca de los turnos disponibles
        if (!adminMode) {
          setTurnos(prev => prev.filter(t => t.id !== id));
        } else {
          loadTurnos();
        }
      } catch (error) {
        alert('Error al procesar la reserva. Por favor, intenta nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-slate-100 p-6 max-w-md mx-auto">
        <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>
        <button
          onClick={loadTurnos}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
          {adminMode ? 'Panel de Control de Turnos' : 'Turnos Médicos Disponibles'}
        </h1>
        <p className="text-sm text-slate-500">
          {adminMode 
            ? 'Monitorea, cancela o re-habilita los bloques de atención de la clínica.' 
            : 'Selecciona el horario que mejor se adapte a tus necesidades para agendar una cita.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {turnos.map(turno => (
          <TurnoCard
            key={turno.id}
            turno={turno}
            onReservar={handleReservarTurno}
            onStatusChange={onStatusChangeItem}
            adminMode={adminMode}
            canOrder={canReserve}
          />
        ))}
      </div>

      {turnos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 max-w-md mx-auto">
          <p className="text-slate-500 text-sm font-medium">
            No se encontraron turnos para mostrar en este momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default TurnosView;