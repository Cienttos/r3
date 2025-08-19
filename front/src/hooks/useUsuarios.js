import { useState } from 'react';

const API_URL = 'http://localhost:3000';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const listarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuario/lista`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const listarUsuariosBaja = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuario/lista-baja`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuario = async (id) => {
    const res = await fetch(`${API_URL}/usuario/obtener?id=${id}`);
    return await res.json();
  };

  const crearUsuario = async (data) => {
    const res = await fetch(`${API_URL}/usuario/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  };

  const altaUsuario = async (id) => {
    const res = await fetch(`${API_URL}/usuario/alta`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await res.json();
  };

  const modificarUsuario = async (id, data) => {
    const res = await fetch(`${API_URL}/usuario/modificar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data }),
    });
    return await res.json();
  };

  const bajaUsuario = async (id) => {
    const res = await fetch(`${API_URL}/usuario/baja`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await res.json();
  };

  return {
    usuarios,
    loading,
    listarUsuarios,
    listarUsuariosBaja,
    obtenerUsuario,
    crearUsuario,
    altaUsuario,
    modificarUsuario,
    bajaUsuario,
  };
}
