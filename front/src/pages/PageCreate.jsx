import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function CrearUsuario() {
  const { crearUsuario } = useUsuarios();
  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    let val = value.trimStart();
    if (name === 'nombre' || name === 'apellido') {
      val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
    }
    setForm({ ...form, [name]: val });
  };

  const validarFormulario = () => {
    const textoValido = (val) => val && !/^\s*$/.test(val);
    const emailValido = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!textoValido(form.nombre) || !textoValido(form.apellido)) return 'Nombre y apellido no pueden ser vacíos ni contener números';
    if (!textoValido(form.direccion)) return 'La dirección es obligatoria';
    if (!textoValido(form.telefono) || !textoValido(form.celular)) return 'Teléfono y celular son obligatorios';
    if (!form.fecha_nacimiento) return 'Debe ingresar una fecha de nacimiento';
    if (!emailValido(form.email)) return 'Debe ingresar un email válido';
    if (form.contrasenia.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) {
      setSnackbar({ open: true, type: 'error', message: error });
      return;
    }
    setConfirmOpen(true);
  };

  const confirmarCrear = async () => {
    try {
      const res = await crearUsuario(form);
      if (res?.id) {
        setSnackbar({ open: true, type: 'success', message: 'Usuario creado con éxito!' });
        setForm({ nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: '' });
      } else {
        setSnackbar({ open: true, type: 'error', message: 'No se pudo crear el usuario' });
      }
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al crear usuario: ' + err.message });
    }
    setConfirmOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Crear Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {['nombre','apellido','direccion','telefono','celular','fecha_nacimiento','email','contrasenia'].map(key => (
            <TextField
              key={key}
              fullWidth
              type={key === 'fecha_nacimiento' ? 'date' : key === 'email' ? 'email' : key === 'contrasenia' ? 'password' : 'text'}
              label={key.replace('_',' ').toUpperCase()}
              name={key}
              value={form[key]}
              onChange={handleChange}
              InputLabelProps={key === 'fecha_nacimiento' ? { shrink: true } : {}}
            />
          ))}
          <Button variant="contained" color="primary" type="submit">Crear Usuario</Button>
        </Stack>
      </form>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar creación</DialogTitle>
        <DialogContent>¿Desea crear este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="primary" onClick={confirmarCrear}>Crear</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
