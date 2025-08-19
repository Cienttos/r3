import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, Grid, Box } from '@mui/material';
import { Check, Close, Visibility, Edit } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';

export default function UsuariosBaja() {
  const { listarUsuariosBaja, altaUsuario, loading } = useUsuarios();
  const [usuariosBaja, setUsuariosBaja] = useState([]);
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
    })();
  }, []);

  const handleAlta = async (id) => {
    try {
      await altaUsuario(id);
      const data = await listarUsuariosBaja();
      setUsuariosBaja(data);
      setSnackbar({ open:true, type:'success', message:'Usuario dado de alta correctamente' });
    } catch (err) {
      setSnackbar({ open:true, type:'error', message:'Error al dar de alta: '+err.message });
    }
  };

  const handleVer = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const userFields = (user) => [
    { label:'Nombre', value:`${user.nombre} ${user.apellido}` },
    { label:'Dirección', value:user.direccion },
    { label:'Teléfono', value:user.telefono },
    { label:'Celular', value:user.celular },
    { label:'Fecha Nacimiento', value:user.fecha_nacimiento },
    { label:'Email', value:user.email },
    { label:'Contraseña', value:'••••••••' },
  ];

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Usuarios Dados de Baja</Typography>

      {loading ? <CircularProgress /> :
        usuariosBaja.length===0 ? <Typography>No hay usuarios dados de baja.</Typography> :

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosBaja.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Ver">
                      <IconButton onClick={()=>handleVer(user)}><Visibility /></IconButton>
                    </Tooltip>
                    <Tooltip title="Modificar">
                      <IconButton onClick={()=>navigate(`/modificar?id=${user.id}`)}><Edit color="primary" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Dar de alta">
                      <IconButton onClick={()=>handleAlta(user.id)}><Check color="success" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* Modal Ver Usuario */}
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Detalles del Usuario
          <IconButton size="small" onClick={()=>setModalOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedUser && userFields(selectedUser).map((item, idx)=>(
              <Grid item xs={12} key={idx}>
                <Box sx={{ display:'flex', gap:1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight:500 }}>{item.label}:</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Snackbar abajo centro */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={()=>setSnackbar(prev=>({...prev, open:false}))}
        anchorOrigin={{ vertical:'bottom', horizontal:'center' }}
      >
        <Alert severity={snackbar.type} sx={{ width:'100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
