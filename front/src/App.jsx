import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Home from './pages/PageHome';
import CrearUsuario from './pages/PageCreate';
import ModificarUsuario from './pages/PageModify';
import UsuariosBaja from './pages/PageLow';

export default function App() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mi App Usuarios
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/crear')}>Crear</Button>
          <Button color="inherit" onClick={() => navigate('/baja')}>Bajas</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear" element={<CrearUsuario />} />
          <Route path="/modificar" element={<ModificarUsuario />} />
          <Route path="/baja" element={<UsuariosBaja />} />
        </Routes>
      </Container>
    </>
  );
}
