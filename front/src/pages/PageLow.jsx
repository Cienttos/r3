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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToAlta, setUserToAlta] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    listarUsuariosBaja().then(setUsuariosBaja);
  }, []);

  const handleAltaRequest = (user) => {
    setUserToAlta(user);
    setConfirmOpen(true);
  };

  const handleConfirmAlta = async () => {
    try {
      await altaUsuario(userToAlta.id);
      setUsuariosBaja(prev => prev.filter(u => u.id !== userToAlta.id));
      setSnackbar({ open: true, type: 'success', message: 'Usuario dado de alta correctamente' });
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al dar de alta: ' + err.message });
    } finally {
      setConfirmOpen(false);
      setUserToAlta(null);
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
          onBaja={handleAltaRequest}
          onVer={handleVer}
          modoAlta={true}
        />
      )}

      {/* Modal de detalles */}
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

      {/* Modal de confirmación */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar alta</DialogTitle>
        <DialogContent>
          ¿Desea dar de alta al usuario {userToAlta?.nombre} {userToAlta?.apellido}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmAlta}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
