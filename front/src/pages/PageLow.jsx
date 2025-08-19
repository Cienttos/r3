import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, IconButton } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';
import UsuariosTable from '../components/UserTable';
import { Close } from '@mui/icons-material';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToAlta, setUserToAlta] = useState(null);
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });

  useEffect(()=>{
    const cargarUsuarios = async ()=>{
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
    };
    cargarUsuarios();
  }, []);

  const handleAlta = (id)=>{
    setUserToAlta(id);
    setConfirmOpen(true);
  };

  const confirmarAlta = async ()=>{
    try{
      await altaUsuario(userToAlta);
      setUsuariosBaja(prev=>prev.filter(u=>u.id!==userToAlta));
      setSnackbar({ open:true, type:'success', message:'Usuario dado de alta correctamente' });
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false);
    setUserToAlta(null);
  };

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>
      {loading ? <CircularProgress /> :
        usuariosBaja.length===0 ? <Typography>No hay usuarios dados de baja.</Typography> :
        <UsuariosTable usuarios={usuariosBaja} onBaja={handleAlta} showModificar={false} />
      }

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar alta
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea dar de alta a este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={confirmarAlta}>Dar de Alta</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(prev=>({...prev, open:false}))} anchorOrigin={{vertical:'top', horizontal:'right'}}>
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
