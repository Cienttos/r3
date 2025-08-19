import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Check, Delete, Close, Visibility } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, eliminarUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToAction, setUserToAction] = useState(null);
  const [actionType, setActionType] = useState(''); // 'alta' o 'eliminar'
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });

  useEffect(()=>{
    const cargarUsuarios = async ()=>{
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
    };
    cargarUsuarios();
  }, [listarUsuariosBaja]);

  const handleAction = (id, type) => {
    setUserToAction(id);
    setActionType(type);
    setConfirmOpen(true);
  };

  const confirmarAction = async () => {
    try{
      if(actionType === 'alta') {
        await altaUsuario(userToAction);
        setUsuariosBaja(prev => prev.filter(u => u.id !== userToAction));
        setSnackbar({ open:true, type:'success', message:'Usuario dado de alta correctamente' });
      } else if(actionType === 'eliminar') {
        await eliminarUsuario(userToAction);
        setUsuariosBaja(prev => prev.filter(u => u.id !== userToAction));
        setSnackbar({ open:true, type:'success', message:'Usuario eliminado correctamente' });
      }
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false);
    setUserToAction(null);
    setActionType('');
  };

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>
      {loading ? <CircularProgress /> :
        usuariosBaja.length === 0 ? <Typography>No hay usuarios dados de baja.</Typography> :
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
                      <IconButton color="success" onClick={()=>handleAction(user.id,'alta')}>
                        <Check />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar definitivamente">
                      <IconButton color="error" onClick={()=>handleAction(user.id,'eliminar')}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* Modal confirmar acción */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar {actionType==='alta' ? 'alta' : 'eliminación'}
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {actionType==='alta' ? '¿Desea dar de alta a este usuario?' : '¿Desea eliminar definitivamente a este usuario?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color={actionType==='alta' ? "success" : "error"} variant="contained" onClick={confirmarAction}>
            {actionType==='alta' ? 'Dar de Alta' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar centrado abajo */}
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
