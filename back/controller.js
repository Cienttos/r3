import { connectToDatabase } from './db.js';

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
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

export async function altaUsuario(data) {
    let connection;
    try {
        const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia } = data;
        const fecha_alta = new Date().toISOString().slice(0, 19).replace('T', ' ');

        connection = await connectToDatabase();
        const [result] = await connection.execute(
            `INSERT INTO usuarios 
            (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, fecha_alta, activa) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, fecha_alta, 1]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error al dar de alta usuario:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

export async function modificarUsuario(id, data) {
    let connection;
    try {
        const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia } = data;

        connection = await connectToDatabase();
        const [result] = await connection.execute(
            `UPDATE usuarios 
            SET nombre = ?, apellido = ?, direccion = ?, telefono = ?, celular = ?, fecha_nacimiento = ?, email = ?, contrasenia = ? 
            WHERE id = ?`,
            [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, contrasenia, id]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

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
        console.error('Error al dar de baja usuario:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

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
        console.error('Error al eliminar usuario:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

export async function listarUsuarios() {
    let connection;
    try {
        connection = await connectToDatabase();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE activa = 1'
        );
        return rows;
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}
