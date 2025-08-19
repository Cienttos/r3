import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
    };
    cargarUsuarios();
  }, []);

  const handleAlta = async (id) => {
    if (!window.confirm('¿Desea dar de alta a este usuario?')) return;
    await altaUsuario(id);
    setUsuariosBaja(prev => prev.filter(u => u.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>

      {loading ? (
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
