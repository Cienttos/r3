import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { usuarios, listarUsuarios, bajaUsuario, loading } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    listarUsuarios();
  }, []);

  const handleBaja = async (id) => {
    if (!window.confirm('¿Desea dar de baja a este usuario?')) return;
    await bajaUsuario(id);
    await listarUsuarios();
  };

  const handleVer = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Lista de Usuarios</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          onModificar={(user) => navigate(`/modificar?id=${user.id}`)}
          onBaja={handleBaja}
          onVer={handleVer}
        />
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent>
          {selectedUser && Object.entries(selectedUser).map(([key, value]) => (
            <Typography key={key}><strong>{key}:</strong> {value}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
