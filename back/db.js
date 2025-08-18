import mysql2 from 'mysql2/promise';

export async function connectToDatabase() {
    let connection;
    try {
        connection = await mysql2.createConnection({
            host: "localhost",
            user:  "root",
            password: "",
            database: "r3"  // asegúrate que la BD existe antes de conectarte
        });
        console.log("Conexión exitosa a la base de datos");
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
    return connection;
}
