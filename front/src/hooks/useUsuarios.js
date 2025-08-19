import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuario/lista`);
      if (!res.ok) throw new Error('Error al listar usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/obtener?id=${id}`);
      if (!res.ok) throw new Error('Usuario no encontrado');
      return await res.json();
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  const altaUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/alta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al dar de alta usuario');
      return await res.json();
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  const modificarUsuario = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/usuario/modificar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data }),
      });
      if (!res.ok) throw new Error('Error al modificar usuario');
      return await res.json();
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  const bajaUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/baja`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al dar de baja usuario');
      return await res.json();
    } catch (err) {
      console.error(err.message);
      return null;
    }
  };

  return {
    usuarios,
    loading,
    listarUsuarios,
    obtenerUsuario,
    altaUsuario,
    modificarUsuario,
    bajaUsuario,
  };
}
