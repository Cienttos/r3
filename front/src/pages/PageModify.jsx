import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useUsuarios } from '../hooks/useUsuarios';
import { Close } from '@mui/icons-material';

export default function ModificarUsuario() {
  const { buscarUsuario, modificarUsuario } = useUsuarios();
  const [form, setForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const cargar = async () => {
      const user = await buscarUsuario(id);
      setForm(user);
    };
    cargar();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    let val = value.trimStart();
    if(name==='nombre' || name==='apellido') val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'');
    setForm(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmarModificar = async () => {
    try {
      await modificarUsuario(id, form);
      setSnackbar({ open:true, type:'success', message:'Usuario modificado con éxito!' });
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false);
  };

  return (
    <Box sx={{ maxWidth:600, mx:'auto', mt:4 }}>
      <Typography variant="h5" gutterBottom>Modificar Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {['nombre','apellido','direccion','telefono','celular','fecha_nacimiento','email','contrasenia'].map(key=>(
            <TextField
              key={key}
              fullWidth
              type={key==='fecha_nacimiento' ? 'date' : key==='email' ? 'email' : key==='contrasenia' ? 'password' : 'text'}
              label={key.replace('_',' ').toUpperCase()}
              name={key}
              value={form[key] || ''}
              onChange={handleChange}
              InputLabelProps={key==='fecha_nacimiento' ? {shrink:true} : {}}
            />
          ))}
          <Button variant="contained" color="primary" type="submit">Guardar Cambios</Button>
        </Stack>
      </form>

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar modificación
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea guardar los cambios de este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={confirmarModificar}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(prev=>({...prev, open:false}))} anchorOrigin={{vertical:'top', horizontal:'right'}}>
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
