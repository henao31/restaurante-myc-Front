import React, { useState, useEffect } from 'react';

function PreferenciasCliente() {
  const [preferencias, setPreferencias] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idCliente, setIdCliente] = useState('');
  const [nuevaPreferencia, setNuevaPreferencia] = useState({
    id_cliente_mysql: '',
    alergias: [],
    preferencias_alimentarias: [],
    restricciones_dieteticas: [],
    comidas_favoritas: []
  });
  const [showModal, setShowModal] = useState(false);

  const fetchPreferencias = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/preferencias-clientes/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPreferencias(data);
      setNuevaPreferencia(data || {
        id_cliente_mysql: id,
        alergias: [],
        preferencias_alimentarias: [],
        restricciones_dieteticas: [],
        comidas_favoritas: []
      });
    } catch (e) {
      console.error("Error fetching preferencias:", e);
      setError("No se pudieron cargar las preferencias del cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/preferencias-clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaPreferencia),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      fetchPreferencias(nuevaPreferencia.id_cliente_mysql);
      setShowModal(false);
    } catch (e) {
      console.error("Error saving preferencias:", e);
      setError("No se pudieron guardar las preferencias.");
    }
  };

  const handleArrayInput = (field, value) => {
    setNuevaPreferencia({
      ...nuevaPreferencia,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  if (loading) return <p className="text-center text-gray-700 my-4">Cargando preferencias...</p>;
  if (error) return <p className="text-red-500 text-center my-4">{error}</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Preferencias del Cliente</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Crear/Actualizar Preferencias
        </button>
      </div>
      
      {/* Modal para nueva/actualizar preferencia */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">{preferencias ? 'Actualizar Preferencias' : 'Crear Preferencias'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="ID Cliente"
                value={nuevaPreferencia.id_cliente_mysql}
                onChange={(e) => setNuevaPreferencia({
                  ...nuevaPreferencia,
                  id_cliente_mysql: e.target.value
                })}
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <textarea
                placeholder="Alergias (separadas por comas)"
                value={nuevaPreferencia.alergias.join(', ')}
                onChange={(e) => handleArrayInput('alergias', e.target.value)}
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Preferencias alimentarias (separadas por comas)"
                value={nuevaPreferencia.preferencias_alimentarias.join(', ')}
                onChange={(e) => handleArrayInput('preferencias_alimentarias', e.target.value)}
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Restricciones dietéticas (separadas por comas)"
                value={nuevaPreferencia.restricciones_dieteticas.join(', ')}
                onChange={(e) => handleArrayInput('restricciones_dieteticas', e.target.value)}
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                placeholder="Comidas favoritas (separadas por comas)"
                value={nuevaPreferencia.comidas_favoritas.join(', ')}
                onChange={(e) => handleArrayInput('comidas_favoritas', e.target.value)}
                rows="3"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button type="submit"
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                {preferencias ? 'Actualizar Preferencias' : 'Guardar Preferencias'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Buscador de cliente */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="ID del Cliente"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={() => fetchPreferencias(idCliente)}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Buscar Preferencias
        </button>
      </div>

      {/* Mostrar preferencias actuales */}
      {preferencias && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Preferencias Actuales</h3>
          <p className="mb-2"><strong className="text-gray-700">Alergias:</strong> {preferencias.alergias.join(', ') || 'Ninguna'}</p>
          <p className="mb-2"><strong className="text-gray-700">Preferencias Alimentarias:</strong> {preferencias.preferencias_alimentarias.join(', ') || 'Ninguna'}</p>
          <p className="mb-2"><strong className="text-gray-700">Restricciones Dietéticas:</strong> {preferencias.restricciones_dieteticas.join(', ') || 'Ninguna'}</p>
          <p className="mb-2"><strong className="text-gray-700">Comidas Favoritas:</strong> {preferencias.comidas_favoritas.join(', ') || 'Ninguna'}</p>
        </div>
      )}
    </div>
  );
}

export default PreferenciasCliente;