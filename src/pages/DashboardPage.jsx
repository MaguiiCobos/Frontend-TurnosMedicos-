import { TurnoList } from '../components/Turnos/TurnoList';

export const DashboardPage = ({ user }) => {
  // Aquí cargarías los turnos reservados del usuario desde el backend
  const turnosReservados = [
    { id: 1, fecha: '2024-01-20', hora: '10:00', estado: 'Reservado' },
    { id: 2, fecha: '2024-01-22', hora: '15:30', estado: 'Reservado' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">¡Hola, {user?.name}!</h1>
        <p className="text-indigo-100">Bienvenido a tu panel de turnos médicos</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis próximos turnos</h2>
        <TurnoList turnos={turnosReservados} onReservar={() => {}} />
      </div>
    </div>
  );
};