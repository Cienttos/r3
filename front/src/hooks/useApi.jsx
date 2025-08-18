const API_URL = 'http://localhost:3000';

export const api = {
  listarUsuarios: async () => {
    const res = await fetch(`${API_URL}/usuario/lista`);
    return await res.json();
  },

  obtenerUsuario: async (id) => {
    const res = await fetch(`${API_URL}/usuario/obtener?id=${id}`);
    return await res.json();
  },

  altaUsuario: async (data) => {
    const res = await fetch(`${API_URL}/usuario/alta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  modificarUsuario: async (id, data) => {
    const res = await fetch(`${API_URL}/usuario/modificar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, data }),
    });
    return await res.json();
  },

  bajaUsuario: async (id) => {
    const res = await fetch(`${API_URL}/usuario/baja?id=${id}`, {
      method: 'PATCH',
    });
    return await res.json();
  },

  eliminarUsuario: async (id) => {
    const res = await fetch(`${API_URL}/usuario/eliminar?id=${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },
};
