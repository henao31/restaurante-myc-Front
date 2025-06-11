import React, { useState, useEffect } from 'react';

function HistorialDetallado() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    id_cliente_mysql: '',
    nombre_plato: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/historial-detallado';
      const queryParams = new URLSearchParams();
      
      if (filtros.id_cliente_mysql) {
        queryParams.append('id_cliente_mysql', filtros.id_cliente_mysql);
      }
      if (filtros.nombre_plato) {
        queryParams.append('nombre_plato', filtros.nombre_plato);
      }
      if (filtros.fecha_inicio) {
        queryParams.append('fecha_inicio', filtros.fecha_inicio);
      }
      if (filtros.fecha_fin) {
        queryParams.append('fecha_fin', filtros.fecha_fin);
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHistorial(data);
    } catch (e) {
      console.error("Error fetching historial:", e);
      setError("No se pudo cargar el historial detallado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filtros.id_cliente_mysql) {
      fetchHistorial();
    }
  }, [filtros]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  if (loading) return <p className="text-center text-gray-700 my-4">Cargando historial...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Historial Detallado del Cliente</h2>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="ID Cliente"
          value={filtros.id_cliente_mysql}
          onChange={(e) => handleFiltroChange('id_cliente_mysql', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Nombre del Plato"
          value={filtros.nombre_plato}
          onChange={(e) => handleFiltroChange('nombre_plato', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filtros.fecha_inicio}
          onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filtros.fecha_fin}
          onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lista del historial */}
      {historial.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historial.map(registro => (
            <div key={registro._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pedido #{registro.id_pedido_mysql}</h3>
              <p className="text-gray-700 mb-1"><strong className="font-semibold">Cliente:</strong> {registro.id_cliente_mysql}</p>
              <p className="text-gray-700 mb-1"><strong className="font-semibold">Fecha:</strong> {new Date(registro.fecha).toLocaleDateString()}</p>
              <p className="text-gray-700 mb-2"><strong className="font-semibold">Total:</strong> <span className="text-green-600">${parseFloat(registro.total).toFixed(2)}</span></p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Platos Pedidos:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {registro.platos.map((plato, index) => (
                    <li key={index}>
                      {plato.nombre} - Cantidad: {plato.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
              {registro.opinion && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Opinión del Cliente:</h4>
                  <p className="text-gray-700 mb-1">Calificación: <span className="text-yellow-500">{'⭐'.repeat(registro.opinion.calificacion)}</span></p>
                  <p className="text-gray-700">Comentario: <span className="italic">"{registro.opinion.comentario}"</span></p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 my-4">No hay registros disponibles para mostrar.</p>
      )}
    </div>
  );
}

export default HistorialDetallado;