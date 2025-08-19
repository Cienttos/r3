import cors from 'cors';
import express from 'express';
import { obtenerUsuario, altaUsuario, bajaUsuario, modificarUsuario, listarUsuarios, eliminarUsuario, crearUsuario } from './controller.js'; 

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Servidor corriendo');
});

app.post("/usuario/crear", async (req,res) => {
    try{
        const data = req.body;
        const id = await crearUsuario(data)
        res.status(201).json({ message: 'Usuario agregado exitosamente', id });
    }catch(error){
        res.status(500).json({ error: 'Error al agregar usuario' });
    }
})

app.patch("/usuario/alta", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await altaUsuario(id);
        if (result) {
            res.status(200).json({ message: 'Usuario dado de alta exitosamente' });
        }
        else {
            res.status(404).json({ message: 'Usuario no encontrado o ya activo' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error al dar de alta usuario' });
    }
});


app.get("/usuario/obtener", async (req, res)=>{
    try {
        const { id } = req.query;
        const usuario = await obtenerUsuario(id);
        if (usuario.length > 0) {
            res.status(200).json(usuario[0]);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
})

app.patch("/usuario/modificar", async (req, res) => {
    try {
        const { id, data } = req.body;
        const result = await modificarUsuario(id, data);
        if (result) {
            res.status(200).json({ message: 'Usuario modificado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado o no modificado' });
        }
    }catch (error) {
        res.status(500).json({ error: 'Error al modificar usuario' });
    }
});

app.patch("/usuario/baja", async (req, res) => {
    const { id } = req.body;
    try {
        const result = await bajaUsuario(id);
        if (result) {
            res.status(200).json({ message: 'Usuario dado de baja exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado o ya dado de baja' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al dar de baja usuario' });
    }
});

app.get("/usuario/lista", async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar usuarios' });
    }
});

app.delete("/usuario/eliminar", async (req, res) => {
    const { id } = req.query;
    try {
        const result = await eliminarUsuario(id);
        if (result) {
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

app.listen(3000, async () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
