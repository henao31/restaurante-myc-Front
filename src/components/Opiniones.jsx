import React, { useState, useEffect } from 'react';

function Opiniones() {
  const [opiniones, setOpiniones] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo_visita: '',
    calificacion_estrellas: '',
    nombre_plato: ''
  });
  const [nuevaOpinion, setNuevaOpinion] = useState({
    id_cliente: '',
    calificacion: 5,
    comentario: '',
    tipo_visita: 'presencial',
    platos_consumidos: []
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOpiniones();
    fetchPlatos();
  }, [filtros]);

  const fetchOpiniones = async () => {
    try {
      let url = 'http://localhost:5000/api/opiniones';
      const queryParams = new URLSearchParams();
      if (filtros.tipo_visita) queryParams.append('tipo_visita', filtros.tipo_visita);
      if (filtros.calificacion_estrellas) queryParams.append('calificacion_estrellas', filtros.calificacion_estrellas);
      if (filtros.nombre_plato) queryParams.append('nombre_plato', filtros.nombre_plato);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOpiniones(data);
    } catch (e) {
      console.error("Error fetching opiniones:", e);
      setError("No se pudieron cargar las opiniones.");
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
      const response = await fetch('http://localhost:5000/api/opiniones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaOpinion),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      fetchOpiniones();
      setNuevaOpinion({
        id_cliente: '',
        calificacion: 5,
        comentario: '',
        tipo_visita: 'presencial',
        platos_consumidos: []
      });
      setShowModal(false);
    } catch (e) {
      console.error("Error adding opinion:", e);
      setError("No se pudo agregar la opinión.");
    }
  };

  if (loading) return <p className="text-center text-gray-700 my-4">Cargando opiniones...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Opiniones</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Enviar Nueva Opinión
        </button>
      </div>
      
      {/* Modal para nueva opinión */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Enviar Nueva Opinión</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="ID Cliente"
                value={nuevaOpinion.id_cliente}
                onChange={(e) => setNuevaOpinion({...nuevaOpinion, id_cliente: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={nuevaOpinion.calificacion}
                onChange={(e) => setNuevaOpinion({...nuevaOpinion, calificacion: parseInt(e.target.value)})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5].map(num => (
                  <option key={num} value={num}>{num} estrellas</option>
                ))}
              </select>

              <textarea
                placeholder="Comentario"
                value={nuevaOpinion.comentario}
                onChange={(e) => setNuevaOpinion({...nuevaOpinion, comentario: e.target.value})}
                required
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={nuevaOpinion.tipo_visita}
                onChange={(e) => setNuevaOpinion({...nuevaOpinion, tipo_visita: e.target.value})}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="presencial">Presencial</option>
                <option value="domicilio">Domicilio</option>
              </select>

              {/* Selector de platos consumidos */}
              <label htmlFor="platos-consumidos" className="block text-gray-700 text-sm font-bold mb-2">Platos Consumidos:</label>
              <select
                id="platos-consumidos"
                multiple
                value={nuevaOpinion.platos_consumidos}
                onChange={(e) => setNuevaOpinion({
                  ...nuevaOpinion,
                  platos_consumidos: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              >
                {platos.map(plato => (
                  <option key={plato.id_plato} value={plato.id_plato}>
                    {plato.nombre}
                  </option>
                ))}
              </select>

              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Enviar Opinión
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <select
          value={filtros.tipo_visita}
          onChange={(e) => setFiltros({...filtros, tipo_visita: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los tipos de visita</option>
          <option value="presencial">Presencial</option>
          <option value="domicilio">Domicilio</option>
        </select>
        
        <select
          value={filtros.calificacion_estrellas}
          onChange={(e) => setFiltros({...filtros, calificacion_estrellas: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las calificaciones</option>
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num} estrellas</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtrar por plato"
          value={filtros.nombre_plato}
          onChange={(e) => setFiltros({...filtros, nombre_plato: e.target.value})}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lista de opiniones */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Opiniones Recientes</h3>
      {opiniones.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opiniones.map(opinion => (
            <li key={opinion._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <p className="text-lg font-bold text-gray-900 mb-1">Cliente: {opinion.id_cliente}</p>
              <p className="text-gray-700 mb-1">Calificación: <span className="text-yellow-500">{'⭐'.repeat(opinion.calificacion)}</span></p>
              <p className="text-gray-700 mb-1">Tipo de visita: <span className="font-semibold">{opinion.tipo_visita}</span></p>
              <p className="text-gray-700 mb-2">Comentario: <span className="italic">"{opinion.comentario}"</span></p>
              <p className="text-gray-700 font-semibold mb-1">Platos consumidos:</p>
              <ul className="list-disc list-inside text-gray-600">
                {opinion.platos_consumidos.map((p, index) => (
                  <li key={index}>{p.nombre}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 my-4">No hay opiniones disponibles.</p>
      )}
    </div>
  );
}

export default Opiniones;