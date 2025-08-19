import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUsuarios } from '../hooks/useUsuarios';
import { TextField, Button, Box, Typography, Stack, Snackbar, Alert } from '@mui/material';

export default function ModificarUsuario() {
  const { obtenerUsuario, modificarUsuario } = useUsuarios();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });

  useEffect(() => {
    if (id) {
      obtenerUsuario(id).then(user => {
        setForm({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          direccion: user.direccion || '',
          telefono: user.telefono || '',
          celular: user.celular || '',
          fecha_nacimiento: user.fecha_nacimiento || '',
          email: user.email || '',
          contrasenia: user.contrasenia || ''
        });
      });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    let newValue = value.trimStart();

    if ((name === 'nombre' || name === 'apellido') && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(newValue)) {
      return;
    }

    setForm({ ...form, [name]: newValue });
  };

  const validarFormulario = () => {
    const textoValido = (val) => val && !/^\s*$/.test(val);
    const emailValido = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!textoValido(form.nombre) || !textoValido(form.apellido)) return 'Nombre y apellido no pueden ser inválidos';
    if (!textoValido(form.direccion)) return 'La dirección es obligatoria';
    if (!textoValido(form.telefono) || !textoValido(form.celular)) return 'Teléfono y celular no pueden ser inválidos';
    if (!form.fecha_nacimiento) return 'Debe ingresar una fecha de nacimiento';
    if (!emailValido(form.email)) return 'Debe ingresar un email válido';
    if (form.contrasenia.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) {
      setSnackbar({ open: true, type: 'error', message: error });
      return;
    }
    try {
      await modificarUsuario(id, form);
      setSnackbar({ open: true, type: 'success', message: 'Usuario modificado con éxito!' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setSnackbar({ open: true, type: 'error', message: 'Error al modificar usuario: ' + err.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Modificar Usuario</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {['nombre','apellido','direccion','telefono','celular','fecha_nacimiento','email','contrasenia'].map(key => (
            <TextField
              key={key}
              fullWidth
              type={key==='fecha_nacimiento' ? 'date' : key==='email' ? 'email' : key==='contrasenia' ? 'password' : 'text'}
              label={key.replace('_',' ').toUpperCase()}
              name={key}
              value={form[key]}
              onChange={handleChange}
              InputLabelProps={key==='fecha_nacimiento'?{shrink:true}:{}} 
            />
          ))}
          <Button variant="contained" type="submit">Guardar Cambios</Button>
        </Stack>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
