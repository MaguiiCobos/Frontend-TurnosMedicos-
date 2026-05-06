import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export const TurnoCard = ({ turno, onReservar, isLoading }) => {
  const isAvailable = turno.disponible == true;
  console.log('TurnoCard renderizado para turno:', turno.id, turno.fecha);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{turno.fecha}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{turno.hora}</span>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isAvailable 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {turno.disponible == true ? 'Disponible' : 'Reservado'}
          </span>
        </div>

        <button
          onClick={() => onReservar(turno.id)}
          disabled={!isAvailable || isLoading}
          className={`w-full mt-4 btn-primary ${
            !isAvailable && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Reservando...' : 'Reservar turno'}
        </button>
      </div>
    </div>
  );
};