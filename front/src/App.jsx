import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/PageHome.jsx';
import CrearUsuario from './pages/PageCreate.jsx';
import ModificarUsuario from './pages/PageModify.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear" element={<CrearUsuario />} />
        <Route path="/modificar" element={<ModificarUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;
