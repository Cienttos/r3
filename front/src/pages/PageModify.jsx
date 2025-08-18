import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import { obtenerUsuario, modificarUsuario } from '../hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';

function ModificarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    const cargarUsuario = async () => {
      const data = await obtenerUsuario(id);
      setForm(data);
    };
    cargarUsuario();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await modificarUsuario(id, form);
    navigate('/');
  };

  if (!form.id) return <Typography>Cargando...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Modificar Usuario</Typography>
      <Stack spacing={2}>
        {Object.keys(form).map(key => 
          key !== 'id' && key !== 'fecha_alta' && key !== 'fecha_baja' ? (
            <TextField 
              key={key} 
              label={key.replace('_', ' ')} 
              name={key} 
              value={form[key]} 
              onChange={handleChange} 
              fullWidth 
            />
          ) : null
        )}
        <Button variant="contained" onClick={handleSubmit}>Guardar Cambios</Button>
      </Stack>
    </Container>
  );
}

export default ModificarUsuario;
