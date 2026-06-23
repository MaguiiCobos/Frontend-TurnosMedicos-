import React from 'react';
import { TurnoDTO } from '../../types';

interface MiTurnoCardProps {
  turno: TurnoDTO;
  onCancel: (turnoId: number) => void;
  getStatusColor: (disponible: string) => string;
  getStatusText: (disponible: string) => string;
  userView?: boolean;
}

const MiTurnoCard: React.FC<MiTurnoCardProps> = ({
  turno,
  onCancel,
  getStatusColor,
  getStatusText,
  userView = false
}) => {
  
  const formatFecha = (fechaString: string) => {
    try {
      // Forzamos el parseo local sumando la hora para evitar desajustes de zona horaria
      const date = new Date(`${fechaString}T00:00:00`);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fechaString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow">
      
      {/* Información principal de la cita */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-slate-400">#{turno.id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(turno.disponible)}`}>
            {getStatusText(turno.disponible)}
          </span>
        </div>
        
        <h3 className="text-base font-bold text-slate-800 capitalize">
          📅 {formatFecha(turno.fecha)}
        </h3>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <p className="flex items-center gap-1">
            <span className="text-slate-400">🕒 Horario:</span> 
            <span className="font-semibold text-slate-700">{turno.horario.substring(0, 5)} hs</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="text-slate-400">📍 Lugar:</span> 
            <span className="text-slate-700">{turno.ubicacion}</span>
          </p>
        </div>

        {/* Si no es vista de usuario mostramos quién reservó */}
        {!userView && turno.customerEmail && (
          <p className="text-xs text-slate-500 pt-1">
            <span className="font-medium">Paciente asociado:</span> {turno.customerEmail}
          </p>
        )}
      </div>

      {/* Boton para cancelar un turno */}
      <div className="flex items-center justify-end sm:border-l sm:border-slate-100 sm:pl-6">
        {turno.disponible === 'RESERVADO' ? (
          <button
            onClick={() => {
              if (window.confirm('¿Está seguro de que desea cancelar su cita médica? Este espacio quedará disponible para otro paciente.')) {
                onCancel(turno.id);
              }
            }}
            className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancelar Cita
          </button>
        ) : (
          <span className="text-xs text-slate-400 italic py-2">
            Sin acciones disponibles
          </span>
        )}
      </div>

    </div>
  );
};

export default MiTurnoCard;