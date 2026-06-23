import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { turnoService } from '../../services/api';
import { TurnoDTO } from '../../types';
import MiTurnoCard from './MiTurnoCard';

interface MisTurnosViewProps {
  userView?: boolean;
}

const MisTurnosView: React.FC<MisTurnosViewProps> = ({ userView = false }) => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState<TurnoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let turnosList: TurnoDTO[] = [];
      
      if (userView) {
        // se obtienen los turnos reservados por este paciente usando su email
        const emailPaciente = user?.email || '';
        turnosList = await turnoService.getTurnosByPaciente(emailPaciente);
      } else {
        turnosList = await turnoService.getAllTurnos();
      }
      
      // lista cronologicamente
      turnosList.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.horario}`);
        const fechaB = new Date(`${b.fecha}T${b.horario}`);
        return fechaA.getTime() - fechaB.getTime();
      });

      setTurnos(turnosList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los turnos médicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurnos();
  }, [userView, user?.email]);

  const handleCancelTurno = async (turnoId: number) => {
    try {
      await turnoService.updateTurnoStatus(turnoId, 'CANCELADO');
      
      setTurnos(prevTurnos => 
        prevTurnos.map(t => 
          t.id === turnoId ? { ...t, disponible: 'CANCELADO' } : t
        )
      );
      alert('Turno cancelado exitosamente.');
    } catch (error) {
      alert('Error al procesar la cancelación del turno.');
    }
  };

  const getStatusColor = (disponible: string) => {
    switch (disponible) {
      case 'DISPONIBLE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'RESERVADO':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELADO':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusText = (disponible: string) => {
    switch (disponible) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'RESERVADO':
        return 'Turno Reservado';
      case 'CANCELADO':
        return 'Cita Cancelada';
      default:
        return disponible;
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
      {turnos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <p className="text-slate-500 text-sm">
            {userView 
              ? 'No registras ninguna cita programada o histórica todavía.' 
              : 'No existen turnos agendados en la grilla general.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {turnos.map(turno => (
            <MiTurnoCard
              key={turno.id}
              turno={turno}
              onCancel={handleCancelTurno}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              userView={userView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisTurnosView;