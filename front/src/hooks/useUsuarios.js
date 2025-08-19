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

  const buscarUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/obtener?id=${id}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const crearUsuario = async (data) => {
    try {
      const res = await fetch(`${API_URL}/usuario/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const altaUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/alta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const modificarUsuario = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/usuario/modificar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data }),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const bajaUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/baja`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const res = await fetch(`${API_URL}/usuario/eliminar?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    usuarios,
    loading,
    listarUsuarios,
    listarUsuariosBaja,
    buscarUsuario,
    crearUsuario,
    altaUsuario,
    modificarUsuario,
    bajaUsuario,
    eliminarUsuario,
  };
}
