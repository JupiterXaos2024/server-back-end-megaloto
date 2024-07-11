const mysql = require('mysql2');

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: 'luzdeinnovacion.com', // El host de tu base de datos
  user: 't304329_Jupiter', // El usuario de tu base de datos
  password: '9]#nv4*dl#;X~ek35N', // La contraseña de tu base de datos
  database: 't304329_Loto' // El nombre de tu base de datos
});

module.exports = pool.promise();
