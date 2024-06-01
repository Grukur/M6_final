import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const __dirname = path.resolve();
const Public = path.join(__dirname, 'public');

const app = express();
const port = 3005;

app.use(cors());

app.listen(port, ()=> {
    console.log(`Servidor corriendo en el puerto ${port}`);
})

app.get('/', (req, res) => {
    try {
        const indexHTML = path.join(Public, 'index.html');
        res.sendFile(indexHTML);
    } catch (error) {
        console.log(error)
    }
})

app.get('/deportes', async(req, res) => {
    try {
        const data = path.join(Public, 'deportes.json');
        res.sendFile(data);
    } catch (error) {
        console.log(error)
    }
})

app.get('/agregar', async(req, res) =>{
    try {
        const { nombre, precio } = req.query;
        const data = path.join(Public, 'deportes.json');
        const dataJSON = await fs.readFile(data, 'utf-8')
        const { deportes } = await JSON.parse(dataJSON);
        deportes.push({nombre, precio});
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Exito')
    } catch (error) {
        console.log(error);
    }
});

app.get('/editar', async (req, res) => {
    try {
        const { nombre, precio } = req.query;
        const data = path.join(Public, 'deportes.json');
        const dataJSON = await fs.readFile(data, 'utf-8')
        let { deportes } = await JSON.parse(dataJSON);
        deportes = deportes.map((item) => {
            if (item.nombre === nombre) {
                item.precio = precio;
            }
            return item;
        })
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Exito')

    } catch (error) {
        console.log(error)
    }
})


app.get('/eliminar', async (req, res) => {
    try {
        const { nombre } = req.query;
        const data = path.join(Public, 'deportes.json');
        const dataJSON = await fs.readFile(data, 'utf-8')
        let { deportes } = await JSON.parse(dataJSON);
        deportes = deportes.filter((item) => item.nombre !== nombre)
        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Exito')

    } catch (error) {
        console.log(error)
    }
})