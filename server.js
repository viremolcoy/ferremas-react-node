const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(cors()); // Agregar este middleware para permitir solicitudes de cualquier origen

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nanito.10',
  database: 'ferremas'
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});


// Ruta para obtener los libros de la base de datos
app.get('/productos', (req, res) => {
  connection.query('SELECT id, nombre, precio FROM producto', (error, results) => {
    if (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    res.json(results);
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
