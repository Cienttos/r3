import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    listarUsuariosBaja().then(setUsuariosBaja);
  }, []);

  const handleAlta = async (id) => {
    if (!window.confirm('¿Desea dar de alta a este usuario?')) return;
    try {
      await altaUsuario(id);
      setUsuariosBaja(prev => prev.filter(u => u.id !== id));
      setSnackbar({ open: true, type: 'success', message: 'Usuario dado de alta correctamente' });
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al dar de alta: ' + err.message });
    }
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
          onBaja={handleAlta}
          onVer={handleVer}
          modoAlta={true}
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
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
