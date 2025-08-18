import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Stack } from '@mui/material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function CrearUsuario() {
  const { altaUsuario } = useUsuarios();
  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: ''
  });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setAlert({ type: '', message: '' });
    try {
      const res = await altaUsuario(form);
      if (res.id) {
        setAlert({ type: 'success', message: 'Usuario creado con éxito! ID: ' + res.id });
        setForm({ nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: '' });
      } else {
        setAlert({ type: 'error', message: 'No se pudo crear el usuario.' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Error al crear usuario: ' + err.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Crear Usuario</Typography>

      {alert.message && <Alert severity={alert.type} sx={{ mb: 2 }}>{alert.message}</Alert>}

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
          <Button variant="contained" type="submit">Crear Usuario</Button>
        </Stack>
      </form>
    </Box>
  );
}
