import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Reservas from './components/Reservas';
import Menu from './components/Menu';
import Pedidos from './components/Pedidos';
import Opiniones from './components/Opiniones';
import PreferenciasCliente from './components/PreferenciasCliente';
import HistorialDetallado from './components/HistorialDetallado';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Reservas />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/opiniones" element={<Opiniones />} />
            <Route path="/preferencias" element={<PreferenciasCliente />} />
            <Route path="/historial" element={<HistorialDetallado />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;