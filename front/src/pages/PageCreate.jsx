import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import { crearUsuario } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

function CrearUsuario() {
  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', telefono: '', celular: '', fecha_nacimiento: '', email: '', contrasenia: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await crearUsuario(form);
    navigate('/');
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Crear Usuario</Typography>
      <Stack spacing={2}>
        {Object.keys(form).map(key => (
          <TextField 
            key={key} 
            label={key.replace('_', ' ')} 
            name={key} 
            value={form[key]} 
            onChange={handleChange} 
            fullWidth 
          />
        ))}
        <Button variant="contained" onClick={handleSubmit}>Crear</Button>
      </Stack>
    </Container>
  );
}

export default CrearUsuario;
