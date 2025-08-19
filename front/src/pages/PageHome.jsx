import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { usuarios, listarUsuarios, bajaUsuario, loading } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToBaja, setUserToBaja] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });
  const navigate = useNavigate();

  useEffect(() => { listarUsuarios(); }, []);

  const handleBajaRequest = (user) => {
    setUserToBaja(user);
    setConfirmOpen(true);
  };

  const handleConfirmBaja = async () => {
    try {
      await bajaUsuario(userToBaja.id);
      await listarUsuarios();
      setSnackbar({ open: true, type: 'success', message: 'Usuario dado de baja correctamente' });
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al dar de baja: ' + err.message });
    } finally {
      setConfirmOpen(false);
      setUserToBaja(null);
    }
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
          onBaja={handleBajaRequest}
          onVer={handleVer}
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
        <DialogTitle>Confirmar baja</DialogTitle>
        <DialogContent>
          ¿Desea dar de baja al usuario {userToBaja?.nombre} {userToBaja?.apellido}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleConfirmBaja}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
