import { TurnoCard } from './TurnosCard';

export const TurnoList = ({ turnos, onReservar, loadingId }) => {
  if (!turnos || turnos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay turnos disponibles</p>
        <p className="text-gray-400 text-sm mt-2">Pronto habrá nuevos turnos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {turnos.map((turno) => (
        <TurnoCard
          key={turno.id}
          turno={turno}
          onReservar={onReservar}
          isLoading={loadingId === turno.id}
        />
      ))}
    </div>
  );
};