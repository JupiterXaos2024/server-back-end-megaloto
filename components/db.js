const mysql = require('mysql2');

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host:'193.84.177.252',
  database:'t304329_Loto',
  user:'t304329_Jupiter',
  password:'9]#nv4*dl#;X~ek35N'
});

module.exports = pool.promise();
