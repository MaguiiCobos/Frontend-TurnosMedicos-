import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { turnoService } from '../../services/api';
import { TurnoDTO } from '../../types';
import TurnosView from '../Turnos/TurnosView';
import TurnoForm from './TurnoForm';

const AdminView: React.FC = () => {
  const { getAccessToken } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);

  const handleLiberarOAnularTurno = async (
    id: number, 
    nuevoEstado: 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO' | string
  ) => {
    try {
      await turnoService.updateTurnoStatus(id, nuevoEstado as 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO');
      setRefreshKey(prev => prev + 1);
      alert(`Estado del turno actualizado a: ${nuevoEstado}`);
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el estado del turno');
    }
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleCrearTurno = async (turnoData: Omit<TurnoDTO, 'id'>) => {
    try {
      const token = await getAccessToken();
      await turnoService.createTurno(turnoData, token);
      setMostrarFormulario(false);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error(error);
      alert('Error al crear el turno');
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

        {/* Botón para abrir el formulario */}
        <div className="flex justify-end">
          <button
            onClick={() => setMostrarFormulario(prev => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {mostrarFormulario ? 'Cerrar Formulario' : '+ Nuevo Turno'}
          </button>
        </div>

        {/* Formulario de creación */}
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Crear Nuevo Turno</h3>
            <TurnoForm
              onSave={handleCrearTurno}
              onCancel={() => setMostrarFormulario(false)}
            />
          </div>
        )}
        
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