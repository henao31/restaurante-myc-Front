import React, { useState, useEffect } from 'react';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ fecha: '', id_cliente: '' });
  const [nuevaReserva, setNuevaReserva] = useState({
    id_cliente: '',
    id_mesa: '',
    fecha: '',
    hora: '',
    numero_personas: '',
    estado: 'Pendiente'
  });
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 5;
  const [showModal, setShowModal] = useState(false);

  const fetchReservas = async () => {
    try {
      let url = 'http://localhost:5000/api/reservas';
      const queryParams = new URLSearchParams();
      if (filtros.fecha) queryParams.append('fecha', filtros.fecha);
      if (filtros.id_cliente) queryParams.append('id_cliente', filtros.id_cliente);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReservas(data);
      setPagina(1); // Reiniciar a la primera página al filtrar
    } catch (e) {
      console.error("Error fetching reservas:", e);
      setError("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  useEffect(() => {
    fetchReservas();
    // eslint-disable-next-line
  }, [filtros]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verificar disponibilidad de la mesa
      const disponible = await verificarDisponibilidadMesa(nuevaReserva.id_mesa, nuevaReserva.fecha, nuevaReserva.hora);
      if (!disponible) {
        setError("La mesa no está disponible en la fecha y hora seleccionadas.");
        return;
      }

      const response = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaReserva),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchReservas();
      setNuevaReserva({
        id_cliente: '',
        id_mesa: '',
        fecha: '',
        hora: '',
        numero_personas: '',
        estado: 'Pendiente'
      });
      setShowModal(false);
    } catch (e) {
      console.error("Error creating reserva:", e);
      setError("No se pudo crear la reserva.");
    }
  };

  // Agregar función para validar mesa disponible
  const verificarDisponibilidadMesa = async (id_mesa, fecha, hora) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mesas/disponibilidad?id_mesa=${id_mesa}&fecha=${fecha}&hora=${hora}`);
      return response.ok;
    } catch (e) {
      return false;
    }
  };

  // Paginación
  const totalPaginas = Math.ceil(reservas.length / filasPorPagina);
  const reservasPagina = reservas.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Reservas</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Crear Nueva Reserva
        </button>
      </div>

      {/* Modal para nueva reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Nueva Reserva</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="ID Cliente"
                value={nuevaReserva.id_cliente}
                onChange={(e) => setNuevaReserva({...nuevaReserva, id_cliente: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="ID Mesa"
                value={nuevaReserva.id_mesa}
                onChange={(e) => setNuevaReserva({...nuevaReserva, id_mesa: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={nuevaReserva.fecha}
                onChange={(e) => setNuevaReserva({...nuevaReserva, fecha: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                value={nuevaReserva.hora}
                onChange={(e) => setNuevaReserva({...nuevaReserva, hora: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Número de personas"
                value={nuevaReserva.numero_personas}
                onChange={(e) => setNuevaReserva({...nuevaReserva, numero_personas: e.target.value})}
                required
                min="1"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="col-span-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Crear Reserva
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="date"
          value={filtros.fecha}
          onChange={(e) => setFiltros({...filtros, fecha: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="ID Cliente"
          value={filtros.id_cliente}
          onChange={(e) => setFiltros({...filtros, id_cliente: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de reservas */}
      {reservas.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID Reserva</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID Cliente</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID Mesa</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Hora</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Nº Personas</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasPagina.map(reserva => (
                <tr className="border-b border-gray-200 hover:bg-gray-100" key={reserva.id_reserva}>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.id_reserva}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.id_cliente}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.id_mesa}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{formatearFecha(reserva.fecha)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.hora}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.numero_personas}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{reserva.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Paginador */}
          <div className="flex justify-center items-center space-x-4 p-4 bg-white">
            <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>&lt;</button>
            <span className="text-gray-700">Página {pagina} de {totalPaginas}</span>
            <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>&gt;</button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 my-4">No hay reservas disponibles.</p>
      )}
    </div>
  );
}

export default Reservas;