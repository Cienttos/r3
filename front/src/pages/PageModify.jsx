import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUsuarios } from '../hooks/useUsuarios';
import { TextField, Button, Box, Typography, Alert, Stack } from '@mui/material';

export default function ModificarUsuario() {
  const { obtenerUsuario, modificarUsuario } = useUsuarios();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: ''
  });
  const [alert, setAlert] = useState({ type:'', message:'' });

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

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setAlert({ type:'', message:'' });
    try {
      await modificarUsuario(id, form);
      setAlert({ type:'success', message:'Usuario modificado con éxito!' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setAlert({ type:'error', message:'Error al modificar usuario: ' + err.message });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>Modificar Usuario</Typography>

      {alert.message && <Alert severity={alert.type} sx={{ mb:2 }}>{alert.message}</Alert>}

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
    </Box>
  );
}
