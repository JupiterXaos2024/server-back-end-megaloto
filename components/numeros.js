const express = require('express');
const router = express.Router();
const cron = require('node-cron');

// Array para almacenar los números únicos
const numbersArray = ['--'];
let intervalId = null;

// Función para generar un número único
function generateUniqueNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 100);
    } while (numbersArray.includes(number));
    numbersArray.push(number);
    return number;
}

// Función para iniciar la generación automática
let delay = 1000; // Inicializamos el delay en 1000 ms
function startAutoGeneration(io) {
    generateUniqueNumber();
    io.emit('newNumber', numbersArray);
    
    // Aumentamos el delay en 10 ms después de cada ejecución
    delay += 10;

    // Limpiamos el intervalo actual y configuramos uno nuevo con el delay actualizado
    intervalId = setTimeout(() => {
        startAutoGeneration(io);
    }, delay);
}

// Función para detener la generación automática de numeros
function stopAutoGeneration() {
    if (intervalId) {
        clearTimeout(intervalId);
        intervalId = null;
        delay = 1000;
        console.log('Auto generation stopped');
    }
}



module.exports = (io) => {
    // Programar la tarea para que se ejecute cada hora exacta
    cron.schedule('0 0 * * * *', () => {
        console.log('Running task every hour');
        startAutoGeneration(io);
    });
    router.get('/', (req, res) => {
        const newNumber = generateUniqueNumber();
        io.emit('newNumber', numbersArray);
        res.json({ newNumber, numbersArray });
    });

    // Socket.io para recibir órdenes del front-end
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
        // Enviar el array actual a un nuevo cliente
        socket.emit('initNumbers', numbersArray);

        socket.on('generateNumber', () => {
            const newNumber = generateUniqueNumber();
            io.emit('newNumber', numbersArray);
        });

        socket.on('resetNumbers', () => {
            numbersArray.splice(0, numbersArray.length);
            numbersArray.push('--');
            io.emit('newNumber', numbersArray);
        });

        socket.on('startAutoGeneration', () => {
            startAutoGeneration(io);
        });

        socket.on('stopAutoGeneration', stopAutoGeneration);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return router;
};
