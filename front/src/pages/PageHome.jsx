import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import UserTable from '../components/UserTable';
import { listarUsuarios, bajaUsuario } from '../hooks/useApi';

function Home() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    const data = await listarUsuarios();
    setUsuarios(data);
  };

  const handleBaja = async (id) => {
    await bajaUsuario(id);
    cargarUsuarios();
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Lista de Usuarios</Typography>
      <UserTable usuarios={usuarios} onBaja={handleBaja} />
    </Container>
  );
}

export default Home;
