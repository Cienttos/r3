import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, TextField, Button, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';

export default function ModificarUsuario() {
  const { obtenerUsuario, modificarUsuario, bajaUsuario } = useUsuarios();
  const [form, setForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'modificar' o 'baja'
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get('id');

  useEffect(()=>{
    const cargar = async ()=>{
      const user = await obtenerUsuario(id);
      setForm(user);
    };
    cargar();
  },[id, obtenerUsuario]);

  const handleChange = e => {
    const { name, value } = e.target;
    let val = value.trimStart();
    if(name==='nombre' || name==='apellido') val = val.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g,'');
    setForm({...form, [name]:val});
  };

  const handleAction = type => {
    setActionType(type);
    setConfirmOpen(true);
  };

  const confirmarAction = async () => {
    try{
      if(actionType==='modificar'){
        await modificarUsuario(id, form);
        setSnackbar({ open:true, type:'success', message:'Usuario modificado con éxito' });
      } else if(actionType==='baja'){
        await bajaUsuario(id);
        setSnackbar({ open:true, type:'success', message:'Usuario dado de baja' });
        navigate('/'); // volver a lista principal
      }
    }catch(err){
      setSnackbar({ open:true, type:'error', message:'Error: '+err.message });
    }
    setConfirmOpen(false);
    setActionType('');
  };

  return (
    <Box sx={{ maxWidth:600, mx:'auto', mt:4 }}>
      <Typography variant="h5" gutterBottom>Modificar Usuario</Typography>
      <form>
        <Stack spacing={2}>
          {['id','nombre','apellido','direccion','telefono','celular','fecha_nacimiento','email','contrasenia'].map(key=>(
            <TextField
              key={key}
              fullWidth
              type={key==='fecha_nacimiento'?'date':key==='email'?'email':key==='contrasenia'?'password':key==='id'?'number':'text'}
              label={key.replace('_',' ').toUpperCase()}
              name={key}
              value={form[key]||''}
              onChange={handleChange}
              InputLabelProps={key==='fecha_nacimiento'?{shrink:true}:{}}
            />
          ))}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={()=>handleAction('modificar')}>Guardar Cambios</Button>
            <Button variant="contained" color="error" onClick={()=>handleAction('baja')}>Dar de Baja</Button>
          </Stack>
        </Stack>
      </form>

      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{borderRadius:2,p:2} }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar {actionType==='modificar'?'modificación':'baja'}
          <IconButton onClick={()=>setConfirmOpen(false)} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          {actionType==='modificar'?'¿Desea guardar los cambios?':'¿Desea dar de baja a este usuario?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color={actionType==='modificar'?'primary':'error'} variant="contained" onClick={confirmarAction}>
            {actionType==='modificar'?'Guardar':'Dar de Baja'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar(prev=>({...prev, open:false}))} anchorOrigin={{ vertical:'bottom', horizontal:'center' }}>
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
