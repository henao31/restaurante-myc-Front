import React, { useState, useEffect } from 'react';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ fecha: '', id_cliente: '' });
  const [nuevoPedido, setNuevoPedido] = useState({
    id_cliente: '',
    fecha_pedido: new Date().toISOString().split('T')[0],
    total: 0.00,
    estado_pedido: 'En preparación',
    detalles: []
  });
  const [platosSeleccionados, setPlatosSeleccionados] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPedidos();
    fetchPlatos();
  }, [filtros]);

  // Agregar cálculo automático del total
  useEffect(() => {
    const total = platosSeleccionados.reduce((sum, plato) => {
      return sum + (plato.precio * plato.cantidad);
    }, 0);
    setNuevoPedido(prev => ({...prev, total}));
  }, [platosSeleccionados]);

  const fetchPedidos = async () => {
    try {
      let url = 'http://localhost:5000/api/pedidos';
      const queryParams = new URLSearchParams();
      if (filtros.fecha) queryParams.append('fecha', filtros.fecha);
      if (filtros.id_cliente) queryParams.append('id_cliente', filtros.id_cliente);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPedidos(data);
    } catch (e) {
      console.error("Error fetching pedidos:", e);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/platos');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPlatos(data);
    } catch (e) {
      console.error("Error fetching platos:", e);
      setError("No se pudieron cargar los platos disponibles.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pedidoData = {
        ...nuevoPedido,
        detalles: platosSeleccionados.map(p => ({
          id_plato: p.id_plato,
          cantidad: p.cantidad,
          precio_unitario: p.precio
        }))
      };

      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      fetchPedidos();
      setNuevoPedido({ id_cliente: '', fecha_pedido: new Date().toISOString().split('T')[0], total: 0.00, estado_pedido: 'En preparación', detalles: [] });
      setPlatosSeleccionados([]);
      setShowModal(false);
    } catch (e) {
      console.error("Error adding pedido:", e);
      setError("No se pudo agregar el pedido.");
    }
  };

  const agregarPlatoAlPedido = (plato) => {
    setPlatosSeleccionados([...platosSeleccionados, { ...plato, cantidad: 1 }]);
  };

  const actualizarCantidad = (id_plato, cantidad) => {
    setPlatosSeleccionados(platosSeleccionados.map(p => 
      p.id_plato === id_plato ? { ...p, cantidad } : p
    ));
  };

  // Agregar función para actualizar estado
  const actualizarEstadoPedido = async (id_pedido, nuevo_estado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${id_pedido}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevo_estado })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchPedidos();
    } catch (e) {
      setError("No se pudo actualizar el estado del pedido.");
    }
  };

  if (loading) return <p className="text-center text-gray-700 my-4">Cargando pedidos...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Crear Nuevo Pedido
        </button>
      </div>
      
      {/* Modal para nuevo pedido */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Nuevo Pedido</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="ID Cliente"
                value={nuevoPedido.id_cliente}
                onChange={(e) => setNuevoPedido({...nuevoPedido, id_cliente: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Selector de platos */}
              <div className="mb-4">
                <label htmlFor="plato-select" className="block text-gray-700 text-sm font-bold mb-2">Seleccionar plato:</label>
                <select
                  id="plato-select"
                  onChange={(e) => agregarPlatoAlPedido(platos.find(p => p.id_plato === parseInt(e.target.value)))}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value=""
                >
                  <option value="">Seleccionar plato</option>
                  {platos.map(plato => (
                    <option key={plato.id_plato} value={plato.id_plato}>
                      {plato.nombre} - ${plato.precio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platos seleccionados */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Platos Seleccionados</h3>
                {platosSeleccionados.length > 0 ? (
                  <ul className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    {platosSeleccionados.map(plato => (
                      <li key={plato.id_plato} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-gray-700">{plato.nombre}</span>
                        <input
                          type="number"
                          min="1"
                          value={plato.cantidad}
                          onChange={(e) => actualizarCantidad(plato.id_plato, parseInt(e.target.value))}
                          className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Ningún plato seleccionado.</p>
                )}
              </div>

              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Crear Pedido
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

      {/* Lista de pedidos */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Lista de Pedidos</h3>
      {pedidos.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidos.map(pedido => (
            <li key={pedido.id_pedido} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <p className="text-lg font-bold text-gray-900 mb-1">Pedido #{pedido.id_pedido}</p>
              <p className="text-gray-700 mb-1">Cliente: {pedido.id_cliente}</p>
              <p className="text-gray-700 mb-1">Estado: <span className="font-semibold text-blue-600">{pedido.estado}</span></p>
              <p className="text-gray-700 mb-2">Total: <span className="font-semibold text-green-600">${parseFloat(pedido.total).toFixed(2)}</span></p>
              <p className="text-gray-700 font-semibold mb-1">Platos:</p>
              <ul className="list-disc list-inside text-gray-600">
                {pedido.detalles_platos.map((p, index) => (
                  <li key={index}>{p.nombre_plato} (x{p.cantidad})</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={() => actualizarEstadoPedido(pedido.id_pedido, 'Preparado')}
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm"
                >
                  Marcar como Preparado
                </button>
                <button 
                  onClick={() => actualizarEstadoPedido(pedido.id_pedido, 'Entregado')}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  Marcar como Entregado
                </button>
                <button 
                  onClick={() => actualizarEstadoPedido(pedido.id_pedido, 'Cancelado')}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200 text-sm"
                >
                  Marcar como Cancelado
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 my-4">No hay pedidos disponibles.</p>
      )}
    </div>
  );
}

export default Pedidos;