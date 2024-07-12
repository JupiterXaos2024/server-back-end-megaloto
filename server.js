const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const numeros = require('./components/numeros');
const cartones = require('./components/cartones')


//const mysql = require('./components/mysql');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Cambia esto al dominio permitido
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json()); // Para analizar cuerpos JSON


// Rutas
app.use('/numeros', numeros(io));
app.use('/cartones', cartones(io));

//app.use('/mysql', mysql);

// Inicialización del servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
