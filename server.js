const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors()); 

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
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
    connection.query('SELECT id, nombre, precio FROM Producto', (error, results) => {
        if (error) {
            console.error('Error al obtener los productos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(results);
    });
});


const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
    console.log('Servidor backend corriendo en el puerto', PORT);
});
