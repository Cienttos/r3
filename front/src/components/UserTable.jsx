import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export default function UsuariosTable({ usuarios, onModificar, onBaja, onVer, modoAlta = false }) {
  if (!usuarios || usuarios.length === 0) return <p>No hay usuarios para mostrar.</p>;

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Nombre</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map(user => (
            <TableRow key={user.id} hover>
              <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Tooltip title="Ver">
                  <IconButton onClick={() => onVer(user)} sx={{ color: '#1976d2' }}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Modificar">
                  <IconButton onClick={() => onModificar(user)} sx={{ color: '#fbc02d' }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {modoAlta ? (
                  <Tooltip title="Dar de alta">
                    <IconButton onClick={() => onBaja(user.id)} sx={{ color: '#2e7d32' }}>
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Dar de baja">
                    <IconButton onClick={() => onBaja(user.id)} sx={{ color: '#d32f2f' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
