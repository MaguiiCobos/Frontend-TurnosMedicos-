import React from 'react';
import { TurnoDTO } from '../../types';

interface TurnoCardProps {
  turno: TurnoDTO;
  onReservar?: (id: number) => void;
  onStatusChange?: (id: number, nuevoEstado: string) => void;
  adminMode?: boolean;
  canOrder?: boolean;
}

const TurnoCard: React.FC<TurnoCardProps> = ({
  turno,
  onReservar,
  onStatusChange,
  adminMode = false,
  canOrder = false
}) => {

  const handleReservar = () => {
    if (onReservar && turno.disponible === 'DISPONIBLE') {
      onReservar(turno.id);
    }
  };

  const handleAnular = () => {
    if (onStatusChange && window.confirm('¿Está seguro de que desea cancelar este turno médico?')) {
      onStatusChange(turno.id, 'CANCELADO');
    }
  };

  const isDisponible = turno.disponible === 'DISPONIBLE';

  const formatFechaCorta = (fechaString: string) => {
    const partes = fechaString.split('-');
    if (partes.length !== 3) return fechaString;
    const date = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col p-5 h-full ${
      !isDisponible && !adminMode ? 'opacity-60 bg-slate-50/50' : ''
    }`}>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-mono text-slate-400 block mb-1">#{turno.id}</span>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {turno.horario.substring(0, 5)} <span className="text-xs font-normal text-slate-500">hs</span>
          </h3>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          isDisponible ? 'bg-green-50 text-green-700' : turno.disponible === 'RESERVADO' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
        }`}>
          {turno.disponible}
        </span>
      </div>

      {/* Detalles de la cita */}
      <div className="space-y-2 my-2 flex-1 text-sm text-slate-600">
        <p className="flex items-center gap-1.5 font-medium text-slate-700 capitalize">
          📅 {formatFechaCorta(turno.fecha)}
        </p>
        <p className="flex items-center gap-1.5">
          📍 {turno.ubicacion}
        </p>
        
        {adminMode && turno.customerEmail && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 truncate mt-3">
            👤 <span className="font-medium text-slate-700">{turno.customerEmail}</span>
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50">
        {adminMode ? (
          <div className="flex space-x-2">
            {turno.disponible !== 'CANCELADO' && (
              <button
                onClick={handleAnular}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs py-2 px-3 rounded-lg font-semibold transition-colors"
              >
                Anular Turno
              </button>
            )}
            {turno.disponible === 'CANCELADO' && (
              <button
                onClick={() => onStatusChange?.(turno.id, 'DISPONIBLE')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-3 rounded-lg font-semibold transition-colors"
              >
                Re-habilitar
              </button>
            )}
          </div>
        ) : (
          canOrder && (
            <button
              onClick={handleReservar}
              disabled={!isDisponible}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold shadow-sm transition-all ${
                isDisponible
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isDisponible ? '⚡ Reservar Cita' : 'No disponible'}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TurnoCard;