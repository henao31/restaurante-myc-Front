import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: '#2c3e50',
      padding: '1rem'
    }}>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '2rem',
        margin: 0,
        padding: 0
      }}>
        <a><Link to="/" style={{color: 'white', textDecoration: 'none'}}>Inicio</Link></a>
        <a><Link to="/reservas" style={{color: 'white', textDecoration: 'none'}}>Reservas</Link></a>
        <a><Link to="/menu" style={{color: 'white', textDecoration: 'none'}}>Menú</Link></a>
        <a><Link to="/pedidos" style={{color: 'white', textDecoration: 'none'}}>Pedidos</Link></a>
        <a><Link to="/opiniones" style={{color: 'white', textDecoration: 'none'}}>Opiniones</Link></a>
        <a><Link to="/preferencias" style={{color: 'white', textDecoration: 'none'}}>Preferencias</Link></a>
      </ul>
    </nav>
  );
}

export default Navbar;