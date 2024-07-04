const express = require('express');
const router = express.Router();
const cron = require('node-cron');

// Array para almacenar los cartones
const Cartones = [];
let Ganador = false; // Inicializado como falso

// Función para generar un cartón
function generarCarton() {
    const agregarNumeros = (min, max, cantidad) => {
        const numeros = new Set();
        while (numeros.size < cantidad) {
            const numero = Math.floor(Math.random() * (max - min + 1)) + min;
            numeros.add(numero);
        }
        return Array.from(numeros);
    };

    const columnas = [
        agregarNumeros(0, 19, 5),
        agregarNumeros(20, 39, 5),
        agregarNumeros(40, 59, 5),
        agregarNumeros(60, 79, 5),
        agregarNumeros(80, 99, 5),
    ];

    const carton = new Set();
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            carton.add(columnas[j][i]);
        }
    }

    return Array.from(carton);
}

// Función para generar cartones únicos
function generarCartonesUnicos() {
    const cartonesGenerados = new Set();
    while (cartonesGenerados.size < 100) {
        const nuevoCarton = generarCarton();
        cartonesGenerados.add(JSON.stringify(nuevoCarton));
    }
    const cartonesArray = Array.from(cartonesGenerados).map(carton => JSON.parse(carton));
    Cartones.length = 0; // Limpiar el array original antes de agregar los nuevos cartones
    Cartones.push(...cartonesArray);
}

module.exports = (io) => {
    // Generar cartones al cargar el servidor por primera vez
    generarCartonesUnicos();

    // Programar la tarea para que se ejecute cada hora a los **:30 minutos
    cron.schedule('30 * * * *', () => {
        console.log('Running task at the 30th minute of every hour');
        generarCartonesUnicos();
        io.emit('newCartones', Cartones);
    });

    router.get('/generar', (req, res) => {
        generarCartonesUnicos();
        io.emit('newCartones', Cartones);
        res.json(Cartones);
    });
    
    // Socket.io para recibir órdenes del front-end
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
        
        // Enviar el array actual a un nuevo cliente
        socket.emit('initCartones', Cartones);
        socket.emit('ganador', Ganador);

        socket.on('GanadorFron', () => {
            Ganador = true;
            io.emit('ganador', Ganador);
        });

        socket.on('generateCartones', () => {
            generarCartonesUnicos();
            io.emit('newCartones', Cartones);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return router;
};
