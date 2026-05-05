import { useEffect, useState } from "react";

function App() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/turnos")
      .then(res => res.json())
      .then(data => setTurnos(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Turnos disponibles</h1>

      {turnos.map(t => (
        <div key={t.id}>
          {t.fecha} - {t.hora} - {t.disponible ? "Disponible" : "Reservado"}
        </div>
      ))}
    </div>
  );
}

export default App;