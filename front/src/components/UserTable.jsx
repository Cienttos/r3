import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserTable({ usuarios, onBaja }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Apellido</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {usuarios.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.nombre}</TableCell>
            <TableCell>{user.apellido}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.telefono}</TableCell>
            <TableCell>
              <Button 
                variant="outlined" 
                sx={{ mr: 1 }} 
                onClick={() => navigate(`/modificar/${user.id}`)}>
                Modificar
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => onBaja(user.id)}>
                Baja
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default UserTable;
