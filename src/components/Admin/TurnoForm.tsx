import React, { useState } from 'react';
import { TurnoDTO } from '../../types';

interface TurnoFormProps {
  initialData?: TurnoDTO;
  onSave: (turnoData: Omit<TurnoDTO, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const TurnoForm: React.FC<TurnoFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    fecha: initialData?.fecha || '',
    horario: initialData?.horario || '',
    ubicacion: initialData?.ubicacion || '',
    disponible: initialData?.disponible || 'DISPONIBLE',
    customerEmail: initialData?.customerEmail || null,
    customerName: initialData?.customerName || null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    } else {
      // evita que carguen fechas pasadas
      const seleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0,0,0,0);
      if (seleccionada < hoy) {
        newErrors.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }

    if (!formData.horario) {
      newErrors.horario = 'El horario es obligatorio';
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'El consultorio o sede es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Tu lógica de formateo de horario existente
      const horarioFormateado = formData.horario.length === 5 
        ? `${formData.horario}:00` 
        : formData.horario;

      // 🌟 Construimos el objeto exacto adaptado a lo que espera tu TurnoDTO
      onSave({
        fecha: formData.fecha,
        horario: horarioFormateado,
        ubicacion: formData.ubicacion,
        disponible: formData.disponible || 'DISPONIBLE',
        // Convertimos un posible null en undefined para satisfacer el tipado estricto
        customerEmail: formData.customerEmail || undefined,
        customerName: formData.customerName || undefined
      } as any); // Aplicamos un casteo final para asegurar compatibilidad total
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const sedes = [
    'Consultorio 101 - Planta Baja',
    'Consultorio 102 - Planta Baja',
    'Consultorio 204 - Especialidades',
    'Sede Central - Quirófano B',
    'Telemedicina / Virtual'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Fecha */}
      <div>
        <label htmlFor="fecha" className="block text-sm font-medium text-slate-700 mb-1">
          Fecha de Atención
        </label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            errors.fecha ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
      </div>

      {/* Campo Horario */}
      <div>
        <label htmlFor="horario" className="block text-sm font-medium text-slate-700 mb-1">
          Horario de la Cita
        </label>
        <input
          type="time"
          id="horario"
          name="horario"
          value={formData.horario.substring(0, 5)} // asegura formato HH:mm
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            errors.horario ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.horario && <p className="text-red-500 text-xs mt-1">{errors.horario}</p>}
      </div>

      {/* Campo ubicacion */}
      <div>
        <label htmlFor="ubicacion" className="block text-sm font-medium text-slate-700 mb-1">
          Ubicación / Consultorio
        </label>
        <select
          id="ubicacion"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            errors.ubicacion ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecciona un espacio</option>
          {sedes.map(sede => (
            <option key={sede} value={sede}>{sede}</option>
          ))}
        </select>
        {errors.ubicacion && <p className="text-red-500 text-xs mt-1">{errors.ubicacion}</p>}
      </div>

      {/* Estado informativo */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="text-xs text-slate-600">
          💡 Al guardar, el nuevo espacio se añadirá de forma inmediata a la cartilla pública como <span className="font-semibold text-green-600">DISPONIBLE</span> para que los pacientes puedan reservarlo.
        </p>
      </div>

      {/* Botonera de Envío */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm transition-colors"
        >
          {initialData ? 'Actualizar Turno' : 'Habilitar Turno'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-medium text-sm transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TurnoForm;