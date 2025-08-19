import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleVer = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
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
          onModificar={(user) => navigate(`/modificar?id=${user.id}`)}
          onBaja={handleAlta}        // aquí funciona como "dar de alta"
          onVer={handleVer}
          modoAlta={true}            // habilita tick verde en lugar de tacho
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
