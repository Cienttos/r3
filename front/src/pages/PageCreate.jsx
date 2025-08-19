import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function CrearUsuario() {
  const { crearUsuario } = useUsuarios();
  const [form, setForm] = useState({
    nombre:'', apellido:'', direccion:'', telefono:'', celular:'', fecha_nacimiento:'', email:'', contrasenia:''
  });
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    let val = value.trimStart();
    if(name==='nombre' || name==='apellido') val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'');
    setForm({...form, [name]:val});
  };

  const validarFormulario = () => {
    const textoValido = val => val && !/^\s*$/.test(val);
    const emailValido = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if(!textoValido(form.nombre) || !textoValido(form.apellido)) return 'Nombre y apellido inválidos';
    if(!textoValido(form.direccion)) return 'Dirección es obligatoria';
    if(!textoValido(form.telefono) || !textoValido(form.celular)) return 'Teléfono y celular son obligatorios';
    if(!form.fecha_nacimiento) return 'Debe ingresar fecha de nacimiento';
    if(!emailValido(form.email)) return 'Email inválido';
    if(form.contrasenia.length < 6) return 'Contraseña mínima 6 caracteres';
    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const error = validarFormulario();
    if(error) return setSnackbar({ open:true, type:'error', message:error });
    setConfirmOpen(true);
  };

  const confirmarCrear = async () => {
    try{
      const res = await crearUsuario(form);
      if(res?.id){
        setSnackbar({ open:true, type:'success', message:'Usuario creado con éxito' });
        setForm({ nombre:'', apellido:'', direccion:'', telefono:'', celular:'', fecha_nacimiento:'', email:'', contrasenia:'' });
      } else {
        setSnackbar({ open:true, type:'error', message:'No se pudo crear el usuario' });
      }
    }catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false);
  };

  return (
    <Box sx={{ maxWidth:600, mx:'auto', mt:4 }}>
      <Typography variant="h5" gutterBottom>Crear Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {['nombre','apellido','direccion','telefono','celular','fecha_nacimiento','email','contrasenia'].map(key=>(
            <TextField
              key={key}
              fullWidth
              type={key==='fecha_nacimiento' ? 'date' : key==='email' ? 'email' : key==='contrasenia' ? 'password':'text'}
              label={key.replace('_',' ').toUpperCase()}
              name={key}
              value={form[key]}
              onChange={handleChange}
              InputLabelProps={key==='fecha_nacimiento'?{shrink:true}:{}}
            />
          ))}
          <Button variant="contained" color="primary" type="submit">Crear Usuario</Button>
        </Stack>
      </form>

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{borderRadius:2,p:2} }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar creación
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea crear este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color="primary" variant="contained" onClick={confirmarCrear}>Crear</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(prev=>({...prev, open:false}))} anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
