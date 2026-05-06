import { TurnoList } from '../components/Turnos/TurnoList';

export const MisTurnosPage = () => {
  const misTurnos = [
    { id: 1, fecha: '2024-01-20', hora: '10:00', estado: 'Reservado', especialidad: 'Cardiología' },
    { id: 2, fecha: '2024-01-22', hora: '15:30', estado: 'Reservado', especialidad: 'Dermatología' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis turnos</h1>
        <p className="text-gray-600">Aquí puedes ver todos tus turnos reservados</p>
      </div>
      
      {misTurnos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No tienes turnos reservados</p>
          <button className="btn-primary mt-4">Explorar turnos disponibles</button>
        </div>
      ) : (
        <TurnoList turnos={misTurnos} onReservar={() => {}} />
      )}
    </div>
  );
};