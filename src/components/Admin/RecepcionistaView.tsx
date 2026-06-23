import React, { useEffect, useState } from 'react';
import { turnoService } from '../../services/api';
import { TurnoDTO } from '../../types';

const RecepcionistaView: React.FC = () => {
  const [turnos, setTurnos] = useState<TurnoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterEmail, setFilterEmail] = useState('');

  const cargarTurnos = async () => {
    setLoading(true);
    try {
      const data = await turnoService.getAllTurnos();
      setTurnos(data);
    } catch (err) {
      setError('Error al cargar la lista de turnos globales.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const handleCambiarEstado = async (
    id: number, 
    nuevoEstado: 'DISPONIBLE' | 'RESERVADO' | 'CANCELADO' | string
  ) => {
    try {
      await turnoService.updateTurnoStatus(id, nuevoEstado as any);
      
      setTurnos(prev =>
        prev.map(t => (t.id === id ? { ...t, disponible: nuevoEstado } : t))
      );
    } catch (err) {
      alert('No se pudo actualizar el estado del turno.');
    }
  };

  // Filtrado simple para ayudar a la recepcionista a buscar por paciente
  const turnosFiltrados = turnos.filter(t => {
    if (!filterEmail) return true;
    return t.customerEmail?.toLowerCase().includes(filterEmail.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mesa de Entrada - Recepción</h2>
          <p className="text-sm text-slate-500">Buscador operativo y control de asistencia de pacientes.</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="🔍 Buscar por email de paciente..."
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {loading ? (
        <p className="text-slate-500 text-center py-8 animate-pulse">Cargando grilla operativa...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {turnosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">No se encontraron turnos registrados.</td>
                </tr>
              ) : (
                turnosFiltrados.map((turno) => (
                  <tr key={turno.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#{turno.id}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{turno.fecha}</span> a las {turno.horario.substring(0, 5)} hs
                    </td>
                    <td className="px-6 py-4 text-slate-600">{turno.ubicacion}</td>
                    <td className="px-6 py-4">
                      {turno.customerEmail ? (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">{turno.customerEmail}</span>
                      ) : (
                        <span className="text-slate-400 italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        turno.disponible === 'DISPONIBLE' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {turno.disponible}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      {turno.disponible === 'RESERVADO' && (
                        <button
                          onClick={() => handleCambiarEstado(turno.id, 'CANCELADO')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Cancelar Turno
                        </button>
                      )}
                      {turno.disponible === 'CANCELADO' && (
                        <button
                          onClick={() => handleCambiarEstado(turno.id, 'DISPONIBLE')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >
                          Re-habilitar
                        </button>
                      )}
                      {turno.disponible === 'DISPONIBLE' && (
                        <span className="text-xs text-slate-400">Esperando reserva</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecepcionistaView;