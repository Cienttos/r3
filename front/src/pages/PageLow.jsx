import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Button } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';

export default function UsuariosBaja() {
  const { altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar usuarios dados de baja desde la API
  const listarUsuariosBaja = async () => {
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3000/usuario/lista-baja');
      if (!res.ok) throw new Error('Error al listar usuarios dados de baja');
      const data = await res.json();
      setUsuariosBaja(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    listarUsuariosBaja();
  }, []);

  const handleAlta = async (id) => {
    if (!window.confirm('¿Desea dar de alta a este usuario?')) return;
    const res = await altaUsuario(id); // Solo pasamos el ID
    if (res) {
      setUsuariosBaja(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>

      {(loading || cargando) ? (
        <CircularProgress />
      ) : usuariosBaja.length === 0 ? (
        <Typography>No hay usuarios dados de baja.</Typography>
      ) : (
        <UsuariosTable
          usuarios={usuariosBaja}
          onBaja={handleAlta} 
          showModificar={false}
        />
      )}
    </Container>
  );
}
