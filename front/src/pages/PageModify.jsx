import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUsuarios } from '../hooks/useUsuarios';

export default function ModificarUsuario() {
  const { buscarUsuario, modificarUsuario, eliminarUsuario } = useUsuarios();
  const [form, setForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [eliminarOpen, setEliminarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get('id');

  useEffect(()=>{
    const cargar = async ()=>{
      const user = await buscarUsuario(id);
      setForm(user);
    };
    cargar();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    let val = value.trimStart();
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmarModificar = async () => {
    try{
      await modificarUsuario(id, form);
      setSnackbar({ open:true, type:'success', message:'Usuario modificado con éxito!' });
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: ' + err.message });
    }
    setConfirmOpen(false);
  };

  const handleEliminar = () => setEliminarOpen(true);
  const confirmarEliminar = async () => {
    try {
      await eliminarUsuario(id);
      setSnackbar({ open:true, type:'success', message:'Usuario eliminado correctamente' });
      navigate('/');
    } catch(err) {
      setSnackbar({ open:true, type:'error', message:'Error: ' + err.message });
    }
    setEliminarOpen(false);
  };

  return (
    <Box sx={{ mt:4, maxWidth:600, mx:'auto' }}>
      <Typography variant="h4" gutterBottom>Modificar Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {Object.keys(form).map(key=>(
            <TextField
              key={key}
              label={key.replace(/_/g,' ')}
              name={key}
              value={form[key] || ''}
              onChange={handleChange}
              fullWidth
            />
          ))}
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" color="primary">Guardar cambios</Button>
            <Button variant="outlined" color="error" onClick={handleEliminar}>Eliminar Usuario</Button>
          </Stack>
        </Stack>
      </form>

      {/* Confirmar modificación */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar modificación
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea guardar los cambios de este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={confirmarModificar}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmar eliminar */}
      <Dialog open={eliminarOpen} onClose={()=>setEliminarOpen(false)}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar eliminación
          <IconButton onClick={()=>setEliminarOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea eliminar este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setEliminarOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={confirmarEliminar}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={()=>setSnackbar(prev=>({...prev, open:false}))}
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
      >
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
