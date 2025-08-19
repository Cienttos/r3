import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Grid, Box, IconButton } from '@mui/material';
import { Person, Email, Home as HomeIcon, PhoneAndroid, Phone, CalendarMonth, Lock, Close } from '@mui/icons-material';
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

  useEffect(() => { listarUsuarios(); }, []);

  const handleBaja = (id) => { setUserToDelete(id); setConfirmOpen(true); };
  const confirmarBaja = async () => {
    try {
      await bajaUsuario(userToDelete);
      await listarUsuarios();
      setSnackbar({ open:true, type:'success', message:'Usuario dado de baja correctamente' });
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false); setUserToDelete(null);
  };
  const handleVer = (user) => { setSelectedUser(user); setModalOpen(true); };

  const userFields = user => Object.entries(user).map(([key,value]) => ({
    icon: key.includes('email') ? <Email color="error" /> :
          key.includes('nombre') || key.includes('apellido') ? <Person color="primary" /> :
          key.includes('direccion') ? <HomeIcon color="secondary" /> :
          key.includes('telefono') ? <Phone color="success" /> :
          key.includes('celular') ? <PhoneAndroid color="success" /> :
          key.includes('contrasenia') ? <Lock color="warning" /> :
          key.includes('fecha') ? <CalendarMonth color="action" /> : <Person />,
    label: key.replace('_',' ').toUpperCase(),
    value: key==='contrasenia' ? '••••••••' : value
  }));

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Lista de Usuarios</Typography>
      {loading ? <CircularProgress /> : (
        <UsuariosTable
          usuarios={usuarios}
          onModificar={user => navigate(`/modificar?id=${user.id}`)}
          onBaja={handleBaja}
          onVer={handleVer}
        />
      )}

      {/* Modal detalles usuario */}
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx:{borderRadius:2,p:2} }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Detalles del Usuario
          <IconButton onClick={()=>setModalOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedUser && userFields(selectedUser).map((item,idx)=>(
              <Grid item xs={12} key={idx}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1, p:1, bgcolor:'#f5f5f5', borderRadius:1 }}>
                  {item.icon}
                  <Typography variant="subtitle2" sx={{ width:120 }}>{item.label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight:500 }}>{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal confirmar baja */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{borderRadius:2,p:2} }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar baja
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea dar de baja a este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarBaja}>Dar de Baja</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(prev=>({...prev, open:false}))} anchorOrigin={{vertical:'top',horizontal:'right'}}>
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
