import { useState, useEffect } from "react";
import { TurnoList } from "../components/Turnos/TurnoList";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { Toast } from "../components/UI/Toast";
import { api } from "../services/api";

export const HomePage = ({ user }) => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservandoId, setReservandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // ✅ Función declarada DENTRO del useEffect
    const cargarTurnos = async () => {
      try {
        const data = await api.getTurnos();
        setTurnos(data);
      } catch (error) {
        setToast({ message: "Error al cargar turnos", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    cargarTurnos();
  }, []); // ✅ Solo se ejecuta al montar el componente

  const handleReservar = async (id) => {
    if (!user) {
      setToast({
        message: "Debes iniciar sesión para reservar",
        type: "error",
      });
      return;
    }

    setReservandoId(id);
    try {
      await api.reservarTurno(id);
      setToast({ message: "¡Turno reservado con éxito!", type: "success" });
      await cargarTurnos();
    } catch (error) {
      console.error("Error detallado:", error);

      if (
        error.message.includes("401") ||
        error.message.includes("autorizado")
      ) {
        setToast({
          message: "Sesión expirada. Por favor inicia sesión nuevamente.",
          type: "error",
        });
      } else {
        setToast({ message: "Error al reservar turno", type: "error" });
      }
    } finally {
      setReservandoId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Turnos disponibles
        </h1>
        <p className="text-gray-600">
          Selecciona el horario que mejor se adapte a ti
        </p>
      </div>

      <TurnoList
        turnos={turnos}
        onReservar={handleReservar}
        loadingId={reservandoId}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
