import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button
} from '@mui/material';
import { Check } from '@mui/icons-material'; // Importamos el tick

export default function UsuariosTable({ usuarios, onBaja, onModificar, showModificar = true }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.nombre}</TableCell>
              <TableCell>{u.apellido}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.telefono}</TableCell>
              <TableCell align="right">
                {showModificar && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onModificar(u.id)}
                    sx={{ mr: 1 }}
                  >
                    Modificar
                  </Button>
                )}
                {onBaja && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Check />}
                    onClick={() => onBaja(u.id)}
                  >
                    Dar de alta
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
