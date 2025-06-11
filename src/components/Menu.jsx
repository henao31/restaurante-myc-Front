import React, { useState, useEffect } from 'react';

function Menu() {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ nombre: '', categoria: '', disponible: '' });
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    disponibilidad: true
  });
  const [platoEditando, setPlatoEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 5;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPlatos();
    // eslint-disable-next-line
  }, [filtros]);

  const fetchPlatos = async () => {
    try {
      let url = 'http://localhost:5000/api/platos';
      const queryParams = new URLSearchParams();
      if (filtros.nombre) queryParams.append('nombre', filtros.nombre);
      if (filtros.categoria) queryParams.append('categoria', filtros.categoria);
      if (filtros.disponible) queryParams.append('disponible', filtros.disponible);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPlatos(data);
      setPagina(1); // Reiniciar a la primera página al filtrar
    } catch (e) {
      console.error("Error fetching platos:", e);
      setError("No se pudieron cargar los platos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/platos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPlato),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchPlatos();
      setNuevoPlato({ nombre: '', descripcion: '', precio: '', categoria: '', disponibilidad: true });
      setShowModal(false); // Cerrar el modal después de agregar el plato
    } catch (e) {
      console.error("Error adding plato:", e);
      setError("No se pudo agregar el plato.");
    }
  };

  // Agregar función para editar platos
  const handleEdit = async (id_plato) => {
    setPlatoEditando(platos.find(p => p.id_plato === id_plato));
    setShowModal(true);
  };

  // Paginación
  const totalPaginas = Math.ceil(platos.length / filasPorPagina);
  const platosPagina = platos.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  if (loading) return <p className="text-center text-gray-700 my-4">Cargando menú...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Menú y Platos</h2>
        <button
          onClick={() => { setPlatoEditando(null); setShowModal(true); }}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Agregar Nuevo Plato
        </button>
      </div>

      {/* Modal para nuevo/editar plato */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">{platoEditando ? 'Editar Plato' : 'Agregar Nuevo Plato'}</h3>
            <form onSubmit={platoEditando ? () => handleEdit(platoEditando.id_plato) : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre del plato"
                value={platoEditando ? platoEditando.nombre : nuevoPlato.nombre}
                onChange={(e) => platoEditando ? setPlatoEditando({...platoEditando, nombre: e.target.value}) : setNuevoPlato({...nuevoPlato, nombre: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Descripción del plato"
                value={platoEditando ? platoEditando.descripcion : nuevoPlato.descripcion}
                onChange={(e) => platoEditando ? setPlatoEditando({...platoEditando, descripcion: e.target.value}) : setNuevoPlato({...nuevoPlato, descripcion: e.target.value})}
                required
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
              />
              <input
                type="number"
                placeholder="Precio"
                value={platoEditando ? platoEditando.precio : nuevoPlato.precio}
                onChange={(e) => platoEditando ? setPlatoEditando({...platoEditando, precio: e.target.value}) : setNuevoPlato({...nuevoPlato, precio: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Categoría"
                value={platoEditando ? platoEditando.categoria : nuevoPlato.categoria}
                onChange={(e) => platoEditando ? setPlatoEditando({...platoEditando, categoria: e.target.value}) : setNuevoPlato({...nuevoPlato, categoria: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
                <select
                  name="disponibilidad"
                  id="disponibilidad"
                  value={platoEditando ? platoEditando.disponibilidad : nuevoPlato.disponibilidad}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => platoEditando ? setPlatoEditando({...platoEditando, disponibilidad: e.target.value}) : setNuevoPlato({...nuevoPlato, disponibilidad: e.target.value})}
                  >
                  <option disabled value="">Seleccione una opción</option>
                  <option value="true">Disponible</option>
                  <option value="false">No disponible</option>
                </select>
              <button type="submit" className="col-span-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                {platoEditando ? 'Guardar Cambios' : 'Agregar Plato'}
              </button>
            </form>
          </div>
        </div>
      )}

            {/* Filtros */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({...filtros, nombre: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filtrar por categoría"
          value={filtros.categoria}
          onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filtros.disponible}
          onChange={(e) => setFiltros({...filtros, disponible: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="true">Disponible</option>
          <option value="false">No disponible</option>
        </select>
      </div>

      {/* Tabla de platos */}
      {platos.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Descripción</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Precio</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Categoría</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Disponible</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {platosPagina.map(plato => (
                <tr className="border-b border-gray-200 hover:bg-gray-100" key={plato.id_plato}>
                  <td className="py-3 px-4 text-sm text-gray-800">{plato.id_plato}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{plato.nombre}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{plato.descripcion}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${parseFloat(plato.precio).toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{plato.categoria}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {plato.disponibilidad ? (
                      <span className="text-green-600 font-bold">Sí</span>
                    ) : (
                      <span className="text-red-600 font-bold">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button 
                      onClick={() => handleEdit(plato.id_plato)}
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm mr-2"
                    >
                      Editar
                    </button>
                    {/* Aquí podrías agregar un botón de eliminar si fuera necesario */}
                  </td>
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
        <p className="text-center text-gray-600 my-4">No hay platos disponibles.</p>
      )}
    </div>
  );
}

export default Menu;