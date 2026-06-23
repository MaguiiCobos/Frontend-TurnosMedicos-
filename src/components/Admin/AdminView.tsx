import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { turnoService } from '../../services/api';
import { TurnoDTO } from '../../types';
import TurnosView from '../Turnos/TurnosView';

const AdminView: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLiberarOAnularTurno = async (
    id: number, 
    nuevoEstado: 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO' | string
  ) => {
    try {
      await turnoService.updateTurnoStatus(id, nuevoEstado as any);
      setRefreshKey(prev => prev + 1);
      alert(`Estado del turno actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el estado del turno');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Panel de Control del Profesional
        </h2>
        <p className="text-sm text-slate-500">
          Visualización en tiempo real de la grilla de atención y estado de consultorios.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-700">
            Monitoreo de Citas del Día
          </h3>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            🔄 Actualizar Grilla
          </button>
        </div>

        <div key={refreshKey}>
          <TurnosView
            adminMode={true}
            onStatusChangeItem={handleLiberarOAnularTurno}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminView;