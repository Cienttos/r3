import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Grid,
  Box
} from '@mui/material';
import { Person, Email, Home as HomeIcon, PhoneAndroid, Phone, CalendarMonth, Lock } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { usuarios, listarUsuarios, bajaUsuario, loading } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    listarUsuarios();
  }, []);

  const handleBaja = (id) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const confirmarBaja = async () => {
    try {
      await bajaUsuario(userToDelete);
      await listarUsuarios();
      setSnackbar({ open: true, type: 'success', message: 'Usuario dado de baja correctamente' });
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al dar de baja: ' + err.message });
    }
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleVer = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const userFields = (user) => [
    { icon: <Person color="primary" />, label: 'Nombre', value: `${user.nombre} ${user.apellido}` },
    { icon: <HomeIcon color="secondary" />, label: 'Dirección', value: user.direccion },
    { icon: <Phone color="success" />, label: 'Teléfono', value: user.telefono },
    { icon: <PhoneAndroid color="success" />, label: 'Celular', value: user.celular },
    { icon: <CalendarMonth color="action" />, label: 'Nacimiento', value: user.fecha_nacimiento },
    { icon: <Email color="error" />, label: 'Email', value: user.email },
    { icon: <Lock color="warning" />, label: 'Contraseña', value: '••••••••' }
  ];

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

      {/* Modal de ver usuario */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedUser && userFields(selectedUser).map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{item.label}:</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmar baja */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>¿Desea dar de baja a este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={confirmarBaja}>Dar de Baja</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
