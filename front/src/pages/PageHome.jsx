import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Grid, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { Person, Email, Home as HomeIcon, Phone, PhoneAndroid, CalendarMonth, Lock, Close, Edit, Delete, Visibility } from '@mui/icons-material';
import { useUsuarios } from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { usuarios, listarUsuarios, bajaUsuario, loading } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open:false, type:'', message:'' });
  const navigate = useNavigate();

  useEffect(() => { listarUsuarios(); }, []);

  const handleBaja = (id) => { setUserToDelete(id); setConfirmOpen(true); };
  const handleVer = (user) => { setSelectedUser(user); setModalOpen(true); };

  const confirmarBaja = async () => {
    try {
      await bajaUsuario(userToDelete);
      await listarUsuarios();
      setSnackbar({ open:true, type:'success', message:'Usuario dado de baja correctamente' });
    } catch(err){
      setSnackbar({ open:true, type:'error', message:'Error al dar de baja: '+err.message });
    }
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const userFields = (user) => [
    { icon:<Person color="primary"/>, label:'Nombre', value:`${user.nombre} ${user.apellido}` },
    { icon:<HomeIcon color="secondary"/>, label:'Dirección', value:user.direccion },
    { icon:<Phone color="success"/>, label:'Teléfono', value:user.telefono },
    { icon:<PhoneAndroid color="success"/>, label:'Celular', value:user.celular },
    { icon:<CalendarMonth color="action"/>, label:'Nacimiento', value:user.fecha_nacimiento },
    { icon:<Email color="error"/>, label:'Email', value:user.email },
    { icon:<Lock color="warning"/>, label:'Contraseña', value:'••••••••' }
  ];

  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h4" gutterBottom>Lista de Usuarios</Typography>

      {loading ? <CircularProgress /> :
        usuarios.length===0 ? <Typography>No hay usuarios para mostrar.</Typography> :

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
              {usuarios.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Tooltip title="Ver">
                      <IconButton onClick={()=>handleVer(user)}><Visibility /></IconButton>
                    </Tooltip>
                    <Tooltip title="Modificar">
                      <IconButton onClick={()=>navigate(`/modificar?id=${user.id}`)}><Edit color="primary"/></IconButton>
                    </Tooltip>
                    <Tooltip title="Dar de baja">
                      <IconButton onClick={()=>handleBaja(user.id)}><Delete color="error"/></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* Modal ver detalles */}
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Detalles del Usuario
          <IconButton size="small" onClick={()=>setModalOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedUser && userFields(selectedUser).map((item, idx)=>(
              <Grid item xs={12} key={idx}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                  {item.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight:500 }}>{item.label}:</Typography>
                  <Typography variant="body1">{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal confirmar baja */}
      <Dialog open={confirmOpen} onClose={()=>setConfirmOpen(false)} PaperProps={{ sx:{ borderRadius:2,p:2 } }}>
        <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          Confirmar baja
          <IconButton size="small" onClick={()=>setConfirmOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>¿Desea dar de baja a este usuario?</DialogContent>
        <DialogActions>
          <Button onClick={()=>setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmarBaja}>Dar de Baja</Button>
        </DialogActions>
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
