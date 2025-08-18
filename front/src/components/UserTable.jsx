import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UsuariosTable({ usuarios, onModificar, onBaja, onVer }) {
  if (!usuarios || usuarios.length === 0) return <p>No hay usuarios para mostrar.</p>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Celular</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.nombre}</TableCell>
              <TableCell>{user.apellido}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telefono}</TableCell>
              <TableCell>{user.celular}</TableCell>
              <TableCell>
                <Tooltip title="Ver">
                  <IconButton onClick={() => onVer(user)}><VisibilityIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Modificar">
                  <IconButton onClick={() => onModificar(user)}><EditIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Dar de baja">
                  <IconButton onClick={() => onBaja(user.id)}><DeleteIcon /></IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
