import { connectToDatabase } from './db.js';

// Obtener un usuario por ID
export async function obtenerUsuario(id) {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE id = ?',
            [id]
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw new Error('No se pudo obtener el usuario');
    } finally {
        if (connection) await connection.end();
    }
}

export async function crearUsuario(data) {
    let connection;
    try {
        const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia } = data;
        const fecha_alta = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection = await connectToDatabase();

        // Verificar si ya existe un usuario con ese email
        const [existing] = await connection.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            throw new Error('Ya existe un usuario con ese email');
        }

        const [result] = await connection.execute(
            `INSERT INTO usuarios 
            (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, fecha_alta, activa) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, fecha_alta, 1]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

export async function altaUsuario(id) {
    let connection;
    try {
        const fecha_alta = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection = await connectToDatabase();
        const [result] = await connection.execute(
            `UPDATE usuarios 
            SET activa = 1, fecha_alta = ?, fecha_baja = NULL
            WHERE id = ?`,
            [fecha_alta, id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al dar de alta usuario:', error.message);
        throw new Error('No se pudo dar de alta al usuario');
    } finally {
        if (connection) await connection.end();
    }
}

// Modificar usuario
export async function modificarUsuario(id, data) {
    let connection;
    try {
        const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia } = data;

        connection = await connectToDatabase();

        // Verificar si el email ya existe en otro usuario
        const [existing] = await connection.execute(
            'SELECT id FROM usuarios WHERE email = ? AND id != ?',
            [email, id]
        );
        if (existing.length > 0) {
            throw new Error('El email ya está en uso por otro usuario');
        }

        const [result] = await connection.execute(
            `UPDATE usuarios 
            SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, celular = ?, fecha_nacimiento = ?, email = ?, contrasenia = ? 
            WHERE id = ?`,
            [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al modificar usuario:', error.message);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

// Dar de baja usuario
export async function bajaUsuario(id) {
    let connection;
    try {
        const fecha_baja = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection = await connectToDatabase();
        const [result] = await connection.execute(
            `UPDATE usuarios 
            SET activa = 0, fecha_baja = ? 
            WHERE id = ?`,
            [fecha_baja, id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al dar de baja usuario:', error.message);
        throw new Error('No se pudo dar de baja al usuario');
    } finally {
        if (connection) await connection.end();
    }
}

// Eliminar usuario
export async function eliminarUsuario(id) {
    let connection;
    try {
        connection = await connectToDatabase();
        const [result] = await connection.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        throw new Error('No se pudo eliminar al usuario');
    } finally {
        if (connection) await connection.end();
    }
}

// Listar todos los usuarios activos
export async function listarUsuarios() {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE activa = 1'
        );
        return rows;
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        throw new Error('No se pudieron listar los usuarios');
    } finally {
        if (connection) await connection.end();
    }
}

export async function listarUsuariosBaja() {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE activa = 0'
        );
        return rows;
    } catch (error) {
        console.error('Error al listar usuarios dados de baja:', error.message);
        throw new Error('No se pudieron listar los usuarios dados de baja');
    } finally {
        if (connection) await connection.end();
    }
}

