import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { Check, Delete, Close, Visibility } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, eliminarUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
    })();
  }, []);

  const handleAlta = async (id) => {
    try {
      await altaUsuario(id);
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
      setSnackbar({ open:true, type:'success', message:'Usuario dado de alta correctamente' });
    } catch (err) {
      setSnackbar({ open:true, type:'error', message:'Error al dar de alta: '+err.message });
    }
  };

  const handleEliminar = (id) => { setUserToDelete(id); setConfirmDeleteOpen(true); };
  const confirmarEliminar = async () => {
    try {
      await eliminarUsuario(userToDelete);
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
      setSnackbar({ open:true, type:'success', message:'Usuario eliminado correctamente' });
    } catch (err) {
      setSnackbar({ open:true, type:'error', message:'Error al eliminar: '+err.message });
    }
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>

      {loading ? <CircularProgress /> :
        usuariosBaja.length===0 ? <Typography>No hay usuarios dados de baja.</Typography> :

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosBaja.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Dar de alta">
                      <IconButton onClick={()=>handleAlta(user.id)}><Check color="success"/></IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={()=>handleEliminar(user.id)}><Delete color="error"/></IconButton>
                    </Tooltip>
                    <Tooltip title="Ver">
                      <IconButton><Visibility /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* Modal confirmar eliminar */}
      <Dialog open={confirmDeleteOpen} onClose={()=>setConfirmDeleteOpen(false)}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar eliminación
          <IconButton size="small" onClick={()=>setConfirmDeleteOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea eliminar definitivamente este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmDeleteOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarEliminar}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar abajo centro */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={()=>setSnackbar(prev=>({...prev, open:false}))}
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
      >
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
